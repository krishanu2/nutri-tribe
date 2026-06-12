'use client';

import { useState, useRef, Suspense } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { products, categories } from '@/lib/products';
import ProductCard from '@/components/ProductCard';
import MakhanaRoastScene from '@/components/illustrations/MakhanaRoastScene';
import Image from 'next/image';
import Link from 'next/link';

/* ── Category mood config ─────────────────────────────────── */
const MOODS: Record<string, { bg: string; accent: string; tagline: string; glyph: string }> = {
  'All':                  { bg: 'linear-gradient(135deg, #1a0e0a 0%, #0d0500 100%)', accent: '#f3a213', tagline: 'The full collection. Every bold bite.', glyph: '✦' },
  'Raw / Premium 6-Suta': { bg: 'linear-gradient(135deg, #022812 0%, #011a0b 100%)', accent: '#009846', tagline: 'Pure. Rooted. Minimal.', glyph: '🌿' },
  'Roasted Flavours':     { bg: 'linear-gradient(135deg, #190e40 0%, #0d0624 100%)', accent: '#7a4dff', tagline: 'Bold flavours. Clean ingredients.', glyph: '⚡' },
  'Premium Cookies':      { bg: 'linear-gradient(135deg, #2a0e05 0%, #180700 100%)', accent: '#7d3627', tagline: 'Guilt-free indulgence redefined.', glyph: '✨' },
};

/* ── Floating makhana ball ─────────────────────────────────── */
function Orb({ size = 32, opacity = 0.12 }: { size?: number; opacity?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 30 30" fill="none" style={{ opacity }}>
      <defs>
        <radialGradient id="porb" cx="33%" cy="28%" r="70%">
          <stop offset="0%" stopColor="#fdfbf7" />
          <stop offset="55%" stopColor="#e8d4a8" />
          <stop offset="100%" stopColor="#b8916a" />
        </radialGradient>
      </defs>
      <circle cx="15" cy="15" r="13" fill="url(#porb)" />
      <circle cx="10" cy="10" r="2.5" fill="#7a5c30" opacity="0.4" />
      <ellipse cx="10" cy="10" rx="4" ry="2.5" fill="white" opacity="0.3" transform="rotate(-20 10 10)" />
    </svg>
  );
}

/* ── Featured product hero ─────────────────────────────────── */
function FeaturedProduct({ product }: { product: typeof products[0]; accent?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="group relative rounded-3xl overflow-hidden col-span-full"
      style={{
        background: `linear-gradient(135deg, ${product.color}18, ${product.color}06)`,
        border: `1px solid ${product.color}30`,
        minHeight: 320,
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 h-full">
        {/* Left: text */}
        <div className="flex flex-col justify-center p-10 lg:p-14">
          {product.badge && (
            <span
              className="inline-block self-start font-body font-bold text-[9px] tracking-[0.3em] uppercase px-3 py-1 rounded-full mb-4"
              style={{ background: product.color, color: '#fff' }}
            >
              {product.badge}
            </span>
          )}
          <p className="font-body font-bold text-xs tracking-[0.3em] uppercase mb-2" style={{ color: product.color }}>
            Featured · {product.category}
          </p>
          <h2 className="font-display font-bold mb-2 leading-tight" style={{ fontSize: 'clamp(28px, 4vw, 52px)', color: '#1a0e0a' }}>
            {product.name}
          </h2>
          <p className="font-display italic text-xl mb-4" style={{ color: product.color }}>{product.tagline}</p>
          <p className="font-body text-sm text-earthen-rust/60 leading-relaxed max-w-md mb-8">{product.description}</p>
          <div className="flex items-center gap-4">
            <Link href={`/products/${product.slug}`}>
              <motion.div
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="font-body font-bold text-sm px-8 py-3.5 rounded-full text-white tracking-wide"
                style={{ background: product.color, boxShadow: `0 8px 24px ${product.color}40` }}
              >
                View Product →
              </motion.div>
            </Link>
            <span className="font-display font-bold text-3xl" style={{ color: '#1a0e0a' }}>₹{product.price}</span>
          </div>
        </div>
        {/* Right: illustration */}
        <div className="relative flex items-center justify-center p-4 overflow-hidden">
          <div
            className="absolute inset-0"
            style={{ background: `radial-gradient(circle at 60% 50%, ${product.color}14, transparent 70%)` }}
          />
          <div className="relative z-10 w-full max-w-sm">
            {product.category === 'Premium Cookies' ? (
              <motion.div
                animate={{ y: [0, -10, 0], rotate: [0, 2, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="flex items-center justify-center"
              >
                <div
                  className="w-52 h-52 rounded-full flex items-center justify-center text-9xl"
                  style={{
                    background: `radial-gradient(circle, ${product.color}18 0%, transparent 70%)`,
                    border: `2px solid ${product.color}20`,
                  }}
                >
                  🍪
                </div>
              </motion.div>
            ) : (
              <MakhanaRoastScene inView={isInView} className="w-full drop-shadow-xl" />
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ProductsContent() {
  const searchParams = useSearchParams();
  const initialCategory = categories.includes(searchParams.get('category') || '')
    ? (searchParams.get('category') as string)
    : 'All';
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const mood = MOODS[activeCategory] || MOODS['All'];

  const filtered = activeCategory === 'All' ? products : products.filter((p) => p.category === activeCategory);
  const [featured, ...rest] = filtered;

  return (
    <>
      {/* ── CINEMATIC HERO ─────────────────────────────── */}
      <section
        className="relative min-h-[70vh] flex flex-col items-center justify-center overflow-hidden"
        style={{ background: 'linear-gradient(155deg, #100600 0%, #0a0200 55%, #05000 100%)' }}
      >
        {/* Floating orbs */}
        {[
          { top: '15%', left: '6%', size: 60 }, { top: '70%', left: '4%', size: 40 },
          { top: '20%', right: '5%', size: 50 }, { top: '75%', right: '7%', size: 70 },
          { top: '45%', left: '1%', size: 30 }, { top: '50%', right: '2%', size: 35 },
        ].map((pos, i) => (
          <motion.div
            key={i}
            className="absolute pointer-events-none"
            style={pos}
            animate={{ y: [0, -16, 0] }}
            transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.4, ease: 'easeInOut' }}
          >
            <Orb size={pos.size} opacity={0.15} />
          </motion.div>
        ))}

        {/* Giant watermark text */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
          aria-hidden
        >
          <span
            className="font-display font-bold italic"
            style={{ fontSize: 'clamp(80px, 18vw, 240px)', color: 'rgba(243,162,19,0.04)', letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}
          >
            Collection
          </span>
        </div>

        <div className="relative z-10 text-center px-6 pt-36 pb-20">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center mb-8"
          >
            <div className="relative" style={{ width: 160, height: 44 }}>
              <Image src="/logo.png" alt="NutriTribe" fill className="object-contain" style={{ filter: 'brightness(0) invert(1)' }} priority />
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-body font-bold text-[10px] tracking-[0.4em] uppercase mb-4"
            style={{ color: 'rgba(243,162,19,0.7)' }}
          >
            Roasted in Bihar · Delivered to You
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="font-display font-bold leading-tight mb-4"
            style={{ fontSize: 'clamp(44px, 7vw, 96px)', color: '#fdfbf7' }}
          >
            The NutriTribe<br />
            <em className="not-italic" style={{ color: '#f3a213' }}>Collection</em>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="font-body text-base max-w-md mx-auto"
            style={{ color: 'rgba(253,251,247,0.45)' }}
          >
            Six bold expressions of India&apos;s finest superfood — each roasted to perfection, never fried.
          </motion.p>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" preserveAspectRatio="none" className="w-full" style={{ height: 60 }}>
            <path d="M0 60 Q360 20 720 40 Q1080 60 1440 25 L1440 60 Z" fill="#fdfbf7" />
          </svg>
        </div>
      </section>

      {/* ── FLAVOR MOOD SELECTOR ───────────────────────── */}
      <section
        className="sticky z-30 transition-all duration-700"
        style={{ top: 38, background: mood.bg }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-body text-[9px] font-bold tracking-[0.35em] uppercase mr-1" style={{ color: 'rgba(253,251,247,0.3)' }}>
              Mood:
            </span>
            {categories.map((cat) => {
              const m = MOODS[cat];
              const active = activeCategory === cat;
              return (
                <motion.button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="relative font-body font-bold text-xs px-5 py-2 rounded-full"
                  style={{
                    color: active ? '#050100' : 'rgba(253,251,247,0.5)',
                    border: `1px solid ${active ? 'transparent' : 'rgba(255,255,255,0.1)'}`,
                    background: active ? 'transparent' : 'rgba(255,255,255,0.07)',
                  }}
                >
                  {/* Sliding pill — shared layoutId creates smooth movement */}
                  {active && (
                    <motion.div
                      layoutId="cat-active-pill"
                      className="absolute inset-0 rounded-full"
                      style={{ background: m.accent, boxShadow: `0 4px 18px ${m.accent}50` }}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{m.glyph} {cat}</span>
                </motion.button>
              );
            })}

            <div className="ml-auto flex items-center gap-2">
              <AnimatePresence mode="wait">
                <motion.span
                  key={activeCategory}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="font-display italic text-sm"
                  style={{ color: mood.accent }}
                >
                  {mood.tagline}
                </motion.span>
              </AnimatePresence>
              <span className="font-body text-xs" style={{ color: 'rgba(253,251,247,0.25)' }}>
                · {filtered.length} product{filtered.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRODUCT GRID — editorial layout ──────────────── */}
      <section
        className="py-16 min-h-[60vh] transition-colors duration-700"
        style={{ background: '#fdfbf7' }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* Featured (first product, full-width) */}
              {featured && (
                <div className="grid grid-cols-1 gap-8 mb-8">
                  <FeaturedProduct product={featured} accent={mood.accent} />
                </div>
              )}

              {/* Rest in 3-col grid */}
              {rest.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {rest.map((product, i) => (
                    <ProductCard key={product.id} product={product} index={i} />
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── BOTTOM TRUST STRIP ─────────────────────────── */}
      <section
        className="py-8 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0d0703, #1a0e0a)' }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14">
            {[
              { icon: '🔥', label: 'Roasted Not Fried' },
              { icon: '🌿', label: 'No Preservatives' },
              { icon: '💪', label: '10g Protein / 100g' },
              { icon: '✓', label: 'Gluten-Free' },
              { icon: '🌾', label: 'Direct from Bihar' },
              { icon: '🧪', label: 'No MSG' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2.5">
                <span className="text-lg">{item.icon}</span>
                <span className="font-body font-semibold text-xs tracking-[0.18em] uppercase" style={{ color: 'rgba(253,251,247,0.55)' }}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={null}>
      <ProductsContent />
    </Suspense>
  );
}
