from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from app.models.trip import Trip, TripPreference
from app.schemas.trip import TripCreate, TripUpdate


class TripRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, trip_id: str, user_id: Optional[str] = None) -> Optional[Trip]:
        query = select(Trip).options(selectinload(Trip.preference)).where(Trip.id == trip_id)
        if user_id:
            query = query.where(Trip.user_id == user_id)
        result = await self.db.execute(query)
        return result.scalars().first()

    async def list_by_user(self, user_id: str, skip: int = 0, limit: int = 50) -> List[Trip]:
        query = (
            select(Trip)
            .options(selectinload(Trip.preference))
            .where(Trip.user_id == user_id)
            .order_by(Trip.created_at.desc())
            .offset(skip)
            .limit(limit)
        )
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def count_by_user(self, user_id: str) -> int:
        query = select(Trip.id).where(Trip.user_id == user_id)
        result = await self.db.execute(query)
        return len(result.scalars().all())

    async def create(self, user_id: str, data: TripCreate) -> Trip:
        trip_title = data.title or f"{data.destination} Adventure"
        
        trip = Trip(
            user_id=user_id,
            title=trip_title,
            origin=data.origin,
            destination=data.destination,
            start_date=data.start_date,
            end_date=data.end_date,
            traveler_count=data.travelers,
            budget=data.budget,
            currency=data.currency,
            travel_style=data.travel_style,
            status="DRAFT",
        )
        self.db.add(trip)
        await self.db.flush()

        preference = TripPreference(
            trip_id=trip.id,
            interests=data.interests,
            food_preferences=[],
            accommodation_type=data.accommodation_preference,
            activity_level="moderate",
            transport_preference=data.transportation_preference or "public_transport",
            special_requirements=[],
        )
        self.db.add(preference)
        await self.db.commit()
        await self.db.refresh(trip)
        
        # Load relationship
        return await self.get_by_id(trip.id, user_id)  # type: ignore

    async def update(self, trip: Trip, data: TripUpdate) -> Trip:
        if data.title is not None:
            trip.title = data.title
        if data.origin is not None:
            trip.origin = data.origin
        if data.destination is not None:
            trip.destination = data.destination
        if data.start_date is not None:
            trip.start_date = data.start_date
        if data.end_date is not None:
            trip.end_date = data.end_date
        if data.travelers is not None:
            trip.traveler_count = data.travelers
        if data.budget is not None:
            trip.budget = data.budget
        if data.currency is not None:
            trip.currency = data.currency
        if data.travel_style is not None:
            trip.travel_style = data.travel_style
        if data.status is not None:
            trip.status = data.status

        if data.preference and trip.preference:
            if data.preference.interests is not None:
                trip.preference.interests = data.preference.interests
            if data.preference.food_preferences is not None:
                trip.preference.food_preferences = data.preference.food_preferences
            if data.preference.accommodation_type is not None:
                trip.preference.accommodation_type = data.preference.accommodation_type
            if data.preference.activity_level is not None:
                trip.preference.activity_level = data.preference.activity_level
            if data.preference.transport_preference is not None:
                trip.preference.transport_preference = data.preference.transport_preference

        await self.db.commit()
        await self.db.refresh(trip)
        return trip

    async def delete(self, trip: Trip) -> None:
        await self.db.delete(trip)
        await self.db.commit()
