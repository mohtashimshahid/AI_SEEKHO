from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.models.user import User
from app.schemas.trip import TripCreate, TripListResponse, TripRequest, TripResponse, TripUpdate
from app.services.auth_service import get_current_user
from app.services.trip_service import TripService
from app.services.workflow_service import WorkflowService

router = APIRouter(prefix="/trips", tags=["trips"])


@router.post("", response_model=TripResponse, status_code=status.HTTP_201_CREATED)
async def create_trip(
    payload: TripCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = TripService(db)
    trip = await service.create_trip(current_user.id, payload)
    return trip


@router.get("", response_model=TripListResponse)
async def list_trips(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = TripService(db)
    trips, total = await service.list_trips(current_user.id, skip=skip, limit=limit)
    return {
        "data": trips,
        "meta": {
            "total": total,
            "skip": skip,
            "limit": limit,
        },
    }


@router.get("/{trip_id}", response_model=TripResponse)
async def get_trip(
    trip_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = TripService(db)
    trip = await service.get_trip(trip_id, current_user.id)
    return trip


@router.patch("/{trip_id}", response_model=TripResponse)
async def update_trip(
    trip_id: str,
    payload: TripUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = TripService(db)
    trip = await service.update_trip(trip_id, current_user.id, payload)
    return trip


@router.delete("/{trip_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_trip(
    trip_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = TripService(db)
    await service.delete_trip(trip_id, current_user.id)
    return None


@router.post("/{trip_id}/analyze")
async def start_analysis(
    trip_id: str,
    background: bool = Query(False),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    import asyncio
    import uuid
    from app.db.session import async_session_maker

    run_id = str(uuid.uuid4())

    if background:
        # Launch workflow asynchronously so frontend SSE can stream real-time transitions
        async def _run_bg():
            async with async_session_maker() as session:
                service = WorkflowService(session)
                await service.execute_trip_analysis(trip_id, current_user.id, run_id=run_id)

        asyncio.create_task(_run_bg())

        return {
            "data": {
                "trip_id": trip_id,
                "workflow_run_id": run_id,
                "status": "RUNNING",
                "current_stage": "DESTINATION_RESEARCH",
            },
            "meta": {
                "trip_id": trip_id,
                "status": "RUNNING",
            },
        }

    # Synchronous execution
    workflow_service = WorkflowService(db)
    result = await workflow_service.execute_trip_analysis(trip_id, current_user.id, run_id=run_id)
    return {
        "data": result,
        "meta": {
            "trip_id": trip_id,
            "status": result["status"],
        },
    }
