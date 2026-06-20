'use client';

import { motion } from 'framer-motion';

interface MakhanaRoastSceneProps {
  inView?: boolean;
  className?: string;
}

// Flame path morphing keyframes — 3 unique shapes per flame, cycled rather
// than flipped A-B-A, so the flicker reads as organic instead of mechanical
const flamePath1 =
  'M 190 210 C 188 195 182 185 186 170 C 188 160 195 155 192 140 C 196 155 204 160 202 175 C 200 190 205 200 203 210 Z';
const flamePath2 =
  'M 190 210 C 185 192 178 180 184 162 C 187 150 196 148 191 132 C 198 148 207 153 204 170 C 201 186 208 198 203 210 Z';
const flamePath2b =
  'M 190 210 C 187 198 184 187 188 173 C 191 163 191 152 187 142 C 194 152 201 162 199 178 C 197 192 203 199 203 210 Z';

const flamePath3 =
  'M 248 210 C 246 194 240 184 244 168 C 246 158 253 153 250 138 C 254 153 262 157 260 173 C 257 189 262 200 260 210 Z';
const flamePath4 =
  'M 248 210 C 243 191 236 179 242 160 C 245 148 254 145 249 128 C 256 145 265 150 262 168 C 259 184 266 197 260 210 Z';
const flamePath4b =
  'M 248 210 C 245 197 242 186 246 171 C 249 161 249 150 245 140 C 252 150 259 160 257 176 C 255 190 261 198 260 210 Z';

const flamePath5 =
  'M 308 210 C 306 196 299 186 303 170 C 305 160 313 155 309 140 C 313 155 321 159 319 175 C 317 190 322 201 320 210 Z';
const flamePath6 =
  'M 308 210 C 303 193 295 181 301 163 C 304 150 312 148 308 132 C 314 148 324 153 321 170 C 318 187 325 199 320 210 Z';
const flamePath6b =
  'M 308 210 C 305 199 301 188 305 174 C 308 164 307 153 304 143 C 310 153 318 163 316 178 C 314 192 319 199 320 210 Z';

// Small side flame
const sideFlame1 = 'M 160 210 C 158 200 153 193 156 182 C 158 175 164 172 161 162 C 164 172 170 175 168 183 C 167 192 171 200 169 210 Z';
const sideFlame2 = 'M 160 210 C 156 197 150 188 154 177 C 156 169 163 166 160 154 C 164 167 171 170 169 179 C 167 189 172 199 169 210 Z';

// Heat wave paths (2 states each)
const heatWave1a = 'M 175 230 Q 210 224 250 228 Q 290 232 325 226';
const heatWave1b = 'M 175 230 Q 210 228 250 222 Q 290 217 325 222';
const heatWave2a = 'M 185 218 Q 218 212 250 216 Q 282 220 315 214';
const heatWave2b = 'M 185 218 Q 218 215 250 210 Q 282 205 315 209';
const heatWave3a = 'M 200 207 Q 225 202 250 205 Q 275 208 300 203';
const heatWave3b = 'M 200 207 Q 225 205 250 200 Q 275 195 300 199';

// Steam wave paths
const steam1a = 'M 210 215 C 207 200 215 185 210 170 C 205 155 212 140 208 125';
const steam2a = 'M 250 215 C 247 198 255 181 250 164 C 245 147 252 130 248 113';
const steam3a = 'M 290 215 C 287 200 295 184 290 169 C 285 153 292 137 288 122';

// Makhana positions in/around wok
const wokSeeds = [
  { cx: 205, cy: 225, r: 7 },
  { cx: 222, cy: 232, r: 6 },
  { cx: 240, cy: 220, r: 7.5 },
  { cx: 258, cy: 229, r: 6 },
  { cx: 274, cy: 222, r: 7 },
  { cx: 290, cy: 231, r: 6.5 },
  { cx: 215, cy: 238, r: 5.5 },
  { cx: 265, cy: 238, r: 6 },
  { cx: 248, cy: 238, r: 5 },
];

// Seeds that pop upward out of the wok
const poppingSeeds = [
  { cx: 218, startY: 225, delay: 0 },
  { cx: 245, startY: 222, delay: 1.2 },
  { cx: 268, startY: 226, delay: 2.4 },
  { cx: 232, startY: 230, delay: 3.6 },
  { cx: 258, startY: 224, delay: 0.8 },
];

// Falling/arcing seeds (tossed in the air)
const arcingSeeds = [
  { startX: 225, startY: 215, dx: -40, dy: -55, delay: 0.5 },
  { startX: 270, startY: 218, dx: 45, dy: -60, delay: 2.0 },
  { startX: 248, startY: 215, dx: 20, dy: -70, delay: 3.2 },
];

export default function MakhanaRoastScene({ inView, className = '' }: MakhanaRoastSceneProps) {
  const shouldAnimate = inView === undefined ? true : inView;

  return (
    <svg
      viewBox="0 0 500 380"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* Makhana sphere gradient */}
        <radialGradient id="mk-roast" cx="32%" cy="28%" r="70%">
          <stop offset="0%" stopColor="#fdfbf7" />
          <stop offset="40%" stopColor="#f0dfc0" />
          <stop offset="75%" stopColor="#d4b485" />
          <stop offset="100%" stopColor="#b8916a" />
        </radialGradient>

        {/* Wok gradient */}
        <radialGradient id="wok-body" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#5a3318" />
          <stop offset="60%" stopColor="#3a2010" />
          <stop offset="100%" stopColor="#261408" />
        </radialGradient>

        {/* Wok inner dark */}
        <radialGradient id="wok-inner" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="#2a1208" />
          <stop offset="100%" stopColor="#1a0a04" />
        </radialGradient>

        {/* Fire glow gradient */}
        <radialGradient id="fire-glow" cx="50%" cy="100%" r="70%">
          <stop offset="0%" stopColor="#e06010" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#e06010" stopOpacity="0" />
        </radialGradient>

        {/* Log gradient */}
        <linearGradient id="log-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6b3a18" />
          <stop offset="100%" stopColor="#3d1e08" />
        </linearGradient>

        {/* Ember glow */}
        <radialGradient id="ember-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ff6a00" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#ff6a00" stopOpacity="0" />
        </radialGradient>

        {/* Wok rim gold */}
        <linearGradient id="wok-rim" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#c4a878" stopOpacity="0.5" />
          <stop offset="30%" stopColor="#f3d080" stopOpacity="1" />
          <stop offset="50%" stopColor="#ffe08a" stopOpacity="1" />
          <stop offset="70%" stopColor="#f3d080" stopOpacity="1" />
          <stop offset="100%" stopColor="#c4a878" stopOpacity="0.5" />
        </linearGradient>

        {/* Stamp bg */}
        <linearGradient id="stamp-bg" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#f3a213" stopOpacity="0.15" />
          <stop offset="50%" stopColor="#f3a213" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#f3a213" stopOpacity="0.15" />
        </linearGradient>

        {/* Clip wok interior */}
        <clipPath id="wok-clip">
          <ellipse cx="250" cy="235" rx="92" ry="22" />
        </clipPath>
      </defs>

      {/* ── FIRE GLOW (ambient) ── */}
      <ellipse cx="250" cy="270" rx="140" ry="60" fill="url(#fire-glow)" opacity="0.8" />

      {/* ── WOOD LOGS ── */}
      {/* Log 1 - center */}
      <rect x="195" y="278" width="110" height="18" rx="9" fill="url(#log-grad)" />
      <rect x="198" y="280" width="104" height="6" rx="3" fill="#8b5020" opacity="0.4" />
      {/* Log 2 - left diagonal */}
      <rect
        x="155"
        y="275"
        width="100"
        height="16"
        rx="8"
        fill="url(#log-grad)"
        transform="rotate(-12 205 283)"
      />
      {/* Log 3 - right diagonal */}
      <rect
        x="245"
        y="275"
        width="100"
        height="16"
        rx="8"
        fill="url(#log-grad)"
        transform="rotate(12 295 283)"
      />
      {/* Log 4 - back */}
      <rect x="205" y="271" width="90" height="13" rx="6.5" fill="#3a1e08" opacity="0.8" />

      {/* Log end rings */}
      <ellipse cx="195" cy="287" rx="9" ry="9" fill="#6b3a18" />
      <ellipse cx="195" cy="287" rx="6" ry="6" fill="#4a2510" />
      <ellipse cx="195" cy="287" rx="3" ry="3" fill="#3a1e08" />
      <ellipse cx="305" cy="287" rx="9" ry="9" fill="#6b3a18" />
      <ellipse cx="305" cy="287" rx="6" ry="6" fill="#4a2510" />
      <ellipse cx="305" cy="287" rx="3" ry="3" fill="#3a1e08" />

      {/* ── EMBER BED ── */}
      <ellipse cx="250" cy="286" rx="70" ry="8" fill="#e06010" opacity="0.4" />
      {[235, 250, 265, 242, 258].map((cx, i) => (
        <motion.circle
          key={`ember-${i}`}
          cx={cx}
          cy={286 + (i % 2 === 0 ? 0 : 2)}
          r={3 + (i % 3)}
          fill="#ff8c00"
          animate={shouldAnimate ? { opacity: [0.4, 0.9, 0.5, 1, 0.4] } : { opacity: 0.6 }}
          transition={{ duration: 0.6 + i * 0.15, repeat: Infinity, delay: i * 0.1 }}
        />
      ))}

      {/* ── FLAMES ── */}
      {/* Left side small flame */}
      <motion.path
        d={sideFlame1}
        fill="#e06010"
        opacity={0.8}
        animate={
          shouldAnimate
            ? { d: [sideFlame1, sideFlame2, sideFlame1], opacity: [0.7, 1, 0.7] }
            : {}
        }
        transition={{ duration: 0.7, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Main flame 1 */}
      <motion.path
        d={flamePath1}
        fill="#f3a213"
        animate={
          shouldAnimate
            ? { d: [flamePath1, flamePath2, flamePath2b, flamePath1], opacity: [0.7, 1, 0.85, 0.9, 0.7] }
            : {}
        }
        transition={{ duration: 1.3, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Main flame 2 */}
      <motion.path
        d={flamePath3}
        fill="#e06010"
        animate={
          shouldAnimate
            ? { d: [flamePath3, flamePath4, flamePath4b, flamePath3], opacity: [0.7, 1, 0.85, 0.9, 0.7] }
            : {}
        }
        transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut', delay: 0.15 }}
      />
      {/* Main flame 3 */}
      <motion.path
        d={flamePath5}
        fill="#f3a213"
        animate={
          shouldAnimate
            ? { d: [flamePath5, flamePath6, flamePath6b, flamePath5], opacity: [0.7, 1, 0.85, 0.9, 0.7] }
            : {}
        }
        transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
      />
      {/* Bright core flame overlay */}
      <motion.path
        d={flamePath3}
        fill="#ffe08a"
        animate={
          shouldAnimate
            ? { d: [flamePath3, flamePath4, flamePath4b, flamePath3], opacity: [0.3, 0.6, 0.45, 0.3] }
            : { opacity: 0.4 }
        }
        transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut', delay: 0.15 }}
      />

      {/* ── KADHAI / WOK BODY ── */}
      {/* Bowl shape */}
      <path
        d="M 158 235 Q 148 265 155 280 Q 175 310 250 315 Q 325 310 345 280 Q 352 265 342 235 Z"
        fill="url(#wok-body)"
      />
      {/* Wok highlight */}
      <path
        d="M 165 240 Q 162 258 168 270"
        stroke="#6b4020"
        strokeWidth="2"
        opacity="0.4"
        fill="none"
      />
      <path
        d="M 335 240 Q 338 258 332 270"
        stroke="#6b4020"
        strokeWidth="2"
        opacity="0.4"
        fill="none"
      />

      {/* Wok bottom */}
      <ellipse cx="250" cy="310" rx="68" ry="10" fill="#261408" />

      {/* Wok inner dark (opening top) */}
      <ellipse cx="250" cy="235" rx="92" ry="22" fill="url(#wok-inner)" />

      {/* ── HEAT WAVES ── */}
      <motion.path
        d={heatWave1a}
        stroke="rgba(243,162,19,0.3)"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        animate={
          shouldAnimate
            ? { d: [heatWave1a, heatWave1b, heatWave1a], opacity: [0.15, 0.4, 0.15] }
            : { opacity: 0.2 }
        }
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.path
        d={heatWave2a}
        stroke="rgba(243,162,19,0.3)"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        animate={
          shouldAnimate
            ? { d: [heatWave2a, heatWave2b, heatWave2a], opacity: [0.15, 0.4, 0.15] }
            : { opacity: 0.2 }
        }
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
      />
      <motion.path
        d={heatWave3a}
        stroke="rgba(243,162,19,0.3)"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        animate={
          shouldAnimate
            ? { d: [heatWave3a, heatWave3b, heatWave3a], opacity: [0.15, 0.4, 0.15] }
            : { opacity: 0.2 }
        }
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
      />

      {/* ── MAKHANA SEEDS IN WOK (static resting seeds) ── */}
      {wokSeeds.map((seed, i) => (
        <motion.circle
          key={`wok-seed-${i}`}
          cx={seed.cx}
          cy={seed.cy}
          r={seed.r}
          fill="#f5ead8"
          animate={
            shouldAnimate
              ? { y: [0, -4, 0, -3, 0] }
              : {}
          }
          transition={{
            duration: 1.2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.18,
          }}
        />
      ))}
      {/* Seed highlight dots */}
      {wokSeeds.map((seed, i) => (
        <circle
          key={`wok-seed-hl-${i}`}
          cx={seed.cx - seed.r * 0.3}
          cy={seed.cy - seed.r * 0.3}
          r={seed.r * 0.3}
          fill="white"
          opacity="0.5"
        />
      ))}

      {/* ── POPPING SEEDS (shoot upward) ── */}
      {poppingSeeds.map((seed, i) => (
        <motion.circle
          key={`pop-seed-${i}`}
          cx={seed.cx}
          cy={seed.startY}
          r={6}
          fill="#f5ead8"
          initial={{ y: 0, opacity: 0.8, scale: 0.8 }}
          animate={
            shouldAnimate
              ? {
                  y: [0, -60, -110],
                  opacity: [0.9, 1, 0],
                  scale: [0.8, 1.2, 0.5],
                }
              : {}
          }
          transition={{
            duration: 1.6,
            repeat: Infinity,
            ease: 'easeOut',
            delay: seed.delay,
            repeatDelay: 2.5,
          }}
        />
      ))}

      {/* ── ARCING / FALLING SEEDS ── */}
      {arcingSeeds.map((seed, i) => (
        <motion.circle
          key={`arc-seed-${i}`}
          cx={seed.startX}
          cy={seed.startY}
          r={5.5}
          fill="#f5ead8"
          opacity={0}
          animate={
            shouldAnimate
              ? {
                  x: [0, seed.dx * 0.4, seed.dx],
                  y: [0, seed.dy, seed.dy * 0.3 + 30],
                  opacity: [0, 0.9, 0.7, 0],
                  scale: [1, 1.1, 0.9],
                }
              : {}
          }
          transition={{
            duration: 2.2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: seed.delay,
            repeatDelay: 3,
          }}
        />
      ))}

      {/* ── STEAM LINES ── */}
      <motion.path
        d={steam1a}
        stroke="rgba(255,255,255,0.25)"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={
          shouldAnimate
            ? {
                pathLength: [0, 1, 1],
                opacity: [0, 0.3, 0],
              }
            : {}
        }
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0 }}
      />
      <motion.path
        d={steam2a}
        stroke="rgba(255,255,255,0.25)"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={
          shouldAnimate
            ? {
                pathLength: [0, 1, 1],
                opacity: [0, 0.3, 0],
              }
            : {}
        }
        transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
      />
      <motion.path
        d={steam3a}
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={
          shouldAnimate
            ? {
                pathLength: [0, 1, 1],
                opacity: [0, 0.3, 0],
              }
            : {}
        }
        transition={{ duration: 2.3, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
      />

      {/* ── WOK RIM ── */}
      <ellipse
        cx="250"
        cy="235"
        rx="92"
        ry="22"
        stroke="url(#wok-rim)"
        strokeWidth="4"
        fill="none"
      />
      <ellipse
        cx="250"
        cy="235"
        rx="89"
        ry="19"
        stroke="#f3d080"
        strokeWidth="1"
        fill="none"
        opacity="0.25"
      />

      {/* ── WOK HANDLE (left) ── */}
      <path
        d="M 158 235 Q 135 230 122 238 Q 118 245 125 250 Q 138 252 158 245"
        stroke="#3a2010"
        strokeWidth="8"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 158 235 Q 135 230 122 238 Q 118 245 125 250 Q 138 252 158 245"
        stroke="#6b4020"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        opacity="0.5"
      />

      {/* ── STIRRING HAND / ARM ── */}
      <motion.g
        animate={
          shouldAnimate
            ? {
                rotate: [-15, 15, -15],
                originX: '50%',
                originY: '100%',
              }
            : {}
        }
        style={{ originX: 340, originY: 240 }}
        transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* Arm */}
        <path
          d="M 370 300 Q 360 270 345 248 Q 338 238 330 232"
          stroke="#c4a878"
          strokeWidth="9"
          strokeLinecap="round"
          fill="none"
        />
        {/* Hand */}
        <ellipse
          cx="327"
          cy="229"
          rx="10"
          ry="7"
          fill="#c4a878"
          transform="rotate(-30 327 229)"
        />
        {/* Ladle handle — gripped directly at the hand's actual position */}
        <line x1="327" y1="229" x2="313" y2="233" stroke="#8a6030" strokeWidth="3" strokeLinecap="round" />
        {/* Ladle bowl, attached at the handle's far end */}
        <path
          d="M 313 233 Q 305 227 303 235 Q 301 243 309 243 Q 317 244 318 237 Q 318 234 313 233 Z"
          stroke="#8a6030"
          strokeWidth="2"
          fill="#6b4820"
          strokeLinecap="round"
        />
      </motion.g>

      {/* ── DECORATIVE LABEL (bottom) ── */}
      <rect
        x="148"
        y="338"
        width="204"
        height="30"
        rx="8"
        fill="url(#stamp-bg)"
        stroke="#f3a213"
        strokeWidth="1"
        strokeOpacity="0.4"
        strokeDasharray="3 3"
      />
      <text
        x="250"
        y="358"
        textAnchor="middle"
        fontFamily="serif"
        fontSize="11"
        fontWeight="bold"
        fill="#f3a213"
        opacity="0.85"
        letterSpacing="2"
      >
        ROASTED NOT FRIED
      </text>

      {/* ── DECORATIVE SPARKS ── */}
      {[
        { cx: 175, cy: 200, delay: 0.2 },
        { cx: 310, cy: 195, delay: 1.0 },
        { cx: 230, cy: 180, delay: 1.8 },
        { cx: 268, cy: 185, delay: 0.6 },
      ].map((spark, i) => (
        <motion.g
          key={`spark-${i}`}
          animate={
            shouldAnimate
              ? {
                  opacity: [0, 1, 0],
                  scale: [0.5, 1.2, 0.5],
                }
              : { opacity: 0.5 }
          }
          transition={{
            duration: 0.9,
            repeat: Infinity,
            delay: spark.delay,
            repeatDelay: 1.5,
          }}
          style={{ originX: spark.cx, originY: spark.cy }}
        >
          <line
            x1={spark.cx}
            y1={spark.cy - 5}
            x2={spark.cx}
            y2={spark.cy + 5}
            stroke="#f3a213"
            strokeWidth="1.5"
          />
          <line
            x1={spark.cx - 5}
            y1={spark.cy}
            x2={spark.cx + 5}
            y2={spark.cy}
            stroke="#f3a213"
            strokeWidth="1.5"
          />
          <circle cx={spark.cx} cy={spark.cy} r="1.5" fill="#ffe08a" />
        </motion.g>
      ))}
    </svg>
  );
}
