from decimal import Decimal
from datetime import date
from app.schemas import (
    Source,
    TripRequest,
    DestinationResearch,
    BudgetAnalysis,
    FlightOption,
    StayOption,
    FlightStayOptions,
    Experience,
    LocalExperiences,
    DayActivity,
    DayPlan,
    BudgetSummary,
    FinalItinerary,
)


def test_source_schema():
    source = Source(
        title="Lonely Planet Tokyo",
        url="https://lonelyplanet.com/japan/tokyo",
        domain="lonelyplanet.com",
        source_type="WEB",
        snippet="Tokyo is safe, clean, and has world-class public transit.",
        confidence="HIGH",
    )
    assert source.domain == "lonelyplanet.com"
    json_data = source.model_dump_json()
    assert "Tokyo" in json_data


def test_destination_research_schema():
    res = DestinationResearch(
        destination="Rome, Italy",
        overview="The Eternal City featuring ancient Roman ruins and Italian cuisine.",
        weather=["Warm and sunny in spring (18-24°C)"],
        culture=["Coffee culture (espresso at bar)", "Late dinners"],
        attractions=["Colosseum", "Vatican Museums", "Pantheon"],
        transportation=["Metro lines A & B", "Walking in centro storico"],
        best_areas=["Trastevere", "Monti", "Prati"],
        seasonal_notes=["Spring and autumn are peak seasons with pleasant weather."],
        sources=[],
        confidence="HIGH",
    )
    assert res.destination == "Rome, Italy"
    assert len(res.attractions) == 3


def test_budget_analysis_schema():
    analysis = BudgetAnalysis(
        currency="USD",
        flights=Decimal("450.00"),
        accommodation=Decimal("600.00"),
        food=Decimal("300.00"),
        transportation=Decimal("150.00"),
        activities=Decimal("250.00"),
        buffer=Decimal("175.00"),
        total=Decimal("1925.00"),
        per_person=Decimal("962.50"),
        status="CALCULATED",
    )
    assert analysis.total == Decimal("1925.00")
    assert analysis.per_person == Decimal("962.50")


def test_flight_and_stay_options_schema():
    flight = FlightOption(
        airline="Emirates",
        origin="LHE",
        destination="IST",
        price_estimate=Decimal("480.00"),
        currency="USD",
        stops=1,
    )
    stay = StayOption(
        name="Bosphorus Palace Hotel",
        neighborhood="Beylerbeyi",
        price_per_night=Decimal("120.00"),
        currency="USD",
        rating=4.9,
    )
    options = FlightStayOptions(
        flight_options=[flight],
        stay_options=[stay],
        recommended_flight="Emirates 1-stop with short layover",
        recommended_stay="Bosphorus Palace Hotel",
        price_status="ESTIMATED",
    )
    assert len(options.flight_options) == 1
    assert options.stay_options[0].rating == 4.9


def test_local_experiences_schema():
    food_exp = Experience(
        title="Simit and Tea by the Bosphorus",
        category="food",
        description="Fresh sesame bread rings with Turkish black tea.",
        neighborhood="Eminönü Pier",
        highlight=True,
    )
    local_exp = LocalExperiences(
        food=[food_exp],
        activities=[],
        hidden_gems=[],
        cultural_experiences=[],
        evening_options=[],
    )
    assert len(local_exp.food) == 1
    assert local_exp.food[0].highlight is True


def test_final_itinerary_schema():
    budget_summary = BudgetSummary(
        currency="USD",
        flight=Decimal("450"),
        accommodation=Decimal("600"),
        food=Decimal("300"),
        transportation=Decimal("150"),
        activities=Decimal("250"),
        buffer=Decimal("175"),
        total=Decimal("1925"),
        per_person=Decimal("962.50"),
    )
    activity = DayActivity(
        time_slot="09:00 - Morning",
        title="Visit Hagia Sophia",
        description="Explore the 6th-century architectural marvel.",
        location="Sultanahmet",
    )
    day = DayPlan(
        day_number=1,
        theme="Historic Sultanahmet & Grand Bazaar",
        activities=[activity],
        food_spots=["Tarihi Sultanahmet Koftecisi"],
    )
    itinerary = FinalItinerary(
        trip_summary="A 7-day cultural immersion in Istanbul.",
        destination="Istanbul, Turkey",
        accommodation="The Galata Boutique Hotel",
        transportation=["T1 Tram", "Bosphorus Ferry"],
        budget_summary=budget_summary,
        daily_plan=[day],
        food_recommendations=["Karaköy Lokantası"],
        activities=["Hagia Sophia", "Topkapi Palace"],
        packing_list=["Walking shoes", "Modest attire", "Power adapter"],
        assumptions=["Standard hotel occupancy for 2 guests"],
        sources=[],
        confidence="HIGH",
    )
    assert itinerary.destination == "Istanbul, Turkey"
    assert len(itinerary.daily_plan) == 1
    assert itinerary.daily_plan[0].activities[0].title == "Visit Hagia Sophia"
