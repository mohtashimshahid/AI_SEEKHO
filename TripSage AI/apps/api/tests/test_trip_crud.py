import pytest
from datetime import date, timedelta
from fastapi.testclient import TestClient
from app.services.auth_service import create_access_token


def get_auth_headers(user_id: str = "user-123", email: str = "user1@example.com"):
    token = create_access_token({"sub": user_id, "email": email})
    return {"Authorization": f"Bearer {token}"}


def test_create_and_read_trip(client: TestClient):
    # Register/login user
    register_res = client.post(
        "/api/v1/auth/register",
        json={"email": "tripuser@example.com", "password": "Password123!", "name": "Trip Explorer"},
    )
    assert register_res.status_code == 201
    auth_data = register_res.json()
    token = auth_data["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Create trip matching TripRequest schema (PRD Section 25)
    trip_payload = {
        "title": "Istanbul Exploration",
        "origin": "Lahore, Pakistan",
        "destination": "Istanbul, Turkey",
        "start_date": str(date.today() + timedelta(days=30)),
        "end_date": str(date.today() + timedelta(days=37)),
        "travelers": 2,
        "budget": 1500.00,
        "currency": "USD",
        "travel_style": "balanced",
        "interests": ["Food", "Culture", "History"],
        "accommodation_preference": "hotel",
        "transportation_preference": "public_transport",
    }

    create_res = client.post("/api/v1/trips", json=trip_payload, headers=headers)
    assert create_res.status_code == 201
    trip = create_res.json()
    assert trip["destination"] == "Istanbul, Turkey"
    assert trip["traveler_count"] == 2
    assert float(trip["budget"]) == 1500.00
    assert trip["preference"]["accommodation_type"] == "hotel"
    assert "Food" in trip["preference"]["interests"]

    trip_id = trip["id"]

    # Get single trip
    get_res = client.get(f"/api/v1/trips/{trip_id}", headers=headers)
    assert get_res.status_code == 200
    assert get_res.json()["id"] == trip_id

    # List trips
    list_res = client.get("/api/v1/trips", headers=headers)
    assert list_res.status_code == 200
    list_data = list_res.json()
    assert len(list_data["data"]) >= 1
    assert list_data["meta"]["total"] >= 1

    # Update trip
    update_payload = {
        "budget": 1800.00,
        "travel_style": "comfort",
    }
    patch_res = client.patch(f"/api/v1/trips/{trip_id}", json=update_payload, headers=headers)
    assert patch_res.status_code == 200
    assert float(patch_res.json()["budget"]) == 1800.00
    assert patch_res.json()["travel_style"] == "comfort"

    # Delete trip
    del_res = client.delete(f"/api/v1/trips/{trip_id}", headers=headers)
    assert del_res.status_code == 204

    # Verify deleted
    get_del_res = client.get(f"/api/v1/trips/{trip_id}", headers=headers)
    assert get_del_res.status_code == 404
