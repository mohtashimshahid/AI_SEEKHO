import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TOTAL_FRAMES = 240;

interface ScrollytellingCanvasProps {
  onProgressUpdate: (progress: number) => void;
  children?: React.ReactNode;
}

export const ScrollytellingCanvas: React.FC<ScrollytellingCanvasProps> = ({
  onProgressUpdate,
  children,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef<number>(0);
  const targetFrameRef = useRef<number>(0);
  const requestRef = useRef<number | null>(null);

  const [loadedCount, setLoadedCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Preload all 240 sequence images into memory
  useEffect(() => {
    let isMounted = true;
    const loadedImages: HTMLImageElement[] = new Array(TOTAL_FRAMES);
    let loadedCounter = 0;

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      const frameNum = String(i).padStart(3, '0');
      img.src = `/sequence/ezgif-frame-${frameNum}.jpg`;

      img.onload = () => {
        if (!isMounted) return;
        loadedCounter++;
        setLoadedCount(loadedCounter);
        if (loadedCounter === TOTAL_FRAMES) {
          setIsLoading(false);
        }
      };

      img.onerror = () => {
        if (!isMounted) return;
        loadedCounter++;
        setLoadedCount(loadedCounter);
        if (loadedCounter === TOTAL_FRAMES) {
          setIsLoading(false);
        }
      };

      loadedImages[i - 1] = img;
    }

    imagesRef.current = loadedImages;

    return () => {
      isMounted = false;
    };
  }, []);

  // Draw frame to canvas with aspect ratio contain logic
  const drawFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = imagesRef.current[frameIndex];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const canvasWidth = canvas.clientWidth;
    const canvasHeight = canvas.clientHeight;

    if (canvas.width !== canvasWidth * dpr || canvas.height !== canvasHeight * dpr) {
      canvas.width = canvasWidth * dpr;
      canvas.height = canvasHeight * dpr;
    }

    ctx.save();
    ctx.scale(dpr, dpr);

    // Pure black void background matching #050505
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Calculate aspect ratio fit (contain)
    const imgRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = canvasWidth / canvasHeight;

    let drawWidth = canvasWidth;
    let drawHeight = canvasHeight;
    let offsetX = 0;
    let offsetY = 0;

    if (canvasRatio > imgRatio) {
      // Canvas is wider than image
      drawHeight = canvasHeight * 0.88; // Slight padding for breathing space
      drawWidth = drawHeight * imgRatio;
      offsetX = (canvasWidth - drawWidth) / 2;
      offsetY = (canvasHeight - drawHeight) / 2;
    } else {
      // Canvas is taller than image
      drawWidth = canvasWidth * 0.92;
      drawHeight = drawWidth / imgRatio;
      offsetX = (canvasWidth - drawWidth) / 2;
      offsetY = (canvasHeight - drawHeight) / 2;
    }

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    ctx.restore();
  }, []);

  // Smooth frame interpolation render loop (LERP)
  useEffect(() => {
    const render = () => {
      if (imagesRef.current.length > 0) {
        const diff = targetFrameRef.current - currentFrameRef.current;
        if (Math.abs(diff) > 0.05) {
          currentFrameRef.current += diff * 0.25; // Smooth spring-like easing
        } else {
          currentFrameRef.current = targetFrameRef.current;
        }

        const clampedIndex = Math.min(
          TOTAL_FRAMES - 1,
          Math.max(0, Math.round(currentFrameRef.current))
        );
        drawFrame(clampedIndex);
      }
      requestRef.current = requestAnimationFrame(render);
    };

    requestRef.current = requestAnimationFrame(render);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [drawFrame]);

  // Handle scroll events and map top to bottom of sticky container to 0..1 progress
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const totalScrollableHeight = rect.height - window.innerHeight;

      if (totalScrollableHeight <= 0) return;

      // Negative value when top of container reaches top of viewport
      const currentScroll = -rect.top;
      const progress = Math.min(1, Math.max(0, currentScroll / totalScrollableHeight));

      const frameIndex = Math.min(TOTAL_FRAMES - 1, Math.floor(progress * TOTAL_FRAMES));
      targetFrameRef.current = frameIndex;

      onProgressUpdate(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, [onProgressUpdate]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      drawFrame(Math.round(currentFrameRef.current));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [drawFrame]);

  const loadPercent = Math.round((loadedCount / TOTAL_FRAMES) * 100);

  return (
    <div
      id="scrolly-hero"
      ref={containerRef}
      className="relative w-full h-[450vh] bg-[#050505]"
    >
      {/* Loading Overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050505] text-white px-6"
          >
            <div className="relative mb-6">
              <span className="text-3xl font-extrabold tracking-widest uppercase bg-gradient-to-r from-white via-cyan-200 to-blue-500 bg-clip-text text-transparent">
                SONY
              </span>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-0.5 bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full animate-pulse"></div>
            </div>

            <h2 className="text-xl font-light text-white/80 tracking-wide mb-8">
              Initializing WH-1000XM6 Cinematic Experience
            </h2>

            <div className="w-64 md:w-80 h-1.5 bg-white/10 rounded-full overflow-hidden mb-4 relative">
              <motion.div
                className="h-full bg-gradient-to-r from-[#0050FF] to-[#00D6FF] rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: `${loadPercent}%` }}
                transition={{ ease: 'easeOut', duration: 0.2 }}
              />
            </div>

            <div className="flex items-center gap-3 text-xs tracking-widest text-cyan-400 font-mono">
              <span>EXPLODING HARDWARE DIAGRAM</span>
              <span>•</span>
              <span>{loadPercent}%</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sticky Fullscreen Canvas Viewport */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden bg-[#050505]">
        {/* Soft Ambient Radial Background Glow */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="w-[800px] h-[800px] rounded-full bg-radial from-[#0050ff]/10 via-[#050815]/40 to-transparent blur-3xl opacity-60 animate-pulse-glow" />
        </div>

        {/* HTML5 Canvas */}
        <canvas
          ref={canvasRef}
          className="w-full h-full object-contain relative z-10"
        />

        {/* Overlay Story Content Passed as Children */}
        <div className="absolute inset-0 z-20 pointer-events-none">
          {children}
        </div>
      </div>
    </div>
  );
};
