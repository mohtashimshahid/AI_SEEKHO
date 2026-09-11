"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2, ArrowDown, ShieldCheck, Sparkles, Terminal } from "lucide-react";

const WORKFLOW_STEPS = [
  {
    step: "01",
    agent: "Destination Research Agent",
    status: "COMPLETED",
    summary: "Identified 4 attractions & seasonal weather profile (19°C) for Tokyo, Japan.",
    time: "0.4s",
  },
  {
    step: "02",
    agent: "Budget Intelligence Agent",
    status: "COMPLETED",
    summary: "Computed exact deterministic breakdown: USD $4,200.00 ($2,100/person).",
    time: "0.2s",
  },
  {
    step: "03",
    agent: "Flight & Stay Agent",
    status: "COMPLETED",
    summary: "Selected ANA non-stop corridor + Shinjuku Boutique Hotel ($120/night).",
    time: "0.5s",
  },
  {
    step: "04",
    agent: "Local Experiences Agent",
    status: "COMPLETED",
    summary: "Curated Tsukiji Outer Market gastronomy & Yanaka historical walking tour.",
    time: "0.3s",
  },
  {
    step: "05",
    agent: "Trip Orchestrator",
    status: "COMPLETED",
    summary: "Synthesized 7-day verified itinerary with 4 sources and packing checklist.",
    time: "0.6s",
  },
];

export function WorkflowVisualization() {
  const [activeStep, setActiveStep] = useState(4);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % WORKFLOW_STEPS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-28 px-6 max-w-6xl mx-auto border-t border-stone-900">
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-500">
          Live State Machine Visualization (PRD Section 36)
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black text-white uppercase tracking-tight">
          EVIDENCE-AWARE ORCHESTRATION IN ACTION
        </h2>
        <p className="text-sm md:text-base text-stone-400">
          Watch how intermediate agent states pass context across 4 handoffs to guarantee reliable,
          arithmetically sound travel plans.
        </p>
      </div>

      <div className="rounded-2xl border border-stone-800 bg-stone-950 p-6 md:p-8 shadow-2xl">
        <div className="flex items-center justify-between border-b border-stone-800 pb-4 mb-6">
          <div className="flex items-center space-x-3">
            <span className="flex h-3 w-3 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
              LangGraph State Machine Engine
            </span>
          </div>
          <span className="text-xs font-mono text-stone-400">
            Trip: Tokyo Gastronomy & Culture (7 Days)
          </span>
        </div>

        <div className="space-y-4">
          {WORKFLOW_STEPS.map((item, idx) => {
            const isDone = idx <= activeStep;
            const isCurrent = idx === activeStep;

            return (
              <div
                key={idx}
                className={`rounded-xl border p-4 transition-all duration-300 ${
                  isCurrent
                    ? "border-amber-500 bg-stone-900/90 shadow-lg shadow-amber-500/5"
                    : isDone
                    ? "border-stone-800/80 bg-stone-900/40"
                    : "border-stone-900 bg-stone-950/40 opacity-40"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-3">
                    <span className="font-mono text-xs font-bold text-amber-500">{item.step}</span>
                    <span className="font-semibold text-sm text-white">{item.agent}</span>
                  </div>

                  <div className="flex items-center space-x-3">
                    {isCurrent ? (
                      <span className="inline-flex items-center rounded-full bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 text-xs font-semibold text-amber-400 animate-pulse">
                        <Loader2 className="h-3 w-3 mr-1 animate-spin" /> ACTIVE
                      </span>
                    ) : isDone ? (
                      <span className="inline-flex items-center rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
                        <CheckCircle2 className="h-3 w-3 mr-1" /> DONE
                      </span>
                    ) : (
                      <span className="text-xs font-mono text-stone-500">WAITING</span>
                    )}
                    <span className="text-[11px] font-mono text-stone-500">{item.time}</span>
                  </div>
                </div>

                <p className="mt-2 text-xs text-stone-300 font-mono pl-6 border-l border-stone-800 ml-2">
                  {item.summary}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
