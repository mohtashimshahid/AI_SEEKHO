"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { apiClient } from "@/lib/api-client";
import {
  Compass,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Loader2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Search,
  Calculator,
  Plane,
  Utensils,
  Layers,
  Terminal,
  ChevronRight,
  AlertCircle
} from "lucide-react";

interface AgentState {
  id: string;
  name: string;
  stage: string;
  role: string;
  status: "WAITING" | "RUNNING" | "COMPLETED" | "FAILED" | "RETRYING";
  description: string;
  summary?: string;
  artifact?: any;
  icon: any;
}

interface LogEvent {
  timestamp: string;
  type: string;
  message: string;
  agent?: string;
}

interface TripInfo {
  id: string;
  title: string;
  origin: string;
  destination: string;
  start_date: string;
  end_date: string;
  traveler_count: number;
  budget: string | number;
  currency: string;
  travel_style: string;
}

const INITIAL_AGENTS: AgentState[] = [
  {
    id: "01",
    name: "Destination Research",
    stage: "DESTINATION_RESEARCH",
    role: "Fact Lookup & Web Intelligence",
    status: "WAITING",
    description: "Awaiting activation...",
    icon: Search,
  },
  {
    id: "02",
    name: "Budget Intelligence",
    stage: "BUDGET_ANALYSIS",
    role: "Deterministic Math & Allocations",
    status: "WAITING",
    description: "Awaiting Handoff #1 from Destination Agent...",
    icon: Calculator,
  },
  {
    id: "03",
    name: "Flight & Stay",
    stage: "FLIGHT_STAY",
    role: "Corridors & Neighborhood Accommodations",
    status: "WAITING",
    description: "Awaiting Handoff #2 from Budget Agent...",
    icon: Plane,
  },
  {
    id: "04",
    name: "Local Experiences",
    stage: "LOCAL_EXPERIENCES",
    role: "Curated Dining, Culture & Hidden Gems",
    status: "WAITING",
    description: "Awaiting Handoff #3 from Flight & Stay Agent...",
    icon: Utensils,
  },
  {
    id: "05",
    name: "Trip Orchestrator",
    stage: "ORCHESTRATING",
    role: "Final Multi-Agent Synthesis & Verification",
    status: "WAITING",
    description: "Awaiting Handoff #4 from Local Experiences Agent...",
    icon: Layers,
  },
];

export default function AnalysisScreen() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const tripId = params.tripId as string;
  const initialRunId = searchParams.get("run_id");

  const [trip, setTrip] = useState<TripInfo | null>(null);
  const [agents, setAgents] = useState<AgentState[]>(INITIAL_AGENTS);
  const [logs, setLogs] = useState<LogEvent[]>([]);
  const [activeTab, setActiveTab] = useState<string>("01");
  const [isCompleted, setIsCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [runId, setRunId] = useState<string | null>(initialRunId);

  const eventSourceRef = useRef<EventSource | null>(null);
  const logsEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll terminal logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  // 1. Fetch Trip details
  useEffect(() => {
    if (!tripId) return;
    apiClient<TripInfo>(`/trips/${tripId}`)
      .then((data) => setTrip(data))
      .catch((err) => setError(err.message || "Failed to load trip details"));
  }, [tripId]);

  // 2. Start or Connect to Analysis Stream
  useEffect(() => {
    if (!tripId) return;

    let active = true;

    async function startOrConnect() {
      try {
        let activeRunId = runId;
        if (!activeRunId) {
          // Trigger analysis with background=true to get run_id
          const res: any = await apiClient(`/trips/${tripId}/analyze?background=true`, {
            method: "POST",
          });
          activeRunId = res.data.workflow_run_id;
          if (active) setRunId(activeRunId);
        }

        if (!activeRunId) return;

        // Establish real-time SSE Connection
        const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
        const token = localStorage.getItem("tripsage_token");
        const sseUrl = `${apiBase}/workflows/${activeRunId}/events`;

        const es = new EventSource(sseUrl);
        eventSourceRef.current = es;

        es.addEventListener("workflow_started", (e) => {
          const payload = JSON.parse(e.data);
          setLogs((prev) => [
            ...prev,
            {
              timestamp: new Date().toLocaleTimeString(),
              type: "WORKFLOW_START",
              message: `Multi-agent state machine initialized for ${payload.destination} (${payload.travelers} travelers, ${payload.currency} ${payload.budget}).`,
            },
          ]);
        });

        es.addEventListener("agent_started", (e) => {
          const payload = JSON.parse(e.data);
          setAgents((prev) =>
            prev.map((a) =>
              a.id === payload.agent_id
                ? { ...a, status: "RUNNING", description: payload.message }
                : a
            )
          );
          setActiveTab(payload.agent_id);
          setLogs((prev) => [
            ...prev,
            {
              timestamp: new Date().toLocaleTimeString(),
              type: "AGENT_START",
              agent: payload.agent_name,
              message: payload.message,
            },
          ]);
        });

        es.addEventListener("agent_completed", (e) => {
          const payload = JSON.parse(e.data);
          setAgents((prev) =>
            prev.map((a) =>
              a.id === payload.agent_id
                ? {
                    ...a,
                    status: "COMPLETED",
                    description: payload.summary,
                    summary: payload.summary,
                    artifact: payload.artifact,
                  }
                : a
            )
          );
          setLogs((prev) => [
            ...prev,
            {
              timestamp: new Date().toLocaleTimeString(),
              type: "AGENT_COMPLETE",
              agent: payload.agent_name,
              message: payload.summary,
            },
          ]);
        });

        es.addEventListener("handoff", (e) => {
          const payload = JSON.parse(e.data);
          setLogs((prev) => [
            ...prev,
            {
              timestamp: new Date().toLocaleTimeString(),
              type: "HANDOFF",
              message: `Handoff #${payload.handoff_index}: ${payload.from_agent} → ${payload.to_agent}`,
            },
          ]);
        });

        es.addEventListener("workflow_completed", (e) => {
          const payload = JSON.parse(e.data);
          setIsCompleted(true);
          setLogs((prev) => [
            ...prev,
            {
              timestamp: new Date().toLocaleTimeString(),
              type: "COMPLETED",
              message: `State machine execution successfully finalized. Final itinerary synthesized.`,
            },
          ]);
          es.close();
        });

        es.addEventListener("workflow_failed", (e) => {
          const payload = JSON.parse(e.data);
          setError(payload.error || "Workflow failed");
          setLogs((prev) => [
            ...prev,
            {
              timestamp: new Date().toLocaleTimeString(),
              type: "ERROR",
              message: `Execution failed: ${payload.error}`,
            },
          ]);
          es.close();
        });

        es.addEventListener("done", () => {
          setIsCompleted(true);
          es.close();
        });

        es.onerror = () => {
          // Check backend status if SSE disconnects
          apiClient<any>(`/workflows/${activeRunId}`)
            .then((wf) => {
              if (wf?.data?.status === "COMPLETED") {
                setIsCompleted(true);
              }
            })
            .catch(() => {});
        };

        // Fallback polling interval to guarantee completion state synchronization
        const pollInterval = setInterval(async () => {
          if (!active) return;
          try {
            const wf = await apiClient<any>(`/workflows/${activeRunId}`);
            if (wf?.data?.status === "COMPLETED") {
              setIsCompleted(true);
              clearInterval(pollInterval);
            }
          } catch (e) {}
        }, 2000);

        return () => {
          clearInterval(pollInterval);
        };
      } catch (err: any) {
        if (active) setError(err.message || "Failed to establish real-time agent stream");
      }
    }

    startOrConnect();

    return () => {
      active = false;
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, [tripId, runId]);

  const activeAgent = agents.find((a) => a.id === activeTab) || agents[0];

  return (
    <div className="flex min-h-screen flex-col bg-stone-950 text-stone-100 selection:bg-amber-500/30">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-stone-800 bg-stone-900/60 px-6 py-4 backdrop-blur-md">
        <div className="flex items-center space-x-4">
          <Link
            href={`/app/trips/${tripId}`}
            className="text-stone-400 hover:text-white transition-colors flex items-center text-xs"
          >
            <ArrowLeft className="h-4 w-4 mr-1.5" /> Workspace
          </Link>
          <span className="text-stone-700">|</span>
          <div className="flex items-center space-x-2">
            <Compass className="h-5 w-5 text-amber-400" />
            <span className="font-display text-sm font-bold tracking-tight text-white">
              {trip?.title || "Multi-Agent Trip Intelligence"}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {isCompleted ? (
            <Link href={`/app/trips/${tripId}`}>
              <Button variant="gold" size="sm">
                <Sparkles className="h-3.5 w-3.5 mr-1.5" /> View Final Itinerary
              </Button>
            </Link>
          ) : (
            <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>Agents Coordinating</span>
            </div>
          )}
        </div>
      </header>

      {/* Main Analysis Screen Header (Section 39) */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-10 space-y-8">
        <div className="space-y-2 border-b border-stone-800/80 pb-6">
          <p className="text-xs font-mono font-semibold uppercase tracking-widest text-amber-500">
            Real-Time Multi-Agent Orchestration • 4 Sequential Handoffs
          </p>
          <h1 className="text-3xl md:text-5xl font-display font-black tracking-tight text-white uppercase">
            YOUR TRIP IS BEING BUILT.
          </h1>
          <p className="text-sm text-stone-400 max-w-2xl">
            TripSage coordinates five specialized AI agents with deterministic financial calculation
            and evidence citations. Real agent state transitions displayed below (no fake progress percentages).
          </p>
        </div>

        {/* 5 Agent Cards Horizontal Rail (Section 39) */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {agents.map((agent) => {
            const Icon = agent.icon;
            const isSelected = activeTab === agent.id;

            return (
              <button
                key={agent.id}
                onClick={() => setActiveTab(agent.id)}
                className={`text-left rounded-xl border p-4 transition-all ${
                  isSelected
                    ? "border-amber-500/70 bg-stone-900/90 shadow-lg shadow-amber-500/5 ring-1 ring-amber-500/30"
                    : "border-stone-800/70 bg-stone-900/40 hover:border-stone-700 hover:bg-stone-900/60"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-amber-500">{agent.id}</span>
                  {agent.status === "COMPLETED" && (
                    <span className="flex items-center text-[11px] font-semibold text-emerald-400">
                      <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Done
                    </span>
                  )}
                  {agent.status === "RUNNING" && (
                    <span className="flex items-center text-[11px] font-semibold text-amber-400 animate-pulse">
                      <span className="h-2 w-2 rounded-full bg-amber-400 mr-1.5" /> Running
                    </span>
                  )}
                  {agent.status === "WAITING" && (
                    <span className="flex items-center text-[11px] text-stone-500">
                      <Clock className="h-3 w-3 mr-1" /> Waiting
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-2 mb-1">
                  <Icon className={`h-4 w-4 ${isSelected ? "text-amber-400" : "text-stone-400"}`} />
                  <h3 className="font-semibold text-sm text-stone-100">{agent.name}</h3>
                </div>

                <p className="text-[11px] text-stone-400 line-clamp-2">{agent.role}</p>
              </button>
            );
          })}
        </div>

        {/* Two-Column Inspection & Real-Time Terminal */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Selected Agent Inspector & Artifact Preview */}
          <div className="lg:col-span-7 space-y-4">
            <Card className="border-stone-800 bg-stone-900/60">
              <CardHeader className="border-b border-stone-800/80 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 font-mono text-sm font-bold text-amber-400 border border-amber-500/20">
                      {activeAgent.id}
                    </span>
                    <div>
                      <CardTitle className="text-base text-white">{activeAgent.name}</CardTitle>
                      <CardDescription className="text-xs text-stone-400">
                        {activeAgent.role}
                      </CardDescription>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        activeAgent.status === "COMPLETED"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                          : activeAgent.status === "RUNNING"
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/30 animate-pulse"
                          : "bg-stone-800 text-stone-400"
                      }`}
                    >
                      {activeAgent.status}
                    </span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6 space-y-4">
                <div className="rounded-lg border border-stone-800/80 bg-stone-950/60 p-4">
                  <p className="text-xs font-mono text-stone-400 uppercase tracking-wider mb-1">
                    Current Agent Activity
                  </p>
                  <p className="text-sm text-stone-200">{activeAgent.description}</p>
                </div>

                {/* Live Artifact Preview */}
                {activeAgent.artifact ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-amber-500 font-semibold uppercase tracking-wider">
                        Structured Specialist Artifact ({activeAgent.stage})
                      </span>
                      <span className="text-[11px] text-emerald-400 flex items-center">
                        <ShieldCheck className="h-3.5 w-3.5 mr-1" /> Verified Output Schema
                      </span>
                    </div>

                    <pre className="max-h-72 overflow-y-auto rounded-lg border border-stone-800 bg-stone-950 p-4 text-xs font-mono text-amber-300/90 scrollbar-thin">
                      {JSON.stringify(activeAgent.artifact, null, 2)}
                    </pre>
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed border-stone-800 p-8 text-center text-stone-500">
                    <Clock className="h-6 w-6 mx-auto mb-2 opacity-40" />
                    <p className="text-xs">
                      Artifact will populate automatically once {activeAgent.name} completes its execution handoff.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right: Live Handoff Audit Terminal */}
          <div className="lg:col-span-5 space-y-4">
            <Card className="border-stone-800 bg-stone-900/60 flex flex-col h-[480px]">
              <CardHeader className="border-b border-stone-800/80 pb-3 flex flex-row items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Terminal className="h-4 w-4 text-amber-400" />
                  <CardTitle className="text-sm font-mono text-stone-200">
                    Agent Handoff Event Log
                  </CardTitle>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded">
                  LIVE SSE
                </span>
              </CardHeader>

              <CardContent className="flex-1 p-4 overflow-y-auto font-mono text-xs space-y-3 bg-stone-950/90 rounded-b-lg">
                {logs.length === 0 ? (
                  <div className="flex h-full items-center justify-center text-stone-600 text-xs">
                    Connecting to LangGraph agent pipeline...
                  </div>
                ) : (
                  logs.map((log, idx) => (
                    <div key={idx} className="space-y-0.5 border-l-2 border-stone-800 pl-2.5">
                      <div className="flex items-center space-x-2 text-[10px] text-stone-500">
                        <span>{log.timestamp}</span>
                        <span
                          className={`font-bold px-1 rounded text-[9px] ${
                            log.type === "HANDOFF"
                              ? "bg-amber-950 text-amber-400 border border-amber-800/50"
                              : log.type === "AGENT_COMPLETE"
                              ? "bg-emerald-950 text-emerald-400 border border-emerald-800/50"
                              : log.type === "ERROR"
                              ? "bg-red-950 text-red-400"
                              : "text-stone-400"
                          }`}
                        >
                          {log.type}
                        </span>
                      </div>
                      <p className="text-stone-300 leading-relaxed text-[11px]">{log.message}</p>
                    </div>
                  ))
                )}
                <div ref={logsEndRef} />
              </CardContent>
            </Card>

            {/* Quick Actions */}
            {isCompleted && (
              <div className="rounded-xl border border-emerald-800/60 bg-emerald-950/20 p-4 flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold text-emerald-400 flex items-center">
                    <CheckCircle2 className="h-4 w-4 mr-1.5" /> All 5 Agents Completed
                  </p>
                  <p className="text-[11px] text-stone-400">
                    Final itinerary and evidence citations ready for presentation.
                  </p>
                </div>
                <Link href={`/app/trips/${tripId}`}>
                  <Button variant="gold" size="sm">
                    Open Workspace <ChevronRight className="h-3.5 w-3.5 ml-1" />
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
