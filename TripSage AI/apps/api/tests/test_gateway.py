from app.ai.gateway import OpenAIGateway
from app.schemas import (
    DestinationResearch,
    BudgetAnalysis,
    FlightStayOptions,
    LocalExperiences,
    FinalItinerary,
)


def test_gateway_destination_research_structured_output():
    gateway = OpenAIGateway(model="gpt-4o-mini")
    res = gateway.generate_structured_output(
        system_prompt="You are Destination Research Agent.",
        user_prompt="Research Istanbul, Turkey for 7 days with a balanced travel style.",
        schema=DestinationResearch,
    )
    assert isinstance(res, DestinationResearch)
    assert res.destination == "Istanbul, Turkey"
    assert len(res.attractions) > 0
    assert len(res.weather) > 0
    assert res.confidence == "HIGH"


def test_gateway_budget_analysis_structured_output():
    gateway = OpenAIGateway()
    res = gateway.generate_structured_output(
        system_prompt="You are Budget Intelligence Agent.",
        user_prompt="Calculate budget for Istanbul.",
        schema=BudgetAnalysis,
    )
    assert isinstance(res, BudgetAnalysis)
    assert res.currency == "USD"
    assert res.total > 0
    assert res.status == "CALCULATED"


def test_gateway_flight_stay_structured_output():
    gateway = OpenAIGateway()
    res = gateway.generate_structured_output(
        system_prompt="You are Flight and Stay Agent.",
        user_prompt="Find flight and stay options.",
        schema=FlightStayOptions,
    )
    assert isinstance(res, FlightStayOptions)
    assert len(res.flight_options) > 0
    assert len(res.stay_options) > 0


def test_gateway_local_experiences_structured_output():
    gateway = OpenAIGateway()
    res = gateway.generate_structured_output(
        system_prompt="You are Local Experience Agent.",
        user_prompt="Recommend local food and hidden gems.",
        schema=LocalExperiences,
    )
    assert isinstance(res, LocalExperiences)
    assert len(res.food) > 0
    assert len(res.activities) > 0


def test_gateway_final_itinerary_structured_output():
    gateway = OpenAIGateway()
    res = gateway.generate_structured_output(
        system_prompt="You are Trip Orchestrator.",
        user_prompt="Synthesize specialist outputs into final itinerary.",
        schema=FinalItinerary,
    )
    assert isinstance(res, FinalItinerary)
    assert res.destination == "Istanbul, Turkey"
    assert len(res.daily_plan) > 0
    assert len(res.packing_list) > 0
