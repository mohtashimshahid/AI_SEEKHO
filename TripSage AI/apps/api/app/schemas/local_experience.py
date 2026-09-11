from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field
from app.schemas.source import Source


class Experience(BaseModel):
    title: str = Field(..., description="Name of the activity, restaurant, or experience")
    category: str = Field(..., description="Category: food, culture, hidden_gem, nightlife, adventure, relaxation")
    description: str = Field(..., description="Detailed description of the experience")
    estimated_cost: Optional[str] = Field(default=None, description="Estimated price tag or free")
    neighborhood: Optional[str] = Field(default=None, description="Location / neighborhood")
    best_time_to_visit: Optional[str] = Field(default=None, description="Recommended time of day")
    insider_tip: Optional[str] = Field(default=None, description="Local tip or secret recommendation")
    highlight: bool = Field(default=False, description="Whether this is a must-do highlight")

    model_config = ConfigDict(from_attributes=True)


class LocalExperiences(BaseModel):
    food: List[Experience] = Field(default_factory=list, description="Curated food, restaurants, cafes")
    activities: List[Experience] = Field(default_factory=list, description="Daytime activities and sights")
    hidden_gems: List[Experience] = Field(default_factory=list, description="Off-the-beaten-path recommendations")
    cultural_experiences: List[Experience] = Field(default_factory=list, description="Immersive cultural spots")
    evening_options: List[Experience] = Field(default_factory=list, description="Nightlife and sunset spots")
    recommendation_summary: Optional[str] = Field(default=None, description="Synthesis of local recommendations")
    sources: List[Source] = Field(default_factory=list, description="Evidence sources")

    model_config = ConfigDict(from_attributes=True)
