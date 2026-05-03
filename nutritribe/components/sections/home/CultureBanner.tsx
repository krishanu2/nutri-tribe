'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const MadhubaniCorner = ({ className }: { className: string }) => (
  <svg viewBox="0 0 80 80" className={className} fill="none">
    <path d="M4 4 L4 40 Q4 76 40 76" stroke="#f3a213" strokeWidth="1.5" opacity="0.4" strokeLinecap="round" />
    <path d="M4 4 L40 4 Q76 4 76 40" stroke="#f3a213" strokeWidth="1" opacity="0.25" strokeLinecap="round" />
    <circle cx="4" cy="4" r="3" fill="#f3a213" opacity="0.5" />
    <circle cx="4" cy="22" r="2" fill="#f3a213" opacity="0.3" />
    <circle cx="22" cy="4" r="2" fill="#f3a213" opacity="0.3" />
    <ellipse cx="20" cy="20" rx="7" ry="4" fill="none" stroke="#f3a213" strokeWidth="0.7" opacity="0.2" transform="rotate(-45 20 20)" />
  </svg>
);

/* Animated lotus flower that breathes in view */
function AnimatedLotus({ x, y, s = 1, inView, delay = 0 }: { x: number; y: number; s?: number; inView: boolean; delay?: number }) {
  return (
    <motion.g
      transform={`translate(${x},${y}) scale(${s})`}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.8, delay }}
    >
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => (
        <g key={i} transform={`rotate(${a})`}>
          <motion.ellipse
            cx="0"
            cy={-9}
            rx="3.5"
            ry="8"
            fill={i % 2 === 0 ? '#ffb8d0' : '#ff9ab8'}
            opacity="0.85"
            animate={inView ? { cy: [-9, -11, -9] } : {}}
            transition={{ duration: 3.2 + i * 0.2, repeat: Infinity, ease: 'easeInOut', delay: delay + i * 0.1 }}
          />
        </g>
      ))}
      <circle cx="0" cy="0" r="4.5" fill="#f3a213" />
      <circle cx="0" cy="0" r="2.2" fill="#D4AF37" />
    </motion.g>
  );
}

/* ── The entire illustrated scene ── */
function FarmerScene({ inView }: { inView: boolean }) {
  const [phase, setPhase] = useState<'idle' | 'walking' | 'arrived' | 'harvesting'>('idle');

  useEffect(() => {
    if (!inView) return;
    const t1 = setTimeout(() => setPhase('walking'), 300);
    const t2 = setTimeout(() => setPhase('arrived'), 5200);
    const t3 = setTimeout(() => setPhase('harvesting'), 5600);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [inView]);

  const isWalking  = phase === 'walking';
  const atPond     = phase === 'arrived' || phase === 'harvesting';
  const harvesting = phase === 'harvesting';

  /* Bird wing path pairs: [wing-up-left, wing-down-left, wing-up-right, wing-down-right] */
  const birdPositions = [[150, 55], [230, 42], [340, 68], [450, 48]];

  return (
    <div className="relative w-full overflow-hidden rounded-2xl" style={{ minHeight: 330 }}>
      <svg
        viewBox="0 0 700 370"
        className="w-full"
        fill="none"
        style={{ display: 'block' }}
      >
        <defs>
          {/* Sky – deep blue night → orange dawn horizon */}
          <linearGradient id="fc-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#080f1e" />
            <stop offset="40%"  stopColor="#12245a" />
            <stop offset="78%"  stopColor="#7a2d08" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#f3a213" stopOpacity="0.18" />
          </linearGradient>
          {/* Ground – rich green soil */}
          <linearGradient id="fc-gnd" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#3a5c14" />
            <stop offset="60%"  stopColor="#2c4a10" />
            <stop offset="100%" stopColor="#1a2e06" />
          </linearGradient>
          {/* Pond water */}
          <radialGradient id="fc-pond" cx="45%" cy="38%" r="60%">
            <stop offset="0%"   stopColor="#1a3a5e" />
            <stop offset="100%" stopColor="#080f1e" />
          </radialGradient>
          {/* Sun glow */}
          <radialGradient id="fc-sun" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#f3a213" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#f3a213" stopOpacity="0" />
          </radialGradient>
          {/* Lantern glow */}
          <radialGradient id="fc-lantern-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#f3a213" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#f3a213" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* ── SKY ── */}
        <rect width="700" height="370" fill="url(#fc-sky)" />

        {/* Dawn sun on horizon */}
        <circle cx="95" cy="218" r="15" fill="#f3a213" opacity="0.8" />
        <circle cx="95" cy="218" r="32" fill="url(#fc-sun)" opacity="0.9" />
        <circle cx="95" cy="218" r="55" fill="url(#fc-sun)" opacity="0.35" />

        {/* ── CRESCENT MOON (top right, fades when farmer arrives at pond) ── */}
        <motion.g
          animate={atPond ? { opacity: 0 } : { opacity: 1 }}
          transition={{ duration: 1.8 }}
        >
          <circle cx="618" cy="38" r="13" fill="#d4c87a" opacity="0.85" />
          <circle cx="624" cy="35" r="10.5" fill="#080f1e" />
          {/* subtle crescent glow */}
          <circle cx="618" cy="38" r="20" fill="#d4c87a" opacity="0.06" />
        </motion.g>

        {/* Stars */}
        {[[120,28],[210,14],[330,38],[470,18],[570,32],[640,14],[50,55],[290,8],[415,46]].map(([x,y],i) => (
          <motion.circle key={i} cx={x} cy={y} r="1.3" fill="white"
            animate={inView ? { opacity: [0.65, 0.1, 0.65] } : { opacity: 0 }}
            transition={{ duration: 3, repeat: Infinity, delay: i * 0.38 }} />
        ))}

        {/* ── BIRDS in sky – appear when walking, flapping wings ── */}
        {birdPositions.map(([bx, by], bi) => (
          <motion.g
            key={`bird-${bi}`}
            animate={isWalking ? { opacity: [0, 0.75, 0.5, 0] } : { opacity: 0 }}
            transition={{ duration: 8, repeat: Infinity, delay: bi * 1.4, ease: 'easeInOut' }}
          >
            {/* Left wing */}
            <motion.path
              d={`M ${bx} ${by} Q ${bx - 5} ${by - 4} ${bx - 10} ${by - 2}`}
              stroke="#b0c0d8"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
              animate={isWalking ? {
                d: [
                  `M ${bx} ${by} Q ${bx - 5} ${by - 4} ${bx - 10} ${by - 2}`,
                  `M ${bx} ${by} Q ${bx - 5} ${by + 2} ${bx - 10} ${by + 1}`,
                ]
              } : {}}
              transition={{ duration: 0.55, repeat: Infinity, repeatType: 'reverse', delay: bi * 0.2 }}
            />
            {/* Right wing */}
            <motion.path
              d={`M ${bx} ${by} Q ${bx + 5} ${by - 4} ${bx + 10} ${by - 2}`}
              stroke="#b0c0d8"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
              animate={isWalking ? {
                d: [
                  `M ${bx} ${by} Q ${bx + 5} ${by - 4} ${bx + 10} ${by - 2}`,
                  `M ${bx} ${by} Q ${bx + 5} ${by + 2} ${bx + 10} ${by + 1}`,
                ]
              } : {}}
              transition={{ duration: 0.55, repeat: Infinity, repeatType: 'reverse', delay: bi * 0.2 + 0.0 }}
            />
          </motion.g>
        ))}

        {/* ── GROUND – horizon sits at exactly y=222 ── */}
        <path d="M 0 222 Q 180 214 350 218 Q 520 222 700 216 L 700 370 L 0 370 Z"
          fill="url(#fc-gnd)" />

        {/* Rolling hill silhouette behind hut */}
        <path d="M 350 222 Q 450 200 570 210 Q 640 214 700 216 L 700 222 Z"
          fill="#2a4810" opacity="0.5" />

        {/* ── GROUND MIST ── */}
        {inView && (
          <motion.rect
            x="0" y="213" width="700" height="20"
            fill="rgba(220,200,170,0.07)"
            animate={{ opacity: [0.5, 1, 0.5], x: [-5, 5, -5] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}

        {/* Dirt path from hut to pond */}
        <path d="M 592 226 Q 420 232 270 238 Q 175 241 115 255"
          stroke="#8a6520" strokeWidth="9" opacity="0.3"
          fill="none" strokeLinecap="round" />
        <path d="M 592 226 Q 420 232 270 238 Q 175 241 115 255"
          stroke="#c4a040" strokeWidth="3" opacity="0.12"
          fill="none" strokeLinecap="round" />

        {/* ── BACKGROUND TREES ── */}
        {[[310,206,11],[348,202,9],[385,205,10],[418,208,8]].map(([x,y,r],i) => (
          <g key={i} opacity="0.45">
            <rect x={x-2}   y={y+r*0.7} width="4"  height={r*0.8}   fill="#3a2808" />
            <circle cx={x}  cy={y}       r={r}                        fill="#1a4a08" />
          </g>
        ))}

        {/* ── HUT CLUSTER – base sits at y=222 ── */}
        <g>
          {/* Walls */}
          <rect x="530" y="178" width="65" height="50" fill="#8b5a2a" rx="2" />
          {/* Thatched roof */}
          <polygon points="520,180 562,146 610,180" fill="#7a4818" />
          <polygon points="524,180 562,150 606,180" fill="#9a6228" />
          {/* Roof texture */}
          {[530,542,554,566,578,590].map((x,i) => (
            <line key={i} x1={x} y1="180" x2={562-(i-2.5)*2} y2="152"
              stroke="#6a3808" strokeWidth="1" opacity="0.3" />
          ))}
          {/* Door */}
          <rect x="553" y="195" width="16" height="33" fill="#3a1e08" rx="1.5" />
          <circle cx="567" cy="212" r="1.8" fill="#D4AF37" opacity="0.7" />
          {/* Window frame */}
          <rect x="534" y="186" width="13" height="10" fill="#101828" rx="1" opacity="0.9" />
          {/* Window light flicker */}
          {inView && (
            <motion.rect
              x="534" y="186" width="13" height="10" rx="1"
              fill="#f3a213"
              animate={{ opacity: [0.5, 0.9, 0.6, 0.85, 0.5] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            />
          )}
          <line x1="540" y1="186" x2="540" y2="196" stroke="#D4AF37" strokeWidth="0.6" opacity="0.35" />
          <line x1="534" y1="191" x2="547" y2="191" stroke="#D4AF37" strokeWidth="0.6" opacity="0.35" />
          {/* Chimney smoke – 3 animated particles */}
          {inView && [0, 1, 2].map(i => (
            <motion.circle
              key={`smoke-${i}`}
              cx={562 + (i - 1) * 2}
              cy={146}
              r={3}
              fill="rgba(200,180,160,0.4)"
              initial={{ y: 0, opacity: 0, r: 3 }}
              animate={{ y: [0, -20, -40], opacity: [0, 0.3, 0], r: [3, 5, 8] }}
              transition={{ duration: 3.5, repeat: Infinity, delay: i * 1.1, ease: 'easeOut' }}
            />
          ))}
        </g>

        {/* Adjacent smaller hut */}
        <g>
          <rect x="598" y="192" width="44" height="36" fill="#7a4e22" rx="2" />
          <polygon points="592,194 620,168 650,194" fill="#5a3810" />
          <polygon points="596,194 620,172 646,194" fill="#7a4e18" />
        </g>

        {/* Trees beside hut */}
        {[[625,210,13],[648,205,10],[665,211,9]].map(([x,y,r],i) => (
          <g key={i}>
            <rect x={x-2.5} y={y+r*0.65} width="5" height={r*1.1} fill="#4a3210" />
            <circle cx={x}   cy={y}        r={r}                    fill="#1a5a0a" opacity="0.88" />
            <circle cx={x-r*0.3} cy={y-r*0.3} r={r*0.55}           fill="#246612" opacity="0.6" />
          </g>
        ))}

        {/* ── LOTUS POND ── */}
        <ellipse cx="128" cy="305" rx="118" ry="48" fill="url(#fc-pond)" opacity="0.95" />
        <ellipse cx="128" cy="298" rx="110" ry="36" fill="#0e2440"      opacity="0.65" />

        {/* Dawn water reflection – appears when farmer arrives */}
        <motion.ellipse
          cx="128" cy="300" rx="90" ry="28"
          fill="rgba(243,162,19,0.15)"
          animate={atPond ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 2 }}
        />

        {/* Pond mist */}
        {inView && (
          <motion.ellipse
            cx="128" cy="270" rx="80" ry="15"
            fill="rgba(200,200,220,0.06)"
            animate={{ opacity: [0.3, 0.7, 0.3], scaleX: [0.9, 1.1, 0.9] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}

        {/* Water shimmer */}
        {inView && [55,95,135,175,205].map((x,i) => (
          <motion.line key={i} x1={x} y1={304} x2={x+20} y2={304}
            stroke="#2a5a8a" strokeWidth="1.5" opacity="0.3" strokeLinecap="round"
            animate={{ opacity: [0.12, 0.45, 0.12] }}
            transition={{ duration: 2.8, repeat: Infinity, delay: i * 0.48 }} />
        ))}

        {/* Ripples when harvesting */}
        {inView && harvesting && [0, 1, 2].map(i => (
          <motion.ellipse key={i} cx="105" cy="293" fill="none"
            stroke="rgba(120,190,230,0.35)" strokeWidth="1"
            initial={{ rx: 8, ry: 3, opacity: 0.6 }}
            animate={{ rx: [8+i*12, 38+i*18], ry: [3+i*3, 11+i*5], opacity: [0.5, 0] }}
            transition={{ duration: 2.8, repeat: Infinity, delay: i * 0.85 }} />
        ))}

        {/* Lily pads – animated gentle oscillation */}
        {[[58,300,16],[104,290,20],[152,295,16],[188,304,13],[72,314,11],[132,312,12]].map(([x,y,r],i) => (
          <motion.ellipse
            key={i}
            cx={x} cy={y} rx={r} ry={r*0.36}
            fill="#1a7a12" opacity="0.82"
            animate={inView ? { cy: [y, y + 0.5, y] } : {}}
            transition={{ duration: 3 + i * 0.4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
          />
        ))}

        {/* Lotus stems */}
        <line x1="68"  y1="296" x2="68"  y2="265" stroke="#009846" strokeWidth="2.5" />
        <line x1="118" y1="288" x2="118" y2="252" stroke="#009846" strokeWidth="2.5" />
        <line x1="168" y1="292" x2="168" y2="260" stroke="#009846" strokeWidth="2.5" />

        {/* Animated lotus flowers */}
        <AnimatedLotus x={68}  y={260} s={0.85} inView={inView} delay={0.4} />
        <AnimatedLotus x={118} y={246} s={1.1}  inView={inView} delay={0.6} />
        <AnimatedLotus x={168} y={254} s={0.8}  inView={inView} delay={0.8} />

        {/* Makhana rising after harvest – 5 seeds with water drip effect */}
        {inView && harvesting && [0, 1, 2, 3, 4].map(i => (
          <motion.g key={i} transform={`translate(${80 + i * 20}, 285)`}>
            {/* Water drip below seed */}
            <motion.ellipse
              cx="0" cy="4"
              rx="2" ry="3"
              fill="rgba(100,160,220,0.4)"
              initial={{ y: 0, opacity: 0 }}
              animate={{ y: [0, 10, 20], opacity: [0.6, 0.3, 0] }}
              transition={{ duration: 2.4, delay: i * 0.4, repeat: Infinity, repeatDelay: 3.5 }}
            />
            {/* Main seed */}
            <motion.circle r="6" fill="#ecdfc4"
              initial={{ y: 0, opacity: 0, scale: 0.3 }}
              animate={{ y: [0, -25-i*10], opacity: [0, 1, 0.7, 0], scale: [0.3, 1, 0.9] }}
              transition={{ duration: 2.4, delay: i * 0.4, repeat: Infinity, repeatDelay: 3.5 }} />
            {/* Highlight */}
            <motion.circle r="3" cx="-2" cy="-2" fill="white" fillOpacity="0.55"
              initial={{ y: 0, opacity: 0 }}
              animate={{ y: [0, -25-i*10], opacity: [0, 0.7, 0] }}
              transition={{ duration: 2.4, delay: i * 0.4, repeat: Infinity, repeatDelay: 3.5 }} />
          </motion.g>
        ))}

        {/* Foreground reeds */}
        {[[20,298],[34,293],[48,297],[222,292],[238,297],[252,291]].map(([x,y],i) => (
          <motion.path key={i}
            d={`M ${x} ${y} Q ${x+2} ${y-18} ${x} ${y-28}`}
            stroke="#2a6a10" strokeWidth="2.5" strokeLinecap="round" fill="none"
            animate={{ d: [`M ${x} ${y} Q ${x+2} ${y-18} ${x} ${y-28}`, `M ${x} ${y} Q ${x+5} ${y-16} ${x+3} ${y-26}`] }}
            transition={{ duration: 2.2+i*0.3, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }} />
        ))}

        {/* Fireflies */}
        {inView && [[210,190],[320,178],[460,183],[510,196],[365,172]].map(([x,y],i) => (
          <motion.circle key={i} cx={x} cy={y} r="1.6" fill="#f3a213"
            animate={{ opacity: [0, 0.9, 0], x: [0, (i%2===0?4:-4), 0], y: [0, -6, 0] }}
            transition={{ duration: 2.8+i*0.5, repeat: Infinity, delay: i*0.7 }} />
        ))}

        {/* ════════════════════════════════════════════
            SINGLE FARMER — one element, two poses
            ════════════════════════════════════════════ */}
        {inView && (phase !== 'idle') && (
          <motion.g
            initial={{ x: 569, y: 222 }}
            animate={
              isWalking
                ? { x: [569, 100], y: [222, 248] }
                : { x: 100, y: 248 }
            }
            transition={
              isWalking
                ? { duration: 4.5, ease: [0.42, 0, 0.58, 1] }
                : { duration: 0 }
            }
          >
            {/* Shadow on ground */}
            <ellipse cx="0" cy="2" rx="11" ry="3.5" fill="rgba(0,0,0,0.28)" />

            {/* ── WALKING POSE ── */}
            <AnimatePresence>
              {!atPond && (
                <motion.g
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  {/* Dhoti hem detail */}
                  <motion.path
                    d="M -6 -4 Q 0 -2 6 -4"
                    stroke="#d4b87a" strokeWidth="1" fill="none" opacity="0.6"
                    animate={{ d: ['M -6 -4 Q 0 -2 6 -4', 'M -5 -5 Q 0 -3 5 -5'] }}
                    transition={{ duration: 0.48, repeat: Infinity, repeatType: 'reverse' }}
                  />
                  {/* Legs */}
                  <motion.path
                    d="M -4 0 L -7 -22"
                    stroke="#e8d0a4" strokeWidth="6.5" strokeLinecap="round" fill="none"
                    animate={{ d: ['M -4 0 L -7 -22', 'M -4 0 L -2 -22'] }}
                    transition={{ duration: 0.48, repeat: Infinity, repeatType: 'reverse' }}
                  />
                  <motion.path
                    d="M 4 0 L 7 -22"
                    stroke="#e8d0a4" strokeWidth="6.5" strokeLinecap="round" fill="none"
                    animate={{ d: ['M 4 0 L 7 -22', 'M 4 0 L 2 -22'] }}
                    transition={{ duration: 0.48, repeat: Infinity, repeatType: 'reverse', delay: 0.24 }}
                  />
                  {/* Kurta body */}
                  <rect x="-9" y="-22" width="18" height="18" rx="3.5" fill="#5c3010" />
                  {/* Left arm swinging */}
                  <motion.path
                    d="M -9 -18 L -20 -7"
                    stroke="#5c3010" strokeWidth="5.5" strokeLinecap="round" fill="none"
                    animate={{ d: ['M -9 -18 L -20 -7', 'M -9 -18 L -15 -1'] }}
                    transition={{ duration: 0.48, repeat: Infinity, repeatType: 'reverse' }}
                  />
                  {/* Right arm holding lantern */}
                  <motion.path
                    d="M 9 -18 L 20 -7"
                    stroke="#5c3010" strokeWidth="5.5" strokeLinecap="round" fill="none"
                    animate={{ d: ['M 9 -18 L 20 -7', 'M 9 -18 L 15 -1'] }}
                    transition={{ duration: 0.48, repeat: Infinity, repeatType: 'reverse', delay: 0.24 }}
                  />
                  {/* Lantern glow halo */}
                  <motion.circle
                    cx="20" cy="-7" r="10"
                    fill="url(#fc-lantern-glow)"
                    animate={{ opacity: [0.6, 1, 0.6], r: [10, 13, 10] }}
                    transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  {/* Lantern body */}
                  <motion.rect
                    x="17" y="-11" width="6" height="7" rx="1.5"
                    fill="#f3a213"
                    animate={{ opacity: [0.7, 1, 0.75, 0.95, 0.7] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  {/* Lantern top hook */}
                  <line x1="20" y1="-11" x2="20" y2="-9" stroke="#D4AF37" strokeWidth="1" opacity="0.8" />
                  {/* Head + bounce */}
                  <motion.g
                    animate={{ y: [0, -2.5, 0] }}
                    transition={{ duration: 0.48, repeat: Infinity }}
                  >
                    <circle cx="0" cy="-32" r="9.5" fill="#6a3a18" />
                    {/* Turban */}
                    <ellipse cx="0" cy="-39.5" rx="12" ry="4.5" fill="#8B1a10" />
                    <ellipse cx="0" cy="-41.5" rx="8.5" ry="3"   fill="#a02015" />
                    {/* Turban knot detail */}
                    <circle  cx="9" cy="-40.5" r="2.8"           fill="#8B1a10" />
                    <path d="M 7 -42 Q 10 -44 13 -41" stroke="#c03020" strokeWidth="1" fill="none" opacity="0.7" strokeLinecap="round" />
                    {/* Basket on head */}
                    <ellipse cx="0" cy="-47"   rx="8" ry="3.5"   fill="#8B6914" opacity="0.9" />
                    <path d="M -6 -47 Q 0 -53 6 -47" stroke="#a07820" strokeWidth="2.5" fill="none" />
                    {/* Makhana balls in basket */}
                    <circle cx="-3" cy="-49" r="2.2" fill="#ecdfc4" opacity="0.85" />
                    <circle cx="0"  cy="-50" r="2.2" fill="#ecdfc4" opacity="0.85" />
                    <circle cx="3"  cy="-49" r="2.2" fill="#ecdfc4" opacity="0.85" />
                  </motion.g>
                </motion.g>
              )}
            </AnimatePresence>

            {/* ── HARVESTING POSE ── */}
            <AnimatePresence>
              {atPond && (
                <motion.g
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6 }}
                >
                  {/* Dhoti hem detail */}
                  <path d="M -7 -6 Q 0 -4 7 -6" stroke="#d4b87a" strokeWidth="1" fill="none" opacity="0.6" />
                  {/* Legs */}
                  <path d="M -5 0 L -7 -24" stroke="#e8d0a4" strokeWidth="6.5" strokeLinecap="round" fill="none" />
                  <path d="M 5 0 L 8 -24"  stroke="#e8d0a4" strokeWidth="6.5" strokeLinecap="round" fill="none" />
                  {/* Torso bent forward */}
                  <g transform="rotate(40, 0, -24)">
                    {/* Kurta */}
                    <rect x="-9" y="-24" width="18" height="18" rx="3.5" fill="#5c3010" />
                    {/* Right arm reaching into pond */}
                    <motion.path
                      d="M 9 -18 Q 20 -5 26 10"
                      stroke="#5c3010" strokeWidth="5.5" strokeLinecap="round" fill="none"
                      animate={{ d: ['M 9 -18 Q 20 -5 26 10', 'M 9 -18 Q 18 -2 22 12'] }}
                      transition={{ duration: 1.6, repeat: Infinity, repeatType: 'reverse' }}
                    />
                    {/* Left arm for balance */}
                    <path d="M -9 -20 L -20 -13" stroke="#5c3010" strokeWidth="5.5" strokeLinecap="round" fill="none" />
                    {/* Head */}
                    <circle cx="0" cy="-33" r="9.5" fill="#6a3a18" />
                    {/* Turban */}
                    <ellipse cx="0" cy="-40"   rx="12" ry="4.5" fill="#8B1a10" />
                    <ellipse cx="0" cy="-42"   rx="8.5" ry="3"  fill="#a02015" />
                    {/* Turban knot */}
                    <circle  cx="9" cy="-41"   r="2.8"          fill="#8B1a10" />
                    <path d="M 7 -43 Q 10 -45 13 -42" stroke="#c03020" strokeWidth="1" fill="none" opacity="0.7" strokeLinecap="round" />
                  </g>
                </motion.g>
              )}
            </AnimatePresence>
          </motion.g>
        )}

        {/* Horizon mist layer */}
        <rect x="0" y="215" width="700" height="18" fill="rgba(243,162,19,0.025)" />
      </svg>

      {/* Overlay labels */}
      <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end pointer-events-none">
        <motion.div
          className="px-3 py-1.5 rounded-lg"
          style={{ background: 'rgba(5,1,0,0.78)', border: '1px solid rgba(243,162,19,0.2)', backdropFilter: 'blur(8px)' }}
          initial={{ opacity: 0, y: 6 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
        >
          <p className="font-body text-[9px] tracking-[0.22em] uppercase" style={{ color: 'rgba(243,162,19,0.6)' }}>
            Dawn · Lotus Pond · Mithila, Bihar
          </p>
        </motion.div>

        <AnimatePresence>
          {harvesting && (
            <motion.div
              className="px-3 py-1.5 rounded-lg"
              style={{ background: 'rgba(5,1,0,0.78)', border: '1px solid rgba(243,162,19,0.15)', backdropFilter: 'blur(8px)' }}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <p className="font-body text-[9px]" style={{ color: 'rgba(253,251,247,0.5)' }}>
                🪷 Harvesting makhana…
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ── Main Section ── */
export default function CultureBanner() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.08 });

  return (
    <section ref={ref} className="relative overflow-hidden bg-earthen-rust py-0">
      <MadhubaniCorner className="absolute top-0 left-0 w-24 h-24" />
      <MadhubaniCorner className="absolute top-0 right-0 w-24 h-24 rotate-90" />
      <MadhubaniCorner className="absolute bottom-0 left-0 w-24 h-24 -rotate-90" />
      <MadhubaniCorner className="absolute bottom-0 right-0 w-24 h-24 rotate-180" />

      {/* Grain */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E")` }} />
      <div className="absolute right-0 top-0 bottom-0 w-2/3 opacity-10"
        style={{ background: 'radial-gradient(ellipse at 80% 50%, #f3a213 0%, transparent 70%)' }} />

      <div className="max-w-7xl mx-auto px-6 py-20 md:py-28 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* LEFT text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, ease: 'easeOut' }}
          >
            <p className="font-body font-bold text-xs tracking-[0.3em] uppercase text-sun-harvest mb-5">
              Culture &amp; Community
            </p>
            <h2 className="font-display font-bold text-4xl md:text-5xl lg:text-[52px] italic text-ivory-grain leading-[1.12] mb-2">
              &ldquo;Empowering
            </h2>
            <h2 className="font-display font-bold text-4xl md:text-5xl lg:text-[52px] italic text-sun-harvest leading-[1.12] mb-8">
              the hands that harvest.&rdquo;
            </h2>
            <div className="flex items-center gap-3 mb-8">
              <div className="h-px w-12 bg-sun-harvest/40" />
              <span className="text-sun-harvest text-xs">✦</span>
              <div className="h-px w-6 bg-sun-harvest/30" />
            </div>
            <p className="font-body text-base text-ivory-grain/75 leading-[1.9] mb-10 max-w-lg">
              Every pack of NutriTribe supports the Mallah community of Bihar &mdash;
              the custodians of the lotus ponds where India&apos;s finest makhana grows.
              We are not just a snack. We are a movement.
            </p>
            <Link href="/our-story"
              className="inline-flex items-center gap-2 bg-sun-harvest text-white font-body font-bold text-sm px-8 py-4 rounded-full hover:brightness-110 hover:scale-105 transition-all duration-200 tracking-[0.08em] uppercase shadow-product">
              Read Our Story
            </Link>
            <div className="flex gap-8 mt-12 pt-8 border-t border-white/10">
              {[{ val: '10,000+', label: 'Farmers' }, { val: '100%', label: 'Direct Trade' }, { val: '₹ Fair', label: 'Wages' }].map(s => (
                <div key={s.label}>
                  <p className="font-display font-bold text-2xl text-sun-harvest">{s.val}</p>
                  <p className="font-body text-xs text-ivory-grain/50 tracking-widest uppercase mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT: animated scene */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, ease: 'easeOut', delay: 0.15 }}
            className="relative"
          >
            <div style={{ border: '1px solid rgba(243,162,19,0.15)', borderRadius: '1rem', overflow: 'hidden', boxShadow: '0 30px 80px rgba(0,0,0,0.5)' }}>
              <FarmerScene inView={isInView} />
            </div>

            {/* Quote card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="absolute -bottom-5 -left-5 bg-ivory-grain px-5 py-4 rounded-xl shadow-hover max-w-[200px] border border-sun-harvest/15"
            >
              <p className="font-display italic text-earthen-rust text-sm leading-snug">
                &ldquo;A snack that gives back.&rdquo;
              </p>
              <p className="font-body text-[10px] text-earthen-rust/50 mt-2 font-bold tracking-widest uppercase">
                — NutriTribe
              </p>
            </motion.div>
            <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-sun-harvest/20 flex items-center justify-center">
              <span className="text-sun-harvest text-sm">✦</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
