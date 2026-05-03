'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { products } from '@/lib/products';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';

/* Makhana SVG used as section ornament */
function MakhanaOrb({ size = 40, opacity = 0.08 }: { size?: number; opacity?: number }) {
  const id = `mo-${size}`;
  return (
    <svg width={size} height={size} viewBox="0 0 30 30" fill="none" style={{ opacity }}>
      <defs>
        <radialGradient id={id} cx="33%" cy="28%" r="70%">
          <stop offset="0%" stopColor="#fdfbf7" />
          <stop offset="60%" stopColor="#e8d4a8" />
          <stop offset="100%" stopColor="#b8916a" />
        </radialGradient>
      </defs>
      <circle cx="15" cy="15" r="13" fill={`url(#${id})`} />
      <circle cx="10" cy="10" r="2.5" fill="#7a5c30" opacity="0.4" />
      <ellipse cx="10" cy="10" rx="4" ry="2.5" fill="white" opacity="0.3" transform="rotate(-20 10 10)" />
    </svg>
  );
}

export default function ProductShowcase() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.05 });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden"
      style={{
        background: 'linear-gradient(160deg, #fff9f0 0%, #fef3e2 40%, #fff7ee 100%)',
        paddingTop: '6rem',
        paddingBottom: '6rem',
      }}
    >
      {/* ── Background ornaments ── */}

      {/* Large amber circle top-left */}
      <div
        className="absolute -top-32 -left-32 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(243,162,19,0.07) 0%, transparent 70%)' }}
      />
      {/* Large amber circle bottom-right */}
      <div
        className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(125,54,39,0.06) 0%, transparent 70%)' }}
      />

      {/* Scattered makhana balls */}
      {[
        { top: '8%', left: '2%', size: 48 },
        { top: '14%', right: '3%', size: 36 },
        { top: '72%', left: '1%', size: 30 },
        { bottom: '10%', right: '2%', size: 42 },
        { top: '45%', left: '0%', size: 24 },
        { top: '55%', right: '1%', size: 28 },
      ].map((pos, i) => (
        <div key={i} className="absolute pointer-events-none" style={pos}>
          <MakhanaOrb size={pos.size} opacity={0.12} />
        </div>
      ))}

      {/* Top border line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(to right, transparent, rgba(243,162,19,0.3), transparent)' }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* ── Heading ── */}
        <div className="text-center mb-16">
          {/* Overline badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-5"
            style={{
              background: 'rgba(243,162,19,0.1)',
              border: '1px solid rgba(243,162,19,0.25)',
            }}
          >
            <MakhanaOrb size={12} opacity={1} />
            <span
              className="font-body font-bold text-[10px] tracking-[0.3em] uppercase"
              style={{ color: '#f3a213' }}
            >
              Our Collection
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display font-bold leading-tight"
            style={{ fontSize: 'clamp(36px, 5vw, 64px)', color: '#3d1c0e' }}
          >
            Snack Bold.{' '}
            <em className="not-italic" style={{ color: '#f3a213' }}>Live Rooted.</em>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-body text-base mt-4 max-w-xl mx-auto leading-relaxed"
            style={{ color: 'rgba(61,28,14,0.55)' }}
          >
            Six bold expressions of India&apos;s finest superfood — each roasted to perfection, never fried.
          </motion.p>

          {/* Ornamental line */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={isInView ? { opacity: 1, scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex items-center gap-3 justify-center mt-6 origin-center"
          >
            <div className="h-px w-20" style={{ background: 'linear-gradient(to right, transparent, rgba(243,162,19,0.4))' }} />
            <span style={{ color: '#f3a213', fontSize: 10 }}>✦</span>
            <div className="h-px w-10" style={{ background: 'rgba(243,162,19,0.4)' }} />
            <span style={{ color: '#f3a213', fontSize: 10 }}>✦</span>
            <div className="h-px w-20" style={{ background: 'linear-gradient(to left, transparent, rgba(243,162,19,0.4))' }} />
          </motion.div>
        </div>

        {/* ── Product Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>

        {/* ── CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-14"
        >
          <Link
            href="/products"
            className="inline-flex items-center gap-2 font-body font-bold text-sm px-10 py-4 rounded-full tracking-[0.1em] uppercase transition-all duration-300"
            style={{
              background: '#3d1c0e',
              color: '#fdfbf7',
              boxShadow: '0 8px 24px rgba(61,28,14,0.2)',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = '#f3a213';
              (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 28px rgba(243,162,19,0.35)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = '#3d1c0e';
              (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(61,28,14,0.2)';
            }}
          >
            View All Products
            <span style={{ marginLeft: 4 }}>→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
