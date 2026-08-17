import time
import uuid
from typing import List, Dict, Tuple, Optional, Any, Set
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from app.models.course import Course
from app.models.section import Section
from app.models.time_slot import TimeSlot
from app.schemas.generator import SchedulePreferences, TimetableOption, ConflictCheckResponse, ConflictDetail
from app.schemas.catalog import SectionSchema, TimeSlotSchema

DAY_INDEX_MAP = {
    "monday": 0,
    "tuesday": 1,
    "wednesday": 2,
    "thursday": 3,
    "friday": 4,
    "saturday": 5,
    "sunday": 6
}

def time_to_minutes(t_str: str) -> int:
    try:
        parts = t_str.split(":")
        return int(parts[0]) * 60 + int(parts[1])
    except Exception:
        return 0

def minutes_to_time(mins: int) -> str:
    hr = mins // 60
    mn = mins % 60
    return f"{hr:02d}:{mn:02d}"

class TimetableSolverService:

    @staticmethod
    def slots_overlap(slot1: TimeSlot, slot2: TimeSlot) -> Optional[Tuple[str, str]]:
        if slot1.day.lower() != slot2.day.lower():
            return None
        s1 = time_to_minutes(slot1.start_time)
        e1 = time_to_minutes(slot1.end_time)
        s2 = time_to_minutes(slot2.start_time)
        e2 = time_to_minutes(slot2.end_time)
        
        overlap_start = max(s1, s2)
        overlap_end = min(e1, e2)
        if overlap_start < overlap_end:
            return (minutes_to_time(overlap_start), minutes_to_time(overlap_end))
        return None

    @classmethod
    async def detect_section_conflicts(
        cls,
        db: AsyncSession,
        section_ids: List[str]
    ) -> ConflictCheckResponse:
        if not section_ids:
            return ConflictCheckResponse(has_conflicts=False, conflicting_section_ids=[], conflicts=[])

        stmt = (
            select(Section)
            .options(selectinload(Section.course), selectinload(Section.time_slots))
            .where(Section.id.in_(section_ids))
        )
        res = await db.execute(stmt)
        sections = list(res.scalars().all())

        conflicting_ids: Set[str] = set()
        conflict_details: List[ConflictDetail] = []

        for i in range(len(sections)):
            for j in range(i + 1, len(sections)):
                sec1 = sections[i]
                sec2 = sections[j]

                for t1 in sec1.time_slots:
                    for t2 in sec2.time_slots:
                        overlap = cls.slots_overlap(t1, t2)
                        if overlap is not None:
                            conflicting_ids.add(sec1.id)
                            conflicting_ids.add(sec2.id)

                            c1_code = sec1.course.code if sec1.course else "COURSE"
                            c2_code = sec2.course.code if sec2.course else "COURSE"

                            msg = (
                                f"{c1_code} ({sec1.section_label}) overlaps with {c2_code} ({sec2.section_label}) "
                                f"on {t1.day} between {overlap[0]} and {overlap[1]}."
                            )

                            conflict_details.append(
                                ConflictDetail(
                                    section1_id=sec1.id,
                                    section1_label=sec1.section_label,
                                    course1_code=c1_code,
                                    section2_id=sec2.id,
                                    section2_label=sec2.section_label,
                                    course2_code=c2_code,
                                    day=t1.day,
                                    overlap_start=overlap[0],
                                    overlap_end=overlap[1],
                                    message=msg
                                )
                            )

        return ConflictCheckResponse(
            has_conflicts=len(conflicting_ids) > 0,
            conflicting_section_ids=list(conflicting_ids),
            conflicts=conflict_details
        )

    @classmethod
    def score_combination(cls, sections: List[Section], prefs: SchedulePreferences) -> Tuple[float, dict]:
        score = 100.0
        reasons = []

        earliest_limit = time_to_minutes(prefs.earliest_start or "08:00")
        latest_limit = time_to_minutes(prefs.latest_end or "20:00")
        requested_free_days = set(d.lower() for d in (prefs.free_days or []))
        preferred_instructors = set(i.lower() for i in (prefs.preferred_instructors or []))

        days_used = set()
        day_slots: Dict[str, List[Tuple[int, int]]] = {}

        for sec in sections:
            # Preferred instructor bonus
            if sec.instructor and sec.instructor.lower() in preferred_instructors:
                score += 5.0

            for slot in sec.time_slots:
                d = slot.day.lower()
                days_used.add(d)
                s = time_to_minutes(slot.start_time)
                e = time_to_minutes(slot.end_time)

                if d not in day_slots:
                    day_slots[d] = []
                day_slots[d].append((s, e))

                # Check earliest start bound
                if s < earliest_limit:
                    diff = (earliest_limit - s)
                    penalty = min(20.0, (diff / 30.0) * 5.0)
                    score -= penalty
                    reasons.append(f"Class starts before {prefs.earliest_start} on {slot.day}")

                # Check latest end bound
                if e > latest_limit:
                    diff = (e - latest_limit)
                    penalty = min(20.0, (diff / 30.0) * 5.0)
                    score -= penalty
                    reasons.append(f"Class finishes after {prefs.latest_end} on {slot.day}")

        # Free days score check
        for free_day in requested_free_days:
            if free_day in days_used:
                score -= 15.0
                reasons.append(f"Class scheduled on requested free day ({free_day.capitalize()})")
            else:
                score += 5.0

        # Gap duration minimization
        total_gap_minutes = 0
        for d, slots in day_slots.items():
            slots.sort(key=lambda x: x[0])
            for i in range(len(slots) - 1):
                gap = slots[i+1][0] - slots[i][1]
                if gap > 0:
                    total_gap_minutes += gap
                    if prefs.max_gap_minutes and gap > prefs.max_gap_minutes:
                        score -= min(15.0, ((gap - prefs.max_gap_minutes) / 30.0) * 5.0)
                        reasons.append(f"Gap of {gap}m on {d.capitalize()} exceeds max {prefs.max_gap_minutes}m")

        if prefs.minimize_gaps and total_gap_minutes > 0:
            gap_penalty = min(20.0, (total_gap_minutes / 60.0) * 3.0)
            score -= gap_penalty

        final_score = max(0.0, round(score, 1))

        details = {
            "score_percentage": final_score,
            "days_used_count": len(days_used),
            "total_gap_minutes": total_gap_minutes,
            "notes": reasons[:5]
        }
        return final_score, details

    @classmethod
    async def generate_schedules(
        cls,
        db: AsyncSession,
        course_ids: List[str],
        locked_section_ids: Optional[List[str]] = None,
        preferences: Optional[SchedulePreferences] = None
    ) -> Tuple[List[TimetableOption], int, float]:
        start_time_perf = time.perf_counter()

        if not preferences:
            preferences = SchedulePreferences()

        locked_set = set(locked_section_ids or [])

        # Query database with eager join for courses, sections, and time slots
        stmt = (
            select(Course)
            .options(selectinload(Course.sections).selectinload(Section.time_slots))
            .where(Course.id.in_(course_ids))
        )
        res = await db.execute(stmt)
        courses = res.scalars().all()

        if len(courses) == 0:
            return [], 0, round((time.perf_counter() - start_time_perf) * 1000, 2)

        # Pre-process time slots into integer tuples: (day_idx, start_min, end_min)
        # for ultra-fast integer comparison in backtracking loop
        course_sections: List[List[Tuple[Section, List[Tuple[int, int, int]]]]] = []
        for course in courses:
            c_secs = [s for s in course.sections if s.id in locked_set] if any(s.id in locked_set for s in course.sections) else course.sections
            
            section_tuples = []
            for sec in c_secs:
                intervals = []
                for slot in sec.time_slots:
                    day_idx = DAY_INDEX_MAP.get(slot.day.lower(), 0)
                    s_min = time_to_minutes(slot.start_time)
                    e_min = time_to_minutes(slot.end_time)
                    intervals.append((day_idx, s_min, e_min))
                section_tuples.append((sec, intervals))

            if section_tuples:
                course_sections.append(section_tuples)

        valid_combinations: List[List[Section]] = []

        # Ultra-Fast Integer Backtracking Solver
        def backtrack(
            course_idx: int,
            current_secs: List[Section],
            current_intervals: List[Tuple[int, int, int]]
        ):
            if course_idx == len(course_sections):
                valid_combinations.append(list(current_secs))
                return

            for sec, intervals in course_sections[course_idx]:
                # Integer overlap check against current_intervals
                has_overlap = False
                for d1, s1, e1 in intervals:
                    for d2, s2, e2 in current_intervals:
                        if d1 == d2 and max(s1, s2) < min(e1, e2):
                            has_overlap = True
                            break
                    if has_overlap:
                        break

                # Early Pruning: if no overlap, recurse down
                if not has_overlap:
                    current_secs.append(sec)
                    current_intervals.extend(intervals)

                    backtrack(course_idx + 1, current_secs, current_intervals)

                    # Backtrack state
                    current_secs.pop()
                    del current_intervals[-len(intervals):]

        backtrack(0, [], [])

        total_found = len(valid_combinations)

        # Score and rank combinations against soft preferences
        scored_options: List[Tuple[float, dict, List[Section]]] = []
        for comb in valid_combinations:
            sc, details = cls.score_combination(comb, preferences)
            scored_options.append((sc, details, comb))

        scored_options.sort(key=lambda x: x[0], reverse=True)

        # Cap results to top 20 (§6.3)
        top_results = scored_options[:20]

        timetable_options: List[TimetableOption] = []
        for rank, (sc, details, secs) in enumerate(top_results, start=1):
            sec_schemas = [
                SectionSchema(
                    id=s.id,
                    course_id=s.course_id,
                    section_label=s.section_label,
                    instructor=s.instructor,
                    time_slots=[
                        TimeSlotSchema(
                            id=t.id,
                            section_id=t.section_id,
                            day=t.day,
                            start_time=t.start_time,
                            end_time=t.end_time,
                            room=t.room
                        ) for t in s.time_slots
                    ]
                ) for s in secs
            ]

            timetable_options.append(
                TimetableOption(
                    id=str(uuid.uuid4()),
                    rank=rank,
                    score=sc,
                    sections=sec_schemas,
                    has_conflicts=False,
                    preference_match_details=details
                )
            )

        execution_time_ms = round((time.perf_counter() - start_time_perf) * 1000, 2)
        return timetable_options, total_found, execution_time_ms
