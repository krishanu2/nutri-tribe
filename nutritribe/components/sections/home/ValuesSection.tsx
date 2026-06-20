'use client';

import { useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';

/* ─── Constants ─── */
const CX = 300, CY = 300;
const R_RIM = 268;
const R_RIM_IN = 252;
const R_SPOKE_OUT = 246;
const R_SPOKE_IN = 54;
const R_ARC_OUT = 248;
const R_ARC_IN = 226;
const R_HUB = 46;

/* ─── Values ─── */
const VALUES = [
  { title: 'Authenticity', desc: 'Every kernel is traced back to Mithila\'s ancient lily ponds — where makhana has been harvested for over 2,000 years. No shortcuts. No substitutes. Just the real thing.', icon: '🪷', color: '#f3a213', angle: -90 },
  { title: 'Health First', desc: 'Roasted, never fried. Zero MSG, zero artificial colours, zero compromise. Makhana is nature\'s answer to the snack aisle — and we keep it that way.', icon: '🌿', color: '#009846', angle: -18 },
  { title: 'Innovation', desc: 'Ancient grain, bold modern cravings. We fuse 2,500 years of Mithila tradition with globally-inspired flavours that make your taste buds sit up and pay attention.', icon: '⚡', color: '#7a4dff', angle: 54 },
  { title: 'Community', desc: 'Every pouch you open puts money directly in the hands of a Mithila farmer. We source transparently, pay fairly, and celebrate the people behind every harvest.', icon: '🤝', color: '#e06030', angle: 126 },
  { title: 'Quality', desc: 'Triple-sorted by hand. Roasted in small batches. Sealed at peak freshness. Obsessive care from lily pond to sealed pouch — that\'s the NutriTribe promise.', icon: '★', color: '#D4AF37', angle: 198 },
];

/* ─── Arc segment path helper ─── */
function arcPath(cx: number, cy: number, r_out: number, r_in: number, startDeg: number, endDeg: number): string {
  const s = (d: number) => (d * Math.PI) / 180;
  const x1 = cx + r_out * Math.cos(s(startDeg)), y1 = cy + r_out * Math.sin(s(startDeg));
  const x2 = cx + r_out * Math.cos(s(endDeg)),   y2 = cy + r_out * Math.sin(s(endDeg));
  const x3 = cx + r_in  * Math.cos(s(endDeg)),   y3 = cy + r_in  * Math.sin(s(endDeg));
  const x4 = cx + r_in  * Math.cos(s(startDeg)), y4 = cy + r_in  * Math.sin(s(startDeg));
  const lg = Math.abs(endDeg - startDeg) > 180 ? 1 : 0;
  return `M${x1},${y1} A${r_out},${r_out} 0 ${lg},1 ${x2},${y2} L${x3},${y3} A${r_in},${r_in} 0 ${lg},0 ${x4},${y4} Z`;
}

/* ─── Spokes ─── */
const SPOKES = Array.from({ length: 24 }, (_, i) => {
  const a = (i * 2 * Math.PI) / 24;
  return {
    x1: CX + R_SPOKE_IN  * Math.cos(a),
    y1: CY + R_SPOKE_IN  * Math.sin(a),
    x2: CX + R_SPOKE_OUT * Math.cos(a),
    y2: CY + R_SPOKE_OUT * Math.sin(a),
    index: i,
    deg: (i * 360) / 24,
  };
});

function getActiveSpokeIndices(valueAngle: number) {
  const center = Math.round(((valueAngle + 360) % 360) / 15) % 24;
  return new Set([
    (center - 2 + 24) % 24,
    (center - 1 + 24) % 24,
    center,
    (center + 1) % 24,
    (center + 2) % 24,
  ]);
}

/* ─── Ashok Chakra SVG ─── */
function AshokChakraSVG({ active }: { active: number }) {
  const v = VALUES[active];
  const activeSpokes = getActiveSpokeIndices(v.angle);

  return (
    <svg viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-2xl">
      <defs>
        {/* Outer glow gradient */}
        <radialGradient id="v-outer-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor={v.color} stopOpacity="0.18" />
          <stop offset="60%"  stopColor={v.color} stopOpacity="0.04" />
          <stop offset="100%" stopColor={v.color} stopOpacity="0"    />
        </radialGradient>
        {/* Spoke radial fade mask */}
        <radialGradient id="v-spoke-fade" cx="50%" cy="50%" r="50%">
          <stop offset="20%"  stopColor="white" stopOpacity="1"    />
          <stop offset="85%"  stopColor="white" stopOpacity="0.55" />
          <stop offset="100%" stopColor="white" stopOpacity="0.2"  />
        </radialGradient>
        <mask id="v-spoke-mask">
          <circle cx="300" cy="300" r="255" fill="url(#v-spoke-fade)" />
        </mask>
        {/* Hub glow filter */}
        <filter id="v-hub-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        {/* Rim glow filter */}
        <filter id="v-rim-glow" x="-5%" y="-5%" width="110%" height="110%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        {/* Active arc glow */}
        <filter id="v-arc-glow" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        {/* Makhana gradient */}
        <radialGradient id="v-mk" cx="33%" cy="28%" r="68%">
          <stop offset="0%"   stopColor="#fdfbf7" />
          <stop offset="35%"  stopColor="#ecdfc4" />
          <stop offset="70%"  stopColor="#d4b485" />
          <stop offset="100%" stopColor="#b8916a" />
        </radialGradient>
        <radialGradient id="v-mk-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor={v.color} stopOpacity="0.8"  />
          <stop offset="100%" stopColor={v.color} stopOpacity="0"    />
        </radialGradient>
      </defs>

      {/* Ambient glow */}
      <motion.circle cx={CX} cy={CY} r="290" fill="url(#v-outer-glow)"
        animate={{ r: [285, 298, 285] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Dotted decorative outer ring */}
      <circle cx={CX} cy={CY} r="284" stroke={v.color} strokeWidth="0.6" strokeOpacity="0.2" strokeDasharray="3 8" fill="none" />

      {/* Rim glow layer */}
      <circle cx={CX} cy={CY} r={R_RIM} stroke={v.color} strokeWidth="8" strokeOpacity="0.15" fill="none" filter="url(#v-rim-glow)" />
      {/* Main rim */}
      <circle cx={CX} cy={CY} r={R_RIM} stroke={v.color} strokeWidth="3.5" strokeOpacity="0.75" fill="none" />
      {/* Inner rim */}
      <circle cx={CX} cy={CY} r={R_RIM_IN} stroke={v.color} strokeWidth="1" strokeOpacity="0.25" fill="none" />

      {/* 5 Arc segments — inactive */}
      {VALUES.map((seg, i) => (
        <path
          key={seg.title}
          d={arcPath(CX, CY, R_ARC_OUT, R_ARC_IN, seg.angle - 34, seg.angle + 34)}
          fill={seg.color}
          fillOpacity={i === active ? 0 : 0.08}
          stroke={seg.color}
          strokeOpacity={i === active ? 0 : 0.15}
          strokeWidth="0.5"
        />
      ))}

      {/* Active arc segment — glowing */}
      <motion.path
        key={`arc-${active}`}
        d={arcPath(CX, CY, R_ARC_OUT, R_ARC_IN, v.angle - 34, v.angle + 34)}
        fill={v.color}
        fillOpacity="0.28"
        stroke={v.color}
        strokeWidth="1.5"
        strokeOpacity="0.9"
        filter="url(#v-arc-glow)"
        initial={{ fillOpacity: 0, strokeOpacity: 0 }}
        animate={{ fillOpacity: [0.15, 0.32, 0.15], strokeOpacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Inactive spokes with radial fade */}
      <g mask="url(#v-spoke-mask)">
        {SPOKES.filter(s => !activeSpokes.has(s.index)).map(s => (
          <line key={s.index}
            x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2}
            stroke="#f3a213" strokeWidth="1.2" strokeOpacity="0.22" strokeLinecap="round"
          />
        ))}
      </g>

      {/* Active spokes — bright + colored */}
      {SPOKES.filter(s => activeSpokes.has(s.index)).map(s => (
        <motion.line key={s.index}
          x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2}
          stroke={v.color}
          strokeLinecap="round"
          animate={{
            strokeWidth: [2.5, 3.5, 2.5],
            strokeOpacity: [0.75, 1, 0.75],
          }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      {/* Teardrop ornaments at mid-angles */}
      {Array.from({ length: 24 }, (_, i) => {
        const a = ((i + 0.5) * 2 * Math.PI) / 24;
        const r = (R_SPOKE_IN + R_SPOKE_OUT) / 2 + 10;
        return (
          <circle key={i}
            cx={CX + r * Math.cos(a)}
            cy={CY + r * Math.sin(a)}
            r="2.8"
            fill="#f3a213"
            fillOpacity="0.3"
          />
        );
      })}

      {/* Hub rings */}
      <circle cx={CX} cy={CY} r={R_HUB + 16} stroke={v.color} strokeWidth="0.8" strokeOpacity="0.2" fill="none" />
      <circle cx={CX} cy={CY} r={R_HUB + 8}  stroke={v.color} strokeWidth="1.2" strokeOpacity="0.35" fill="none" />
      <circle cx={CX} cy={CY} r={R_HUB}       stroke={v.color} strokeWidth="2.5" strokeOpacity="0.7"  fill="#0a0200" filter="url(#v-hub-glow)" />

      {/* Makhana center glow */}
      <motion.circle cx={CX} cy={CY} r="42" fill="url(#v-mk-glow)"
        animate={{ r: [34, 46, 34] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Makhana ball */}
      <circle cx={CX} cy={CY} r="30" fill="url(#v-mk)" />
      <circle cx={CX - 9} cy={CY - 9} r="10" fill="white" fillOpacity="0.55" />
      {[[309,293],[317,305],[312,318],[298,322],[287,312],[284,299]].map(([sx,sy],i)=>(
        <circle key={i} cx={sx} cy={sy} r="1.8" fill="#b8916a" fillOpacity="0.35" />
      ))}

      {/* Pulse rings */}
      {[0.6, 1.3, 2.0].map((delay, i) => (
        <motion.circle key={i} cx={CX} cy={CY} r={44}
          fill="none" stroke={v.color} strokeWidth={1.8 - i * 0.4}
          animate={{ r: [44, 78, 44], opacity: [0.55, 0, 0.55] }}
          transition={{ duration: 2.8, repeat: Infinity, delay, ease: 'easeOut' }}
        />
      ))}
    </svg>
  );
}

/* ─── Value detail panel (right side) ─── */
function ValuePanel({ v, index }: { v: typeof VALUES[0]; index: number }) {
  return (
    <motion.div
      key={v.title}
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col justify-center h-full px-6 sm:px-10 lg:px-16 max-w-xl"
    >
      {/* Step indicator */}
      <div className="flex items-center gap-3 mb-8">
        {VALUES.map((_, i) => (
          <motion.div
            key={i}
            className="rounded-full"
            animate={{
              width: i === index ? 28 : 8,
              height: 8,
              backgroundColor: i === index ? v.color : v.color + '30',
            }}
            transition={{ duration: 0.35 }}
          />
        ))}
      </div>

      {/* Icon */}
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-7 shadow-lg"
        style={{ background: `linear-gradient(135deg, ${v.color}28, ${v.color}12)`, border: `1.5px solid ${v.color}40` }}
      >
        {v.icon}
      </motion.div>

      {/* Title */}
      <motion.h3
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.15 }}
        className="font-display font-bold mb-1"
        style={{ fontSize: 'clamp(36px, 4vw, 56px)', color: '#1a0e0a', lineHeight: 1.1 }}
      >
        {v.title}
      </motion.h3>

      {/* Accent bar */}
      <motion.div
        className="h-1 rounded-full mb-6"
        style={{ backgroundColor: v.color }}
        initial={{ width: 0 }}
        animate={{ width: 56 }}
        transition={{ duration: 0.5, delay: 0.25 }}
      />

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="font-body text-earthen-rust/70 leading-relaxed text-base"
      >
        {v.desc}
      </motion.p>

      {/* Value number */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="mt-10 font-display font-bold select-none pointer-events-none absolute right-4 sm:right-8 bottom-6 sm:bottom-12"
        style={{ color: v.color + '12', fontSize: 'clamp(56px, 12vw, 140px)', lineHeight: 1 }}
      >
        0{index + 1}
      </motion.div>
    </motion.div>
  );
}

/* ─── Main Section ─── */
export default function ValuesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeValue, setActiveValue] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setActiveValue(Math.min(4, Math.floor(v * 5)));
  });

  const cv = VALUES[activeValue];

  return (
    <section
      ref={sectionRef}
      className="relative"
      style={{ height: '550vh' }}
    >
      {/* Sticky split panel — stacked on mobile, side-by-side from lg up */}
      <div
        className="sticky top-0 h-screen overflow-hidden flex flex-col lg:flex-row"
        style={{ background: '#0a0200' }}
      >
        {/* Left — Chakra */}
        <div
          className="relative flex flex-col items-center justify-center w-full lg:w-[52%] h-[52%] lg:h-full shrink-0"
          style={{ background: 'radial-gradient(ellipse 80% 80% at 50% 50%, #1a0802 0%, #0a0200 70%)' }}
        >
          {/* Section heading lives here on dark bg so it's always readable */}
          <div className="text-center mb-2 sm:mb-4 px-4">
            <p className="font-body font-bold text-[10px] tracking-[0.35em] uppercase mb-1.5" style={{ color: '#f3a213' }}>
              What We Stand For
            </p>
            <h2 className="font-display font-bold text-white" style={{ fontSize: 'clamp(20px, 3vw, 36px)' }}>
              Our Core <em className="not-italic" style={{ color: '#f3a213' }}>Values</em>
            </h2>
          </div>
          {/* Subtle scanlines */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
            style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(243,162,19,0.5) 2px, rgba(243,162,19,0.5) 3px)' }}
          />

          <div className="relative w-full max-w-[220px] sm:max-w-[320px] lg:max-w-[500px] aspect-square px-4 sm:px-8">
            <motion.div
              key={`chakra-${activeValue}`}
              className="w-full h-full"
              initial={{ rotate: -8, opacity: 0.7 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <AshokChakraSVG active={activeValue} />
            </motion.div>

            {/* Scroll hint — desktop only, no room for it in the mobile stacked layout */}
            <div className="hidden lg:flex absolute -bottom-12 left-1/2 -translate-x-1/2 flex-col items-center gap-1.5 opacity-40">
              <p className="font-body text-[10px] tracking-widest uppercase text-amber-400">scroll</p>
              <motion.div className="w-px h-6 bg-amber-400/60" animate={{ scaleY: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity }} />
            </div>
          </div>
        </div>

        {/* Right — Value detail */}
        <div className="relative flex items-center w-full lg:w-[48%] h-[48%] lg:h-full overflow-y-auto" style={{ background: '#fdfbf7' }}>
          {/* Decorative left edge */}
          <div className="absolute left-0 top-0 bottom-0 w-px" style={{ background: `linear-gradient(to bottom, transparent, ${cv.color}60, transparent)` }} />

          <AnimatePresence mode="wait">
            <ValuePanel key={activeValue} v={cv} index={activeValue} />
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
