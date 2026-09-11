import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Compass, Sparkles, ShieldCheck, ArrowRight, Layers, DollarSign, Plane, MapPin } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-stone-950 text-stone-100">
      {/* Navigation */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-stone-800/80 bg-stone-950/80 px-6 py-4 backdrop-blur-md">
        <div className="flex items-center space-x-2">
          <Compass className="h-6 w-6 text-sage-400" />
          <span className="font-display text-lg font-bold tracking-tight text-white">TRIPSAGE<span className="text-amber-500">.AI</span></span>
        </div>
        <nav className="hidden md:flex items-center space-x-8 text-sm text-stone-400">
          <Link href="#agents" className="hover:text-stone-200 transition-colors">5 Agents</Link>
          <Link href="#how-it-works" className="hover:text-stone-200 transition-colors">How it works</Link>
          <Link href="#pricing" className="hover:text-stone-200 transition-colors">Experience</Link>
        </nav>
        <div className="flex items-center space-x-4">
          <Link href="/sign-in">
            <Button variant="ghost" size="sm">Sign In</Button>
          </Link>
          <Link href="/sign-up">
            <Button variant="primary" size="sm">Get Started</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative px-6 pt-24 pb-20 md:pt-32 md:pb-32 max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 rounded-full border border-stone-800 bg-stone-900/60 px-4 py-1.5 text-xs font-medium text-sage-300 mb-8 backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>5 Specialized Agents · Deterministic Budgeting · Verified Research</span>
          </div>
          
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-white uppercase leading-[1.05]">
            PLAN LESS. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-stone-200 via-amber-200 to-sage-400">
              TRAVEL MORE.
            </span>
          </h1>

          <p className="mt-6 text-lg md:text-xl text-stone-400 max-w-2xl mx-auto font-light leading-relaxed">
            TripSage AI turns your destination, budget, and travel style into a personalized trip plan — researched and synthesized by five specialized AI agents.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/sign-up">
              <Button variant="gold" size="lg" className="w-full sm:w-auto shadow-amber-950/50">
                Plan My Trip <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="#agents">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Explore The 5 Agents
              </Button>
            </Link>
          </div>
        </section>

        {/* Five Agents Section */}
        <section id="agents" className="py-24 border-t border-stone-900 bg-stone-900/30 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-xs uppercase tracking-widest text-amber-500 font-semibold mb-2">Orchestrated Intelligence</p>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white">One Request. Five Specialists. One Trip.</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {[
                { step: "01", title: "Destination Research", desc: "Attractions, weather, culture & verified safety insights.", icon: MapPin },
                { step: "02", title: "Budget Intelligence", desc: "Deterministic Python calculator for itemized budgets.", icon: DollarSign },
                { step: "03", title: "Flight & Stay", desc: "Practical flight corridors & neighborhood accommodations.", icon: Plane },
                { step: "04", title: "Local Experience", desc: "Curated culinary gems, culture & hidden local spots.", icon: Sparkles },
                { step: "05", title: "Trip Orchestrator", desc: "Synthesizes all findings into a verified day-by-day plan.", icon: Layers },
              ].map((agent) => {
                const Icon = agent.icon;
                return (
                  <div key={agent.step} className="rounded-xl border border-stone-800 bg-stone-950/60 p-6 flex flex-col justify-between hover:border-stone-700 transition-colors">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-mono font-bold text-amber-500">{agent.step}</span>
                        <Icon className="h-5 w-5 text-stone-400" />
                      </div>
                      <h3 className="font-display font-bold text-lg text-white mb-2">{agent.title}</h3>
                      <p className="text-xs text-stone-400 leading-relaxed">{agent.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-900 bg-stone-950 px-6 py-8 text-center text-xs text-stone-600">
        <p>© 2026 TripSage AI. Multi-Agent Travel Intelligence Platform.</p>
      </footer>
    </div>
  );
}
