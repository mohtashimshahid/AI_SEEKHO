import uuid
from datetime import date, datetime, timezone
from decimal import Decimal
from typing import Optional, List
from sqlalchemy import String, Integer, Numeric, Date, DateTime, ForeignKey, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base


class Trip(Base):
    __tablename__ = "trips"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[str] = mapped_column(String, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    origin: Mapped[str] = mapped_column(String(255), nullable=False)
    destination: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    start_date: Mapped[date] = mapped_column(Date, nullable=False)
    end_date: Mapped[date] = mapped_column(Date, nullable=False)
    traveler_count: Mapped[int] = mapped_column(Integer, default=1)
    budget: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    currency: Mapped[str] = mapped_column(String(3), default="USD")
    travel_style: Mapped[str] = mapped_column(String(50), default="balanced")
    
    # Status: DRAFT, QUEUED, ANALYZING, COMPLETED, FAILED
    status: Mapped[str] = mapped_column(String(50), default="DRAFT", index=True)
    
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    user = relationship("User", back_populates="trips")
    preference = relationship("TripPreference", back_populates="trip", uselist=False, cascade="all, delete-orphan")
    workflows = relationship("WorkflowRun", back_populates="trip", cascade="all, delete-orphan")
    itineraries = relationship("ItineraryModel", back_populates="trip", cascade="all, delete-orphan")


class TripPreference(Base):
    __tablename__ = "trip_preferences"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    trip_id: Mapped[str] = mapped_column(String, ForeignKey("trips.id", ondelete="CASCADE"), unique=True, nullable=False)
    
    interests: Mapped[list] = mapped_column(JSON, default=list)
    food_preferences: Mapped[list] = mapped_column(JSON, default=list)
    accommodation_type: Mapped[str | None] = mapped_column(String(100), default="hotel")
    activity_level: Mapped[str | None] = mapped_column(String(50), default="moderate")
    transport_preference: Mapped[str | None] = mapped_column(String(100), default="public_transport")
    special_requirements: Mapped[list] = mapped_column(JSON, default=list)

    trip = relationship("Trip", back_populates="preference")
