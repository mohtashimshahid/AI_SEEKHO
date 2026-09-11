import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Compass, Sparkles, ArrowRight } from "lucide-react";
import { Hero } from "@/components/landing/Hero";
import { TravelTicker } from "@/components/landing/TravelTicker";
import { ProblemSection } from "@/components/landing/ProblemSection";
import { AgentSection } from "@/components/landing/AgentSection";
import { WorkflowVisualization } from "@/components/landing/WorkflowVisualization";
import { DestinationShowcase } from "@/components/landing/DestinationShowcase";
import { CTASection } from "@/components/landing/CTASection";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-stone-950 text-stone-100 selection:bg-amber-500/30 selection:text-white">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-stone-800/80 bg-stone-950/80 px-6 py-4 backdrop-blur-md">
        <div className="flex items-center space-x-2.5">
          <Compass className="h-6 w-6 text-amber-400" />
          <span className="font-display text-lg font-black tracking-tight text-white">
            TRIPSAGE<span className="text-amber-500">.AI</span>
          </span>
        </div>

        <nav className="hidden md:flex items-center space-x-8 text-xs font-mono uppercase tracking-wider text-stone-400">
          <Link href="#agents" className="hover:text-amber-400 transition-colors">
            5 Specialists
          </Link>
          <Link href="/app/trips/new" className="hover:text-amber-400 transition-colors">
            Trip Planner
          </Link>
          <Link href="/app/dashboard" className="hover:text-amber-400 transition-colors">
            Workspace
          </Link>
        </nav>

        <div className="flex items-center space-x-3">
          <Link href="/sign-in">
            <Button variant="ghost" size="sm" className="text-xs">
              Sign In
            </Button>
          </Link>
          <Link href="/app/trips/new">
            <Button variant="gold" size="sm" className="text-xs font-bold shadow-amber-950/40">
              Plan My Trip
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Screen 1: Kinetic Hero */}
        <Hero />

        {/* Continuous Horizontal Destination Ticker */}
        <TravelTicker />

        {/* Problem Breakdown */}
        <ProblemSection />

        {/* 5-Agent Collaborative Specialists */}
        <AgentSection />

        {/* Live LangGraph State Machine Visualization */}
        <WorkflowVisualization />

        {/* Curated Destination Showcases */}
        <DestinationShowcase />

        {/* Closing High-Impact Call to Action */}
        <CTASection />
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-900 bg-stone-950 px-6 py-10 text-center text-xs font-mono text-stone-600 space-y-2">
        <p className="text-stone-400 font-display font-semibold text-sm">
          TRIPSAGE AI — MULTI-AGENT TRAVEL INTELLIGENCE AGENCY
        </p>
        <p>© 2026 TripSage AI. All rights reserved. Built with Next.js, FastAPI & LangGraph.</p>
      </footer>
    </div>
  );
}
