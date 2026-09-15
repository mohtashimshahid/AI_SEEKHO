import httpx
from typing import Any, Dict

async def get_weather_forecast(latitude: float, longitude: float) -> Dict[str, Any]:
    """Fetch 7-day daily weather forecast from Open-Meteo API asynchronously."""
    url = "https://api.open-meteo.com/v1/forecast"
    params = {
        "latitude": latitude,
        "longitude": longitude,
        "daily": "temperature_2m_max,temperature_2m_min,precipitation_probability_max",
        "timezone": "auto",
    }
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(url, params=params)
            resp.raise_for_status()
            return {"status": "LIVE_DATA", "daily": resp.json().get("daily", {})}
    except Exception as exc:
        return {"status": "UNAVAILABLE", "daily": {}, "error": str(exc)}


def get_weather_forecast_sync(latitude: float, longitude: float) -> Dict[str, Any]:
    """Synchronous weather forecast lookup for agents."""
    url = "https://api.open-meteo.com/v1/forecast"
    params = {
        "latitude": latitude,
        "longitude": longitude,
        "daily": "temperature_2m_max,temperature_2m_min,precipitation_probability_max",
        "timezone": "auto",
    }
    try:
        with httpx.Client(timeout=10.0) as client:
            resp = client.get(url, params=params)
            resp.raise_for_status()
            return {"status": "LIVE_DATA", "daily": resp.json().get("daily", {})}
    except Exception as exc:
        return {"status": "UNAVAILABLE", "daily": {}, "error": str(exc)}