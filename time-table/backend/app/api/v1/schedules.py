from fastapi import APIRouter, Depends, HTTPException, Response
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from app.core.database import get_db
from app.models.saved_schedule import SavedSchedule
from app.models.section import Section
from app.models.user import User
from app.schemas.schedule import SaveScheduleRequest, SavedScheduleResponse
from app.schemas.catalog import SectionSchema, TimeSlotSchema
from app.services.auth_service import get_current_user
from app.services.exporter_service import ExporterService

router = APIRouter(prefix="/schedules", tags=["Saved Schedules & Exporter"])

@router.post("", response_model=SavedScheduleResponse)
async def save_schedule(
    request: SaveScheduleRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    if not request.section_ids:
        raise HTTPException(status_code=400, detail="Schedule must contain section IDs")
    
    new_schedule = SavedSchedule(
        user_id=current_user.id,
        name=request.name or "My Saved Schedule",
        section_ids=request.section_ids
    )
    db.add(new_schedule)
    await db.commit()
    await db.refresh(new_schedule)

    stmt = (
        select(Section)
        .options(selectinload(Section.course), selectinload(Section.time_slots))
        .where(Section.id.in_(request.section_ids))
    )
    res = await db.execute(stmt)
    secs = res.scalars().all()

    sec_schemas = [
        SectionSchema(
            id=s.id,
            course_id=s.course_id,
            section_label=s.section_label,
            instructor=s.instructor,
            time_slots=[
                TimeSlotSchema(
                    id=t.id, section_id=t.section_id, day=t.day,
                    start_time=t.start_time, end_time=t.end_time, room=t.room
                ) for t in s.time_slots
            ]
        ) for s in secs
    ]

    return SavedScheduleResponse(
        id=new_schedule.id,
        user_id=new_schedule.user_id,
        name=new_schedule.name,
        section_ids=new_schedule.section_ids,
        sections=sec_schemas,
        created_at=new_schedule.created_at
    )

@router.get("", response_model=List[SavedScheduleResponse])
async def list_user_schedules(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    stmt = (
        select(SavedSchedule)
        .where(SavedSchedule.user_id == current_user.id)
        .order_by(SavedSchedule.created_at.desc())
    )
    res = await db.execute(stmt)
    schedules = res.scalars().all()

    response_items = []
    for sched in schedules:
        if sched.section_ids:
            sec_stmt = (
                select(Section)
                .options(selectinload(Section.course), selectinload(Section.time_slots))
                .where(Section.id.in_(sched.section_ids))
            )
            sec_res = await db.execute(sec_stmt)
            secs = sec_res.scalars().all()

            sec_schemas = [
                SectionSchema(
                    id=s.id, course_id=s.course_id, section_label=s.section_label, instructor=s.instructor,
                    time_slots=[
                        TimeSlotSchema(id=t.id, section_id=t.section_id, day=t.day, start_time=t.start_time, end_time=t.end_time, room=t.room)
                        for t in s.time_slots
                    ]
                ) for s in secs
            ]
        else:
            sec_schemas = []

        response_items.append(
            SavedScheduleResponse(
                id=sched.id,
                user_id=sched.user_id,
                name=sched.name,
                section_ids=sched.section_ids,
                sections=sec_schemas,
                created_at=sched.created_at
            )
        )
    return response_items

@router.get("/{schedule_id}", response_model=SavedScheduleResponse)
async def get_single_schedule(
    schedule_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(SavedSchedule).where(SavedSchedule.id == schedule_id, SavedSchedule.user_id == current_user.id)
    res = await db.execute(stmt)
    sched = res.scalar_one_or_none()
    if not sched:
        raise HTTPException(status_code=404, detail="Schedule not found or unauthorized access.")

    sec_stmt = (
        select(Section)
        .options(selectinload(Section.course), selectinload(Section.time_slots))
        .where(Section.id.in_(sched.section_ids))
    )
    sec_res = await db.execute(sec_stmt)
    secs = sec_res.scalars().all()

    sec_schemas = [
        SectionSchema(
            id=s.id, course_id=s.course_id, section_label=s.section_label, instructor=s.instructor,
            time_slots=[
                TimeSlotSchema(id=t.id, section_id=t.section_id, day=t.day, start_time=t.start_time, end_time=t.end_time, room=t.room)
                for t in s.time_slots
            ]
        ) for s in secs
    ]

    return SavedScheduleResponse(
        id=sched.id,
        user_id=sched.user_id,
        name=sched.name,
        section_ids=sched.section_ids,
        sections=sec_schemas,
        created_at=sched.created_at
    )

@router.delete("/{schedule_id}")
async def delete_user_schedule(
    schedule_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(SavedSchedule).where(SavedSchedule.id == schedule_id, SavedSchedule.user_id == current_user.id)
    res = await db.execute(stmt)
    sched = res.scalar_one_or_none()
    if not sched:
        raise HTTPException(status_code=404, detail="Schedule not found or unauthorized")

    await db.delete(sched)
    await db.commit()
    return {"message": "Schedule deleted successfully"}

@router.get("/{schedule_id}/export/ics")
async def export_schedule_ics(
    schedule_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(SavedSchedule).where(SavedSchedule.id == schedule_id, SavedSchedule.user_id == current_user.id)
    res = await db.execute(stmt)
    sched = res.scalar_one_or_none()
    if not sched:
        raise HTTPException(status_code=404, detail="Schedule not found or unauthorized")

    sec_stmt = (
        select(Section)
        .options(selectinload(Section.course), selectinload(Section.time_slots))
        .where(Section.id.in_(sched.section_ids))
    )
    sec_res = await db.execute(sec_stmt)
    sections = sec_res.scalars().all()

    ics_data = ExporterService.generate_ics_content(sections, sched.name)

    return Response(
        content=ics_data,
        media_type="text/calendar",
        headers={"Content-Disposition": f'attachment; filename="{sched.name}.ics"'}
    )

@router.post("/export/ics-quick")
async def quick_export_ics(
    request: SaveScheduleRequest,
    db: AsyncSession = Depends(get_db)
):
    if not request.section_ids:
        raise HTTPException(status_code=400, detail="Section IDs required for Quick Export.")

    sec_stmt = (
        select(Section)
        .options(selectinload(Section.course), selectinload(Section.time_slots))
        .where(Section.id.in_(request.section_ids))
    )
    sec_res = await db.execute(sec_stmt)
    sections = sec_res.scalars().all()

    ics_data = ExporterService.generate_ics_content(sections, request.name or "Cursus Timetable")

    return Response(
        content=ics_data,
        media_type="text/calendar",
        headers={"Content-Disposition": f'attachment; filename="{request.name or "cursus_timetable"}.ics"'}
    )
