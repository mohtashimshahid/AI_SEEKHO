import { useState, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { ScrollytellingCanvas } from './components/ScrollytellingCanvas';
import { StoryOverlays } from './components/StoryOverlays';
import { InteractiveAncDemo } from './components/InteractiveAncDemo';
import { FeatureGrid } from './components/FeatureGrid';
import { TechSpecsModal } from './components/TechSpecsModal';
import { Footer } from './components/Footer';

export function App() {
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [isSpecsOpen, setIsSpecsOpen] = useState<boolean>(false);

  const handleProgressUpdate = useCallback((progress: number) => {
    setScrollProgress(progress);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-cyan-500 selection:text-black font-sans antialiased overflow-x-hidden">
      {/* Apple-style translucent blur navbar */}
      <Navbar onOpenSpecs={() => setIsSpecsOpen(true)} />

      {/* Sticky Scrollytelling Canvas Section (~450vh container) */}
      <main>
        <ScrollytellingCanvas onProgressUpdate={handleProgressUpdate}>
          <StoryOverlays
            progress={scrollProgress}
            onOpenSpecs={() => setIsSpecsOpen(true)}
          />
        </ScrollytellingCanvas>

        {/* Interactive Noise Cancelling & Frequency Simulation Demo */}
        <InteractiveAncDemo />

        {/* Technical Highlights Feature Grid */}
        <FeatureGrid />
      </main>

      {/* Technical Specifications Modal / Matrix */}
      <TechSpecsModal
        isOpen={isSpecsOpen}
        onClose={() => setIsSpecsOpen(false)}
      />

      {/* Luxury Sony Flagship Footer & CTA */}
      <Footer onOpenSpecs={() => setIsSpecsOpen(true)} />
    </div>
  );
}

export default App;
