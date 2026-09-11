import uuid
from datetime import datetime, timezone
from typing import Any, Dict
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.ai.graph.builder import trip_graph
from app.models.trip import Trip
from app.models.workflow import WorkflowRun
from app.models.agent_run import AgentRun, Source as SourceModel
from app.models.itinerary import (
    DestinationResearchModel,
    BudgetAnalysisModel,
    FlightStayOptionModel,
    LocalExperienceModel,
    ItineraryModel,
)
from app.schemas.trip import TripRequest
from app.services.trip_service import TripService


class WorkflowService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.trip_service = TripService(db)

    async def execute_trip_analysis(self, trip_id: str, user_id: str) -> Dict[str, Any]:
        """
        Executes the 5-Agent LangGraph workflow for a trip, persisting intermediate specialist artifacts and the final itinerary.
        """
        trip = await self.trip_service.get_trip(trip_id, user_id)

        # 1. Initialize WorkflowRun record
        workflow_run = WorkflowRun(
            trip_id=trip.id,
            status="RUNNING",
            current_stage="DESTINATION_RESEARCH",
            started_at=datetime.now(timezone.utc),
        )
        self.db.add(workflow_run)
        trip.status = "ANALYZING"
        await self.db.commit()
        await self.db.refresh(workflow_run)

        # 2. Build initial TripRequest schema from database trip and preferences
        trip_req = TripRequest(
            origin=trip.origin,
            destination=trip.destination,
            start_date=trip.start_date,
            end_date=trip.end_date,
            travelers=trip.traveler_count,
            budget=trip.budget,
            currency=trip.currency,
            travel_style=trip.travel_style,
            interests=trip.preference.interests if trip.preference else [],
            accommodation_preference=trip.preference.accommodation_type if trip.preference else "hotel",
            transportation_preference=trip.preference.transport_preference if trip.preference else "public_transport",
        )

        initial_state = {
            "trip_id": trip.id,
            "trip_request": trip_req,
            "destination_research": None,
            "budget_analysis": None,
            "flight_stay_options": None,
            "local_experiences": None,
            "final_itinerary": None,
            "current_stage": "START",
            "retry_counts": {},
            "errors": [],
            "sources": [],
            "handoff_logs": [],
        }

        # 3. Execute LangGraph State Machine
        final_state = trip_graph.invoke(initial_state)

        # 4. Record Agent Runs & Specialist Artifacts to DB
        dest_res = final_state.get("destination_research")
        if dest_res:
            dest_model = DestinationResearchModel(
                trip_id=trip.id,
                overview=dest_res.overview,
                weather=dest_res.weather,
                culture=dest_res.culture,
                attractions=dest_res.attractions,
                transportation=dest_res.transportation,
                best_areas=dest_res.best_areas,
                seasonal_notes=dest_res.seasonal_notes,
                confidence=dest_res.confidence,
            )
            self.db.add(dest_model)

        budget_res = final_state.get("budget_analysis")
        if budget_res:
            budget_model = BudgetAnalysisModel(
                trip_id=trip.id,
                currency=budget_res.currency,
                flight_cost=float(budget_res.flights),
                stay_cost=float(budget_res.accommodation),
                food_cost=float(budget_res.food),
                transport_cost=float(budget_res.transportation),
                activity_cost=float(budget_res.activities),
                buffer_cost=float(budget_res.buffer),
                total_cost=float(budget_res.total),
                per_person_cost=float(budget_res.per_person),
                status=budget_res.status,
            )
            self.db.add(budget_model)

        flight_stay_res = final_state.get("flight_stay_options")
        if flight_stay_res:
            fs_model = FlightStayOptionModel(
                trip_id=trip.id,
                flight_options=[f.model_dump(mode="json") for f in flight_stay_res.flight_options],
                stay_options=[s.model_dump(mode="json") for s in flight_stay_res.stay_options],
                recommended_flight=flight_stay_res.recommended_flight,
                recommended_stay=flight_stay_res.recommended_stay,
                price_status=flight_stay_res.price_status,
            )
            self.db.add(fs_model)

        exp_res = final_state.get("local_experiences")
        if exp_res:
            exp_model = LocalExperienceModel(
                trip_id=trip.id,
                food=[e.model_dump(mode="json") for e in exp_res.food],
                activities=[e.model_dump(mode="json") for e in exp_res.activities],
                hidden_gems=[e.model_dump(mode="json") for e in exp_res.hidden_gems],
                culture=[e.model_dump(mode="json") for e in exp_res.cultural_experiences],
                nightlife=[e.model_dump(mode="json") for e in exp_res.evening_options],
            )
            self.db.add(exp_model)

        itin_res = final_state.get("final_itinerary")
        if itin_res:
            itin_model = ItineraryModel(
                trip_id=trip.id,
                summary=itin_res.trip_summary,
                destination=itin_res.destination,
                accommodation=itin_res.accommodation,
                transportation=itin_res.transportation,
                daily_plan=[d.model_dump(mode="json") for d in itin_res.daily_plan],
                food=itin_res.food_recommendations,
                activities=itin_res.activities,
                packing_list=itin_res.packing_list,
                assumptions=itin_res.assumptions,
                confidence=itin_res.confidence,
                version=1,
            )
            self.db.add(itin_model)
            trip.status = "COMPLETED"
            workflow_run.status = "COMPLETED"
            workflow_run.current_stage = "COMPLETED"
        else:
            trip.status = "FAILED"
            workflow_run.status = "FAILED"
            workflow_run.error = "; ".join(final_state.get("errors", ["Unknown orchestration failure"]))

        workflow_run.completed_at = datetime.now(timezone.utc)
        await self.db.commit()

        return {
            "trip_id": trip.id,
            "workflow_run_id": workflow_run.id,
            "status": workflow_run.status,
            "current_stage": workflow_run.current_stage,
            "handoff_count": len(final_state.get("handoff_logs", [])),
            "handoff_logs": final_state.get("handoff_logs", []),
            "final_itinerary": itin_res.model_dump(mode="json") if itin_res else None,
            "errors": final_state.get("errors", []),
        }
