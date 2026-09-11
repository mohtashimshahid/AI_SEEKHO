from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field
from app.schemas.source import Source


class DestinationResearch(BaseModel):
    destination: str = Field(..., description="Target destination name")
    overview: str = Field(..., description="High-level destination overview and vibe")
    weather: List[str] = Field(default_factory=list, description="Seasonal weather expectations and temperatures")
    culture: List[str] = Field(default_factory=list, description="Local customs, etiquette, and cultural tips")
    attractions: List[str] = Field(default_factory=list, description="Major landmarks and points of interest")
    transportation: List[str] = Field(default_factory=list, description="Local transit tips (metro, ferries, taxis)")
    best_areas: List[str] = Field(default_factory=list, description="Recommended neighborhoods to stay or visit")
    seasonal_notes: List[str] = Field(default_factory=list, description="Seasonal considerations, holidays, festivals")
    sources: List[Source] = Field(default_factory=list, description="Evidence sources and provenance")
    confidence: str = Field(default="HIGH", description="Confidence level: HIGH, MEDIUM, LOW, INSUFFICIENT")

    model_config = ConfigDict(from_attributes=True)
