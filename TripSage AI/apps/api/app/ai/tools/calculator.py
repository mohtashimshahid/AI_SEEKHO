from decimal import Decimal, ROUND_HALF_UP
from typing import Any, Dict


def calculate_trip_budget(
    flights: Decimal | float | int,
    accommodation: Decimal | float | int,
    food: Decimal | float | int,
    transport: Decimal | float | int,
    activities: Decimal | float | int,
    buffer: Decimal | float | int,
    travelers: int = 1,
    duration_days: int = 7,
    currency: str = "USD",
) -> Dict[str, Any]:
    """
    Deterministic Financial Calculator for TripSage AI (Section 6 & 22).
    Authoritative arithmetic is calculated via Python Decimal rather than LLM mental math.
    """
    # Convert all inputs to Decimal for exact precision
    d_flights = Decimal(str(flights)).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
    d_accommodation = Decimal(str(accommodation)).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
    d_food = Decimal(str(food)).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
    d_transport = Decimal(str(transport)).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
    d_activities = Decimal(str(activities)).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
    d_buffer = Decimal(str(buffer)).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)

    travelers_count = max(1, travelers)
    days_count = max(1, duration_days)

    # Exact deterministic total
    total = d_flights + d_accommodation + d_food + d_transport + d_activities + d_buffer
    per_person = (total / Decimal(str(travelers_count))).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
    daily_avg = (total / Decimal(str(days_count))).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)

    return {
        "currency": currency.upper(),
        "flights": float(d_flights),
        "accommodation": float(d_accommodation),
        "food": float(d_food),
        "transportation": float(d_transport),
        "activities": float(d_activities),
        "buffer": float(d_buffer),
        "total": float(total),
        "per_person": float(per_person),
        "daily_average": float(daily_avg),
        "travelers": travelers_count,
        "duration_days": days_count,
        "status": "CALCULATED",
        "breakdown_percentages": {
            "flights": float(((d_flights / total) * 100).quantize(Decimal("0.1"), rounding=ROUND_HALF_UP)) if total > 0 else 0,
            "accommodation": float(((d_accommodation / total) * 100).quantize(Decimal("0.1"), rounding=ROUND_HALF_UP)) if total > 0 else 0,
            "food": float(((d_food / total) * 100).quantize(Decimal("0.1"), rounding=ROUND_HALF_UP)) if total > 0 else 0,
            "transportation": float(((d_transport / total) * 100).quantize(Decimal("0.1"), rounding=ROUND_HALF_UP)) if total > 0 else 0,
            "activities": float(((d_activities / total) * 100).quantize(Decimal("0.1"), rounding=ROUND_HALF_UP)) if total > 0 else 0,
            "buffer": float(((d_buffer / total) * 100).quantize(Decimal("0.1"), rounding=ROUND_HALF_UP)) if total > 0 else 0,
        },
    }
