'use client';

import { motion } from 'framer-motion';
import FarmerCharacter from './FarmerCharacter';

interface HarvestStorySceneProps {
  inView?: boolean;
  className?: string;
}

/* ── Reusable: a lotus flower centred at (cx, cy) with given scale.
   Petals are no longer perfectly even — each gets a small random-ish
   offset in angle/length so the flower reads as grown, not stamped. ── */
function Lotus({ cx, cy, s = 1, color = '#e8a0c0' }: { cx: number; cy: number; s?: number; color?: string }) {
  const petals = [
    { a: 2,   len: 10.4 }, { a: 50,  len: 9.6 }, { a: 99,  len: 10.7 }, { a: 151, len: 9.3 },
    { a: 207, len: 10.2 }, { a: 257, len: 9.8 },  { a: 309, len: 10.5 },
  ];
  return (
    <g transform={`translate(${cx},${cy}) scale(${s})`}>
      {petals.map(({ a, len }, i) => {
        const rad = (a * Math.PI) / 180;
        return (
          <ellipse
            key={i}
            cx={12 * Math.cos(rad)}
            cy={12 * Math.sin(rad)}
            rx={4.6 + (i % 2) * 0.6}
            ry={len}
            fill={color}
            opacity={0.84 + (i % 3) * 0.04}
            transform={`rotate(${a} ${12 * Math.cos(rad)} ${12 * Math.sin(rad)})`}
          />
        );
      })}
      <circle cx={0} cy={0} r={6} fill="#f3a213" />
      <circle cx={0} cy={0} r={3} fill="#ffe08a" />
    </g>
  );
}

/* ── Footprints — the connective thread carrying the farmer's journey from frame to frame ── */
function Footprints({ points, opacity = 0.18 }: { points: [number, number, number][]; opacity?: number }) {
  return (
    <g>
      {points.map(([x, y, rot], i) => (
        <ellipse key={i} cx={x} cy={y} rx={3} ry={5} fill="#0a1408" opacity={opacity}
          transform={`rotate(${rot} ${x} ${y})`} />
      ))}
    </g>
  );
}

export default function HarvestStoryScene({ inView = true, className = '' }: HarvestStorySceneProps) {
  const anim = inView;

  const perfCount = 20;
  const perfSpacingX = 960 / perfCount;

  return (
    <svg
      viewBox="0 0 960 380"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ width: '100%', height: 'auto', display: 'block' }}
    >
      <defs>
        {/* Frame gradients */}
        <linearGradient id="f1-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#06091c" />
          <stop offset="65%" stopColor="#0e1640" />
          <stop offset="88%" stopColor="#1a2a18" />
          <stop offset="100%" stopColor="#0d1a0c" />
        </linearGradient>
        <linearGradient id="f1-gnd" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a2a18" />
          <stop offset="100%" stopColor="#0a1208" />
        </linearGradient>
        <radialGradient id="f1-dawn" cx="30%" cy="100%" r="60%">
          <stop offset="0%" stopColor="#8a3a08" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#8a3a08" stopOpacity="0" />
        </radialGradient>

        <linearGradient id="f2-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0d2218" />
          <stop offset="55%" stopColor="#0a3025" />
          <stop offset="100%" stopColor="#061a10" />
        </linearGradient>
        <linearGradient id="f2-water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0e3828" />
          <stop offset="100%" stopColor="#051408" />
        </linearGradient>

        <linearGradient id="f3-water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0a2030" />
          <stop offset="55%" stopColor="#061828" />
          <stop offset="100%" stopColor="#031020" />
        </linearGradient>
        <linearGradient id="f3-mud" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a1408" />
          <stop offset="100%" stopColor="#150a04" />
        </linearGradient>
        <radialGradient id="f3-light" cx="50%" cy="0%" r="80%">
          <stop offset="0%" stopColor="#3a8060" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#3a8060" stopOpacity="0" />
        </radialGradient>

        <linearGradient id="f4-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4a2800" />
          <stop offset="40%" stopColor="#b85000" />
          <stop offset="80%" stopColor="#e87800" />
          <stop offset="100%" stopColor="#f3a213" />
        </linearGradient>
        <linearGradient id="f4-gnd" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a1a08" />
          <stop offset="100%" stopColor="#180e04" />
        </linearGradient>
        <radialGradient id="f4-sun" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff5c0" stopOpacity="1" />
          <stop offset="45%" stopColor="#f3a213" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#f3a213" stopOpacity="0" />
        </radialGradient>

        {/* Clip paths */}
        <clipPath id="c1"><rect x="18" y="45" width="210" height="290" rx="4" /></clipPath>
        <clipPath id="c2"><rect x="250" y="45" width="210" height="290" rx="4" /></clipPath>
        <clipPath id="c3"><rect x="482" y="45" width="210" height="290" rx="4" /></clipPath>
        <clipPath id="c4"><rect x="714" y="45" width="210" height="290" rx="4" /></clipPath>
      </defs>

      {/* ═══════════════ FILM STRIP CHROME ═══════════════ */}
      <rect width="960" height="380" fill="#080400" />

      {/* Top + bottom perforation strips */}
      <rect x="0" y="0" width="960" height="43" fill="#0d0600" />
      <rect x="0" y="337" width="960" height="43" fill="#0d0600" />

      {/* Perforations */}
      {Array.from({ length: perfCount }).map((_, i) => {
        const cx = (i + 0.5) * perfSpacingX;
        return (
          <g key={i}>
            <rect x={cx - 9} y={9} width={18} height={22} rx={3} fill="#1e1000" />
            <rect x={cx - 7} y={11} width={14} height={18} rx={2} fill="#000" />
            <rect x={cx - 9} y={349} width={18} height={22} rx={3} fill="#1e1000" />
            <rect x={cx - 7} y={351} width={14} height={18} rx={2} fill="#000" />
          </g>
        );
      })}

      {/* Frame separator lines */}
      <line x1="0" y1="43" x2="960" y2="43" stroke="#1e1000" strokeWidth="1" />
      <line x1="0" y1="337" x2="960" y2="337" stroke="#1e1000" strokeWidth="1" />

      {/* ═══════════════════════════════════════
          FRAME 1 — BEFORE DAWN
          Farmer sets out before sunrise, pond ahead
          ═══════════════════════════════════════ */}
      <motion.g
        clipPath="url(#c1)"
        initial={{ opacity: 0, x: -30 }}
        animate={anim ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.7, delay: 0 }}
      >
        {/* Sky */}
        <rect x="18" y="45" width="210" height="290" fill="url(#f1-sky)" />
        {/* Pre-dawn warm glow on left horizon */}
        <ellipse cx="70" cy="335" rx="90" ry="55" fill="url(#f1-dawn)" />
        {/* Ground */}
        <path d="M18 260 Q80 254 130 258 Q175 262 228 256 L228 335 L18 335 Z" fill="url(#f1-gnd)" />
        {/* Distant treeline silhouette */}
        <path d="M18 260 Q45 248 62 254 Q75 242 88 254 Q100 245 115 254 Q128 243 145 256 Q160 246 175 258 Q190 250 210 256 L228 256 L228 268 L18 268 Z"
          fill="#0a1408" opacity="0.7" />

        {/* Lotus pond at distance */}
        <ellipse cx="95" cy="270" rx="55" ry="16" fill="#0a1e28" opacity="0.9" />
        {/* Faint pond shimmer */}
        <motion.line x1="60" y1="268" x2="130" y2="268" stroke="#1a4a5a" strokeWidth="1.5" opacity="0.5"
          animate={anim ? { opacity: [0.3, 0.6, 0.3] } : {}} transition={{ duration: 3, repeat: Infinity }} />

        {/* Stars */}
        {[[50, 65], [90, 58], [130, 72], [170, 60], [200, 78], [40, 90], [155, 85]].map(([x, y], i) => (
          <motion.circle key={i} cx={x} cy={y} r={1.2 + (i % 2) * 0.5} fill="white"
            animate={anim ? { opacity: [0.4, 1, 0.4] } : { opacity: 0.6 }}
            transition={{ duration: 2.5 + i * 0.4, repeat: Infinity, delay: i * 0.35 }} />
        ))}

        {/* Crescent moon — two circles overlapping */}
        <circle cx="178" cy="85" r="16" fill="#d4e8f8" opacity="0.92" />
        <circle cx="186" cy="82" r="15" fill="#0e1640" />
        {/* Soft moon glow */}
        <circle cx="178" cy="85" r="26" fill="#b0c8e0" opacity="0.07" />

        {/* Footprints behind the farmer, fading toward the pond — the journey's first thread */}
        <Footprints points={[[58, 263, -8], [66, 263.5, -4], [74, 264, 0], [82, 263.5, 4], [90, 263, 8]]} opacity={0.14} />

        {/* ── FARMER WALKING — shared character, lantern lighting the way ── */}
        <motion.g animate={anim ? { x: [0, 55, 0] } : {}} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}>
          <g transform="translate(70, 262) scale(0.92)">
            <FarmerCharacter pose="walking" accessory="lantern" animate={anim} />
          </g>
        </motion.g>

        {/* Frame label */}
        <rect x="20" y="298" width="110" height="34" rx="3" fill="rgba(0,0,0,0.55)" />
        <text x="28" y="314" fontFamily="Georgia, serif" fontSize="10" fontWeight="bold" fill="#f3a213">Before Dawn</text>
        <text x="28" y="326" fontFamily="Georgia, serif" fontSize="8" fill="rgba(243,162,19,0.5)">4:30 AM · Mithila</text>
      </motion.g>
      {/* Frame 1 border */}
      <rect x="18" y="45" width="210" height="290" rx="4" fill="none" stroke="#f3a213" strokeWidth="0.6" strokeOpacity="0.35" />

      {/* ═══════════════════════════════════════
          FRAME 2 — INTO THE WATER
          Farmer is waist-deep, lotus flowers bloom around
          ═══════════════════════════════════════ */}
      <motion.g
        clipPath="url(#c2)"
        initial={{ opacity: 0, x: -20 }}
        animate={anim ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.18 }}
      >
        {/* Sky — pre-dawn greenish teal */}
        <rect x="250" y="45" width="210" height="290" fill="url(#f2-sky)" />
        {/* Treeline far background */}
        <path d="M250 195 Q280 182 305 190 Q325 178 348 188 Q365 180 390 192 Q410 182 430 192 L460 192 L460 205 L250 205 Z"
          fill="#0a1e10" opacity="0.55" />

        {/* Faint footprints at the shoreline edge, continuing the thread from Frame 1 */}
        <Footprints points={[[262, 222, 4], [270, 221.5, 0]]} opacity={0.1} />

        {/* The farmer's lantern, set down at the water's edge — echoes Frame 1's light, signals same journey */}
        <motion.circle cx="266" cy="218" r="8" fill="#f3a213" opacity="0"
          animate={anim ? { opacity: [0, 0.1, 0.05, 0.12, 0] } : {}}
          transition={{ duration: 4, repeat: Infinity, delay: 1.5 }} />

        {/* Water surface — waist level at y=225 */}
        <rect x="250" y="225" width="210" height="110" fill="url(#f2-water)" />
        {/* Animated water surface — same cadence as the ripple rings below for cohesion */}
        <motion.path
          d="M250 225 Q275 221 300 225 Q325 229 355 224 Q385 219 410 224 Q435 229 460 225"
          stroke="#2a6a4a" strokeWidth="1.5" fill="none" opacity="0.7"
          animate={anim ? { d: ['M250 225 Q275 221 300 225 Q325 229 355 224 Q385 219 410 224 Q435 229 460 225',
            'M250 226 Q275 229 300 224 Q325 220 355 225 Q385 230 410 225 Q435 220 460 226'] } : {}}
          transition={{ duration: 2.5, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }} />
        {/* Water shimmer lines */}
        {[232, 240, 250].map((y, i) => (
          <motion.line key={i} x1={265 + i * 15} y1={y} x2={310 + i * 20} y2={y}
            stroke="#3a8a5a" strokeWidth="1.2" opacity="0.3"
            animate={anim ? { opacity: [0.15, 0.45, 0.15] } : {}}
            transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.5 }} />
        ))}

        {/* Lily pads */}
        {[[280, 228, 18, 0.82], [340, 232, 14, 0.78], [405, 226, 16, 0.80], [430, 234, 12, 0.75]].map(([x, y, rx, op], i) => (
          <ellipse key={i} cx={x} cy={y} rx={rx} ry={rx as number * 0.35} fill="#1a5a18" opacity={op} />
        ))}

        {/* Lotus flowers on water */}
        <Lotus cx={280} cy={214} s={0.9} color="#e8a0c0" />
        <Lotus cx={348} cy={210} s={1.1} color="#9b59b6" />
        <Lotus cx={418} cy={215} s={0.85} color="#e89ab8" />

        {/* ── FARMER WAIST DEEP — shared character, reaching for seeds ── */}
        <g transform="translate(355, 225) scale(0.95)">
          <FarmerCharacter pose="wading" accessory="basket-arms" animate={anim} />
        </g>
        {/* Water ripple around farmer — same 2.5s cadence used for the water-surface motion above */}
        {[0, 1, 2].map((i) => (
          <motion.ellipse key={i} cx="355" cy="225" fill="none"
            stroke="rgba(80,180,130,0.4)" strokeWidth="1"
            initial={{ rx: 15, ry: 5, opacity: 0.6 }}
            animate={anim ? { rx: [15 + i * 12, 42 + i * 16], ry: [5 + i * 2, 12 + i * 4], opacity: [0.5, 0] } : {}}
            transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.85 }} />
        ))}

        {/* Frame label */}
        <rect x="252" y="298" width="120" height="34" rx="3" fill="rgba(0,0,0,0.55)" />
        <text x="260" y="314" fontFamily="Georgia, serif" fontSize="10" fontWeight="bold" fill="#f3a213">Into the Water</text>
        <text x="260" y="326" fontFamily="Georgia, serif" fontSize="8" fill="rgba(243,162,19,0.5)">5:00 AM · Lotus Pond</text>
      </motion.g>
      <rect x="250" y="45" width="210" height="290" rx="4" fill="none" stroke="#f3a213" strokeWidth="0.6" strokeOpacity="0.35" />

      {/* ═══════════════════════════════════════
          FRAME 3 — THE DIVE
          A DIVER is shown swimming underwater —
          body horizontal, reaching for seeds on the floor
          ═══════════════════════════════════════ */}
      <motion.g
        clipPath="url(#c3)"
        initial={{ opacity: 0, x: -20 }}
        animate={anim ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.36 }}
      >
        {/* Underwater background */}
        <rect x="482" y="45" width="210" height="290" fill="url(#f3-water)" />
        {/* Ambient light from surface above */}
        <ellipse cx="587" cy="90" rx="90" ry="40" fill="url(#f3-light)" />
        {/* Surface light rays */}
        {[[555, 45, 545, 140], [587, 45, 587, 155], [620, 45, 630, 135]].map(([x1, y1, x2, y2], i) => (
          <motion.line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="rgba(80,180,130,0.15)" strokeWidth="8" strokeLinecap="round"
            animate={anim ? { opacity: [0.5, 1, 0.5] } : { opacity: 0.6 }}
            transition={{ duration: 3.5, repeat: Infinity, delay: i * 0.8 }} />
        ))}

        {/* Mud floor at bottom */}
        <path d="M482 295 Q510 290 540 294 Q565 298 590 292 Q615 287 640 292 Q660 296 692 292 L692 335 L482 335 Z"
          fill="url(#f3-mud)" />

        {/* Lotus stems rising from mud */}
        {[[525, 295, 525, 155], [570, 292, 568, 140], [620, 294, 622, 160], [660, 293, 658, 172]].map(([x1, y1, x2, y2], i) => (
          <motion.path key={i}
            d={`M${x1} ${y1} Q${(x1 + x2) / 2 + (i % 2 === 0 ? 4 : -4)} ${(y1 + y2) / 2} ${x2} ${y2}`}
            stroke="#1a6a20" strokeWidth="3" fill="none" strokeLinecap="round"
            animate={anim ? {
              d: [`M${x1} ${y1} Q${(x1 + x2) / 2 + 4} ${(y1 + y2) / 2} ${x2} ${y2}`,
                `M${x1} ${y1} Q${(x1 + x2) / 2 - 4} ${(y1 + y2) / 2} ${x2} ${y2}`]
            } : {}}
            transition={{ duration: 3 + i * 0.4, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }} />
        ))}
        {/* Small lotus leaves on stems */}
        {[[525, 185], [568, 168], [622, 192], [658, 200]].map(([x, y], i) => (
          <ellipse key={i} cx={x} cy={y} rx={14} ry={5} fill="#1a7a18" opacity="0.7"
            transform={`rotate(${-20 + i * 15} ${x} ${y})`} />
        ))}

        {/* Makhana pods / seeds on mud floor */}
        {[[505, 300], [530, 297], [558, 301], [580, 296], [608, 299], [635, 297], [658, 301]].map(([x, y], i) => (
          <motion.g key={i}
            animate={anim ? { opacity: [0.6, 1, 0.6] } : {}}
            transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.3 }}>
            <ellipse cx={x} cy={y} rx={8} ry={5} fill="#c4a020" opacity="0.85" />
            <ellipse cx={x - 2} cy={y - 1} rx={3} ry={2} fill="#e8c040" opacity="0.5" />
          </motion.g>
        ))}

        {/* ── DIVER — shared character, horizontal, reaching for seeds ── */}
        <g transform="translate(560, 190) scale(0.92)">
          <FarmerCharacter pose="diving" animate={anim} />
        </g>

        {/* Frame label */}
        <rect x="484" y="298" width="100" height="34" rx="3" fill="rgba(0,0,0,0.55)" />
        <text x="492" y="314" fontFamily="Georgia, serif" fontSize="10" fontWeight="bold" fill="#f3a213">The Dive</text>
        <text x="492" y="326" fontFamily="Georgia, serif" fontSize="8" fill="rgba(243,162,19,0.5)">The Ancient Technique</text>
      </motion.g>
      <rect x="482" y="45" width="210" height="290" rx="4" fill="none" stroke="#f3a213" strokeWidth="0.6" strokeOpacity="0.35" />

      {/* ═══════════════════════════════════════
          FRAME 4 — THE HARVEST
          Farmer stands at dawn, basket overflowing with makhana
          Sun rising behind him, golden light everywhere
          ═══════════════════════════════════════ */}
      <motion.g
        clipPath="url(#c4)"
        initial={{ opacity: 0, x: -20 }}
        animate={anim ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.54 }}
      >
        {/* Sunrise sky */}
        <rect x="714" y="45" width="210" height="290" fill="url(#f4-sky)" />
        {/* Ground */}
        <path d="M714 258 Q760 252 820 256 Q870 260 924 254 L924 335 L714 335 Z" fill="url(#f4-gnd)" />
        {/* Pond edge at feet */}
        <ellipse cx="780" cy="262" rx="65" ry="14" fill="#1a2a18" opacity="0.6" />
        <motion.line x1="722" y1="260" x2="790" y2="260" stroke="#2a6a3a" strokeWidth="1.2" opacity="0.5"
          animate={anim ? { opacity: [0.3, 0.7, 0.3] } : {}}
          transition={{ duration: 3, repeat: Infinity }} />

        {/* Footprints arriving at the harvest spot — the journey's final thread */}
        <Footprints points={[[760, 263, -6], [768, 263.5, -2], [776, 264, 2]]} opacity={0.16} />

        {/* Sun at horizon */}
        <motion.circle cx="819" cy="258" r={25}
          fill="#ffe040" opacity="0.95"
          animate={anim ? { r: [23, 27, 23] } : {}}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }} />
        <circle cx="819" cy="258" r="40" fill="url(#f4-sun)" opacity="0.7" />
        <circle cx="819" cy="258" r="60" fill="url(#f4-sun)" opacity="0.3" />
        {/* Ground masks bottom of sun */}
        <path d="M714 260 Q760 254 820 258 Q870 262 924 258 L924 335 L714 335 Z" fill="url(#f4-gnd)" />

        {/* Sun rays */}
        {[[-55, -10], [-45, -35], [-30, -50], [0, -58], [30, -50], [50, -35]].map(([dx, dy], i) => (
          <motion.line key={i}
            x1={819} y1={258}
            x2={819 + dx * 1.5} y2={258 + dy * 1.5}
            stroke="#f3a213" strokeWidth={2.5 - i * 0.15} opacity="0.5"
            animate={anim ? { opacity: [0.3, 0.65, 0.3] } : {}}
            transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.25 }} />
        ))}

        {/* Lotus flowers at water's edge */}
        <Lotus cx={738} cy={254} s={0.75} color="#e8a0c0" />
        <Lotus cx={770} cy={250} s={0.65} color="#9b59b6" />

        {/* ── FARMER STANDING PROUD — shared character, basket now overflowing ── */}
        <g transform="translate(808, 258) scale(0.92)">
          <FarmerCharacter pose="harvesting" animate={anim} />
        </g>

        {/* Golden dust particles swirling */}
        {[[730, 120], [750, 95], [880, 110], [900, 140], [760, 140]].map(([x, y], i) => (
          <motion.circle key={i} cx={x} cy={y} r={1.5 + (i % 2)}
            fill="#f3a213" opacity="0"
            animate={anim ? { opacity: [0, 0.6, 0], y: [0, -15, -30] } : {}}
            transition={{ duration: 3, repeat: Infinity, delay: i * 0.6 }} />
        ))}

        {/* Frame label */}
        <rect x="716" y="298" width="100" height="34" rx="3" fill="rgba(0,0,0,0.55)" />
        <text x="724" y="314" fontFamily="Georgia, serif" fontSize="10" fontWeight="bold" fill="#f3a213">The Harvest</text>
        <text x="724" y="326" fontFamily="Georgia, serif" fontSize="8" fill="rgba(243,162,19,0.5)">Dawn · Bihar</text>
      </motion.g>
      <rect x="714" y="45" width="210" height="290" rx="4" fill="none" stroke="#f3a213" strokeWidth="0.6" strokeOpacity="0.35" />

      {/* NutriTribe label */}
      <text x="935" y="372" textAnchor="end" fontFamily="Georgia, serif" fontSize="7.5"
        fill="rgba(243,162,19,0.4)" letterSpacing="1.5">NutriTribe · Mithila, Bihar</text>
    </svg>
  );
}
