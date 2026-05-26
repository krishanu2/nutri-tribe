'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface LotusBotanicalSceneProps {
  inView?: boolean;
  className?: string;
}

export default function LotusBotanicalScene({ inView = false, className = '' }: LotusBotanicalSceneProps) {
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    if (inView) setTriggered(true);
  }, [inView]);

  const wavePath1 = 'M0,134 C40,124 80,144 120,134 C160,124 200,144 240,134 C280,124 320,144 360,134 C400,124 440,144 480,134 L480,160 L0,160 Z';
  const wavePath2 = 'M0,140 C40,150 80,130 120,140 C160,150 200,130 240,140 C280,150 320,130 360,140 C400,150 440,130 480,140 L480,160 L0,160 Z';

  const petalAngles = [-60, -30, 0, 30, 60, -90, 90];
  const bubbles = [
    { cx: 195, startY: 350, delay: 0, r: 3 },
    { cx: 210, startY: 320, delay: 1.2, r: 2 },
    { cx: 225, startY: 370, delay: 0.6, r: 2.5 },
    { cx: 185, startY: 300, delay: 1.8, r: 2 },
  ];

  const labelStyle = {
    fontFamily: "'Playfair Display', serif",
    fontSize: 9.5,
    fill: '#f3a213',
    fontStyle: 'italic' as const,
  };

  return (
    <svg
      viewBox="0 0 480 540"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: 'auto', display: 'block' }}
    >
      <defs>
        {/* Sky gradient */}
        <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fdf6e8" />
          <stop offset="100%" stopColor="#f5e8d0" />
        </linearGradient>

        {/* Water gradient */}
        <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a5a42" />
          <stop offset="100%" stopColor="#0d3028" />
        </linearGradient>

        {/* Mud gradient */}
        <linearGradient id="mudGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a1e0a" />
          <stop offset="100%" stopColor="#2a1408" />
        </linearGradient>

        {/* Water shimmer */}
        <radialGradient id="shimmer" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#a8d8c0" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#1a5a42" stopOpacity="0" />
        </radialGradient>

        {/* Clip water zone */}
        <clipPath id="waterClip">
          <rect x="0" y="108" width="480" height="272" />
        </clipPath>
      </defs>

      {/* ── Madhubani border top ── */}
      <rect x="0" y="0" width="480" height="5" fill="#f3a213" opacity="0.6" rx="2" />
      <rect x="0" y="7" width="480" height="2" fill="#f3a213" opacity="0.35" rx="1" />

      {/* ── 1. SKY / AIR ZONE (y 0–108) ── */}
      <rect x="0" y="0" width="480" height="108" fill="url(#skyGrad)" />

      {/* Sunlight beams from top-right */}
      {[0, 1, 2, 3].map((i) => (
        <motion.line
          key={`beam-${i}`}
          x1={360 + i * 22}
          y1={0}
          x2={160 + i * 18}
          y2={108}
          stroke="#f3a213"
          strokeWidth={1.5 - i * 0.3}
          strokeOpacity={0.18 - i * 0.03}
          animate={{ strokeOpacity: [0.12, 0.22, 0.12] }}
          transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      {/* Stars / sparkles */}
      {[{ cx: 60, cy: 28 }, { cx: 160, cy: 18 }, { cx: 290, cy: 38 }].map((s, i) => (
        <motion.g key={`star-${i}`}>
          <motion.circle
            cx={s.cx} cy={s.cy} r={2.5}
            fill="#f3a213"
            animate={{ opacity: [0.4, 1, 0.4], r: [2, 3, 2] }}
            transition={{ duration: 2 + i * 0.7, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
          />
          <line x1={s.cx - 5} y1={s.cy} x2={s.cx + 5} y2={s.cy} stroke="#f3a213" strokeWidth="0.8" opacity="0.5" />
          <line x1={s.cx} y1={s.cy - 5} x2={s.cx} y2={s.cy + 5} stroke="#f3a213" strokeWidth="0.8" opacity="0.5" />
        </motion.g>
      ))}

      {/* ── 2. WATER SURFACE ZONE (y 108–160) ── */}

      {/* Water body fill */}
      <rect x="0" y="108" width="480" height="272" fill="url(#waterGrad)" />

      {/* Water shimmer spots */}
      {[{ cx: 100, cy: 220 }, { cx: 300, cy: 260 }, { cx: 180, cy: 320 }].map((s, i) => (
        <motion.ellipse
          key={`shimmer-${i}`}
          cx={s.cx} cy={s.cy} rx={30} ry={14}
          fill="url(#shimmer)"
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 1.2 }}
        />
      ))}

      {/* Animated wave surface */}
      <motion.path
        d={wavePath1}
        fill="#1a5a42"
        animate={{ d: [wavePath1, wavePath2, wavePath1] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Lotus flower — petals blooming at surface */}
      {petalAngles.map((angle, i) => (
        <motion.ellipse
          key={`petal-${i}`}
          cx={240}
          cy={128}
          rx={5}
          ry={4}
          fill={i % 2 === 0 ? '#9b59b6' : '#7c3aed'}
          stroke="#e0708a"
          strokeWidth="0.5"
          style={{
            transformOrigin: '240px 136px',
            transform: `rotate(${angle}deg)`,
          }}
          initial={{ ry: 4, opacity: 0.3 }}
          animate={triggered ? { ry: 12, opacity: 1 } : { ry: 4, opacity: 0.3 }}
          transition={{ duration: 0.8, delay: 1 + i * 0.12, ease: 'easeOut' }}
        />
      ))}
      {/* Lotus center */}
      <motion.circle
        cx={240} cy={128} r={6}
        fill="#f5ead8"
        stroke="#d4af37"
        strokeWidth="1"
        initial={{ opacity: 0, scale: 0 }}
        animate={triggered ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
        style={{ transformOrigin: '240px 128px' }}
        transition={{ duration: 0.5, delay: 2, ease: 'backOut' }}
      />

      {/* Floating makhana seeds on surface */}
      {[{ cx: 188, cy: 132 }, { cx: 270, cy: 129 }, { cx: 308, cy: 135 }, { cx: 155, cy: 130 }].map((s, i) => (
        <motion.g key={`seed-float-${i}`}>
          <motion.circle
            cx={s.cx} cy={s.cy} r={5}
            fill="#f5ead8"
            stroke="#d4af37"
            strokeWidth="0.8"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 2.2 + i * 0.3, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
          />
          <motion.circle
            cx={s.cx} cy={s.cy} r={2.5}
            fill="#e8d5bb"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 2.2 + i * 0.3, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
          />
        </motion.g>
      ))}

      {/* ── 3. UNDERWATER ZONE (y 160–380) ── */}

      {/* Lotus stem — draws from surface down to mud */}
      <motion.path
        d="M240,136 C238,200 242,280 240,380"
        stroke="#1a7a20"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={triggered ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
        transition={{ duration: 2, delay: 0.3, ease: 'easeInOut' }}
      />

      {/* Stem side tendrils */}
      {[{ d: 'M240,210 C225,205 210,215 200,210', delay: 1.0 }, { d: 'M240,260 C255,255 270,265 278,260', delay: 1.3 }].map((t, i) => (
        <motion.path
          key={`tendril-${i}`}
          d={t.d}
          stroke="#1a7a20"
          strokeWidth="1.8"
          fill="none"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={triggered ? { pathLength: 1, opacity: 0.75 } : { pathLength: 0, opacity: 0 }}
          transition={{ duration: 0.8, delay: t.delay, ease: 'easeOut' }}
        />
      ))}

      {/* Makhana Pod at y=280 */}
      <motion.g
        initial={{ opacity: 0, scale: 0 }}
        animate={triggered ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
        style={{ transformOrigin: '240px 280px' }}
        transition={{ duration: 0.7, delay: 1.8, ease: 'backOut' }}
      >
        <ellipse cx={240} cy={280} rx={18} ry={13} fill="#d4af37" stroke="#b8902a" strokeWidth="1" />
        {/* Pod segments */}
        {[-8, 0, 8].map((x, i) => (
          <line key={`seg-${i}`} x1={240 + x} y1={268} x2={240 + x} y2={292} stroke="#b8902a" strokeWidth="0.8" opacity="0.6" />
        ))}
        <ellipse cx={240} cy={280} rx={18} ry={13} fill="none" stroke="#f0c040" strokeWidth="0.5" opacity="0.4" />
      </motion.g>

      {/* Bubbles rising */}
      {bubbles.map((b, i) => (
        <motion.circle
          key={`bubble-${i}`}
          cx={b.cx}
          cy={b.startY}
          r={b.r}
          fill="none"
          stroke="#a8d8c0"
          strokeWidth="0.8"
          opacity={0.6}
          animate={{ y: [0, -180], opacity: [0.6, 0] }}
          transition={{ duration: 3 + i * 0.4, delay: b.delay, repeat: Infinity, ease: 'easeIn' }}
        />
      ))}

      {/* Water particle shimmer dots */}
      {[{ cx: 130, cy: 230 }, { cx: 340, cy: 300 }, { cx: 80, cy: 330 }, { cx: 380, cy: 250 }, { cx: 160, cy: 370 }].map((p, i) => (
        <motion.circle
          key={`particle-${i}`}
          cx={p.cx} cy={p.cy} r={1.5}
          fill="#a8d8c0"
          animate={{ opacity: [0.1, 0.5, 0.1] }}
          transition={{ duration: 2.5 + i * 0.6, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
        />
      ))}

      {/* ── 4. MUD / SOIL ZONE (y 380–480) ── */}
      <rect x="0" y="380" width="480" height="160" fill="url(#mudGrad)" />

      {/* Soil texture particles */}
      {[40, 90, 140, 200, 260, 320, 380, 430, 460, 70, 170, 290, 410].map((x, i) => (
        <circle key={`soil-${i}`} cx={x} cy={395 + (i % 4) * 18} r={2 + (i % 3)} fill="#4a2810" opacity="0.5" />
      ))}

      {/* Lotus rhizome — horizontal lumpy root */}
      <motion.path
        d="M80,400 C100,395 115,408 135,400 C155,392 170,410 195,402 C215,395 230,408 250,402 C268,396 285,410 305,402 C325,394 342,408 365,400 C382,394 400,406 420,400"
        stroke="#6b3d1a"
        strokeWidth="10"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={triggered ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
        transition={{ duration: 1.5, delay: 2.2, ease: 'easeOut' }}
      />
      {/* Rhizome highlight */}
      <motion.path
        d="M80,397 C100,392 115,405 135,397 C155,389 170,407 195,399 C215,392 230,405 250,399 C268,393 285,407 305,399 C325,391 342,405 365,397 C382,391 400,403 420,397"
        stroke="#8a5228"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={triggered ? { pathLength: 1, opacity: 0.5 } : { pathLength: 0, opacity: 0 }}
        transition={{ duration: 1.5, delay: 2.4, ease: 'easeOut' }}
      />

      {/* Root tendrils going into soil */}
      {[
        'M130,405 C128,425 122,445 118,465',
        'M200,405 C205,428 200,448 196,468',
        'M260,405 C258,430 255,450 260,470',
        'M340,405 C345,428 338,450 335,468',
      ].map((d, i) => (
        <motion.path
          key={`root-${i}`}
          d={d}
          stroke="#5a2e0e"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={triggered ? { pathLength: 1, opacity: 0.7 } : { pathLength: 0, opacity: 0 }}
          transition={{ duration: 0.8, delay: 2.6 + i * 0.15, ease: 'easeOut' }}
        />
      ))}

      {/* ── 5. BOTANICAL LABEL ANNOTATIONS ── */}

      {/* Label: Lotus Blossom */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={triggered ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6, delay: 2.2 }}
      >
        <line x1={255} y1={132} x2={310} y2={118} stroke="#f3a213" strokeWidth="0.8" opacity="0.7" strokeDasharray="3,2" />
        <text x={313} y={117} {...labelStyle}>Lotus Blossom</text>
      </motion.g>

      {/* Label: Makhana Seed */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={triggered ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6, delay: 2.5 }}
      >
        <line x1={188} y1={127} x2={145} y2={112} stroke="#f3a213" strokeWidth="0.8" opacity="0.7" strokeDasharray="3,2" />
        <text x={58} y={111} {...labelStyle}>Makhana Seed</text>
      </motion.g>

      {/* Label: Makhana Pod */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={triggered ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6, delay: 2.8 }}
      >
        <line x1={222} y1={280} x2={168} y2={276} stroke="#f3a213" strokeWidth="0.8" opacity="0.7" strokeDasharray="3,2" />
        <text x={72} y={279} {...labelStyle}>Makhana Pod</text>
      </motion.g>

      {/* Label: Lotus Root (Rhizome) */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={triggered ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6, delay: 3.2 }}
      >
        <line x1={370} y1={402} x2={400} y2={418} stroke="#f3a213" strokeWidth="0.8" opacity="0.7" strokeDasharray="3,2" />
        <text x={290} y={433} {...labelStyle}>Lotus Root (Rhizome)</text>
      </motion.g>

      {/* ── Madhubani border bottom ── */}
      <rect x="0" y="531" width="480" height="5" fill="#f3a213" opacity="0.6" rx="2" />
      <rect x="0" y="526" width="480" height="2" fill="#f3a213" opacity="0.35" rx="1" />

      {/* Decorative corner motifs */}
      {[[8, 8], [472, 8], [8, 532], [472, 532]].map(([cx, cy], i) => (
        <motion.circle
          key={`corner-${i}`}
          cx={cx} cy={cy} r={4}
          fill="#f3a213"
          opacity={0.55}
          animate={{ opacity: [0.4, 0.75, 0.4] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
        />
      ))}
    </svg>
  );
}
