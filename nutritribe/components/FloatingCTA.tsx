'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function FloatingCTA() {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();

  // Hide on products page (user is already there) and the homepage (its own
  // scroll-driven sections, e.g. the Values section, run full-height and this
  // floating pill ends up sitting on top of their text on mobile)
  const isProductsPage = pathname === '/products' || pathname?.startsWith('/products/');
  const isHomePage = pathname === '/';

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.85);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && !isProductsPage && !isHomePage && (
        <motion.div
          className="fixed bottom-20 md:bottom-6 right-6 z-[9970]"
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ type: 'spring', stiffness: 340, damping: 26 }}
        >
          <Link href="/products">
            <motion.div
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.96 }}
              className="relative overflow-hidden flex items-center gap-2.5 font-body font-bold text-sm tracking-[0.12em] uppercase px-6 py-3.5 rounded-full"
              style={{
                background: '#f3a213',
                color: '#050100',
                boxShadow: '0 8px 32px rgba(243,162,19,0.45), 0 2px 8px rgba(0,0,0,0.2)',
              }}
            >
              {/* Makhana icon */}
              <svg width="16" height="16" viewBox="0 0 30 30" fill="none">
                <defs>
                  <radialGradient id="fcta-mk" cx="33%" cy="28%" r="70%">
                    <stop offset="0%" stopColor="#fdfbf7" />
                    <stop offset="60%" stopColor="#e8d4a8" />
                    <stop offset="100%" stopColor="#b8916a" />
                  </radialGradient>
                </defs>
                <circle cx="15" cy="15" r="13" fill="url(#fcta-mk)" />
                <ellipse cx="10" cy="10" rx="4" ry="2.5" fill="white" opacity="0.35" transform="rotate(-20 10 10)" />
              </svg>
              <span>Shop Now</span>
              {/* Shimmer sweep */}
              <motion.div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.28), transparent)' }}
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 2 }}
              />
            </motion.div>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
