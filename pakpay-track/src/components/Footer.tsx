import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="relative w-full mt-auto bg-surface-container-lowest border-t border-white/5">
      <div className="flex flex-col md:flex-row justify-between items-center px-container-padding-desktop py-stack-lg w-full max-w-7xl mx-auto gap-6 text-center md:text-left">
        <div>
          <span className="text-title-md font-title-md font-bold text-primary">
            PakPay Track
          </span>
          <p className="text-body-md font-body-md text-on-surface-variant mt-2">
            © 2024 PakPay Track. Regulated by SECP &amp; SBP Partners.
          </p>
        </div>
        <div className="flex flex-wrap justify-center md:justify-end gap-6">
          <a
            className="text-label-sm font-label-sm text-on-surface-variant hover:text-secondary transition-colors opacity-80 hover:opacity-100"
            href="#"
          >
            Terms of Service
          </a>
          <a
            className="text-label-sm font-label-sm text-on-surface-variant hover:text-secondary transition-colors opacity-80 hover:opacity-100"
            href="#"
          >
            Privacy Policy
          </a>
          <a
            className="text-label-sm font-label-sm text-on-surface-variant hover:text-secondary transition-colors opacity-80 hover:opacity-100"
            href="#"
          >
            Help Center
          </a>
          <a
            className="text-label-sm font-label-sm text-on-surface-variant hover:text-secondary transition-colors opacity-80 hover:opacity-100"
            href="#"
          >
            Tax Guide PK
          </a>
        </div>
      </div>
    </footer>
  );
};
