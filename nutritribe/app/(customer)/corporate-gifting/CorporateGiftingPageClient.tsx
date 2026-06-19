'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring, useMotionTemplate } from 'framer-motion';
import Image from 'next/image';
import { Gift, Sparkles, PenTool, CalendarHeart } from 'lucide-react';
import LeadForm from '@/components/forms/LeadForm';
import SectionDivider from '@/components/SectionDivider';
import MithilaArtBorder from '@/components/illustrations/MithilaArtBorder';

const ACCENT = '#7a4dff';

/* ── Makhana orb (local, matches the site-wide inline-orb convention) ── */
function MkOrb({ size = 16, opacity = 0.1 }: { size?: number; opacity?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 30 30" fill="none" style={{ opacity }}>
      <defs>
        <radialGradient id="cg-mk" cx="33%" cy="28%" r="70%">
          <stop offset="0%" stopColor="#fdfbf7" />
          <stop offset="60%" stopColor="#e8d4a8" />
          <stop offset="100%" stopColor="#b8916a" />
        </radialGradient>
      </defs>
      <circle cx="15" cy="15" r="13" fill="url(#cg-mk)" />
      <circle cx="10" cy="10" r="2.5" fill="#7a5c30" opacity="0.4" />
      <ellipse cx="10" cy="10" rx="4" ry="2.5" fill="white" opacity="0.3" transform="rotate(-20 10 10)" />
    </svg>
  );
}

const FLOAT_ORBS = [
  { top: '18%', left: '7%', size: 38, dur: 4.2 },
  { top: '70%', left: '4%', size: 26, dur: 5.4 },
  { top: '24%', right: '6%', size: 32, dur: 4.8 },
  { top: '66%', right: '9%', size: 44, dur: 3.8 },
];

/* ── Value-prop card with hover lift + mouse-follow glare ── */
function ValuePropCard({ item, i, accent }: { item: { icon: React.ReactNode; title: string; desc: string }; i: number; accent: string }) {
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const glowX = useSpring(useTransform(mx, [0, 1], [0, 100]), { stiffness: 200, damping: 20 });
  const glowY = useSpring(useTransform(my, [0, 1], [0, 100]), { stiffness: 200, damping: 20 });
  const glare = useMotionTemplate`radial-gradient(circle at ${glowX}% ${glowY}%, rgba(255,255,255,0.08) 0%, transparent 60%)`;

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width);
    my.set((e.clientY - rect.top) / rect.height);
  };

  return (
    <motion.div
      onMouseMove={onMove}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: i * 0.08 }}
      className="relative p-6 rounded-2xl overflow-hidden"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
    >
      <motion.div className="absolute top-0 left-0 right-0 h-0.5"
        style={{ background: `linear-gradient(to right, ${accent}, transparent)` }}
        initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }}
        transition={{ duration: 0.6, delay: i * 0.08 + 0.2 }} />
      <motion.div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: glare }} />
      <div className="relative w-10 h-10 rounded-xl flex items-center justify-center mb-4"
        style={{ background: `${accent}18`, color: accent }}>
        {item.icon}
      </div>
      <h3 className="relative font-display font-bold text-lg mb-2" style={{ color: '#fdfbf7' }}>{item.title}</h3>
      <p className="relative font-body text-sm leading-relaxed" style={{ color: 'rgba(253,251,247,0.4)' }}>{item.desc}</p>
    </motion.div>
  );
}

const VALUE_PROPS = [
  { icon: <Gift size={20} />,         title: 'Curated Hampers',     desc: 'Beautifully packaged assortments of our roasted makhana and premium cookies, ready to gift.' },
  { icon: <PenTool size={20} />,      title: 'Custom Branding',     desc: 'Add your company logo, a personalised note, or a fully bespoke box design for your occasion.' },
  { icon: <Sparkles size={20} />,     title: 'Premium Packaging',   desc: 'Festive and corporate-grade packaging that feels as good as it tastes — no plastic excess.' },
  { icon: <CalendarHeart size={20} />, title: 'Occasion Ready',     desc: 'From Diwali hampers to onboarding kits and client appreciation gifts — we plan around your timeline.' },
];

const OCCASIONS = [
  'Diwali / Festive Hamper',
  'New Year Gifting',
  'Employee Onboarding Kit',
  'Client / Customer Appreciation',
  'Conference / Event Giveaway',
  'Other',
];

const QUANTITY_TIERS = [
  'Under 50 units',
  '50 – 200 units',
  '200 – 500 units',
  '500 units+',
];

export default function CorporateGiftingPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.4]);

  return (
    <>
      {/* ══════════════════════════════════════════════
          HERO
          ══════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative min-h-[60vh] flex flex-col items-center justify-center overflow-hidden"
        style={{ background: 'linear-gradient(155deg, #190e40 0%, #0d0400 60%, #050100 100%)' }}
      >
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden" aria-hidden>
          <span className="font-display font-bold italic"
            style={{ fontSize: 'clamp(80px, 20vw, 260px)', color: 'rgba(122,77,255,0.06)', letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>
            Gifting
          </span>
        </div>

        {/* Floating makhana orbs */}
        {FLOAT_ORBS.map((pos, i) => (
          <motion.div key={i} className="absolute pointer-events-none" style={pos}
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: pos.dur, repeat: Infinity, delay: i * 0.4, ease: 'easeInOut' }}>
            <MkOrb size={pos.size} opacity={0.12} />
          </motion.div>
        ))}

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 text-center px-6 pt-36 pb-24">
          <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="flex justify-center mb-8">
            <div className="relative" style={{ width: 140, height: 40 }}>
              <Image src="/logo.png" alt="NutriTribe" fill className="object-contain" style={{ filter: 'brightness(0) invert(1)' }} priority />
            </div>
          </motion.div>

          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="font-body font-bold text-[10px] tracking-[0.45em] uppercase mb-4"
            style={{ color: `${ACCENT}99` }}>
            For Business
          </motion.p>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.15 }}
            className="font-display font-bold leading-tight mb-5"
            style={{ fontSize: 'clamp(40px, 7vw, 88px)', color: '#fdfbf7' }}>
            Corporate{' '}
            <em className="not-italic" style={{ color: ACCENT }}>Gifting</em>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.35 }}
            className="font-body text-base max-w-lg mx-auto"
            style={{ color: 'rgba(253,251,247,0.45)' }}>
            Bold, rooted, and ready to impress — premium hampers of Bihar&apos;s finest makhana for your team, clients, and celebrations.
          </motion.p>
        </motion.div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" preserveAspectRatio="none" className="w-full" style={{ height: 60 }}>
            <path d="M0 60 Q360 20 720 40 Q1080 60 1440 25 L1440 60 Z" fill="#0d0703" />
          </svg>
        </div>
      </section>

      {/* Luxe ornamental divider — gifting gets this, B2B stays utilitarian */}
      <div style={{ background: '#0d0703' }} className="py-3">
        <MithilaArtBorder className="max-w-3xl mx-auto" color={ACCENT} />
      </div>

      {/* ══════════════════════════════════════════════
          VALUE PROPS
          ══════════════════════════════════════════════ */}
      <section style={{ background: '#0d0703' }}>
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {VALUE_PROPS.map((item, i) => (
              <ValuePropCard key={item.title} item={item} i={i} accent={ACCENT} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          FORM
          ══════════════════════════════════════════════ */}
      <section style={{ background: '#0d0703' }}>
        <SectionDivider variant="lotus" darkBg />
        <div className="max-w-2xl mx-auto px-6 pb-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-10"
          >
            <h2 className="font-display font-bold mb-3" style={{ fontSize: 'clamp(28px, 4vw, 44px)', color: '#fdfbf7' }}>
              Plan your gifting order
            </h2>
            <p className="font-body text-sm" style={{ color: 'rgba(253,251,247,0.4)' }}>
              Tell us about the occasion and quantity — we&apos;ll get back with curated options and a quote.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.1 }}>
            <LeadForm
              leadType="CORPORATE_GIFTING"
              accent={ACCENT}
              detailFields={[
                { name: 'occasion', label: 'Occasion', type: 'select', required: true, options: OCCASIONS },
                { name: 'quantity', label: 'Estimated Quantity', type: 'select', required: true, options: QUANTITY_TIERS },
              ]}
            />
          </motion.div>
        </div>
      </section>
    </>
  );
}
