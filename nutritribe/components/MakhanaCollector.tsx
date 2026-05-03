'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Ball { id: number; zone: number; collected: boolean }

// 9 viewport zones (3x3 grid) — ball spawns in a quadrant
const ZONES = [
  { left: '8%',  top: '18%' }, { left: '48%', top: '12%' }, { left: '82%', top: '22%' },
  { left: '6%',  top: '50%' }, { left: '50%', top: '55%' }, { left: '86%', top: '48%' },
  { left: '10%', top: '78%' }, { left: '46%', top: '82%' }, { left: '80%', top: '74%' },
];

const MILESTONES: Record<number, { msg: string; emoji: string; color: string }> = {
  3:  { msg: 'You\'re a Snacker!',   emoji: '🌿', color: '#009846' },
  5:  { msg: 'Tribe Member!',        emoji: '⚡', color: '#7a4dff' },
  8:  { msg: 'MAKHANA MASTER!',      emoji: '👑', color: '#D4AF37' },
  12: { msg: 'Ancient Wisdom Keeper!',emoji: '🪷', color: '#f3a213' },
};

function MakhanaBallSVG({ size = 36, glow = false, color = '#f3a213' }: { size?: number; glow?: boolean; color?: string }) {
  const id = `gc-${size}-${glow ? 'g' : 'n'}`;
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none">
      <defs>
        <radialGradient id={`${id}-b`} cx="33%" cy="28%" r="68%">
          <stop offset="0%" stopColor="#fdfbf7" />
          <stop offset="35%" stopColor="#ecdfc4" />
          <stop offset="70%" stopColor="#d4b485" />
          <stop offset="100%" stopColor="#b8916a" />
        </radialGradient>
        <radialGradient id={`${id}-g`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={color} stopOpacity={glow ? 0.7 : 0.3} />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="30" cy="30" r="29" fill={`url(#${id}-g)`} />
      <circle cx="30" cy="30" r="20" fill={`url(#${id}-b)`} />
      <circle cx="22" cy="22" r="6.5" fill="white" fillOpacity="0.6" />
      <circle cx="35" cy="20" r="2.5" fill="#b8916a" fillOpacity="0.4" />
      <circle cx="38" cy="32" r="2" fill="#b8916a" fillOpacity="0.35" />
      <circle cx="24" cy="38" r="1.8" fill="#b8916a" fillOpacity="0.3" />
    </svg>
  );
}

function PopBurst({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <div className="fixed pointer-events-none z-[9996]" style={{ left: x, top: y }}>
      {[0, 40, 80, 120, 160, 200, 240, 280, 320].map((angle, i) => (
        <motion.div key={i}
          className="absolute rounded-full"
          style={{ width: i % 2 === 0 ? 8 : 5, height: i % 2 === 0 ? 8 : 5, background: i % 3 === 0 ? color : '#fdfbf7', marginLeft: -4, marginTop: -4 }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{ x: (50 + i * 5) * Math.cos((angle * Math.PI) / 180), y: (50 + i * 5) * Math.sin((angle * Math.PI) / 180), opacity: 0, scale: 0 }}
          transition={{ duration: 0.65, ease: 'easeOut', delay: i * 0.02 }}
        />
      ))}
      <motion.div
        className="absolute rounded-full border-2"
        style={{ width: 80, height: 80, borderColor: color, marginLeft: -40, marginTop: -40 }}
        initial={{ scale: 0.3, opacity: 0.8 }}
        animate={{ scale: 2, opacity: 0 }}
        transition={{ duration: 0.5 }}
      />
    </div>
  );
}

export default function MakhanaCollector() {
  const [score, setScore] = useState(0);
  const [balls, setBalls] = useState<Ball[]>([]);
  const [pops, setPops] = useState<{ id: number; x: number; y: number; color: string }[]>([]);
  const [toast, setToast] = useState<{ msg: string; emoji: string; color: string } | null>(null);
  const [masterUnlocked, setMasterUnlocked] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const nextId = useRef(0);
  const usedZones = useRef<Set<number>>(new Set());

  // Spawn a ball in an unused zone
  const spawnBall = useCallback(() => {
    const available = ZONES.map((_, i) => i).filter(i => !usedZones.current.has(i));
    if (available.length === 0) return;
    const zone = available[Math.floor(Math.random() * available.length)];
    usedZones.current.add(zone);
    const id = nextId.current++;
    setBalls(b => [...b, { id, zone, collected: false }]);
  }, []);

  // Start with 3 balls
  useEffect(() => {
    const t1 = setTimeout(() => { setShowHint(true); spawnBall(); }, 4000);
    const t2 = setTimeout(() => spawnBall(), 6000);
    const t3 = setTimeout(() => spawnBall(), 9000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [spawnBall]);

  const collectBall = useCallback((ball: Ball, e: React.MouseEvent) => {
    e.stopPropagation();
    usedZones.current.delete(ball.zone);
    setBalls(b => b.filter(x => x.id !== ball.id));

    const popId = Date.now();
    setPops(p => [...p, { id: popId, x: e.clientX, y: e.clientY, color: '#f3a213' }]);
    setTimeout(() => setPops(p => p.filter(x => x.id !== popId)), 800);

    setScore(prev => {
      const next = prev + 1;
      if (MILESTONES[next]) {
        if (next === 8 || next === 12) setMasterUnlocked(true);
        setToast(MILESTONES[next]);
        setTimeout(() => setToast(null), 4000);
      }
      return next;
    });

    // Spawn replacement after 3s
    setTimeout(spawnBall, 3000);
  }, [spawnBall]);

  const ballColors = ['#f3a213', '#D4AF37', '#f3a213'];

  return (
    <>
      {/* Floating balls */}
      {balls.map((ball, idx) => {
        const zone = ZONES[ball.zone];
        const color = ballColors[idx % ballColors.length];
        return (
          <motion.div
            key={ball.id}
            className="fixed z-[9980] cursor-pointer"
            style={{ left: zone.left, top: zone.top }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, y: [0, -12, 0] }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ scale: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }, opacity: { duration: 0.3 }, y: { duration: 3 + idx * 0.5, repeat: Infinity, ease: 'easeInOut' } }}
            onClick={(e) => collectBall(ball, e)}
            whileHover={{ scale: 1.3 }}
          >
            {/* Glow ring */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ background: `radial-gradient(circle, ${color}50 0%, transparent 70%)`, transform: 'scale(2)' }}
              animate={{ opacity: [0.4, 0.9, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <MakhanaBallSVG size={40} glow color={color} />
          </motion.div>
        );
      })}

      {/* Pop bursts */}
      {pops.map(p => <PopBurst key={p.id} x={p.x} y={p.y} color={p.color} />)}

      {/* Score counter */}
      <AnimatePresence>
        {score > 0 && (
          <motion.div
            className="fixed bottom-6 right-6 z-[9985] flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border"
            style={{ background: 'rgba(253,251,247,0.95)', borderColor: '#f3a21340', backdropFilter: 'blur(12px)', boxShadow: '0 8px 32px rgba(243,162,19,0.15)' }}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <MakhanaBallSVG size={22} />
            <div>
              <p className="font-display font-bold text-earthen-rust leading-none" style={{ fontSize: 15 }}>{score}</p>
              <p className="font-body text-[9px] text-earthen-rust/50 tracking-widest uppercase">makhanas</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hint */}
      <AnimatePresence>
        {showHint && score === 0 && (
          <motion.div
            className="fixed bottom-6 right-6 z-[9984] px-4 py-2.5 rounded-2xl border"
            style={{ background: 'rgba(253,251,247,0.92)', borderColor: '#f3a21340', backdropFilter: 'blur(12px)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <p className="font-body text-xs text-earthen-rust/70 flex items-center gap-2">
              <motion.span animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>🌾</motion.span>
              Find & click the Makhanas!
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            className="fixed top-24 left-1/2 z-[9990] -translate-x-1/2 flex items-center gap-3 px-6 py-4 rounded-2xl border shadow-2xl"
            style={{ background: 'rgba(253,251,247,0.97)', borderColor: toast.color + '50', boxShadow: `0 20px 60px ${toast.color}40` }}
            initial={{ opacity: 0, y: -30, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 22 }}
          >
            <motion.span className="text-3xl" animate={{ rotate: [0, -15, 15, 0] }} transition={{ duration: 0.5, repeat: 2 }}>
              {toast.emoji}
            </motion.span>
            <div>
              <p className="font-display font-bold text-lg leading-none" style={{ color: toast.color }}>{toast.msg}</p>
              <p className="font-body text-xs text-earthen-rust/55 mt-1">Score: {score} Makhanas</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Master celebration */}
      <AnimatePresence>
        {masterUnlocked && (
          <motion.div
            className="fixed inset-0 z-[9995] flex items-center justify-center"
            style={{ background: 'rgba(10,2,0,0.85)', backdropFilter: 'blur(8px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMasterUnlocked(false)}
          >
            <motion.div
              className="text-center px-10 py-12 rounded-3xl border max-w-sm mx-4"
              style={{ background: 'linear-gradient(135deg, #1a0802, #0d0300)', borderColor: '#D4AF3740' }}
              initial={{ scale: 0.7, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              onClick={e => e.stopPropagation()}
            >
              {/* Confetti balls */}
              {[...Array(12)].map((_, i) => (
                <motion.div key={i}
                  className="absolute w-3 h-3 rounded-full"
                  style={{ background: i % 3 === 0 ? '#f3a213' : i % 3 === 1 ? '#D4AF37' : '#009846', left: '50%', top: '30%' }}
                  animate={{ x: (Math.cos(i * 30 * Math.PI / 180)) * 150, y: (Math.sin(i * 30 * Math.PI / 180)) * 100 - 80, opacity: [1, 1, 0], scale: [1, 0.5] }}
                  transition={{ duration: 1.2, delay: 0.1, ease: 'easeOut' }}
                />
              ))}
              <motion.div className="text-5xl mb-4" animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 0.6, repeat: 3 }}>👑</motion.div>
              <h2 className="font-display font-bold text-3xl mb-2" style={{ color: '#D4AF37' }}>Makhana Master!</h2>
              <p className="font-body text-sm text-white/60 mb-6">You found {score} makhanas. You belong to the tribe.</p>
              <div className="bg-white/5 border border-white/10 rounded-xl px-5 py-3 mb-6">
                <p className="font-body text-xs text-white/40 mb-1">Your reward</p>
                <p className="font-display font-bold text-2xl tracking-widest" style={{ color: '#f3a213' }}>TRIBE20</p>
                <p className="font-body text-xs text-white/40 mt-0.5">20% off your first order</p>
              </div>
              <button
                onClick={() => setMasterUnlocked(false)}
                className="font-body font-bold text-xs tracking-widest uppercase px-6 py-2.5 rounded-full border"
                style={{ color: '#f3a213', borderColor: '#f3a21350' }}
              >
                Continue Exploring
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
