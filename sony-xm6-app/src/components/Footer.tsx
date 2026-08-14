import React from 'react';
import { ChevronUp, SlidersHorizontal, ArrowRight } from 'lucide-react';

interface FooterProps {
  onOpenSpecs: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenSpecs }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#050505] text-white border-t border-white/10 relative overflow-hidden">
      {/* Final Pre-Order / CTA Banner */}
      <div id="cta-section" className="py-24 px-6 md:px-12 text-center relative border-b border-white/10">
        <div className="absolute inset-0 bg-radial from-[#0050ff]/15 via-transparent to-transparent pointer-events-none blur-3xl" />

        <div className="max-w-4xl mx-auto relative z-10">
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest bg-cyan-950/60 border border-cyan-500/30 px-4 py-1.5 rounded-full inline-block mb-6">
            Sony Flagship Audio Experience
          </span>

          <h2 className="text-4xl md:text-7xl font-black tracking-tight text-white mb-6">
            Ready to experience <br />
            <span className="text-gradient">pure sound isolation?</span>
          </h2>

          <p className="text-lg md:text-xl text-white/70 font-light max-w-2xl mx-auto mb-10 leading-relaxed">
            Order your Sony WH-1000XM6 today and redefine your relationship with sound, silence, and spatial clarity.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <button
              onClick={scrollToTop}
              className="w-full sm:w-auto px-10 py-4 rounded-full font-semibold text-sm tracking-wider uppercase text-white bg-gradient-to-r from-[#0050FF] to-[#00D6FF] hover:from-[#0040E0] hover:to-[#00C0EE] transition-all duration-300 shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2 cursor-pointer group"
            >
              <span>Pre-order WH-1000XM6</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onOpenSpecs}
              className="w-full sm:w-auto px-8 py-4 rounded-full font-semibold text-sm tracking-wider uppercase text-white/90 bg-white/5 border border-white/15 hover:bg-white/10 hover:border-white/30 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
              <span>Full Specifications</span>
            </button>
          </div>

          <p className="text-xs text-white/40 font-mono">
            Free express shipping • 30-day risk-free trial • 2-year Sony Global Warranty
          </p>
        </div>
      </div>

      {/* Main Footer Links & Copyright */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-white/50 font-mono">
        <div className="flex items-center gap-4">
          <span className="text-base font-extrabold text-white tracking-widest uppercase">SONY</span>
          <span className="h-3 w-[1px] bg-white/20" />
          <span>© 2026 Sony Corporation of America. All rights reserved.</span>
        </div>

        <div className="flex items-center space-x-6">
          <a href="#" className="hover:text-cyan-400 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-cyan-400 transition-colors">Terms of Service</a>
          <button onClick={onOpenSpecs} className="hover:text-cyan-400 transition-colors cursor-pointer">
            Technical Specs
          </button>
          <button
            onClick={scrollToTop}
            className="p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/15 text-white/80 hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
            aria-label="Scroll back to top"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
};
