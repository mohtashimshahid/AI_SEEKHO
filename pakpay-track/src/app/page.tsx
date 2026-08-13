'use client';

import React, { useEffect } from 'react';
import { BackgroundShader } from '@/components/BackgroundShader';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { FeaturesBentoGrid } from '@/components/FeaturesBentoGrid';
import { Footer } from '@/components/Footer';

export default function Home() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.animate-up').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="bg-background text-on-background min-h-screen relative overflow-x-hidden flex flex-col">
      <BackgroundShader />
      <Navbar />

      <main className="pt-32 pb-24 px-container-padding-mobile md:px-container-padding-desktop max-w-[1440px] mx-auto w-full flex-1">
        <HeroSection />
        <FeaturesBentoGrid />
      </main>

      <Footer />
    </div>
  );
}
