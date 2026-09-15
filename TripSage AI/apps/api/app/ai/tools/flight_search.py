import httpx
from app.config import settings

DUFFEL_BASE_URL = "https://api.duffel.com/air"

async def search_flights(origin: str, destination: str, departure_date: str, passengers: int = 1):
    headers = {
        "Authorization": f"Bearer {settings.DUFFEL_API_KEY}",
        "Duffel-Version": "v2",
        "Content-Type": "application/json",
    }
    payload = {
        "data": {
            "slices": [{"origin": origin, "destination": destination, "departure_date": departure_date}],
            "passengers": [{"type": "adult"}] * passengers,
            "cabin_class": "economy",
        }
    }
    async with httpx.AsyncClient() as client:
        resp = await client.post(f"{DUFFEL_BASE_URL}/offer_requests", json=payload, headers=headers)
        resp.raise_for_status()
        return resp.json()["data"]["offers"]
        