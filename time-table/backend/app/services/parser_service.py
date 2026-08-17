import io
import re
import pandas as pd
from typing import Dict, List, Any, Tuple, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from app.models.course import Course
from app.models.section import Section
from app.models.time_slot import TimeSlot
from app.models.ingestion_log import IngestionLog

class ExcelParserService:
    DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

    @staticmethod
    def normalize_time(time_str: str) -> Optional[Tuple[str, str]]:
        if not time_str or pd.isna(time_str):
            return None
        
        clean = str(time_str).strip().replace("to", "-").replace("–", "-")
        parts = clean.split("-")
        if len(parts) != 2:
            return None
        
        def parse_single_time(t: str) -> Optional[str]:
            t = t.strip()
            match_12 = re.match(r'^(\d{1,2}):(\d{2})\s*(AM|PM|am|pm)$', t)
            if match_12:
                hr, mn, period = int(match_12.group(1)), int(match_12.group(2)), match_12.group(3).upper()
                if period == "PM" and hr < 12:
                    hr += 12
                elif period == "AM" and hr == 12:
                    hr = 0
                return f"{hr:02d}:{mn:02d}"
            
            match_24 = re.match(r'^(\d{1,2}):(\d{2})$', t)
            if match_24:
                hr, mn = int(match_24.group(1)), int(match_24.group(2))
                if 0 <= hr <= 23 and 0 <= mn <= 59:
                    return f"{hr:02d}:{mn:02d}"
            return None

        start = parse_single_time(parts[0])
        end = parse_single_time(parts[1])
        if start and end:
            return (start, end)
        return None

    @classmethod
    async def parse_and_ingest_excel(
        cls,
        file_bytes: bytes,
        filename: str,
        db: AsyncSession,
        clear_existing: bool = True
    ) -> IngestionLog:
        total_rows = 0
        parsed_count = 0
        error_rows: List[Dict[str, Any]] = []

        try:
            excel_file = pd.ExcelFile(io.BytesIO(file_bytes), engine="openpyxl")
        except Exception as e:
            log = IngestionLog(
                filename=filename,
                status="FAILED",
                total_rows=0,
                parsed_sections=0,
                error_count=1,
                unparsed_errors=[{"sheet": "Global", "row_number": 0, "reason": f"Corrupt file: {str(e)}", "raw_data": {}}]
            )
            db.add(log)
            await db.commit()
            await db.refresh(log)
            return log

        if clear_existing:
            # Wipe previous catalog tables for clean semester updates
            await db.execute(delete(TimeSlot))
            await db.execute(delete(Section))
            await db.execute(delete(Course))
            await db.flush()

        course_cache: Dict[str, Course] = {}
        section_cache: Dict[Tuple[str, str], Section] = {}

        for sheet_name in excel_file.sheet_names:
            df_raw = pd.read_excel(excel_file, sheet_name=sheet_name, header=None)
            if df_raw.empty:
                continue

            header_idx = 0
            for idx, row in df_raw.iterrows():
                row_str = " ".join([str(val) for val in row.values if pd.notna(val)]).lower()
                if any(k in row_str for k in ["course", "code", "section", "instructor", "time"]):
                    header_idx = idx
                    break

            df = pd.read_excel(excel_file, sheet_name=sheet_name, header=header_idx)

            col_map = {}
            for col in df.columns:
                c_clean = str(col).strip().lower()
                if "code" in c_clean or "course code" in c_clean or c_clean == "course":
                    col_map[col] = "course_code"
                elif "title" in c_clean or "course title" in c_clean or "name" in c_clean:
                    col_map[col] = "title"
                elif "sec" in c_clean:
                    col_map[col] = "section"
                elif "inst" in c_clean or "prof" in c_clean or "teacher" in c_clean:
                    col_map[col] = "instructor"
                elif "dept" in c_clean or "department" in c_clean:
                    col_map[col] = "department"
                elif "time" in c_clean or "slot" in c_clean:
                    col_map[col] = "time"
                elif "room" in c_clean or "hall" in c_clean:
                    col_map[col] = "room"
                elif "day" in c_clean:
                    col_map[col] = "day"

            df = df.rename(columns=col_map)

            sheet_day = next((d for d in cls.DAYS_OF_WEEK if d.lower() in sheet_name.lower()), "Monday")

            for r_idx, row in df.iterrows():
                total_rows += 1
                row_dict = {str(k): (str(v) if pd.notna(v) else "") for k, v in row.to_dict().items()}

                course_code = str(row.get("course_code", "")).strip().upper()
                if not course_code or course_code.lower() in ["nan", "none", "course code", "code"]:
                    error_rows.append({
                        "sheet": sheet_name,
                        "row_number": int(r_idx) + 1,
                        "reason": "Missing or invalid Course Code",
                        "raw_data": row_dict
                    })
                    continue

                title = str(row.get("title", f"{course_code} Course")).strip()
                if title.lower() in ["nan", "none"]:
                    title = f"{course_code} Course"

                section_label = str(row.get("section", "SEC-01")).strip().upper()
                if not section_label or section_label.lower() in ["nan", "none"]:
                    section_label = "SEC-01"

                instructor = str(row.get("instructor", "Staff")).strip()
                if instructor.lower() in ["nan", "none"]:
                    instructor = "Staff"

                dept = str(row.get("department", "General")).strip()
                if dept.lower() in ["nan", "none"]:
                    dept = "General"

                time_raw = str(row.get("time", "")).strip()
                parsed_time = cls.normalize_time(time_raw)
                if not parsed_time:
                    error_rows.append({
                        "sheet": sheet_name,
                        "row_number": int(r_idx) + 1,
                        "reason": f"Invalid or unparseable time format: '{time_raw}'",
                        "raw_data": row_dict
                    })
                    continue

                row_day = str(row.get("day", sheet_day)).strip().capitalize()
                if row_day not in cls.DAYS_OF_WEEK:
                    row_day = sheet_day

                room = str(row.get("room", "TBD")).strip()

                if course_code not in course_cache:
                    new_course = Course(code=course_code, title=title, department=dept)
                    db.add(new_course)
                    await db.flush()
                    course_cache[course_code] = new_course
                course_obj = course_cache[course_code]

                sec_key = (course_code, section_label)
                if sec_key not in section_cache:
                    new_section = Section(course_id=course_obj.id, section_label=section_label, instructor=instructor)
                    db.add(new_section)
                    await db.flush()
                    section_cache[sec_key] = new_section
                section_obj = section_cache[sec_key]

                time_slot = TimeSlot(
                    section_id=section_obj.id,
                    day=row_day,
                    start_time=parsed_time[0],
                    end_time=parsed_time[1],
                    room=room
                )
                db.add(time_slot)
                parsed_count += 1

        await db.commit()

        status = "SUCCESS" if len(error_rows) == 0 else ("COMPLETED_WITH_WARNINGS" if parsed_count > 0 else "FAILED")

        log = IngestionLog(
            filename=filename,
            status=status,
            total_rows=total_rows,
            parsed_sections=parsed_count,
            error_count=len(error_rows),
            unparsed_errors=error_rows[:100]
        )
        db.add(log)
        await db.commit()
        await db.refresh(log)
        return log
