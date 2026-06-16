'use client';

import { useEffect } from 'react';

export default function RootSegmentError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-ivory-grain flex flex-col items-center justify-center px-6 text-center">
      <div className="max-w-md">
        <h1 className="font-display font-bold text-3xl text-earthen-rust mb-3">
          Something went wrong
        </h1>
        <p className="font-body text-earthen-rust/60 leading-relaxed mb-10">
          Please try again — if the problem continues, head back to the homepage.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="bg-sun-harvest text-white font-body font-bold text-sm px-8 py-3.5 rounded-full hover:brightness-110 hover:scale-105 transition-all duration-200 shadow-product"
          >
            Try Again
          </button>
          <a
            href="/"
            className="border-2 border-earthen-rust/20 text-earthen-rust font-body font-semibold text-sm px-8 py-3.5 rounded-full hover:border-sun-harvest hover:text-sun-harvest transition-all duration-200"
          >
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
