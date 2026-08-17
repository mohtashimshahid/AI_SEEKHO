from typing import List, Optional, Tuple
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_, func
from sqlalchemy.orm import selectinload
from app.models.course import Course
from app.models.section import Section
from app.models.time_slot import TimeSlot

class CatalogService:
    @staticmethod
    async def get_courses(
        db: AsyncSession,
        search: Optional[str] = None,
        department: Optional[str] = None,
        instructor: Optional[str] = None,
        day: Optional[str] = None,
        page: int = 1,
        limit: int = 20
    ) -> Tuple[List[Course], int]:
        """
        Fetches courses with eager loading of sections and time_slots to prevent N+1 queries.
        Supports full-text search by code or title, and filters by department, instructor, or day.
        """
        # Base query with selectinload to resolve N+1 patterns (§11.10)
        query = select(Course).options(
            selectinload(Course.sections).selectinload(Section.time_slots)
        )

        filters = []
        if search:
            search_pattern = f"%{search.strip()}%"
            filters.append(or_(
                Course.code.ilike(search_pattern),
                Course.title.ilike(search_pattern)
            ))

        if department:
            filters.append(Course.department.ilike(f"%{department.strip()}%"))

        if instructor:
            query = query.join(Course.sections)
            filters.append(Section.instructor.ilike(f"%{instructor.strip()}%"))

        if day:
            if not instructor:
                query = query.join(Course.sections)
            query = query.join(Section.time_slots)
            filters.append(TimeSlot.day.ilike(day.strip()))

        if filters:
            query = query.where(*filters).distinct()

        # Count total matching courses
        count_stmt = select(func.count(func.distinct(Course.id)))
        if filters:
            if instructor or day:
                count_stmt = count_stmt.select_from(Course).join(Course.sections)
                if day:
                    count_stmt = count_stmt.join(Section.time_slots)
            else:
                count_stmt = count_stmt.select_from(Course)
            count_stmt = count_stmt.where(*filters)
        else:
            count_stmt = count_stmt.select_from(Course)

        total_res = await db.execute(count_stmt)
        total = total_res.scalar_one_or_none() or 0

        # Pagination
        offset = (page - 1) * limit
        query = query.order_by(Course.code).offset(offset).limit(limit)

        result = await db.execute(query)
        courses = result.scalars().all()
        return list(courses), total

    @staticmethod
    async def get_course_by_id(db: AsyncSession, course_id: str) -> Optional[Course]:
        stmt = (
            select(Course)
            .options(selectinload(Course.sections).selectinload(Section.time_slots))
            .where(Course.id == course_id)
        )
        res = await db.execute(stmt)
        return res.scalar_one_or_none()

    @staticmethod
    async def get_all_departments(db: AsyncSession) -> List[str]:
        stmt = select(Course.department).distinct().where(Course.department.isnot(None))
        res = await db.execute(stmt)
        depts = res.scalars().all()
        return sorted([d for d in depts if d])
