from datetime import datetime, timezone
from typing import Any, Dict
from app.ai.agents.destination_research import run_destination_research
from app.ai.agents.budget import run_budget_analysis
from app.ai.agents.flight_stay import run_flight_stay_analysis
from app.ai.agents.local_experience import run_local_experience_design
from app.ai.agents.trip_orchestrator import run_trip_orchestration
from app.ai.graph.state import TripState


def destination_research_node(state: TripState) -> Dict[str, Any]:
    """
    Node 1: Destination Research Agent
    Executes Fact Lookup and Web Search to generate DestinationResearch.
    """
    try:
        research = run_destination_research(state["trip_request"])
        handoff = {
            "stage": "DESTINATION_RESEARCH",
            "agent": "Destination Research Agent",
            "status": "COMPLETED",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "summary": f"Completed research for {research.destination} ({len(research.attractions)} attractions identified).",
        }
        
        sources = list(state.get("sources", [])) + research.sources

        return {
            "destination_research": research,
            "current_stage": "DESTINATION_RESEARCH_DONE",
            "sources": sources,
            "handoff_logs": list(state.get("handoff_logs", [])) + [handoff],
        }
    except Exception as e:
        retries = state.get("retry_counts", {}).copy()
        retries["DESTINATION_RESEARCH"] = retries.get("DESTINATION_RESEARCH", 0) + 1
        return {
            "errors": list(state.get("errors", [])) + [f"Destination Research Error: {str(e)}"],
            "current_stage": "DESTINATION_RESEARCH_FAILED",
            "retry_counts": retries,
        }


def budget_node(state: TripState) -> Dict[str, Any]:
    """
    Node 2: Budget Intelligence Agent (Handoff #1 -> #2)
    Executes Deterministic Calculator to produce itemized BudgetAnalysis.
    """
    try:
        budget = run_budget_analysis(
            trip_request=state["trip_request"],
            destination_research=state.get("destination_research"),
        )
        handoff = {
            "stage": "BUDGET_ANALYSIS",
            "agent": "Budget Intelligence Agent",
            "status": "COMPLETED",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "summary": f"Calculated deterministic budget: {budget.currency} {budget.total} ({budget.per_person}/person).",
        }

        sources = list(state.get("sources", [])) + budget.sources

        return {
            "budget_analysis": budget,
            "current_stage": "BUDGET_ANALYSIS_DONE",
            "sources": sources,
            "handoff_logs": list(state.get("handoff_logs", [])) + [handoff],
        }
    except Exception as e:
        retries = state.get("retry_counts", {}).copy()
        retries["BUDGET_ANALYSIS"] = retries.get("BUDGET_ANALYSIS", 0) + 1
        return {
            "errors": list(state.get("errors", [])) + [f"Budget Analysis Error: {str(e)}"],
            "current_stage": "BUDGET_ANALYSIS_FAILED",
            "retry_counts": retries,
        }


def flight_stay_node(state: TripState) -> Dict[str, Any]:
    """
    Node 3: Flight & Stay Agent (Handoff #2 -> #3)
    Researches practical flight corridors and neighborhood stay options.
    """
    try:
        flight_stay = run_flight_stay_analysis(
            trip_request=state["trip_request"],
            destination_research=state.get("destination_research"),
            budget_analysis=state.get("budget_analysis"),
        )
        handoff = {
            "stage": "FLIGHT_STAY",
            "agent": "Flight & Stay Agent",
            "status": "COMPLETED",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "summary": f"Selected stay: {flight_stay.recommended_stay}.",
        }

        sources = list(state.get("sources", [])) + flight_stay.sources

        return {
            "flight_stay_options": flight_stay,
            "current_stage": "FLIGHT_STAY_DONE",
            "sources": sources,
            "handoff_logs": list(state.get("handoff_logs", [])) + [handoff],
        }
    except Exception as e:
        retries = state.get("retry_counts", {}).copy()
        retries["FLIGHT_STAY"] = retries.get("FLIGHT_STAY", 0) + 1
        return {
            "errors": list(state.get("errors", [])) + [f"Flight & Stay Error: {str(e)}"],
            "current_stage": "FLIGHT_STAY_FAILED",
            "retry_counts": retries,
        }


def local_experience_node(state: TripState) -> Dict[str, Any]:
    """
    Node 4: Local Experience Agent (Handoff #3 -> #4)
    Designs personalized dining, activities, and hidden gems based on traveler profile.
    """
    try:
        experiences = run_local_experience_design(
            trip_request=state["trip_request"],
            destination_research=state.get("destination_research"),
            budget_analysis=state.get("budget_analysis"),
            flight_stay_options=state.get("flight_stay_options"),
        )
        handoff = {
            "stage": "LOCAL_EXPERIENCES",
            "agent": "Local Experience Agent",
            "status": "COMPLETED",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "summary": f"Curated {len(experiences.food)} dining spots and {len(experiences.activities)} activities.",
        }

        sources = list(state.get("sources", [])) + experiences.sources

        return {
            "local_experiences": experiences,
            "current_stage": "LOCAL_EXPERIENCES_DONE",
            "sources": sources,
            "handoff_logs": list(state.get("handoff_logs", [])) + [handoff],
        }
    except Exception as e:
        retries = state.get("retry_counts", {}).copy()
        retries["LOCAL_EXPERIENCES"] = retries.get("LOCAL_EXPERIENCES", 0) + 1
        return {
            "errors": list(state.get("errors", [])) + [f"Local Experience Error: {str(e)}"],
            "current_stage": "LOCAL_EXPERIENCES_FAILED",
            "retry_counts": retries,
        }


def orchestrator_node(state: TripState) -> Dict[str, Any]:
    """
    Node 5: Trip Orchestrator (Final Agent)
    Synthesizes outputs from Nodes 1-4 into a unified, coherent FinalItinerary.
    """
    try:
        itinerary = run_trip_orchestration(
            trip_request=state["trip_request"],
            destination_research=state.get("destination_research"),
            budget_analysis=state.get("budget_analysis"),
            flight_stay_options=state.get("flight_stay_options"),
            local_experiences=state.get("local_experiences"),
        )
        handoff = {
            "stage": "ORCHESTRATING",
            "agent": "Trip Orchestrator",
            "status": "COMPLETED",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "summary": f"Synthesized final itinerary across {len(itinerary.daily_plan)} days with {len(itinerary.sources)} verified sources.",
        }

        return {
            "final_itinerary": itinerary,
            "current_stage": "COMPLETED",
            "sources": itinerary.sources,
            "handoff_logs": list(state.get("handoff_logs", [])) + [handoff],
        }
    except Exception as e:
        retries = state.get("retry_counts", {}).copy()
        retries["ORCHESTRATOR"] = retries.get("ORCHESTRATOR", 0) + 1
        return {
            "errors": list(state.get("errors", [])) + [f"Orchestration Error: {str(e)}"],
            "current_stage": "ORCHESTRATION_FAILED",
            "retry_counts": retries,
        }
