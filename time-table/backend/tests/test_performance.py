import pytest
import time
from app.core.database import AsyncSessionLocal, init_db
from app.models.course import Course
from app.models.section import Section
from app.models.time_slot import TimeSlot
from app.services.solver_service import TimetableSolverService
from app.schemas.generator import SchedulePreferences

@pytest.mark.asyncio
async def test_solver_performance_under_two_seconds():
    await init_db()

    async with AsyncSessionLocal() as db:
        course_ids = []
        days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

        # Create 6 courses, each with 3 sections scheduled at different non-overlapping times
        for c_idx in range(6):
            c = Course(code=f"PERF{c_idx+1}01", title=f"Performance Course {c_idx+1}", department="CS")
            db.add(c)
            await db.flush()
            course_ids.append(c.id)

            for s_idx in range(3):
                s = Section(course_id=c.id, section_label=f"SEC-0{s_idx+1}", instructor=f"Prof. {s_idx}")
                db.add(s)
                await db.flush()

                # Each course takes a distinct time slot on day
                day = days[c_idx % 6]
                start_hr = 8 + (s_idx * 3)
                t = TimeSlot(
                    section_id=s.id,
                    day=day,
                    start_time=f"{start_hr:02d}:00",
                    end_time=f"{start_hr+1:02d}:15",
                    room=f"Hall {s_idx+1}"
                )
                db.add(t)

        await db.commit()

        # Run solver performance benchmark
        t_start = time.perf_counter()
        options, total_found, execution_time_ms = await TimetableSolverService.generate_schedules(
            db=db,
            course_ids=course_ids,
            preferences=SchedulePreferences(
                earliest_start="08:00",
                latest_end="20:00",
                free_days=["Sunday"],
                max_gap_minutes=120
            )
        )
        t_duration_s = time.perf_counter() - t_start

        print(f"\n[PERFORMANCE BENCHMARK] Evaluated 6 courses (3 sections each). Found {total_found} valid options in {execution_time_ms} ms ({t_duration_s:.4f}s).")

        # Must execute in under 2.0 seconds (§7 & M3 PRD requirement)
        assert t_duration_s < 2.0, f"Solver took {t_duration_s:.4f}s which exceeds 2s limit!"
        assert execution_time_ms < 2000.0
        assert total_found > 0
        assert len(options) <= 20
