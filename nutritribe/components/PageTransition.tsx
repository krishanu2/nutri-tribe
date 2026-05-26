'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div key={pathname}>
        {/* Left curtain panel */}
        <motion.div
          className="fixed inset-y-0 left-0 w-1/2 z-[10000] pointer-events-none"
          style={{ background: 'linear-gradient(to right, #050100, #0d0703)' }}
          initial={{ x: '-100%' }}
          animate={{ x: '-100%' }}
          exit={{ x: 0 }}
          transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
        />
        {/* Right curtain panel */}
        <motion.div
          className="fixed inset-y-0 right-0 w-1/2 z-[10000] pointer-events-none"
          style={{ background: 'linear-gradient(to left, #050100, #0d0703)' }}
          initial={{ x: '100%' }}
          animate={{ x: '100%' }}
          exit={{ x: 0 }}
          transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* Page content fades in */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut', delay: 0.05 }}
        >
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
