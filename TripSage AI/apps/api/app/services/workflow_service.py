import uuid
from datetime import datetime, timezone
from typing import Any, Dict, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import delete
from sqlalchemy.future import select

from app.ai.graph.builder import trip_graph
from app.ai.agents.destination_research import run_destination_research
from app.ai.agents.budget import run_budget_analysis
from app.ai.agents.flight_stay import run_flight_stay_analysis
from app.ai.agents.local_experience import run_local_experience_design
from app.ai.agents.trip_orchestrator import run_trip_orchestration
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
from app.services.workflow_stream_manager import stream_manager


class WorkflowService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.trip_service = TripService(db)

    async def execute_trip_analysis(
        self, trip_id: str, user_id: str, run_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Executes the 5-Agent LangGraph workflow for a trip, publishing real-time SSE events
        at each stage transition and persisting intermediate specialist artifacts + final itinerary.
        """
        trip = await self.trip_service.get_trip(trip_id, user_id)

        # 0. Clean any previous intermediate models for this trip to guarantee clean idempotence
        await self.db.execute(delete(DestinationResearchModel).where(DestinationResearchModel.trip_id == trip.id))
        await self.db.execute(delete(BudgetAnalysisModel).where(BudgetAnalysisModel.trip_id == trip.id))
        await self.db.execute(delete(FlightStayOptionModel).where(FlightStayOptionModel.trip_id == trip.id))
        await self.db.execute(delete(LocalExperienceModel).where(LocalExperienceModel.trip_id == trip.id))
        await self.db.execute(delete(ItineraryModel).where(ItineraryModel.trip_id == trip.id))
        await self.db.commit()

        # 1. Initialize or find WorkflowRun record
        if run_id:
            res = await self.db.execute(select(WorkflowRun).where(WorkflowRun.id == run_id))
            workflow_run = res.scalars().first()
            if not workflow_run:
                workflow_run = WorkflowRun(
                    id=run_id,
                    trip_id=trip.id,
                    status="RUNNING",
                    current_stage="DESTINATION_RESEARCH",
                    started_at=datetime.now(timezone.utc),
                )
                self.db.add(workflow_run)
        else:
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
        run_id = workflow_run.id

        # Publish initial workflow start
        stream_manager.publish_event(
            run_id,
            "workflow_started",
            {
                "run_id": run_id,
                "trip_id": trip.id,
                "destination": trip.destination,
                "origin": trip.origin,
                "travelers": trip.traveler_count,
                "budget": float(trip.budget),
                "currency": trip.currency,
                "status": "RUNNING",
            },
        )

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
            activity_level=trip.preference.activity_level if trip.preference else "moderate",
        )

        try:
            # -------------------------------------------------------------
            # Stage 1: Destination Research Agent
            # -------------------------------------------------------------
            stream_manager.publish_event(
                run_id,
                "agent_started",
                {
                    "agent_id": "01",
                    "agent_name": "Destination Research Agent",
                    "stage": "DESTINATION_RESEARCH",
                    "message": f"Researching destination facts, seasonal weather, and iconic landmarks for {trip.destination}...",
                },
            )

            dest_res = run_destination_research(trip_req)

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

            stream_manager.publish_event(
                run_id,
                "agent_completed",
                {
                    "agent_id": "01",
                    "agent_name": "Destination Research Agent",
                    "stage": "DESTINATION_RESEARCH",
                    "summary": f"Identified {len(dest_res.attractions)} landmarks and local climate profile for {dest_res.destination}.",
                    "artifact": dest_res.model_dump(mode="json"),
                },
            )

            stream_manager.publish_event(
                run_id,
                "handoff",
                {
                    "handoff_index": 1,
                    "from_agent": "Destination Research Agent",
                    "to_agent": "Budget Intelligence Agent",
                    "message": "Handoff #1: Transferring verified destination intelligence to Budget Intelligence Agent.",
                },
            )

            # -------------------------------------------------------------
            # Stage 2: Budget Intelligence Agent
            # -------------------------------------------------------------
            stream_manager.publish_event(
                run_id,
                "agent_started",
                {
                    "agent_id": "02",
                    "agent_name": "Budget Intelligence Agent",
                    "stage": "BUDGET_ANALYSIS",
                    "message": f"Computing itemized financial allocations using deterministic calculator ({trip.currency} {trip.budget})...",
                },
            )

            budget_res = run_budget_analysis(trip_req, destination_research=dest_res)

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

            stream_manager.publish_event(
                run_id,
                "agent_completed",
                {
                    "agent_id": "02",
                    "agent_name": "Budget Intelligence Agent",
                    "stage": "BUDGET_ANALYSIS",
                    "summary": f"Calculated deterministic budget: {budget_res.currency} {budget_res.total} ({budget_res.per_person}/traveler).",
                    "artifact": budget_res.model_dump(mode="json"),
                },
            )

            stream_manager.publish_event(
                run_id,
                "handoff",
                {
                    "handoff_index": 2,
                    "from_agent": "Budget Intelligence Agent",
                    "to_agent": "Flight & Stay Agent",
                    "message": "Handoff #2: Transferring budget thresholds to Flight & Stay Agent.",
                },
            )

            # -------------------------------------------------------------
            # Stage 3: Flight & Stay Agent
            # -------------------------------------------------------------
            stream_manager.publish_event(
                run_id,
                "agent_started",
                {
                    "agent_id": "03",
                    "agent_name": "Flight & Stay Agent",
                    "stage": "FLIGHT_STAY",
                    "message": f"Analyzing flight corridors from {trip.origin} and selecting boutique accommodations...",
                },
            )

            flight_stay_res = run_flight_stay_analysis(
                trip_req, destination_research=dest_res, budget_analysis=budget_res
            )

            fs_model = FlightStayOptionModel(
                trip_id=trip.id,
                flight_options=[f.model_dump(mode="json") for f in flight_stay_res.flight_options],
                stay_options=[s.model_dump(mode="json") for s in flight_stay_res.stay_options],
                recommended_flight=flight_stay_res.recommended_flight,
                recommended_stay=flight_stay_res.recommended_stay,
                price_status=flight_stay_res.price_status,
            )
            self.db.add(fs_model)

            stream_manager.publish_event(
                run_id,
                "agent_completed",
                {
                    "agent_id": "03",
                    "agent_name": "Flight & Stay Agent",
                    "stage": "FLIGHT_STAY",
                    "summary": f"Selected stay: {flight_stay_res.recommended_stay}.",
                    "artifact": flight_stay_res.model_dump(mode="json"),
                },
            )

            stream_manager.publish_event(
                run_id,
                "handoff",
                {
                    "handoff_index": 3,
                    "from_agent": "Flight & Stay Agent",
                    "to_agent": "Local Experience Agent",
                    "message": "Handoff #3: Transferring stay location & logistics to Local Experience Agent.",
                },
            )

            # -------------------------------------------------------------
            # Stage 4: Local Experience Agent
            # -------------------------------------------------------------
            stream_manager.publish_event(
                run_id,
                "agent_started",
                {
                    "agent_id": "04",
                    "agent_name": "Local Experience Agent",
                    "stage": "LOCAL_EXPERIENCES",
                    "message": "Curating authentic culinary highlights, cultural spots, and hidden gems...",
                },
            )

            exp_res = run_local_experience_design(
                trip_req,
                destination_research=dest_res,
                budget_analysis=budget_res,
                flight_stay_options=flight_stay_res,
            )

            exp_model = LocalExperienceModel(
                trip_id=trip.id,
                food=[e.model_dump(mode="json") for e in exp_res.food],
                activities=[e.model_dump(mode="json") for e in exp_res.activities],
                hidden_gems=[e.model_dump(mode="json") for e in exp_res.hidden_gems],
                culture=[e.model_dump(mode="json") for e in exp_res.cultural_experiences],
                nightlife=[e.model_dump(mode="json") for e in exp_res.evening_options],
            )
            self.db.add(exp_model)

            stream_manager.publish_event(
                run_id,
                "agent_completed",
                {
                    "agent_id": "04",
                    "agent_name": "Local Experience Agent",
                    "stage": "LOCAL_EXPERIENCES",
                    "summary": f"Curated {len(exp_res.food)} food experiences and {len(exp_res.activities)} activities.",
                    "artifact": exp_res.model_dump(mode="json"),
                },
            )

            stream_manager.publish_event(
                run_id,
                "handoff",
                {
                    "handoff_index": 4,
                    "from_agent": "Local Experience Agent",
                    "to_agent": "Trip Orchestrator",
                    "message": "Handoff #4: Transferring all specialist intelligence to Trip Orchestrator for synthesis.",
                },
            )

            # -------------------------------------------------------------
            # Stage 5: Trip Orchestrator Agent
            # -------------------------------------------------------------
            stream_manager.publish_event(
                run_id,
                "agent_started",
                {
                    "agent_id": "05",
                    "agent_name": "Trip Orchestrator",
                    "stage": "ORCHESTRATING",
                    "message": "Synthesizing specialist findings into a cohesive, evidence-backed final itinerary...",
                },
            )

            itin_res = run_trip_orchestration(
                trip_req,
                destination_research=dest_res,
                budget_analysis=budget_res,
                flight_stay_options=flight_stay_res,
                local_experiences=exp_res,
            )

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
            workflow_run.completed_at = datetime.now(timezone.utc)
            await self.db.commit()
            await self.db.refresh(itin_model)

            stream_manager.publish_event(
                run_id,
                "agent_completed",
                {
                    "agent_id": "05",
                    "agent_name": "Trip Orchestrator",
                    "stage": "ORCHESTRATING",
                    "summary": f"Completed final itinerary synthesis across {len(itin_res.daily_plan)} days with {len(itin_res.sources)} sources.",
                    "artifact": itin_res.model_dump(mode="json"),
                },
            )

            stream_manager.publish_event(
                run_id,
                "workflow_completed",
                {
                    "run_id": run_id,
                    "trip_id": trip.id,
                    "itinerary_id": itin_model.id,
                    "status": "COMPLETED",
                    "summary": itin_res.trip_summary,
                    "destination": itin_res.destination,
                },
            )
            stream_manager.publish_event(run_id, "done", {"status": "COMPLETED"})

            handoff_logs = [
                {
                    "stage": "DESTINATION_RESEARCH",
                    "agent": "Destination Research Agent",
                    "status": "COMPLETED",
                    "summary": f"Identified {len(dest_res.attractions)} landmarks and local climate profile.",
                },
                {
                    "stage": "BUDGET_ANALYSIS",
                    "agent": "Budget Intelligence Agent",
                    "status": "COMPLETED",
                    "summary": f"Calculated deterministic budget: {budget_res.currency} {budget_res.total}.",
                },
                {
                    "stage": "FLIGHT_STAY",
                    "agent": "Flight & Stay Agent",
                    "status": "COMPLETED",
                    "summary": f"Selected stay: {flight_stay_res.recommended_stay}.",
                },
                {
                    "stage": "LOCAL_EXPERIENCES",
                    "agent": "Local Experience Agent",
                    "status": "COMPLETED",
                    "summary": f"Curated {len(exp_res.food)} food spots and {len(exp_res.activities)} activities.",
                },
                {
                    "stage": "ORCHESTRATING",
                    "agent": "Trip Orchestrator",
                    "status": "COMPLETED",
                    "summary": f"Synthesized final itinerary across {len(itin_res.daily_plan)} days.",
                },
            ]

            return {
                "trip_id": trip.id,
                "workflow_run_id": run_id,
                "status": "COMPLETED",
                "current_stage": "COMPLETED",
                "handoff_count": len(handoff_logs),
                "handoff_logs": handoff_logs,
                "final_itinerary": itin_res.model_dump(mode="json"),
            }

        except Exception as e:
            trip.status = "FAILED"
            workflow_run.status = "FAILED"
            workflow_run.error = str(e)
            workflow_run.completed_at = datetime.now(timezone.utc)
            await self.db.commit()

            stream_manager.publish_event(
                run_id,
                "workflow_failed",
                {
                    "run_id": run_id,
                    "trip_id": trip.id,
                    "status": "FAILED",
                    "error": str(e),
                },
            )
            raise e
