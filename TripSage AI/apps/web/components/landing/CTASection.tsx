"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Compass } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-28 px-6 max-w-6xl mx-auto border-t border-stone-900 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="relative overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-b from-stone-900/90 via-stone-950 to-stone-950 p-12 md:p-20 shadow-2xl"
      >
        {/* Ambient background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center space-x-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-mono font-bold text-amber-400">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>INSTANT MULTI-AGENT SYNTHESIS</span>
          </div>

          <h2 className="font-display text-4xl sm:text-6xl md:text-7xl font-black uppercase text-white tracking-tight leading-[1.02]">
            READY TO PLAN YOUR NEXT ADVENTURE?
          </h2>

          <p className="text-base sm:text-lg text-stone-300 font-light max-w-xl mx-auto leading-relaxed">
            Experience the future of travel planning. Five specialized AI agents standing by to
            research, calculate, and organize your trip.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/app/trips/new" className="w-full sm:w-auto">
              <Button
                variant="gold"
                size="lg"
                className="w-full sm:w-auto text-base font-bold px-10 py-6 rounded-xl shadow-xl shadow-amber-500/20 hover:scale-105 transition-transform"
              >
                Start Planning Free <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
