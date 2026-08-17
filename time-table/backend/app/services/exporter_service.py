from typing import List
from datetime import datetime, time, timedelta
from app.models.section import Section
from app.models.time_slot import TimeSlot

DAY_TO_ICS_BYDAY = {
    "monday": "MO",
    "tuesday": "TU",
    "wednesday": "WE",
    "thursday": "TH",
    "friday": "FR",
    "saturday": "SA",
    "sunday": "SU"
}

# Next upcoming reference start date (e.g. Sep 1, 2026 for Fall semester)
SEMESTER_START_DATE = datetime(2026, 9, 1)

def get_next_weekday_date(start_date: datetime, target_day_name: str) -> datetime:
    days_of_week = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
    target_idx = days_of_week.index(target_day_name.lower())
    current_idx = start_date.weekday()
    delta = (target_idx - current_idx) % 7
    return start_date + timedelta(days=delta)

class ExporterService:

    @staticmethod
    def generate_ics_content(sections: List[Section], schedule_name: str = "Cursus Timetable") -> str:
        lines = [
            "BEGIN:VCALENDAR",
            "VERSION:2.0",
            "PRODID:-//Cursus Timetable Builder//EN",
            "CALSCALE:GREGORIAN",
            "METHOD:PUBLISH",
            f"X-WR-CALNAME:{schedule_name}"
        ]

        for sec in sections:
            c_code = sec.course.code if sec.course else "COURSE"
            c_title = sec.course.title if sec.course else "Course"

            for slot in sec.time_slots:
                day_name = slot.day.lower()
                byday = DAY_TO_ICS_BYDAY.get(day_name, "MO")
                first_date = get_next_weekday_date(SEMESTER_START_DATE, day_name)

                try:
                    s_hr, s_mn = map(int, slot.start_time.split(":"))
                    e_hr, e_mn = map(int, slot.end_time.split(":"))
                except Exception:
                    s_hr, s_mn = 9, 0
                    e_hr, e_mn = 10, 0

                dt_start = first_date.replace(hour=s_hr, minute=s_mn, second=0)
                dt_end = first_date.replace(hour=e_hr, minute=e_mn, second=0)

                dt_start_str = dt_start.strftime("%Y%m%dT%H%M%S")
                dt_end_str = dt_end.strftime("%Y%m%dT%H%M%S")

                lines.extend([
                    "BEGIN:VEVENT",
                    f"UID:{sec.id}-{slot.id}@cursus.app",
                    f"SUMMARY:{c_code} - {sec.section_label} ({c_title})",
                    f"DESCRIPTION:Instructor: {sec.instructor or 'TBD'}",
                    f"LOCATION:{slot.room or 'Campus Room TBD'}",
                    f"DTSTART:{dt_start_str}",
                    f"DTEND:{dt_end_str}",
                    f"RRULE:FREQ=WEEKLY;BYDAY={byday};UNTIL=20261231T235959Z",
                    "END:VEVENT"
                ])

        lines.append("END:VCALENDAR")
        return "\r\n".join(lines)
