"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Compass, MapPin, Plane, ShieldCheck } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-[88vh] flex flex-col items-center justify-center overflow-hidden px-6 pt-16 pb-20 text-center">
      {/* Background Ambient Glows & Grid */}
      <div className="absolute inset-0 -z-10 flex items-center justify-center">
        <div className="h-[500px] w-[500px] rounded-full bg-amber-500/10 blur-[130px]" />
        <div className="h-[400px] w-[400px] rounded-full bg-emerald-500/5 blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#262626_1px,transparent_1px)] [background-size:24px_24px] opacity-30" />
      </div>

      {/* Pill Badge */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="inline-flex items-center space-x-2 rounded-full border border-stone-800 bg-stone-900/80 px-4 py-1.5 text-xs font-semibold text-stone-300 shadow-xl backdrop-blur-md mb-8"
      >
        <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-ping" />
        <span className="font-mono text-amber-400 font-bold">5 SPECIALIZED AGENTS</span>
        <span className="text-stone-600">•</span>
        <span className="text-stone-400">Deterministic Financial Math</span>
      </motion.div>

      {/* Oversized Kinetic Headline (Section 31 & 32) */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-5xl"
      >
        <h1 className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black uppercase tracking-tight text-white leading-[0.95]">
          PLAN LESS. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-stone-100 via-amber-200 to-amber-500">
            TRAVEL MORE.
          </span>
        </h1>
      </motion.div>

      {/* Subheadline */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.25, ease: "easeOut" }}
        className="mt-8 max-w-2xl text-base sm:text-lg md:text-xl font-light leading-relaxed text-stone-300"
      >
        TripSage AI turns your destination, budget, and travel style into an evidence-backed
        itinerary — researched, calculated, and orchestrated by five specialized AI agents.
      </motion.p>

      {/* CTA Button Rail */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md"
      >
        <Link href="/app/trips/new" className="w-full sm:w-auto">
          <Button
            variant="gold"
            size="lg"
            className="w-full sm:w-auto text-base font-bold shadow-2xl shadow-amber-500/20 px-8 py-6 rounded-xl hover:scale-105 transition-transform"
          >
            Plan My Trip <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
        <Link href="#agents" className="w-full sm:w-auto">
          <Button
            variant="outline"
            size="lg"
            className="w-full sm:w-auto text-base border-stone-800 bg-stone-900/50 hover:bg-stone-900 px-8 py-6 rounded-xl text-stone-300 hover:text-white transition-all"
          >
            See How It Works
          </Button>
        </Link>
      </motion.div>

      {/* Animated Route Flow Banner (Section 32, 33) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.55 }}
        className="mt-16 w-full max-w-3xl rounded-2xl border border-stone-800/90 bg-stone-900/40 p-5 shadow-2xl backdrop-blur-xl"
      >
        <div className="flex items-center justify-between border-b border-stone-800/80 pb-3 mb-4 text-xs font-mono text-stone-400">
          <span className="flex items-center text-amber-400 font-semibold">
            <Compass className="h-4 w-4 mr-1.5 animate-spin" style={{ animationDuration: "12s" }} />
            ACTIVE ORCHESTRATION PIPELINE
          </span>
          <span className="text-stone-500">4 SEQUENTIAL HANDOFFS</span>
        </div>

        <div className="grid grid-cols-4 gap-2 text-center text-xs">
          {[
            { city: "San Francisco", code: "SFO", tag: "Origin" },
            { city: "Dubai", code: "DXB", tag: "Corridor" },
            { city: "Istanbul", code: "IST", tag: "Boutique Stay" },
            { city: "Tokyo", code: "HND", tag: "Gastronomy" },
          ].map((node, i) => (
            <div key={i} className="relative rounded-xl border border-stone-800 bg-stone-950/70 p-3">
              <span className="text-[10px] font-mono uppercase text-amber-500/90 block mb-0.5 font-bold">
                {node.tag}
              </span>
              <span className="font-display font-black text-sm text-white block">{node.code}</span>
              <span className="text-[11px] text-stone-400 truncate block">{node.city}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
