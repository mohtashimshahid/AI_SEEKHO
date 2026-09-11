import asyncio
import json
from datetime import datetime, timezone
from typing import Any, AsyncGenerator, Dict, List, Optional


class WorkflowStreamManager:
    """
    Manages in-memory pub-sub event streams for real-time Server-Sent Events (SSE)
    delivering real agent state transitions without fake progress bars (PRD Section 28 & 39).
    """

    def __init__(self):
        self._queues: Dict[str, List[asyncio.Queue]] = {}
        self._history: Dict[str, List[Dict[str, Any]]] = {}
        self._is_completed: Dict[str, bool] = {}

    def publish_event(self, run_id: str, event_type: str, data: Dict[str, Any]) -> None:
        """
        Publishes an event to all active SSE subscribers for the given run_id
        and stores it in the history buffer for late-connecting clients.
        """
        if "timestamp" not in data:
            data["timestamp"] = datetime.now(timezone.utc).isoformat()
        
        event_payload = {
            "event": event_type,
            "data": data,
        }

        # Save to history
        if run_id not in self._history:
            self._history[run_id] = []
        self._history[run_id].append(event_payload)

        if event_type in ("workflow_completed", "workflow_failed", "done"):
            self._is_completed[run_id] = True

        # Fan out to all active queues for this run_id
        if run_id in self._queues:
            for q in list(self._queues[run_id]):
                q.put_nowait(event_payload)

    async def subscribe(self, run_id: str) -> AsyncGenerator[str, None]:
        """
        Subscribes to the event stream of a workflow run.
        Replays past events, then yields live SSE events as they arrive.
        """
        queue: asyncio.Queue = asyncio.Queue()

        if run_id not in self._queues:
            self._queues[run_id] = []
        self._queues[run_id].append(queue)

        try:
            # 1. Replay historical events
            historical = self._history.get(run_id, [])
            for evt in historical:
                yield f"event: {evt['event']}\ndata: {json.dumps(evt['data'])}\n\n"

            # If already completed before subscription, close stream
            if self._is_completed.get(run_id, False):
                yield f"event: done\ndata: {json.dumps({'message': 'Workflow finished', 'run_id': run_id})}\n\n"
                return

            # 2. Stream live events
            while True:
                try:
                    # Wait for next event or send ping keepalive every 15s
                    evt = await asyncio.wait_for(queue.get(), timeout=15.0)
                    yield f"event: {evt['event']}\ndata: {json.dumps(evt['data'])}\n\n"

                    if evt["event"] in ("workflow_completed", "workflow_failed", "done"):
                        yield f"event: done\ndata: {json.dumps({'message': 'Stream complete', 'run_id': run_id})}\n\n"
                        break
                except asyncio.TimeoutError:
                    # Send SSE keep-alive comment
                    yield ": ping\n\n"

        finally:
            if run_id in self._queues and queue in self._queues[run_id]:
                self._queues[run_id].remove(queue)
                if not self._queues[run_id]:
                    del self._queues[run_id]

    def get_history(self, run_id: str) -> List[Dict[str, Any]]:
        return self._history.get(run_id, [])


# Global Stream Manager Singleton
stream_manager = WorkflowStreamManager()
