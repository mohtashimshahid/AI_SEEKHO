import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronRight, Sliders } from 'lucide-react';

interface NavbarProps {
  onOpenSpecs: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSpecs }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
          scrolled
            ? 'bg-[#050505]/80 backdrop-blur-md border-b border-white/10 py-3 shadow-2xl shadow-black/80'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Left Brand Identity */}
          <div className="flex items-center gap-4">
            <a href="#" className="flex items-center gap-2 group">
              <span className="text-xl font-bold tracking-widest text-white uppercase font-sans group-hover:text-cyan-400 transition-colors">
                SONY
              </span>
              <span className="h-4 w-[1px] bg-white/20"></span>
              <span className="text-sm font-semibold tracking-tight text-white/90 group-hover:text-white transition-colors">
                WH-1000XM6
              </span>
            </a>
          </div>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium tracking-wide">
            <button
              onClick={() => scrollToSection('scrolly-hero')}
              className="text-white/70 hover:text-white transition-colors cursor-pointer"
            >
              Overview
            </button>
            <button
              onClick={() => scrollToSection('tech-highlights')}
              className="text-white/70 hover:text-white transition-colors cursor-pointer"
            >
              Technology
            </button>
            <button
              onClick={() => scrollToSection('anc-demo')}
              className="text-white/70 hover:text-white transition-colors cursor-pointer"
            >
              Noise Cancelling
            </button>
            <button
              onClick={onOpenSpecs}
              className="text-white/70 hover:text-white transition-colors cursor-pointer flex items-center gap-1"
            >
              Specs <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            </button>
            <button
              onClick={() => scrollToSection('cta-section')}
              className="text-white/70 hover:text-white transition-colors cursor-pointer"
            >
              Buy
            </button>
          </nav>

          {/* Right Action CTA (Desktop) */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => scrollToSection('cta-section')}
              className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-xs font-semibold tracking-wider uppercase text-white rounded-full group bg-gradient-to-r from-[#0050FF] to-[#00D6FF] hover:from-[#0040E0] hover:to-[#00C0EE] transition-all duration-300 shadow-lg shadow-blue-600/20 hover:shadow-cyan-500/40 cursor-pointer"
            >
              <span className="px-5 py-2 transition-all ease-in duration-150 bg-[#050505] rounded-full group-hover:bg-transparent flex items-center gap-1.5">
                <span>Experience WH-1000XM6</span>
                <ChevronRight className="w-3.5 h-3.5 text-cyan-400 group-hover:text-white transition-colors" />
              </span>
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white/80 hover:text-white p-2 focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Slide-down Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-x-0 top-[60px] z-40 bg-[#050505]/95 backdrop-blur-xl border-b border-white/10 py-6 px-8 flex flex-col space-y-5 md:hidden"
          >
            <button
              onClick={() => scrollToSection('scrolly-hero')}
              className="text-left text-lg font-medium text-white/90 hover:text-cyan-400"
            >
              Overview
            </button>
            <button
              onClick={() => scrollToSection('tech-highlights')}
              className="text-left text-lg font-medium text-white/90 hover:text-cyan-400"
            >
              Technology
            </button>
            <button
              onClick={() => scrollToSection('anc-demo')}
              className="text-left text-lg font-medium text-white/90 hover:text-cyan-400"
            >
              Noise Cancelling
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSpecs();
              }}
              className="text-left text-lg font-medium text-white/90 hover:text-cyan-400 flex items-center justify-between"
            >
              <span>Full Specifications</span>
              <Sliders className="w-4 h-4 text-cyan-400" />
            </button>
            <button
              onClick={() => scrollToSection('cta-section')}
              className="w-full mt-4 py-3 rounded-full text-center text-sm font-bold tracking-wider uppercase text-white bg-gradient-to-r from-[#0050FF] to-[#00D6FF]"
            >
              Experience WH-1000XM6
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
