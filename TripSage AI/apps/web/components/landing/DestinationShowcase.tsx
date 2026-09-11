"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, Sparkles, DollarSign, Calendar } from "lucide-react";

const DESTINATIONS = [
  {
    name: "Tokyo, Japan",
    theme: "Gastronomy & High-Tech Heritage",
    days: "7 Days",
    budget: "$3,800",
    tags: ["Michelin Dining", "Historic Temples", "Shibuya Sky"],
    gradient: "from-amber-500/20 via-rose-500/10 to-stone-950",
  },
  {
    name: "Istanbul, Turkey",
    theme: "Byzantine Grandeur & Bosphorus Ferries",
    days: "6 Days",
    budget: "$2,600",
    tags: ["Hagia Sophia", "Van Breakfast", "Galata Rooftops"],
    gradient: "from-emerald-500/20 via-amber-500/10 to-stone-950",
  },
  {
    name: "Rome & Amalfi Coast",
    theme: "Classical Antiquity & Coastal Panoramas",
    days: "8 Days",
    budget: "$4,400",
    tags: ["Colosseum at Sunset", "Trastevere Pasta", "Capri Cruise"],
    gradient: "from-blue-500/20 via-amber-500/10 to-stone-950",
  },
];

export function DestinationShowcase() {
  return (
    <section className="py-28 px-6 max-w-7xl mx-auto border-t border-stone-900">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div className="space-y-3">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-500">
            Curated Inspiration
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black text-white uppercase tracking-tight">
            POPULAR ORCHESTRATED ROUTES
          </h2>
          <p className="text-sm md:text-base text-stone-400 max-w-xl">
            Sample evidence-aware itineraries configured by our 5 specialized agents.
          </p>
        </div>

        <Link
          href="/app/trips/new"
          className="inline-flex items-center text-sm font-bold text-amber-400 hover:text-amber-300 transition-colors group"
        >
          <span>Create Custom Journey</span>
          <ArrowUpRight className="ml-1 h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {DESTINATIONS.map((dest, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.15 }}
            className={`rounded-2xl border border-stone-800 bg-gradient-to-b ${dest.gradient} p-8 flex flex-col justify-between hover:border-amber-500/50 transition-all duration-300 shadow-xl group`}
          >
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-stone-400 mb-4">
                <span className="flex items-center text-amber-400">
                  <Calendar className="h-3.5 w-3.5 mr-1" /> {dest.days}
                </span>
                <span className="flex items-center text-stone-300">
                  <DollarSign className="h-3.5 w-3.5 mr-0.5" /> {dest.budget}
                </span>
              </div>

              <h3 className="font-display font-black text-2xl text-white mb-2 group-hover:text-amber-400 transition-colors">
                {dest.name}
              </h3>
              <p className="text-xs text-stone-300 font-light mb-6">{dest.theme}</p>

              <div className="flex flex-wrap gap-1.5 mb-8">
                {dest.tags.map((tag, tIdx) => (
                  <span
                    key={tIdx}
                    className="rounded-full bg-stone-900/80 border border-stone-800 px-3 py-1 text-[11px] text-stone-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <Link href="/app/trips/new">
              <button className="w-full rounded-xl border border-stone-800 bg-stone-900/80 py-3 text-xs font-bold text-white hover:bg-amber-500 hover:text-stone-950 transition-colors">
                Plan This Route
              </button>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
