'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

function FloatingBall({ size, x, y, delay }: { size: number; x: string; y: string; delay: number }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{ left: x, top: y, width: size, height: size }}
      animate={{ y: [0, -18, 0], opacity: [0.08, 0.18, 0.08] }}
      transition={{ duration: 4, repeat: Infinity, delay, ease: 'easeInOut' }}
    >
      <svg viewBox="0 0 60 60" fill="none">
        <defs>
          <radialGradient id={`b${delay}`} cx="33%" cy="28%" r="70%">
            <stop offset="0%" stopColor="#fdfbf7" />
            <stop offset="40%" stopColor="#e8d4a8" />
            <stop offset="100%" stopColor="#b8916a" />
          </radialGradient>
        </defs>
        <circle cx="30" cy="30" r="28" fill={`url(#b${delay})`} />
      </svg>
    </motion.div>
  );
}

export default function NotFound() {
  return (
    <div className="min-h-screen bg-ivory-grain flex flex-col items-center justify-center relative overflow-hidden px-6">
      {/* Floating makhana balls */}
      <FloatingBall size={80}  x="5%"  y="10%" delay={0} />
      <FloatingBall size={56}  x="88%" y="8%"  delay={1.2} />
      <FloatingBall size={48}  x="12%" y="78%" delay={0.6} />
      <FloatingBall size={72}  x="82%" y="72%" delay={1.8} />
      <FloatingBall size={40}  x="50%" y="5%"  delay={2.4} />
      <FloatingBall size={64}  x="70%" y="40%" delay={0.9} />

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-16"
      >
        <Link href="/">
          <div className="relative w-52 h-20">
            <Image src="/logo.png" alt="NutriTribe" fill className="object-contain" priority />
          </div>
        </Link>
      </motion.div>

      {/* 404 content */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.15 }}
        className="text-center max-w-md"
      >
        {/* Big makhana ball as the "0" in 404 */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <span className="font-display font-bold text-earthen-rust" style={{ fontSize: 'clamp(72px, 14vw, 120px)', lineHeight: 1 }}>4</span>
          <div className="relative" style={{ width: 'clamp(72px, 14vw, 120px)', height: 'clamp(72px, 14vw, 120px)' }}>
            <motion.div
              animate={{ rotate: [0, 8, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <svg viewBox="0 0 120 120" fill="none" className="w-full h-full">
                <defs>
                  <radialGradient id="ball404" cx="33%" cy="28%" r="68%">
                    <stop offset="0%" stopColor="#fdfbf7" />
                    <stop offset="35%" stopColor="#ecdfc4" />
                    <stop offset="70%" stopColor="#d4b485" />
                    <stop offset="100%" stopColor="#b8916a" />
                  </radialGradient>
                </defs>
                <circle cx="60" cy="60" r="55" fill="url(#ball404)" />
                <circle cx="42" cy="44" r="14" fill="white" fillOpacity="0.55" />
                {[[66,36],[80,56],[74,74],[54,80],[38,70],[32,52]].map(([sx,sy],i) => (
                  <circle key={i} cx={sx} cy={sy} r="3.5" fill="#b8916a" fillOpacity="0.35" />
                ))}
              </svg>
            </motion.div>
          </div>
          <span className="font-display font-bold text-earthen-rust" style={{ fontSize: 'clamp(72px, 14vw, 120px)', lineHeight: 1 }}>4</span>
        </div>

        <h1 className="font-display font-bold text-3xl text-earthen-rust mb-3">
          This page got popped!
        </h1>
        <p className="font-body text-earthen-rust/60 leading-relaxed mb-10">
          Looks like this page flew away like a freshly roasted makhana. Let&apos;s get you back to the good stuff.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="bg-sun-harvest text-white font-body font-bold text-sm px-8 py-3.5 rounded-full hover:brightness-110 hover:scale-105 transition-all duration-200 shadow-product"
          >
            Back to Home
          </Link>
          <Link
            href="/products"
            className="border-2 border-earthen-rust/20 text-earthen-rust font-body font-semibold text-sm px-8 py-3.5 rounded-full hover:border-sun-harvest hover:text-sun-harvest transition-all duration-200"
          >
            Shop Makhana
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
