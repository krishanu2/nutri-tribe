'use client';

import { motion } from 'framer-motion';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
  light?: boolean;
}

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  light = false,
}: SectionHeadingProps) {
  const alignClass = {
    left: 'text-left',
    center: 'text-center mx-auto',
    right: 'text-right',
  }[align];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`max-w-3xl ${alignClass}`}
    >
      {eyebrow && (
        <p className={`font-body font-bold text-xs tracking-[0.2em] uppercase mb-3 ${light ? 'text-sun-harvest' : 'text-sun-harvest'}`}>
          {eyebrow}
        </p>
      )}
      <h2 className={`font-display font-bold text-4xl md:text-5xl lg:text-6xl leading-tight ${light ? 'text-white' : 'text-earthen-rust'}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`font-body text-lg mt-4 leading-relaxed ${light ? 'text-white/75' : 'text-earthen-rust/70'}`}>
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
