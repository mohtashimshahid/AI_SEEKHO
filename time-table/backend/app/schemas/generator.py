from pydantic import BaseModel, Field
from typing import List, Optional
from app.schemas.catalog import SectionSchema

class SchedulePreferences(BaseModel):
    earliest_start: Optional[str] = Field("08:00", description="Earliest time allowed e.g. 08:30")
    latest_end: Optional[str] = Field("20:00", description="Latest time allowed e.g. 17:00")
    free_days: Optional[List[str]] = Field(default_factory=list, description="Preferred free days e.g. ['Friday']")
    max_gap_minutes: Optional[int] = Field(120, description="Maximum gap between classes in minutes")
    minimize_gaps: Optional[bool] = True
    preferred_instructors: Optional[List[str]] = Field(default_factory=list, description="Preferred instructors")

class GenerateRequest(BaseModel):
    course_ids: List[str] = Field(..., min_length=1, description="List of selected course IDs")
    locked_section_ids: Optional[List[str]] = Field(default_factory=list, description="Locked section IDs")
    preferences: Optional[SchedulePreferences] = Field(default_factory=SchedulePreferences)

class TimetableOption(BaseModel):
    id: str
    rank: int
    score: float
    sections: List[SectionSchema]
    has_conflicts: bool = False
    conflict_notes: Optional[List[str]] = None
    preference_match_details: dict

class GenerateResponse(BaseModel):
    total_found: int
    returned_count: int
    execution_time_ms: float
    options: List[TimetableOption]

# Manual Schedule Builder Conflict Detection Schemas (M2)
class ConflictCheckRequest(BaseModel):
    section_ids: List[str] = Field(..., description="List of manually selected section IDs")

class ConflictDetail(BaseModel):
    section1_id: str
    section1_label: str
    course1_code: str
    section2_id: str
    section2_label: str
    course2_code: str
    day: str
    overlap_start: str
    overlap_end: str
    message: str

class ConflictCheckResponse(BaseModel):
    has_conflicts: bool
    conflicting_section_ids: List[str]
    conflicts: List[ConflictDetail]
