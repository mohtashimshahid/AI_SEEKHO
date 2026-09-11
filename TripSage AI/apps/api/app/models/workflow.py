import uuid
from datetime import datetime, timezone
from sqlalchemy import String, DateTime, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base


class WorkflowRun(Base):
    __tablename__ = "workflow_runs"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    trip_id: Mapped[str] = mapped_column(String, ForeignKey("trips.id", ondelete="CASCADE"), index=True, nullable=False)
    
    # Status: DRAFT, READY, QUEUED, RUNNING, COMPLETED, RETRYING, FAILED, CANCELLED
    status: Mapped[str] = mapped_column(String(50), default="QUEUED", index=True)
    current_stage: Mapped[str] = mapped_column(String(50), default="QUEUED")
    
    started_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    error: Mapped[str | None] = mapped_column(Text, nullable=True)
    
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    trip = relationship("Trip", back_populates="workflows")
    agent_runs = relationship("AgentRun", back_populates="workflow_run", cascade="all, delete-orphan")
