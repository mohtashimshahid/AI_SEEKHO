import Link from "next/link";
import { TripForm } from "@/components/planner/TripForm";
import { Compass, ArrowLeft } from "lucide-react";

export default function NewTripPage() {
  return (
    <div className="flex min-h-screen flex-col bg-stone-950 text-stone-100">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-stone-800 bg-stone-900/60 px-6 py-4 backdrop-blur-md">
        <div className="flex items-center space-x-4">
          <Link href="/app/dashboard" className="text-stone-400 hover:text-white transition-colors flex items-center text-xs">
            <ArrowLeft className="h-4 w-4 mr-1.5" /> Back to Dashboard
          </Link>
          <span className="text-stone-700">|</span>
          <div className="flex items-center space-x-2">
            <Compass className="h-5 w-5 text-sage-400" />
            <span className="font-display text-base font-bold tracking-tight text-white">TRIPSAGE<span className="text-amber-500">.AI</span></span>
          </div>
        </div>
      </header>

      {/* Main Form Body */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-12">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-xs uppercase tracking-widest text-amber-500 font-semibold mb-2">
            Multi-Agent Travel Planner
          </p>
          <h1 className="text-3xl md:text-5xl font-display font-bold text-white tracking-tight">
            Design Your Trip
          </h1>
          <p className="text-stone-400 text-sm mt-3">
            Tell our 5 specialist agents where you want to go, your travel dates, and budget. We will research and synthesize a fully customized travel plan.
          </p>
        </div>

        <TripForm />
      </main>
    </div>
  );
}
