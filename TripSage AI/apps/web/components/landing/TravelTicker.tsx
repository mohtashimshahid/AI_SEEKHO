"use client";

import { motion } from "framer-motion";

const DESTINATIONS = [
  "PARIS",
  "TOKYO",
  "ISTANBUL",
  "DUBAI",
  "ROME",
  "BALI",
  "KYOTO",
  "CAPE TOWN",
  "BARCELONA",
  "NEW YORK",
  "AMALFI",
  "SANTORINI",
];

export function TravelTicker() {
  const items = [...DESTINATIONS, ...DESTINATIONS, ...DESTINATIONS];

  return (
    <div className="relative w-full overflow-hidden border-y border-stone-800/80 bg-stone-950/90 py-4 select-none backdrop-blur-md">
      {/* Left and right fade masks */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-stone-950 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-stone-950 to-transparent" />

      <motion.div
        className="flex whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: 35,
        }}
      >
        {items.map((city, idx) => (
          <div key={idx} className="flex items-center space-x-6 px-4">
            <span className="font-display text-sm md:text-base font-black tracking-widest text-stone-400 hover:text-amber-400 transition-colors">
              {city}
            </span>
            <span className="text-xs font-mono font-bold text-amber-500/70">→</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
