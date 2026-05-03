'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';

/* ── Branded Section Divider ──────────────────────────────────────────
   A cinematic full-width divider with:
   - Horizontal amber line from edges
   - Center NutriTribe logo mark (or lotus icon)
   - Subtle radiating glow
   - Reveal animation when in view
   Use between homepage sections for visual cohesion.
   ─────────────────────────────────────────────────────────────────── */

type Variant = 'logo' | 'lotus' | 'makhana';

interface Props {
  variant?: Variant;
  darkBg?: boolean; // true = dark section background
  flip?: boolean;   // top/bottom orientation for wave
}

function LotusIcon({ size = 28, color = '#f3a213' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => (
        <ellipse
          key={i} cx="14" cy="5.5" rx="3" ry="6" fill={color} opacity="0.6"
          transform={`rotate(${a} 14 14)`}
        />
      ))}
      <circle cx="14" cy="14" r="3.5" fill={color} />
    </svg>
  );
}

function MakhanaOrb({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 30 30" fill="none">
      <defs>
        <radialGradient id="sd-mk" cx="33%" cy="28%" r="70%">
          <stop offset="0%" stopColor="#fdfbf7" />
          <stop offset="55%" stopColor="#e8d4a8" />
          <stop offset="100%" stopColor="#b8916a" />
        </radialGradient>
      </defs>
      <circle cx="15" cy="15" r="13" fill="url(#sd-mk)" />
      <circle cx="10" cy="10" r="2.5" fill="#7a5c30" opacity="0.35" />
      <ellipse cx="10" cy="10" rx="4" ry="2.5" fill="white" opacity="0.3" transform="rotate(-20 10 10)" />
    </svg>
  );
}

export default function SectionDivider({ variant = 'lotus', darkBg = false, flip = false }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  const amber = '#f3a213';
  const lineColor = darkBg ? 'rgba(243,162,19,0.25)' : 'rgba(243,162,19,0.2)';
  const bgGlow = darkBg ? 'rgba(243,162,19,0.06)' : 'rgba(243,162,19,0.04)';

  return (
    <div
      ref={ref}
      className="relative flex items-center justify-center overflow-hidden"
      style={{ height: 64, transform: flip ? 'scaleY(-1)' : undefined }}
    >
      {/* Central glow */}
      <div
        className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width: 300, height: 80,
          background: `radial-gradient(ellipse at center, ${bgGlow} 0%, transparent 70%)`,
        }}
      />

      {/* Left line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : {}}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="flex-1 origin-right"
        style={{ height: 1, background: `linear-gradient(to left, ${lineColor}, transparent)` }}
      />

      {/* Centre ornament */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.4, type: 'spring', stiffness: 300 }}
        className="flex items-center gap-3 px-6 shrink-0"
      >
        {/* flanking dots */}
        <div className="w-1.5 h-1.5 rounded-full" style={{ background: amber, opacity: 0.4 }} />

        {/* main icon */}
        {variant === 'logo' ? (
          <div
            className="relative rounded-full flex items-center justify-center"
            style={{
              width: 42, height: 42,
              background: 'rgba(243,162,19,0.08)',
              border: '1px solid rgba(243,162,19,0.25)',
              boxShadow: '0 0 20px rgba(243,162,19,0.12)',
            }}
          >
            <div className="relative" style={{ width: 30, height: 18 }}>
              <Image
                src="/logo.png"
                alt="NutriTribe"
                fill
                className="object-contain"
                style={{ filter: 'brightness(0) saturate(100%) invert(67%) sepia(68%) saturate(743%) hue-rotate(2deg) brightness(103%) contrast(101%)' }}
              />
            </div>
          </div>
        ) : variant === 'lotus' ? (
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <LotusIcon size={28} />
          </motion.div>
        ) : (
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <MakhanaOrb size={24} />
          </motion.div>
        )}

        <div className="w-1.5 h-1.5 rounded-full" style={{ background: amber, opacity: 0.4 }} />
      </motion.div>

      {/* Right line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : {}}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="flex-1 origin-left"
        style={{ height: 1, background: `linear-gradient(to right, ${lineColor}, transparent)` }}
      />
    </div>
  );
}
