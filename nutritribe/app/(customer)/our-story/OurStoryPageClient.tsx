'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import BiharMap from '@/components/illustrations/BiharMap';
import MakhanaScene from '@/components/illustrations/MakhanaScene';
import HarvestStoryScene from '@/components/illustrations/HarvestStoryScene';
import MithilaArtBorder from '@/components/illustrations/MithilaArtBorder';

/* ── Makhana orb ── */
function MkOrb({ size = 16, opacity = 0.7 }: { size?: number; opacity?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 30 30" fill="none" style={{ opacity }}>
      <defs>
        <radialGradient id="mkorb2" cx="33%" cy="28%" r="70%">
          <stop offset="0%" stopColor="#fdfbf7" />
          <stop offset="60%" stopColor="#e8d4a8" />
          <stop offset="100%" stopColor="#b8916a" />
        </radialGradient>
      </defs>
      <circle cx="15" cy="15" r="13" fill="url(#mkorb2)" />
      <circle cx="10" cy="10" r="2.5" fill="#7a5c30" opacity="0.4" />
      <ellipse cx="10" cy="10" rx="4" ry="2.5" fill="white" opacity="0.3" transform="rotate(-20 10 10)" />
    </svg>
  );
}


/* ── Pull quote ── */
function PullQuote({ quote, author, accentColor = '#f3a213', dark = true }: { quote: string; author?: string; accentColor?: string; dark?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  return (
    <div ref={ref} className="relative max-w-4xl mx-auto text-center px-6 py-24 md:py-32">
      <motion.div
        initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 0.8 }}
        className="h-px w-24 mx-auto mb-10"
        style={{ background: accentColor, originX: 0.5 }}
      />
      <motion.p
        initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9, delay: 0.2 }}
        className="font-display font-bold italic leading-[1.15]"
        style={{ fontSize: 'clamp(26px, 4.5vw, 58px)', color: dark ? '#fdfbf7' : '#1a0e0a' }}
      >
        &ldquo;{quote}&rdquo;
      </motion.p>
      {author && (
        <motion.p
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="font-body text-sm mt-6 tracking-[0.2em] uppercase"
          style={{ color: accentColor }}
        >
          — {author}
        </motion.p>
      )}
      <motion.div
        initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="h-px w-16 mx-auto mt-10"
        style={{ background: accentColor, opacity: 0.4, originX: 0.5 }}
      />
    </div>
  );
}

/* ── Stat card ── */
function StatCard({ value, label, sub, color, index }: {
  value: string; label: string; sub: string; color: string; index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.7, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      className="relative rounded-2xl p-8 overflow-hidden"
      style={{ background: `linear-gradient(135deg, ${color}14, ${color}06)`, border: `1px solid ${color}25` }}
    >
      <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500"
        style={{ background: `radial-gradient(circle at 50% 50%, ${color}12, transparent 70%)` }} />
      <motion.div
        initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 0.6, delay: index * 0.12 + 0.3 }}
        className="absolute top-0 left-0 right-0 h-0.5"
        style={{ background: `linear-gradient(to right, ${color}, transparent)`, originX: 0 }}
      />
      <p className="font-display font-bold mb-1" style={{ fontSize: 'clamp(32px, 4vw, 52px)', color }}>{value}</p>
      <p className="font-body font-bold text-sm mb-1" style={{ color: '#fdfbf7' }}>{label}</p>
      <p className="font-body text-xs leading-relaxed" style={{ color: 'rgba(253,251,247,0.4)' }}>{sub}</p>
    </motion.div>
  );
}

/* ── Story beat (new chapter style) ── */
function StoryBeat({
  chapter, overline, headline, quote, body, accentColor, side = 'left', bg, dark = false, visual,
}: {
  chapter: string; overline: string; headline: React.ReactNode; quote?: string; body: string[];
  accentColor: string; side?: 'left' | 'right'; bg: string; dark?: boolean;
  visual: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const yText = useTransform(scrollYProgress, [0, 1], ['4%', '-4%']);

  const tc = dark ? '#fdfbf7' : '#1a0e0a';
  const sc = dark ? 'rgba(253,251,247,0.55)' : 'rgba(26,14,10,0.6)';

  return (
    <section ref={ref} className="relative overflow-hidden" style={{ background: bg }}>
      {/* Subtle chapter number watermark */}
      <div
        className="absolute pointer-events-none select-none"
        style={{
          [side === 'left' ? 'right' : 'left']: '-2vw',
          top: '50%', transform: 'translateY(-50%)',
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(120px, 20vw, 280px)',
          fontWeight: 900, fontStyle: 'italic',
          color: dark ? 'rgba(243,162,19,0.04)' : 'rgba(26,14,10,0.04)',
          lineHeight: 1, userSelect: 'none',
        }}
        aria-hidden
      >
        {chapter}
      </div>

      <div className="max-w-7xl mx-auto px-6 py-24 md:py-36 relative z-10">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center ${side === 'right' ? '' : ''}`}>

          {/* Text side */}
          <motion.div
            style={{ y: yText }}
            className={side === 'right' ? 'lg:order-2' : ''}
            initial={{ opacity: 0, x: side === 'right' ? 50 : -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Chapter badge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }} animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3 mb-7"
            >
              <div
                className="font-body font-bold text-[10px] px-3 py-1 rounded-full tracking-[0.3em] uppercase"
                style={{ background: `${accentColor}20`, border: `1px solid ${accentColor}40`, color: accentColor }}
              >
                Chapter {chapter}
              </div>
              <div className="h-px flex-1 max-w-16" style={{ background: `${accentColor}35` }} />
              <span style={{ color: accentColor, fontSize: 12 }}>✦</span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="font-body font-bold text-[10px] tracking-[0.35em] uppercase mb-3"
              style={{ color: accentColor }}
            >
              {overline}
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="font-display font-bold leading-[1.05] mb-6"
              style={{ fontSize: 'clamp(34px, 4.5vw, 62px)', color: tc }}
            >
              {headline}
            </motion.h2>

            {quote && (
              <motion.blockquote
                initial={{ opacity: 0, x: -12 }} animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="font-display italic text-lg md:text-xl mb-7 pl-5"
                style={{ color: accentColor, borderLeft: `3px solid ${accentColor}60` }}
              >
                &ldquo;{quote}&rdquo;
              </motion.blockquote>
            )}

            <div className="space-y-4">
              {body.map((para, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 14 }} animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.7, delay: 0.25 + i * 0.08 }}
                  className="font-body text-base leading-[1.95]"
                  style={{ color: sc }}
                >
                  {para}
                </motion.p>
              ))}
            </div>
          </motion.div>

          {/* Visual side */}
          <motion.div
            className={side === 'right' ? 'lg:order-1' : ''}
            initial={{ opacity: 0, y: 40, scale: 0.94 }}
            animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
          >
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                border: `1px solid ${accentColor}20`,
                boxShadow: dark
                  ? `0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px ${accentColor}10`
                  : `0 32px 80px rgba(26,14,10,0.14)`,
              }}
            >
              {visual}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

/* ── Timeline item ── */
function TimelineBeat({ year, title, body, color, index, isLast }: {
  year: string; title: string; body: string; color: string; index: number; isLast: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -30 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.08 }}
      className="relative flex gap-6 md:gap-10"
    >
      {/* Spine */}
      <div className="flex flex-col items-center shrink-0 w-16">
        <motion.div
          className="w-16 h-16 rounded-full flex flex-col items-center justify-center shrink-0 z-10"
          style={{ background: `linear-gradient(135deg, ${color}, ${color}88)`, boxShadow: `0 0 0 4px ${color}20, 0 8px 24px ${color}30` }}
          initial={{ scale: 0, rotate: -20 }}
          animate={inView ? { scale: 1, rotate: 0 } : {}}
          transition={{ duration: 0.5, delay: index * 0.08 + 0.15, type: 'spring', stiffness: 300 }}
        >
          <span className="font-display font-bold text-[11px] text-[#050100] leading-none">{year.slice(0, 2)}</span>
          <span className="font-display font-bold text-[11px] text-[#050100] leading-none">{year.slice(2)}</span>
        </motion.div>
        {!isLast && (
          <motion.div
            className="flex-1 w-0.5 mt-2"
            style={{ background: `linear-gradient(to bottom, ${color}50, ${color}08)` }}
            initial={{ scaleY: 0, originY: 0 }}
            animate={inView ? { scaleY: 1 } : {}}
            transition={{ duration: 0.7, delay: index * 0.08 + 0.3 }}
          />
        )}
      </div>

      {/* Content */}
      <div className="pb-14 pt-3">
        <p className="font-display font-bold text-3xl leading-none mb-1" style={{ color }}>{year}</p>
        <p className="font-body font-bold text-sm mb-2" style={{ color: '#1a0e0a' }}>{title}</p>
        <p className="font-body text-sm leading-relaxed" style={{ color: 'rgba(26,14,10,0.6)' }}>{body}</p>
      </div>
    </motion.div>
  );
}


/* ── Auto-advancing Harvest Act Cards ── */
const HARVEST_ACTS = [
  { num: '01', title: 'Before Dawn',    body: 'The Mallah Community of Mithila wakes at 4 AM. No alarm needed — the traditional ponds do not wait.', color: '#f3a213' },
  { num: '02', title: 'Into the Water', body: 'Men wade waist-deep into traditional lily ponds. The cold water. The stems. The ancient ritual begins.', color: '#009846' },
  { num: '03', title: 'The Dive',       body: 'Skilled divers hold their breath and sink to the pond floor, collecting seeds by feel alone.', color: '#7a4dff' },
  { num: '04', title: 'The Harvest',    body: 'At sunrise, baskets overflow. The Mallah Community emerges with the seeds that will become your makhana.', color: '#f3a213' },
];

function HarvestActCards() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActive(a => (a + 1) % HARVEST_ACTS.length);
    }, 3000);
  }, []);

  useEffect(() => {
    if (!paused) startTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [paused, startTimer]);

  const handleClick = (i: number) => {
    setActive(i);
    setPaused(true);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
      {HARVEST_ACTS.map((act, i) => {
        const isActive = i === active;
        return (
          <motion.div
            key={act.num}
            onClick={() => handleClick(i)}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className="rounded-xl p-5 cursor-pointer transition-all duration-300"
            style={{
              background: isActive
                ? `linear-gradient(135deg, ${act.color}20, ${act.color}10)`
                : `linear-gradient(135deg, ${act.color}10, ${act.color}05)`,
              border: isActive
                ? `1px solid ${act.color}60`
                : `1px solid ${act.color}20`,
              borderLeft: isActive ? `3px solid #EF9F27` : `1px solid ${act.color}20`,
              transform: isActive ? 'translateY(-2px)' : 'translateY(0)',
            }}
            whileHover={{ y: -2 }}
          >
            <p className="font-display font-bold text-3xl mb-2"
              style={{ color: act.color, opacity: isActive ? 0.6 : 0.35 }}>{act.num}</p>
            <p className="font-body font-bold text-sm mb-2"
              style={{ color: '#fdfbf7' }}>{act.title}</p>
            <p className="font-body text-xs leading-relaxed"
              style={{ color: isActive ? 'rgba(253,251,247,0.65)' : 'rgba(253,251,247,0.40)' }}>{act.body}</p>
            {isActive && (
              <motion.div
                className="h-0.5 mt-3 rounded-full"
                style={{ background: '#EF9F27', originX: 0 }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: paused ? 1 : [0, 1] }}
                transition={{ duration: paused ? 0 : 3, ease: 'linear' }}
              />
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

const timeline = [
  { year: '2020', title: 'The Seed is Planted', body: 'NutriTribe founded in a home kitchen in Patna — a dream to bring makhana to the world, without compromise.', color: '#f3a213' },
  { year: '2021', title: 'First Batch. First Love.', body: 'Our first plain makhana launch sold out in 3 days. The tribe had spoken — and we knew this was real.', color: '#009846' },
  { year: '2022', title: 'Bold Flavours. Real Partnerships.', body: 'Expanded to 3 flavours. Signed direct-trade agreements with 250+ Mallah families — fair wages, guaranteed.', color: '#7a4dff' },
  { year: '2023', title: '10,000 Happy Customers', body: 'Launched our D2C platform. Crossed 10,000 customers across India — all without a single distributor middleman.', color: '#f3a213' },
  { year: '2024', title: 'Premium Cookies Launch', body: 'Introduced our makhana cookie range. Pan-India shipping activated. The superfood goes mainstream.', color: '#009846' },
  { year: '2025', title: "India's Most Loved Makhana Brand", body: "The movement grows. The tribe expands. And Bihar's finest superfood finally takes its rightful place.", color: '#7a4dff' },
];

const FOUNDERS = [
  {
    name: 'Vishwajeet Kumar',
    quote: "Healthy snacking isn't a trend—it's a lifestyle. Our mission is to make nutrition simple, delicious, and accessible for everyone.",
  },
  {
    name: 'Rishabh Kumar',
    quote: 'From farm to snack bowl, we ensure every bite delivers quality, nutrition, and trust.',
  },
];

export default function OurStoryPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const harvestRef = useRef<HTMLDivElement>(null);
  const harvestInView = useInView(harvestRef, { once: true, amount: 0.2 });
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(heroScroll, [0, 1], ['0%', '35%']);
  const heroOpacity = useTransform(heroScroll, [0, 0.65], [1, 0]);
  const heroScale = useTransform(heroScroll, [0, 0.6], [1, 0.96]);

  return (
    <>
      {/* ════════════════════════════════════════
          CINEMATIC HERO
          ════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #120601 0%, #0a0200 50%, #020100 100%)' }}
      >
        {/* Grain */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />

        {/* Atmospheric glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div style={{ position: 'absolute', left: '25%', top: '15%', width: '50vw', height: '50vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(243,162,19,0.07) 0%, transparent 65%)' }} />
          <div style={{ position: 'absolute', right: '10%', bottom: '20%', width: '30vw', height: '30vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,152,70,0.05) 0%, transparent 65%)' }} />
        </div>

        {/* Floating makhana orbs */}
        {[
          { top: '15%', left: '6%', size: 55, dur: 3.8 },
          { top: '75%', left: '4%', size: 36, dur: 5.2 },
          { top: '22%', right: '6%', size: 48, dur: 4.4 },
          { top: '70%', right: '8%', size: 62, dur: 3.6 },
          { top: '48%', left: '1%', size: 28, dur: 6.0 },
          { top: '42%', right: '1%', size: 32, dur: 5.5 },
        ].map((pos, i) => (
          <motion.div key={i} className="absolute pointer-events-none" style={pos}
            animate={{ y: [0, -16, 0] }}
            transition={{ duration: pos.dur, repeat: Infinity, delay: i * 0.5, ease: 'easeInOut' }}>
            <MkOrb size={pos.size} opacity={0.1} />
          </motion.div>
        ))}

        <motion.div style={{ y: heroY, opacity: heroOpacity, scale: heroScale }} className="relative z-10 text-center px-6 pt-36 pb-28 max-w-5xl mx-auto">
          {/* Logo */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
            className="flex justify-center mb-10">
            <div className="relative" style={{ width: 170, height: 46 }}>
              <Image src="/logo.png" alt="NutriTribe" fill className="object-contain" style={{ filter: 'brightness(0) invert(1)' }} priority />
            </div>
          </motion.div>

          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="font-body font-bold text-[10px] tracking-[0.5em] uppercase mb-6"
            style={{ color: 'rgba(243,162,19,0.55)' }}>
            Est. in the Wetlands of Bihar · Since 2020
          </motion.p>

          <motion.h1 initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="font-display font-bold leading-[0.98] mb-8"
            style={{ fontSize: 'clamp(52px, 9vw, 120px)', color: '#fdfbf7', letterSpacing: '-0.02em' }}>
            A Story Born<br />
            <em className="not-italic" style={{ color: '#f3a213' }}>in Lily</em><br />
            <em className="not-italic" style={{ color: 'rgba(253,251,247,0.7)', fontSize: '0.75em' }}>Water.</em>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.4 }}
            className="font-body text-lg max-w-xl mx-auto leading-relaxed mb-12"
            style={{ color: 'rgba(253,251,247,0.4)' }}>
            From the sacred wetlands of Mithila to your hands — 2,500 years of heritage, one bold snack.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.55 }}
            className="flex flex-wrap gap-4 justify-center">
            <a href="#story">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                className="font-body font-bold text-sm px-9 py-4 rounded-full"
                style={{ background: '#f3a213', color: '#050100', boxShadow: '0 8px 32px rgba(243,162,19,0.4)' }}>
                Enter the Story ↓
              </motion.div>
            </a>
            <Link href="/products">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                className="font-body font-bold text-sm px-9 py-4 rounded-full"
                style={{ border: '1px solid rgba(243,162,19,0.25)', color: 'rgba(253,251,247,0.65)' }}>
                Shop Now →
              </motion.div>
            </Link>
          </motion.div>

          {/* Hero stats */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9, delay: 0.85 }}
            className="grid grid-cols-3 gap-8 mt-20 pt-10 max-w-lg mx-auto"
            style={{ borderTop: '1px solid rgba(243,162,19,0.1)' }}>
            {[['250+', 'Families'], ['2,500', 'Yr Heritage'], ['100%', 'Direct Trade']].map(([v, l]) => (
              <div key={l} className="text-center">
                <p className="font-display font-bold text-xl md:text-2xl" style={{ color: '#f3a213' }}>{v}</p>
                <p className="font-body text-[9px] tracking-[0.2em] uppercase mt-1" style={{ color: 'rgba(253,251,247,0.28)' }}>{l}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <svg width="20" height="32" viewBox="0 0 20 32" fill="none">
            <rect x="1" y="1" width="18" height="30" rx="9" stroke="rgba(243,162,19,0.3)" strokeWidth="1.5" />
            <motion.rect x="8.5" y="6" width="3" height="8" rx="1.5" fill="#f3a213" fillOpacity="0.7"
              animate={{ y: [0, 10, 0], opacity: [0.7, 0.2, 0.7] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} />
          </svg>
        </motion.div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" preserveAspectRatio="none" className="w-full" style={{ height: 80 }}>
            <path d="M0 80 Q360 30 720 55 Q1080 80 1440 30 L1440 80 Z" fill="#fdf6e8" />
          </svg>
        </div>
      </section>

      {/* ════════════════════════════════════════
          THE 4 AM MOMENT — cinematic pre-dawn scene
          ════════════════════════════════════════ */}
      <section
        id="story"
        className="relative overflow-hidden"
        style={{ background: 'linear-gradient(170deg, #02060e 0%, #080410 50%, #04020a 100%)' }}
      >
        {/* Faint star field */}
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(1px 1px at 20% 30%, rgba(255,255,255,0.4) 0%, transparent 100%), radial-gradient(1px 1px at 60% 15%, rgba(255,255,255,0.35) 0%, transparent 100%), radial-gradient(1px 1px at 80% 60%, rgba(255,255,255,0.3) 0%, transparent 100%)', backgroundSize: '200px 200px, 150px 150px, 300px 300px' }} />

        <div className="max-w-3xl mx-auto px-6 pt-24 pb-16 relative z-10 text-center">
          {/* Clock */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="font-display font-bold italic" style={{ fontSize: 'clamp(64px, 12vw, 108px)', color: '#f3a213', lineHeight: 1 }}>
              4:00 AM
            </p>
          </motion.div>

          <motion.div
            className="w-16 h-px mx-auto mt-8 mb-10"
            style={{ background: 'linear-gradient(to right, transparent, rgba(243,162,19,0.5), transparent)' }}
            initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />

          {/* Typewriter-style narrative */}
          {[
            "The alarm does not ring. It never needs to.",
            "A Mallah family of the Mithila Community in Darbhanga has woken before 4 AM for four hundred years — before electric light, before roads, before anyone in the city had heard the word makhana.",
            "They wade into the traditional ponds, cold water rising to the waist. Their hands know the pond floor by feel alone.",
            "By 9 AM, they have harvested enough to feed a nation.",
          ].map((para, i) => (
            <motion.p
              key={i}
              className="font-body leading-[1.95] mb-5"
              style={{ fontSize: i === 0 ? 20 : 16, color: i === 0 ? 'rgba(253,251,247,0.9)' : 'rgba(253,251,247,0.55)', fontStyle: i === 0 ? 'italic' : 'normal' }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 + i * 0.15 }}
            >
              {para}
            </motion.p>
          ))}
        </div>

        {/* Pre-dawn pond SVG silhouette */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, delay: 0.3 }}
          className="w-full"
        >
          <svg viewBox="0 0 1200 200" fill="none" className="w-full" style={{ display: 'block' }}>
            <defs>
              <linearGradient id="os-sky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#020408" />
                <stop offset="60%"  stopColor="#060c1a" />
                <stop offset="100%" stopColor="#0a1428" />
              </linearGradient>
              <linearGradient id="os-water" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#0d1f38" />
                <stop offset="100%" stopColor="#04080f" />
              </linearGradient>
              <radialGradient id="os-moon" cx="50%" cy="50%" r="50%">
                <stop offset="0%"   stopColor="#d4c87a" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#d4c87a" stopOpacity="0"   />
              </radialGradient>
            </defs>

            {/* Sky */}
            <rect width="1200" height="200" fill="url(#os-sky)" />

            {/* Stars */}
            {[
              [80,28],[160,14],[240,36],[380,18],[480,32],[560,10],[640,25],[750,40],[820,15],[920,30],
              [1000,20],[1080,38],[1140,12],[320,42],[700,8],[430,50],[880,45],[200,52],[1050,55],[560,48],
            ].map(([x,y],i) => (
              <motion.circle key={i} cx={x} cy={y} r={i%5===0?1.8:1.2} fill="white"
                animate={{ opacity:[0.65,0.15,0.65] }}
                transition={{ duration:2.5+i%4*0.6, repeat:Infinity, delay:i*0.22 }} />
            ))}

            {/* Moon glow */}
            <circle cx="960" cy="35" r="28" fill="url(#os-moon)" />
            <circle cx="960" cy="35" r="12" fill="#d4c87a" opacity="0.88" />
            <circle cx="966" cy="32" r="9.5" fill="#060c1a" />

            {/* Distant tree line silhouette */}
            <path d="M0 130 Q60 110 120 120 Q180 108 240 118 Q300 105 360 115 Q420 102 480 112 Q540 100 600 110 Q660 98 720 108 Q780 96 840 105 Q900 92 960 102 Q1020 90 1080 100 Q1140 88 1200 98 L1200 200 L0 200 Z"
              fill="#08120a" opacity="0.95" />

            {/* Water surface */}
            <path d="M0 155 Q200 145 400 152 Q600 158 800 148 Q1000 140 1200 150 L1200 200 L0 200 Z"
              fill="url(#os-water)" />
            <path d="M0 155 Q200 145 400 152 Q600 158 800 148 Q1000 140 1200 150"
              stroke="#1e3a5e" strokeWidth="1.5" fill="none" opacity="0.6" />

            {/* Moon reflection on water */}
            <motion.ellipse cx="960" cy="162" rx="22" ry="5" fill="#d4c87a" fillOpacity="0.18"
              animate={{ ry:[4,6,4], opacity:[0.15,0.28,0.15] }} transition={{ duration:3.5, repeat:Infinity }} />

            {/* Lily pads (silhouette) */}
            {[[180,158,22,8],[350,162,18,7],[520,156,24,9],[720,160,20,7],[920,158,26,9],[1080,162,18,7]].map(([x,y,rx,ry],i)=>(
              <ellipse key={i} cx={x} cy={y} rx={rx} ry={ry} fill="#0e2810" opacity="0.88" />
            ))}

            {/* Water lily silhouettes */}
            {[[180,148],[520,146],[920,146]].map(([x,y],i)=>(
              <g key={i}>
                <line x1={x} y1={y+10} x2={x} y2={y+2} stroke="#12380a" strokeWidth="1.5" />
                {[0,36,72,108,144,180,216,252,288,324].map((a,j)=>(
                  <ellipse key={j} cx={x+7*Math.cos(a*Math.PI/180)} cy={y+7*Math.sin(a*Math.PI/180)}
                    rx="3.5" ry="1.5" fill="#1a4012" opacity="0.75"
                    transform={`rotate(${a} ${x+7*Math.cos(a*Math.PI/180)} ${y+7*Math.sin(a*Math.PI/180)})`} />
                ))}
                <circle cx={x} cy={y} r="3.5" fill="#1a4012" opacity="0.8" />
              </g>
            ))}

            {/* Water shimmer */}
            {[[240,165],[460,160],[680,163],[900,158],[1120,162]].map(([x,y],i)=>(
              <motion.line key={i} x1={x} y1={y} x2={x+30} y2={y}
                stroke="#1e3a5e" strokeWidth="1.2" strokeLinecap="round"
                animate={{ opacity:[0.15,0.5,0.15] }}
                transition={{ duration:2.8, repeat:Infinity, delay:i*0.5 }} />
            ))}

            {/* Mist wisps above water */}
            {[0,1,2].map(i => (
              <motion.ellipse key={i} cx={280+i*320} cy={148} rx={60+i*20} ry={8}
                fill="rgba(180,200,220,0.055)"
                animate={{ opacity:[0.3,0.7,0.3] }}
                transition={{ duration:7+i*2, repeat:Infinity, ease:'easeInOut', delay:i*1.5 }} />
            ))}
          </svg>
        </motion.div>

        {/* Fade to next section */}
        <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, transparent, #fdf6e8)' }} />
      </section>

      {/* ════════════════════════════════════════
          CHAPTER 01 — THE LAND
          ════════════════════════════════════════ */}
      <div>
        <StoryBeat
          chapter="01"
          overline="The Origin"
          headline={<>Where the World&apos;s<br />Finest Makhana<br /><em className="not-italic" style={{ color: '#f3a213' }}>Grows.</em></>}
          quote="The water is ancient. The knowledge is older."
          body={[
            "The Mithila wetlands of North Bihar stretch across more than 25,000 hectares of mineral-rich floodplain fed by Himalayan runoff. This is not farmland — it is a living ecosystem that has produced makhana for over 2,500 years.",
            "India produces 90% of the world's makhana. Bihar alone accounts for 80% of that. And within Bihar, the Mithila region — our home — grows the finest grade: the 6-suta, the premium lily seed prized by chefs and nutritionists alike.",
            "The water here has a character. A mineral profile. A story. And that story ends up in every single seed we pack.",
            "Mithila is also revered as the birthplace of Mata Sita — a land where devotion runs as deep as the wetlands themselves. This is the same soil that gave the world Mithila Art (Madhubani painting), the centuries-old folk tradition of bold lines, natural pigments and sacred motifs passed down through generations of women artists.",
          ]}
          accentColor="#f3a213"
          side="left"
          bg="#fdf6e8"
          visual={
            <div className="p-6 bg-[#fdf6e8]">
              <BiharMap className="w-full" />
              <div className="mt-4 grid grid-cols-3 gap-3">
                {[['25,000+ ha', 'Wetland Area'], ['90%', 'World Supply'], ['6-Suta', 'Premium Grade']].map(([v, l]) => (
                  <div key={l} className="text-center py-3 rounded-xl" style={{ background: 'rgba(243,162,19,0.08)', border: '1px solid rgba(243,162,19,0.15)' }}>
                    <p className="font-display font-bold text-lg" style={{ color: '#f3a213' }}>{v}</p>
                    <p className="font-body text-[9px] tracking-[0.15em] uppercase mt-0.5" style={{ color: 'rgba(26,14,10,0.5)' }}>{l}</p>
                  </div>
                ))}
              </div>
            </div>
          }
        />
        <div className="px-6 md:px-12 pb-10 md:pb-14" style={{ background: '#fdf6e8' }}>
          <MithilaArtBorder className="max-w-3xl mx-auto" color="#f3a213" />
        </div>
      </div>

      {/* ════════════════════════════════════════
          FULL-BLEED QUOTE #1
          ════════════════════════════════════════ */}
      <section style={{ background: 'linear-gradient(155deg, #0d0703 0%, #12080a 100%)' }}>
        <PullQuote
          quote="They wake before the sun. They enter water before it is warm. They do it because their fathers did, and their fathers' fathers did — and because the seed is worth it."
          author="The Mallah Community of Mithila"
          accentColor="#f3a213"
        />
      </section>

      {/* ════════════════════════════════════════
          THE HARVEST FILM STRIP — "video" section
          ════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden py-24 md:py-36"
        style={{ background: 'linear-gradient(160deg, #0d1208 0%, #071009 100%)' }}
      >
        {/* Atmospheric */}
        <div className="absolute inset-0 pointer-events-none">
          <div style={{ position: 'absolute', left: '20%', top: '20%', width: '60%', height: '60%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,152,70,0.05) 0%, transparent 70%)' }} />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <p className="font-body font-bold text-[10px] tracking-[0.45em] uppercase mb-4" style={{ color: 'rgba(0,152,70,0.7)' }}>
              The Harvest Story
            </p>
            <h2 className="font-display font-bold leading-tight" style={{ fontSize: 'clamp(32px, 5vw, 64px)', color: '#fdfbf7' }}>
              From Pond Floor<br />
              <em className="not-italic" style={{ color: '#009846' }}>to Your Hands</em>
            </h2>
            <p className="font-body text-base mt-4 max-w-lg mx-auto" style={{ color: 'rgba(253,251,247,0.35)' }}>
              Every seed you eat was handpicked by a diver from the Mallah Community of Mithila. This is their story, in four acts.
            </p>
          </motion.div>

          {/* Film strip wrapper */}
          <div ref={harvestRef}>
            <HarvestStoryScene inView={harvestInView} className="w-full" />
          </div>

          {/* Below film: the 4 acts — auto-advance every 3s, click to pause */}
          <HarvestActCards />
        </div>
      </section>

      {/* ════════════════════════════════════════
          DAY IN THE LIFE — horizontal timeline
          ════════════════════════════════════════ */}
      <section className="relative py-20 overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #0d1208 0%, #071009 100%)' }}>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true }} transition={{ duration:0.7 }}
            className="text-center mb-14">
            <p className="font-body font-bold text-[10px] tracking-[0.4em] uppercase mb-3" style={{ color:'rgba(0,152,70,0.7)' }}>
              A Mallah&apos;s Day
            </p>
            <h2 className="font-display font-bold leading-tight" style={{ fontSize:'clamp(28px,4vw,52px)', color:'#fdfbf7' }}>
              From Midnight to Dusk
            </h2>
          </motion.div>

          <div className="relative">
            {/* Spine line */}
            <div className="hidden md:block absolute top-8 left-0 right-0 h-px"
              style={{ background:'linear-gradient(to right, transparent, rgba(243,162,19,0.25), transparent)' }} />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { time:'3:30 AM', title:'The Waking', body:'The family stirs. Tea is brewed on a clay stove. No alarm — the body knows the hour.', color:'#f3a213' },
                { time:'4:00 AM', title:'Into the Dark', body:'They walk to the pond through darkness and mist, lanterns casting gold on the path.', color:'#7a4dff' },
                { time:'4:30 AM', title:'Into the Water', body:'Cold. Always cold. They wade in waist-deep. Their hands read the pond floor by feel alone.', color:'#009846' },
                { time:'6:00 AM', title:'Baskets Fill', body:'The sun rises. Baskets overflow. The makhana seeds glisten with pond water and morning light.', color:'#f3a213' },
                { time:'7:30 AM', title:'The Dry', body:'Seeds spread on bamboo mats in the sun. Hours of patient watching. Wind and warmth do the rest.', color:'#7a4dff' },
                { time:'2:00 PM', title:'The Roast', body:'The village smells of warmth. Seeds pop in the kadhai. Every pop is a small act of alchemy.', color:'#009846' },
                { time:'5:00 PM', title:'Sorting', body:'Grade by grade, by hand. No machine can feel the difference between 6-suta and lower grades.', color:'#f3a213' },
                { time:'Dusk', title:'The Rest', body:'The family gathers. The work is done. Tomorrow, before 4 AM, it begins again.', color:'#7a4dff' },
              ].map((item, i) => (
                <motion.div key={item.time}
                  initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }}
                  viewport={{ once:true }} transition={{ duration:0.6, delay:i*0.07 }}
                  className="relative rounded-xl p-5"
                  style={{ background:`${item.color}10`, border:`1px solid ${item.color}22` }}
                >
                  {/* Dot on spine */}
                  <div className="hidden md:block absolute -top-10 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full"
                    style={{ background:item.color, boxShadow:`0 0 8px ${item.color}` }} />
                  <p className="font-display font-bold text-2xl mb-1" style={{ color:item.color }}>{item.time}</p>
                  <p className="font-body font-bold text-sm mb-2" style={{ color:'#fdfbf7' }}>{item.title}</p>
                  <p className="font-body text-xs leading-relaxed" style={{ color:'rgba(253,251,247,0.45)' }}>{item.body}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          CHAPTER 02 — THE PEOPLE
          ════════════════════════════════════════ */}
      <StoryBeat
        chapter="02"
        overline="The Custodians"
        headline={<>The Hands That<br /><em className="not-italic" style={{ color: '#009846' }}>Hold the Story.</em></>}
        quote="No machine can replicate it. No algorithm can copy the instinct."
        body={[
          "The Mallah Community of Mithila has harvested makhana from these traditional ponds for generations. This is not a job — it is an identity. The fathers teach the sons to read the water. The mothers teach the daughters to read the heat of the pan.",
          "When you open a pack of NutriTribe, the hands of a Mallah farmer are in it. Not metaphorically — literally. Every seed was touched, sorted, and inspected by human hands before it reached your bag.",
          "We pay fair wages. We skip the middleman. Every product you buy directly improves the livelihood of a Mithila farming family. That is the NutriTribe promise — and it will never change.",
        ]}
        accentColor="#009846"
        side="right"
        bg="linear-gradient(160deg, #0d1f14 0%, #071209 100%)"
        dark
        visual={
          <div style={{ background: '#060e08', padding: '1.5rem' }}>
            {/* Community stats */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                { v: '250+', l: 'Mallah Families', c: '#009846' },
                { v: '100%', l: 'Direct Trade', c: '#f3a213' },
                { v: '₹Fair', l: 'Guaranteed Wage', c: '#009846' },
                { v: '3rd Gen', l: 'Knowledge Keepers', c: '#f3a213' },
              ].map((s) => (
                <div key={s.l} className="rounded-xl p-4 text-center"
                  style={{ background: `${s.c}10`, border: `1px solid ${s.c}20` }}>
                  <p className="font-display font-bold text-2xl" style={{ color: s.c }}>{s.v}</p>
                  <p className="font-body text-[9px] tracking-[0.15em] uppercase mt-1" style={{ color: 'rgba(253,251,247,0.4)' }}>{s.l}</p>
                </div>
              ))}
            </div>
            {/* Community quote card */}
            <div className="rounded-xl p-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(0,152,70,0.15)' }}>
              <p className="font-display italic text-base leading-relaxed" style={{ color: 'rgba(253,251,247,0.7)' }}>
                &ldquo;When NutriTribe came to us, they did not bargain. They asked what we needed. That is different.&rdquo;
              </p>
              <p className="font-body text-[10px] mt-3 tracking-widest uppercase" style={{ color: '#009846' }}>
                — Ramesh Mallah, Darbhanga Farmer
              </p>
            </div>
          </div>
        }
      />

      {/* ════════════════════════════════════════
          VOICES FROM THE POND
          ════════════════════════════════════════ */}
      <section className="relative py-24 overflow-hidden" style={{ background:'#fff' }}>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden" aria-hidden>
          <span className="font-display font-bold italic" style={{ fontSize:'clamp(80px,14vw,200px)', color:'rgba(0,152,70,0.04)', whiteSpace:'nowrap' }}>Voices</span>
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true }} transition={{ duration:0.8 }}
            className="text-center mb-16">
            <p className="font-body font-bold text-[10px] tracking-[0.4em] uppercase mb-3" style={{ color:'#009846' }}>
              From the Pond
            </p>
            <h2 className="font-display font-bold leading-tight" style={{ fontSize:'clamp(28px,4vw,58px)', color:'#1a0e0a' }}>
              The Hands That<br />
              <em className="not-italic" style={{ color:'#009846' }}>Tell the Story.</em>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Ramesh Mallah', village: 'Darbhanga', gen: '4th Generation',
                color: '#f3a213',
                quote: 'When NutriTribe came, they paid us double the mandi rate. My daughter goes to school now. The makhana paid for it.',
              },
              {
                name: 'Geeta Devi', village: 'Sitamarhi', gen: '3rd Generation',
                color: '#009846',
                quote: 'I learned to sort makhana from my grandmother. She would close her eyes and know the quality by touch alone. I can now too.',
              },
              {
                name: 'Suresh Kumar', village: 'Madhubani', gen: '2nd Generation',
                color: '#7a4dff',
                quote: 'The first crop I sold to NutriTribe, I bought new tools. The second, I fixed my roof. The third, I felt like a businessman.',
              },
            ].map((f, i) => (
              <motion.div key={f.name}
                initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }}
                viewport={{ once:true }} transition={{ duration:0.7, delay:i*0.12 }}
                whileHover={{ y:-6 }}
                className="relative rounded-2xl p-8 overflow-hidden"
                style={{ background:`linear-gradient(135deg, ${f.color}10, ${f.color}04)`, border:`1px solid ${f.color}22` }}
              >
                <motion.div className="absolute top-0 left-0 right-0 h-0.5"
                  style={{ background:`linear-gradient(to right, ${f.color}, transparent)` }}
                  initial={{ scaleX:0 }} whileInView={{ scaleX:1 }} viewport={{ once:true }}
                  transition={{ duration:0.6, delay:i*0.12+0.2 }} />
                {/* Makhana orb icon */}
                <div className="mb-6">
                  <svg width="28" height="28" viewBox="0 0 30 30" fill="none">
                    <defs>
                      <radialGradient id={`vp-mk-${i}`} cx="33%" cy="28%" r="70%">
                        <stop offset="0%" stopColor="#fdfbf7" />
                        <stop offset="60%" stopColor="#e8d4a8" />
                        <stop offset="100%" stopColor="#b8916a" />
                      </radialGradient>
                    </defs>
                    <circle cx="15" cy="15" r="13" fill={`url(#vp-mk-${i})`} />
                    <circle cx="10" cy="10" r="2.5" fill="#7a5c30" opacity="0.35" />
                    <ellipse cx="10" cy="10" rx="4" ry="2.5" fill="white" opacity="0.28" transform="rotate(-20 10 10)" />
                  </svg>
                </div>
                <p className="font-display italic text-lg leading-relaxed mb-6"
                  style={{ color:'#1a0e0a', lineHeight:1.7 }}>
                  &ldquo;{f.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-px" style={{ background:f.color }} />
                  <div>
                    <p className="font-body font-bold text-sm" style={{ color:'#1a0e0a' }}>{f.name}</p>
                    <p className="font-body text-xs" style={{ color:'rgba(26,14,10,0.5)' }}>{f.village} · {f.gen}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          FULL-BLEED QUOTE #2
          ════════════════════════════════════════ */}
      <section style={{ background: 'linear-gradient(155deg, #fdf6e8 0%, #f5ede0 100%)' }}>
        <PullQuote
          quote="Ancient divers. Ancient seeds. Ancient fire. And yet the world only just discovered makhana. We are here to fix that."
          author="NutriTribe Founders"
          accentColor="#7a4dff"
          dark={false}
        />
      </section>

      {/* ════════════════════════════════════════
          MEET THE FOUNDERS
          ════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(160deg, #1a0e0a 0%, #0a0500 100%)' }}>
        <div className="max-w-5xl mx-auto px-6 py-24 md:py-36 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <p className="font-body font-bold text-[10px] tracking-[0.45em] uppercase mb-4" style={{ color: '#f3a213' }}>
              The People Behind NutriTribe
            </p>
            <h2 className="font-display font-bold leading-tight" style={{ fontSize: 'clamp(32px, 5vw, 64px)', color: '#fdfbf7' }}>
              Meet the<br />
              <em className="not-italic" style={{ color: '#f3a213' }}>Founders.</em>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {FOUNDERS.map((f, i) => {
              const accent = i % 2 === 0 ? '#f3a213' : '#7a4dff';
              const initials = f.name.split(' ').map(w => w[0]).join('').toUpperCase();
              return (
                <motion.div key={f.name + i}
                  initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.7, delay: i * 0.12 }}
                  className="relative rounded-2xl p-10 overflow-hidden"
                  style={{ background: `linear-gradient(135deg, ${accent}1a, ${accent}06)`, border: `1px solid ${accent}38` }}
                >
                  {/* Giant decorative quote mark watermark */}
                  <p className="absolute -top-4 -left-2 font-display font-bold italic pointer-events-none select-none"
                    style={{ fontSize: 'clamp(80px, 12vw, 160px)', color: `${accent}10`, lineHeight: 1 }} aria-hidden>
                    &ldquo;
                  </p>

                  {/* Monogram badge — stamps in after the card fades in */}
                  <motion.div
                    initial={{ scale: 0, rotate: -8 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{ type: 'spring', stiffness: 300, damping: 18, delay: i * 0.12 + 0.25 }}
                    className="relative w-16 h-16 rounded-full flex items-center justify-center mb-6"
                    style={{
                      background: `radial-gradient(circle at 35% 28%, ${accent}45, ${accent}15 60%, transparent 100%)`,
                      border: `1.5px solid ${accent}55`,
                      boxShadow: `0 0 24px ${accent}25`,
                    }}
                  >
                    <span className="font-display font-bold italic text-xl" style={{ color: accent }}>{initials}</span>
                  </motion.div>

                  <p className="relative font-display text-xl md:text-2xl leading-relaxed mb-6" style={{ color: 'rgba(253,251,247,0.88)', fontStyle: 'italic' }}>
                    &ldquo;{f.quote}&rdquo;
                  </p>

                  {/* Ornamental divider — distinct from the Voices cards above */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, ${accent}50, transparent)` }} />
                    <motion.div
                      animate={{ rotate: [0, 45, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                      className="w-2 h-2 shrink-0"
                      style={{ background: accent, opacity: 0.6 }}
                    />
                  </div>

                  <p className="font-display font-bold text-lg" style={{ color: accent }}>{f.name}</p>
                  <p className="font-body font-bold text-[10px] tracking-[0.45em] uppercase mt-1" style={{ color: `${accent}80` }}>
                    Co-Founder
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          CHAPTER 03 — THE VISION
          ════════════════════════════════════════ */}
      <StoryBeat
        chapter="03"
        overline="The NutriTribe Mission"
        headline={<>Ancient Grain.<br /><em className="not-italic" style={{ color: '#7a4dff' }}>Modern Stage.</em></>}
        body={[
          "NutriTribe was born from a single question: why is India's most nutritious traditional food still unknown to most of the world?",
          "We set out to change that. Not by compromising on what makes makhana special — but by giving it the branding, the storytelling, and the quality control it always deserved.",
          "We work directly with the Mallah community, pay wages above market rate, reinvest in sustainable pond management, and refuse every shortcut that would make our product cheaper but less honest.",
        ]}
        accentColor="#7a4dff"
        side="left"
        bg="#f8f4ff"
        visual={
          <div className="p-6 bg-[#f8f4ff]">
            <MakhanaScene className="w-full" />
            <div className="mt-4 text-center">
              <p className="font-body font-bold text-[9px] tracking-[0.25em] uppercase" style={{ color: '#7a4dff' }}>
                Euryale ferox · Bihar&apos;s Sacred Lily Seed
              </p>
            </div>
          </div>
        }
      />

      {/* ════════════════════════════════════════
          IMPACT STATS
          ════════════════════════════════════════ */}
      <section
        className="relative py-28 overflow-hidden"
        style={{ background: 'linear-gradient(155deg, #100600 0%, #0a0200 100%)' }}
      >
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden" aria-hidden>
          <div className="relative" style={{ width: '65vw', height: '30vw', maxWidth: 750, opacity: 0.04 }}>
            <Image src="/logo.png" alt="" fill className="object-contain" style={{ filter: 'brightness(0) invert(1)' }} />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.8 }}
            className="text-center mb-16">
            <p className="font-body font-bold text-[10px] tracking-[0.4em] uppercase mb-3" style={{ color: 'rgba(243,162,19,0.55)' }}>
              Our Impact
            </p>
            <h2 className="font-display font-bold" style={{ fontSize: 'clamp(30px, 4.5vw, 60px)', color: '#fdfbf7' }}>
              Numbers That<br />
              <em className="not-italic" style={{ color: '#f3a213' }}>Matter.</em>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <StatCard value="250+" label="Farming Families Supported" sub="Mallah community of Mithila — direct beneficiaries of every sale." color="#f3a213" index={0} />
            <StatCard value="₹0" label="Middlemen in Our Supply Chain" sub="Farmer to factory to you. No distributor tax. More money where it belongs." color="#009846" index={1} />
            <StatCard value="2,500 yr" label="Tradition Preserved" sub="Ancient harvesting techniques kept alive and fairly compensated." color="#7a4dff" index={2} />
            <StatCard value="90%" label="of India's Makhana" sub="Comes from Bihar. We work exclusively with premium Mithila-grade." color="#f3a213" index={3} />
            <StatCard value="0mg" label="Artificial Additives" sub="No MSG. No preservatives. No artificial flavours. Non-negotiable." color="#009846" index={4} />
            <StatCard value="10,000+" label="Happy Tribe Members" sub="And growing. Across every pin code in India." color="#7a4dff" index={5} />
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          TIMELINE
          ════════════════════════════════════════ */}
      <section className="relative py-28 overflow-hidden" style={{ background: '#fff' }}>
        {/* Large decorative text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden" aria-hidden>
          <span className="font-display font-bold italic"
            style={{ fontSize: 'clamp(100px, 18vw, 240px)', color: 'rgba(243,162,19,0.04)', letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>
            Journey
          </span>
        </div>

        <div className="max-w-3xl mx-auto px-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.8 }}
            className="text-center mb-20">
            <p className="font-body font-bold text-[10px] tracking-[0.4em] uppercase mb-3" style={{ color: '#f3a213' }}>
              Our Journey
            </p>
            <h2 className="font-display font-bold leading-tight" style={{ fontSize: 'clamp(30px, 4.5vw, 60px)', color: '#1a0e0a' }}>
              From Seed<br />to Stage
            </h2>
          </motion.div>

          <div className="space-y-0">
            {timeline.map((item, i) => (
              <TimelineBeat
                key={item.year}
                year={item.year}
                title={item.title}
                body={item.body}
                color={item.color}
                index={i}
                isLast={i === timeline.length - 1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          MISSION / VISION / VALUES
          ════════════════════════════════════════ */}
      <section
        className="relative py-28 overflow-hidden"
        style={{ background: 'linear-gradient(155deg, #0d0703 0%, #1a0e0a 100%)' }}
      >
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.8 }}
            className="text-center mb-16">
            <p className="font-body font-bold text-[10px] tracking-[0.4em] uppercase mb-3" style={{ color: 'rgba(243,162,19,0.55)' }}>
              Who We Are
            </p>
            <h2 className="font-display font-bold" style={{ fontSize: 'clamp(30px, 4.5vw, 60px)', color: '#fdfbf7' }}>
              Purpose-Driven.<br />
              <em className="not-italic" style={{ color: '#f3a213' }}>Mithila-Rooted.</em>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { label: 'Mission', num: '01', color: '#f3a213', icon: '🎯', text: "To become the world's most trusted Indian-origin healthy snack brand and make makhana a globally celebrated superfood." },
              { label: 'Vision', num: '02', color: '#009846', icon: '🌿', text: "To revive India's indigenous superfoods by creating clean, premium snacks while empowering farming communities through ethical sourcing." },
              { label: 'Values', num: '03', color: '#7a4dff', icon: '💎', text: 'Authenticity. Health First. Innovation. Community Impact. Quality & Trust. Rooted in Bihar. Built for the world.' },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.7, delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                className="relative rounded-2xl p-8 overflow-hidden"
                style={{ background: `linear-gradient(135deg, ${item.color}12, ${item.color}06)`, border: `1px solid ${item.color}25` }}
              >
                <motion.div
                  className="absolute top-0 left-0 right-0 h-0.5"
                  style={{ background: `linear-gradient(to right, ${item.color}, transparent)` }}
                  initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.1 + 0.2 }}
                />
                <div className="text-3xl mb-4">{item.icon}</div>
                <h3 className="font-display font-bold text-2xl mb-3" style={{ color: '#fdfbf7' }}>{item.label}</h3>
                <p className="font-body text-sm leading-relaxed" style={{ color: 'rgba(253,251,247,0.55)' }}>{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          FINAL CTA
          ════════════════════════════════════════ */}
      <section
        className="relative py-32 text-center overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #e08a10 0%, #f3a213 50%, #D4AF37 100%)' }}
      >
        <div className="absolute inset-0 pointer-events-none">
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.22) 0%, transparent 60%)' }} />
          {/* Floating makhana in CTA */}
          {[{ top: '20%', left: '8%', size: 48 }, { top: '65%', right: '6%', size: 36 }, { top: '30%', right: '12%', size: 28 }].map((pos, i) => (
            <motion.div key={i} className="absolute pointer-events-none" style={pos}
              animate={{ y: [0, -12, 0] }} transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.7 }}>
              <MkOrb size={pos.size} opacity={0.2} />
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center mb-8 relative z-10">
          <div className="relative" style={{ width: 160, height: 44 }}>
            <Image src="/logo.png" alt="NutriTribe" fill className="object-contain" style={{ filter: 'brightness(0)' }} />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7 }}
          className="max-w-2xl mx-auto px-6 relative z-10"
        >
          <h2 className="font-display font-bold italic leading-[1.05] mb-4 text-[#050100]"
            style={{ fontSize: 'clamp(36px, 6vw, 72px)' }}>
            Ready to join<br />the Tribe?
          </h2>
          <p className="font-body text-base mb-10" style={{ color: 'rgba(5,1,0,0.6)' }}>
            Every pack is a handshake with the farmers of Bihar.<br />
            Every bite is 2,500 years of tradition — in your hands.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/products">
              <motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.97 }}
                className="font-body font-bold text-sm px-10 py-4 rounded-full tracking-wide"
                style={{ background: '#050100', color: '#f3a213', boxShadow: '0 8px 32px rgba(5,1,0,0.3)' }}>
                Shop Now →
              </motion.div>
            </Link>
            <Link href="/makhana">
              <motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.97 }}
                className="font-body font-bold text-sm px-10 py-4 rounded-full tracking-wide"
                style={{ background: 'rgba(5,1,0,0.12)', color: '#050100', border: '1.5px solid rgba(5,1,0,0.25)' }}>
                Learn About Makhana →
              </motion.div>
            </Link>
          </div>
        </motion.div>
      </section>
    </>
  );
}
