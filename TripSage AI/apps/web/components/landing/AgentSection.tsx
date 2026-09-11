"use client";

import { motion } from "framer-motion";
import { Search, Calculator, Plane, Utensils, Layers, ArrowRight, ShieldCheck } from "lucide-react";

const AGENTS = [
  {
    num: "01",
    title: "Destination Research",
    tagline: "FACT LOOKUP & LIVE WEB INTELLIGENCE",
    desc: "Gathers season-specific weather, cultural norms, safety guidelines, and iconic landmarks with strict source verification.",
    tools: ["search_web", "get_destination_data"],
    icon: Search,
  },
  {
    num: "02",
    title: "Budget Intelligence",
    tagline: "DETERMINISTIC FINANCIAL ENGINE",
    desc: "Computes authoritative cost allocations for flights, lodging, food, transport, and contingencies. Zero LLM arithmetic hallucinations.",
    tools: ["calculate_trip_budget", "Decimal Arithmetic"],
    icon: Calculator,
  },
  {
    num: "03",
    title: "Flight & Stay",
    tagline: "CORRIDORS & NEIGHBORHOOD CURATION",
    desc: "Analyzes transit corridors and selects walkable neighborhood accommodations tailored to traveler count and budget thresholds.",
    tools: ["Corridor Matching", "Amenity Index"],
    icon: Plane,
  },
  {
    num: "04",
    title: "Local Experiences",
    tagline: "CULINARY & HIDDEN GEM DISCOVERY",
    desc: "Curates authentic dining, cultural rituals, and secret spots matched to the user's specific travel interests and pace.",
    tools: ["Experience Graph", "Vetted Dining DB"],
    icon: Utensils,
  },
  {
    num: "05",
    title: "Trip Orchestrator",
    tagline: "FINAL SYNTHESIS & AUDIT",
    desc: "Assembles findings from Specialists 1–4 into a cohesive, evidence-backed day-by-day plan with packing checklists and verified citations.",
    tools: ["Synthesis Engine", "Source Provenance"],
    icon: Layers,
  },
];

export function AgentSection() {
  return (
    <section id="agents" className="py-28 px-6 max-w-7xl mx-auto border-t border-stone-900">
      <div className="text-center max-w-3xl mx-auto mb-20 space-y-3">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-500">
          The Five Specialized Agents (PRD Section 35)
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black text-white uppercase tracking-tight">
          COLLABORATIVE MULTI-AGENT ARCHITECTURE
        </h2>
        <p className="text-sm md:text-base text-stone-400">
          Four sequential handoffs ensure each specialist focuses on its core domain before the
          Orchestrator synthesizes the final verified itinerary.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {AGENTS.map((agent, idx) => {
          const Icon = agent.icon;
          return (
            <motion.div
              key={agent.num}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group relative rounded-2xl border border-stone-800 bg-stone-950/80 p-6 flex flex-col justify-between hover:border-amber-500/50 hover:bg-stone-900/60 transition-all duration-300 shadow-xl"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <span className="font-mono text-xl font-black text-amber-500">{agent.num}</span>
                  <div className="p-2 rounded-lg bg-stone-900 border border-stone-800 group-hover:border-amber-500/40 transition-colors">
                    <Icon className="h-5 w-5 text-stone-300 group-hover:text-amber-400 transition-colors" />
                  </div>
                </div>

                {/* Tagline */}
                <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest block mb-1">
                  {agent.tagline}
                </span>

                {/* Title */}
                <h3 className="font-display font-black text-xl text-white mb-3">
                  {agent.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-stone-400 leading-relaxed mb-6 font-light">
                  {agent.desc}
                </p>
              </div>

              {/* Tools & Handoff Indicator */}
              <div className="border-t border-stone-800/80 pt-4 space-y-2">
                <span className="text-[10px] font-mono text-stone-500 uppercase block">
                  Specialist Tools
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {agent.tools.map((tool, tIdx) => (
                    <span
                      key={tIdx}
                      className="inline-flex items-center rounded-md bg-stone-900 border border-stone-800 px-2 py-0.5 text-[10px] font-mono text-stone-300"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
