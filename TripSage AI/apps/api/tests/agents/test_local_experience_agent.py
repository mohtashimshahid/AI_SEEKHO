import pytest
from datetime import date, timedelta
from decimal import Decimal
from app.ai.agents.local_experience import LocalExperienceAgent, run_local_experience_design
from app.schemas.local_experience import LocalExperiences
from app.schemas.trip import TripRequest


def test_local_experience_agent_contract():
    """
    Contract Test per PRD Section 57:
    Input: TripRequest (+ optional research context)
    Agent: Local Experience Agent (Agent 4)
    Output: Expected LocalExperiences Schema
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
    )

    agent = LocalExperienceAgent()
    result = agent.run(trip_req)

    # 1. Verify schema contract
    assert isinstance(result, LocalExperiences)

    # 2. Verify experience categories
    assert len(result.food) >= 1
    assert len(result.activities) >= 1
    assert result.food[0].title != ""
    assert result.food[0].description != ""
    assert len(result.sources) >= 1


def test_local_experience_standalone_dict():
    raw_trip = {
        "origin": "London, UK",
        "destination": "Barcelona, Spain",
        "start_date": "2026-09-01",
        "end_date": "2026-09-07",
        "travelers": 2,
        "budget": 1600.0,
        "currency": "EUR",
        "travel_style": "balanced",
        "interests": ["Tapas", "Architecture", "Beach"],
        "accommodation_preference": "hotel",
    }

    res = run_local_experience_design(raw_trip)
    assert isinstance(res, LocalExperiences)
    assert len(res.food) > 0
