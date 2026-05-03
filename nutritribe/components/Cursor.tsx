'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';

interface Burst { id: number; x: number; y: number }

const BALL_SVG = (size: number, glow: boolean) => (
  <svg width={size} height={size} viewBox="0 0 60 60" fill="none">
    <defs>
      <radialGradient id="c-ball" cx="33%" cy="28%" r="68%">
        <stop offset="0%" stopColor="#fdfbf7" />
        <stop offset="35%" stopColor="#ecdfc4" />
        <stop offset="70%" stopColor="#d4b485" />
        <stop offset="100%" stopColor="#b8916a" />
      </radialGradient>
      <radialGradient id="c-glow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#f3a213" stopOpacity={glow ? 0.75 : 0.3} />
        <stop offset="100%" stopColor="#f3a213" stopOpacity="0" />
      </radialGradient>
    </defs>
    <circle cx="30" cy="30" r="29" fill="url(#c-glow)" />
    <circle cx="30" cy="30" r="19" fill="url(#c-ball)" />
    <circle cx="22" cy="22" r="6" fill="white" fillOpacity="0.6" />
    <circle cx="34" cy="19" r="2.5" fill="#b8916a" fillOpacity="0.45" />
    <circle cx="38" cy="30" r="2" fill="#b8916a" fillOpacity="0.35" />
    <circle cx="24" cy="36" r="1.8" fill="#b8916a" fillOpacity="0.3" />
  </svg>
);

export default function Cursor() {
  const [isMobile, setIsMobile] = useState(true);
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [bursts, setBursts] = useState<Burst[]>([]);
  const [trail, setTrail] = useState<{ x: number; y: number; id: number }[]>([]);

  const mx = useMotionValue(-200);
  const my = useMotionValue(-200);
  const sx = useSpring(mx, { stiffness: 350, damping: 30 });
  const sy = useSpring(my, { stiffness: 350, damping: 30 });

  const addBurst = useCallback((x: number, y: number) => {
    const id = Date.now();
    setBursts(b => [...b, { id, x, y }]);
    setTimeout(() => setBursts(b => b.filter(p => p.id !== id)), 700);
  }, []);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    check();
    window.addEventListener('resize', check);

    let trailId = 0;
    const onMove = (e: MouseEvent) => {
      mx.set(e.clientX - 15);
      my.set(e.clientY - 15);
      setVisible(true);
      trailId++;
      const id = trailId;
      setTrail(t => [...t.slice(-5), { x: e.clientX, y: e.clientY, id }]);
      setTimeout(() => setTrail(t => t.filter(p => p.id !== id)), 500);
    };

    const onOver = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('a,button,[data-cursor]')) setHovering(true);
    };
    const onOut = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('a,button,[data-cursor]')) setHovering(false);
    };
    const onClick = (e: MouseEvent) => addBurst(e.clientX, e.clientY);

    window.addEventListener('mousemove', onMove);
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);
    window.addEventListener('click', onClick);
    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
      window.removeEventListener('click', onClick);
      window.removeEventListener('resize', check);
    };
  }, [mx, my, addBurst]);

  if (isMobile) return null;

  return (
    <>
      {/* Trail dots */}
      {trail.map((t, i) => (
        <div key={t.id} className="fixed pointer-events-none z-[9990]"
          style={{
            left: t.x - 4, top: t.y - 4,
            width: 8 - i, height: 8 - i,
            borderRadius: '50%',
            background: '#f3a213',
            opacity: (i + 1) / trail.length * 0.35,
            transform: 'translate(-50%,-50%)',
          }}
        />
      ))}

      {/* Makhana ball cursor */}
      <motion.div
        className="fixed pointer-events-none z-[9999]"
        style={{ x: sx, y: sy, opacity: visible ? 1 : 0 }}
        animate={{ scale: hovering ? 1.5 : 1 }}
        transition={{ duration: 0.2 }}
      >
        {BALL_SVG(30, hovering)}
      </motion.div>

      {/* Hover ring */}
      <AnimatePresence>
        {hovering && (
          <motion.div
            className="fixed pointer-events-none z-[9998] rounded-full border-2"
            style={{ borderColor: '#f3a213', x: sx, y: sy, marginLeft: -20, marginTop: -20 }}
            initial={{ width: 30, height: 30, opacity: 0 }}
            animate={{ width: 70, height: 70, opacity: 0.5 }}
            exit={{ width: 30, height: 30, opacity: 0 }}
            transition={{ duration: 0.25 }}
          />
        )}
      </AnimatePresence>

      {/* Click burst particles */}
      {bursts.map(burst => (
        <div key={burst.id} className="fixed pointer-events-none z-[9997]"
          style={{ left: burst.x, top: burst.y }}>
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
            <motion.div key={i}
              className="absolute rounded-full"
              style={{ width: 6, height: 6, background: i % 2 === 0 ? '#f3a213' : '#D4AF37', marginLeft: -3, marginTop: -3 }}
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{
                x: 35 * Math.cos((angle * Math.PI) / 180),
                y: 35 * Math.sin((angle * Math.PI) / 180),
                opacity: 0, scale: 0,
              }}
              transition={{ duration: 0.55, ease: 'easeOut' }}
            />
          ))}
        </div>
      ))}
    </>
  );
}
