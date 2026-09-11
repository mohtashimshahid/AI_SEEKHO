from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.db.session import get_db
from app.models.user import User
from app.models.workflow import WorkflowRun
from app.services.auth_service import get_current_user
from app.services.workflow_stream_manager import stream_manager

router = APIRouter(prefix="/workflows", tags=["workflows"])


@router.get("/{run_id}")
async def get_workflow_status(
    run_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    res = await db.execute(select(WorkflowRun).where(WorkflowRun.id == run_id))
    workflow = res.scalars().first()
    if not workflow:
        raise HTTPException(status_code=404, detail="Workflow run not found")
    
    return {
        "data": {
            "run_id": workflow.id,
            "trip_id": workflow.trip_id,
            "status": workflow.status,
            "current_stage": workflow.current_stage,
            "error": workflow.error,
            "started_at": workflow.started_at.isoformat() if workflow.started_at else None,
            "completed_at": workflow.completed_at.isoformat() if workflow.completed_at else None,
        }
    }


@router.post("/{run_id}/cancel")
async def cancel_workflow(
    run_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    res = await db.execute(select(WorkflowRun).where(WorkflowRun.id == run_id))
    workflow = res.scalars().first()
    if not workflow:
        raise HTTPException(status_code=404, detail="Workflow run not found")
    
    workflow.status = "CANCELLED"
    await db.commit()
    stream_manager.publish_event(run_id, "workflow_cancelled", {"run_id": run_id, "status": "CANCELLED"})
    return {"data": {"run_id": run_id, "status": "CANCELLED"}}


@router.post("/{run_id}/retry")
async def retry_workflow(
    run_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    res = await db.execute(select(WorkflowRun).where(WorkflowRun.id == run_id))
    workflow = res.scalars().first()
    if not workflow:
        raise HTTPException(status_code=404, detail="Workflow run not found")
    
    workflow.status = "RETRYING"
    await db.commit()
    return {"data": {"run_id": run_id, "status": "RETRYING"}}


@router.get("/{run_id}/events")
async def workflow_events(run_id: str):
    """
    Server-Sent Events (SSE) endpoint streaming real-time agent lifecycle transitions
    (PRD Section 27, 28, 39).
    """
    return StreamingResponse(
        stream_manager.subscribe(run_id),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )
