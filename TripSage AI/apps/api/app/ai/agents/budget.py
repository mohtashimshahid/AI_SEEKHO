import json
from decimal import Decimal
from typing import Optional, Union
from datetime import date
from app.ai.gateway import OpenAIGateway, gateway as default_gateway
from app.ai.prompts.destination_research import GLOBAL_SYSTEM_PROMPT
from app.ai.prompts.budget import BUDGET_SYSTEM_PROMPT
from app.ai.tools.calculator import calculate_trip_budget
from app.schemas.budget import BudgetAnalysis
from app.schemas.destination import DestinationResearch
from app.schemas.source import Source
from app.schemas.trip import TripRequest


class BudgetAgent:
    """
    Agent 2 — Budget Intelligence Agent (Sections 6, 16, 23 & 25).
    Responsible for deterministic cost estimation, itemization, and financial analysis.
    """

    def __init__(self, gateway: Optional[OpenAIGateway] = None):
        self.gateway = gateway or default_gateway
        self.system_prompt = f"{GLOBAL_SYSTEM_PROMPT}\n\n{BUDGET_SYSTEM_PROMPT}"

    def run(
        self,
        trip_request: Union[TripRequest, dict],
        destination_research: Optional[DestinationResearch] = None,
    ) -> BudgetAnalysis:
        if isinstance(trip_request, dict):
            req = TripRequest.model_validate(trip_request)
        else:
            req = trip_request

        # Calculate trip duration
        duration_days = (req.end_date - req.start_date).days
        if duration_days <= 0:
            duration_days = 7

        # Heuristic cost distribution based on total user budget and travel style
        total_b = float(req.budget)
        travelers = max(1, req.travelers)

        if req.travel_style == "budget":
            flight_est = round(total_b * 0.30, 2)
            stay_est = round(total_b * 0.30, 2)
            food_est = round(total_b * 0.18, 2)
            transport_est = round(total_b * 0.08, 2)
            activities_est = round(total_b * 0.06, 2)
            buffer_est = round(total_b * 0.08, 2)
        elif req.travel_style == "luxury":
            flight_est = round(total_b * 0.35, 2)
            stay_est = round(total_b * 0.35, 2)
            food_est = round(total_b * 0.14, 2)
            transport_est = round(total_b * 0.06, 2)
            activities_est = round(total_b * 0.05, 2)
            buffer_est = round(total_b * 0.05, 2)
        else:  # balanced / comfort
            flight_est = round(total_b * 0.30, 2)
            stay_est = round(total_b * 0.32, 2)
            food_est = round(total_b * 0.16, 2)
            transport_est = round(total_b * 0.08, 2)
            activities_est = round(total_b * 0.06, 2)
            buffer_est = round(total_b * 0.08, 2)

        # 1. Authoritative Deterministic Calculation via Tool (Section 6 & 22)
        calc_result = calculate_trip_budget(
            flights=flight_est,
            accommodation=stay_est,
            food=food_est,
            transport=transport_est,
            activities=activities_est,
            buffer=buffer_est,
            travelers=travelers,
            duration_days=duration_days,
            currency=req.currency,
        )

        # 2. Context Engineering (Section 20)
        user_prompt = f"""TRIP DETAILS:
- Destination: {req.destination}
- Origin: {req.origin}
- Duration: {duration_days} days ({req.start_date} to {req.end_date})
- Travelers: {travelers}
- Total Target Budget: {req.currency} {req.budget}
- Travel Style: {req.travel_style}
- Accommodation Preference: {req.accommodation_preference}

DETERMINISTIC PYTHON CALCULATOR RESULTS:
{json.dumps(calc_result, indent=2)}

TASK:
Analyze the itemized budget, state all calculation assumptions, identify buffer reserves, and return structured BudgetAnalysis output matching the schema."""

        # 3. Gateway generation for structured analysis
        analysis = self.gateway.generate_structured_output(
            system_prompt=self.system_prompt,
            user_prompt=user_prompt,
            schema=BudgetAnalysis,
        )

        # 4. Enforce Authoritative Calculator totals (Prevent LLM hallucinated totals)
        analysis.currency = req.currency.upper()
        analysis.flights = Decimal(str(calc_result["flights"]))
        analysis.accommodation = Decimal(str(calc_result["accommodation"]))
        analysis.food = Decimal(str(calc_result["food"]))
        analysis.transportation = Decimal(str(calc_result["transportation"]))
        analysis.activities = Decimal(str(calc_result["activities"]))
        analysis.buffer = Decimal(str(calc_result["buffer"]))
        analysis.total = Decimal(str(calc_result["total"]))
        analysis.per_person = Decimal(str(calc_result["per_person"]))
        analysis.daily_average = Decimal(str(calc_result["daily_average"]))
        analysis.status = "CALCULATED"

        if not analysis.sources:
            analysis.sources = [
                Source(
                    title="TripSage Deterministic Financial Engine",
                    source_type="SYSTEM_CALCULATION",
                    confidence="HIGH",
                    snippet=f"Itemized budget calculated for {travelers} traveler(s) over {duration_days} days.",
                )
            ]

        return analysis


# Standalone callable function
def run_budget_analysis(
    trip_request: Union[TripRequest, dict],
    destination_research: Optional[DestinationResearch] = None,
    gateway: Optional[OpenAIGateway] = None,
) -> BudgetAnalysis:
    agent = BudgetAgent(gateway=gateway)
    return agent.run(trip_request, destination_research=destination_research)
