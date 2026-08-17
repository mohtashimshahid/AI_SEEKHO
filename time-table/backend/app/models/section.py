import uuid
from sqlalchemy import String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base

class Section(Base):
    __tablename__ = "sections"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    course_id: Mapped[str] = mapped_column(String(36), ForeignKey("courses.id", ondelete="CASCADE"), index=True, nullable=False)
    section_label: Mapped[str] = mapped_column(String(50), nullable=False)  # e.g., Sec-01, Lab-02
    instructor: Mapped[str] = mapped_column(String(255), index=True, nullable=True) # e.g., Dr. Alan Turing

    course = relationship("Course", back_populates="sections")
    time_slots = relationship("TimeSlot", back_populates="section", cascade="all, delete-orphan")
