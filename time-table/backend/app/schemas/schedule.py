from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from app.schemas.catalog import SectionSchema

class SaveScheduleRequest(BaseModel):
    name: str
    section_ids: List[str]

class SavedScheduleResponse(BaseModel):
    id: str
    user_id: str
    name: str
    section_ids: List[str]
    sections: Optional[List[SectionSchema]] = []
    created_at: datetime

    class Config:
        from_attributes = True
