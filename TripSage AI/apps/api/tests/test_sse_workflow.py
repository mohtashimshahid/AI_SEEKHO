import json
from datetime import date, timedelta
from fastapi.testclient import TestClient
from app.services.workflow_stream_manager import stream_manager


def test_workflow_stream_manager_pubsub():
    """
    Unit test for WorkflowStreamManager event broadcasting and replay.
    """
    manager = stream_manager
    run_id = "test-run-12345"

    manager.publish_event(run_id, "workflow_started", {"stage": "START", "status": "RUNNING"})
    manager.publish_event(run_id, "agent_started", {"agent_id": "01", "agent_name": "Destination Research Agent"})
    manager.publish_event(run_id, "handoff", {"handoff_index": 1, "from_agent": "Destination Research", "to_agent": "Budget"})

    history = manager.get_history(run_id)
    assert len(history) == 3
    assert history[0]["event"] == "workflow_started"
    assert history[1]["event"] == "agent_started"
    assert history[2]["event"] == "handoff"


def test_sse_endpoint_and_analysis_lifecycle(client: TestClient):
    """
    Tests SSE endpoint /api/v1/workflows/{run_id}/events and workflow execution.
    """
    # 1. Register User
    reg_payload = {
        "email": "sse_test@tripsage.ai",
        "password": "Password123!",
        "name": "SSE Explorer",
    }
    reg_res = client.post("/api/v1/auth/register", json=reg_payload)
    assert reg_res.status_code == 201
    token = reg_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Create Trip
    trip_payload = {
        "title": "Kyoto Zen & Gardens",
        "origin": "San Francisco (SFO)",
        "destination": "Kyoto, Japan",
        "start_date": str(date.today() + timedelta(days=60)),
        "end_date": str(date.today() + timedelta(days=67)),
        "travelers": 2,
        "budget": 3800.00,
        "currency": "USD",
        "travel_style": "comfort",
        "interests": ["Culture", "Food", "Gardens", "Photography"],
        "accommodation_preference": "hotel",
        "transportation_preference": "train",
    }
    create_res = client.post("/api/v1/trips", json=trip_payload, headers=headers)
    assert create_res.status_code == 201
    trip_id = create_res.json()["id"]

    # 3. Trigger Analysis
    analyze_res = client.post(f"/api/v1/trips/{trip_id}/analyze", headers=headers)
    assert analyze_res.status_code == 200
    run_id = analyze_res.json()["data"]["workflow_run_id"]
    assert analyze_res.json()["data"]["status"] == "COMPLETED"

    # 4. Read SSE Events Stream
    sse_res = client.get(f"/api/v1/workflows/{run_id}/events")
    assert sse_res.status_code == 200
    assert "text/event-stream" in sse_res.headers["content-type"]
    
    events_text = sse_res.text
    assert "event: workflow_started" in events_text
    assert "event: agent_started" in events_text
    assert "event: agent_completed" in events_text
    assert "event: handoff" in events_text
    assert "event: workflow_completed" in events_text
    assert "event: done" in events_text
