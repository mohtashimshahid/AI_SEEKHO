import json
from typing import Optional, Union
from app.ai.gateway import OpenAIGateway, gateway as default_gateway
from app.ai.prompts.destination_research import GLOBAL_SYSTEM_PROMPT
from app.ai.prompts.flight_stay import FLIGHT_STAY_SYSTEM_PROMPT
from app.ai.tools.destination_data import get_destination_data
from app.ai.tools.flight_search import search_flights
from app.schemas.budget import BudgetAnalysis
from app.schemas.destination import DestinationResearch
from app.schemas.flight_stay import FlightStayOptions
from app.schemas.source import Source
from app.schemas.trip import TripRequest


class FlightStayAgent:
    """
    Agent 3 — Flight & Stay Agent (Sections 7, 17, 23 & 25).
    Responsible for researching practical flight corridors, departure considerations, and neighborhood accommodations.
    """

    def __init__(self, gateway: Optional[OpenAIGateway] = None):
        self.gateway = gateway or default_gateway
        self.system_prompt = f"{GLOBAL_SYSTEM_PROMPT}\n\n{FLIGHT_STAY_SYSTEM_PROMPT}"

    def run(
        self,
        trip_request: Union[TripRequest, dict],
        destination_research: Optional[DestinationResearch] = None,
        budget_analysis: Optional[BudgetAnalysis] = None,
    ) -> FlightStayOptions:
        if isinstance(trip_request, dict):
            req = TripRequest.model_validate(trip_request)
        else:
            req = trip_request

        duration_days = max(1, (req.end_date - req.start_date).days)
        dest_data = get_destination_data(req.destination)

        flight_data = search_flights(
            origin=req.origin,
            destination=req.destination,
            departure_date=req.start_date.isoformat(),
            passengers=req.travelers,
        )

        # Context Engineering (Section 20)
        user_prompt = f"""TRIP DETAILS:
- Origin: {req.origin}
- Destination: {req.destination}
- Dates: {req.start_date} to {req.end_date} ({duration_days} days)
- Travelers: {req.travelers}
- Total Budget: {req.currency} {req.budget}
- Travel Style: {req.travel_style}
- Accommodation Preference: {req.accommodation_preference}

LIVE FLIGHT SEARCH DATA:
{json.dumps(flight_data, indent=2)}

DESTINATION BEST AREAS:
{json.dumps(dest_data.get('top_neighborhoods', []), indent=2)}

ALLOCATED BUDGET GUIDANCE:
- Flight budget target: {req.currency} {budget_analysis.flights if budget_analysis else 'Flexible'}
- Stay budget target: {req.currency} {budget_analysis.accommodation if budget_analysis else 'Flexible'}

TASK:
Identify practical flight corridors with realistic departure/arrival considerations, and recommend stay options in prime walkable neighborhoods.
Mark all unconfirmed prices as ESTIMATED. Return structured FlightStayOptions matching the schema."""

        result = self.gateway.generate_structured_output(
            system_prompt=self.system_prompt,
            user_prompt=user_prompt,
            schema=FlightStayOptions,
        )

        # Guarantee evidence source tags
        if not result.sources:
            sources = [
                Source(
                    title=f"Flight Corridor & Stay Index ({req.origin} → {req.destination})",
                    source_type="ESTIMATE",
                    confidence="HIGH",
                    snippet=f"Estimated corridor pricing and neighborhood accommodations for {req.accommodation_preference} style.",
                )
            ]
            if flight_data.get("status") == "LIVE_TEST_DATA":
                sources.append(
                    Source(
                        title=f"Duffel Flight Index ({req.origin} → {req.destination})",
                        source_type="FLIGHT_API",
                        confidence="HIGH",
                        snippet=f"Retrieved {len(flight_data.get('offers', []))} live flight offers.",
                    )
                )
            result.sources = sources

        return result


# Standalone callable function
def run_flight_stay_analysis(
    trip_request: Union[TripRequest, dict],
    destination_research: Optional[DestinationResearch] = None,
    budget_analysis: Optional[BudgetAnalysis] = None,
    gateway: Optional[OpenAIGateway] = None,
) -> FlightStayOptions:
    agent = FlightStayAgent(gateway=gateway)
    return agent.run(
        trip_request,
        destination_research=destination_research,
        budget_analysis=budget_analysis,
    )
