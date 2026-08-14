import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, Mic, Radio, ShieldCheck, Zap, Activity } from 'lucide-react';


export const InteractiveAncDemo: React.FC = () => {
  const [ancMode, setAncMode] = useState<'on' | 'ambient' | 'off'>('on');

  return (
    <section id="anc-demo" className="relative py-28 px-6 md:px-12 bg-[#050505] overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-r from-blue-600/10 via-cyan-500/10 to-transparent blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-xs font-mono text-cyan-300 uppercase tracking-widest mb-4">
            <Zap className="w-3.5 h-3.5" />
            Interactive Acoustic Simulation
          </div>

          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6">
            Control the Soundscape. <br />
            <span className="text-gradient">Instant Isolation.</span>
          </h2>

          <p className="text-base md:text-lg text-white/70 leading-relaxed">
            Experience how the HD Noise Cancelling Processor QN2 monitors external ambient frequencies 44,100 times per second to deliver instantaneous silence.
          </p>
        </div>

        {/* Interactive Mode Control Panel */}
        <div className="bg-card-glass p-8 md:p-12 rounded-3xl border border-white/10 shadow-2xl shadow-black/90">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-10">
            {/* Mode Button 1: Industry-Leading ANC */}
            <button
              onClick={() => setAncMode('on')}
              className={`p-6 rounded-2xl border text-left transition-all duration-300 relative overflow-hidden cursor-pointer ${
                ancMode === 'on'
                  ? 'bg-gradient-to-br from-blue-900/60 to-cyan-950/60 border-cyan-400/80 shadow-lg shadow-cyan-500/20'
                  : 'bg-white/5 border-white/10 hover:border-white/20 text-white/70'
              }`}
            >
              {ancMode === 'on' && (
                <motion.div
                  layoutId="anc-active-border"
                  className="absolute inset-0 border-2 border-cyan-400 rounded-2xl pointer-events-none"
                />
              )}
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`p-3 rounded-xl ${
                    ancMode === 'on' ? 'bg-cyan-400 text-black' : 'bg-white/10 text-white'
                  }`}
                >
                  <VolumeX className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono tracking-widest text-cyan-300 uppercase bg-black/40 px-2.5 py-1 rounded-md">
                  Active
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Noise Cancelling</h3>
              <p className="text-xs text-white/60 leading-relaxed">
                Cancels low-frequency engine rumbles, cabin noise, and ambient chatter completely.
              </p>
            </button>

            {/* Mode Button 2: Ambient Sound */}
            <button
              onClick={() => setAncMode('ambient')}
              className={`p-6 rounded-2xl border text-left transition-all duration-300 relative overflow-hidden cursor-pointer ${
                ancMode === 'ambient'
                  ? 'bg-gradient-to-br from-blue-900/60 to-cyan-950/60 border-cyan-400/80 shadow-lg shadow-cyan-500/20'
                  : 'bg-white/5 border-white/10 hover:border-white/20 text-white/70'
              }`}
            >
              {ancMode === 'ambient' && (
                <motion.div
                  layoutId="anc-active-border"
                  className="absolute inset-0 border-2 border-cyan-400 rounded-2xl pointer-events-none"
                />
              )}
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`p-3 rounded-xl ${
                    ancMode === 'ambient' ? 'bg-cyan-400 text-black' : 'bg-white/10 text-white'
                  }`}
                >
                  <Mic className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono tracking-widest text-cyan-300 uppercase bg-black/40 px-2.5 py-1 rounded-md">
                  Passthrough
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Ambient Sound</h3>
              <p className="text-xs text-white/60 leading-relaxed">
                Captures essential voices, airport announcements, and traffic alerts while keeping music rich.
              </p>
            </button>

            {/* Mode Button 3: ANC Off */}
            <button
              onClick={() => setAncMode('off')}
              className={`p-6 rounded-2xl border text-left transition-all duration-300 relative overflow-hidden cursor-pointer ${
                ancMode === 'off'
                  ? 'bg-gradient-to-br from-blue-900/60 to-cyan-950/60 border-cyan-400/80 shadow-lg shadow-cyan-500/20'
                  : 'bg-white/5 border-white/10 hover:border-white/20 text-white/70'
              }`}
            >
              {ancMode === 'off' && (
                <motion.div
                  layoutId="anc-active-border"
                  className="absolute inset-0 border-2 border-cyan-400 rounded-2xl pointer-events-none"
                />
              )}
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`p-3 rounded-xl ${
                    ancMode === 'off' ? 'bg-cyan-400 text-black' : 'bg-white/10 text-white'
                  }`}
                >
                  <Volume2 className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono tracking-widest text-white/40 uppercase bg-black/40 px-2.5 py-1 rounded-md">
                  Standard
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Passive Isolation</h3>
              <p className="text-xs text-white/60 leading-relaxed">
                Standard acoustic seal without active digital noise cancellation processing.
              </p>
            </button>
          </div>

          {/* Sound Waveform Simulation Box */}
          <div className="bg-[#050505]/90 rounded-2xl p-6 md:p-8 border border-white/10 relative overflow-hidden">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <Activity className="w-5 h-5 text-cyan-400 animate-pulse" />
                <span className="text-sm font-semibold tracking-wider text-white uppercase font-mono">
                  Live Frequency Attenuation Graph
                </span>
              </div>
              <div className="text-xs font-mono text-cyan-400 flex items-center gap-2">
                <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span>QN2 Processing: Active</span>
              </div>
            </div>

            {/* Waveform Bars */}
            <div className="h-32 flex items-center justify-between gap-1.5 px-4 relative">
              {Array.from({ length: 48 }).map((_, idx) => {
                let heightPercent = 20;
                if (ancMode === 'off') {
                  // High noisy waves
                  heightPercent = 30 + Math.sin(idx * 0.4) * 45 + Math.cos(idx * 0.7) * 25;
                } else if (ancMode === 'ambient') {
                  // Speech band peaks around center
                  const isSpeechBand = idx >= 18 && idx <= 30;
                  heightPercent = isSpeechBand
                    ? 50 + Math.sin(idx * 0.8) * 35
                    : 15 + Math.sin(idx * 0.3) * 15;
                } else {
                  // ANC ON - Flatline attenuation
                  heightPercent = 8 + Math.sin(idx * 0.2) * 5;
                }

                return (
                  <motion.div
                    key={idx}
                    className={`flex-1 rounded-full transition-all duration-500 ${
                      ancMode === 'on'
                        ? 'bg-gradient-to-t from-cyan-500 to-blue-500'
                        : ancMode === 'ambient'
                        ? 'bg-gradient-to-t from-amber-400 to-cyan-400'
                        : 'bg-white/30'
                    }`}
                    animate={{
                      height: `${Math.max(6, heightPercent)}%`,
                    }}
                    transition={{
                      duration: 0.3,
                      repeat: Infinity,
                      repeatType: 'reverse',
                      delay: idx * 0.02,
                    }}
                  />
                );
              })}
            </div>

            {/* Dynamic Status Bar below waveform */}
            <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-white/60 gap-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>
                  {ancMode === 'on'
                    ? 'Engine & Aircraft Noise: -42dB Attenuated'
                    : ancMode === 'ambient'
                    ? 'Voice Enhancer: Filtered Passthrough Enabled'
                    : 'Passive Seal Only'}
                </span>
              </div>
              <div className="text-cyan-300 font-semibold">
                {ancMode === 'on'
                  ? 'Total Silence Achieved'
                  : ancMode === 'ambient'
                  ? 'Spatial Awareness Active'
                  : 'Standard Sound Stage'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
