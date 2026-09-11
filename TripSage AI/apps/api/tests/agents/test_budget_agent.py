import pytest
from datetime import date, timedelta
from decimal import Decimal
from app.ai.agents.budget import BudgetAgent, run_budget_analysis
from app.schemas.budget import BudgetAnalysis
from app.schemas.trip import TripRequest


def test_budget_agent_contract():
    """
    Contract Test per PRD Section 57:
    Input: TripRequest
    Agent: Budget Agent (Agent 2)
    Output: Expected BudgetAnalysis Schema with Exact Deterministic Math
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

    agent = BudgetAgent()
    result = agent.run(trip_req)

    # 1. Verify schema contract
    assert isinstance(result, BudgetAnalysis)

    # 2. Verify deterministic math exactness (Sum of all itemized categories == Total)
    expected_sum = (
        result.flights
        + result.accommodation
        + result.food
        + result.transportation
        + result.activities
        + result.buffer
    )
    assert result.total == expected_sum
    assert result.total == Decimal("1500.00")
    assert result.per_person == Decimal("750.00")
    assert result.status == "CALCULATED"
    assert result.currency == "USD"
    assert len(result.sources) >= 1


def test_budget_agent_standalone_dict_input():
    raw_trip = {
        "origin": "NYC, USA",
        "destination": "London, UK",
        "start_date": "2026-10-01",
        "end_date": "2026-10-11",
        "travelers": 1,
        "budget": 3000.00,
        "currency": "GBP",
        "travel_style": "luxury",
        "interests": ["Theater", "Dining"],
        "accommodation_preference": "hotel",
    }

    result = run_budget_analysis(raw_trip)
    assert isinstance(result, BudgetAnalysis)
    assert result.currency == "GBP"
    assert result.total == Decimal("3000.00")
    assert result.per_person == Decimal("3000.00")
