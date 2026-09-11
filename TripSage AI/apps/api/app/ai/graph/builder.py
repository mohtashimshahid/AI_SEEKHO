from langgraph.graph import StateGraph, START, END
from app.ai.graph.state import TripState
from app.ai.graph.nodes import (
    destination_research_node,
    budget_node,
    flight_stay_node,
    local_experience_node,
    orchestrator_node,
)
from app.ai.graph.routing import (
    route_after_destination_research,
    route_after_budget,
    route_after_flight_stay,
    route_after_local_experiences,
    route_after_orchestrator,
)


def build_trip_planning_graph():
    """
    Constructs and compiles the 5-Agent LangGraph State Machine (Sections 10, 11, 12).
    Handoff Sequence:
    START -> Destination Research (A1)
          -> Handoff #1 -> Budget Intelligence (A2)
          -> Handoff #2 -> Flight & Stay (A3)
          -> Handoff #3 -> Local Experiences (A4)
          -> Handoff #4 -> Trip Orchestrator (A5)
          -> END
    """
    builder = StateGraph(TripState)

    # 1. Add Agent Nodes
    builder.add_node("destination_research", destination_research_node)
    builder.add_node("budget", budget_node)
    builder.add_node("flight_stay", flight_stay_node)
    builder.add_node("local_experiences", local_experience_node)
    builder.add_node("orchestrator", orchestrator_node)

    # 2. Add Start Edge
    builder.add_edge(START, "destination_research")

    # 3. Add Conditional Routing Edges (Failure-aware retries & sequential handoffs)
    builder.add_conditional_edges(
        "destination_research",
        route_after_destination_research,
        {
            "budget": "budget",
            "destination_research": "destination_research",
            END: END,
        },
    )

    builder.add_conditional_edges(
        "budget",
        route_after_budget,
        {
            "flight_stay": "flight_stay",
            "budget": "budget",
            "__end__": END,
        },
    )

    builder.add_conditional_edges(
        "flight_stay",
        route_after_flight_stay,
        {
            "local_experiences": "local_experiences",
            "flight_stay": "flight_stay",
            "__end__": END,
        },
    )

    builder.add_conditional_edges(
        "local_experiences",
        route_after_local_experiences,
        {
            "orchestrator": "orchestrator",
            "local_experiences": "local_experiences",
            "__end__": END,
        },
    )

    builder.add_conditional_edges(
        "orchestrator",
        route_after_orchestrator,
        {
            "__end__": END,
            "orchestrator": "orchestrator",
        },
    )

    # Compile the executable graph
    return builder.compile()


trip_graph = build_trip_planning_graph()
