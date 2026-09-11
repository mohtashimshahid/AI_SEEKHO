import uuid
from datetime import datetime, timezone
from sqlalchemy import String, Integer, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base


class DestinationResearchModel(Base):
    __tablename__ = "destination_research"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    trip_id: Mapped[str] = mapped_column(String, ForeignKey("trips.id", ondelete="CASCADE"), unique=True, nullable=False)
    
    overview: Mapped[str] = mapped_column(Text, nullable=False)
    weather: Mapped[list] = mapped_column(JSON, default=list)
    culture: Mapped[list] = mapped_column(JSON, default=list)
    attractions: Mapped[list] = mapped_column(JSON, default=list)
    transportation: Mapped[list] = mapped_column(JSON, default=list)
    best_areas: Mapped[list] = mapped_column(JSON, default=list)
    seasonal_notes: Mapped[list] = mapped_column(JSON, default=list)
    confidence: Mapped[str] = mapped_column(String(50), default="HIGH")
    
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))


class BudgetAnalysisModel(Base):
    __tablename__ = "budget_analysis"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    trip_id: Mapped[str] = mapped_column(String, ForeignKey("trips.id", ondelete="CASCADE"), unique=True, nullable=False)
    
    currency: Mapped[str] = mapped_column(String(3), default="USD")
    flight_cost: Mapped[float] = mapped_column(JSON, default=0.0)
    stay_cost: Mapped[float] = mapped_column(JSON, default=0.0)
    food_cost: Mapped[float] = mapped_column(JSON, default=0.0)
    transport_cost: Mapped[float] = mapped_column(JSON, default=0.0)
    activity_cost: Mapped[float] = mapped_column(JSON, default=0.0)
    buffer_cost: Mapped[float] = mapped_column(JSON, default=0.0)
    total_cost: Mapped[float] = mapped_column(JSON, default=0.0)
    per_person_cost: Mapped[float] = mapped_column(JSON, default=0.0)
    status: Mapped[str] = mapped_column(String(50), default="CALCULATED")
    
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))


class FlightStayOptionModel(Base):
    __tablename__ = "flight_stay_options"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    trip_id: Mapped[str] = mapped_column(String, ForeignKey("trips.id", ondelete="CASCADE"), unique=True, nullable=False)
    
    flight_options: Mapped[list] = mapped_column(JSON, default=list)
    stay_options: Mapped[list] = mapped_column(JSON, default=list)
    recommended_flight: Mapped[str | None] = mapped_column(Text, nullable=True)
    recommended_stay: Mapped[str | None] = mapped_column(Text, nullable=True)
    price_status: Mapped[str] = mapped_column(String(50), default="ESTIMATED")
    
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))


class LocalExperienceModel(Base):
    __tablename__ = "local_experiences"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    trip_id: Mapped[str] = mapped_column(String, ForeignKey("trips.id", ondelete="CASCADE"), unique=True, nullable=False)
    
    food: Mapped[list] = mapped_column(JSON, default=list)
    activities: Mapped[list] = mapped_column(JSON, default=list)
    hidden_gems: Mapped[list] = mapped_column(JSON, default=list)
    culture: Mapped[list] = mapped_column(JSON, default=list)
    nightlife: Mapped[list] = mapped_column(JSON, default=list)
    
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))


class ItineraryModel(Base):
    __tablename__ = "itineraries"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    trip_id: Mapped[str] = mapped_column(String, ForeignKey("trips.id", ondelete="CASCADE"), index=True, nullable=False)
    
    summary: Mapped[str] = mapped_column(Text, nullable=False)
    destination: Mapped[str] = mapped_column(String(255), nullable=False)
    accommodation: Mapped[str | None] = mapped_column(Text, nullable=True)
    daily_plan: Mapped[list] = mapped_column(JSON, default=list)
    transportation: Mapped[list] = mapped_column(JSON, default=list)
    food: Mapped[list] = mapped_column(JSON, default=list)
    activities: Mapped[list] = mapped_column(JSON, default=list)
    packing_list: Mapped[list] = mapped_column(JSON, default=list)
    assumptions: Mapped[list] = mapped_column(JSON, default=list)
    confidence: Mapped[str] = mapped_column(String(50), default="HIGH")
    version: Mapped[int] = mapped_column(Integer, default=1)
    
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    trip = relationship("Trip", back_populates="itineraries")
