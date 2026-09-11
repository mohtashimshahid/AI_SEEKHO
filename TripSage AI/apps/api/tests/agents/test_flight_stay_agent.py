import pytest
from datetime import date, timedelta
from decimal import Decimal
from app.ai.agents.flight_stay import FlightStayAgent, run_flight_stay_analysis
from app.schemas.flight_stay import FlightStayOptions
from app.schemas.trip import TripRequest


def test_flight_stay_agent_contract():
    """
    Contract Test per PRD Section 57:
    Input: TripRequest (+ optional previous agent state)
    Agent: Flight & Stay Agent (Agent 3)
    Output: Expected FlightStayOptions Schema
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
        interests=["Food", "Culture"],
        accommodation_preference="hotel",
    )

    agent = FlightStayAgent()
    result = agent.run(trip_req)

    # 1. Verify schema contract
    assert isinstance(result, FlightStayOptions)

    # 2. Verify options
    assert len(result.flight_options) >= 1
    assert len(result.stay_options) >= 1
    assert result.recommended_flight is not None
    assert result.recommended_stay is not None
    assert result.price_status in ["ESTIMATED", "MOCK", "LIVE"]
    assert len(result.sources) >= 1


def test_flight_stay_standalone_dict():
    raw_trip = {
        "origin": "Paris, France",
        "destination": "Rome, Italy",
        "start_date": "2026-10-15",
        "end_date": "2026-10-20",
        "travelers": 2,
        "budget": 1200.0,
        "currency": "EUR",
        "travel_style": "budget",
        "accommodation_preference": "apartment",
    }

    res = run_flight_stay_analysis(raw_trip)
    assert isinstance(res, FlightStayOptions)
    assert len(res.stay_options) > 0
