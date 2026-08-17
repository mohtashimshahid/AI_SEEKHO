from pydantic import BaseModel
from typing import Optional, List

class TimeSlotSchema(BaseModel):
    id: str
    section_id: str
    day: str
    start_time: str
    end_time: str
    room: Optional[str] = None

    class Config:
        from_attributes = True

class SectionSchema(BaseModel):
    id: str
    course_id: str
    section_label: str
    instructor: Optional[str] = None
    time_slots: List[TimeSlotSchema] = []

    class Config:
        from_attributes = True

class CourseSchema(BaseModel):
    id: str
    code: str
    title: str
    department: Optional[str] = None
    sections: List[SectionSchema] = []

    class Config:
        from_attributes = True

class CourseListResponse(BaseModel):
    total: int
    page: int
    limit: int
    courses: List[CourseSchema]
