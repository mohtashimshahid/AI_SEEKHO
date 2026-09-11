from decimal import Decimal
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field
from app.schemas.source import Source


class BudgetAnalysis(BaseModel):
    currency: str = Field(default="USD", max_length=3, description="Currency code (e.g. USD, EUR)")
    flights: Decimal = Field(default=Decimal("0.00"), description="Estimated flights cost")
    accommodation: Decimal = Field(default=Decimal("0.00"), description="Estimated accommodation cost")
    food: Decimal = Field(default=Decimal("0.00"), description="Estimated dining & grocery cost")
    transportation: Decimal = Field(default=Decimal("0.00"), description="Estimated local transport cost")
    activities: Decimal = Field(default=Decimal("0.00"), description="Estimated activities & tickets cost")
    buffer: Decimal = Field(default=Decimal("0.00"), description="Emergency contingency buffer")
    total: Decimal = Field(default=Decimal("0.00"), description="Calculated total trip cost")
    per_person: Decimal = Field(default=Decimal("0.00"), description="Calculated cost per traveler")
    daily_average: Optional[Decimal] = Field(default=None, description="Calculated daily average expense")
    status: str = Field(default="CALCULATED", description="Status: CALCULATED, ESTIMATE, FACT, ASSUMPTION")
    calculation_notes: List[str] = Field(default_factory=list, description="Assumptions and calculation breakdown notes")
    sources: List[Source] = Field(default_factory=list, description="Evidence sources")

    model_config = ConfigDict(from_attributes=True)
