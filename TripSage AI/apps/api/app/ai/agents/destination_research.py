import json
from typing import Optional, Union
from datetime import datetime, timezone
from app.ai.gateway import OpenAIGateway, gateway as default_gateway
from app.ai.prompts.destination_research import GLOBAL_SYSTEM_PROMPT, DESTINATION_RESEARCH_SYSTEM_PROMPT
from app.ai.tools.destination_data import get_destination_data
from app.ai.tools.search import search_web
from app.schemas.destination import DestinationResearch
from app.schemas.source import Source
from app.schemas.trip import TripRequest


class DestinationResearchAgent:
    """
    Agent 1 — Destination Research Agent (Sections 5, 15, 23 & 25).
    Responsible exclusively for destination intelligence, attractions, weather, culture, and transit.
    """

    def __init__(self, gateway: Optional[OpenAIGateway] = None):
        self.gateway = gateway or default_gateway
        self.system_prompt = f"{GLOBAL_SYSTEM_PROMPT}\n\n{DESTINATION_RESEARCH_SYSTEM_PROMPT}"

    def run(self, trip_request: Union[TripRequest, dict]) -> DestinationResearch:
        """
        Execute Destination Research standalone for a given TripRequest.
        """
        if isinstance(trip_request, dict):
            req = TripRequest.model_validate(trip_request)
        else:
            req = trip_request

        # 1. Execute Approved Tools (Section 23 Tool Policy: Data Lookup + Web Search)
        destination_data = get_destination_data(req.destination)
        search_query = f"{req.destination} travel guide weather attractions transportation {req.travel_style}"
        search_results = search_web(search_query, max_results=3)

        # 2. Collect Evidence Sources
        sources = []
        if destination_data.get("status") == "STRUCTURED_FACTS_FOUND":
            sources.append(
                Source(
                    title=f"TripSage Knowledge Base: {destination_data.get('destination', req.destination)}",
                    source_type="DATA_LOOKUP",
                    confidence="HIGH",
                    snippet=f"Verified climate, transit, and landmark data for {req.destination}.",
                )
            )

        for res in search_results.get("results", []):
            sources.append(
                Source(
                    title=res.get("title", f"Travel Guide {req.destination}"),
                    url=res.get("url"),
                    domain=res.get("domain"),
                    source_type="WEB",
                    confidence="HIGH",
                    snippet=res.get("snippet"),
                )
            )

        # 3. Context Engineering (Section 20)
        user_prompt = f"""TRIP REQUEST DETAILS:
- Destination: {req.destination}
- Origin: {req.origin}
- Travel Dates: {req.start_date} to {req.end_date}
- Number of Travelers: {req.travelers}
- Travel Style: {req.travel_style}
- User Interests: {', '.join(req.interests) if req.interests else 'General Exploration'}
- Accommodation Style: {req.accommodation_preference}

STRUCTURED DESTINATION FACTS:
{json.dumps(destination_data, indent=2)}

WEB SEARCH RESEARCH FINDINGS:
{json.dumps(search_results, indent=2)}

TASK:
Research the destination overview, weather expectations, cultural etiquette, major attractions, local transportation, best areas to stay, and seasonal considerations.
Return structured DestinationResearch output matching the schema."""

        # 4. Generate structured output via Gateway
        research_result = self.gateway.generate_structured_output(
            system_prompt=self.system_prompt,
            user_prompt=user_prompt,
            schema=DestinationResearch,
        )

        # 5. Ensure sources are populated
        if not research_result.sources and sources:
            research_result.sources = sources

        return research_result


# Standalone callable function
def run_destination_research(trip_request: Union[TripRequest, dict], gateway: Optional[OpenAIGateway] = None) -> DestinationResearch:
    agent = DestinationResearchAgent(gateway=gateway)
    return agent.run(trip_request)
