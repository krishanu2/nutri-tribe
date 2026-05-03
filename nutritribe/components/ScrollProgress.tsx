'use client';

import { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

/* ── Scroll Progress Bar ───────────────────────────────────────────────
   Ultra-thin amber line at the very top tracking page read progress.
   Has a glowing makhana ball rider that moves with scroll.
   ─────────────────────────────────────────────────────────────────── */

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  const smoothProgress = useSpring(progress, { stiffness: 200, damping: 30 });

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const scrolled = el.scrollTop;
      const total = el.scrollHeight - el.clientHeight;
      setProgress(total > 0 ? scrolled / total : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[9999] pointer-events-none"
      style={{ height: 3 }}
    >
      {/* Track */}
      <div className="absolute inset-0" style={{ background: 'rgba(243,162,19,0.08)' }} />

      {/* Progress fill */}
      <motion.div
        className="absolute left-0 top-0 bottom-0 origin-left"
        style={{
          scaleX: smoothProgress,
          background: 'linear-gradient(90deg, #f3a213, #D4AF37, #f3a213)',
          boxShadow: '0 0 8px rgba(243,162,19,0.6)',
          transformOrigin: 'left',
        }}
      />

      {/* Glowing rider ball */}
      <motion.div
        className="absolute top-1/2 -translate-y-1/2"
        style={{
          left: 0,
          x: `calc(${progress * 100}vw - 6px)`,
          transition: 'none',
        }}
      >
        <div
          className="w-3 h-3 rounded-full"
          style={{
            background: '#f3a213',
            boxShadow: '0 0 10px 3px rgba(243,162,19,0.7)',
          }}
        />
      </motion.div>
    </div>
  );
}
