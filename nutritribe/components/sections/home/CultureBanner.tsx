'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import {
  motion, AnimatePresence, useInView,
  useMotionValue, useSpring, useTransform,
  type MotionValue,
} from 'framer-motion';
import Link from 'next/link';

/* ══════════════════════════════════════════════════
   MADHUBANI CORNER
══════════════════════════════════════════════════ */
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

/* ══════════════════════════════════════════════════
   PARALLAX LAYER
══════════════════════════════════════════════════ */
function ParallaxLayer({ mouseX, mouseY, depth, children }: {
  mouseX: MotionValue<number>; mouseY: MotionValue<number>; depth: number; children: React.ReactNode;
}) {
  const x = useSpring(useTransform(mouseX, [-1, 1], [-depth * 30, depth * 30]), { stiffness: 55, damping: 18 });
  const y = useSpring(useTransform(mouseY, [-1, 1], [-depth * 15, depth * 15]), { stiffness: 55, damping: 18 });
  return <motion.g style={{ x, y }}>{children}</motion.g>;
}

/* ══════════════════════════════════════════════════
   WATER LILY FLOWER — purple/violet (Euryale ferox, NOT pink lotus)
══════════════════════════════════════════════════ */
function WaterLilyFlower({ x, y, s = 1, inView, delay = 0 }: {
  x: number; y: number; s?: number; inView: boolean; delay?: number;
}) {
  return (
    <motion.g transform={`translate(${x},${y}) scale(${s})`}
      initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.8, delay }}>
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => (
        <g key={i} transform={`rotate(${a})`}>
          <motion.ellipse cx="0" cy={-9} rx="3.5" ry="8"
            fill={i % 2 === 0 ? '#9b59b6' : '#7c3aed'} opacity="0.88"
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

/* ══════════════════════════════════════════════════
   NARRATIVE TEXT PILL — slides up for each phase
══════════════════════════════════════════════════ */
function NarrativePill({ text, visible }: { text: string; visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="absolute bottom-12 left-1/2 pointer-events-none"
          style={{ transform: 'translateX(-50%)' }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            className="px-5 py-2.5 rounded-full font-body text-[11px] tracking-[0.18em] uppercase whitespace-nowrap"
            style={{
              background: 'rgba(5,1,0,0.82)',
              border: '1px solid rgba(243,162,19,0.28)',
              backdropFilter: 'blur(12px)',
              color: 'rgba(243,162,19,0.88)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            }}
          >
            {text}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ══════════════════════════════════════════════════
   FARMER 2 — "The Wader" (already in pond, collecting)
   Origin at (x, waterline) — upper body only above water
══════════════════════════════════════════════════ */
function WaderFarmer({ inView }: { inView: boolean }) {
  if (!inView) return null;
  return (
    <g>
      {/* Water entry ripple */}
      <motion.ellipse cx="0" cy="0" rx="14" ry="5" fill="none"
        stroke="rgba(120,190,230,0.35)" strokeWidth="1.2"
        animate={{ rx: [12, 32], ry: [4, 10], opacity: [0.5, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, delay: 0 }} />
      {/* Lower body (fades into water — just a hint) */}
      <rect x="-7" y="0" width="14" height="8" fill="#0e2440" fillOpacity="0.55" rx="2" />
      {/* Dhoti */}
      <path d="M -8 -5 C -10 -12 -9 -18 -8 -22 Q 0 -20 8 -22 C 9 -18 10 -12 8 -5 Q 4 -3 0 -3 Q -4 -3 -8 -5 Z"
        fill="#fffdf5" fillOpacity="0.92" />
      {/* Kurta (dark green) */}
      <path d="M -8 -22 Q -9 -30 -8 -38 L 8 -38 Q 9 -30 8 -22 Q 4 -20 0 -20 Q -4 -20 -8 -22 Z"
        fill="#2d5a1e" />
      {/* Right arm — plunging into water */}
      <motion.path d="M 8 -34 C 16 -22 18 -10 16 2"
        stroke="#2d5a1e" strokeWidth="6" strokeLinecap="round" fill="none"
        animate={{ d: ['M 8 -34 C 16 -22 18 -10 16 2', 'M 8 -34 C 14 -20 15 -8 13 4'] }}
        transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }} />
      {/* Left arm — plunging (opposite phase) */}
      <motion.path d="M -8 -34 C -16 -22 -18 -10 -16 2"
        stroke="#2d5a1e" strokeWidth="6" strokeLinecap="round" fill="none"
        animate={{ d: ['M -8 -34 C -16 -22 -18 -10 -16 2', 'M -8 -34 C -14 -18 -12 -6 -10 5'] }}
        transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut', delay: 1 }} />
      {/* Head */}
      <circle cx="0" cy="-46" r="10" fill="#6a3a18" />
      <ellipse cx="-9.5" cy="-45" rx="2.5" ry="3" fill="#5a2e14" />
      {/* Turban — saffron/orange */}
      <ellipse cx="0" cy="-53" rx="12.5" ry="5.5" fill="#e07010" />
      <ellipse cx="0" cy="-55.5" rx="9" ry="4" fill="#f08a20" />
      <path d="M -8 -53 Q 0 -59 8 -53" stroke="#c86010" strokeWidth="1.2" fill="none" opacity="0.45" strokeLinecap="round" />
      <circle cx="10" cy="-52" r="3" fill="#e07010" />
      {/* Sweat drop on forehead (working hard) */}
      <motion.ellipse cx="-3" cy="-42" rx="1.5" ry="2.5" fill="#93c5fd" fillOpacity="0.6"
        animate={{ opacity: [0, 0.7, 0] }} transition={{ duration: 3, repeat: Infinity, delay: 1 }} />
    </g>
  );
}

/* ══════════════════════════════════════════════════
   FARMER 4 — "The Elder" (seated near hut, sorting)
══════════════════════════════════════════════════ */
function ElderFarmer({ inView }: { inView: boolean }) {
  if (!inView) return null;
  return (
    <g>
      {/* Small wooden stool */}
      <rect x="-12" y="0" width="24" height="5" fill="#5c3010" rx="1.5" />
      <rect x="-10" y="5" width="4" height="8" fill="#4a2808" />
      <rect x="6" y="5" width="4" height="8" fill="#4a2808" />
      {/* Flat kulo (bamboo sorting tray) in lap */}
      <ellipse cx="8" cy="-10" rx="14" ry="5" fill="#8B6914" fillOpacity="0.85" />
      <ellipse cx="8" cy="-10" rx="12" ry="3.5" fill="#a07820" fillOpacity="0.5" />
      {/* Makhana seeds on tray */}
      {[[-2,-12],[4,-12],[10,-11],[0,-10],[6,-10]].map(([sx,sy],i) => (
        <circle key={i} cx={sx+8} cy={sy} r="2.2" fill="#ecdfc4" opacity="0.88" />
      ))}
      {/* Legs (seated, knees slightly raised) */}
      <path d="M -8 -2 Q -12 8 -8 14" stroke="#e8d0a4" strokeWidth="7" strokeLinecap="round" fill="none" />
      <path d="M 4 -2 Q 8 8 6 14" stroke="#e8d0a4" strokeWidth="7" strokeLinecap="round" fill="none" />
      {/* Dhoti */}
      <path d="M -9 -2 C -11 4 -10 10 -8 14 Q 0 12 6 14 C 8 10 9 4 7 -2 Q 3 0 0 0 Q -3 0 -9 -2 Z"
        fill="#fdfbf7" fillOpacity="0.88" />
      {/* Torso */}
      <path d="M -8 -2 Q -9 -10 -8 -20 L 8 -20 Q 9 -10 8 -2 Q 4 0 0 0 Q -4 0 -8 -2 Z"
        fill="#f0f0f0" />
      {/* Right arm — sorting motion */}
      <motion.path d="M 8 -16 C 18 -12 22 -8 20 -4"
        stroke="#f0f0f0" strokeWidth="5.5" strokeLinecap="round" fill="none"
        animate={{ d: ['M 8 -16 C 18 -12 22 -8 20 -4', 'M 8 -16 C 16 -10 18 -4 16 0'] }}
        transition={{ duration: 2.5, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }} />
      {/* Left arm — resting on tray edge */}
      <path d="M -8 -16 C -16 -10 -16 -6 -14 -4" stroke="#f0f0f0" strokeWidth="5.5" strokeLinecap="round" fill="none" />
      {/* Head */}
      <circle cx="0" cy="-30" r="10" fill="#6a3a18" />
      <ellipse cx="-9.5" cy="-29" rx="2.5" ry="3" fill="#5a2e14" />
      {/* Turban — grey (elder) */}
      <ellipse cx="0" cy="-37" rx="12.5" ry="5.5" fill="#888888" />
      <ellipse cx="0" cy="-39.5" rx="9" ry="4" fill="#999999" />
      <path d="M -8 -37 Q 0 -43 8 -37" stroke="#777" strokeWidth="1.2" fill="none" opacity="0.4" strokeLinecap="round" />
      <circle cx="10" cy="-36" r="3" fill="#888888" />
    </g>
  );
}

/* ══════════════════════════════════════════════════
   MAIN SCENE — 4 farmers, 8-layer parallax
══════════════════════════════════════════════════ */
type FarmerPhase = 'idle' | 'walking' | 'at-pond' | 'harvesting';

function CinematicFarmerScene({ inView }: { inView: boolean }) {
  const [phase, setPhase] = useState<FarmerPhase>('idle');
  const [farmer3Walking, setFarmer3Walking] = useState(false);
  const [farmer3Arrived, setFarmer3Arrived] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  const onMouseMove = useCallback((e: MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    rawX.set((e.clientX - rect.left - rect.width  / 2) / (rect.width  / 2));
    rawY.set((e.clientY - rect.top  - rect.height / 2) / (rect.height / 2));
  }, [rawX, rawY]);

  const onMouseLeave = useCallback(() => { rawX.set(0); rawY.set(0); }, [rawX, rawY]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener('mousemove', onMouseMove);
    el.addEventListener('mouseleave', onMouseLeave);
    return () => { el.removeEventListener('mousemove', onMouseMove); el.removeEventListener('mouseleave', onMouseLeave); };
  }, [onMouseMove, onMouseLeave]);

  useEffect(() => {
    if (!inView) return;
    const t1 = setTimeout(() => setPhase('walking'),    350);
    const t2 = setTimeout(() => setFarmer3Walking(true),  1600);
    const t3 = setTimeout(() => setPhase('at-pond'),    5400);
    const t4 = setTimeout(() => setFarmer3Arrived(true), 5900);
    const t5 = setTimeout(() => setPhase('harvesting'), 6100);
    return () => { [t1,t2,t3,t4,t5].forEach(clearTimeout); };
  }, [inView]);

  const isWalking  = phase === 'walking';
  const atPond     = phase === 'at-pond' || phase === 'harvesting';
  const harvesting = phase === 'harvesting';
  const birds = [[148,54],[228,42],[338,66],[458,46]];

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden rounded-2xl" style={{ minHeight: 340 }}>
      <svg viewBox="0 0 700 380" fill="none" style={{ display: 'block', width: '100%' }}>
        <defs>
          {/* Sky phases */}
          <linearGradient id="sky-night" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#04060e" />
            <stop offset="40%"  stopColor="#0a0e22" />
            <stop offset="75%"  stopColor="#1a1030" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#220c04" stopOpacity="0.4" />
          </linearGradient>
          <linearGradient id="sky-purple" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#060408" />
            <stop offset="35%"  stopColor="#180820" />
            <stop offset="68%"  stopColor="#5a1510" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#8a2608" stopOpacity="0.55" />
          </linearGradient>
          <linearGradient id="sky-dawn" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#0e0403" />
            <stop offset="32%"  stopColor="#2c0c04" />
            <stop offset="62%"  stopColor="#7a2008" stopOpacity="0.92" />
            <stop offset="100%" stopColor="#f3a213" stopOpacity="0.55" />
          </linearGradient>
          {/* Ground */}
          <linearGradient id="fc-gnd" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#3a5814" />
            <stop offset="100%" stopColor="#1a2e06" />
          </linearGradient>
          {/* Pond */}
          <radialGradient id="fc-pond" cx="45%" cy="38%" r="60%">
            <stop offset="0%"   stopColor="#1a3a5e" />
            <stop offset="100%" stopColor="#080f1e" />
          </radialGradient>
          {/* Lantern glow */}
          <radialGradient id="fc-lantern" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#f3a213" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#f3a213" stopOpacity="0" />
          </radialGradient>
          {/* Wader water clip */}
          <clipPath id="wader-clip">
            <rect x="-30" y="-70" width="60" height="70" />
          </clipPath>
          {/* Scene boundary clip */}
          <clipPath id="scene-clip">
            <rect width="700" height="380" />
          </clipPath>
        </defs>

        <g clipPath="url(#scene-clip)">

          {/* ── LAYER 0: SKY ── */}
          <ParallaxLayer mouseX={rawX} mouseY={rawY} depth={0.02}>
            {/* Night sky */}
            <motion.rect width="700" height="228" fill="url(#sky-night)"
              animate={{ opacity: phase === 'idle' ? 1 : 0 }} transition={{ duration: 3 }} />
            {/* Purple pre-dawn */}
            <motion.rect width="700" height="228" fill="url(#sky-purple)"
              initial={{ opacity: 0 }}
              animate={{ opacity: phase === 'walking' ? 1 : 0 }} transition={{ duration: 3 }} />
            {/* Golden dawn */}
            <motion.rect width="700" height="228" fill="url(#sky-dawn)"
              initial={{ opacity: 0 }}
              animate={{ opacity: atPond || harvesting ? 1 : 0 }} transition={{ duration: 3 }} />

            {/* Rising sun */}
            <motion.g animate={harvesting ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }} transition={{ duration: 2.5 }}>
              <circle cx="90" cy="220" r="13" fill="#f3a213" opacity="0.88" />
              <circle cx="90" cy="220" r="30" fill="#f3a213" fillOpacity="0.2" />
              <circle cx="90" cy="220" r="55" fill="#f3a213" fillOpacity="0.08" />
            </motion.g>

            {/* Crescent moon */}
            <motion.g animate={atPond ? { opacity: 0 } : { opacity: 1 }} transition={{ duration: 2 }}>
              <circle cx="620" cy="36" r="13" fill="#d4c87a" opacity="0.88" />
              <circle cx="626" cy="33" r="10.5" fill="#04060e" />
            </motion.g>

            {/* Milky way star band + scattered stars */}
            {[
              [50,28],[92,18],[155,12],[210,30],[265,8],[322,22],[390,16],[445,36],[498,10],[558,28],[612,14],[648,40],
              [128,48],[280,45],[420,52],[540,42],[68,55],[198,40],[338,18],[475,44],[582,32],[680,22],
            ].map(([x,y],i)=>(
              <motion.circle key={i} cx={x} cy={y} r={i%4===0?1.8:1.2} fill="white"
                animate={inView ? { opacity: atPond ? [0.05,0.02] : [0.65,0.10,0.65] } : { opacity:0 }}
                transition={{ duration: 2.5+i%5*0.5, repeat: Infinity, delay: i*0.28 }} />
            ))}

            {/* Fireflies (idle/pre-dawn only) */}
            {inView && !atPond && [[218,192],[330,176],[470,184],[525,194],[375,170],[660,182],[145,200]].map(([x,y],i)=>(
              <motion.circle key={i} cx={x} cy={y} r="1.8" fill="#f3a213"
                animate={{ opacity:[0,0.9,0], x:[0,i%2===0?5:-5,0], y:[0,-7,0] }}
                transition={{ duration:2.8+i*0.5, repeat:Infinity, delay:i*0.62 }} />
            ))}
          </ParallaxLayer>

          {/* ── LAYER 1: DISTANT HORIZON ── */}
          <ParallaxLayer mouseX={rawX} mouseY={rawY} depth={0.06}>
            <path d="M0 232 Q120 194 240 212 Q360 228 480 194 Q600 158 720 192 L720 232 Z" fill="#1e3008" opacity="0.85" />
            {/* Temple dome (far left) */}
            <g opacity="0.32">
              <rect x="30" y="196" width="22" height="26" fill="#1a2808" />
              <path d="M 26 196 L 41 180 L 56 196 Z" fill="#1a2808" />
              <circle cx="41" cy="178" r="3.5" fill="#1a2808" />
            </g>
          </ParallaxLayer>

          {/* ── LAYER 2: HILLS + PADDY ── */}
          <ParallaxLayer mouseX={rawX} mouseY={rawY} depth={0.12}>
            <path d="M280 232 Q400 210 520 218 Q610 220 700 218 L700 232 Z" fill="#244a10" opacity="0.40" />
            {[0,1,2,3].map(i => (
              <path key={i} d={`M${320+i*18} 232 Q${420+i*18} ${217+i*2} ${520+i*18} 224`}
                stroke="#2a5010" strokeWidth="1.2" fill="none" strokeOpacity="0.22" />
            ))}
          </ParallaxLayer>

          {/* ── LAYER 3: DISTANT HUTS ── */}
          <ParallaxLayer mouseX={rawX} mouseY={rawY} depth={0.22}>
            {[[618,212,26,20],[650,210,18,15]].map(([x,y,w,h],i)=>(
              <g key={i} opacity="0.28">
                <rect x={x} y={y} width={w} height={h} fill="#3a1a08" rx="1"/>
                <polygon points={`${x-2},${y} ${x+w/2},${y-12} ${x+w+2},${y}`} fill="#2a1008"/>
              </g>
            ))}
          </ParallaxLayer>

          {/* ── LAYER 4: HUT COMPLEX + GROUND ── */}
          <ParallaxLayer mouseX={rawX} mouseY={rawY} depth={0.34}>
            <path d="M0 228 Q175 220 350 224 Q520 228 700 222 L700 380 L0 380 Z" fill="url(#fc-gnd)" />
            <path d="M350 228 Q450 207 570 214 Q640 220 700 220 L700 228 Z" fill="#2a4810" opacity="0.42" />
            {inView && (
              <motion.rect x="0" y="220" width="700" height="18" fill="rgba(220,200,170,0.055)"
                animate={{ opacity:[0.4,0.9,0.4], x:[-5,5,-5] }} transition={{ duration:9, repeat:Infinity }} />
            )}
            {/* Dirt path */}
            <path d="M590 233 Q420 238 268 244 Q172 247 112 260"
              stroke="#8a6520" strokeWidth="9" opacity="0.25" fill="none" strokeLinecap="round" />
            {/* Background trees */}
            {[[308,208,11],[346,204,9],[382,207,10],[415,210,8]].map(([x,y,r],i)=>(
              <g key={i} opacity="0.40"><rect x={x-2} y={y+r*0.7} width="4" height={r*0.8} fill="#3a2808"/><circle cx={x} cy={y} r={r} fill="#1a4a08"/></g>
            ))}
            {/* Main hut */}
            <g>
              <rect x="528" y="178" width="66" height="52" fill="#8b5a2a" rx="2" />
              <polygon points="518,180 562,144 614,180" fill="#7a4818" />
              <polygon points="522,180 562,148 610,180" fill="#9a6228" />
              {[528,540,552,564,576,588].map((x,i)=>(
                <line key={i} x1={x} y1="180" x2={562-(i-2.5)*2} y2="150" stroke="#6a3808" strokeWidth="1" opacity="0.26" />
              ))}
              <rect x="551" y="196" width="17" height="34" fill="#3a1e08" rx="1.5" />
              <circle cx="566" cy="213" r="1.8" fill="#D4AF37" opacity="0.7" />
              <rect x="532" y="187" width="13" height="11" fill="#101828" rx="1" opacity="0.9" />
              {inView && (
                <motion.rect x="532" y="187" width="13" height="11" rx="1" fill="#f3a213"
                  animate={{ opacity:[0.5,0.95,0.6,0.88,0.5] }} transition={{ duration:2.5, repeat:Infinity }} />
              )}
              <line x1="538" y1="187" x2="538" y2="198" stroke="#D4AF37" strokeWidth="0.6" opacity="0.28" />
              {inView && [0,1,2].map(i=>(
                <motion.circle key={i} cx={562+(i-1)*2} cy={144} r={3}
                  fill="rgba(200,180,160,0.38)"
                  initial={{ y:0, opacity:0, r:3 }}
                  animate={{ y:[0,-22,-44], opacity:[0,0.3,0], r:[3,5.5,9] }}
                  transition={{ duration:3.5, repeat:Infinity, delay:i*1.1, ease:'easeOut' }} />
              ))}
            </g>
            {/* Adjacent hut */}
            <g>
              <rect x="596" y="194" width="44" height="36" fill="#7a4e22" rx="2" />
              <polygon points="590,196 620,170 652,196" fill="#5a3810" />
              <polygon points="594,196 620,174 648,196" fill="#7a4e18" />
            </g>
            {/* Trees beside hut */}
            {[[624,210,13],[648,206,10],[668,212,9]].map(([x,y,r],i)=>(
              <g key={i}><rect x={x-2.5} y={y+r*0.65} width="5" height={r*1.1} fill="#4a3210"/><circle cx={x} cy={y} r={r} fill="#1a5a0a" opacity="0.88"/></g>
            ))}

            {/* FARMER 4 "The Elder" — near hut entrance, seated sorting */}
            {inView && (
              <g transform="translate(545, 236)">
                <ElderFarmer inView={inView} />
              </g>
            )}
          </ParallaxLayer>

          {/* ── LAYER 5: POND BANK ── */}
          <ParallaxLayer mouseX={rawX} mouseY={rawY} depth={0.50}>
            {[[22,295],[36,290],[50,296]].map(([x,y],i)=>(
              <motion.path key={i}
                d={`M ${x} ${y} Q ${x+2} ${y-20} ${x} ${y-32}`}
                stroke="#2a6a10" strokeWidth="2.8" strokeLinecap="round" fill="none"
                animate={{ d:[`M ${x} ${y} Q ${x+2} ${y-20} ${x} ${y-32}`,`M ${x} ${y} Q ${x+6} ${y-18} ${x+4} ${y-30}`] }}
                transition={{ duration:2.2+i*0.3, repeat:Infinity, repeatType:'reverse', ease:'easeInOut' }} />
            ))}
          </ParallaxLayer>

          {/* ── LAYER 6: LOTUS POND ── */}
          <ParallaxLayer mouseX={rawX} mouseY={rawY} depth={0.65}>
            <ellipse cx="130" cy="308" rx="118" ry="50" fill="url(#fc-pond)" opacity="0.96" />
            <ellipse cx="130" cy="300" rx="110" ry="38" fill="#0e2440" opacity="0.62" />
            {/* Dawn reflections */}
            <motion.ellipse cx="130" cy="302" rx="90" ry="30" fill="rgba(243,162,19,0.12)"
              animate={atPond ? { opacity:1 } : { opacity:0 }} transition={{ duration:2.5 }} />
            {/* Caustic light */}
            {inView && [0,1,2,3,4,5].map(i=>(
              <motion.path key={i}
                d={`M ${55+i*26} 300 Q ${65+i*26} 293 ${75+i*26} 300`}
                stroke="rgba(255,240,180,0.30)" strokeWidth="1" fill="none"
                animate={{ d:[`M ${55+i*26} 300 Q ${65+i*26} 293 ${75+i*26} 300`,`M ${55+i*26} 300 Q ${65+i*26} 307 ${75+i*26} 300`] }}
                transition={{ duration:1.8+i*0.3, repeat:Infinity, repeatType:'reverse', ease:'easeInOut' }} />
            ))}
            {/* Pond mist */}
            {inView && (
              <motion.ellipse cx="130" cy="272" rx="82" ry="16" fill="rgba(200,200,220,0.06)"
                animate={{ opacity:[0.3,0.7,0.3], scaleX:[0.9,1.1,0.9] }} transition={{ duration:6.5, repeat:Infinity }} />
            )}
            {/* Water shimmer */}
            {inView && [55,92,130,168,205].map((x,i)=>(
              <motion.line key={i} x1={x} y1={308} x2={x+20} y2={308}
                stroke="#2a5a8a" strokeWidth="1.5" opacity="0.28" strokeLinecap="round"
                animate={{ opacity:[0.12,0.48,0.12] }} transition={{ duration:2.8, repeat:Infinity, delay:i*0.48 }} />
            ))}
            {/* Harvesting ripples */}
            {inView && harvesting && [0,1,2].map(i=>(
              <motion.ellipse key={i} cx="105" cy="295" fill="none"
                stroke="rgba(120,190,230,0.35)" strokeWidth="1"
                initial={{ rx:8, ry:3, opacity:0.6 }}
                animate={{ rx:[8+i*12,40+i*18], ry:[3+i*3,12+i*5], opacity:[0.5,0] }}
                transition={{ duration:2.8, repeat:Infinity, delay:i*0.85 }} />
            ))}
            {/* Lily pads */}
            {[[60,302,16],[104,292,20],[150,298,16],[188,308,13],[74,316,11],[136,315,13]].map(([x,y,r],i)=>(
              <motion.g key={i} animate={inView?{y:[0,0.5,0]}:{}} transition={{ duration:3+i*0.4, repeat:Infinity, ease:'easeInOut', delay:i*0.3 }}>
                <ellipse cx={x} cy={y} rx={r} ry={r*0.38} fill="#1a7a12" opacity="0.82" />
              </motion.g>
            ))}
            {/* Stems */}
            <line x1="68" y1="298" x2="68" y2="265" stroke="#009846" strokeWidth="2.5" />
            <line x1="118" y1="290" x2="118" y2="252" stroke="#009846" strokeWidth="2.5" />
            <line x1="168" y1="294" x2="168" y2="262" stroke="#009846" strokeWidth="2.5" />
            {/* Water lily flowers — PURPLE, not pink */}
            <WaterLilyFlower x={68}  y={260} s={0.85} inView={inView} delay={0.4} />
            <WaterLilyFlower x={118} y={246} s={1.1}  inView={inView} delay={0.6} />
            <WaterLilyFlower x={168} y={256} s={0.8}  inView={inView} delay={0.8} />
            {/* Spiky makhana seed pods */}
            {inView && [[90,280],[148,268],[182,278]].map(([px,py],i)=>(
              <g key={i}>
                <line x1={px} y1={py} x2={px} y2={py+14} stroke="#2d5a1e" strokeWidth="1.8" />
                <motion.circle cx={px} cy={py} r="5" fill="#2d5a1e"
                  animate={{ r:[4.5,5.5,4.5] }} transition={{ duration:3+i, repeat:Infinity, ease:'easeInOut', delay:i*0.8 }} />
                {/* Spiky protrusions */}
                {[0,45,90,135,180,225,270,315].map((a,j)=>(
                  <line key={j}
                    x1={px+4*Math.cos(a*Math.PI/180)} y1={py+4*Math.sin(a*Math.PI/180)}
                    x2={px+7*Math.cos(a*Math.PI/180)} y2={py+7*Math.sin(a*Math.PI/180)}
                    stroke="#1a4a0a" strokeWidth="0.8" strokeLinecap="round" />
                ))}
              </g>
            ))}
            {/* Makhana seeds rising during harvest */}
            {inView && harvesting && [0,1,2,3,4].map(i=>(
              <motion.g key={i} transform={`translate(${82+i*20}, 288)`}>
                <motion.ellipse cx="0" cy="4" rx="2" ry="3" fill="rgba(100,160,220,0.4)"
                  initial={{ y:0, opacity:0 }} animate={{ y:[0,10,20], opacity:[0.6,0.3,0] }}
                  transition={{ duration:2.4, delay:i*0.4, repeat:Infinity, repeatDelay:3.5 }} />
                <motion.circle r="6" fill="#ecdfc4"
                  initial={{ y:0, opacity:0, scale:0.3 }} animate={{ y:[0,-26-i*10], opacity:[0,1,0.7,0], scale:[0.3,1,0.9] }}
                  transition={{ duration:2.4, delay:i*0.4, repeat:Infinity, repeatDelay:3.5 }} />
              </motion.g>
            ))}

            {/* FARMER 2 "The Wader" — static in pond, clipped at waterline */}
            <AnimatePresence>
              {inView && isWalking && (
                <motion.g transform="translate(165, 270)" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}>
                  <WaderFarmer inView={inView} />
                </motion.g>
              )}
              {inView && atPond && (
                <motion.g transform="translate(165, 270)" initial={{ opacity:1 }} animate={{ opacity:1 }}>
                  <WaderFarmer inView={inView} />
                </motion.g>
              )}
            </AnimatePresence>
          </ParallaxLayer>

          {/* ── LAYER 7: FARMERS 1 + 3 (walking) + BIRDS ── */}
          <ParallaxLayer mouseX={rawX} mouseY={rawY} depth={0.82}>
            {/* Birds during walking */}
            {birds.map(([bx,by],bi)=>(
              <motion.g key={`bird-${bi}`}
                animate={isWalking ? { opacity:[0,0.7,0.5,0] } : { opacity:0 }}
                transition={{ duration:8, repeat:Infinity, delay:bi*1.4 }}>
                <motion.path d={`M ${bx} ${by} Q ${bx-5} ${by-4} ${bx-10} ${by-2}`}
                  stroke="#b0c0d8" strokeWidth="1.5" strokeLinecap="round" fill="none"
                  animate={isWalking?{d:[`M ${bx} ${by} Q ${bx-5} ${by-4} ${bx-10} ${by-2}`,`M ${bx} ${by} Q ${bx-5} ${by+2} ${bx-10} ${by+1}`]}:{}}
                  transition={{ duration:0.55, repeat:Infinity, repeatType:'reverse', delay:bi*0.2 }} />
                <motion.path d={`M ${bx} ${by} Q ${bx+5} ${by-4} ${bx+10} ${by-2}`}
                  stroke="#b0c0d8" strokeWidth="1.5" strokeLinecap="round" fill="none"
                  animate={isWalking?{d:[`M ${bx} ${by} Q ${bx+5} ${by-4} ${bx+10} ${by-2}`,`M ${bx} ${by} Q ${bx+5} ${by+2} ${bx+10} ${by+1}`]}:{}}
                  transition={{ duration:0.55, repeat:Infinity, repeatType:'reverse', delay:bi*0.2 }} />
              </motion.g>
            ))}

            {/* FARMER 1 "The Walker" — red turban, brown kurta */}
            {inView && phase !== 'idle' && (
              <motion.g
                initial={{ x:570, y:230 }}
                animate={isWalking ? { x:[570,108], y:[230,252] } : { x:108, y:252 }}
                transition={isWalking ? { duration:4.8, ease:'linear' } : { duration:0 }}
              >
                <ellipse cx="0" cy="2" rx="12" ry="3.5" fill="rgba(0,0,0,0.25)" />
                <AnimatePresence>
                  {!atPond && (
                    <motion.g initial={{ opacity:1 }} exit={{ opacity:0 }} transition={{ duration:0.4 }}>
                      <motion.div className="absolute"/>
                      {/* Ground light from lantern */}
                      <motion.ellipse cx="22" cy="0" rx="16" ry="6" fill="rgba(243,162,19,0.12)"
                        animate={{ rx:[14,18,14], opacity:[0.7,1,0.7] }} transition={{ duration:1.5, repeat:Infinity }} />
                      {/* Dhoti */}
                      <path d="M -9 -28 C -11 -20 -11 -14 -9 -8 Q -4 -6 0 -6 Q 4 -6 9 -8 C 11 -14 11 -20 9 -28 Q 5 -26 0 -26 Q -5 -26 -9 -28 Z" fill="#e8d0a4" />
                      {/* Legs */}
                      <motion.path d="M -4 -8 C -7 -4 -7 -1 -6 2" stroke="#e8d0a4" strokeWidth="7" strokeLinecap="round" fill="none"
                        animate={{ d:['M -4 -8 C -7 -4 -7 -1 -6 2','M -4 -8 C -2 -4 -2 -1 -3 2'] }}
                        transition={{ duration:0.48, repeat:Infinity, repeatType:'reverse' }} />
                      <motion.path d="M 4 -8 C 2 -4 2 -1 3 2" stroke="#e8d0a4" strokeWidth="7" strokeLinecap="round" fill="none"
                        animate={{ d:['M 4 -8 C 2 -4 2 -1 3 2','M 4 -8 C 7 -4 7 -1 6 2'] }}
                        transition={{ duration:0.48, repeat:Infinity, repeatType:'reverse', delay:0.24 }} />
                      {/* Kurta */}
                      <path d="M -9 -28 Q -10 -36 -9 -44 L 9 -44 Q 10 -36 9 -28 Q 5 -26 0 -26 Q -5 -26 -9 -28 Z" fill="#5c3010" />
                      {/* Left arm */}
                      <motion.path d="M -9 -40 C -18 -32 -20 -20 -20 -8" stroke="#5c3010" strokeWidth="6" strokeLinecap="round" fill="none"
                        animate={{ d:['M -9 -40 C -18 -32 -20 -20 -20 -8','M -9 -40 C -14 -28 -14 -16 -12 -4'] }}
                        transition={{ duration:0.48, repeat:Infinity, repeatType:'reverse' }} />
                      <motion.circle cx="-20" cy="-8" r="3.5" fill="#6a3a18"
                        animate={{ cx:[-20,-12], cy:[-8,-4] }} transition={{ duration:0.48, repeat:Infinity, repeatType:'reverse' }} />
                      {/* Right arm with lantern */}
                      <motion.path d="M 9 -40 C 18 -32 20 -22 20 -10" stroke="#5c3010" strokeWidth="6" strokeLinecap="round" fill="none"
                        animate={{ d:['M 9 -40 C 18 -32 20 -22 20 -10','M 9 -40 C 14 -28 15 -16 13 -4'] }}
                        transition={{ duration:0.48, repeat:Infinity, repeatType:'reverse', delay:0.24 }} />
                      <motion.circle cx="20" cy="-10" r="11" fill="url(#fc-lantern)"
                        animate={{ opacity:[0.55,1,0.55], r:[10,14,10] }} transition={{ duration:1.4, repeat:Infinity }} />
                      <motion.rect x="17" y="-14" width="7" height="8" rx="1.8" fill="#f3a213"
                        animate={{ opacity:[0.7,1,0.75,0.95,0.7] }} transition={{ duration:1.8, repeat:Infinity }} />
                      {/* Head with bounce */}
                      <motion.g animate={{ y:[0,-2.5,0] }} transition={{ duration:0.48, repeat:Infinity }}>
                        <circle cx="0" cy="-58" r="10.5" fill="#6a3a18" />
                        <ellipse cx="-10" cy="-57" rx="2.5" ry="3.2" fill="#5a2e14" />
                        {/* RED turban */}
                        <ellipse cx="0" cy="-65" rx="13" ry="5.8" fill="#8B1a10" />
                        <ellipse cx="0" cy="-67.5" rx="9.5" ry="4" fill="#a02015" />
                        <path d="M -8 -65 Q 0 -71 8 -65" stroke="#c03020" strokeWidth="1.2" fill="none" opacity="0.45" strokeLinecap="round" />
                        <circle cx="10" cy="-64" r="3.2" fill="#8B1a10" />
                        <motion.path d="M 10 -64 Q 15 -56 13 -48 Q 11 -42 14 -35"
                          stroke="#8B1a10" strokeWidth="2.8" fill="none" strokeLinecap="round"
                          animate={{ d:['M 10 -64 Q 15 -56 13 -48 Q 11 -42 14 -35','M 10 -64 Q 17 -56 15 -48 Q 13 -42 16 -35'] }}
                          transition={{ duration:1.2, repeat:Infinity, repeatType:'reverse', ease:'easeInOut' }} />
                        {/* Basket */}
                        <ellipse cx="0" cy="-73" rx="8.5" ry="3.8" fill="#8B6914" opacity="0.92" />
                        <path d="M -6 -73 Q 0 -79 6 -73" stroke="#a07820" strokeWidth="2.8" fill="none" />
                        {[[-3,-76],[0,-77],[3,-76]].map(([sx,sy],i)=>(
                          <circle key={i} cx={sx} cy={sy} r="2.5" fill="#ecdfc4" opacity="0.88" />
                        ))}
                      </motion.g>
                    </motion.g>
                  )}
                </AnimatePresence>
                {/* Harvesting pose */}
                <AnimatePresence>
                  {atPond && (
                    <motion.g initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ duration:0.6 }}>
                      <path d="M -5 0 L -7 -26" stroke="#e8d0a4" strokeWidth="7.5" strokeLinecap="round" fill="none" />
                      <path d="M 5 0 L 8 -26" stroke="#e8d0a4" strokeWidth="7.5" strokeLinecap="round" fill="none" />
                      <path d="M -9 -26 C -11 -20 -10 -14 -8 -8 Q -4 -6 0 -6 Q 4 -6 8 -8 C 10 -14 11 -20 9 -26 Q 5 -24 0 -24 Q -5 -24 -9 -26 Z" fill="#e8d0a4" />
                      <g transform="rotate(38, 0, -26)">
                        <path d="M -9 -26 Q -10 -34 -9 -44 L 9 -44 Q 10 -34 9 -26 Q 5 -24 0 -24 Q -5 -24 -9 -26 Z" fill="#5c3010" />
                        <motion.path d="M 9 -38 Q 18 -22 24 -5 Q 26 4 28 14"
                          stroke="#5c3010" strokeWidth="6" strokeLinecap="round" fill="none"
                          animate={{ d:['M 9 -38 Q 18 -22 24 -5 Q 26 4 28 14','M 9 -38 Q 16 -20 22 -3 Q 23 6 25 16'] }}
                          transition={{ duration:1.6, repeat:Infinity, repeatType:'reverse' }} />
                        <path d="M -9 -38 L -22 -30" stroke="#5c3010" strokeWidth="5.5" strokeLinecap="round" fill="none" />
                        <circle cx="0" cy="-56" r="10.5" fill="#6a3a18" />
                        <ellipse cx="0" cy="-63" rx="13" ry="5.5" fill="#8B1a10" />
                        <ellipse cx="0" cy="-65.5" rx="9.5" ry="3.8" fill="#a02015" />
                        <circle cx="10" cy="-62" r="3.2" fill="#8B1a10" />
                      </g>
                    </motion.g>
                  )}
                </AnimatePresence>
              </motion.g>
            )}

            {/* FARMER 3 "The Carrier" — blue kurta, walks from right */}
            {inView && farmer3Walking && (
              <motion.g
                initial={{ x:685, y:232 }}
                animate={farmer3Arrived ? { x:335, y:248 } : { x:[685,335], y:[232,248] }}
                transition={!farmer3Arrived ? { duration:3.8, ease:'linear' } : { duration:0 }}
              >
                <ellipse cx="0" cy="2" rx="11" ry="3" fill="rgba(0,0,0,0.22)" />
                {/* Dhoti */}
                <path d="M -8 -26 C -10 -18 -10 -12 -8 -6 Q -4 -4 0 -4 Q 4 -4 8 -6 C 10 -12 10 -18 8 -26 Q 5 -24 0 -24 Q -5 -24 -8 -26 Z" fill="#fdfbf7" fillOpacity="0.9" />
                {/* Legs walking */}
                <motion.path d="M -4 -6 C -7 -2 -7 1 -6 4" stroke="#e8d0a4" strokeWidth="7" strokeLinecap="round" fill="none"
                  animate={{ d:['M -4 -6 C -7 -2 -7 1 -6 4','M -4 -6 C -2 -2 -2 1 -3 4'] }}
                  transition={{ duration:0.48, repeat:Infinity, repeatType:'reverse', delay:0.12 }} />
                <motion.path d="M 4 -6 C 2 -2 2 1 3 4" stroke="#e8d0a4" strokeWidth="7" strokeLinecap="round" fill="none"
                  animate={{ d:['M 4 -6 C 2 -2 2 1 3 4','M 4 -6 C 7 -2 7 1 6 4'] }}
                  transition={{ duration:0.48, repeat:Infinity, repeatType:'reverse', delay:0.36 }} />
                {/* Blue kurta */}
                <path d="M -8 -26 Q -9 -34 -8 -42 L 8 -42 Q 9 -34 8 -26 Q 5 -24 0 -24 Q -5 -24 -8 -26 Z" fill="#1e3a6e" />
                {/* Arms (balance) */}
                <motion.path d="M -8 -38 C -16 -30 -18 -20 -16 -8" stroke="#1e3a6e" strokeWidth="6" strokeLinecap="round" fill="none"
                  animate={{ d:['M -8 -38 C -16 -30 -18 -20 -16 -8','M -8 -38 C -13 -26 -13 -14 -10 -4'] }}
                  transition={{ duration:0.48, repeat:Infinity, repeatType:'reverse', delay:0.12 }} />
                <motion.path d="M 8 -38 C 16 -30 18 -20 16 -8" stroke="#1e3a6e" strokeWidth="6" strokeLinecap="round" fill="none"
                  animate={{ d:['M 8 -38 C 16 -30 18 -20 16 -8','M 8 -38 C 13 -26 13 -14 10 -4'] }}
                  transition={{ duration:0.48, repeat:Infinity, repeatType:'reverse', delay:0.36 }} />
                {/* Head with bounce */}
                <motion.g animate={{ y:[0,-2.5,0] }} transition={{ duration:0.48, repeat:Infinity }}>
                  <circle cx="0" cy="-52" r="10" fill="#6a3a18" />
                  <ellipse cx="-9.5" cy="-51" rx="2.5" ry="3" fill="#5a2e14" />
                  {/* WHITE turban */}
                  <ellipse cx="0" cy="-59" rx="12.5" ry="5.5" fill="#ddd8cc" />
                  <ellipse cx="0" cy="-61.5" rx="9" ry="4" fill="#f0ece4" />
                  <circle cx="9.5" cy="-58" r="3" fill="#ddd8cc" />
                  {/* Large basket (overflowing with makhana) */}
                  <ellipse cx="0" cy="-68" rx="11" ry="5" fill="#8B6914" opacity="0.9" />
                  {/* Basket sides */}
                  <path d="M -8 -68 Q -10 -78 -8 -82 Q 0 -84 8 -82 Q 10 -78 8 -68" fill="#7a5a12" fillOpacity="0.8" />
                  <path d="M -9 -68 Q 0 -75 9 -68" stroke="#a07820" strokeWidth="2.5" fill="none" />
                  {/* Overflowing makhana balls */}
                  {[[-4,-80],[-1,-83],[3,-80],[6,-78],[-6,-76],[0,-77],[5,-75]].map(([sx,sy],i)=>(
                    <circle key={i} cx={sx} cy={sy} r="2.8" fill="#ecdfc4" opacity="0.90" />
                  ))}
                </motion.g>
              </motion.g>
            )}
          </ParallaxLayer>

          {/* ── LAYER 8: FOREGROUND REEDS ── */}
          <ParallaxLayer mouseX={rawX} mouseY={rawY} depth={1.0}>
            {[[222,295],[236,290],[250,294],[18,298],[34,293],[48,297]].map(([x,y],i)=>(
              <motion.path key={i}
                d={`M ${x} ${y} Q ${x+2} ${y-22} ${x} ${y-34}`}
                stroke="#2a6a10" strokeWidth="3" strokeLinecap="round" fill="none"
                animate={{ d:[`M ${x} ${y} Q ${x+2} ${y-22} ${x} ${y-34}`,`M ${x} ${y} Q ${x+7} ${y-20} ${x+4} ${y-32}`] }}
                transition={{ duration:2.2+i*0.3, repeat:Infinity, repeatType:'reverse', ease:'easeInOut' }} />
            ))}
            {/* Sunrise horizon strip */}
            <motion.rect x="0" y="221" width="700" height="6" fill="rgba(243,162,19,0.05)"
              animate={harvesting ? { opacity:1 } : { opacity:0 }} transition={{ duration:2.5 }} />
          </ParallaxLayer>

        </g>{/* scene clip */}

        {/* Location label */}
        <foreignObject x="8" y="338" width="250" height="36">
          <motion.div initial={{ opacity:0, y:6 }} animate={inView ? { opacity:1, y:0 } : {}} transition={{ delay:0.8 }}>
            <div style={{ background:'rgba(5,1,0,0.78)', border:'1px solid rgba(243,162,19,0.2)', backdropFilter:'blur(8px)', borderRadius:'8px', padding:'4px 10px', display:'inline-block' }}>
              <p style={{ fontFamily:'sans-serif', fontSize:'9px', letterSpacing:'0.22em', textTransform:'uppercase', color:'rgba(243,162,19,0.62)', margin:0 }}>
                Dawn · Lily Pond · Mithila, Bihar
              </p>
            </div>
          </motion.div>
        </foreignObject>
      </svg>

      {/* Narrative text pills — appear by phase */}
      <NarrativePill text="4:00 AM — Before the sun, the Mallahs are already moving." visible={isWalking} />
      <NarrativePill text="Every seed is handpicked from the pond floor. No machines." visible={atPond && !harvesting} />
      <NarrativePill text="🌿 Harvesting makhana… Bihar, India" visible={harvesting} />
    </div>
  );
}

/* ══════════════════════════════════════════════════
   CULTURE BANNER EXPORT
══════════════════════════════════════════════════ */
export default function CultureBanner() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.08 });

  return (
    <section ref={ref} className="relative overflow-hidden bg-earthen-rust py-0">
      <MadhubaniCorner className="absolute top-0 left-0 w-24 h-24" />
      <MadhubaniCorner className="absolute top-0 right-0 w-24 h-24 rotate-90" />
      <MadhubaniCorner className="absolute bottom-0 left-0 w-24 h-24 -rotate-90" />
      <MadhubaniCorner className="absolute bottom-0 right-0 w-24 h-24 rotate-180" />

      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E")` }} />
      <div className="absolute right-0 top-0 bottom-0 w-2/3 opacity-10"
        style={{ background:'radial-gradient(ellipse at 80% 50%, #f3a213 0%, transparent 70%)' }} />

      <div className="max-w-7xl mx-auto px-6 py-20 md:py-28 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity:0, x:-40 }} animate={isInView?{opacity:1,x:0}:{}} transition={{ duration:0.9, ease:'easeOut' }}>
            <p className="font-body font-bold text-xs tracking-[0.3em] uppercase text-sun-harvest mb-5">Culture &amp; Community</p>
            <h2 className="font-display font-bold text-4xl md:text-5xl lg:text-[52px] italic text-ivory-grain leading-[1.12] mb-2">&ldquo;Empowering</h2>
            <h2 className="font-display font-bold text-4xl md:text-5xl lg:text-[52px] italic text-sun-harvest leading-[1.12] mb-8">the hands that harvest.&rdquo;</h2>
            <div className="flex items-center gap-3 mb-8">
              <div className="h-px w-12 bg-sun-harvest/40" />
              <span className="text-sun-harvest text-xs">✦</span>
              <div className="h-px w-6 bg-sun-harvest/30" />
            </div>
            <p className="font-body text-base text-ivory-grain/75 leading-[1.9] mb-10 max-w-lg">
              Every pack of NutriTribe supports the Mallah community of Bihar &mdash;
              the custodians of the makhana lily ponds where India&apos;s finest superfood grows.
              We are not just a snack. We are a movement.
            </p>
            <Link href="/our-story"
              className="inline-flex items-center gap-2 bg-sun-harvest text-white font-body font-bold text-sm px-8 py-4 rounded-full hover:brightness-110 hover:scale-105 transition-all duration-200 tracking-[0.08em] uppercase shadow-product">
              Read Our Story
            </Link>
            <div className="flex gap-8 mt-12 pt-8 border-t border-white/10">
              {[{val:'250+',label:'Families'},{val:'100%',label:'Direct Trade'},{val:'₹ Fair',label:'Wages'}].map(s=>(
                <div key={s.label}>
                  <p className="font-display font-bold text-2xl text-sun-harvest">{s.val}</p>
                  <p className="font-body text-xs text-ivory-grain/50 tracking-widest uppercase mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity:0, x:40 }} animate={isInView?{opacity:1,x:0}:{}} transition={{ duration:0.9, ease:'easeOut', delay:0.15 }} className="relative">
            <div style={{ border:'1px solid rgba(243,162,19,0.15)', borderRadius:'1rem', overflow:'hidden', boxShadow:'0 30px 80px rgba(0,0,0,0.5)' }}>
              <CinematicFarmerScene inView={isInView} />
            </div>
            <motion.div
              initial={{ opacity:0, y:20 }} animate={isInView?{opacity:1,y:0}:{}} transition={{ delay:0.8, duration:0.6 }}
              className="absolute -bottom-5 -left-5 bg-ivory-grain px-5 py-4 rounded-xl shadow-hover max-w-[200px] border border-sun-harvest/15"
            >
              <p className="font-display italic text-earthen-rust text-sm leading-snug">&ldquo;A snack that gives back.&rdquo;</p>
              <p className="font-body text-[10px] text-earthen-rust/50 mt-2 font-bold tracking-widest uppercase">— NutriTribe</p>
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
