import pytest
from datetime import date, timedelta
from fastapi.testclient import TestClient


def test_full_crud_and_auth_lifecycle(client: TestClient):
    # 1. Register User A
    user_a_email = "explorer_a@tripsage.ai"
    user_a_pass = "SecurePass123!"
    reg_a = client.post(
        "/api/v1/auth/register",
        json={"email": user_a_email, "password": user_a_pass, "name": "Traveler Alpha"},
    )
    assert reg_a.status_code == 201
    token_a = reg_a.json()["access_token"]
    headers_a = {"Authorization": f"Bearer {token_a}"}

    # 2. Register User B (for isolation testing)
    user_b_email = "explorer_b@tripsage.ai"
    reg_b = client.post(
        "/api/v1/auth/register",
        json={"email": user_b_email, "password": "SecurePass456!", "name": "Traveler Beta"},
    )
    assert reg_b.status_code == 201
    token_b = reg_b.json()["access_token"]
    headers_b = {"Authorization": f"Bearer {token_b}"}

    # 3. Login User A
    login_a = client.post(
        "/api/v1/auth/login",
        json={"email": user_a_email, "password": user_a_pass},
    )
    assert login_a.status_code == 200
    assert login_a.json()["email"] == user_a_email

    # 4. Verify /me endpoint
    me_res = client.get("/api/v1/auth/me", headers=headers_a)
    assert me_res.status_code == 200
    assert me_res.json()["name"] == "Traveler Alpha"

    # 5. User A creates Trip 1 (Istanbul)
    trip_1_data = {
        "title": "Istanbul Heritage & Culinary Tour",
        "origin": "Lahore, Pakistan",
        "destination": "Istanbul, Turkey",
        "start_date": str(date.today() + timedelta(days=20)),
        "end_date": str(date.today() + timedelta(days=27)),
        "travelers": 2,
        "budget": 1500.00,
        "currency": "USD",
        "travel_style": "balanced",
        "interests": ["Food", "Culture", "History"],
        "accommodation_preference": "hotel",
        "transportation_preference": "public_transport",
    }
    create_1 = client.post("/api/v1/trips", json=trip_1_data, headers=headers_a)
    assert create_1.status_code == 201
    t1 = create_1.json()
    t1_id = t1["id"]
    assert t1["destination"] == "Istanbul, Turkey"
    assert t1["traveler_count"] == 2
    assert t1["preference"]["accommodation_type"] == "hotel"
    assert t1["preference"]["interests"] == ["Food", "Culture", "History"]

    # 6. User A creates Trip 2 (Tokyo)
    trip_2_data = {
        "title": "Tokyo Tech & Gastronomy",
        "origin": "London, UK",
        "destination": "Tokyo, Japan",
        "start_date": str(date.today() + timedelta(days=45)),
        "end_date": str(date.today() + timedelta(days=55)),
        "travelers": 1,
        "budget": 3500.00,
        "currency": "USD",
        "travel_style": "luxury",
        "interests": ["Food", "Photography", "Adventure"],
        "accommodation_preference": "resort",
        "transportation_preference": "metro",
    }
    create_2 = client.post("/api/v1/trips", json=trip_2_data, headers=headers_a)
    assert create_2.status_code == 201
    t2_id = create_2.json()["id"]

    # 7. List Trips for User A
    list_a = client.get("/api/v1/trips", headers=headers_a)
    assert list_a.status_code == 200
    assert list_a.json()["meta"]["total"] == 2
    assert len(list_a.json()["data"]) == 2

    # 8. List Trips for User B (Must be empty — data isolation)
    list_b = client.get("/api/v1/trips", headers=headers_b)
    assert list_b.status_code == 200
    assert list_b.json()["meta"]["total"] == 0
    assert len(list_b.json()["data"]) == 0

    # 9. User B tries to read User A's trip (Must return 404)
    cross_access = client.get(f"/api/v1/trips/{t1_id}", headers=headers_b)
    assert cross_access.status_code == 404

    # 10. User A updates Trip 1 (budget + travel style + preferences)
    update_data = {
        "budget": 2000.00,
        "travel_style": "comfort",
        "preference": {
            "interests": ["Food", "Culture", "Photography", "Nightlife"],
            "accommodation_type": "apartment",
            "activity_level": "high",
            "transport_preference": "walking",
        },
    }
    update_res = client.patch(f"/api/v1/trips/{t1_id}", json=update_data, headers=headers_a)
    assert update_res.status_code == 200
    updated = update_res.json()
    assert float(updated["budget"]) == 2000.00
    assert updated["travel_style"] == "comfort"
    assert updated["preference"]["accommodation_type"] == "apartment"
    assert "Nightlife" in updated["preference"]["interests"]

    # 11. Validation error: End date before start date
    invalid_date_data = {
        "title": "Invalid Dates",
        "origin": "NYC",
        "destination": "Paris",
        "start_date": "2026-12-10",
        "end_date": "2026-12-05",  # Before start date
        "travelers": 2,
        "budget": 1000,
    }
    invalid_res = client.post("/api/v1/trips", json=invalid_date_data, headers=headers_a)
    assert invalid_res.status_code == 400

    # 12. Validation error: Negative budget
    invalid_budget_data = {
        "title": "Invalid Budget",
        "origin": "NYC",
        "destination": "Paris",
        "start_date": "2026-12-01",
        "end_date": "2026-12-05",
        "travelers": 2,
        "budget": -500,  # Invalid
    }
    invalid_budget_res = client.post("/api/v1/trips", json=invalid_budget_data, headers=headers_a)
    assert invalid_budget_res.status_code == 422

    # 13. Trigger Analysis endpoint
    analyze_res = client.post(f"/api/v1/trips/{t1_id}/analyze", headers=headers_a)
    assert analyze_res.status_code == 200
    assert analyze_res.json()["data"]["status"] in ["QUEUED", "RUNNING", "COMPLETED"]

    # 14. Delete Trip 2
    del_res = client.delete(f"/api/v1/trips/{t2_id}", headers=headers_a)
    assert del_res.status_code == 204

    # 15. Verify User A now has only 1 trip
    final_list = client.get("/api/v1/trips", headers=headers_a)
    assert final_list.status_code == 200
    assert final_list.json()["meta"]["total"] == 1
    assert final_list.json()["data"][0]["id"] == t1_id
