"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/auth-context";
import { apiClient } from "@/lib/api-client";
import { Compass, Plus, MapPin, Calendar, Users, DollarSign, LogOut, ArrowRight, Layers } from "lucide-react";

interface TripItem {
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
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [trips, setTrips] = useState<TripItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient<{ data: TripItem[] }>("/trips")
      .then((res) => setTrips(res.data || []))
      .catch(() => setTrips([]))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/sign-in");
  };

  return (
    <div className="flex min-h-screen flex-col bg-stone-950 text-stone-100">
      {/* App Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-stone-800 bg-stone-900/60 px-6 py-4 backdrop-blur-md">
        <div className="flex items-center space-x-2">
          <Compass className="h-6 w-6 text-sage-400" />
          <span className="font-display text-lg font-bold tracking-tight text-white">TRIPSAGE<span className="text-amber-500">.AI</span></span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-xs text-stone-400">
            Signed in as <span className="text-stone-200 font-medium">{user?.email || "Traveler"}</span>
          </span>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-1.5" /> Sign Out
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-display font-bold text-white">Trip Planning Workspace</h1>
            <p className="text-sm text-stone-400 mt-1">Manage your active itineraries and trigger multi-agent planning runs</p>
          </div>
          <Link href="/app/trips/new">
            <Button variant="gold" size="md">
              <Plus className="h-4 w-4 mr-2" /> Plan New Trip
            </Button>
          </Link>
        </div>

        {/* Trips Grid */}
        {loading ? (
          <div className="py-20 text-center text-stone-500 text-sm">
            <Compass className="h-6 w-6 animate-spin mx-auto text-amber-400 mb-2" />
            Loading trips...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Create New Card */}
            <Card className="border-dashed border-stone-800 bg-stone-900/30 flex flex-col items-center justify-center p-8 text-center hover:border-stone-700 transition-colors">
              <div className="h-12 w-12 rounded-full bg-stone-800/80 flex items-center justify-center mb-4 text-amber-400">
                <Plus className="h-6 w-6" />
              </div>
              <CardTitle className="text-base mb-1">Create a new travel plan</CardTitle>
              <CardDescription className="text-xs mb-6">
                Provide origin, destination, dates, and budget to activate the 5 agents.
              </CardDescription>
              <Link href="/app/trips/new">
                <Button variant="primary" size="sm">Get Started</Button>
              </Link>
            </Card>

            {/* List Existing Trips */}
            {trips.map((trip) => (
              <Card key={trip.id} className="border-stone-800 bg-stone-900/60 flex flex-col justify-between hover:border-stone-700 transition-colors">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                      {trip.status}
                    </span>
                    <span className="text-xs text-stone-400 capitalize">{trip.travel_style}</span>
                  </div>
                  <h3 className="font-display font-bold text-xl text-white mb-1">{trip.destination}</h3>
                  <p className="text-xs text-stone-400 mb-4">From {trip.origin}</p>

                  <div className="space-y-1.5 text-xs text-stone-300 border-t border-stone-800/60 pt-3">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center text-stone-400">
                        <Calendar className="h-3.5 w-3.5 mr-1.5 text-amber-400" /> Dates
                      </span>
                      <span>{trip.start_date} → {trip.end_date}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center text-stone-400">
                        <DollarSign className="h-3.5 w-3.5 mr-1.5 text-amber-400" /> Budget
                      </span>
                      <span>{trip.currency} ${Number(trip.budget).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center text-stone-400">
                        <Users className="h-3.5 w-3.5 mr-1.5 text-amber-400" /> Travelers
                      </span>
                      <span>{trip.traveler_count}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <Link href={`/app/trips/${trip.id}`} className="block">
                    <Button variant="outline" size="sm" className="w-full justify-between">
                      Open Workspace <ArrowRight className="h-3.5 w-3.5 ml-1" />
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
