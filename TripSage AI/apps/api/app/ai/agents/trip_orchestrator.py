import json
from typing import List, Optional, Union
from app.ai.gateway import OpenAIGateway, gateway as default_gateway
from app.ai.prompts.destination_research import GLOBAL_SYSTEM_PROMPT
from app.ai.prompts.orchestrator import ORCHESTRATOR_SYSTEM_PROMPT
from app.schemas.budget import BudgetAnalysis
from app.schemas.destination import DestinationResearch
from app.schemas.flight_stay import FlightStayOptions
from app.schemas.itinerary import BudgetSummary, FinalItinerary
from app.schemas.local_experience import LocalExperiences
from app.schemas.source import Source
from app.schemas.trip import TripRequest


class TripOrchestratorAgent:
    """
    Agent 5 — Trip Orchestrator (Sections 9, 19, 23 & 25).
    Synthesizes the outputs of Agents 1-4 into a coherent, evidence-aware final travel plan.
    Does NOT behave like another research agent.
    """

    def __init__(self, gateway: Optional[OpenAIGateway] = None):
        self.gateway = gateway or default_gateway
        self.system_prompt = f"{GLOBAL_SYSTEM_PROMPT}\n\n{ORCHESTRATOR_SYSTEM_PROMPT}"

    def run(
        self,
        trip_request: Union[TripRequest, dict],
        destination_research: Optional[DestinationResearch] = None,
        budget_analysis: Optional[BudgetAnalysis] = None,
        flight_stay_options: Optional[FlightStayOptions] = None,
        local_experiences: Optional[LocalExperiences] = None,
    ) -> FinalItinerary:
        if isinstance(trip_request, dict):
            req = TripRequest.model_validate(trip_request)
        else:
            req = trip_request

        duration_days = max(1, (req.end_date - req.start_date).days)

        # 1. Collect and deduplicate all specialist source citations (Section 19: Preserve source provenance)
        all_sources: List[Source] = []
        seen_titles = set()

        for source_list in [
            destination_research.sources if destination_research else [],
            budget_analysis.sources if budget_analysis else [],
            flight_stay_options.sources if flight_stay_options else [],
            local_experiences.sources if local_experiences else [],
        ]:
            for s in source_list:
                if s.title not in seen_titles:
                    seen_titles.add(s.title)
                    all_sources.append(s)

        # 2. Package specialist outputs into synthesis context (Context Engineering Section 20)
        context_payload = {
            "trip_request": req.model_dump(mode="json"),
            "destination_research": destination_research.model_dump(mode="json") if destination_research else {},
            "budget_analysis": budget_analysis.model_dump(mode="json") if budget_analysis else {},
            "flight_stay_options": flight_stay_options.model_dump(mode="json") if flight_stay_options else {},
            "local_experiences": local_experiences.model_dump(mode="json") if local_experiences else {},
        }

        user_prompt = f"""SPECIALIST INTELLIGENCE FINDINGS:
{json.dumps(context_payload, indent=2, default=str)}

TASK FOR ORCHESTRATOR:
Synthesize the above specialist findings into a coherent, day-by-day itinerary ({duration_days} days).
- Align activities and dining spots to realistic time slots.
- Respect the calculated budget: {budget_analysis.currency if budget_analysis else req.currency} {budget_analysis.total if budget_analysis else req.budget}.
- Incorporate the recommended accommodation: {flight_stay_options.recommended_stay if flight_stay_options else 'Central hotel'}.
- Include seasonal packing checklist and realistic transit notes.
- Explicitly state assumptions and retain source citations.
Return structured FinalItinerary output matching the schema."""

        result = self.gateway.generate_structured_output(
            system_prompt=self.system_prompt,
            user_prompt=user_prompt,
            schema=FinalItinerary,
        )

        # 3. Guarantee authoritative budget alignment from Agent 2
        if budget_analysis:
            result.budget_summary = BudgetSummary(
                currency=budget_analysis.currency,
                flight=budget_analysis.flights,
                accommodation=budget_analysis.accommodation,
                food=budget_analysis.food,
                transportation=budget_analysis.transportation,
                activities=budget_analysis.activities,
                buffer=budget_analysis.buffer,
                total=budget_analysis.total,
                per_person=budget_analysis.per_person,
            )

        # 4. Attach combined source citations
        if all_sources:
            result.sources = all_sources

        return result


# Standalone callable function
def run_trip_orchestration(
    trip_request: Union[TripRequest, dict],
    destination_research: Optional[DestinationResearch] = None,
    budget_analysis: Optional[BudgetAnalysis] = None,
    flight_stay_options: Optional[FlightStayOptions] = None,
    local_experiences: Optional[LocalExperiences] = None,
    gateway: Optional[OpenAIGateway] = None,
) -> FinalItinerary:
    agent = TripOrchestratorAgent(gateway=gateway)
    return agent.run(
        trip_request=trip_request,
        destination_research=destination_research,
        budget_analysis=budget_analysis,
        flight_stay_options=flight_stay_options,
        local_experiences=local_experiences,
    )
