from typing import List, Optional
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.trip import Trip
from app.repositories.trip_repository import TripRepository
from app.schemas.trip import TripCreate, TripUpdate


class TripService:
    def __init__(self, db: AsyncSession):
        self.repo = TripRepository(db)

    async def create_trip(self, user_id: str, data: TripCreate) -> Trip:
        if data.end_date < data.start_date:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Trip end date cannot be before start date.",
            )
        return await self.repo.create(user_id, data)

    async def list_trips(self, user_id: str, skip: int = 0, limit: int = 50) -> tuple[List[Trip], int]:
        trips = await self.repo.list_by_user(user_id, skip=skip, limit=limit)
        total = await self.repo.count_by_user(user_id)
        return trips, total

    async def get_trip(self, trip_id: str, user_id: str) -> Trip:
        trip = await self.repo.get_by_id(trip_id, user_id=user_id)
        if not trip:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Trip not found.",
            )
        return trip

    async def update_trip(self, trip_id: str, user_id: str, data: TripUpdate) -> Trip:
        trip = await self.get_trip(trip_id, user_id)
        if data.start_date and data.end_date:
            if data.end_date < data.start_date:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Trip end date cannot be before start date.",
                )
        return await self.repo.update(trip, data)

    async def delete_trip(self, trip_id: str, user_id: str) -> None:
        trip = await self.get_trip(trip_id, user_id)
        await self.repo.delete(trip)
