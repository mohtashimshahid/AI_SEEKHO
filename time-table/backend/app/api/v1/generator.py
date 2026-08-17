from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.schemas.generator import GenerateRequest, GenerateResponse, ConflictCheckRequest, ConflictCheckResponse
from app.services.solver_service import TimetableSolverService

router = APIRouter(prefix="/generator", tags=["Schedule Generator & Conflict Detection"])

@router.post("/solve", response_model=GenerateResponse)
async def generate_schedules(
    request: GenerateRequest,
    db: AsyncSession = Depends(get_db)
):
    if not request.course_ids:
        raise HTTPException(status_code=400, detail="At least one course must be selected.")
    
    options, total_found, execution_time_ms = await TimetableSolverService.generate_schedules(
        db=db,
        course_ids=request.course_ids,
        locked_section_ids=request.locked_section_ids,
        preferences=request.preferences
    )

    return GenerateResponse(
        total_found=total_found,
        returned_count=len(options),
        execution_time_ms=execution_time_ms,
        options=options
    )

@router.post("/detect-conflicts", response_model=ConflictCheckResponse)
async def detect_conflicts(
    request: ConflictCheckRequest,
    db: AsyncSession = Depends(get_db)
):
    return await TimetableSolverService.detect_section_conflicts(
        db=db,
        section_ids=request.section_ids
    )
