import uuid
from sqlalchemy import String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base

class TimeSlot(Base):
    __tablename__ = "time_slots"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    section_id: Mapped[str] = mapped_column(String(36), ForeignKey("sections.id", ondelete="CASCADE"), index=True, nullable=False)
    day: Mapped[str] = mapped_column(String(20), index=True, nullable=False)  # Monday, Tuesday, etc.
    start_time: Mapped[str] = mapped_column(String(10), nullable=False)        # 08:30
    end_time: Mapped[str] = mapped_column(String(10), nullable=False)          # 09:45
    room: Mapped[str] = mapped_column(String(100), nullable=True)             # e.g., Hall A-101

    section = relationship("Section", back_populates="time_slots")
