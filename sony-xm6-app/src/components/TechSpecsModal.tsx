import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sliders, CheckCircle2 } from 'lucide-react';

interface TechSpecsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TechSpecsModal: React.FC<TechSpecsModalProps> = ({ isOpen, onClose }) => {
  const specsCategories = [
    {
      category: 'Audio & Acoustics',
      items: [
        { label: 'Driver Unit', value: '30mm Carbon Fiber Composite Dome' },
        { label: 'Frequency Response', value: '4 Hz - 40,000 Hz (JEITA)' },
        { label: 'Frequency (Active)', value: '20 Hz - 20,000 Hz (44.1 kHz Sampling) / 20 Hz - 40,000 Hz (LDAC 96 kHz Sampling 990 kbps)' },
        { label: 'Supported Codecs', value: 'LDAC™, AAC, SBC, LC3' },
        { label: 'Audio Engine', value: 'DSEE Ultimate™ Edge-AI Upscaling' },
        { label: 'Spatial Audio', value: '360 Reality Audio with Dynamic Head Tracking' },
      ],
    },
    {
      category: 'Noise Cancellation',
      items: [
        { label: 'Processor', value: 'Dual Chip: HD Processor QN2 + Integrated Processor V2' },
        { label: 'Microphone Array', value: '12 Active Microphones (6 per ear cup)' },
        { label: 'NC Optimization', value: 'Auto NC Optimizer + Atmospheric Pressure Sensor' },
        { label: 'Ambient Mode', value: '20-level adjustable passthrough with Voice Focus' },
      ],
    },
    {
      category: 'Connectivity & Controls',
      items: [
        { label: 'Bluetooth® Version', value: 'Bluetooth® Specification Version 5.4' },
        { label: 'Effective Range', value: 'Line of sight approx. 30 ft (10 m)' },
        { label: 'Multipoint', value: 'Connect up to 2 devices simultaneously' },
        { label: 'Smart Controls', value: 'Capacitive Touch, Speak-to-Chat, Wearing Sensor' },
        { label: 'Fast Pairing', value: 'Google Fast Pair, Swift Pair, NFC Tap' },
      ],
    },
    {
      category: 'Battery & Ergonomics',
      items: [
        { label: 'Battery Life (ANC ON)', value: 'Max 30 Hours Continuous Playback' },
        { label: 'Battery Life (ANC OFF)', value: 'Max 40 Hours Continuous Playback' },
        { label: 'Quick Charge', value: '3 Minutes Charge = 3 Hours Playback (USB PD)' },
        { label: 'Full Charge Time', value: 'Approx. 3.5 Hours' },
        { label: 'Weight', value: 'Approx. 250 g (Lightweight Ergonomic Frame)' },
      ],
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#050505]/90 backdrop-blur-xl"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-4xl max-h-[85vh] bg-card-glass border border-white/15 rounded-3xl p-6 md:p-10 overflow-y-auto z-10 shadow-2xl shadow-black/90"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-6 mb-8">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-400">
                  <Sliders className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Sony WH-1000XM6</h3>
                  <p className="text-xs font-mono text-cyan-300">Technical Specifications & Hardware Matrix</p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2.5 rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-colors focus:outline-none cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Specifications Grid */}
            <div className="space-y-8">
              {specsCategories.map((cat, idx) => (
                <div key={idx} className="bg-[#050505]/60 rounded-2xl p-6 border border-white/10">
                  <h4 className="text-base font-bold text-cyan-400 uppercase font-mono tracking-wider mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                    {cat.category}
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {cat.items.map((item, itemIdx) => (
                      <div key={itemIdx} className="p-3 rounded-xl bg-white/5 border border-white/5 flex flex-col justify-between">
                        <span className="text-xs font-mono text-white/50 mb-1">{item.label}</span>
                        <span className="text-sm font-semibold text-white/90">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer Action */}
            <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs font-mono text-white/40">
                Official Sony Electronics Specification Sheet • XM6 Series
              </span>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors cursor-pointer"
              >
                Close Matrix
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
