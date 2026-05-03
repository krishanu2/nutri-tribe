'use client';

import { motion } from 'framer-motion';

export default function FarmerScene({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 800 460" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="sky-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a0e0a" />
          <stop offset="60%" stopColor="#5c2a10" />
          <stop offset="100%" stopColor="#8b3a18" />
        </linearGradient>
        <linearGradient id="water-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a3a2a" />
          <stop offset="100%" stopColor="#0d2218" />
        </linearGradient>
        <radialGradient id="sun-radial" cx="50%" cy="50%" r="50%" fx="50%" fy="30%" gradientUnits="objectBoundingBox">
          <stop offset="0%" stopColor="#fff8d0" />
          <stop offset="35%" stopColor="#f3a213" />
          <stop offset="100%" stopColor="#d4880f" />
        </radialGradient>
        <filter id="blur-sm">
          <feGaussianBlur stdDeviation="2" />
        </filter>
        <filter id="glow-sun">
          <feGaussianBlur stdDeviation="12" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* ── SKY ── */}
      <rect width="800" height="460" fill="url(#sky-grad)" />

      {/* ── BACKGROUND MIST ── */}
      <motion.rect
        x="0" y="220" width="800" height="60"
        fill="rgba(243,162,19,0.04)"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* ── SUN / MOON glow ── */}
      {/* Outer glow — pulsing radius and opacity */}
      <motion.circle
        cx="640" cy="90"
        animate={{ r: [55, 62, 55], opacity: [0.15, 0.25, 0.15] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        fill="rgba(243,162,19,1)"
        filter="url(#blur-sm)"
      />
      <circle cx="640" cy="90" r="38" fill="rgba(243,162,19,0.2)" />
      <circle cx="640" cy="90" r="26" fill="url(#sun-radial)" filter="url(#glow-sun)" />
      {/* Sun rays */}
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((a, i) => {
        const r1 = 35, r2 = 52;
        const rad = (a * Math.PI) / 180;
        return (
          <line key={i}
            x1={640 + r1 * Math.cos(rad)} y1={90 + r1 * Math.sin(rad)}
            x2={640 + r2 * Math.cos(rad)} y2={90 + r2 * Math.sin(rad)}
            stroke="#f3a213" strokeWidth="2" opacity="0.5" strokeLinecap="round"
          />
        );
      })}

      {/* ── LANDSCAPE hills ── */}
      <path d="M0 240 Q120 180 240 210 Q360 240 480 195 Q600 155 720 190 Q760 200 800 185 L800 310 L0 310 Z"
        fill="#2a1608" opacity="0.9" />
      <path d="M0 260 Q80 230 180 250 Q300 270 420 240 Q540 215 680 245 Q740 255 800 240 L800 320 L0 320 Z"
        fill="#3d1e0a" opacity="0.7" />

      {/* ── WATER / POND ── */}
      <path d="M0 310 Q100 298 200 308 Q300 318 400 305 Q500 292 600 305 Q700 318 800 308 L800 460 L0 460 Z"
        fill="url(#water-grad)" />

      {/* Water shimmer lines — animated opacity */}
      {[330, 355, 375, 398, 420].map((y, i) => (
        <motion.path key={i}
          d={`M${60 + i * 20} ${y} Q${200 + i * 10} ${y - 4} ${350 + i * 15} ${y} Q${500 + i * 10} ${y + 4} ${700 - i * 15} ${y}`}
          stroke="rgba(243,162,19,1)"
          strokeWidth="1.5"
          fill="none"
          animate={{ opacity: [0.08, 0.4, 0.08] }}
          transition={{
            duration: 3 + i * 0.4,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.5,
          }}
        />
      ))}

      {/* Sun reflection on water — animated opacity */}
      <motion.ellipse
        cx="640" cy="360" rx="50" ry="10"
        fill="rgba(243,162,19,1)"
        animate={{ opacity: [0.15, 0.25, 0.15] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.ellipse
        cx="640" cy="380" rx="30" ry="6"
        fill="rgba(243,162,19,1)"
        animate={{ opacity: [0.10, 0.20, 0.10] }}
        transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
      />
      <motion.ellipse
        cx="640" cy="398" rx="16" ry="4"
        fill="rgba(243,162,19,1)"
        animate={{ opacity: [0.08, 0.18, 0.08] }}
        transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: 1.1 }}
      />

      {/* ── LOTUS PADS ── */}
      {[
        [160, 360, 48, 16], [320, 388, 42, 14], [510, 372, 52, 17],
        [690, 395, 38, 13], [80, 410, 35, 12],
      ].map(([x, y, rx, ry], i) => (
        <g key={i}>
          <ellipse cx={x} cy={y} rx={rx} ry={ry} fill="#1a4a2a" opacity="0.85" />
          <path
            d={`M${x} ${y - ry} L${x - 8} ${y - ry + 6} Q${x} ${y - ry - 2} ${x + 8} ${y - ry + 6} Z`}
            fill="url(#water-grad)"
          />
        </g>
      ))}

      {/* ── LOTUS FLOWERS — petal breathing ── */}
      {[
        [160, 348, '#e8a0a0'],
        [510, 360, '#f5c0c0'],
        [80, 402, '#d88888'],
      ].map(([x, y, petal], flowerIdx) => (
        <g key={flowerIdx}>
          {[0, 51, 102, 153, 204, 255, 306].map((a, j) => {
            const rad = (a * Math.PI) / 180;
            const px = Number(x) + 18 * Math.cos(rad);
            const py = Number(y) + 18 * Math.sin(rad);
            return (
              <g key={j} transform={`rotate(${a} ${px} ${py})`}>
                <motion.ellipse
                  cx={px} cy={py}
                  rx={8}
                  fill={petal as string}
                  opacity={0.75}
                  animate={{ ry: [14, 16, 14] }}
                  transition={{
                    duration: 3.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: (flowerIdx * 0.7) + (j * 0.15),
                  }}
                />
              </g>
            );
          })}
          <circle cx={x as number} cy={y as number} r="8" fill="#f3a213" opacity="0.9" />
          <circle cx={x as number} cy={y as number} r="4" fill="#fdfbf7" opacity="0.8" />
        </g>
      ))}

      {/* ── MAKHANA PODS on lotus ── */}
      {[[320, 375], [690, 383]].map(([x, y], i) => (
        <g key={i}>
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a, j) => {
            const rad = (a * Math.PI) / 180;
            return (
              <circle key={j} cx={Number(x) + 14 * Math.cos(rad)} cy={Number(y) + 14 * Math.sin(rad)}
                r="5" fill="#d4af37" opacity="0.8" />
            );
          })}
          <circle cx={x as number} cy={y as number} r="9" fill="#f5e8c0" />
          <circle cx={x as number} cy={y as number} r="5" fill="#fdfbf7" />
        </g>
      ))}

      {/* ── FLOATING MAKHANA SEEDS — bobbing up and down ── */}
      {[
        [255, 330, 9, 3.5],
        [310, 318, 7, 4.0],
        [450, 340, 8, 3.8],
        [490, 325, 6, 4.2],
      ].map(([x, y, r, dur], i) => (
        <motion.g
          key={i}
          animate={{ translateY: [0, -4, 0] }}
          transition={{
            duration: dur,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.4,
          }}
        >
          <circle cx={x} cy={y} r={r} fill="#f5e8c0" opacity="0.85" />
          <circle
            cx={Number(x) - Number(r) * 0.3}
            cy={Number(y) - Number(r) * 0.3}
            r={Number(r) * 0.35}
            fill="rgba(255,255,255,0.5)"
          />
        </motion.g>
      ))}

      {/* ── FARMER SILHOUETTES ── */}

      {/* Farmer 1 — left, carrying basket on head */}
      <g opacity="0.92">
        <ellipse cx="205" cy="295" rx="18" ry="28" fill="#1a0e0a" />
        <circle cx="205" cy="260" r="14" fill="#2d1510" />
        {/* Turban */}
        <path d="M193 255 Q205 245 217 255 Q215 248 205 246 Q195 248 193 255 Z" fill="#f3a213" opacity="0.9" />
        {/* Basket on head */}
        <path d="M194 253 Q205 244 216 253 Q214 240 205 238 Q196 240 194 253 Z" fill="#7d3627" opacity="0.85" />
        <ellipse cx="205" cy="238" rx="14" ry="5" fill="#7d3627" opacity="0.9" />
        {/* Left arm — gently oscillating */}
        <motion.path
          stroke="#1a0e0a" strokeWidth="8" strokeLinecap="round" fill="none"
          animate={{
            d: [
              'M190 285 Q175 298 168 315',
              'M190 285 Q172 295 165 312',
              'M190 285 Q175 298 168 315',
            ],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Right arm */}
        <motion.path
          stroke="#1a0e0a" strokeWidth="8" strokeLinecap="round" fill="none"
          animate={{
            d: [
              'M220 285 Q232 295 235 315',
              'M220 285 Q235 298 238 318',
              'M220 285 Q232 295 235 315',
            ],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
        />
        {/* Legs/in water */}
        <path d="M197 320 L193 345" stroke="#1a0e0a" strokeWidth="9" strokeLinecap="round" fill="none" />
        <path d="M213 320 L216 345" stroke="#1a0e0a" strokeWidth="9" strokeLinecap="round" fill="none" />
        {/* Dhoti */}
        <path d="M188 305 Q205 315 222 305 Q218 322 205 325 Q192 322 188 305 Z" fill="#2d1a10" opacity="0.9" />
        {/* Water ripple around legs */}
        <ellipse cx="205" cy="342" rx="28" ry="6" fill="none" stroke="rgba(243,162,19,0.2)" strokeWidth="1.5" />
      </g>

      {/* Farmer 2 — center, bending to harvest */}
      <g opacity="0.92">
        <ellipse cx="390" cy="298" rx="20" ry="24" fill="#1a0e0a" />
        <circle cx="395" cy="268" r="14" fill="#2d1510" />
        {/* Turban */}
        <path d="M383 264 Q395 254 407 264 Q405 257 395 255 Q385 257 383 264 Z" fill="#009846" opacity="0.9" />
        {/* Harvesting arm — reach-in / reach-out */}
        <motion.path
          stroke="#1a0e0a" strokeWidth="9" strokeLinecap="round" fill="none"
          animate={{
            d: [
              'M375 288 Q358 305 350 328',
              'M375 288 Q355 308 344 334',
              'M375 288 Q358 305 350 328',
            ],
          }}
          transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Other arm with makhana basket */}
        <motion.path
          stroke="#1a0e0a" strokeWidth="8" strokeLinecap="round" fill="none"
          animate={{
            d: [
              'M408 288 Q422 278 435 272',
              'M408 288 Q418 274 430 268',
              'M408 288 Q422 278 435 272',
            ],
          }}
          transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
        />
        {/* Basket */}
        <path d="M425 258 Q435 252 445 258 Q443 268 435 270 Q427 268 425 258 Z" fill="#7d3627" opacity="0.9" />
        <ellipse cx="435" cy="258" rx="11" ry="4" fill="#7d3627" />
        {/* Legs */}
        <path d="M382 318 L378 348" stroke="#1a0e0a" strokeWidth="9" strokeLinecap="round" fill="none" />
        <path d="M400 320 L402 348" stroke="#1a0e0a" strokeWidth="9" strokeLinecap="round" fill="none" />
        <path d="M372 300 Q390 312 408 300 Q405 320 390 323 Q376 320 372 300 Z" fill="#2d1a10" opacity="0.9" />
        <ellipse cx="390" cy="345" rx="30" ry="6" fill="none" stroke="rgba(243,162,19,0.2)" strokeWidth="1.5" />
      </g>

      {/* Farmer 3 — right, upright with pole/net */}
      <g opacity="0.92">
        <ellipse cx="580" cy="292" rx="17" ry="30" fill="#1a0e0a" />
        <circle cx="580" cy="258" r="14" fill="#2d1510" />
        {/* Turban */}
        <path d="M568 254 Q580 244 592 254 Q590 247 580 245 Q570 247 568 254 Z" fill="#f3a213" opacity="0.9" />
        {/* Long pole/net — swinging slightly */}
        <motion.line
          x1="596" y1="272" stroke="#7d3627" strokeWidth="4" strokeLinecap="round"
          animate={{
            x2: [648, 652, 644, 648],
            y2: [215, 210, 218, 215],
          }}
          transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Net end — follows pole */}
        <motion.path
          fill="#7d3627" opacity={0.7}
          animate={{
            d: [
              'M638 208 Q648 200 658 208 Q655 225 648 228 Q641 225 638 208 Z',
              'M642 203 Q652 195 662 203 Q659 220 652 223 Q645 220 642 203 Z',
              'M634 211 Q644 203 654 211 Q651 228 644 231 Q637 228 634 211 Z',
              'M638 208 Q648 200 658 208 Q655 225 648 228 Q641 225 638 208 Z',
            ],
          }}
          transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.ellipse
          cy="208" rx="12" ry="4" fill="#7d3627" opacity={0.8}
          animate={{ cx: [648, 652, 644, 648] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Left arm — gently oscillating with pole swing */}
        <motion.path
          stroke="#1a0e0a" strokeWidth="8" strokeLinecap="round" fill="none"
          animate={{
            d: [
              'M565 280 Q550 292 545 310',
              'M565 280 Q548 288 542 306',
              'M565 280 Q552 295 548 314',
              'M565 280 Q550 292 545 310',
            ],
          }}
          transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Legs */}
        <path d="M572 320 L568 350" stroke="#1a0e0a" strokeWidth="9" strokeLinecap="round" fill="none" />
        <path d="M588 320 L591 350" stroke="#1a0e0a" strokeWidth="9" strokeLinecap="round" fill="none" />
        <path d="M564 298 Q580 310 596 298 Q593 318 580 321 Q567 318 564 298 Z" fill="#2d1a10" opacity="0.9" />
        <ellipse cx="580" cy="347" rx="28" ry="6" fill="none" stroke="rgba(243,162,19,0.2)" strokeWidth="1.5" />
      </g>

      {/* ── DECORATIVE MADHUBANI BORDER ── */}
      <rect x="0" y="0" width="800" height="4" fill="#f3a213" opacity="0.6" />
      {Array.from({ length: 20 }).map((_, i) => (
        <circle key={i} cx={20 + i * 40} cy="12" r="3" fill="#f3a213" opacity="0.4" />
      ))}

      {/* ── STARS IN SKY — twinkling ── */}
      {[
        [50, 40], [130, 25], [220, 60], [300, 30], [420, 50],
        [470, 18], [540, 42], [720, 28], [760, 55], [380, 75],
      ].map(([x, y], i) => (
        <motion.circle
          key={i}
          cx={x} cy={y}
          r={i % 3 === 0 ? 2 : 1.5}
          fill="white"
          animate={{ opacity: [0.3, 0.9, 0.3] }}
          transition={{
            duration: 2 + (i % 4) * 0.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.3,
          }}
        />
      ))}

      {/* ── LABEL STAMP ── */}
      <rect x="18" y="400" width="180" height="48" rx="4" fill="rgba(243,162,19,0.12)" stroke="rgba(243,162,19,0.3)" strokeWidth="1" />
      <text x="108" y="420" textAnchor="middle" fontFamily="serif" fontSize="10" fill="#f3a213" opacity="0.85" letterSpacing="3">MITHILA</text>
      <text x="108" y="436" textAnchor="middle" fontFamily="serif" fontSize="8" fill="rgba(255,255,255,0.5)" letterSpacing="2">BIHAR · INDIA</text>
    </svg>
  );
}
