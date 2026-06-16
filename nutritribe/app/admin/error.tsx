'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">
      <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mb-5">
        <AlertTriangle size={24} className="text-red-500" />
      </div>
      <h1 className="font-display font-bold text-2xl text-[#7d3627] mb-2">Something went wrong</h1>
      <p className="font-body text-sm text-[#7d3627]/55 max-w-sm mb-8">
        This page hit an unexpected error. You can try again, or head back to the dashboard.
      </p>
      <div className="flex items-center gap-3">
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 font-body font-semibold text-sm px-5 py-2.5 rounded-xl bg-[#f3a213] text-[#050100] hover:brightness-110 transition-all"
        >
          <RefreshCw size={14} />
          Try Again
        </button>
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 font-body font-semibold text-sm px-5 py-2.5 rounded-xl bg-white border border-[#7d3627]/12 text-[#7d3627]/70 hover:border-[#f3a213]/40 transition-all"
        >
          <Home size={14} />
          Dashboard
        </Link>
      </div>
    </div>
  );
}
