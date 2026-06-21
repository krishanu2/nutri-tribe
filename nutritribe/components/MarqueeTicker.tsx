'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FACTS = [
  { tag: 'DID YOU KNOW', text: "90% of India's Makhana grows in the ponds of Bihar" },
  { tag: 'OFFER', text: 'Free Shipping on all orders above ₹499' },
  { tag: 'PROMISE', text: '100% Natural — Zero Preservatives. Zero Compromise.' },
  { tag: 'FROM BIHAR', text: 'Handpicked by Sahni fishermen from sacred lily ponds' },
  { tag: 'NUTRITION', text: '10g Protein · Low Calorie · Gluten Free · Guilt-Free Snacking' },
  { tag: 'HERITAGE', text: '2,500 years of makhana wisdom — now in your hands' },
];

export default function MarqueeTicker() {
  const [idx, setIdx] = useState(0);
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      // IST = UTC + 5h30m
      const istMs = now.getTime() + (5.5 * 60 * 60 * 1000);
      const ist = new Date(istMs);
      const h = ist.getUTCHours().toString().padStart(2, '0');
      const m = ist.getUTCMinutes().toString().padStart(2, '0');
      setTimeStr(`${h}:${m} IST`);
    };
    update();
    const t = setInterval(update, 30000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % FACTS.length), 4000);
    return () => clearInterval(t);
  }, []);

  const fact = FACTS[idx];

  return (
    <div
      className="relative z-50 overflow-hidden"
      style={{ background: '#070100', borderBottom: '1px solid rgba(243,162,19,0.08)', height: 38 }}
    >
      {/* Moving shimmer sweep */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(243,162,19,0.05) 50%, transparent 100%)' }}
        animate={{ x: ['-100%', '100%'] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'linear', repeatDelay: 2 }}
      />

      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between gap-4">

        {/* Left: live pulse */}
        <div className="flex items-center gap-2 shrink-0">
          <motion.div
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: '#ef4444' }}
            animate={{ opacity: [1, 0.15, 1], scale: [1, 0.7, 1] }}
            transition={{ duration: 1.4, repeat: Infinity }}
          />
          <span className="font-body text-[8px] tracking-[0.3em] uppercase hidden sm:block"
            style={{ color: 'rgba(243,162,19,0.38)' }}>
            Live
          </span>
          <div className="w-px h-3 mx-1 hidden sm:block" style={{ background: 'rgba(243,162,19,0.12)' }} />
        </div>

        {/* Center: morphing fact */}
        <div className="flex-1 flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={idx}
              className="flex items-center gap-3"
              initial={{ y: 16, opacity: 0, filter: 'blur(4px)' }}
              animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
              exit={{ y: -16, opacity: 0, filter: 'blur(4px)' }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Tag badge */}
              <span
                className="font-body font-bold text-[8px] tracking-[0.22em] uppercase px-2 py-0.5 rounded shrink-0 hidden sm:inline-block"
                style={{
                  background: 'rgba(243,162,19,0.12)',
                  color: '#f3a213',
                  border: '1px solid rgba(243,162,19,0.2)',
                }}
              >
                {fact.tag}
              </span>

              {/* Divider dot */}
              <span className="text-[8px] hidden sm:block" style={{ color: 'rgba(243,162,19,0.25)' }}>◆</span>

              {/* Fact text */}
              <span
                className="font-body text-[11px] font-medium tracking-wide text-center"
                style={{ color: 'rgba(253,251,247,0.62)' }}
              >
                {fact.text}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right: location + time */}
        <div className="shrink-0 flex items-center gap-2">
          <div className="w-px h-3 mx-1 hidden sm:block" style={{ background: 'rgba(243,162,19,0.12)' }} />
          <div className="hidden sm:flex items-center gap-1.5">
            {/* Tiny lotus icon */}
            <svg width="9" height="9" viewBox="0 0 20 20" fill="none">
              {[0,45,90,135,180,225,270,315].map((a,i)=>(
                <ellipse key={i} cx="10" cy="4" rx="2.5" ry="5" fill="#f3a213" opacity="0.35"
                  transform={`rotate(${a} 10 10)`} />
              ))}
              <circle cx="10" cy="10" r="2.5" fill="#f3a213" opacity="0.5" />
            </svg>
            <span className="font-body text-[9px] tracking-[0.15em] uppercase"
              style={{ color: 'rgba(243,162,19,0.32)' }}>
              Mithila · {timeStr}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom micro-line progress bar */}
      <motion.div
        className="absolute bottom-0 left-0 h-[1px]"
        style={{ background: 'linear-gradient(90deg, transparent, #f3a213, transparent)' }}
        initial={{ width: '0%' }}
        animate={{ width: '100%' }}
        key={idx}
        transition={{ duration: 4, ease: 'linear' }}
      />
    </div>
  );
}
