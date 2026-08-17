from fastapi import APIRouter, Depends, Query, HTTPException
from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.schemas.catalog import CourseSchema, CourseListResponse
from app.services.catalog_service import CatalogService

router = APIRouter(prefix="/catalog", tags=["Course Catalog"])

@router.get("/courses", response_model=CourseListResponse)
async def list_courses(
    search: Optional[str] = Query(None, description="Search by course code or title"),
    department: Optional[str] = Query(None, description="Filter by department"),
    instructor: Optional[str] = Query(None, description="Filter by instructor name"),
    day: Optional[str] = Query(None, description="Filter by day of week e.g. Monday"),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db)
):
    courses, total = await CatalogService.get_courses(
        db=db,
        search=search,
        department=department,
        instructor=instructor,
        day=day,
        page=page,
        limit=limit
    )
    return CourseListResponse(
        total=total,
        page=page,
        limit=limit,
        courses=[CourseSchema.model_validate(c) for c in courses]
    )

@router.get("/courses/{course_id}", response_model=CourseSchema)
async def get_course_detail(course_id: str, db: AsyncSession = Depends(get_db)):
    course = await CatalogService.get_course_by_id(db, course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return CourseSchema.model_validate(course)

@router.get("/departments", response_model=List[str])
async def list_departments(db: AsyncSession = Depends(get_db)):
    return await CatalogService.get_all_departments(db)
