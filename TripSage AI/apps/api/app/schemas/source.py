from datetime import datetime, timezone
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field


class Source(BaseModel):
    title: str = Field(..., description="Title of the reference or webpage")
    url: Optional[str] = Field(default=None, description="URL of the source")
    domain: Optional[str] = Field(default=None, description="Domain name (e.g. lonelyplanet.com)")
    source_type: str = Field(default="WEB", description="Source type: WEB, DATA_LOOKUP, SYSTEM_CALCULATION, ESTIMATE")
    retrieved_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), description="Timestamp of retrieval")
    snippet: Optional[str] = Field(default=None, description="Relevant excerpt from the source")
    confidence: str = Field(default="HIGH", description="Confidence level: HIGH, MEDIUM, LOW, INSUFFICIENT")

    model_config = ConfigDict(from_attributes=True)
