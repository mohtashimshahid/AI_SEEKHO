from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.models.user import User
from app.services.auth_service import get_current_user

router = APIRouter(prefix="/trips", tags=["research"])


@router.get("/{trip_id}/research")
async def get_trip_research(trip_id: str, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    return {"data": {"trip_id": trip_id, "research": None, "sources": []}}
