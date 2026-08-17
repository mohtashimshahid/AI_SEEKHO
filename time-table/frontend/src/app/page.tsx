"use client";

import Navbar from "@/components/Navbar";
import Hero3DCanvas from "@/components/Hero3DCanvas";
import { BookOpen, Calendar, ShieldCheck, Zap, Layers, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0e1712] text-[#f3f4f3] flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* 3D Dark Academia Hero Scene */}
        <Hero3DCanvas />

        {/* Feature Cards Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
            <h2 className="font-serif-display text-3xl sm:text-4xl font-bold text-[#f3f4f3]">
              Crafted For University Students & Advisors
            </h2>
            <p className="text-[#9ea8a1] text-base font-light">
              Built from the ground up to solve registration stress with instant algorithmic conflict resolution and soft preference ranking.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Feature 1 */}
            <div className="bg-[#16221b] p-8 rounded-xl border border-[#23352a] hover:border-[#D4AF37]/50 transition-all space-y-4 group">
              <div className="w-12 h-12 rounded-lg bg-[#0e1712] border border-[#23352a] flex items-center justify-center text-[#D4AF37] group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="font-serif-display text-xl font-bold text-[#f3f4f3]">Queryable Course Catalog</h3>
              <p className="text-sm text-[#9ea8a1] leading-relaxed">
                Full-text search course titles and codes across all university departments. Inspect section instructors, time slots, and rooms in one clean place.
              </p>
              <Link href="/catalog" className="inline-flex items-center gap-1 text-xs font-semibold text-[#D4AF37] hover:underline pt-2">
                <span>Browse Catalog</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Feature 2 */}
            <div className="bg-[#16221b] p-8 rounded-xl border border-[#23352a] hover:border-[#D4AF37]/50 transition-all space-y-4 group">
              <div className="w-12 h-12 rounded-lg bg-[#0e1712] border border-[#23352a] flex items-center justify-center text-[#D4AF37] group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="font-serif-display text-xl font-bold text-[#f3f4f3]">Backtracking Solver Engine</h3>
              <p className="text-sm text-[#9ea8a1] leading-relaxed">
                Computes thousands of potential section permutations in under 2 seconds, filtering out time overlaps and scoring schedules against your preferred free days and time bounds.
              </p>
              <Link href="/generator" className="inline-flex items-center gap-1 text-xs font-semibold text-[#D4AF37] hover:underline pt-2">
                <span>Try Generator</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Feature 3 */}
            <div className="bg-[#16221b] p-8 rounded-xl border border-[#23352a] hover:border-[#D4AF37]/50 transition-all space-y-4 group">
              <div className="w-12 h-12 rounded-lg bg-[#0e1712] border border-[#23352a] flex items-center justify-center text-[#D4AF37] group-hover:scale-110 transition-transform">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="font-serif-display text-xl font-bold text-[#f3f4f3]">Master Excel Ingestion</h3>
              <p className="text-sm text-[#9ea8a1] leading-relaxed">
                Admins can upload the raw semester master timetable spreadsheet. The ingestion parser automatically normalizes dates and logs unparseable rows for audit review.
              </p>
              <Link href="/admin/ingestion" className="inline-flex items-center gap-1 text-xs font-semibold text-[#D4AF37] hover:underline pt-2">
                <span>Admin Upload</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#23352a] bg-[#0e1712] py-8 text-center text-xs text-[#9ea8a1] font-mono-data">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <span className="font-bold text-[#f3f4f3]">Cursus Timetable Builder</span>
          </div>
          <span>Conflict-Free University Scheduling Platform • Autumn 2026</span>
        </div>
      </footer>
    </div>
  );
}
