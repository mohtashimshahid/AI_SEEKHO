"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/auth-context";
import { Compass, Plus, MapPin, Calendar, Users, DollarSign, LogOut } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout } = useAuth();

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

        {/* Trips Grid / Empty State */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-dashed border-stone-800 bg-stone-900/30 flex flex-col items-center justify-center p-8 text-center hover:border-stone-700 transition-colors">
            <div className="h-12 w-12 rounded-full bg-stone-800/80 flex items-center justify-center mb-4 text-amber-400">
              <Plus className="h-6 w-6" />
            </div>
            <CardTitle className="text-base mb-1">Create a new travel plan</CardTitle>
            <CardDescription className="text-xs mb-6">
              Provide your origin, destination, dates, and budget to activate the 5 agents.
            </CardDescription>
            <Link href="/app/trips/new">
              <Button variant="primary" size="sm">Get Started</Button>
            </Link>
          </Card>
        </div>
      </main>
    </div>
  );
}
