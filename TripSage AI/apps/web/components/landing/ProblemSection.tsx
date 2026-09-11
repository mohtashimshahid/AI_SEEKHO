"use client";

import { motion } from "framer-motion";
import { XCircle, CheckCircle2, ArrowRight } from "lucide-react";

const CHAOS_STEPS = [
  "Search 40+ browser tabs",
  "Compare hotel reviews on Reddit",
  "Calculate budget in messy spreadsheet",
  "Check seasonal weather charts",
  "Bookmark tourist traps",
  "Argue over itinerary dates",
  "Forget saved links & start over",
];

const TRIPSAGE_STEPS = [
  "Agent 1 verifies destination facts & climate",
  "Agent 2 calculates exact budget via deterministic Python math",
  "Agent 3 locates vetted flight corridors & boutique stays",
  "Agent 4 curates authentic food & hidden gems",
  "Agent 5 orchestrates verified, day-by-day plan with citations",
];

export function ProblemSection() {
  return (
    <section className="relative py-28 px-6 max-w-6xl mx-auto border-t border-stone-900">
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-500">
          The Problem We Solve
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black text-white uppercase tracking-tight">
          PLANNING A TRIP SHOULDN'T FEEL LIKE A SECOND JOB.
        </h2>
        <p className="text-sm md:text-base text-stone-400">
          Traditional travel planning means 30+ open tabs, hallucinated prices, and endless spreadsheets.
          TripSage transforms chaotic research into an autonomous, 5-agent intelligence agency.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        {/* Chaos Column */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl border border-red-950/60 bg-gradient-to-b from-stone-950 to-red-950/10 p-8 shadow-xl"
        >
          <div className="flex items-center space-x-2 text-red-400 font-mono text-xs uppercase font-bold tracking-wider mb-6">
            <XCircle className="h-4 w-4 text-red-400" />
            <span>Traditional Planning Chaos</span>
          </div>

          <div className="space-y-3 font-mono text-xs text-stone-400">
            {CHAOS_STEPS.map((step, idx) => (
              <div
                key={idx}
                className="flex items-center space-x-3 rounded-lg border border-red-950/40 bg-stone-900/30 p-3 line-through text-stone-500"
              >
                <span className="text-red-500 font-bold">✕</span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* TripSage Solution Column */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl border border-amber-500/30 bg-gradient-to-b from-stone-900/80 to-stone-950 p-8 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center space-x-2 text-amber-400 font-mono text-xs uppercase font-bold tracking-wider mb-6">
            <CheckCircle2 className="h-4 w-4 text-amber-400" />
            <span>TripSage Multi-Agent System</span>
          </div>

          <div className="space-y-3 font-mono text-xs text-stone-200">
            {TRIPSAGE_STEPS.map((step, idx) => (
              <div
                key={idx}
                className="flex items-center space-x-3 rounded-lg border border-amber-500/20 bg-stone-900/60 p-3 text-stone-200"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold">
                  {idx + 1}
                </span>
                <span>{step}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-center">
            <p className="font-display font-bold text-sm text-white">
              One Request. Five Specialists. One Itinerary.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
