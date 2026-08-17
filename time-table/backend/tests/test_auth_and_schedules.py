import pytest
import uuid
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from app.core.database import AsyncSessionLocal, init_db
from app.models.user import User
from app.models.course import Course
from app.models.section import Section
from app.models.time_slot import TimeSlot
from app.models.saved_schedule import SavedSchedule
from app.schemas.user import UserRegister
from app.services.auth_service import AuthService
from app.services.exporter_service import ExporterService

@pytest.mark.asyncio
async def test_auth_and_schedule_persistence_and_ics_export():
    await init_db()

    unique_email = f"student_{uuid.uuid4().hex[:8]}@univ.edu"

    async with AsyncSessionLocal() as db:
        # Register user
        user = await AuthService.register_user(
            db, UserRegister(email=unique_email, password="password123", full_name="Alice Student")
        )
        assert user.email == unique_email

        # Create Course & Section
        c = Course(code=f"CS{uuid.uuid4().hex[:4]}", title="Computer Science I", department="CS")
        db.add(c)
        await db.flush()

        s = Section(course_id=c.id, section_label="SEC-01", instructor="Dr. Alan")
        db.add(s)
        await db.flush()

        t = TimeSlot(section_id=s.id, day="Monday", start_time="09:00", end_time="10:15", room="Room 101")
        db.add(t)

        # Create Saved Schedule
        sched = SavedSchedule(user_id=user.id, name="My Fall Schedule", section_ids=[s.id])
        db.add(sched)
        await db.commit()

        # Query section with eager loaded relationships
        sec_stmt = select(Section).options(selectinload(Section.course), selectinload(Section.time_slots)).where(Section.id == s.id)
        sec_res = await db.execute(sec_stmt)
        sec_loaded = sec_res.scalar_one()

        # Generate ICS content
        ics_text = ExporterService.generate_ics_content([sec_loaded], sched.name)
        assert "BEGIN:VCALENDAR" in ics_text
        assert "SEC-01 (Computer Science I)" in ics_text
        assert "RRULE:FREQ=WEEKLY;BYDAY=MO" in ics_text
        assert "END:VCALENDAR" in ics_text
