import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, BatteryCharging, Shield, Sparkles, Layers, SlidersHorizontal, Bluetooth, Radio } from 'lucide-react';

export const FeatureGrid: React.FC = () => {
  const features = [
    {
      icon: <Cpu className="w-8 h-8 text-cyan-400" />,
      title: 'HD Processor QN2 & V2 Chip',
      badge: 'Dual Architecture',
      description:
        'Custom dual-chip architecture controls 12 precision microphones in real time for unparalleled noise cancellation depth.',
      gradient: 'from-blue-600/20 to-cyan-500/10',
    },
    {
      icon: <BatteryCharging className="w-8 h-8 text-cyan-400" />,
      title: '30-Hour Battery Life',
      badge: '3 min = 3 hrs',
      description:
        'All-day battery performance with USB-C Power Delivery quick charging so your soundtrack never halts.',
      gradient: 'from-cyan-500/20 to-blue-600/10',
    },
    {
      icon: <Shield className="w-8 h-8 text-cyan-400" />,
      title: 'Ultra-Soft Fit Leather',
      badge: 'Weightless Comfort',
      description:
        'Pressure-relieving ear cushions mold effortlessly around ears for a perfect acoustic seal without fatigue.',
      gradient: 'from-blue-600/20 to-cyan-500/10',
    },
    {
      icon: <Sparkles className="w-8 h-8 text-cyan-400" />,
      title: '30mm Carbon Fiber Driver',
      badge: '40kHz Hi-Res',
      description:
        'High-rigidity dome enhances high-frequency clarity while custom voice coil reproduces deep, punchy bass.',
      gradient: 'from-cyan-500/20 to-blue-600/10',
    },
  ];

  return (
    <section id="tech-highlights" className="py-28 px-6 md:px-12 bg-[#050505] relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-cyan-300 uppercase tracking-widest mb-4">
            <Layers className="w-3.5 h-3.5" />
            Engineering Breakthroughs
          </div>

          <h2 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-6">
            Crafted Without Compromise. <br />
            <span className="text-gradient">Every Detail Matters.</span>
          </h2>

          <p className="text-base md:text-lg text-white/70 leading-relaxed">
            Re-engineered from the inside out. Discover how Sony audio heritage meets next-generation AI and material science.
          </p>
        </div>

        {/* 4 Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -6 }}
              className="bg-card-glass p-8 rounded-3xl border border-white/10 relative overflow-hidden group hover:border-cyan-500/40 transition-all duration-300 flex flex-col justify-between"
            >
              {/* Background radial highlight */}
              <div
                className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-br ${item.gradient} rounded-full blur-2xl opacity-40 group-hover:opacity-80 transition-opacity pointer-events-none`}
              />

              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 group-hover:border-cyan-400/50 group-hover:bg-cyan-950/40 transition-colors">
                    {item.icon}
                  </div>
                  <span className="text-xs font-mono text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 px-3 py-1 rounded-full">
                    {item.badge}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors">
                  {item.title}
                </h3>

                <p className="text-sm text-white/65 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-white/40 group-hover:text-white/70">
                <span>Sony XM Series</span>
                <span>0{idx + 1}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Micro Tech Specs Ribbon */}
        <div className="mt-16 bg-card-glass p-6 rounded-2xl border border-white/10 flex flex-wrap items-center justify-around gap-6 text-xs font-mono text-white/70">
          <div className="flex items-center gap-2">
            <Bluetooth className="w-4 h-4 text-cyan-400" />
            <span>Bluetooth® 5.4 Multipoint</span>
          </div>
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-cyan-400" />
            <span>LDAC™ High-Res Wireless</span>
          </div>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
            <span>Head Tracking 360 Audio</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Speak-to-Chat AI</span>
          </div>
        </div>
      </div>
    </section>
  );
};
