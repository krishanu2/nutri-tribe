'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

/* ── Mithila Art Border ──────────────────────────────────────────────
   A bold, geometric divider inspired by Madhubani (Mithila) painting
   border motifs — repeating triangles, dots and a central rule line.
   Pure SVG, no photo assets needed.
   ────────────────────────────────────────────────────────────────── */

interface MithilaArtBorderProps {
  className?: string;
  color?: string;
}

const UNIT_WIDTH = 50;
const UNITS = 16;
const TOTAL_WIDTH = UNIT_WIDTH * UNITS;

export default function MithilaArtBorder({ className = '', color = '#f3a213' }: MithilaArtBorderProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });

  return (
    <div ref={ref} className={`w-full overflow-hidden select-none ${className}`} aria-hidden>
      <motion.svg
        viewBox={`0 0 ${TOTAL_WIDTH} 56`}
        preserveAspectRatio="none"
        className="w-full h-10 md:h-14"
        initial={{ opacity: 0, scaleX: 0.92 }}
        animate={inView ? { opacity: 1, scaleX: 1 } : {}}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      >
        <line x1="0" y1="6" x2={TOTAL_WIDTH} y2="6" stroke={color} strokeWidth="1.5" opacity="0.3" />
        <line x1="0" y1="50" x2={TOTAL_WIDTH} y2="50" stroke={color} strokeWidth="1.5" opacity="0.3" />

        {Array.from({ length: UNITS }).map((_, i) => {
          const cx = i * UNIT_WIDTH + UNIT_WIDTH / 2;
          const up = i % 2 === 0;
          return (
            <g key={i}>
              <polygon
                points={up ? `${cx - 12},34 ${cx + 12},34 ${cx},14` : `${cx - 12},22 ${cx + 12},22 ${cx},42`}
                fill="none"
                stroke={color}
                strokeWidth="1.5"
                opacity="0.45"
              />
              <circle cx={cx} cy="28" r="2.5" fill={color} opacity="0.6" />
              <circle cx={cx - 12} cy="6" r="1.5" fill={color} opacity="0.4" />
              <circle cx={cx + 12} cy="50" r="1.5" fill={color} opacity="0.4" />
            </g>
          );
        })}
      </motion.svg>
    </div>
  );
}
