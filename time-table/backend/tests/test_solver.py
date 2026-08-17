import pytest
from app.core.database import AsyncSessionLocal, init_db
from app.models.course import Course
from app.models.section import Section
from app.models.time_slot import TimeSlot
from app.services.solver_service import TimetableSolverService
from app.schemas.generator import SchedulePreferences

@pytest.mark.asyncio
async def test_solver_conflict_pruning():
    await init_db()

    async with AsyncSessionLocal() as db:
        c1 = Course(code="CS101", title="Intro CS", department="CS")
        db.add(c1)
        await db.flush()

        s1_1 = Section(course_id=c1.id, section_label="SEC-01", instructor="Dr. A")
        s1_2 = Section(course_id=c1.id, section_label="SEC-02", instructor="Dr. B")
        db.add_all([s1_1, s1_2])
        await db.flush()

        t1_1 = TimeSlot(section_id=s1_1.id, day="Monday", start_time="09:00", end_time="10:15", room="R1")
        t1_2 = TimeSlot(section_id=s1_2.id, day="Monday", start_time="11:00", end_time="12:15", room="R2")
        db.add_all([t1_1, t1_2])

        c2 = Course(code="MATH101", title="Calculus I", department="Math")
        db.add(c2)
        await db.flush()

        s2_1 = Section(course_id=c2.id, section_label="SEC-01", instructor="Dr. Math")
        db.add(s2_1)
        await db.flush()

        t2_1 = TimeSlot(section_id=s2_1.id, day="Monday", start_time="09:30", end_time="10:45", room="R3")
        db.add(t2_1)

        await db.commit()

        # Generate schedule for c1 and c2
        options, total_found, exec_ms = await TimetableSolverService.generate_schedules(
            db=db,
            course_ids=[c1.id, c2.id],
            preferences=SchedulePreferences()
        )

        assert total_found == 1
        assert len(options) == 1
        sec_ids = [s.id for s in options[0].sections]
        assert s1_2.id in sec_ids
        assert s2_1.id in sec_ids
        assert s1_1.id not in sec_ids
