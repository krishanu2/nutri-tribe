'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { RefreshCw, Home } from 'lucide-react';

export default function CustomerError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-ivory-grain flex flex-col items-center justify-center px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md"
      >
        <h1 className="font-display font-bold text-3xl text-earthen-rust mb-3">
          Something went wrong
        </h1>
        <p className="font-body text-earthen-rust/60 leading-relaxed mb-10">
          That&apos;s on us, not you. Please try again — if it keeps happening, head back to the homepage.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 bg-sun-harvest text-white font-body font-bold text-sm px-8 py-3.5 rounded-full hover:brightness-110 hover:scale-105 transition-all duration-200 shadow-product"
          >
            <RefreshCw size={15} />
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 border-2 border-earthen-rust/20 text-earthen-rust font-body font-semibold text-sm px-8 py-3.5 rounded-full hover:border-sun-harvest hover:text-sun-harvest transition-all duration-200"
          >
            <Home size={15} />
            Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
