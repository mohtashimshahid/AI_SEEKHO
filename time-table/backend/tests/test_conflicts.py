import pytest
from app.core.database import AsyncSessionLocal, init_db
from app.models.course import Course
from app.models.section import Section
from app.models.time_slot import TimeSlot
from app.services.solver_service import TimetableSolverService

@pytest.mark.asyncio
async def test_conflict_detection_service():
    await init_db()

    async with AsyncSessionLocal() as db:
        # Create Course 1 & Section 1
        c1 = Course(code="CS101", title="Intro CS", department="CS")
        db.add(c1)
        await db.flush()

        s1 = Section(course_id=c1.id, section_label="SEC-01", instructor="Dr. A")
        db.add(s1)
        await db.flush()

        t1 = TimeSlot(section_id=s1.id, day="Monday", start_time="09:00", end_time="10:15", room="Hall A")
        db.add(t1)

        # Create Course 2 & Section 2 (Overlapping on Monday 09:30-10:45)
        c2 = Course(code="MATH201", title="Calculus II", department="Math")
        db.add(c2)
        await db.flush()

        s2 = Section(course_id=c2.id, section_label="SEC-01", instructor="Dr. B")
        db.add(s2)
        await db.flush()

        t2 = TimeSlot(section_id=s2.id, day="Monday", start_time="09:30", end_time="10:45", room="Lab 1")
        db.add(t2)

        # Create Course 3 & Section 3 (Non-overlapping on Tuesday 11:00-12:15)
        c3 = Course(code="ENG105", title="Writing", department="English")
        db.add(c3)
        await db.flush()

        s3 = Section(course_id=c3.id, section_label="SEC-01", instructor="Dr. C")
        db.add(s3)
        await db.flush()

        t3 = TimeSlot(section_id=s3.id, day="Tuesday", start_time="11:00", end_time="12:15", room="Hum 1")
        db.add(t3)

        await db.commit()

        # Test conflict check on (s1, s2) -> Should detect conflict!
        res_conflict = await TimetableSolverService.detect_section_conflicts(db, [s1.id, s2.id])
        assert res_conflict.has_conflicts is True
        assert len(res_conflict.conflicting_section_ids) == 2
        assert s1.id in res_conflict.conflicting_section_ids
        assert s2.id in res_conflict.conflicting_section_ids
        assert len(res_conflict.conflicts) == 1
        assert res_conflict.conflicts[0].day == "Monday"
        assert res_conflict.conflicts[0].overlap_start == "09:30"
        assert res_conflict.conflicts[0].overlap_end == "10:15"

        # Test conflict check on (s1, s3) -> Zero conflicts!
        res_clean = await TimetableSolverService.detect_section_conflicts(db, [s1.id, s3.id])
        assert res_clean.has_conflicts is False
        assert len(res_clean.conflicting_section_ids) == 0
        assert len(res_clean.conflicts) == 0
