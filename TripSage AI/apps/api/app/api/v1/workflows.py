from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.models.user import User
from app.services.auth_service import get_current_user

router = APIRouter(prefix="/workflows", tags=["workflows"])


@router.get("/{run_id}")
async def get_workflow_status(run_id: str, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    return {"data": {"run_id": run_id, "status": "QUEUED", "current_stage": "QUEUED"}}


@router.post("/{run_id}/cancel")
async def cancel_workflow(run_id: str, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    return {"data": {"run_id": run_id, "status": "CANCELLED"}}


@router.post("/{run_id}/retry")
async def retry_workflow(run_id: str, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    return {"data": {"run_id": run_id, "status": "RETRYING"}}


@router.get("/{run_id}/events")
async def workflow_events(run_id: str):
    # SSE stub for phase 6
    return {"data": {"message": "SSE events stream stub"}}
