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

DESTINATION BEST AREAS:
{json.dumps(dest_data.get('top_neighborhoods', []), indent=2)}

ALLOCATED BUDGET GUIDANCE:
- Flight budget target: {req.currency} {budget_analysis.flights if budget_analysis else 'Flexible'}
- Stay budget target: {req.currency} {budget_analysis.accommodation if budget_analysis else 'Flexible'}

REAL FLIGHT OFFERS (Duffel test mode — status: {flight_data['status']}):
{json.dumps(flight_data['offers'], indent=2) if flight_data['offers'] else 'No live offers available — fall back to a realistic estimate.'}

TASK:
If real flight offers are listed above, base your flight recommendation on their actual prices and airlines directly rather than inventing numbers, and set price_status to "{flight_data['status']}".
If no offers were returned, fall back to a realistic estimated price and set price_status to "ESTIMATED".
Identify practical flight corridors with realistic departure/arrival considerations, and recommend stay options in prime walkable neighborhoods.
Return structured FlightStayOptions matching the schema."""

        result = self.gateway.generate_structured_output(
            system_prompt=self.system_prompt,
            user_prompt=user_prompt,
            schema=FlightStayOptions,
        )

        # Guarantee evidence source tags
        if not result.sources:
            result.sources = [
                Source(
                    title=f"Flight Corridor & Stay Index ({req.origin} → {req.destination})",
                    source_type="DUFFEL_TEST_API" if flight_data["status"] == "LIVE_TEST_DATA" else "ESTIMATE",
                    confidence="HIGH",
                    snippet=f"{'Live Duffel test-mode offers' if flight_data['status'] == 'LIVE_TEST_DATA' else 'Estimated corridor pricing'} for {req.accommodation_preference} style.",
                )
            ]

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
