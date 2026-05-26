'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import BiharMap from '@/components/illustrations/BiharMap';

function CountUp({ end, suffix = '' }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (!inView) return;
    if (end === 0) { setCount(0); return; }
    let current = 0;
    const step = end / 60;
    const timer = setInterval(() => {
      current += step;
      if (current >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, end]);

  return <span ref={ref}>{count}{suffix}</span>;
}

const stats = [
  { value: 15, suffix: 'g', label: 'Protein per 100g' },
  { value: 0, suffix: 'mg', label: 'Cholesterol' },
  { value: 100, suffix: '%', label: 'Gluten-Free' },
  { value: 347, suffix: '', label: 'Kcal / 100g' },
];

const Divider = () => (
  <div className="flex items-center gap-3 my-6">
    <div className="h-px flex-1 bg-earthen-rust/15" />
    <span className="text-sun-harvest text-xs">✦</span>
    <div className="h-px flex-1 bg-earthen-rust/15" />
  </div>
);

export default function MakhanaSpotlight() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.05 });

  return (
    <section ref={sectionRef} className="py-24 md:py-32 bg-ivory-grain overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* ── LEFT: Map + decorative frame ── */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="relative"
          >
            {/* Vintage frame */}
            <div className="relative border-2 border-sun-harvest/20 rounded-2xl p-3 bg-white shadow-hover">
              <div className="border border-sun-harvest/10 rounded-xl overflow-hidden">
                <BiharMap className="w-full" />
              </div>
              {/* Corner ornaments */}
              {['top-2 left-2', 'top-2 right-2', 'bottom-2 left-2', 'bottom-2 right-2'].map((pos) => (
                <div key={pos} className={`absolute ${pos} w-4 h-4`}>
                  <svg viewBox="0 0 16 16" fill="none">
                    <path d="M1 8 L1 1 L8 1" stroke="#f3a213" strokeWidth="1.5" opacity="0.5" />
                  </svg>
                </div>
              ))}
            </div>

            {/* Floating badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="absolute -bottom-5 -right-5 bg-sun-harvest text-white px-5 py-4 rounded-2xl shadow-product"
            >
              <p className="font-display font-bold text-3xl leading-none">80%</p>
              <p className="font-body text-xs font-semibold opacity-90 mt-1">World&apos;s makhana<br />from Bihar</p>
            </motion.div>
          </motion.div>

          {/* ── RIGHT: Content ── */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, ease: 'easeOut', delay: 0.1 }}
          >
            <p className="font-body font-bold text-xs tracking-[0.3em] uppercase text-sun-harvest mb-4">
              The Superfood
            </p>
            <h2 className="font-display font-bold text-4xl md:text-5xl text-earthen-rust leading-tight mb-2">
              Born in the
            </h2>
            <h2 className="font-display font-bold italic text-4xl md:text-5xl text-sun-harvest leading-tight mb-6">
              Water Lily Ponds of Bihar
            </h2>

            <Divider />

            <p className="font-body text-base text-earthen-rust/70 leading-[1.9] mb-8">
              Makhana &mdash; the world&apos;s finest fox nut &mdash; has been harvested from the sacred
              wetlands of Mithila for over 2,000 years. Rich in protein, antioxidants, and
              ancient Ayurvedic wisdom, it is India&apos;s best-kept nutritional secret.
            </p>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-3 mb-10">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                  className="bg-white border border-earthen-rust/8 rounded-xl p-4 shadow-card hover:shadow-hover transition-shadow"
                >
                  <p className="font-display font-bold text-3xl text-earthen-rust leading-none">
                    <CountUp end={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="font-body text-xs text-earthen-rust/55 mt-1.5 tracking-wide">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            <Link href="/makhana"
              className="inline-flex items-center gap-2 bg-earthen-rust text-white font-body font-bold text-sm px-8 py-4 rounded-full hover:bg-sun-harvest transition-colors duration-300 tracking-[0.08em] uppercase">
              Discover Makhana →
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
