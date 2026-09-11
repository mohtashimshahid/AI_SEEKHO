import pytest
from datetime import date, timedelta
from decimal import Decimal
from app.ai.agents.destination_research import run_destination_research
from app.ai.agents.budget import run_budget_analysis
from app.ai.agents.flight_stay import run_flight_stay_analysis
from app.ai.agents.local_experience import run_local_experience_design
from app.ai.agents.trip_orchestrator import TripOrchestratorAgent, run_trip_orchestration
from app.schemas.itinerary import FinalItinerary
from app.schemas.trip import TripRequest


def test_orchestrator_agent_contract_with_all_specialists():
    """
    Contract Test per PRD Section 57:
    Full 5-Agent Sequential Execution:
    Agent 1 (Destination) -> Agent 2 (Budget) -> Agent 3 (Flight/Stay) -> Agent 4 (Experiences) -> Agent 5 (Orchestrator)
    Output: Expected FinalItinerary Schema
    """
    trip_req = TripRequest(
        origin="Lahore, Pakistan",
        destination="Istanbul, Turkey",
        start_date=date.today() + timedelta(days=30),
        end_date=date.today() + timedelta(days=37),
        travelers=2,
        budget=Decimal("1500.00"),
        currency="USD",
        travel_style="balanced",
        interests=["Food", "Culture", "History"],
        accommodation_preference="hotel",
        transportation_preference="public_transport",
    )

    # 1. Run Agent 1: Destination Research
    a1_res = run_destination_research(trip_req)

    # 2. Run Agent 2: Budget Intelligence
    a2_res = run_budget_analysis(trip_req, destination_research=a1_res)

    # 3. Run Agent 3: Flight & Stay
    a3_res = run_flight_stay_analysis(trip_req, destination_research=a1_res, budget_analysis=a2_res)

    # 4. Run Agent 4: Local Experience
    a4_res = run_local_experience_design(
        trip_req,
        destination_research=a1_res,
        budget_analysis=a2_res,
        flight_stay_options=a3_res,
    )

    # 5. Run Agent 5: Trip Orchestrator
    orchestrator = TripOrchestratorAgent()
    itinerary = orchestrator.run(
        trip_request=trip_req,
        destination_research=a1_res,
        budget_analysis=a2_res,
        flight_stay_options=a3_res,
        local_experiences=a4_res,
    )

    # Assertions
    assert isinstance(itinerary, FinalItinerary)
    assert "Istanbul" in itinerary.destination
    assert len(itinerary.trip_summary) > 20
    assert len(itinerary.daily_plan) >= 1
    assert len(itinerary.packing_list) >= 1
    assert len(itinerary.sources) >= 1

    # Authoritative budget check from Agent 2
    assert itinerary.budget_summary.total == a2_res.total
    assert itinerary.budget_summary.per_person == a2_res.per_person
    assert itinerary.confidence in ["HIGH", "MEDIUM", "LOW"]


def test_orchestrator_standalone_dict():
    raw_trip = {
        "origin": "NYC",
        "destination": "London",
        "start_date": "2026-11-01",
        "end_date": "2026-11-08",
        "travelers": 1,
        "budget": 2500.0,
        "currency": "USD",
        "travel_style": "comfort",
    }
    itinerary = run_trip_orchestration(raw_trip)
    assert isinstance(itinerary, FinalItinerary)
    assert len(itinerary.daily_plan) > 0
