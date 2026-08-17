from pydantic import BaseModel
from typing import List, Optional, Any
from datetime import datetime

class UnparsedRowError(BaseModel):
    sheet: str
    row_number: int
    raw_data: dict[str, Any]
    reason: str

class IngestionSummaryResponse(BaseModel):
    id: str
    filename: str
    status: str
    total_rows: int
    parsed_sections: int
    error_count: int
    unparsed_errors: List[UnparsedRowError] = []
    created_at: datetime

    class Config:
        from_attributes = True
