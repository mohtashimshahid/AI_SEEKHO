import uuid
from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base

class Course(Base):
    __tablename__ = "courses"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    code: Mapped[str] = mapped_column(String(50), index=True, nullable=False)  # e.g., CS101
    title: Mapped[str] = mapped_column(String(255), index=True, nullable=False) # e.g., Intro to Computer Science
    department: Mapped[str] = mapped_column(String(100), index=True, nullable=True) # e.g., Computer Science

    sections = relationship("Section", back_populates="course", cascade="all, delete-orphan")
