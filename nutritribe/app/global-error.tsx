'use client';

import { useEffect } from 'react';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'sans-serif', background: '#fdfbf7', color: '#7d3627' }}>
        <div style={{
          minHeight: '100vh', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '24px',
        }}>
          <div style={{ maxWidth: 420 }}>
            <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 12 }}>Something went wrong</h1>
            <p style={{ opacity: 0.6, lineHeight: 1.6, marginBottom: 32 }}>
              We hit an unexpected error loading this page. Please try again.
            </p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={reset}
                style={{
                  background: '#f3a213', color: '#fff', fontWeight: 700, fontSize: 14,
                  padding: '14px 32px', borderRadius: 999, border: 'none', cursor: 'pointer',
                }}
              >
                Try Again
              </button>
              <a
                href="/"
                style={{
                  border: '2px solid rgba(125,54,39,0.2)', color: '#7d3627', fontWeight: 600, fontSize: 14,
                  padding: '12px 32px', borderRadius: 999, textDecoration: 'none',
                }}
              >
                Back to Home
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
