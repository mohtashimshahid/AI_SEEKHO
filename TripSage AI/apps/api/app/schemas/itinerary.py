from decimal import Decimal
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field
from app.schemas.source import Source


class DayActivity(BaseModel):
    time_slot: str = Field(..., description="Time slot, e.g. '09:00 - Morning'")
    title: str = Field(..., description="Activity title")
    description: str = Field(..., description="Details and context")
    location: Optional[str] = Field(default=None, description="Location / neighborhood")
    estimated_cost: Optional[str] = Field(default=None, description="Cost estimate")
    category: str = Field(default="activity", description="food, attraction, transit, rest")

    model_config = ConfigDict(from_attributes=True)


class DayPlan(BaseModel):
    day_number: int = Field(..., description="Day index (1, 2, 3...)")
    date: Optional[str] = Field(default=None, description="Formatted date string")
    theme: str = Field(..., description="Theme of the day, e.g. 'Historic Peninsula & Bosphorus'")
    activities: List[DayActivity] = Field(default_factory=list, description="Ordered schedule of activities")
    food_spots: List[str] = Field(default_factory=list, description="Recommended dining for the day")
    transport_notes: Optional[str] = Field(default=None, description="How to get around on this day")

    model_config = ConfigDict(from_attributes=True)


class BudgetSummary(BaseModel):
    currency: str = Field(default="USD")
    flight: Decimal = Field(default=Decimal("0.00"))
    accommodation: Decimal = Field(default=Decimal("0.00"))
    food: Decimal = Field(default=Decimal("0.00"))
    transportation: Decimal = Field(default=Decimal("0.00"))
    activities: Decimal = Field(default=Decimal("0.00"))
    buffer: Decimal = Field(default=Decimal("0.00"))
    total: Decimal = Field(default=Decimal("0.00"))
    per_person: Decimal = Field(default=Decimal("0.00"))

    model_config = ConfigDict(from_attributes=True)


class FinalItinerary(BaseModel):
    trip_summary: str = Field(..., description="Executive summary of the curated trip")
    destination: str = Field(..., description="Destination name")
    accommodation: str = Field(..., description="Selected accommodation recommendation")
    transportation: List[str] = Field(default_factory=list, description="Practical transit recommendations")
    budget_summary: BudgetSummary = Field(..., description="Itemized financial breakdown")
    daily_plan: List[DayPlan] = Field(default_factory=list, description="Day-by-day scheduled itinerary")
    food_recommendations: List[str] = Field(default_factory=list, description="Highlighted culinary spots")
    activities: List[str] = Field(default_factory=list, description="Key attractions included in the schedule")
    packing_list: List[str] = Field(default_factory=list, description="Essential items and seasonal packing checklist")
    assumptions: List[str] = Field(default_factory=list, description="Assumptions made during synthesis")
    sources: List[Source] = Field(default_factory=list, description="Provenance and reference sources")
    confidence: str = Field(default="HIGH", description="Confidence level: HIGH, MEDIUM, LOW")

    model_config = ConfigDict(from_attributes=True)
