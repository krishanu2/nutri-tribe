'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';

function AnimatedCounter({ value, suffix = '' }: { value: string; suffix?: string }) {
  const numericValue = parseInt(value.replace(/\D/g, ''), 10);
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  useEffect(() => {
    if (!inView || isNaN(numericValue)) return;
    let current = 0;
    const increment = numericValue / 80;
    const timer = setInterval(() => {
      current += increment;
      if (current >= numericValue) { setCount(numericValue); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, numericValue]);

  if (isNaN(numericValue)) return <span ref={ref}>{value}</span>;
  return <span ref={ref}>{count.toLocaleString('en-IN')}{suffix}</span>;
}

const stats = [
  { value: '250', suffix: '+', label: 'Farmer Supporters', desc: 'Sahni community of Bihar' },
  { value: '8', suffix: '+', label: 'Different Products', desc: 'Always crafting more' },
  { value: '100', suffix: '%', label: 'Natural Ingredients', desc: 'No compromises. Ever.' },
  { value: '∞', suffix: '', label: 'Love in Every Pack', desc: 'Snack Bold. Live Rooted.' },
];

export default function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.05 });

  return (
    <section ref={ref}
      className="py-24 md:py-32 relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #0d0703 0%, #1a0e0a 50%, #0d0703 100%)' }}
    >
      {/* Subtle radial glows */}
      <div className="absolute inset-0 opacity-100"
        style={{ background: 'radial-gradient(ellipse at 20% 50%, rgba(243,162,19,0.06) 0%, transparent 50%), radial-gradient(ellipse at 80% 50%, rgba(125,54,39,0.08) 0%, transparent 50%)' }} />

      {/* ── GIANT LOGO WATERMARK ── */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
        aria-hidden
      >
        <div className="relative" style={{ width: '65vw', height: '30vw', maxWidth: 800, maxHeight: 350, opacity: 0.035 }}>
          <Image
            src="/logo.png"
            alt=""
            fill
            className="object-contain"
            style={{ filter: 'brightness(0) invert(1)' }}
          />
        </div>
      </div>

      {/* Top ornamental line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sun-harvest/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sun-harvest/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Heading */}
        <div className="text-center mb-20">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="font-body font-bold text-xs tracking-[0.3em] uppercase text-sun-harvest mb-4"
          >
            By The Numbers
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display font-bold text-4xl md:text-5xl text-ivory-grain"
          >
            The NutriTribe <span className="italic text-sun-harvest">Impact</span>
          </motion.h2>
          {/* Ornament */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={isInView ? { opacity: 1, scaleX: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="flex items-center gap-3 justify-center mt-5 origin-center"
          >
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-sun-harvest/40" />
            <span className="text-sun-harvest text-xs">✦</span>
            <div className="h-px w-8 bg-sun-harvest/40" />
            <span className="text-sun-harvest text-xs">✦</span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-sun-harvest/40" />
          </motion.div>
        </div>

        {/* Stats with circular progress rings */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-4">
          {stats.map((stat, i) => {
            const r = 44;
            const circ = 2 * Math.PI * r;
            const numericVal = parseInt(stat.value.replace(/\D/g, ''), 10);
            const hasRing = !isNaN(numericVal) && numericVal <= 100;
            const ringPct = hasRing ? numericVal / 100 : 1;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.15 + i * 0.12, duration: 0.7, ease: 'easeOut' }}
                className="text-center group relative"
              >
                {/* Circular progress ring */}
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <svg width="96" height="96" viewBox="0 0 96 96" style={{ transform: 'rotate(-90deg)' }}>
                    {/* Track */}
                    <circle cx="48" cy="48" r={r} fill="none"
                      stroke="rgba(243,162,19,0.10)" strokeWidth="3" />
                    {/* Progress */}
                    <motion.circle cx="48" cy="48" r={r} fill="none"
                      stroke="#f3a213" strokeWidth="3" strokeLinecap="round"
                      strokeDasharray={circ}
                      initial={{ strokeDashoffset: circ }}
                      animate={isInView ? { strokeDashoffset: circ * (1 - ringPct) } : { strokeDashoffset: circ }}
                      transition={{ duration: 1.4, delay: 0.4 + i * 0.12, ease: 'easeOut' }}
                    />
                    {/* Inner glow ring */}
                    <circle cx="48" cy="48" r={r - 6} fill="none"
                      stroke="rgba(243,162,19,0.04)" strokeWidth="8" />
                  </svg>
                  {/* Center dot */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-sun-harvest/40" />
                  </div>
                </div>

                <div className="font-display font-bold text-5xl md:text-6xl lg:text-7xl text-sun-harvest mb-2 leading-none group-hover:scale-110 transition-transform duration-300">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="font-body font-bold text-sm text-ivory-grain tracking-wide mb-1">{stat.label}</div>
                <div className="font-body text-xs text-ivory-grain/35 italic">{stat.desc}</div>

                <motion.div
                  initial={{ width: 0 }}
                  animate={isInView ? { width: '48px' } : {}}
                  transition={{ delay: 0.5 + i * 0.12, duration: 0.5 }}
                  className="h-px bg-sun-harvest/30 mx-auto mt-4"
                  style={{ width: 0 }}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
