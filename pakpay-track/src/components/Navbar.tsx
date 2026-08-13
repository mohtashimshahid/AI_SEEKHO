import React from 'react';

export const Navbar: React.FC = () => {
  return (
    <nav className="fixed top-0 w-full z-50 bg-surface/10 backdrop-blur-md border-b border-white/10 shadow-[0_0_20px_rgba(78,222,163,0.05)]">
      <div className="flex justify-between items-center w-full px-container-padding-mobile md:px-container-padding-desktop py-4 max-w-[1440px] mx-auto">
        <div className="flex items-center gap-4">
          <span className="text-title-md font-title-md font-bold text-primary tracking-tight">
            PakPay Track
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a
            className="text-body-md font-body-md text-on-surface hover:text-primary transition-colors"
            href="#features"
          >
            Features
          </a>
          <a
            className="text-body-md font-body-md text-on-surface hover:text-primary transition-colors"
            href="#pricing"
          >
            Pricing
          </a>
          <a
            className="text-body-md font-body-md text-on-surface hover:text-primary transition-colors"
            href="#resources"
          >
            Resources
          </a>
        </div>
        <div className="flex items-center gap-4">
          <button className="hidden md:block px-6 py-2 rounded-xl text-body-md font-body-md text-on-surface border border-white/10 hover:bg-surface-container-high transition-colors">
            Log In
          </button>
          <button className="px-6 py-2 rounded-xl bg-primary text-on-primary font-body-md btn-glow font-semibold">
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
};
