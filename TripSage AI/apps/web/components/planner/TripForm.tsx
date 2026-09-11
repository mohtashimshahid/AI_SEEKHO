"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { apiClient } from "@/lib/api-client";
import { 
  MapPin, 
  Calendar, 
  Users, 
  DollarSign, 
  Sparkles, 
  Compass, 
  Building2, 
  ArrowRight,
  Minus,
  Plus,
  Check
} from "lucide-react";

const INTEREST_OPTIONS = [
  "Food",
  "Culture",
  "Adventure",
  "Nature",
  "Shopping",
  "Nightlife",
  "History",
  "Photography",
  "Relaxation",
];

const TRAVEL_STYLES = [
  { id: "budget", label: "Budget", desc: "Cost-effective, smart savings" },
  { id: "balanced", label: "Balanced", desc: "Optimal value & comfort" },
  { id: "comfort", label: "Comfort", desc: "Upgraded stays & convenience" },
  { id: "luxury", label: "Luxury", desc: "Premium 5-star experiences" },
];

const ACCOMMODATION_TYPES = [
  { id: "hotel", label: "Boutique / Hotel" },
  { id: "apartment", label: "Private Apartment" },
  { id: "resort", label: "Resort & Spa" },
  { id: "hostel", label: "Social Hostel" },
];

export function TripForm() {
  const router = useRouter();

  const [destination, setDestination] = useState("Istanbul, Turkey");
  const [origin, setOrigin] = useState("Lahore, Pakistan");
  const [startDate, setStartDate] = useState("2026-10-12");
  const [endDate, setEndDate] = useState("2026-10-19");
  const [travelers, setTravelers] = useState(2);
  const [budget, setBudget] = useState(1500);
  const [currency, setCurrency] = useState("USD");
  const [travelStyle, setTravelStyle] = useState("balanced");
  const [accommodationType, setAccommodationType] = useState("hotel");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    "Food",
    "Culture",
    "History",
  ]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload = {
        title: `${destination} Journey`,
        destination,
        origin,
        start_date: startDate,
        end_date: endDate,
        travelers: Number(travelers),
        budget: Number(budget),
        currency,
        travel_style: travelStyle,
        interests: selectedInterests,
        accommodation_preference: accommodationType,
        transportation_preference: "public_transport",
      };

      const response = await apiClient<{ id: string }>("/trips", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      router.push(`/app/trips/${response.id}`);
    } catch (err: any) {
      setError(err.message || "Failed to create trip plan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto">
      {error && (
        <div className="rounded-xl bg-red-950/60 border border-red-800 p-4 text-sm text-red-200">
          {error}
        </div>
      )}

      {/* Destination & Origin */}
      <Card className="border-stone-800 bg-stone-900/60">
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <MapPin className="h-5 w-5 mr-2 text-amber-400" /> Destination & Origin
          </CardTitle>
          <CardDescription>Where are you starting from, and where would you like the 5 agents to take you?</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Where are you going?"
            placeholder="e.g. Istanbul, Turkey or Tokyo, Japan"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            required
          />
          <Input
            label="Where are you traveling from?"
            placeholder="e.g. Lahore, Pakistan or London, UK"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            required
          />
        </CardContent>
      </Card>

      {/* Dates & Travelers */}
      <Card className="border-stone-800 bg-stone-900/60">
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Calendar className="h-5 w-5 mr-2 text-amber-400" /> Travel Dates & Group Size
          </CardTitle>
          <CardDescription>Select your travel window and total number of travelers.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Input
            label="Departure Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
          <Input
            label="Return Date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
          
          <div className="space-y-1.5">
            <label className="text-xs font-medium uppercase tracking-wider text-stone-300">
              Travelers
            </label>
            <div className="flex h-11 items-center justify-between rounded-lg border border-stone-700 bg-stone-950/60 px-4">
              <span className="text-sm font-semibold text-white flex items-center">
                <Users className="h-4 w-4 mr-2 text-stone-400" /> {travelers} {travelers === 1 ? "Traveler" : "Travelers"}
              </span>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setTravelers((t) => Math.max(1, t - 1))}
                  className="h-7 w-7 rounded bg-stone-800 flex items-center justify-center hover:bg-stone-700 text-stone-200 transition-colors"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setTravelers((t) => Math.min(20, t + 1))}
                  className="h-7 w-7 rounded bg-stone-800 flex items-center justify-center hover:bg-stone-700 text-stone-200 transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Budget & Travel Style */}
      <Card className="border-stone-800 bg-stone-900/60">
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <DollarSign className="h-5 w-5 mr-2 text-amber-400" /> Budget & Style
          </CardTitle>
          <CardDescription>The Budget Agent uses deterministic calculations around these limits.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="sm:col-span-2">
              <Input
                label="Target Total Budget"
                type="number"
                min="100"
                step="50"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium uppercase tracking-wider text-stone-300">Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="flex h-11 w-full rounded-lg border border-stone-700 bg-stone-950/60 px-4 text-sm text-stone-100 focus:border-sage-500 focus:outline-none focus:ring-1 focus:ring-sage-500"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="PKR">PKR (Rs)</option>
                <option value="AED">AED (د.إ)</option>
                <option value="TRY">TRY (₺)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium uppercase tracking-wider text-stone-300 block mb-3">
              Travel Style
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {TRAVEL_STYLES.map((style) => (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => setTravelStyle(style.id)}
                  className={`flex flex-col text-left p-4 rounded-xl border transition-all ${
                    travelStyle === style.id
                      ? "border-amber-500 bg-amber-500/10 text-white shadow-sm"
                      : "border-stone-800 bg-stone-950/40 text-stone-400 hover:border-stone-700"
                  }`}
                >
                  <span className="font-semibold text-sm text-stone-100 flex items-center justify-between">
                    {style.label}
                    {travelStyle === style.id && <Check className="h-4 w-4 text-amber-400" />}
                  </span>
                  <span className="text-xs text-stone-400 mt-1">{style.desc}</span>
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interests & Accommodation */}
      <Card className="border-stone-800 bg-stone-900/60">
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Sparkles className="h-5 w-5 mr-2 text-amber-400" /> Experiences & Stays
          </CardTitle>
          <CardDescription>Tailor the Local Experience and Flight & Stay specialists.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="text-xs font-medium uppercase tracking-wider text-stone-300 block mb-3">
              Interests & Activities (Multi-Select)
            </label>
            <div className="flex flex-wrap gap-2">
              {INTEREST_OPTIONS.map((interest) => {
                const isSelected = selectedInterests.includes(interest);
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                      isSelected
                        ? "bg-amber-500 text-stone-950 font-semibold shadow-sm"
                        : "bg-stone-800 text-stone-300 hover:bg-stone-700"
                    }`}
                  >
                    {interest} {isSelected && "✓"}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium uppercase tracking-wider text-stone-300 block mb-3">
              Accommodation Preference
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {ACCOMMODATION_TYPES.map((acc) => (
                <button
                  key={acc.id}
                  type="button"
                  onClick={() => setAccommodationType(acc.id)}
                  className={`p-3 rounded-lg border text-xs text-center transition-all ${
                    accommodationType === acc.id
                      ? "border-sage-500 bg-sage-900/40 text-sage-200 font-semibold"
                      : "border-stone-800 bg-stone-950/40 text-stone-400 hover:border-stone-700"
                  }`}
                >
                  {acc.label}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit CTA */}
      <div className="pt-4 flex justify-end">
        <Button
          type="submit"
          variant="gold"
          size="lg"
          disabled={loading}
          className="w-full sm:w-auto px-10 text-base"
        >
          {loading ? "Creating Trip..." : "Build My Trip"} <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </form>
  );
}
