from typing import Any, Dict, List, Optional, TypedDict
from app.schemas.destination import DestinationResearch
from app.schemas.budget import BudgetAnalysis
from app.schemas.flight_stay import FlightStayOptions
from app.schemas.local_experience import LocalExperiences
from app.schemas.itinerary import FinalItinerary
from app.schemas.source import Source
from app.schemas.trip import TripRequest


class TripState(TypedDict):
    """
    LangGraph Shared State Schema (PRD Section 11).
    Tracks the full multi-agent trip planning execution state across 4 sequential handoffs.
    """
    trip_id: str
    trip_request: TripRequest
    destination_research: Optional[DestinationResearch]
    budget_analysis: Optional[BudgetAnalysis]
    flight_stay_options: Optional[FlightStayOptions]
    local_experiences: Optional[LocalExperiences]
    final_itinerary: Optional[FinalItinerary]
    current_stage: str
    retry_counts: Dict[str, int]
    errors: List[str]
    sources: List[Source]
    handoff_logs: List[Dict[str, Any]]
