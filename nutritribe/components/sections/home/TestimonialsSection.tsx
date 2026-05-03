'use client';

import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    quote:
      "I've tried every makhana brand out there — NutriTribe is on a completely different level. The crunch, the flavour, the freshness. It's addictive in the best way possible.",
    name: 'Priya Sharma',
    location: 'Mumbai, Maharashtra',
    rating: 5,
    product: 'Peri Peri Makhana',
    initial: 'P',
    color: '#f3a213',
  },
  {
    id: 2,
    quote:
      "As a nutritionist, I'm very picky about snacks I recommend. NutriTribe's plain makhana is the cleanest, most nutritious option I've found. My clients love it.",
    name: 'Dr. Ananya Bose',
    location: 'Kolkata, West Bengal',
    rating: 5,
    product: 'Plain Makhana',
    initial: 'A',
    color: '#009846',
  },
  {
    id: 3,
    quote:
      "Finally a snack that doesn't compromise on taste or health! The Cream & Onion flavour is absolutely incredible. My whole family is obsessed.",
    name: 'Rahul Mehta',
    location: 'Bangalore, Karnataka',
    rating: 5,
    product: 'Cream & Onion Makhana',
    initial: 'R',
    color: '#7a4dff',
  },
  {
    id: 4,
    quote:
      "What I love most is the story behind the brand. Knowing my snack supports farmers in Bihar makes every bite even more satisfying. The quality speaks for itself.",
    name: 'Kavitha Nair',
    location: 'Chennai, Tamil Nadu',
    rating: 5,
    product: 'Salt & Pepper Makhana',
    initial: 'K',
    color: '#D4AF37',
  },
];

/* ── Lotus blossom decorative SVG ── */
function LotusDecor({ size = 220, opacity = 0.06 }: { size?: number; opacity?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" style={{ opacity }}>
      {[0, 36, 72, 108, 144, 180, 216, 252, 288, 324].map((angle, i) => (
        <ellipse
          key={i}
          cx="100" cy="68" rx="14" ry="38"
          fill="#f3a213"
          transform={`rotate(${angle} 100 100)`}
        />
      ))}
      <circle cx="100" cy="100" r="22" fill="#f3a213" opacity="0.9" />
      <circle cx="100" cy="100" r="12" fill="#fdfbf7" opacity="0.4" />
    </svg>
  );
}

/* ── Makhana ball ── */
function MakhanaBall({ size = 18, opacity = 0.25 }: { size?: number; opacity?: number }) {
  const id = `mb-${size}`;
  return (
    <svg width={size} height={size} viewBox="0 0 30 30" fill="none" style={{ opacity }}>
      <defs>
        <radialGradient id={id} cx="33%" cy="28%" r="70%">
          <stop offset="0%" stopColor="#fdfbf7" />
          <stop offset="50%" stopColor="#e8d4a8" />
          <stop offset="100%" stopColor="#b8916a" />
        </radialGradient>
      </defs>
      <circle cx="15" cy="15" r="13" fill={`url(#${id})`} />
      <circle cx="10" cy="10" r="2.5" fill="#7a5c30" opacity="0.4" />
      <ellipse cx="10" cy="10" rx="4" ry="2.5" fill="white" opacity="0.35" transform="rotate(-20 10 10)" />
    </svg>
  );
}

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.05 });

  const prev = () => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);
  const next = () => setCurrent((c) => (c + 1) % testimonials.length);
  const t = testimonials[current];

  return (
    <section
      ref={ref}
      className="relative overflow-hidden"
      style={{
        background: 'linear-gradient(160deg, #fdf8f0 0%, #f5ede0 50%, #fdf5e8 100%)',
        paddingTop: '5rem',
        paddingBottom: '5rem',
      }}
    >
      {/* Background texture: subtle grain overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg width=\'200\' height=\'200\' viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.75\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'200\' height=\'200\' filter=\'url(%23n)\' opacity=\'0.03\'/%3E%3C/svg%3E")',
          opacity: 0.4,
        }}
      />

      {/* Decorative floating lotus elements */}
      <div className="absolute -top-8 -left-8 pointer-events-none">
        <LotusDecor size={280} opacity={0.07} />
      </div>
      <div className="absolute -bottom-12 -right-12 pointer-events-none">
        <LotusDecor size={320} opacity={0.05} />
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <LotusDecor size={600} opacity={0.025} />
      </div>

      {/* Floating makhana balls */}
      {[
        { top: '12%', left: '8%', size: 28 },
        { top: '78%', left: '5%', size: 20 },
        { top: '20%', right: '6%', size: 24 },
        { top: '65%', right: '9%', size: 32 },
        { top: '45%', left: '3%', size: 16 },
        { top: '88%', right: '4%', size: 18 },
      ].map((pos, i) => (
        <div key={i} className="absolute pointer-events-none" style={pos}>
          <MakhanaBall size={pos.size} opacity={0.2} />
        </div>
      ))}

      {/* Top ornamental border */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(to right, transparent, rgba(243,162,19,0.35), transparent)' }} />

      <div className="max-w-6xl mx-auto px-6 relative z-10">

        {/* ── Heading ── */}
        <div className="text-center mb-14">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="font-body font-bold text-xs tracking-[0.35em] uppercase mb-3"
            style={{ color: '#f3a213' }}
          >
            Tribe Voices
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display font-bold text-4xl md:text-5xl"
            style={{ color: '#3d1c0e' }}
          >
            What the{' '}
            <em className="not-italic" style={{ color: '#f3a213' }}>Tribe</em>{' '}
            Says
          </motion.h2>
          {/* Ornamental divider */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={isInView ? { opacity: 1, scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="flex items-center justify-center gap-3 mt-5 origin-center"
          >
            <div className="h-px w-20" style={{ background: 'linear-gradient(to right, transparent, rgba(243,162,19,0.4))' }} />
            <MakhanaBall size={10} opacity={0.8} />
            <div className="h-px w-8" style={{ background: 'rgba(243,162,19,0.4)' }} />
            <MakhanaBall size={10} opacity={0.8} />
            <div className="h-px w-20" style={{ background: 'linear-gradient(to left, transparent, rgba(243,162,19,0.4))' }} />
          </motion.div>
        </div>

        {/* ── Testimonial card ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative max-w-4xl mx-auto"
        >
          {/* Big decorative quote icon */}
          <div
            className="absolute -top-6 -left-4 pointer-events-none select-none"
            style={{ color: '#f3a213', opacity: 0.12 }}
          >
            <Quote size={120} strokeWidth={1} fill="currentColor" />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.98 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="relative rounded-3xl overflow-hidden"
              style={{
                background: '#fff',
                border: '1.5px solid rgba(243,162,19,0.2)',
                boxShadow: '0 32px 80px rgba(100,40,10,0.12), 0 8px 24px rgba(100,40,10,0.06)',
              }}
            >
              {/* Amber top accent */}
              <div className="h-1 w-full" style={{ background: `linear-gradient(to right, ${t.color}, #f3a213)` }} />

              <div className="p-8 md:p-12">
                {/* Stars */}
                <div className="flex gap-1 mb-6">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={16} className="fill-sun-harvest text-sun-harvest" />
                  ))}
                </div>

                {/* Quote text */}
                <blockquote
                  className="font-display italic leading-relaxed mb-8"
                  style={{ fontSize: 'clamp(18px, 2.2vw, 24px)', color: '#3d1c0e' }}
                >
                  &ldquo;{t.quote}&rdquo;
                </blockquote>

                {/* Author row */}
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center font-display font-bold text-2xl shadow-md"
                      style={{
                        background: `linear-gradient(135deg, ${t.color}22, ${t.color}44)`,
                        border: `2.5px solid ${t.color}60`,
                        color: t.color,
                        boxShadow: `0 0 0 4px ${t.color}14`,
                      }}
                    >
                      {t.initial}
                    </div>
                    <div>
                      <p className="font-body font-bold text-sm" style={{ color: '#3d1c0e' }}>
                        {t.name}
                      </p>
                      <p className="font-body text-xs mt-0.5" style={{ color: 'rgba(61,28,14,0.45)' }}>
                        {t.location}
                      </p>
                    </div>
                  </div>

                  {/* Product tag */}
                  <div
                    className="font-body font-semibold text-xs px-4 py-2 rounded-full"
                    style={{
                      background: `${t.color}14`,
                      border: `1px solid ${t.color}30`,
                      color: t.color,
                    }}
                  >
                    {t.product}
                  </div>
                </div>

                {/* Bottom ornament */}
                <div className="flex items-center gap-3 mt-7 pt-5" style={{ borderTop: '1px solid rgba(243,162,19,0.1)' }}>
                  <div className="h-px flex-1" style={{ background: 'rgba(243,162,19,0.12)' }} />
                  <MakhanaBall size={8} opacity={0.6} />
                  <div className="h-px flex-1" style={{ background: 'rgba(243,162,19,0.12)' }} />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* ── Navigation ── */}
          <div className="flex items-center justify-center gap-5 mt-8">
            <motion.button
              onClick={prev}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.93 }}
              className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200"
              style={{
                background: '#fff',
                border: '1.5px solid rgba(243,162,19,0.3)',
                color: '#3d1c0e',
                boxShadow: '0 4px 12px rgba(100,40,10,0.08)',
              }}
              aria-label="Previous"
            >
              <ChevronLeft size={18} />
            </motion.button>

            {/* Dot indicators */}
            <div className="flex items-center gap-2.5">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className="rounded-full transition-all duration-400"
                  style={{
                    width: i === current ? 28 : 8,
                    height: 8,
                    background: i === current ? '#f3a213' : 'rgba(243,162,19,0.2)',
                    transition: 'all 0.35s ease',
                  }}
                  aria-label={`Testimonial ${i + 1}`}
                />
              ))}
            </div>

            <motion.button
              onClick={next}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.93 }}
              className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200"
              style={{
                background: '#f3a213',
                color: '#fff',
                boxShadow: '0 4px 16px rgba(243,162,19,0.35)',
              }}
              aria-label="Next"
            >
              <ChevronRight size={18} />
            </motion.button>
          </div>

          {/* Counter */}
          <p className="text-center mt-4 font-body text-xs" style={{ color: 'rgba(61,28,14,0.35)', letterSpacing: '0.15em' }}>
            {current + 1} / {testimonials.length}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
