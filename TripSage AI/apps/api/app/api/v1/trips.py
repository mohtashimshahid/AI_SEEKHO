from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.models.user import User
from app.services.auth_service import get_current_user

router = APIRouter(prefix="/trips", tags=["trips"])


@router.get("")
async def list_trips(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    return {"data": [], "meta": {"count": 0}}


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_trip(payload: dict, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    return {"data": {"message": "Trip created stub", "payload": payload}}


@router.get("/{trip_id}")
async def get_trip(trip_id: str, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    return {"data": {"id": trip_id, "status": "DRAFT"}}


@router.patch("/{trip_id}")
async def update_trip(trip_id: str, payload: dict, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    return {"data": {"id": trip_id, "updated": True}}


@router.delete("/{trip_id}")
async def delete_trip(trip_id: str, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    return {"data": {"id": trip_id, "deleted": True}}


@router.post("/{trip_id}/analyze")
async def start_analysis(trip_id: str, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    return {"data": {"trip_id": trip_id, "workflow_run_id": "stub_run_id", "status": "QUEUED"}}
