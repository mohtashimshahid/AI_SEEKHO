import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Cpu, Disc3, Sparkles, ChevronDown, ArrowRight, Sliders } from 'lucide-react';

interface StoryOverlaysProps {
  progress: number; // 0 to 1
  onOpenSpecs: () => void;
}

export const StoryOverlays: React.FC<StoryOverlaysProps> = ({ progress, onOpenSpecs }) => {
  // Determine active storytelling milestone based on scroll progress
  const isHero = progress >= 0 && progress < 0.16;
  const isEngineering = progress >= 0.16 && progress < 0.42;
  const isAnc = progress >= 0.42 && progress < 0.68;
  const isSound = progress >= 0.68 && progress < 0.86;
  const isReassembly = progress >= 0.86;

  const scrollToNextSection = () => {
    const el = document.getElementById('anc-demo');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="w-full h-full max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-center relative pointer-events-none">
      {/* 1. HERO INTRO (0 - 15%) */}
      <AnimatePresence>
        {isHero && (
          <motion.div
            key="hero-overlay"
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -25, scale: 0.98 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center text-center max-w-3xl pointer-events-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-semibold tracking-widest text-cyan-300 uppercase">
                Flagship Audio Innovation
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-white mb-4 leading-none">
              Sony <span className="text-gradient">WH-1000XM6</span>
            </h1>

            <h2 className="text-2xl md:text-4xl font-light text-cyan-300/90 tracking-wide mb-6">
              Silence, perfected.
            </h2>

            <p className="text-base md:text-xl font-normal text-white/70 max-w-xl leading-relaxed mb-8">
              Flagship wireless noise cancelling, re-engineered for a world that never stops.
            </p>

            {/* Scroll Indicator */}
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              className="flex flex-col items-center gap-2 text-xs tracking-widest uppercase text-white/40 font-mono mt-4"
            >
              <span>Scroll to explore engineering</span>
              <ChevronDown className="w-4 h-4 text-cyan-400" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. ENGINEERING REVEAL (15 - 40%) */}
      <AnimatePresence>
        {isEngineering && (
          <motion.div
            key="engineering-overlay"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-6 md:left-16 max-w-md pointer-events-auto"
          >
            <div className="bg-card-glass p-8 rounded-3xl border border-white/10 shadow-2xl shadow-black/80 relative overflow-hidden">
              {/* Subtle top accent bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-cyan-400" />

              <div className="flex items-center gap-2 mb-4 text-cyan-400">
                <Disc3 className="w-5 h-5 animate-spin-slow" />
                <span className="text-xs font-bold tracking-widest uppercase font-mono">
                  Acoustic Architecture
                </span>
              </div>

              <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-4 leading-tight">
                Precision-engineered for silence.
              </h3>

              <p className="text-base text-white/70 leading-relaxed mb-4">
                Custom drivers, sealed acoustic chambers, and optimized airflow deliver studio-grade clarity.
              </p>

              <p className="text-sm text-white/60 leading-relaxed mb-6">
                Every component is tuned for balance, power, and comfort—hour after hour.
              </p>

              <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                <div className="px-3 py-1.5 rounded-lg bg-blue-950/60 border border-blue-500/30 text-xs font-mono text-cyan-300">
                  30mm Precision Driver
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-white/80">
                  Ultra-Soft Fit Leather
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. NOISE CANCELLING & MICROPHONES (40 - 65%) */}
      <AnimatePresence>
        {isAnc && (
          <motion.div
            key="anc-overlay"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-6 md:right-16 max-w-md pointer-events-auto"
          >
            <div className="bg-card-glass p-8 rounded-3xl border border-white/10 shadow-2xl shadow-black/80 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 to-blue-600" />

              <div className="flex items-center gap-2 mb-4 text-blue-400">
                <Cpu className="w-5 h-5 text-cyan-400" />
                <span className="text-xs font-bold tracking-widest uppercase font-mono">
                  HD Processor QN2 & V2 Chip
                </span>
              </div>

              <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-4 leading-tight">
                Adaptive noise cancelling, redefined.
              </h3>

              <ul className="space-y-3 text-sm text-white/70 mb-6">
                <li className="flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                  <span>Multi-microphone array listens in every direction for ambient noise.</span>
                </li>
                <li className="flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                  <span>Real-time noise analysis instantly adapts to your environment.</span>
                </li>
                <li className="flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                  <span>Your music stays pure—planes, trains, and crowds fade away.</span>
                </li>
              </ul>

              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-xs font-semibold text-cyan-300">
                <span>12 Active Microphones</span>
                <span>•</span>
                <span>Auto NC Optimizer</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. SOUND & UPSCALING (65 - 85%) */}
      <AnimatePresence>
        {isSound && (
          <motion.div
            key="sound-overlay"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-6 md:left-16 max-w-md pointer-events-auto"
          >
            <div className="bg-card-glass p-8 rounded-3xl border border-white/10 shadow-2xl shadow-black/80 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-300" />

              <div className="flex items-center gap-2 mb-4 text-cyan-400">
                <Sparkles className="w-5 h-5 text-cyan-300" />
                <span className="text-xs font-bold tracking-widest uppercase font-mono">
                  Audiophile Architecture
                </span>
              </div>

              <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-4 leading-tight">
                Immersive, lifelike sound.
              </h3>

              <p className="text-base text-white/75 leading-relaxed mb-4">
                High-performance drivers unlock detail, depth, and texture in every track.
              </p>

              <p className="text-sm text-white/60 leading-relaxed mb-6">
                AI-enhanced upscaling restores clarity to compressed audio, so every note feels alive.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/10">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-center">
                  <div className="text-xs text-white/50 uppercase tracking-wider font-mono">Codec</div>
                  <div className="text-sm font-bold text-white mt-0.5">LDAC™ 990kbps</div>
                </div>
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-center">
                  <div className="text-xs text-white/50 uppercase tracking-wider font-mono">AI Engine</div>
                  <div className="text-sm font-bold text-cyan-300 mt-0.5">DSEE Ultimate™</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. REASSEMBLY & CTA (85 - 100%) */}
      <AnimatePresence>
        {isReassembly && (
          <motion.div
            key="reassembly-overlay"
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center text-center max-w-2xl pointer-events-auto"
          >
            <div className="px-4 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-xs font-mono text-cyan-300 uppercase tracking-widest mb-4">
              Fully Assembled • Flagship Engineering
            </div>

            <h3 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-4">
              Hear everything. <br />
              <span className="text-gradient">Feel nothing else.</span>
            </h3>

            <p className="text-lg md:text-xl text-white/80 font-light mb-8">
              WH-1000XM6. Designed for focus, crafted for comfort.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
              <button
                onClick={scrollToNextSection}
                className="w-full sm:w-auto px-8 py-4 rounded-full font-semibold text-sm tracking-wider uppercase text-white bg-gradient-to-r from-[#0050FF] to-[#00D6FF] hover:from-[#0040E0] hover:to-[#00C0EE] transition-all duration-300 shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2 cursor-pointer group"
              >
                <span>Experience WH-1000XM6</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onOpenSpecs}
                className="w-full sm:w-auto px-8 py-4 rounded-full font-semibold text-sm tracking-wider uppercase text-white/90 bg-white/5 border border-white/15 hover:bg-white/10 hover:border-white/30 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sliders className="w-4 h-4 text-cyan-400" />
                <span>See Full Specs</span>
              </button>
            </div>

            <span className="text-xs text-white/40 tracking-wide font-mono">
              Engineered for airports, offices, and everything in between.
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
