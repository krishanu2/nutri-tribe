'use client';

import { Suspense } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const CATEGORY_INFO: Record<string, { title: string; desc: string; icon: string }> = {
  'seeds-nuts': {
    title: 'Seeds & Nuts',
    desc: 'A new lineup of roasted seeds and nuts, prepared with the same small-batch care as our makhana — high in protein, free from preservatives, and unmistakably NutriTribe.',
    icon: '🌰',
  },
  'healthy-beverages': {
    title: 'Healthy Beverages',
    desc: 'Clean, functional drinks rooted in the same Mithila ingredients we love — no refined sugar, no artificial additives, just nourishment in a bottle.',
    icon: '🥤',
  },
};

const DEFAULT_INFO = {
  title: 'A New Category',
  desc: "We're cooking up something new in the NutriTribe kitchen. Bold, clean, and rooted — just like everything else we make.",
  icon: '✨',
};

function ComingSoonContent() {
  const searchParams = useSearchParams();
  const cat = searchParams.get('cat') || '';
  const info = CATEGORY_INFO[cat] || DEFAULT_INFO;

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #1a0e0a 0%, #0d0500 100%)' }}
    >
      {/* Giant watermark text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden" aria-hidden>
        <span
          className="font-display font-bold italic"
          style={{ fontSize: 'clamp(80px, 20vw, 280px)', color: 'rgba(243,162,19,0.04)', letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}
        >
          Soon
        </span>
      </div>

      <div className="relative z-10 text-center px-6 py-32 max-w-xl mx-auto">
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
          Coming Soon to NutriTribe
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.15, type: 'spring', stiffness: 300, damping: 20 }}
          className="text-5xl sm:text-6xl mb-4"
        >
          {info.icon}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-display font-bold leading-tight mb-5"
          style={{ fontSize: 'clamp(36px, 6vw, 64px)', color: '#fdfbf7' }}
        >
          {info.title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="font-body text-base leading-relaxed mb-10"
          style={{ color: 'rgba(253,251,247,0.5)' }}
        >
          {info.desc}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Link href="/products">
            <motion.div
              className="relative inline-flex overflow-hidden items-center gap-2 px-8 py-3.5 rounded-full font-body font-bold text-sm tracking-wide"
              style={{ background: '#f3a213', color: '#050100' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
            >
              <span>Explore What&apos;s Live Now</span>
              <ArrowRight size={14} />
            </motion.div>
          </Link>
        </motion.div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" preserveAspectRatio="none" className="w-full" style={{ height: 60 }}>
          <path d="M0 60 Q360 20 720 40 Q1080 60 1440 25 L1440 60 Z" fill="#fdfbf7" />
        </svg>
      </div>
    </section>
  );
}

export default function ComingSoonPage() {
  return (
    <Suspense fallback={null}>
      <ComingSoonContent />
    </Suspense>
  );
}
