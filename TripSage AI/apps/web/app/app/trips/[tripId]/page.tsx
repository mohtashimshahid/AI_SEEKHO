"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { apiClient } from "@/lib/api-client";
import { 
  Compass, 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Users, 
  DollarSign, 
  Sparkles, 
  Layers, 
  Play, 
  CheckCircle2, 
  Clock,
  ShieldAlert
} from "lucide-react";

interface TripData {
  id: string;
  title: string;
  origin: string;
  destination: string;
  start_date: string;
  end_date: string;
  traveler_count: number;
  budget: string | number;
  currency: string;
  travel_style: string;
  status: string;
  preference?: {
    interests: string[];
    accommodation_type: string;
    transport_preference: string;
  };
}

export default function TripWorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const tripId = params.tripId as string;

  const [trip, setTrip] = useState<TripData | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tripId) return;

    apiClient<TripData>(`/trips/${tripId}`)
      .then((data) => setTrip(data))
      .catch((err) => setError(err.message || "Failed to load trip details"))
      .finally(() => setLoading(false));
  }, [tripId]);

  const handleStartAnalysis = async () => {
    if (!tripId) return;
    setAnalyzing(true);
    try {
      await apiClient(`/trips/${tripId}/analyze`, { method: "POST" });
      setTrip((prev) => prev ? { ...prev, status: "ANALYZING" } : null);
    } catch (err: any) {
      setError(err.message || "Failed to trigger multi-agent analysis.");
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-950 text-stone-300">
        <div className="text-center space-y-3">
          <Compass className="h-8 w-8 animate-spin mx-auto text-amber-400" />
          <p className="text-xs uppercase tracking-widest text-stone-400">Loading Trip Workspace...</p>
        </div>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-stone-950 p-6 text-stone-100">
        <Card className="max-w-md w-full border-red-900 bg-stone-900">
          <CardHeader>
            <CardTitle className="text-red-400 flex items-center">
              <ShieldAlert className="h-5 w-5 mr-2" /> Error Loading Trip
            </CardTitle>
            <CardDescription>{error || "Trip not found."}</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/app/dashboard">
              <Button variant="outline" size="sm">Return to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-stone-950 text-stone-100">
      {/* Workspace Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-stone-800 bg-stone-900/60 px-6 py-4 backdrop-blur-md">
        <div className="flex items-center space-x-4">
          <Link href="/app/dashboard" className="text-stone-400 hover:text-white transition-colors flex items-center text-xs">
            <ArrowLeft className="h-4 w-4 mr-1.5" /> Dashboard
          </Link>
          <span className="text-stone-700">|</span>
          <div className="flex items-center space-x-2">
            <Compass className="h-5 w-5 text-sage-400" />
            <span className="font-display text-base font-bold tracking-tight text-white">{trip.title}</span>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <span className="inline-flex items-center rounded-full bg-amber-500/10 border border-amber-500/30 px-3 py-1 text-xs font-semibold text-amber-400">
            {trip.status}
          </span>
          <Button
            variant="gold"
            size="sm"
            onClick={handleStartAnalysis}
            disabled={analyzing || trip.status === "ANALYZING"}
          >
            <Play className="h-3.5 w-3.5 mr-1.5 fill-current" />
            {analyzing ? "Starting Agents..." : trip.status === "ANALYZING" ? "Analysis Running" : "Activate 5 Agents"}
          </Button>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-10 space-y-8">
        {/* Top Summary Banner */}
        <div className="rounded-2xl border border-stone-800 bg-gradient-to-r from-stone-900/90 via-stone-900/60 to-stone-950 p-8 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-amber-500 mb-1">Trip Details</p>
              <h1 className="text-3xl md:text-4xl font-display font-black text-white">{trip.destination}</h1>
              <p className="text-sm text-stone-400 mt-1">Departing from {trip.origin}</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
              <div className="rounded-xl border border-stone-800 bg-stone-950/60 p-3.5">
                <span className="text-xs text-stone-400 block flex items-center">
                  <Calendar className="h-3.5 w-3.5 mr-1 text-amber-400" /> Dates
                </span>
                <span className="text-xs font-semibold text-white mt-1 block">
                  {trip.start_date} → {trip.end_date}
                </span>
              </div>
              <div className="rounded-xl border border-stone-800 bg-stone-950/60 p-3.5">
                <span className="text-xs text-stone-400 block flex items-center">
                  <Users className="h-3.5 w-3.5 mr-1 text-amber-400" /> Group
                </span>
                <span className="text-xs font-semibold text-white mt-1 block">
                  {trip.traveler_count} {trip.traveler_count === 1 ? "Traveler" : "Travelers"}
                </span>
              </div>
              <div className="rounded-xl border border-stone-800 bg-stone-950/60 p-3.5">
                <span className="text-xs text-stone-400 block flex items-center">
                  <DollarSign className="h-3.5 w-3.5 mr-1 text-amber-400" /> Budget
                </span>
                <span className="text-xs font-semibold text-white mt-1 block">
                  {trip.currency} ${Number(trip.budget).toLocaleString()}
                </span>
              </div>
              <div className="rounded-xl border border-stone-800 bg-stone-950/60 p-3.5">
                <span className="text-xs text-stone-400 block flex items-center">
                  <Sparkles className="h-3.5 w-3.5 mr-1 text-amber-400" /> Style
                </span>
                <span className="text-xs font-semibold text-white capitalize mt-1 block">
                  {trip.travel_style}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 5-Agent Workspace Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            { name: "01 Destination Research", status: "Awaiting Trigger", detail: "Weather, Culture, Attractions" },
            { name: "02 Budget Intelligence", status: "Awaiting Trigger", detail: "Deterministic Math" },
            { name: "03 Flight & Stay", status: "Awaiting Trigger", detail: "Corridors & Neighborhoods" },
            { name: "04 Local Experiences", status: "Awaiting Trigger", detail: "Culinary & Hidden Gems" },
            { name: "05 Trip Orchestrator", status: "Awaiting Trigger", detail: "Final Synthesized Itinerary" },
          ].map((agent, i) => (
            <Card key={i} className="border-stone-800/80 bg-stone-900/40 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-amber-500">{agent.name.slice(0, 2)}</span>
                <Clock className="h-3.5 w-3.5 text-stone-500" />
              </div>
              <h3 className="font-semibold text-sm text-stone-200 mb-1">{agent.name.slice(3)}</h3>
              <p className="text-[11px] text-stone-400">{agent.detail}</p>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
