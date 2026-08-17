import uuid
from datetime import datetime, timezone
from sqlalchemy import String, DateTime, Integer, JSON
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base

class IngestionLog(Base):
    __tablename__ = "ingestion_logs"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    filename: Mapped[str] = mapped_column(String(255), nullable=False)
    status: Mapped[str] = mapped_column(String(50), nullable=False) # SUCCESS, COMPLETED_WITH_WARNINGS, FAILED
    total_rows: Mapped[int] = mapped_column(Integer, default=0)
    parsed_sections: Mapped[int] = mapped_column(Integer, default=0)
    error_count: Mapped[int] = mapped_column(Integer, default=0)
    unparsed_errors: Mapped[dict] = mapped_column(JSON, nullable=True) # JSON list of {row, sheet, reason, raw_data}
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))
