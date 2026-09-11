import pytest
from fastapi.testclient import TestClient
from app.services.auth_service import create_access_token, verify_password, get_password_hash


def test_health_check(client: TestClient):
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "TripSage" in data["app"]


def test_password_hashing():
    password = "SuperSecretPassword123!"
    hashed = get_password_hash(password)
    assert hashed != password
    assert verify_password(password, hashed) is True
    assert verify_password("WrongPassword", hashed) is False


def test_jwt_token_generation():
    token = create_access_token({"sub": "user-123", "email": "test@example.com"})
    assert isinstance(token, str)
    assert len(token) > 20


def test_protected_route_unauthorized(client: TestClient):
    response = client.get("/api/v1/auth/me")
    assert response.status_code == 401
