import httpx
from typing import Optional
from app.config import settings

DUFFEL_ROOT = "https://api.duffel.com"
HEADERS = {
    "Authorization": f"Bearer {settings.DUFFEL_API_KEY}",
    "Duffel-Version": "v2",
    "Content-Type": "application/json",
    "Accept": "application/json",
}


def resolve_iata_code(place_name: str) -> Optional[str]:
    """Resolve a free-text city/airport name to an IATA code via Duffel's place suggestions."""
    if not settings.DUFFEL_API_KEY or settings.MOCK_AI:
        return None
    try:
        with httpx.Client(timeout=10.0) as client:
            resp = client.get(
                f"{DUFFEL_ROOT}/places/suggestions",
                params={"query": place_name},
                headers=HEADERS,
            )
            resp.raise_for_status()
            results = resp.json().get("data", [])
            return results[0]["iata_code"] if results else None
    except Exception:
        return None


def search_flights(origin: str, destination: str, departure_date: str, passengers: int = 1) -> dict:
    """
    Search flight offers via Duffel test mode.
    Never raises — returns status='UNAVAILABLE' on any failure so the
    calling agent can fall back to an LLM estimate instead of crashing.
    """
    if not settings.DUFFEL_API_KEY or settings.MOCK_AI:
        return {"status": "UNAVAILABLE", "offers": [], "note": "Mock mode or Duffel key not configured"}

    try:
        origin_code = resolve_iata_code(origin) or origin
        destination_code = resolve_iata_code(destination) or destination

        payload = {
            "data": {
                "slices": [{"origin": origin_code, "destination": destination_code, "departure_date": departure_date}],
                "passengers": [{"type": "adult"} for _ in range(passengers)],
                "cabin_class": "economy",
            }
        }
        with httpx.Client(timeout=20.0) as client:
            resp = client.post(f"{DUFFEL_ROOT}/air/offer_requests", json=payload, headers=HEADERS)
            resp.raise_for_status()
            offers = resp.json()["data"]["offers"][:5]
            return {"status": "LIVE_TEST_DATA", "offers": offers}
    except Exception as exc:
        return {"status": "UNAVAILABLE", "offers": [], "error": str(exc)}