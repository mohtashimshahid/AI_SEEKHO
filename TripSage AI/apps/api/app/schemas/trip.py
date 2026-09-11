from datetime import date, datetime
from decimal import Decimal
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field


class TripPreferenceSchema(BaseModel):
    interests: List[str] = Field(default_factory=list)
    food_preferences: List[str] = Field(default_factory=list)
    accommodation_type: Optional[str] = "hotel"
    activity_level: Optional[str] = "moderate"
    transport_preference: Optional[str] = "public_transport"
    special_requirements: List[str] = Field(default_factory=list)

    model_config = ConfigDict(from_attributes=True)


# Exact schema matching PRD Section 25
class TripRequest(BaseModel):
    origin: str = Field(..., description="Origin city or airport")
    destination: str = Field(..., description="Destination city or region")
    start_date: date = Field(..., description="Trip start date")
    end_date: date = Field(..., description="Trip end date")
    travelers: int = Field(default=1, ge=1, le=20, description="Number of travelers")
    budget: Decimal = Field(..., gt=0, description="Total budget for the trip")
    currency: str = Field(default="USD", max_length=3, description="Currency code (e.g. USD, EUR, PKR)")
    travel_style: str = Field(default="balanced", description="Travel style: budget, balanced, comfort, luxury")
    interests: List[str] = Field(default_factory=list, description="List of user interests")
    accommodation_preference: str = Field(default="hotel", description="Accommodation style: hotel, hostel, resort, apartment")
    transportation_preference: Optional[str] = Field(default="public_transport", description="Transport preference")

    model_config = ConfigDict(from_attributes=True)


class TripCreate(TripRequest):
    title: Optional[str] = None


class TripUpdate(BaseModel):
    title: Optional[str] = None
    origin: Optional[str] = None
    destination: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    travelers: Optional[int] = Field(default=None, ge=1, le=20)
    budget: Optional[Decimal] = Field(default=None, gt=0)
    currency: Optional[str] = None
    travel_style: Optional[str] = None
    status: Optional[str] = None
    preference: Optional[TripPreferenceSchema] = None

    model_config = ConfigDict(from_attributes=True)


class TripResponse(BaseModel):
    id: str
    user_id: str
    title: str
    origin: str
    destination: str
    start_date: date
    end_date: date
    traveler_count: int
    budget: Decimal
    currency: str
    travel_style: str
    status: str
    created_at: datetime
    updated_at: datetime
    preference: Optional[TripPreferenceSchema] = None

    model_config = ConfigDict(from_attributes=True)


class TripListResponse(BaseModel):
    data: List[TripResponse]
    meta: dict
