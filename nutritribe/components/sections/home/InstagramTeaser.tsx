'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { InstagramIcon } from '@/components/SocialIcons';

/* ── Premium Instagram Teaser ─────────────────────────────────────────
   Dark cinematic section with 6 rich placeholder tiles arranged in a
   masonry-inspired grid, plus a glowing CTA.
   ───────────────────────────────────────────────────────────────────── */

const tiles = [
  { label: 'Lily Harvest', sub: 'Bihar, Mithila', color: '#f3a213', icon: '🌸' },
  { label: 'Mithila Ponds', sub: 'Dawn at the wetlands', color: '#7d3627', icon: '🌊' },
  { label: 'Pure Makhana', sub: 'From pod to pouch', color: '#009846', icon: '🌿' },
  { label: 'Roast Session', sub: 'Small-batch perfection', color: '#1c0a02', icon: '🔥' },
  { label: 'Bihar Sunrise', sub: 'Golden mornings', color: '#c09020', icon: '☀️' },
  { label: 'Tribe Life', sub: 'Community & culture', color: '#5a3dcc', icon: '🤝' },
];

/* Makhana seed SVG */
function MkSeed({ opacity = 0.15 }: { opacity?: number }) {
  return (
    <svg width="24" height="24" viewBox="0 0 30 30" fill="none" style={{ opacity }}>
      <radialGradient id="mks-g" cx="33%" cy="28%" r="70%">
        <stop offset="0%" stopColor="#fdfbf7" />
        <stop offset="60%" stopColor="#e8d4a8" />
        <stop offset="100%" stopColor="#b8916a" />
      </radialGradient>
      <circle cx="15" cy="15" r="13" fill="url(#mks-g)" />
      <circle cx="10" cy="10" r="2.5" fill="#7a5c30" opacity="0.4" />
      <ellipse cx="10" cy="10" rx="4" ry="2.5" fill="white" opacity="0.3" transform="rotate(-20 10 10)" />
    </svg>
  );
}

export default function InstagramTeaser() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.05 });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden"
      style={{
        background: 'linear-gradient(155deg, #080100 0%, #120804 40%, #0a0200 100%)',
        paddingTop: '5rem',
        paddingBottom: '5rem',
      }}
    >
      {/* Ambient glow blobs */}
      <div
        className="absolute top-0 left-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(243,162,19,0.06) 0%, transparent 70%)', transform: 'translateY(-30%)' }}
      />
      <div
        className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(125,54,39,0.08) 0%, transparent 70%)', transform: 'translateY(30%)' }}
      />

      {/* Top border */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(to right, transparent, rgba(243,162,19,0.3), transparent)' }}
      />

      {/* Background watermark: large @NutriTribe text */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
        aria-hidden
      >
        <span
          className="font-display font-bold italic whitespace-nowrap"
          style={{
            fontSize: 'clamp(80px, 14vw, 180px)',
            color: 'rgba(243,162,19,0.03)',
            letterSpacing: '-0.02em',
          }}
        >
          @NutriTribe
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* ── Heading ── */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-5"
            style={{
              background: 'rgba(243,162,19,0.1)',
              border: '1px solid rgba(243,162,19,0.2)',
            }}
          >
            <InstagramIcon size={12} className="text-sun-harvest" />
            <span
              className="font-body font-bold text-[10px] tracking-[0.3em] uppercase"
              style={{ color: '#f3a213' }}
            >
              @NutriTribe
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display font-bold text-4xl md:text-5xl"
            style={{ color: '#fdfbf7' }}
          >
            Join the{' '}
            <em className="not-italic" style={{ color: '#f3a213' }}>Tribe</em>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-body text-base mt-4 max-w-md mx-auto"
            style={{ color: 'rgba(253,251,247,0.45)' }}
          >
            Daily snack inspo, recipes, and behind-the-scenes from the lily ponds of Bihar.
          </motion.p>
        </div>

        {/* ── Instagram Grid ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
          {tiles.map((tile, i) => (
            <motion.a
              key={i}
              href="https://www.instagram.com/nutritribe.shop"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.85, y: 20 }}
              animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
              transition={{ delay: 0.08 + i * 0.07, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="relative aspect-square rounded-2xl overflow-hidden group cursor-pointer"
              style={{
                background: `linear-gradient(145deg, ${tile.color}cc, ${tile.color}88)`,
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
              }}
            >
              {/* Inner pattern */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'radial-gradient(circle at 25% 25%, rgba(255,255,255,0.15) 0%, transparent 55%)',
                }}
              />

              {/* Scattered makhana seeds */}
              <div className="absolute top-2 right-2 pointer-events-none">
                <MkSeed opacity={0.35} />
              </div>
              <div className="absolute bottom-3 left-2 pointer-events-none">
                <MkSeed opacity={0.25} />
              </div>

              {/* Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-3">
                <span className="text-2xl mb-1.5">{tile.icon}</span>
                <p className="font-body font-bold text-white text-[8px] text-center tracking-widest uppercase leading-tight opacity-90">
                  {tile.label}
                </p>
                <p className="font-body text-white/50 text-[7px] text-center tracking-wide mt-0.5">
                  {tile.sub}
                </p>
              </div>

              {/* Hover overlay */}
              <div
                className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
                style={{ background: 'rgba(243,162,19,0.92)', backdropFilter: 'blur(4px)' }}
              >
                <InstagramIcon size={26} className="text-white mb-1.5" />
                <p className="font-body font-bold text-xs text-white tracking-[0.25em] uppercase">
                  Follow
                </p>
              </div>
            </motion.a>
          ))}
        </div>

        {/* ── CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col items-center gap-3"
        >
          <motion.a
            href="https://www.instagram.com/nutritribe.shop"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-3 font-body font-bold text-sm px-9 py-4 rounded-full tracking-wide"
            style={{
              background: 'linear-gradient(135deg, #f3a213, #e08020)',
              color: '#050100',
              boxShadow: '0 8px 32px rgba(243,162,19,0.3)',
            }}
          >
            <InstagramIcon size={18} />
            Follow on Instagram
          </motion.a>
          <p className="font-body text-xs" style={{ color: 'rgba(253,251,247,0.25)', letterSpacing: '0.15em' }}>
            Join 10,000+ snack lovers in the tribe
          </p>
        </motion.div>
      </div>
    </section>
  );
}
