'use client';

import { motion } from 'framer-motion';

interface ContactSceneProps {
  inView?: boolean;
  className?: string;
}

// Star positions
const stars = [
  { cx: 42, cy: 28, r: 1.5, delay: 0 },
  { cx: 118, cy: 15, r: 1.2, delay: 0.6 },
  { cx: 195, cy: 38, r: 1.8, delay: 1.2 },
  { cx: 280, cy: 12, r: 1.4, delay: 0.3 },
  { cx: 352, cy: 35, r: 1.6, delay: 1.8 },
  { cx: 430, cy: 18, r: 1.3, delay: 0.9 },
  { cx: 470, cy: 48, r: 1.5, delay: 1.5 },
  { cx: 78, cy: 55, r: 1.2, delay: 2.1 },
  { cx: 395, cy: 62, r: 1.4, delay: 0.4 },
  { cx: 245, cy: 60, r: 1, delay: 1.0 },
];

// Floating makhana balls in water
const waterMakhana = [
  { cx: 88, cy: 248, r: 8, delay: 0 },
  { cx: 155, cy: 262, r: 6.5, delay: 0.7 },
  { cx: 380, cy: 255, r: 7.5, delay: 1.2 },
  { cx: 440, cy: 266, r: 6, delay: 0.4 },
  { cx: 68, cy: 278, r: 5.5, delay: 1.9 },
  { cx: 415, cy: 285, r: 7, delay: 0.9 },
];

// Shimmer line positions in water
const shimmerLines = [
  { x1: 30, y1: 255, x2: 95, y2: 255, delay: 0 },
  { x1: 130, y1: 268, x2: 175, y2: 268, delay: 0.8 },
  { x1: 360, y1: 258, x2: 410, y2: 258, delay: 0.4 },
  { x1: 430, y1: 272, x2: 480, y2: 272, delay: 1.2 },
  { x1: 200, y1: 285, x2: 240, y2: 285, delay: 0.6 },
  { x1: 280, y1: 275, x2: 340, y2: 275, delay: 1.4 },
];

// Golden sparkle positions
const sparkles = [
  { cx: 130, cy: 105, delay: 0 },
  { cx: 370, cy: 90, delay: 1.3 },
  { cx: 460, cy: 140, delay: 0.7 },
  { cx: 55, cy: 160, delay: 2.0 },
  { cx: 290, cy: 75, delay: 0.4 },
];

// Lotus flower definitions (cx, cy, scale)
const lotuses = [
  { cx: 160, cy: 218, scale: 0.8, delay: 0 },
  { cx: 330, cy: 214, scale: 0.7, delay: 0.6 },
  { cx: 90, cy: 222, scale: 0.6, delay: 1.2 },
];

// Dragonfly definitions
const dragonflies = [
  { cx: 100, cy: 135, delay: 0, driftX: 18, driftY: 12 },
  { cx: 390, cy: 120, delay: 1.5, driftX: -15, driftY: 10 },
];


export default function ContactScene({ inView, className = '' }: ContactSceneProps) {
  const shouldAnimate = inView === undefined ? true : inView;

  return (
    <svg
      viewBox="0 0 500 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* Sky gradient */}
        <linearGradient id="sky-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0d0703" />
          <stop offset="60%" stopColor="#0f1a14" />
          <stop offset="100%" stopColor="#0a1f18" />
        </linearGradient>

        {/* Water gradient */}
        <linearGradient id="water-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0a1f18" />
          <stop offset="100%" stopColor="#061410" />
        </linearGradient>

        {/* Leaf gradient */}
        <radialGradient id="leaf-grad" cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#2a7a1e" />
          <stop offset="50%" stopColor="#1a5a12" />
          <stop offset="100%" stopColor="#0e3a08" />
        </radialGradient>

        {/* Envelope gradient */}
        <linearGradient id="env-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fdfbf7" />
          <stop offset="100%" stopColor="#e8dcc8" />
        </linearGradient>

        {/* Makhana sphere gradient */}
        <radialGradient id="mk-contact" cx="32%" cy="28%" r="70%">
          <stop offset="0%" stopColor="#fdfbf7" />
          <stop offset="40%" stopColor="#ecdfc4" />
          <stop offset="80%" stopColor="#c4a878" />
          <stop offset="100%" stopColor="#a0845a" />
        </radialGradient>

        {/* Water shimmer */}
        <linearGradient id="shimmer" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#1a4a38" stopOpacity="0" />
          <stop offset="50%" stopColor="#3a9a70" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#1a4a38" stopOpacity="0" />
        </linearGradient>

        {/* Moon glow */}
        <radialGradient id="moon-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffe8a0" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#ffe8a0" stopOpacity="0" />
        </radialGradient>

        {/* Dragonfly wing gradient */}
        <linearGradient id="wing-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#88ddcc" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#44bbaa" stopOpacity="0.2" />
        </linearGradient>
      </defs>

      {/* ── BACKGROUND / SKY ── */}
      <rect x="0" y="0" width="500" height="320" fill="url(#sky-grad)" />

      {/* ── MOON ── */}
      <circle cx="420" cy="50" r="28" fill="#ffe8a0" opacity="0.06" />
      <circle cx="420" cy="50" r="20" fill="#ffe8a0" opacity="0.08" />
      <circle cx="420" cy="50" r="13" fill="#ffe8a0" opacity="0.12" />

      {/* ── STARS ── */}
      {stars.map((star, i) => (
        <motion.circle
          key={`star-${i}`}
          cx={star.cx}
          cy={star.cy}
          r={star.r}
          fill="#fdfbf7"
          animate={
            shouldAnimate
              ? { opacity: [0.2, 0.9, 0.3, 0.8, 0.2] }
              : { opacity: 0.5 }
          }
          transition={{
            duration: 2.5 + star.delay * 0.4,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: star.delay,
          }}
        />
      ))}

      {/* ── DISTANT MIST / FOG ── */}
      <ellipse cx="250" cy="195" rx="280" ry="30" fill="#0f2a1e" opacity="0.5" />

      {/* ── WATER ── */}
      <rect x="0" y="230" width="500" height="90" fill="url(#water-grad)" />

      {/* Water surface line */}
      <motion.path
        d="M 0 232 Q 125 228 250 232 Q 375 236 500 232"
        stroke="#1a5a3a"
        strokeWidth="1"
        fill="none"
        opacity="0.6"
        animate={
          shouldAnimate
            ? { d: ['M 0 232 Q 125 228 250 232 Q 375 236 500 232', 'M 0 232 Q 125 236 250 232 Q 375 228 500 232', 'M 0 232 Q 125 228 250 232 Q 375 236 500 232'] }
            : {}
        }
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* ── WATER SHIMMER LINES ── */}
      {shimmerLines.map((line, i) => (
        <motion.line
          key={`shimmer-${i}`}
          x1={line.x1}
          y1={line.y1}
          x2={line.x2}
          y2={line.y2}
          stroke="url(#shimmer)"
          strokeWidth="1.5"
          strokeLinecap="round"
          animate={
            shouldAnimate
              ? { opacity: [0, 0.6, 0], x: [0, 8, 0] }
              : { opacity: 0.2 }
          }
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: line.delay,
          }}
        />
      ))}

      {/* ── LOTUS LEAF (main boat) ── */}
      <motion.g
        animate={shouldAnimate ? { y: [0, -4, 0] } : {}}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* Leaf shadow on water */}
        <ellipse cx="250" cy="238" rx="78" ry="8" fill="#0a1f18" opacity="0.5" />
        {/* Leaf body */}
        <ellipse cx="250" cy="228" rx="75" ry="18" fill="#1a5a12" />
        {/* Leaf veins */}
        <path d="M 200 228 Q 250 222 300 228" stroke="#0e3a08" strokeWidth="1" fill="none" opacity="0.6" />
        <path d="M 215 225 Q 250 218 285 225" stroke="#0e3a08" strokeWidth="0.8" fill="none" opacity="0.4" />
        <path d="M 250 215 L 250 235" stroke="#0e3a08" strokeWidth="1" opacity="0.5" />
        <path d="M 225 218 L 240 232" stroke="#0e3a08" strokeWidth="0.7" opacity="0.35" />
        <path d="M 275 218 L 260 232" stroke="#0e3a08" strokeWidth="0.7" opacity="0.35" />
        {/* Leaf highlight */}
        <ellipse cx="235" cy="222" rx="25" ry="6" fill="#2a7a1e" opacity="0.4" />
        {/* Leaf edge notch */}
        <path
          d="M 175 228 Q 200 215 250 213 Q 300 215 325 228"
          stroke="#2a7a1e"
          strokeWidth="1.5"
          fill="none"
          opacity="0.5"
        />

        {/* ── ENVELOPE ON LEAF ── */}
        <g transform="translate(228, 200)">
          {/* Envelope body */}
          <rect x="0" y="12" width="44" height="30" rx="3" fill="url(#env-grad)" />
          {/* Envelope flap (top triangle) */}
          <path d="M 0 12 L 22 26 L 44 12 Z" fill="#e8dcc8" />
          {/* Envelope fold lines */}
          <path d="M 0 42 L 22 26 L 44 42" stroke="#c4b090" strokeWidth="0.8" fill="none" opacity="0.6" />
          {/* Amber lotus wax seal */}
          <circle cx="22" cy="27" r="5.5" fill="#f3a213" opacity="0.9" />
          <circle cx="22" cy="27" r="3.5" fill="#ffe08a" opacity="0.8" />
          {/* Tiny lotus on seal */}
          <path d="M 22 24 Q 20 26 22 28 Q 24 26 22 24 Z" fill="#f3a213" opacity="0.9" />
          <path d="M 19 26 Q 21 24 22 27 Q 21 28 19 26 Z" fill="#e07010" opacity="0.7" />
          <path d="M 25 26 Q 23 24 22 27 Q 23 28 25 26 Z" fill="#e07010" opacity="0.7" />
        </g>
      </motion.g>

      {/* ── LOTUS FLOWERS ── */}
      {lotuses.map((lotus, li) => (
        <motion.g
          key={`lotus-${li}`}
          animate={shouldAnimate ? { y: [0, -3, 0] } : {}}
          transition={{
            duration: 3.5 + li * 0.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: lotus.delay,
          }}
        >
          {/* Stem */}
          <line
            x1={lotus.cx}
            y1={lotus.cy + 10}
            x2={lotus.cx}
            y2={lotus.cy + 22}
            stroke="#1a5a12"
            strokeWidth="2"
            opacity="0.7"
          />
          {/* Petals */}
          {[-30, -15, 0, 15, 30].map((angle, pi) => (
            <motion.ellipse
              key={`petal-${li}-${pi}`}
              cx={lotus.cx + Math.sin((angle * Math.PI) / 180) * 10 * lotus.scale}
              cy={lotus.cy - Math.cos((angle * Math.PI) / 180) * 10 * lotus.scale}
              rx={4 * lotus.scale}
              ry={11 * lotus.scale}
              fill={pi % 2 === 0 ? '#e8a0c0' : '#f0b8d0'}
              transform={`rotate(${angle}, ${lotus.cx + Math.sin((angle * Math.PI) / 180) * 10 * lotus.scale}, ${lotus.cy - Math.cos((angle * Math.PI) / 180) * 10 * lotus.scale})`}
              animate={
                shouldAnimate
                  ? {
                      scaleY: [0.8, 1, 0.8],
                      opacity: [0.7, 1, 0.7],
                    }
                  : {}
              }
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: lotus.delay + pi * 0.1,
              }}
            />
          ))}
          {/* Lotus center */}
          <circle cx={lotus.cx} cy={lotus.cy} r={5 * lotus.scale} fill="#f3a213" />
          <circle cx={lotus.cx} cy={lotus.cy} r={2.5 * lotus.scale} fill="#ffe08a" />
        </motion.g>
      ))}

      {/* ── FLOATING MAKHANA BALLS IN WATER ── */}
      {waterMakhana.map((mk, i) => (
        <motion.g
          key={`water-mk-${i}`}
          animate={shouldAnimate ? { y: [0, -5, 0, -3, 0] } : {}}
          transition={{
            duration: 2.5 + i * 0.3,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: mk.delay,
          }}
        >
          <circle cx={mk.cx} cy={mk.cy} r={mk.r} fill="url(#mk-contact)" />
          <circle
            cx={mk.cx - mk.r * 0.3}
            cy={mk.cy - mk.r * 0.3}
            r={mk.r * 0.28}
            fill="white"
            opacity="0.45"
          />
          {/* Water reflection */}
          <ellipse
            cx={mk.cx}
            cy={mk.cy + mk.r + 2}
            rx={mk.r * 0.7}
            ry={3}
            fill="#1a5a3a"
            opacity="0.3"
          />
        </motion.g>
      ))}

      {/* ── GOLDEN SPARKLES ── */}
      {sparkles.map((sp, i) => (
        <motion.g
          key={`sparkle-${i}`}
          animate={
            shouldAnimate
              ? {
                  opacity: [0, 1, 0],
                  scale: [0.4, 1.3, 0.4],
                }
              : { opacity: 0.4 }
          }
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: sp.delay,
            repeatDelay: 1.2,
          }}
          style={{ originX: sp.cx, originY: sp.cy }}
        >
          <line
            x1={sp.cx}
            y1={sp.cy - 6}
            x2={sp.cx}
            y2={sp.cy + 6}
            stroke="#f3a213"
            strokeWidth="1.2"
          />
          <line
            x1={sp.cx - 6}
            y1={sp.cy}
            x2={sp.cx + 6}
            y2={sp.cy}
            stroke="#f3a213"
            strokeWidth="1.2"
          />
          <line
            x1={sp.cx - 4}
            y1={sp.cy - 4}
            x2={sp.cx + 4}
            y2={sp.cy + 4}
            stroke="#f3a213"
            strokeWidth="0.8"
            opacity="0.6"
          />
          <line
            x1={sp.cx + 4}
            y1={sp.cy - 4}
            x2={sp.cx - 4}
            y2={sp.cy + 4}
            stroke="#f3a213"
            strokeWidth="0.8"
            opacity="0.6"
          />
          <circle cx={sp.cx} cy={sp.cy} r="2" fill="#ffe08a" />
        </motion.g>
      ))}

      {/* ── DRAGONFLIES ── */}
      {dragonflies.map((df, i) => (
        <motion.g
          key={`dragonfly-${i}`}
          animate={
            shouldAnimate
              ? {
                  x: [0, df.driftX, 0, -df.driftX * 0.5, 0],
                  y: [0, -df.driftY * 0.5, -df.driftY, -df.driftY * 0.3, 0],
                }
              : {}
          }
          transition={{
            duration: 6 + i * 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: df.delay,
          }}
        >
          {/* Body */}
          <line
            x1={df.cx}
            y1={df.cy - 8}
            x2={df.cx}
            y2={df.cy + 8}
            stroke="#44bbaa"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          {/* Upper wings */}
          <motion.ellipse
            cx={df.cx - 9}
            cy={df.cy - 3}
            rx={9}
            ry={4}
            fill="url(#wing-grad)"
            animate={
              shouldAnimate
                ? { scaleX: [1, 0.85, 1], opacity: [0.6, 0.9, 0.6] }
                : {}
            }
            transition={{ duration: 0.3, repeat: Infinity }}
          />
          <motion.ellipse
            cx={df.cx + 9}
            cy={df.cy - 3}
            rx={9}
            ry={4}
            fill="url(#wing-grad)"
            animate={
              shouldAnimate
                ? { scaleX: [1, 0.85, 1], opacity: [0.6, 0.9, 0.6] }
                : {}
            }
            transition={{ duration: 0.3, repeat: Infinity }}
          />
          {/* Lower wings */}
          <motion.ellipse
            cx={df.cx - 7}
            cy={df.cy + 2}
            rx={7}
            ry={3}
            fill="url(#wing-grad)"
            opacity="0.5"
            animate={
              shouldAnimate
                ? { scaleX: [1, 0.88, 1] }
                : {}
            }
            transition={{ duration: 0.3, repeat: Infinity, delay: 0.05 }}
          />
          <motion.ellipse
            cx={df.cx + 7}
            cy={df.cy + 2}
            rx={7}
            ry={3}
            fill="url(#wing-grad)"
            opacity="0.5"
            animate={
              shouldAnimate
                ? { scaleX: [1, 0.88, 1] }
                : {}
            }
            transition={{ duration: 0.3, repeat: Infinity, delay: 0.05 }}
          />
          {/* Head */}
          <circle cx={df.cx} cy={df.cy - 9} r="2.5" fill="#44bbaa" opacity="0.9" />
        </motion.g>
      ))}

      {/* ── AMBIENT WATER RIPPLE RINGS ── */}
      {[
        { cx: 250, cy: 235, delay: 0 },
        { cx: 155, cy: 262, delay: 1.5 },
        { cx: 380, cy: 255, delay: 2.8 },
      ].map((ripple, i) => (
        <motion.ellipse
          key={`ripple-${i}`}
          cx={ripple.cx}
          cy={ripple.cy}
          rx={10}
          ry={4}
          fill="none"
          stroke="#1a5a3a"
          strokeWidth="0.8"
          animate={
            shouldAnimate
              ? {
                  rx: [5, 30],
                  ry: [2, 9],
                  opacity: [0.5, 0],
                }
              : { opacity: 0 }
          }
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: 'easeOut',
            delay: ripple.delay,
            repeatDelay: 1.5,
          }}
        />
      ))}

      {/* ── PATH LABEL: "Mithila, Bihar" ── */}
      <g>
        <rect
          x="12"
          y="296"
          width="110"
          height="20"
          rx="5"
          fill="#0a1f18"
          stroke="#1a5a3a"
          strokeWidth="0.8"
          opacity="0.8"
        />
        <text
          x="20"
          y="310"
          fontFamily="serif"
          fontSize="9.5"
          fill="#3a9a70"
          opacity="0.85"
          letterSpacing="1"
        >
          Mithila, Bihar
        </text>
      </g>
    </svg>
  );
}
