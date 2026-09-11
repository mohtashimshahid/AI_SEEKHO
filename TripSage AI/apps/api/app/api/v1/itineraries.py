from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.models.user import User
from app.services.auth_service import get_current_user

router = APIRouter(prefix="/trips", tags=["itineraries"])


@router.get("/{trip_id}/itinerary")
async def get_trip_itinerary(trip_id: str, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    return {"data": {"trip_id": trip_id, "itinerary": None}}


@router.get("/{trip_id}/itinerary/{version}")
async def get_trip_itinerary_version(trip_id: str, version: int, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    return {"data": {"trip_id": trip_id, "version": version, "itinerary": None}}
