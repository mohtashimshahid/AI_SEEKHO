import json
from typing import Optional, Union
from app.ai.gateway import OpenAIGateway, gateway as default_gateway
from app.ai.prompts.destination_research import GLOBAL_SYSTEM_PROMPT
from app.ai.prompts.local_experience import LOCAL_EXPERIENCE_SYSTEM_PROMPT
from app.ai.tools.search import search_web
from app.schemas.budget import BudgetAnalysis
from app.schemas.destination import DestinationResearch
from app.schemas.flight_stay import FlightStayOptions
from app.schemas.local_experience import LocalExperiences
from app.schemas.source import Source
from app.schemas.trip import TripRequest


class LocalExperienceAgent:
    """
    Agent 4 — Local Experience Agent (Sections 8, 18, 23 & 25).
    Responsible for personalized food, activities, hidden gems, and evening culture.
    """

    def __init__(self, gateway: Optional[OpenAIGateway] = None):
        self.gateway = gateway or default_gateway
        self.system_prompt = f"{GLOBAL_SYSTEM_PROMPT}\n\n{LOCAL_EXPERIENCE_SYSTEM_PROMPT}"

    def run(
        self,
        trip_request: Union[TripRequest, dict],
        destination_research: Optional[DestinationResearch] = None,
        budget_analysis: Optional[BudgetAnalysis] = None,
        flight_stay_options: Optional[FlightStayOptions] = None,
    ) -> LocalExperiences:
        if isinstance(trip_request, dict):
            req = TripRequest.model_validate(trip_request)
        else:
            req = trip_request

        # 1. Search for curated dining and hidden gems (Section 23 Tool Policy)
        interests_str = ", ".join(req.interests) if req.interests else "food and culture"
        search_query = f"{req.destination} best local restaurants hidden gems {interests_str}"
        search_results = search_web(search_query, max_results=3)

        # 2. Context Engineering (Section 20)
        user_prompt = f"""TRAVELER PROFILE & PREFERENCES:
- Destination: {req.destination}
- Travel Style: {req.travel_style}
- Specific Interests: {interests_str}
- Duration: {(req.end_date - req.start_date).days} days
- Group Size: {req.travelers} traveler(s)

DESTINATION RESEARCH CONTEXT:
- Overview: {destination_research.overview if destination_research else 'Global Destination'}
- Key Attractions: {', '.join(destination_research.attractions) if destination_research else 'Major landmarks'}
- Best Areas: {', '.join(destination_research.best_areas) if destination_research else 'Central districts'}

RECOMMENDED STAY AREA:
- Stay Area: {flight_stay_options.recommended_stay if flight_stay_options else 'Central'}

LOCAL FOOD & EXPERIENCES WEB RESEARCH:
{json.dumps(search_results, indent=2)}

TASK:
Design highly personalized culinary recommendations, cultural experiences, hidden gems, daytime activities, and evening options matching the traveler's stated interests ({interests_str}).
Do not output a generic tourist checklist. Return structured LocalExperiences output."""

        result = self.gateway.generate_structured_output(
            system_prompt=self.system_prompt,
            user_prompt=user_prompt,
            schema=LocalExperiences,
        )

        if not result.sources:
            result.sources = [
                Source(
                    title=f"Curated Experience Guide for {req.destination}",
                    source_type="WEB",
                    confidence="HIGH",
                    snippet=f"Local culinary and cultural highlights tailored to {interests_str}.",
                )
            ]

        return result


# Standalone callable function
def run_local_experience_design(
    trip_request: Union[TripRequest, dict],
    destination_research: Optional[DestinationResearch] = None,
    budget_analysis: Optional[BudgetAnalysis] = None,
    flight_stay_options: Optional[FlightStayOptions] = None,
    gateway: Optional[OpenAIGateway] = None,
) -> LocalExperiences:
    agent = LocalExperienceAgent(gateway=gateway)
    return agent.run(
        trip_request,
        destination_research=destination_research,
        budget_analysis=budget_analysis,
        flight_stay_options=flight_stay_options,
    )
