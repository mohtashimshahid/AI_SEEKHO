import React from 'react';
import { HeroScene3D } from './HeroScene3D';

export const HeroSection: React.FC = () => {
  return (
    <section className="min-h-[80vh] flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24 mb-stack-lg">
      <div className="flex-1 z-10 max-w-2xl text-center lg:text-left animate-up">
        <div className="inline-block px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-label-sm font-label-sm mb-6 uppercase tracking-widest backdrop-blur-sm">
          Revolutionizing Finance
        </div>
        <h1 className="text-display-lg font-display-lg md:text-[64px] md:leading-[72px] text-white hero-glow mb-6">
          The Future of Freelance Wealth in Pakistan.
        </h1>
        <p className="text-body-lg font-body-lg text-on-surface-variant mb-10 max-w-xl mx-auto lg:mx-0">
          Extreme speed. Total transparency. 4K-clarity tracking for the modern
          remote professional. Experience banking redesigned for high-performance
          earners.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
          <button className="px-8 py-4 rounded-xl bg-primary text-on-primary font-body-lg text-body-lg font-semibold btn-glow shadow-[0_0_30px_rgba(78,222,163,0.3)]">
            Scale Your Business
          </button>
          <button className="px-8 py-4 rounded-xl glass-panel text-white font-body-lg text-body-lg hover:bg-white/5 transition-colors border border-white/20">
            Experience the Demo
          </button>
        </div>
      </div>

      <div
        className="flex-1 w-full max-w-lg lg:max-w-none relative animate-up"
        style={{ transitionDelay: '0.2s' }}
      >
        <div className="aspect-square relative rounded-2xl overflow-hidden glass-panel flex items-center justify-center p-8">
          <div className="absolute inset-0 w-full h-full object-cover">
            <HeroScene3D />
          </div>

          {/* Decorative HUD elements */}
          <div className="absolute top-8 left-8 glass-panel px-4 py-2 rounded-lg border-primary/30 text-primary flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">trending_up</span>
            <span className="text-label-sm font-label-sm">+42.8% Growth</span>
          </div>

          <div className="absolute bottom-8 right-8 glass-panel px-4 py-2 rounded-lg border-secondary/30 text-secondary flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">sync</span>
            <span className="text-label-sm font-label-sm">Syncing Data...</span>
          </div>
        </div>
      </div>
    </section>
  );
};
