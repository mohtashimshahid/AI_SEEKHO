import pytest
from datetime import date, timedelta
from decimal import Decimal
from app.ai.agents.destination_research import DestinationResearchAgent, run_destination_research
from app.schemas.destination import DestinationResearch
from app.schemas.trip import TripRequest


def test_destination_agent_contract():
    """
    Contract Test per PRD Section 57:
    Input: TripRequest
    Agent: Destination Research Agent (Agent 1)
    Output: Expected DestinationResearch Schema
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

    agent = DestinationResearchAgent()
    result = agent.run(trip_req)

    # 1. Verify schema contract
    assert isinstance(result, DestinationResearch)

    # 2. Verify mandatory fields
    assert "Istanbul" in result.destination
    assert len(result.overview) > 20
    assert len(result.attractions) >= 1
    assert len(result.weather) >= 1
    assert len(result.culture) >= 1
    assert len(result.transportation) >= 1
    assert len(result.best_areas) >= 1
    assert len(result.seasonal_notes) >= 1

    # 3. Verify source provenance preservation (Section 15 requirement)
    assert len(result.sources) >= 1
    assert result.sources[0].title != ""
    assert result.confidence in ["HIGH", "MEDIUM", "LOW", "INSUFFICIENT"]


def test_destination_agent_standalone_dict_input():
    """
    Verify standalone callable with dictionary input.
    """
    raw_trip = {
        "origin": "Tokyo, Japan",
        "destination": "Kyoto, Japan",
        "start_date": "2026-11-01",
        "end_date": "2026-11-06",
        "travelers": 1,
        "budget": 2000.0,
        "currency": "USD",
        "travel_style": "comfort",
        "interests": ["Temples", "Gardens", "Tea"],
        "accommodation_preference": "hotel",
    }

    result = run_destination_research(raw_trip)

    assert isinstance(result, DestinationResearch)
    assert len(result.attractions) > 0
    assert len(result.sources) > 0
