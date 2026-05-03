'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

type Phase = 'heating' | 'popping' | 'flash' | 'welcome' | 'exiting' | 'done';

function Particle({ angle, color, dist }: { angle: number; color: string; dist: number }) {
  const rad = (angle * Math.PI) / 180;
  return (
    <motion.div
      className="absolute rounded-full"
      style={{ width: 12, height: 12, background: color, left: '50%', top: '50%', marginLeft: -6, marginTop: -6 }}
      initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
      animate={{ x: dist * Math.cos(rad), y: dist * Math.sin(rad), opacity: 0, scale: 0.1 }}
      transition={{ duration: 1.0, ease: 'easeOut' }}
    />
  );
}

function MadhubaniCorner() {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
      <path d="M4 4 L4 50 Q4 96 50 96" stroke="#f3a213" strokeWidth="1.5" opacity="0.5" strokeLinecap="round" />
      <path d="M4 4 L50 4 Q96 4 96 50" stroke="#f3a213" strokeWidth="1" opacity="0.3" strokeLinecap="round" />
      <circle cx="4" cy="4" r="3.5" fill="#f3a213" opacity="0.6" />
      <circle cx="4" cy="28" r="2.5" fill="#f3a213" opacity="0.35" />
      <circle cx="28" cy="4" r="2.5" fill="#f3a213" opacity="0.35" />
      <circle cx="52" cy="4" r="1.5" fill="#f3a213" opacity="0.2" />
      <circle cx="4" cy="52" r="1.5" fill="#f3a213" opacity="0.2" />
      {[0, 14, 28].map((d, i) => (
        <rect key={i} x="1" y={10 + d} width="6" height="2.5" rx="1.2" fill="#f3a213" opacity={0.25 - i * 0.05} />
      ))}
      {[0, 14, 28].map((d, i) => (
        <rect key={i} x={10 + d} y="1" width="2.5" height="6" rx="1.2" fill="#f3a213" opacity={0.2 - i * 0.04} />
      ))}
      {/* Petal motif */}
      <ellipse cx="22" cy="22" rx="8" ry="5" fill="none" stroke="#f3a213" strokeWidth="0.8" opacity="0.25" transform="rotate(-45 22 22)" />
      <ellipse cx="22" cy="22" rx="8" ry="5" fill="none" stroke="#f3a213" strokeWidth="0.8" opacity="0.2" transform="rotate(45 22 22)" />
      <circle cx="22" cy="22" r="2" fill="#f3a213" opacity="0.3" />
    </svg>
  );
}

function LotusFlower({ x, y, size = 1 }: { x: number; y: number; size?: number }) {
  return (
    <g transform={`translate(${x},${y}) scale(${size})`}>
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => (
        <ellipse key={i} cx="0" cy="-10" rx="4" ry="9" fill="#ffb8d0" opacity="0.7"
          transform={`rotate(${a})`} />
      ))}
      <circle cx="0" cy="0" r="5" fill="#f3a213" />
      <circle cx="0" cy="0" r="2.5" fill="#D4AF37" />
    </g>
  );
}

export default function IntroAnimation() {
  const [show, setShow] = useState(false);
  const [phase, setPhase] = useState<Phase>('heating');
  const poppedRef = useRef(false);
  const enteredRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const seen = sessionStorage.getItem('nt-intro-v2');
    if (!seen) {
      setShow(true);
      sessionStorage.setItem('nt-intro-v2', '1');
    }
  }, []);

  const triggerPop = () => {
    if (poppedRef.current) return;
    poppedRef.current = true;
    setPhase('popping');
    setTimeout(() => setPhase('flash'), 950);
    setTimeout(() => setPhase('welcome'), 1200);
  };

  const enter = () => {
    if (enteredRef.current) return;
    enteredRef.current = true;
    setPhase('exiting');
    setTimeout(() => setPhase('done'), 900);
  };

  useEffect(() => {
    if (!show) return;
    const t = setTimeout(triggerPop, 3200);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  useEffect(() => {
    if (phase !== 'welcome') return;
    const t = setTimeout(enter, 6000);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  if (!show) return null;

  const burstAngles = Array.from({ length: 22 }, (_, i) => i * (360 / 22));
  const colors = ['#f3a213', '#D4AF37', '#fdfbf7', '#f3a213', '#ecdfc4', '#fff', '#D4AF37', '#f3a213'];

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <>
          {/* ── CURTAIN EXIT ── */}
          {phase === 'exiting' && (
            <>
              <motion.div className="fixed inset-y-0 left-0 w-1/2 z-[10000]"
                style={{ background: 'linear-gradient(to right, #050100, #0d0703)' }}
                initial={{ x: 0 }} animate={{ x: '-100%' }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} />
              <motion.div className="fixed inset-y-0 right-0 w-1/2 z-[10000]"
                style={{ background: 'linear-gradient(to left, #050100, #0d0703)' }}
                initial={{ x: 0 }} animate={{ x: '100%' }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} />
            </>
          )}

          {/* ── GOLD FLASH ── */}
          {phase === 'flash' && (
            <motion.div className="fixed inset-0 z-[9999]"
              style={{ background: 'radial-gradient(circle, #f3a213 0%, #D4AF37 40%, #fff 100%)' }}
              initial={{ opacity: 1 }} animate={{ opacity: 0 }}
              transition={{ duration: 0.35 }} />
          )}

          {/* ── WELCOME PHASE ── */}
          <AnimatePresence>
            {phase === 'welcome' && (
              <motion.div
                className="fixed inset-0 z-[9998] flex flex-col items-center justify-center overflow-hidden cursor-pointer select-none"
                style={{ background: 'radial-gradient(ellipse at 50% 35%, #1c0c04 0%, #080200 60%, #020100 100%)' }}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                onClick={enter}
              >
                {/* Grain overlay */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.05]"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E")` }} />

                {/* Floating ambient gold dust */}
                {Array.from({ length: 24 }).map((_, i) => (
                  <motion.div key={i}
                    className="absolute rounded-full pointer-events-none"
                    style={{
                      width: 1 + (i % 3),
                      height: 1 + (i % 3),
                      left: `${(i * 53 + 7) % 100}%`,
                      top: `${(i * 37 + 12) % 100}%`,
                      background: '#f3a213',
                    }}
                    animate={{
                      y: [-20, -60, -20],
                      opacity: [0, 0.4 + (i % 3) * 0.1, 0],
                    }}
                    transition={{ duration: 4 + (i % 5), repeat: Infinity, delay: i * 0.3, ease: 'easeInOut' }}
                  />
                ))}

                {/* Madhubani corner ornaments */}
                {[
                  'absolute top-3 left-3 w-24 h-24',
                  'absolute top-3 right-3 w-24 h-24 rotate-90',
                  'absolute bottom-3 left-3 w-24 h-24 -rotate-90',
                  'absolute bottom-3 right-3 w-24 h-24 rotate-180',
                ].map((cls, i) => (
                  <motion.div key={i} className={cls}
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + i * 0.1, duration: 0.6 }}>
                    <MadhubaniCorner />
                  </motion.div>
                ))}

                {/* Horizontal accent lines */}
                <motion.div className="absolute left-6 right-6 h-px" style={{ top: '8%', background: 'linear-gradient(90deg, transparent, rgba(243,162,19,0.2), transparent)' }}
                  initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.5, duration: 0.8 }} />
                <motion.div className="absolute left-6 right-6 h-px" style={{ bottom: '8%', background: 'linear-gradient(90deg, transparent, rgba(243,162,19,0.2), transparent)' }}
                  initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.5, duration: 0.8 }} />

                {/* Lotus pond ripples behind center */}
                {[160, 220, 280, 340].map((r, i) => (
                  <motion.div key={i}
                    className="absolute rounded-full pointer-events-none"
                    style={{ width: r, height: r * 0.35, border: '1px solid rgba(243,162,19,0.15)', bottom: '12%' }}
                    animate={{ scale: [1, 1.12, 1], opacity: [0.4, 0.1, 0.4] }}
                    transition={{ duration: 3.5, repeat: Infinity, delay: i * 0.7 }}
                  />
                ))}

                {/* SVG lotus pond scene */}
                <motion.div
                  className="absolute"
                  style={{ bottom: '6%', width: '60%', maxWidth: 400 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 1 }}
                >
                  <svg viewBox="0 0 400 80" fill="none" className="w-full">
                    {/* Water */}
                    <ellipse cx="200" cy="60" rx="180" ry="22" fill="#0a1628" opacity="0.8" />
                    <ellipse cx="200" cy="56" rx="175" ry="15" fill="#0d1f38" opacity="0.6" />
                    {/* Water shimmer */}
                    {[80, 140, 200, 260, 320].map((x, i) => (
                      <motion.line key={i} x1={x} y1="60" x2={x + 20} y2="60"
                        stroke="#1e4a7a" strokeWidth="1.5" opacity="0.4" strokeLinecap="round"
                        animate={{ opacity: [0.2, 0.6, 0.2] }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }} />
                    ))}
                    {/* Lotus stems */}
                    <line x1="120" y1="58" x2="120" y2="25" stroke="#009846" strokeWidth="2" />
                    <line x1="200" y1="56" x2="200" y2="18" stroke="#009846" strokeWidth="2" />
                    <line x1="280" y1="58" x2="280" y2="28" stroke="#009846" strokeWidth="2" />
                    {/* Lily pads */}
                    <ellipse cx="100" cy="58" rx="16" ry="6" fill="#009846" opacity="0.7" />
                    <ellipse cx="245" cy="57" rx="14" ry="5" fill="#009846" opacity="0.6" />
                    <ellipse cx="310" cy="59" rx="12" ry="4.5" fill="#009846" opacity="0.65" />
                    {/* Lotus flowers */}
                    <LotusFlower x={120} y={20} size={0.85} />
                    <LotusFlower x={200} y={12} size={1} />
                    <LotusFlower x={280} y={23} size={0.75} />
                  </svg>
                </motion.div>

                {/* Central makhana rising */}
                <motion.div
                  className="relative z-10 mb-6"
                  initial={{ y: 60, scale: 0.3, opacity: 0 }}
                  animate={{ y: 0, scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                >
                  {/* Glow rings */}
                  {[1, 2, 3].map(r => (
                    <motion.div key={r}
                      className="absolute rounded-full"
                      style={{
                        width: 80 + r * 40, height: 80 + r * 40,
                        top: -(r * 20), left: -(r * 20),
                        background: `radial-gradient(circle, rgba(243,162,19,${0.15 / r}) 0%, transparent 70%)`,
                      }}
                      animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2.5, repeat: Infinity, delay: r * 0.4 }}
                    />
                  ))}

                  {/* Orbiting tiny makhanas */}
                  {[0, 72, 144, 216, 288].map((startAngle, i) => (
                    <motion.div key={i}
                      className="absolute"
                      style={{ width: 100, height: 100, top: -30, left: -30 }}
                      animate={{ rotate: [startAngle, startAngle + 360] }}
                      transition={{ duration: 8 + i, repeat: Infinity, ease: 'linear' }}
                    >
                      <div style={{ position: 'absolute', top: 0, left: '50%', marginLeft: -6 }}>
                        <svg width="12" height="12" viewBox="0 0 30 30" fill="none">
                          <defs>
                            <radialGradient id={`om${i}`} cx="33%" cy="28%" r="70%">
                              <stop offset="0%" stopColor="#fdfbf7" />
                              <stop offset="100%" stopColor="#b8916a" />
                            </radialGradient>
                          </defs>
                          <circle cx="15" cy="15" r="13" fill={`url(#om${i})`} />
                          <circle cx="11" cy="11" r="3" fill="white" fillOpacity="0.5" />
                        </svg>
                      </div>
                    </motion.div>
                  ))}

                  {/* Main ball */}
                  <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
                    <svg width="110" height="110" viewBox="0 0 100 100" fill="none">
                      <defs>
                        <radialGradient id="wb-glow" cx="50%" cy="50%" r="50%">
                          <stop offset="0%" stopColor="#f3a213" stopOpacity="0.9" />
                          <stop offset="100%" stopColor="#f3a213" stopOpacity="0" />
                        </radialGradient>
                        <radialGradient id="wb-ball" cx="33%" cy="28%" r="68%">
                          <stop offset="0%" stopColor="#fdfbf7" />
                          <stop offset="35%" stopColor="#ecdfc4" />
                          <stop offset="70%" stopColor="#d4b485" />
                          <stop offset="100%" stopColor="#b8916a" />
                        </radialGradient>
                      </defs>
                      <circle cx="50" cy="50" r="48" fill="url(#wb-glow)" />
                      <circle cx="50" cy="50" r="34" fill="url(#wb-ball)" />
                      <circle cx="39" cy="38" r="11" fill="white" fillOpacity="0.55" />
                      <circle cx="58" cy="34" r="3" fill="#b8916a" fillOpacity="0.4" />
                      <circle cx="63" cy="46" r="2.5" fill="#b8916a" fillOpacity="0.35" />
                      <circle cx="58" cy="58" r="2" fill="#b8916a" fillOpacity="0.3" />
                      <circle cx="46" cy="63" r="2.5" fill="#b8916a" fillOpacity="0.3" />
                    </svg>
                  </motion.div>
                </motion.div>

                {/* Text sequence */}
                <motion.p className="font-body text-[10px] tracking-[0.45em] uppercase mb-3"
                  style={{ color: 'rgba(243,162,19,0.6)' }}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9, duration: 0.6 }}>
                  From the Lotus Ponds of Mithila, Bihar
                </motion.p>

                <div className="overflow-hidden mb-2">
                  <motion.h1 className="font-display font-bold text-center leading-[1.1]"
                    style={{ fontSize: 'clamp(26px, 4.5vw, 52px)', color: '#fdfbf7' }}
                    initial={{ y: '105%' }} animate={{ y: '0%' }}
                    transition={{ delay: 1.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
                    You&apos;ve found your{' '}
                    <span style={{ color: '#f3a213', fontStyle: 'italic' }}>Tribe.</span>
                  </motion.h1>
                </div>

                <motion.p className="font-body text-center mb-7 max-w-xs"
                  style={{ color: 'rgba(253,251,247,0.45)', fontSize: 14, lineHeight: 1.7 }}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ delay: 1.6, duration: 0.7 }}>
                  India&apos;s ancient superfood, handcrafted for those<br />who snack bold and live rooted.
                </motion.p>

                {/* Logo */}
                <motion.div className="mb-7"
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 2, duration: 0.6 }}>
                  <div className="relative w-40 h-14" style={{ filter: 'brightness(0) invert(1) opacity(0.85)' }}>
                    <Image src="/logo.png" alt="NutriTribe" fill className="object-contain" />
                  </div>
                </motion.div>

                {/* CTA Button */}
                <motion.button
                  onClick={(e) => { e.stopPropagation(); enter(); }}
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2.5, duration: 0.5 }}
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.97 }}
                  className="relative overflow-hidden font-body font-bold text-sm tracking-[0.18em] uppercase px-12 py-4 rounded-full"
                  style={{ background: '#f3a213', color: '#050100' }}
                >
                  <span className="relative z-10">Enter the Tribe →</span>
                  <motion.div className="absolute inset-0"
                    style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)' }}
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }} />
                </motion.button>

                <motion.p className="font-body text-[9px] mt-4 tracking-widest uppercase"
                  style={{ color: 'rgba(253,251,247,0.18)' }}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.2 }}>
                  or click anywhere to continue
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── HEATING + POPPING ── */}
          <AnimatePresence>
            {(phase === 'heating' || phase === 'popping') && (
              <motion.div
                className="fixed inset-0 z-[9999] flex flex-col items-center justify-center cursor-pointer"
                style={{ background: 'radial-gradient(ellipse 80% 70% at 50% 50%, #1a0802 0%, #050100 100%)' }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.2 }}
                onClick={triggerPop}
              >
                {/* Ambient particles */}
                {Array.from({ length: 20 }).map((_, i) => (
                  <motion.div key={i}
                    className="absolute rounded-full pointer-events-none"
                    style={{
                      width: 2 + (i % 3), height: 2 + (i % 3),
                      left: `${(i * 47 + 5) % 100}%`, top: `${(i * 31 + 8) % 100}%`,
                      background: '#f3a213', opacity: 0.06 + (i % 4) * 0.02,
                    }}
                    animate={{ opacity: [0.04, 0.18, 0.04], y: [0, -8, 0] }}
                    transition={{ duration: 3 + (i % 4), repeat: Infinity, delay: i * 0.2 }} />
                ))}

                {/* Logo */}
                <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-16">
                  <div className="relative w-44 h-14" style={{ filter: 'brightness(0) invert(1)' }}>
                    <Image src="/logo.png" alt="NutriTribe" fill className="object-contain" priority />
                  </div>
                </motion.div>

                <div className="relative flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    {phase === 'heating' && (
                      <motion.div key="seed" className="relative"
                        exit={{ scale: 0, opacity: 0 }} transition={{ duration: 0.12 }}>
                        {[1, 2, 3].map(r => (
                          <motion.div key={r} className="absolute rounded-full border"
                            style={{ width: 80 + r * 40, height: 80 + r * 40, top: -(r * 20), left: -(r * 20), borderColor: '#f3a213', opacity: 0 }}
                            animate={{ opacity: [0, 0.35 / r, 0], scale: [0.92, 1.08, 0.92] }}
                            transition={{ duration: 1.8, repeat: Infinity, delay: r * 0.35 }} />
                        ))}
                        <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 1.3, repeat: Infinity }}>
                          <svg width="96" height="96" viewBox="0 0 90 90" fill="none">
                            <defs>
                              <radialGradient id="seed2" cx="35%" cy="30%" r="65%">
                                <stop offset="0%" stopColor="#c4a06a" />
                                <stop offset="40%" stopColor="#8a6430" />
                                <stop offset="100%" stopColor="#4a3218" />
                              </radialGradient>
                              <radialGradient id="seed-glow2" cx="50%" cy="50%" r="50%">
                                <stop offset="0%" stopColor="#f3a213" stopOpacity="0.6" />
                                <stop offset="100%" stopColor="#f3a213" stopOpacity="0" />
                              </radialGradient>
                            </defs>
                            <motion.circle cx="45" cy="45" r="42" fill="url(#seed-glow2)"
                              animate={{ r: [36, 44, 36] }} transition={{ duration: 1.5, repeat: Infinity }} />
                            <circle cx="45" cy="45" r="30" fill="url(#seed2)" />
                            <circle cx="36" cy="37" r="7" fill="#c4a06a" fillOpacity="0.35" />
                            {[[52,36],[58,48],[54,60],[44,65],[35,57],[30,46]].map(([sx,sy],i)=>(
                              <circle key={i} cx={sx} cy={sy} r="2" fill="#2a1a08" fillOpacity="0.5" />
                            ))}
                          </svg>
                        </motion.div>
                        <motion.p
                          className="absolute -bottom-14 left-1/2 -translate-x-1/2 font-body text-[11px] tracking-[0.3em] uppercase whitespace-nowrap"
                          style={{ color: '#f3a213' }}
                          animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.6, repeat: Infinity }}>
                          tap to pop
                        </motion.p>
                      </motion.div>
                    )}

                    {phase === 'popping' && (
                      <motion.div key="pop" className="relative"
                        initial={{ scale: 0.3, opacity: 0 }}
                        animate={{ scale: [0.3, 1.6, 1.1], opacity: 1 }}
                        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}>
                        {burstAngles.map((a, i) => (
                          <Particle key={i} angle={a} color={colors[i % colors.length]}
                            dist={120 + (i % 4) * 20} />
                        ))}
                        <svg width="110" height="110" viewBox="0 0 100 100" fill="none">
                          <defs>
                            <radialGradient id="pop-glow2" cx="50%" cy="50%" r="50%">
                              <stop offset="0%" stopColor="#f3a213" stopOpacity="1" />
                              <stop offset="100%" stopColor="#f3a213" stopOpacity="0" />
                            </radialGradient>
                            <radialGradient id="pop-ball2" cx="33%" cy="28%" r="68%">
                              <stop offset="0%" stopColor="#fdfbf7" />
                              <stop offset="35%" stopColor="#ecdfc4" />
                              <stop offset="70%" stopColor="#d4b485" />
                              <stop offset="100%" stopColor="#b8916a" />
                            </radialGradient>
                          </defs>
                          <circle cx="50" cy="50" r="48" fill="url(#pop-glow2)" />
                          <circle cx="50" cy="50" r="36" fill="url(#pop-ball2)" />
                          <circle cx="38" cy="38" r="12" fill="white" fillOpacity="0.6" />
                        </svg>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {phase === 'heating' && (
                  <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
                    onClick={(e) => { e.stopPropagation(); setPhase('done'); }}
                    className="absolute bottom-8 right-8 font-body text-xs tracking-widest uppercase"
                    style={{ color: 'rgba(253,251,247,0.18)' }}>
                    skip →
                  </motion.button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
}
