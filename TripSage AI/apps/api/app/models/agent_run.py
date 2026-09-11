import uuid
from datetime import datetime, timezone
from sqlalchemy import String, Integer, Float, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base


class AgentRun(Base):
    __tablename__ = "agent_runs"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    workflow_run_id: Mapped[str] = mapped_column(String, ForeignKey("workflow_runs.id", ondelete="CASCADE"), index=True, nullable=False)
    
    agent_name: Mapped[str] = mapped_column(String(100), nullable=False)
    status: Mapped[str] = mapped_column(String(50), default="WAITING", index=True)
    input_snapshot: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    output_snapshot: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    
    model: Mapped[str | None] = mapped_column(String(100), nullable=True)
    prompt_version: Mapped[str | None] = mapped_column(String(50), nullable=True)
    token_usage: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    duration_ms: Mapped[int | None] = mapped_column(Integer, nullable=True)
    error: Mapped[str | None] = mapped_column(Text, nullable=True)
    
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    workflow_run = relationship("WorkflowRun", back_populates="agent_runs")
    sources = relationship("Source", back_populates="agent_run", cascade="all, delete-orphan")


class Source(Base):
    __tablename__ = "sources"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    trip_id: Mapped[str] = mapped_column(String, ForeignKey("trips.id", ondelete="CASCADE"), index=True, nullable=False)
    agent_run_id: Mapped[str | None] = mapped_column(String, ForeignKey("agent_runs.id", ondelete="SET NULL"), nullable=True)
    
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    url: Mapped[str | None] = mapped_column(Text, nullable=True)
    domain: Mapped[str | None] = mapped_column(String(100), nullable=True)
    source_type: Mapped[str] = mapped_column(String(50), default="WEB")
    retrieved_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    snippet: Mapped[str | None] = mapped_column(Text, nullable=True)
    confidence: Mapped[str] = mapped_column(String(50), default="HIGH")

    agent_run = relationship("AgentRun", back_populates="sources")
