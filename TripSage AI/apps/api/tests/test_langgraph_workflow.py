import pytest
from datetime import date, timedelta
from decimal import Decimal
from fastapi.testclient import TestClient
from app.ai.graph.builder import trip_graph
from app.schemas.destination import DestinationResearch
from app.schemas.budget import BudgetAnalysis
from app.schemas.flight_stay import FlightStayOptions
from app.schemas.local_experience import LocalExperiences
from app.schemas.itinerary import FinalItinerary
from app.schemas.trip import TripRequest


def test_langgraph_direct_execution_with_4_handoffs():
    """
    Test LangGraph State Machine execution directly (Sections 10, 11, 12):
    START -> Destination (A1) -> Handoff #1 -> Budget (A2) -> Handoff #2 -> Flight/Stay (A3)
          -> Handoff #3 -> Local Experiences (A4) -> Handoff #4 -> Orchestrator (A5) -> END
    """
    trip_req = TripRequest(
        origin="Lahore, Pakistan",
        destination="Istanbul, Turkey",
        start_date=date.today() + timedelta(days=25),
        end_date=date.today() + timedelta(days=32),
        travelers=2,
        budget=Decimal("1500.00"),
        currency="USD",
        travel_style="balanced",
        interests=["Food", "Culture", "History"],
        accommodation_preference="hotel",
        transportation_preference="public_transport",
    )

    initial_state = {
        "trip_id": "test-trip-uuid-1234",
        "trip_request": trip_req,
        "destination_research": None,
        "budget_analysis": None,
        "flight_stay_options": None,
        "local_experiences": None,
        "final_itinerary": None,
        "current_stage": "START",
        "retry_counts": {},
        "errors": [],
        "sources": [],
        "handoff_logs": [],
    }

    # Execute graph
    final_state = trip_graph.invoke(initial_state)

    # 1. State assertions
    assert final_state["current_stage"] == "COMPLETED"
    assert len(final_state["errors"]) == 0

    # 2. Check 5 Specialist Outputs
    assert isinstance(final_state["destination_research"], DestinationResearch)
    assert isinstance(final_state["budget_analysis"], BudgetAnalysis)
    assert isinstance(final_state["flight_stay_options"], FlightStayOptions)
    assert isinstance(final_state["local_experiences"], LocalExperiences)
    assert isinstance(final_state["final_itinerary"], FinalItinerary)

    # 3. Check 4 sequential handoffs recorded in logs
    handoff_logs = final_state["handoff_logs"]
    assert len(handoff_logs) >= 5
    stages = [h["stage"] for h in handoff_logs]
    assert "DESTINATION_RESEARCH" in stages
    assert "BUDGET_ANALYSIS" in stages
    assert "FLIGHT_STAY" in stages
    assert "LOCAL_EXPERIENCES" in stages
    assert "ORCHESTRATING" in stages

    # 4. Check deterministic budget math
    budget = final_state["budget_analysis"]
    itinerary = final_state["final_itinerary"]
    assert budget.total == Decimal("1500.00")
    assert itinerary.budget_summary.total == budget.total


def test_api_analyze_trip_endpoint(client: TestClient):
    """
    Test /api/v1/trips/{trip_id}/analyze endpoint triggering the LangGraph state machine.
    """
    # Register & login
    reg = client.post(
        "/api/v1/auth/register",
        json={"email": "graph_runner@tripsage.ai", "password": "Password123!", "name": "Graph Traveler"},
    )
    assert reg.status_code == 201
    token = reg.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Create trip
    trip_payload = {
        "title": "Tokyo Sakura Journey",
        "origin": "London, UK",
        "destination": "Tokyo, Japan",
        "start_date": str(date.today() + timedelta(days=60)),
        "end_date": str(date.today() + timedelta(days=67)),
        "travelers": 2,
        "budget": 3000.00,
        "currency": "USD",
        "travel_style": "comfort",
        "interests": ["Food", "Temples", "Anime"],
        "accommodation_preference": "hotel",
        "transportation_preference": "metro",
    }
    create_res = client.post("/api/v1/trips", json=trip_payload, headers=headers)
    assert create_res.status_code == 201
    trip_id = create_res.json()["id"]

    # Trigger analysis
    analyze_res = client.post(f"/api/v1/trips/{trip_id}/analyze", headers=headers)
    assert analyze_res.status_code == 200
    data = analyze_res.json()["data"]

    assert data["status"] == "COMPLETED"
    assert data["handoff_count"] >= 5
    assert data["final_itinerary"] is not None
    assert "Tokyo" in data["final_itinerary"]["destination"]
    assert len(data["final_itinerary"]["daily_plan"]) >= 1

    # Verify trip status in database updated to COMPLETED
    get_trip = client.get(f"/api/v1/trips/{trip_id}", headers=headers)
    assert get_trip.status_code == 200
    assert get_trip.json()["status"] == "COMPLETED"
