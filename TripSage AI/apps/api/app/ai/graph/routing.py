from typing import Literal
from langgraph.graph import END
from app.ai.graph.state import TripState

MAX_RETRIES = 2


def route_after_destination_research(state: TripState) -> Literal["budget", "destination_research", "__end__"]:
    stage = state.get("current_stage", "")
    retries = state.get("retry_counts", {}).get("DESTINATION_RESEARCH", 0)

    if stage == "DESTINATION_RESEARCH_DONE":
        return "budget"
    if retries < MAX_RETRIES:
        return "destination_research"
    return END


def route_after_budget(state: TripState) -> Literal["flight_stay", "budget", "__end__"]:
    stage = state.get("current_stage", "")
    retries = state.get("retry_counts", {}).get("BUDGET_ANALYSIS", 0)

    if stage == "BUDGET_ANALYSIS_DONE":
        return "flight_stay"
    if retries < MAX_RETRIES:
        return "budget"
    return END


def route_after_flight_stay(state: TripState) -> Literal["local_experiences", "flight_stay", "__end__"]:
    stage = state.get("current_stage", "")
    retries = state.get("retry_counts", {}).get("FLIGHT_STAY", 0)

    if stage == "FLIGHT_STAY_DONE":
        return "local_experiences"
    if retries < MAX_RETRIES:
        return "flight_stay"
    return END


def route_after_local_experiences(state: TripState) -> Literal["orchestrator", "local_experiences", "__end__"]:
    stage = state.get("current_stage", "")
    retries = state.get("retry_counts", {}).get("LOCAL_EXPERIENCES", 0)

    if stage == "LOCAL_EXPERIENCES_DONE":
        return "orchestrator"
    if retries < MAX_RETRIES:
        return "local_experiences"
    return END


def route_after_orchestrator(state: TripState) -> Literal["__end__", "orchestrator"]:
    stage = state.get("current_stage", "")
    retries = state.get("retry_counts", {}).get("ORCHESTRATOR", 0)

    if stage == "COMPLETED":
        return END
    if retries < MAX_RETRIES:
        return "orchestrator"
    return END
