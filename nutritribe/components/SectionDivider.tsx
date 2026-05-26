'use client';

import { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';

type Variant = 'logo' | 'lotus' | 'makhana';

interface Props {
  variant?: Variant;
  darkBg?: boolean;
  flip?: boolean;
}

function LotusIcon({ size = 28, color = '#f3a213' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      {[0,45,90,135,180,225,270,315].map((a,i)=>(
        <ellipse key={i} cx="14" cy="5.5" rx="3" ry="6" fill={color} opacity="0.6"
          transform={`rotate(${a} 14 14)`} />
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
          <stop offset="0%"   stopColor="#fdfbf7" />
          <stop offset="55%"  stopColor="#e8d4a8" />
          <stop offset="100%" stopColor="#b8916a" />
        </radialGradient>
      </defs>
      <circle cx="15" cy="15" r="13" fill="url(#sd-mk)" />
      <circle cx="10" cy="10" r="2.5" fill="#7a5c30" opacity="0.35" />
      <ellipse cx="10" cy="10" rx="4" ry="2.5" fill="white" opacity="0.3" transform="rotate(-20 10 10)" />
    </svg>
  );
}

/* Floating makhana particle — crosses the divider */
function FloatingParticle({ delay, startX }: { delay: number; startX: string }) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: startX, bottom: 0 }}
      animate={{ y: [0, -80, -140], opacity: [0, 0.6, 0], scale: [0.6, 1, 0.5] }}
      transition={{ duration: 3.2, repeat: Infinity, delay, ease: 'easeInOut' }}
    >
      <MakhanaOrb size={12} />
    </motion.div>
  );
}

export default function SectionDivider({ variant = 'lotus', darkBg = false, flip = false }: Props) {
  const ref   = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  /* Parallax scroll for the wave layers */
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const waveShift1 = useTransform(scrollYProgress, [0, 1], ['-8px', '8px']);
  const waveShift2 = useTransform(scrollYProgress, [0, 1], ['6px', '-6px']);
  const waveShift3 = useTransform(scrollYProgress, [0, 1], ['-4px', '4px']);

  const amber     = '#f3a213';
  const lineColor = darkBg ? 'rgba(243,162,19,0.28)' : 'rgba(243,162,19,0.22)';

  return (
    <div
      ref={ref}
      className="relative flex flex-col items-center justify-center overflow-hidden"
      style={{ height: 90, transform: flip ? 'scaleY(-1)' : undefined }}
    >
      {/* ── THREE PARALLAX WAVE PATHS ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Back wave (widest, most transparent) */}
        <motion.svg
          className="absolute w-full"
          style={{ bottom: 0, height: 60, x: waveShift1 }}
          viewBox="0 0 1440 60"
          preserveAspectRatio="none"
          fill="none"
        >
          <path
            d="M-20 40 Q360 10 720 30 Q1080 50 1460 18 L1460 60 L-20 60 Z"
            fill={darkBg ? 'rgba(243,162,19,0.04)' : 'rgba(243,162,19,0.03)'}
          />
        </motion.svg>

        {/* Mid wave */}
        <motion.svg
          className="absolute w-full"
          style={{ bottom: 0, height: 48, x: waveShift2 }}
          viewBox="0 0 1440 48"
          preserveAspectRatio="none"
          fill="none"
        >
          <path
            d="M-20 35 Q380 5 720 25 Q1060 45 1460 12 L1460 48 L-20 48 Z"
            fill={darkBg ? 'rgba(243,162,19,0.05)' : 'rgba(243,162,19,0.04)'}
          />
        </motion.svg>

        {/* Front wave + golden thread stroke */}
        <motion.svg
          className="absolute w-full"
          style={{ bottom: 0, height: 38, x: waveShift3 }}
          viewBox="0 0 1440 38"
          preserveAspectRatio="none"
          fill="none"
        >
          <path
            d="M-20 28 Q380 4 720 18 Q1060 32 1460 8 L1460 38 L-20 38 Z"
            fill={darkBg ? 'rgba(243,162,19,0.06)' : 'rgba(243,162,19,0.05)'}
          />
          {/* Golden thread shimmer on wave crest */}
          <motion.path
            d="M-20 28 Q380 4 720 18 Q1060 32 1460 8"
            stroke="#f3a213"
            strokeWidth="0.8"
            strokeOpacity="0.35"
            fill="none"
          />
          {/* Traveling shimmer */}
          <motion.path
            d="M-20 28 Q380 4 720 18 Q1060 32 1460 8"
            stroke="white"
            strokeWidth="1.5"
            fill="none"
            strokeDasharray="80 1360"
            animate={{ strokeDashoffset: [0, -1440] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear', repeatDelay: 1.5 }}
            strokeOpacity="0.5"
          />
        </motion.svg>
      </div>

      {/* ── FLOATING MAKHANA PARTICLES ── */}
      {isInView && (
        <>
          <FloatingParticle delay={0}   startX="18%" />
          <FloatingParticle delay={0.8} startX="35%" />
          <FloatingParticle delay={1.6} startX="55%" />
          <FloatingParticle delay={0.4} startX="72%" />
          <FloatingParticle delay={1.2} startX="88%" />
        </>
      )}

      {/* ── HORIZONTAL RULE WITH CENTRE ORNAMENT ── */}
      <div className="relative flex items-center w-full px-8 z-10">
        {/* Left line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="flex-1 origin-right"
          style={{ height: 1, background: `linear-gradient(to left, ${lineColor}, transparent)` }}
        />

        {/* Centre ornament */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={isInView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.42, type: 'spring', stiffness: 320 }}
          className="flex items-center gap-3 px-6 shrink-0"
        >
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: amber, opacity: 0.42 }} />

          {variant === 'logo' ? (
            <div
              className="relative rounded-full flex items-center justify-center"
              style={{
                width: 42, height: 42,
                background: 'rgba(243,162,19,0.08)',
                border: '1px solid rgba(243,162,19,0.25)',
                boxShadow: '0 0 20px rgba(243,162,19,0.14)',
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
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <MakhanaOrb size={24} />
            </motion.div>
          )}

          <div className="w-1.5 h-1.5 rounded-full" style={{ background: amber, opacity: 0.42 }} />
        </motion.div>

        {/* Right line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="flex-1 origin-left"
          style={{ height: 1, background: `linear-gradient(to right, ${lineColor}, transparent)` }}
        />
      </div>
    </div>
  );
}
