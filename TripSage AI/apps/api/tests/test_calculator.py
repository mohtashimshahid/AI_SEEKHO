import pytest
from decimal import Decimal
from app.ai.tools.calculator import calculate_trip_budget


def test_calculator_exact_prd_example():
    """
    Test exact PRD Section 6 specification:
    flights: 450, accommodation: 600, food: 300, transportation: 150, activities: 250, buffer: 175
    Total = 1925, Per Person (2 travelers) = 962.50
    """
    res = calculate_trip_budget(
        flights=450,
        accommodation=600,
        food=300,
        transport=150,
        activities=250,
        buffer=175,
        travelers=2,
        duration_days=7,
        currency="USD",
    )

    assert res["total"] == 1925.00
    assert res["per_person"] == 962.50
    assert res["daily_average"] == 275.00
    assert res["currency"] == "USD"
    assert res["status"] == "CALCULATED"


def test_calculator_floating_point_imprecision_immunity():
    """
    Standard IEEE 754 floats produce 0.1 + 0.2 = 0.30000000000000004.
    Our deterministic calculator must use Decimal to avoid binary float artifacts.
    """
    res = calculate_trip_budget(
        flights=0.10,
        accommodation=0.20,
        food=0.30,
        transport=0.40,
        activities=0.50,
        buffer=0.60,
        travelers=1,
        duration_days=1,
    )
    # 0.10 + 0.20 + 0.30 + 0.40 + 0.50 + 0.60 = 2.10
    assert res["total"] == 2.10
    assert res["per_person"] == 2.10


def test_calculator_three_travelers_odd_division():
    """
    Test division by 3: $1000 total / 3 travelers = $333.33 per person
    """
    res = calculate_trip_budget(
        flights=300,
        accommodation=300,
        food=200,
        transport=100,
        activities=50,
        buffer=50,
        travelers=3,
        duration_days=6,
    )
    assert res["total"] == 1000.00
    assert res["per_person"] == 333.33
    assert res["daily_average"] == 166.67


def test_calculator_string_inputs():
    """
    Ensure string representation of numeric values (common from JSON) parses cleanly.
    """
    res = calculate_trip_budget(
        flights="1250.75",
        accommodation="849.25",
        food="450.00",
        transport="120.50",
        activities="300.00",
        buffer="180.50",
        travelers=2,
        duration_days=10,
        currency="eur",
    )
    # 1250.75 + 849.25 + 450.00 + 120.50 + 300.00 + 180.50 = 3151.00
    assert res["total"] == 3151.00
    assert res["per_person"] == 1575.50
    assert res["daily_average"] == 315.10
    assert res["currency"] == "EUR"


def test_calculator_percentage_breakdown_sum():
    """
    Verify the category percentage distribution adds up accurately to 100%.
    """
    res = calculate_trip_budget(
        flights=500,
        accommodation=500,
        food=500,
        transport=500,
        activities=500,
        buffer=500,
        travelers=2,
    )
    # Each is 1/6th = 16.7%
    assert res["total"] == 3000.00
    percentages = res["breakdown_percentages"]
    assert percentages["flights"] == 16.7
    assert percentages["accommodation"] == 16.7
    assert percentages["food"] == 16.7
    total_pct = sum(percentages.values())
    assert round(total_pct) == 100


def test_calculator_zero_division_guard():
    """
    Verify division by zero is safely prevented if 0 travelers or 0 days are passed.
    """
    res = calculate_trip_budget(
        flights=100,
        accommodation=100,
        food=100,
        transport=100,
        activities=100,
        buffer=100,
        travelers=0,  # Should fall back to 1
        duration_days=0,  # Should fall back to 1
    )
    assert res["total"] == 600.00
    assert res["per_person"] == 600.00
    assert res["daily_average"] == 600.00


def test_calculator_high_luxury_budget():
    """
    Test precision on large luxury budgets (e.g. $25,000 trip for 4 travelers for 14 days).
    """
    res = calculate_trip_budget(
        flights=8000.00,
        accommodation=9500.00,
        food=3200.00,
        transport=1500.00,
        activities=1800.00,
        buffer=1000.00,
        travelers=4,
        duration_days=14,
        currency="USD",
    )
    # Total = 8000 + 9500 + 3200 + 1500 + 1800 + 1000 = 25000.00
    assert res["total"] == 25000.00
    assert res["per_person"] == 6250.00
    assert res["daily_average"] == 1785.71
