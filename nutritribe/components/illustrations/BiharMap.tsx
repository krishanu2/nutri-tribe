'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';

type Stage = 0 | 1 | 2;

const STAGE_META = [
  { label: 'India',   color: '#f3a213', stat: '28',    statLabel: 'Indian states',          sub: 'A nation of ancient wisdom — Bihar sits at its living heart.' },
  { label: 'Bihar',   color: '#7d3627', stat: '90%',   statLabel: 'of India\'s Makhana',    sub: 'The Gangetic plains of Bihar have nurtured civilisations — and the finest Makhana — for millennia.' },
  { label: 'Mithila', color: '#009846', stat: '2,500+', statLabel: 'years of heritage',     sub: 'Lotus ponds, Madhubani art, and Makhana fields — this is where NutriTribe was born.' },
];

/* ══════════════════════════════════
   STAGE 0 — India, Bihar highlighted
══════════════════════════════════ */
function IndiaMap({ onZoom }: { onZoom: () => void }) {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg viewBox="0 0 360 430" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full max-h-[420px]">
        <defs>
          <radialGradient id="i-bg" cx="50%" cy="50%" r="55%">
            <stop offset="0%" stopColor="#f3a213" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#f3a213" stopOpacity="0" />
          </radialGradient>
          <filter id="i-glow">
            <feGaussianBlur stdDeviation="2.5" result="b" />
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        <ellipse cx="178" cy="215" rx="155" ry="185" fill="url(#i-bg)" />

        {/* ── India mainland — geographically accurate simplified path ── */}
        {/* Starting NW, going clockwise */}
        <path
          d="
            M 130 24   L 148 18   L 164 16   L 182 18   L 200 22
            L 216 27   L 228 34   L 238 44   L 244 55   L 248 68
            L 250 80   L 250 92   L 248 104
            L 256 112  L 264 120  L 270 130  L 272 142  L 268 154
            L 272 162  L 278 172  L 282 182  L 280 194  L 276 206
            L 274 218  L 278 230  L 282 242  L 280 256
            L 275 268  L 268 278  L 260 288  L 250 298  L 238 310
            L 226 322  L 214 334  L 204 348  L 196 362  L 190 376
            L 186 390  L 182 402  L 178 412
            L 174 402  L 170 390  L 166 376  L 161 362  L 153 348
            L 143 334  L 132 322  L 120 310  L 109 298  L 100 287
            L 91  276  L 83  265  L 77  253
            L 75  240  L 79  228  L 83  218  L 81  206  L 77  194
            L 73  183  L 70  172  L 68  162  L 72  152  L 78  142
            L 84  132  L 88  122  L 86  110  L 84  98   L 86  86
            L 90  75   L 97  64   L 106 54   L 117 44   L 128 36
            Z
          "
          fill="#f3a213"
          fillOpacity="0.11"
          stroke="#f3a213"
          strokeOpacity="0.38"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* NE protrusion (Seven Sisters region) */}
        <path
          d="M248 104 L256 100 L268 97 L280 98 L290 104 L295 114 L290 122 L278 122 L268 118 L258 112 L250 104 Z"
          fill="#f3a213" fillOpacity="0.09" stroke="#f3a213" strokeOpacity="0.22" strokeWidth="1" />

        {/* Gujarat peninsula */}
        <path
          d="M75 188 L64 182 L56 172 L54 160 L58 152 L66 150 L72 157 L74 168 L72 176 Z"
          fill="#f3a213" fillOpacity="0.09" stroke="#f3a213" strokeOpacity="0.2" strokeWidth="1" />

        {/* ── Bihar highlight — correct position: right-center ── */}
        {/* Bihar: ~60% from left, ~38% from top in India */}
        <motion.path
          d="M198 152 L216 149 L232 151 L244 157 L248 166 L246 176 L240 184 L226 190 L210 192 L194 190 L180 186 L174 177 L174 167 L178 158 Z"
          fill="#7d3627"
          fillOpacity="0.9"
          stroke="#f3a213"
          strokeWidth="2"
          strokeOpacity="0.9"
          filter="url(#i-glow)"
          animate={{ fillOpacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* BIHAR label */}
        <text x="211" y="174" textAnchor="middle" fill="#f3a213" fontSize="7.5" fontWeight="bold" fontFamily="sans-serif" letterSpacing="1">BIHAR</text>

        {/* Radar rings on Bihar */}
        <motion.circle cx="211" cy="171" r="4"
          fill="none" stroke="#f3a213" strokeWidth="1.5"
          animate={{ r: [4, 18, 4], opacity: [1, 0, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
        />
        <circle cx="211" cy="171" r="4" fill="#f3a213" />

        {/* Major city dots */}
        {[[140,196,'Mumbai'],[175,308,'Chennai'],[104,160,'Delhi']].map(([x,y,n])=>(
          <g key={String(n)}>
            <circle cx={Number(x)} cy={Number(y)} r="2" fill="#f3a213" fillOpacity="0.3" />
          </g>
        ))}

        {/* Compass */}
        <g transform="translate(40,46)">
          <circle cx="0" cy="0" r="13" fill="none" stroke="#f3a213" strokeOpacity="0.22" strokeWidth="1"/>
          <text x="0" y="-17" textAnchor="middle" fill="#f3a213" fillOpacity="0.5" fontSize="7" fontFamily="sans-serif">N</text>
          <path d="M0,-9 L2.5,0 L0,3 L-2.5,0 Z" fill="#f3a213" fillOpacity="0.65" />
          <path d="M0,9 L2.5,0 L0,-3 L-2.5,0 Z" fill="#f3a213" fillOpacity="0.22" />
        </g>

        {/* INDIA label top right */}
        <text x="282" y="32" textAnchor="end" fill="#f3a213" fontSize="11" fontWeight="bold" fontFamily="sans-serif" fillOpacity="0.5" letterSpacing="2">INDIA</text>
      </svg>

      {/* Zoom CTA */}
      <motion.button
        onClick={onZoom}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 font-body font-semibold text-[11px] tracking-widest uppercase px-5 py-2.5 rounded-full border"
        style={{ color: '#f3a213', borderColor: '#f3a21350', background: '#f3a21312' }}
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        whileHover={{ scale: 1.05, background: '#f3a21322' }}
        whileTap={{ scale: 0.97 }}
      >
        Zoom into Bihar
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M6 1v10M1 6l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </motion.button>
    </div>
  );
}

/* ══════════════════════════════════
   STAGE 1 — Bihar state, Mithila highlighted
══════════════════════════════════ */
function BiharStateMap({ onZoom, onBack }: { onZoom: () => void; onBack: () => void }) {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg viewBox="0 0 400 330" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full max-h-[400px]">
        <defs>
          <filter id="b-glow">
            <feGaussianBlur stdDeviation="4" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <pattern id="b-dots" x="0" y="0" width="18" height="18" patternUnits="userSpaceOnUse">
            <circle cx="9" cy="9" r="1" fill="#f3a213" fillOpacity="0.12"/>
          </pattern>
        </defs>

        {/* Bihar boundary */}
        <path
          d="M52 46 L88 40 L128 36 L172 34 L214 36 L248 42 L274 52 L296 66 L312 82 L322 100
             L326 120 L320 142 L308 160 L292 175 L272 187 L248 196 L220 202 L190 204
             L160 202 L132 194 L108 182 L86 167 L68 150 L54 130 L46 108 L44 84 Z"
          fill="url(#b-dots)"
          stroke="#7d3627"
          strokeWidth="2.5"
          strokeOpacity="0.5"
        />

        {/* Neighboring state labels */}
        {[
          { x: 185, y: 20,  label: 'NEPAL' },
          { x: 30,  y: 120, label: 'U.P.' },
          { x: 344, y: 130, label: 'W.B.' },
          { x: 185, y: 222, label: 'JHARKHAND' },
          { x: 42,  y: 220, label: 'ORISSA' },
        ].map(l => (
          <text key={l.label} x={l.x} y={l.y} textAnchor="middle"
            fill="#7d3627" fillOpacity="0.35" fontSize="8" fontFamily="sans-serif" letterSpacing="1">
            {l.label}
          </text>
        ))}

        {/* Mithila region — north Bihar (matches reference: upper ~40%) */}
        <motion.path
          d="M70 46 L116 38 L168 34 L214 36 L252 44 L272 54 L276 70 L272 92
             L260 112 L242 128 L220 140 L196 148 L170 150 L144 147 L118 140
             L96 128 L76 112 L64 92 L62 70 Z"
          fill="#009846"
          fillOpacity="0.22"
          stroke="#009846"
          strokeWidth="2.5"
          strokeDasharray="8 4"
          filter="url(#b-glow)"
          animate={{ strokeOpacity: [0.4, 0.9, 0.4], fillOpacity: [0.12, 0.28, 0.12] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        />

        {/* MITHILA REGION label */}
        <text x="170" y="90" textAnchor="middle" fill="#009846" fontSize="11" fontWeight="bold" fontFamily="sans-serif">MITHILA</text>
        <text x="170" y="104" textAnchor="middle" fill="#009846" fontSize="8" fontFamily="sans-serif" fontStyle="italic">REGION</text>

        {/* Mithila pulse */}
        <motion.circle cx="170" cy="82" r="8"
          fill="none" stroke="#009846" strokeWidth="2"
          animate={{ r: [6, 18, 6], opacity: [1, 0, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <circle cx="170" cy="82" r="5" fill="#009846" fillOpacity="0.8" />
        <circle cx="170" cy="82" r="2.5" fill="#f3a213" />

        {/* Ganga river */}
        <path d="M44 182 Q118 170 196 174 Q268 178 326 168"
          stroke="#60a5fa" strokeWidth="1.5" strokeOpacity="0.4" fill="none" strokeDasharray="5 3"/>
        <text x="185" y="188" textAnchor="middle" fill="#60a5fa" fontSize="7" fillOpacity="0.55" fontFamily="sans-serif">~ Ganga ~</text>

        {/* Cities */}
        {[
          { x: 186, y: 182, label: 'Patna',       cap: true  },
          { x: 170, y: 84,  label: '',             cap: false },
          { x: 120, y: 106, label: 'Muzaffarpur', cap: false },
          { x: 222, y: 88,  label: 'Madhubani',   cap: false },
          { x: 265, y: 162, label: 'Bhagalpur',   cap: false },
        ].map(c => (
          <g key={c.label || 'center'}>
            <circle cx={c.x} cy={c.y} r={c.cap ? 4 : 2.5}
              fill={c.cap ? '#f3a213' : '#7d3627'}
              fillOpacity={c.cap ? 1 : 0.65}
            />
            {c.label && (
              <text x={c.x + 6} y={c.y + 4}
                fill={c.cap ? '#f3a213' : '#7d3627'}
                fontSize={c.cap ? 8.5 : 7.5} fontFamily="sans-serif"
                fontWeight={c.cap ? 'bold' : 'normal'}>
                {c.label}
              </text>
            )}
          </g>
        ))}

        {/* Madhubani border motif */}
        {[...Array(12)].map((_,i)=>(
          <g key={i} transform={`translate(${32+i*28},18)`}>
            <path d="M0 0 L4 -6 L8 0" stroke="#f3a213" strokeOpacity="0.18" strokeWidth="1" fill="none"/>
            <circle cx="4" cy="-8" r="1.2" fill="#f3a213" fillOpacity="0.15"/>
          </g>
        ))}
      </svg>

      {/* Nav buttons */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3">
        <button onClick={onBack}
          className="font-body font-semibold text-[11px] tracking-widest uppercase px-4 py-2 rounded-full border"
          style={{ color: '#7d3627', borderColor: '#7d362740', background: '#7d362712' }}>
          ← India
        </button>
        <motion.button onClick={onZoom}
          className="flex items-center gap-2 font-body font-semibold text-[11px] tracking-widest uppercase px-5 py-2 rounded-full border"
          style={{ color: '#009846', borderColor: '#00984650', background: '#00984612' }}
          animate={{ y: [0, -3, 0] }} transition={{ duration: 2, repeat: Infinity }}
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
          Zoom to Mithila
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M6 1v10M1 6l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════
   STAGE 2 — Mithila cultural close-up
══════════════════════════════════ */
function MithilaMap({ onBack }: { onBack: () => void }) {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg viewBox="0 0 440 360" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full max-h-[400px]">
        <defs>
          <radialGradient id="m-bg" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#009846" stopOpacity="0.08"/>
            <stop offset="100%" stopColor="#009846" stopOpacity="0"/>
          </radialGradient>
          <radialGradient id="m-pond" cx="50%" cy="40%" r="55%">
            <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.3"/>
            <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.04"/>
          </radialGradient>
          <pattern id="m-motif" x="0" y="0" width="22" height="22" patternUnits="userSpaceOnUse">
            <path d="M11 2 L13 7 L18 7 L14 11 L16 16 L11 12 L6 16 L8 11 L4 7 L9 7 Z"
              fill="#f3a213" fillOpacity="0.065"/>
          </pattern>
        </defs>

        <rect width="440" height="360" fill="url(#m-bg)"/>
        <rect width="440" height="360" fill="url(#m-motif)"/>

        {/* Mithila boundary */}
        <path
          d="M36 56 L96 40 L168 34 L242 38 L304 52 L344 70 L362 96 L360 126
             L350 156 L332 178 L308 196 L280 210 L250 220 L218 224 L186 224
             L154 218 L122 206 L96 190 L72 170 L52 146 L38 118 L32 88 Z"
          fill="none" stroke="#009846" strokeWidth="2.5" strokeOpacity="0.4" strokeDasharray="10 5"
        />

        {/* Neighbour labels */}
        {[
          { x: 196, y: 18,  t: 'NEPAL' },
          { x: 30,  y: 140, t: 'U.P.' },
          { x: 408, y: 130, t: 'W.B.' },
          { x: 196, y: 244, t: 'SOUTH BIHAR' },
        ].map(l=>(
          <text key={l.t} x={l.x} y={l.y} textAnchor="middle" fill="#009846"
            fillOpacity="0.3" fontSize="8" fontFamily="sans-serif" letterSpacing="1">{l.t}</text>
        ))}

        {/* Lotus ponds */}
        {[
          { cx:112, cy:128, rx:38, ry:19 },
          { cx:262, cy:108, rx:30, ry:16 },
          { cx:192, cy:182, rx:22, ry:12 },
        ].map((p,i)=>(
          <g key={i}>
            <ellipse {...p} fill="url(#m-pond)"/>
            <ellipse {...p} stroke="#60a5fa" strokeWidth="1" strokeOpacity="0.45" fill="none"/>
            {[0.25,0.5,0.75].map((t,j)=>{
              const lx = p.cx - p.rx + t * 2 * p.rx;
              return (
                <g key={j} transform={`translate(${lx},${p.cy-2})`}>
                  {[0,60,120,180,240,300].map(deg=>(
                    <ellipse key={deg}
                      cx={5*Math.cos(deg*Math.PI/180)} cy={5*Math.sin(deg*Math.PI/180)}
                      rx="2.5" ry="1.2" fill="#f472b6" fillOpacity="0.5"
                      transform={`rotate(${deg},${5*Math.cos(deg*Math.PI/180)},${5*Math.sin(deg*Math.PI/180)})`}
                    />
                  ))}
                  <circle cx="0" cy="0" r="2" fill="#f3a213" fillOpacity="0.65"/>
                </g>
              );
            })}
            <text x={p.cx} y={p.cy+p.ry+11} textAnchor="middle"
              fill="#60a5fa" fontSize="7" fillOpacity="0.6" fontFamily="sans-serif">lotus pond</text>
          </g>
        ))}

        {/* Makhana plants */}
        {[[155,148],[284,134],[80,170],[338,166],[218,90],[136,204],[298,192],[178,56]].map(([x,y],i)=>(
          <g key={i} transform={`translate(${x},${y})`}>
            <circle cx="0" cy="0" r="5" fill="#fdfbf7" stroke="#d4b485" strokeWidth="0.8"/>
            <circle cx="-1.5" cy="-1.5" r="1.5" fill="white" fillOpacity="0.6"/>
            <path d="M0 5 Q-3 11 -5 17" stroke="#009846" strokeWidth="0.9" strokeOpacity="0.4" fill="none"/>
            <ellipse cx="-5" cy="17" rx="4.5" ry="2.5" fill="#009846" fillOpacity="0.25" transform="rotate(-20,-5,17)"/>
          </g>
        ))}

        {/* Village huts */}
        {[[108,242,'Darbhanga'],[200,256,'Sitamarhi'],[290,246,'Madhubani']].map(v=>(
          <g key={v[2]}>
            <rect x={Number(v[0])-8} y={Number(v[1])-7} width="16" height="11" fill="#7d3627" fillOpacity="0.35" rx="1"/>
            <path d={`M${Number(v[0])-11} ${Number(v[1])-7} L${v[0]} ${Number(v[1])-18} L${Number(v[0])+11} ${Number(v[1])-7}`}
              fill="#7d3627" fillOpacity="0.55"/>
            <text x={v[0]} y={Number(v[1])+12} textAnchor="middle"
              fill="#7d3627" fontSize="7.5" fontFamily="sans-serif" fontWeight="bold">{v[2]}</text>
          </g>
        ))}

        {/* Heartland star */}
        <motion.circle cx="196" cy="130" r="16" fill="none" stroke="#f3a213" strokeWidth="2"
          animate={{ r:[12,24,12], opacity:[1,0,1] }} transition={{ duration:2, repeat:Infinity }}/>
        <circle cx="196" cy="130" r="10" fill="#f3a213" fillOpacity="0.18" stroke="#f3a213" strokeWidth="2"/>
        <text x="196" y="134" textAnchor="middle" fill="#f3a213" fontSize="9" fontWeight="bold" fontFamily="sans-serif">★</text>

        {/* Madhubani border top & bottom */}
        {[14,342].map((y,r)=>[...Array(19)].map((_,i)=>(
          <g key={`${r}-${i}`} transform={`translate(${20+i*22},${y})`}>
            <path d="M0 0 L5 -7 L10 0 L5 5 Z" fill="#f3a213" fillOpacity="0.15"/>
          </g>
        )))}

        {/* Title */}
        <text x="220" y="310" textAnchor="middle" fill="#f3a213" fontSize="14" fontWeight="bold"
          fontFamily="serif" fontStyle="italic">Mithila — The Makhana Heartland</text>
        <text x="220" y="326" textAnchor="middle" fill="#009846" fontSize="8.5" fontFamily="sans-serif">
          90% of India&apos;s Makhana grows in these ancient wetlands
        </text>
      </svg>

      <button onClick={onBack}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 font-body font-semibold text-[11px] tracking-widest uppercase px-4 py-2 rounded-full border"
        style={{ color: '#009846', borderColor: '#00984640', background: '#00984612' }}>
        ← Bihar
      </button>
    </div>
  );
}

/* ══════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════ */
interface BiharMapProps { className?: string }

export default function BiharMap({ className = '' }: BiharMapProps) {
  const [stage, setStage] = useState<Stage>(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-20% 0px' });

  // Auto-advance stages
  useEffect(() => {
    if (!autoPlay || !inView) return;
    const t = setTimeout(() => setStage(s => (s < 2 ? (s + 1) as Stage : s)), 3000);
    return () => clearTimeout(t);
  }, [stage, autoPlay, inView]);

  const meta = STAGE_META[stage];

  const zoomVariants = {
    enter:  { opacity: 0, scale: 1.08, filter: 'blur(4px)' },
    center: { opacity: 1, scale: 1,    filter: 'blur(0px)' },
    exit:   { opacity: 0, scale: 0.93, filter: 'blur(4px)' },
  };

  return (
    <div ref={ref} className={`relative w-full max-w-2xl mx-auto select-none ${className}`}>

      {/* Stage stepper */}
      <div className="flex items-center justify-center gap-1 mb-5">
        {STAGE_META.map((s, i) => (
          <div key={s.label} className="flex items-center">
            <button
              onClick={() => { setStage(i as Stage); setAutoPlay(false); }}
              className="flex flex-col items-center gap-1.5 px-3 py-1.5"
            >
              <motion.div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2"
                animate={{
                  backgroundColor: i <= stage ? meta.color : 'transparent',
                  borderColor: i <= stage ? meta.color : meta.color + '35',
                  color: i <= stage ? '#fff' : meta.color + '55',
                }}
                transition={{ duration: 0.35 }}
              >
                {i + 1}
              </motion.div>
              <span className="font-body text-[10px] font-semibold"
                style={{ color: i <= stage ? meta.color : meta.color + '45' }}>
                {s.label}
              </span>
            </button>
            {i < 2 && (
              <motion.div className="h-px w-6 mx-0.5"
                animate={{ backgroundColor: i < stage ? meta.color : meta.color + '25' }}
                transition={{ duration: 0.4 }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Map frame */}
      <div className="relative rounded-2xl overflow-hidden border border-earthen-rust/10 bg-ivory-grain/80 shadow-card"
        style={{ aspectRatio: '4/3' }}>

        <AnimatePresence mode="wait">
          <motion.div key={stage} className="absolute inset-0 p-3"
            variants={zoomVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {stage === 0 && <IndiaMap onZoom={() => { setStage(1); setAutoPlay(false); }} />}
            {stage === 1 && <BiharStateMap onZoom={() => { setStage(2); setAutoPlay(false); }} onBack={() => { setStage(0); setAutoPlay(false); }} />}
            {stage === 2 && <MithilaMap onBack={() => { setStage(1); setAutoPlay(false); }} />}
          </motion.div>
        </AnimatePresence>

        {/* Stage badge */}
        <div className="absolute top-3 left-3 px-3 py-1.5 rounded-full backdrop-blur-sm border"
          style={{ backgroundColor: meta.color + '18', borderColor: meta.color + '40' }}>
          <span className="font-body font-bold text-[10px] tracking-widest uppercase" style={{ color: meta.color }}>
            {meta.label}
          </span>
        </div>

        {/* Stat chip */}
        <AnimatePresence mode="wait">
          <motion.div key={`stat-${stage}`}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="absolute bottom-14 right-3 p-3 rounded-xl backdrop-blur-sm border text-right"
            style={{ background: '#fdfbf7f2', borderColor: meta.color + '30' }}>
            <p className="font-display font-bold text-xl leading-none" style={{ color: meta.color }}>{meta.stat}</p>
            <p className="font-body text-[10px] text-earthen-rust/55 mt-0.5 max-w-[110px]">{meta.statLabel}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Subtitle */}
      <AnimatePresence mode="wait">
        <motion.p key={`sub-${stage}`}
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.38 }}
          className="text-center font-body text-sm text-earthen-rust/55 mt-4 leading-relaxed px-4">
          {meta.sub}
        </motion.p>
      </AnimatePresence>

      {/* Progress pills */}
      <div className="flex items-center justify-center gap-2.5 mt-4">
        {STAGE_META.map((s, i) => (
          <button key={s.label} onClick={() => { setStage(i as Stage); setAutoPlay(false); }}>
            <motion.div className="rounded-full"
              animate={{ width: i === stage ? 24 : 8, height: 8, backgroundColor: i === stage ? meta.color : meta.color + '35' }}
              transition={{ duration: 0.3 }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
