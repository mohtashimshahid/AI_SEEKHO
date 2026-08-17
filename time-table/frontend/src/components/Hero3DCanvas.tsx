"use client";

import { motion } from "framer-motion";
import { Sparkles, Calendar, BookOpen, Clock, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function Hero3DCanvas() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#0e1712] via-[#121e17] to-[#0e1712] py-20 lg:py-32 border-b border-[#23352a]">
      {/* Background Soft Lamp Glow Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(212,175,55,0.12)_0%,rgba(14,23,18,0)_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Hero Text & Value Proposition */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#16221b] border border-[rgba(212,175,55,0.3)] text-[#D4AF37] text-xs font-mono-data uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>University Conflict-Free Schedule Engine</span>
            </div>

            <h1 className="font-serif-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#f3f4f3] leading-[1.15] tracking-tight">
              Turn Spreadsheet Chaos Into Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#E5C158] to-[#F1E7CE]">Ideal Timetable.</span>
            </h1>

            <p className="text-lg text-[#9ea8a1] max-w-xl font-light leading-relaxed">
              Stop cross-checking course sections by hand. Cursus ingests raw master timetables and automatically generates every conflict-free schedule combination, ranked by your exact life preferences.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <Link
                href="/catalog"
                className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#E5C158] text-[#0e1712] font-semibold text-base shadow-[0_0_25px_rgba(212,175,55,0.3)] hover:opacity-95 transition-all flex items-center justify-center gap-2"
              >
                <BookOpen className="w-5 h-5" />
                <span>Explore Course Catalog</span>
              </Link>
              <Link
                href="/generator"
                className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-[#16221b] border border-[#23352a] text-[#f3f4f3] hover:border-[#D4AF37] hover:text-[#D4AF37] font-semibold text-base transition-all flex items-center justify-center gap-2"
              >
                <Calendar className="w-5 h-5" />
                <span>Auto-Generate Timetable</span>
              </Link>
            </div>

            {/* Feature Highlights */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-[#23352a]/60 text-xs font-mono-data text-[#9ea8a1]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                <span>Zero Time Overlaps</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#D4AF37]" />
                <span>Under 2s Solver</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                <span>Preference Ranked</span>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Textbook & Glowing Timetable Page Animation */}
          <div className="lg:col-span-6 relative flex justify-center items-center perspective-1000 py-6">
            
            {/* Lamp Glow Backing */}
            <div className="absolute w-80 h-80 bg-[#D4AF37]/15 rounded-full blur-3xl" />

            {/* 3D Stacked Textbooks Canvas */}
            <div className="relative w-full max-w-lg aspect-[4/3] flex flex-col justify-end items-center space-y-[-14px]">
              
              {/* Stacked Textbook 1 (Bottom - Calculus) */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="w-[88%] h-12 rounded-r-md bg-gradient-to-r from-[#2c1d11] via-[#422d1b] to-[#1c120a] border-y border-r border-[#63452c] shadow-2xl flex items-center justify-between px-6 transform rotate-[-2deg]"
              >
                <span className="font-serif-display text-sm tracking-widest text-[#d4b996] uppercase font-bold">Calculus II • MATH201</span>
                <span className="text-[10px] font-mono-data text-[#8c6b47]">Vol. III</span>
              </motion.div>

              {/* Stacked Textbook 2 (Middle - Algorithms) */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="w-[92%] h-14 rounded-r-md bg-gradient-to-r from-[#14261c] via-[#1c3829] to-[#0c1711] border-y border-r border-[#2d5740] shadow-2xl flex items-center justify-between px-6 transform rotate-[1.5deg]"
              >
                <span className="font-serif-display text-sm tracking-widest text-[#D4AF37] uppercase font-bold">Algorithms & Structures • CS202</span>
                <span className="text-[10px] font-mono-data text-[#598c6d]">Vol. I</span>
              </motion.div>

              {/* Top Open Book with Turning Glowing Timetable Page */}
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="w-full relative bg-[#F1E7CE] text-[#1c2b23] rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-[#d9c9a3] p-6 grid grid-cols-2 gap-4 overflow-hidden"
              >
                {/* Book Center Spine crease */}
                <div className="absolute inset-y-0 left-1/2 w-8 -translate-x-1/2 bg-gradient-to-r from-transparent via-black/15 to-transparent pointer-events-none z-20" />

                {/* Left Page: Course Spine Details */}
                <div className="space-y-3 pr-2 border-r border-[#d9c9a3]/60 text-xs">
                  <div className="border-b border-[#1c2b23]/15 pb-2">
                    <span className="font-serif-display text-base font-bold block text-[#0e1712]">Cursus Master Schedule</span>
                    <span className="text-[10px] font-mono-data text-[#5c6b61]">Semester Autumn 2026</span>
                  </div>
                  <div className="space-y-1.5 font-mono-data text-[11px]">
                    <div className="p-1.5 rounded bg-[#e6d8b5] border border-[#d4c198]">
                      <span className="font-bold text-[#0e1712] block">CS101 - SEC-01</span>
                      <span className="text-[10px] text-[#4a574e]">08:30 - 09:45 • Hall A-101</span>
                    </div>
                    <div className="p-1.5 rounded bg-[#e6d8b5] border border-[#d4c198]">
                      <span className="font-bold text-[#0e1712] block">MATH201 - SEC-02</span>
                      <span className="text-[10px] text-[#4a574e]">11:30 - 12:45 • Math Lab 2</span>
                    </div>
                  </div>
                </div>

                {/* Right Page: Glowing Interactive Timetable Emerging From Page */}
                <div className="relative pl-2 flex flex-col justify-between overflow-hidden">
                  <div className="flex items-center justify-between border-b border-[#1c2b23]/15 pb-2">
                    <span className="font-serif-display text-xs font-bold text-[#0e1712]">Weekly Grid</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#16221b] text-[#D4AF37] font-mono-data text-[9px] font-bold">100% Fit</span>
                  </div>

                  {/* Animated Page Flip Motion Effect */}
                  <motion.div
                    animate={{ rotateY: [0, -15, 0] }}
                    transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                    className="my-2 p-2 rounded bg-[#0e1712] text-[#f3f4f3] border border-[#D4AF37]/50 shadow-[0_0_20px_rgba(212,175,55,0.25)] space-y-1.5"
                  >
                    <div className="text-[9px] font-mono-data uppercase tracking-wider text-[#D4AF37] font-bold flex justify-between">
                      <span>Mon / Wed</span>
                      <span>Conflict Free</span>
                    </div>

                    <div className="grid grid-cols-2 gap-1 text-[9px] font-mono-data">
                      <div className="bg-[#16221b] p-1 rounded border-l-2 border-[#D4AF37]">
                        <span className="block font-bold text-[#D4AF37]">CS101</span>
                        <span className="text-[8px] text-[#9ea8a1]">08:30-09:45</span>
                      </div>
                      <div className="bg-[#16221b] p-1 rounded border-l-2 border-[#598c6d]">
                        <span className="block font-bold text-[#598c6d]">MATH201</span>
                        <span className="text-[8px] text-[#9ea8a1]">11:30-12:45</span>
                      </div>
                    </div>
                  </motion.div>

                  <div className="text-[9px] text-center text-[#5c6b61] font-mono-data italic">
                    Emerging from open book page
                  </div>
                </div>

              </motion.div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
