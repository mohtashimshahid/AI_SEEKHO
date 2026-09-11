from decimal import Decimal
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field
from app.schemas.source import Source


class FlightOption(BaseModel):
    airline: str = Field(..., description="Airline name")
    origin: str = Field(..., description="Origin airport or city")
    destination: str = Field(..., description="Destination airport or city")
    departure_time: Optional[str] = Field(default=None, description="Estimated departure time")
    arrival_time: Optional[str] = Field(default=None, description="Estimated arrival time")
    price_estimate: Decimal = Field(..., description="Estimated ticket price per person")
    currency: str = Field(default="USD", description="Currency code")
    stops: int = Field(default=0, description="Number of layovers/stops")
    booking_type: str = Field(default="ESTIMATED", description="ESTIMATED, MOCK, or VERIFIED")
    notes: Optional[str] = Field(default=None, description="Baggage or flight details")

    model_config = ConfigDict(from_attributes=True)


class StayOption(BaseModel):
    name: str = Field(..., description="Hotel, apartment, or stay name")
    neighborhood: str = Field(..., description="Area or neighborhood")
    accommodation_type: str = Field(default="hotel", description="hotel, apartment, hostel, resort")
    price_per_night: Decimal = Field(..., description="Estimated nightly rate")
    currency: str = Field(default="USD", description="Currency code")
    rating: Optional[float] = Field(default=None, description="Guest rating (e.g. 4.7)")
    amenities: List[str] = Field(default_factory=list, description="Key amenities included")
    location_advantage: Optional[str] = Field(default=None, description="Why this location is great")
    booking_type: str = Field(default="ESTIMATED", description="ESTIMATED, MOCK, or VERIFIED")

    model_config = ConfigDict(from_attributes=True)


class FlightStayOptions(BaseModel):
    flight_options: List[FlightOption] = Field(default_factory=list, description="Researched flight options")
    stay_options: List[StayOption] = Field(default_factory=list, description="Researched accommodation options")
    recommended_flight: Optional[str] = Field(default=None, description="Recommended flight summary")
    recommended_stay: Optional[str] = Field(default=None, description="Recommended accommodation summary")
    price_status: str = Field(default="ESTIMATED", description="Price status: ESTIMATED, MOCK, or LIVE")
    sources: List[Source] = Field(default_factory=list, description="Evidence sources")

    model_config = ConfigDict(from_attributes=True)
