'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Leaf, Zap, Shield, Heart, Globe, Star } from 'lucide-react';
import BiharMap from '@/components/illustrations/BiharMap';
import FarmerScene from '@/components/illustrations/FarmerScene';
import MakhanaScene from '@/components/illustrations/MakhanaScene';
import LotusBotanicalScene from '@/components/illustrations/LotusBotanicalScene';

/* ── Orb ── */
function Orb({ size = 20, opacity = 0.7 }: { size?: number; opacity?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 30 30" fill="none" style={{ opacity }}>
      <defs>
        <radialGradient id="mko" cx="33%" cy="28%" r="70%">
          <stop offset="0%" stopColor="#fdfbf7" /><stop offset="60%" stopColor="#e8d4a8" /><stop offset="100%" stopColor="#b8916a" />
        </radialGradient>
      </defs>
      <circle cx="15" cy="15" r="13" fill="url(#mko)" />
      <circle cx="10" cy="10" r="2.5" fill="#7a5c30" opacity="0.4" />
      <ellipse cx="10" cy="10" rx="4" ry="2.5" fill="white" opacity="0.3" transform="rotate(-20 10 10)" />
    </svg>
  );
}

/* ── Typewriter hook ── */
function useTypewriter(text: string, speed = 40, startDelay = 0) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  useEffect(() => {
    let i = 0;
    const t = setTimeout(() => {
      const iv = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) { clearInterval(iv); setDone(true); }
      }, speed);
      return () => clearInterval(iv);
    }, startDelay);
    return () => clearTimeout(t);
  }, [text, speed, startDelay]);
  return { displayed, done };
}

/* ── Mystery cold open ── */
function MysteryIntro({ onReveal }: { onReveal: () => void }) {
  const [phase, setPhase] = useState<0|1|2|3|4>(0);
  const line1 = useTypewriter('For 2,500 years, it grew hidden underwater.', 45, 800);
  const line2 = useTypewriter('Ancient divers woke before dawn to find it.', 45, 3200);
  const line3 = useTypewriter('Yogis called it divine. Emperors craved it.', 45, 5600);
  const line4 = useTypewriter('You probably know it as a snack.', 45, 8200);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 800),
      setTimeout(() => setPhase(2), 3200),
      setTimeout(() => setPhase(3), 5600),
      setTimeout(() => setPhase(4), 8200),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div
      className="fixed inset-0 z-[8000] flex flex-col items-center justify-center px-6"
      style={{ background: '#000' }}
    >
      {/* Lines */}
      <div className="max-w-2xl w-full space-y-7 text-center mb-16">
        {phase >= 1 && (
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}
            className="font-display italic text-2xl md:text-3xl"
            style={{ color: 'rgba(253,251,247,0.85)', lineHeight: 1.5 }}
          >
            {line1.displayed}
            {!line1.done && <span className="animate-pulse">|</span>}
          </motion.p>
        )}
        {phase >= 2 && (
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}
            className="font-display italic text-2xl md:text-3xl"
            style={{ color: 'rgba(253,251,247,0.7)', lineHeight: 1.5 }}
          >
            {line2.displayed}
            {!line2.done && <span className="animate-pulse">|</span>}
          </motion.p>
        )}
        {phase >= 3 && (
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}
            className="font-display italic text-2xl md:text-3xl"
            style={{ color: 'rgba(253,251,247,0.6)', lineHeight: 1.5 }}
          >
            {line3.displayed}
            {!line3.done && <span className="animate-pulse">|</span>}
          </motion.p>
        )}
        {phase >= 4 && (
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}
            className="font-display italic text-xl md:text-2xl"
            style={{ color: 'rgba(243,162,19,0.8)', lineHeight: 1.5 }}
          >
            {line4.displayed}
            {!line4.done && <span className="animate-pulse">|</span>}
          </motion.p>
        )}
      </div>

      {/* Reveal button */}
      <AnimatePresence>
        {line4.done && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-col items-center gap-4"
          >
            <motion.button
              onClick={onReveal}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.96 }}
              className="font-body font-bold text-sm px-10 py-4 rounded-full tracking-[0.12em] uppercase"
              style={{ background: '#f3a213', color: '#050100', boxShadow: '0 0 40px rgba(243,162,19,0.35)' }}
            >
              Reveal the Secret →
            </motion.button>
            <button
              onClick={onReveal}
              className="font-body text-xs tracking-widest uppercase"
              style={{ color: 'rgba(255,255,255,0.2)' }}
            >
              skip intro
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Nutrition card ── */
function NutritionCard({ fact, index }: { fact: typeof nutritionFacts[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const Icon = fact.icon;
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      whileHover={{ y: -6, scale: 1.02 }}
      className="relative rounded-2xl p-7 overflow-hidden group"
      style={{ background: '#fff', border: '1px solid rgba(26,14,10,0.07)', boxShadow: '0 4px 24px rgba(26,14,10,0.06)' }}
    >
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
        style={{ background: `linear-gradient(135deg, ${fact.color}08, ${fact.color}04)` }}
      />
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
        style={{ background: `${fact.color}15`, border: `1px solid ${fact.color}25` }}>
        <Icon size={22} style={{ color: fact.color }} />
      </div>
      <div className="flex items-baseline gap-2 mb-1">
        <span className="font-display font-bold text-3xl" style={{ color: '#1a0e0a' }}>{fact.value}</span>
        <span className="font-body text-xs uppercase tracking-wider" style={{ color: 'rgba(26,14,10,0.4)' }}>{fact.unit}</span>
      </div>
      <p className="font-body font-bold text-sm mb-2" style={{ color: '#1a0e0a' }}>{fact.label}</p>
      <p className="font-body text-sm leading-relaxed" style={{ color: 'rgba(26,14,10,0.55)' }}>{fact.desc}</p>

      {/* Bottom accent line */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-0.5"
        style={{ background: `linear-gradient(to right, ${fact.color}60, transparent)` }}
        initial={{ scaleX: 0 }} animate={isInView ? { scaleX: 1 } : {}}
        transition={{ duration: 0.6, delay: index * 0.1 + 0.3 }}
      />
    </motion.div>
  );
}

const nutritionFacts = [
  { label: 'Protein', value: '9–15g', unit: 'per 100g', icon: Zap, color: '#f3a213', desc: 'Complete plant protein, ideal for muscle repair and sustained energy.' },
  { label: 'Low GI', value: '<55', unit: 'glycemic index', icon: Heart, color: '#009846', desc: 'Slow-release energy. No sugar spikes. Perfect for diabetics.' },
  { label: 'Magnesium', value: '67mg', unit: 'per 100g', icon: Shield, color: '#7a4dff', desc: 'Supports bone health, nerve function, and quality sleep.' },
  { label: 'Antioxidants', value: 'High', unit: 'flavonoids', icon: Leaf, color: '#7d3627', desc: 'Kaempferol-rich — fights inflammation and premature aging.' },
  { label: 'Calories', value: '347', unit: 'kcal/100g', icon: Star, color: '#D4AF37', desc: 'Nutrient-dense yet surprisingly low in unhealthy fats.' },
  { label: 'Ayurveda', value: 'Sattvic', unit: 'classification', icon: Globe, color: '#009846', desc: 'Classified as Sattvic food in Ayurveda — pure, nourishing, calming.' },
];

/* ── Journey step card (needs its own component for hook rules) ── */
function JourneyCard({ step, index }: { step: typeof journeyStepsData[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      whileHover={{ y: -6, scale: 1.02 }}
      className="relative rounded-2xl p-7 group overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${step.color}12, rgba(255,255,255,0.03))`,
        border: `1px solid ${step.color}25`,
      }}
    >
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(to right, ${step.color}80, transparent)` }} />
      <div className="flex items-center gap-3 mb-4">
        <span className="font-display font-bold text-5xl leading-none" style={{ color: step.color, opacity: 0.3 }}>{step.step}</span>
        <span className="text-3xl">{step.icon}</span>
      </div>
      <h3 className="font-display font-bold text-xl mb-2" style={{ color: '#fdfbf7' }}>{step.title}</h3>
      <p className="font-body text-sm leading-relaxed" style={{ color: 'rgba(253,251,247,0.55)' }}>{step.desc}</p>
    </motion.div>
  );
}

const journeyStepsData = [
  { step: '01', title: 'Water Lily Ponds', desc: 'Makhana seeds grow inside the Euryale ferox water lily in shallow Bihar wetlands, submerged in clean, mineral-rich water.', color: '#009846', icon: '🪷' },
  { step: '02', title: 'Underwater Harvest', desc: 'Skilled divers from the Mallah community collect seeds from the pond floor. Harvest season lasts just a few months.', color: '#f3a213', icon: '🌊' },
  { step: '03', title: 'Sun Drying', desc: 'Seeds are laid out in the sun for days until perfectly dried. This ancient technique requires patience, not machines.', color: '#7d3627', icon: '☀️' },
  { step: '04', title: 'Roasting', desc: 'Seeds are roasted in clay pots over low heat until they "pop" — transforming into the light, crunchy makhana we love.', color: '#7a4dff', icon: '🔥' },
  { step: '05', title: 'Flavouring', desc: 'At NutriTribe, we coat each batch in carefully crafted spice blends — no artificial flavours, no MSG. Just real ingredients.', color: '#f3a213', icon: '✨' },
  { step: '06', title: 'Your Pack', desc: "Sealed fresh, shipped with care. From Mithila's water lily ponds to your hands — every pack tells this story.", color: '#009846', icon: '📦' },
];

export default function MakhanaPage() {
  const [mysteryDone, setMysteryDone] = useState(false);
  const [seenOnce, setSeenOnce] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem('nt-makhana-intro');
    if (seen) { setMysteryDone(true); setSeenOnce(true); }
  }, []);

  const handleReveal = () => {
    sessionStorage.setItem('nt-makhana-intro', '1');
    setMysteryDone(true);
  };

  return (
    <>
      {/* Mystery cold open — shows once per session */}
      <AnimatePresence>
        {!mysteryDone && !seenOnce && (
          <motion.div exit={{ opacity: 0 }} transition={{ duration: 0.8 }}>
            <MysteryIntro onReveal={handleReveal} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content — reveals after mystery */}
      <AnimatePresence>
        {(mysteryDone || seenOnce) && (
          <motion.div
            initial={seenOnce ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9 }}
          >
            {/* ═══════════════════════════════════════════
                HERO — dramatic reveal
                ═══════════════════════════════════════════ */}
            <section
              className="relative min-h-screen flex items-center overflow-hidden"
              style={{ background: 'linear-gradient(155deg, #120601 0%, #0a0200 55%, #030100 100%)' }}
            >
              {/* Floating orbs */}
              {[
                { top: '18%', left: '6%', size: 48 }, { top: '72%', left: '4%', size: 32 },
                { top: '22%', right: '5%', size: 42 }, { top: '70%', right: '8%', size: 58 },
              ].map((pos, i) => (
                <motion.div key={i} className="absolute pointer-events-none" style={pos}
                  animate={{ y: [0, -14, 0] }} transition={{ duration: 3.5 + i * 0.5, repeat: Infinity, delay: i * 0.5 }}>
                  <Orb size={pos.size} opacity={0.13} />
                </motion.div>
              ))}

              {/* Big MAKHANA watermark */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden" aria-hidden>
                <span className="font-display font-bold italic"
                  style={{ fontSize: 'clamp(60px, 16vw, 200px)', color: 'rgba(243,162,19,0.03)', letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>
                  MAKHANA
                </span>
              </div>

              <div className="max-w-7xl mx-auto px-6 pt-32 pb-20 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">
                <div>
                  {/* NutriTribe logo */}
                  <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-8">
                    <div className="relative" style={{ width: 140, height: 40 }}>
                      <Image src="/logo.png" alt="NutriTribe" fill className="object-contain object-left" style={{ filter: 'brightness(0) invert(1)' }} priority />
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-5"
                    style={{ background: 'rgba(243,162,19,0.1)', border: '1px solid rgba(243,162,19,0.25)' }}
                  >
                    <span className="font-body font-bold text-[10px] tracking-[0.3em] uppercase" style={{ color: '#f3a213' }}>
                      The Superfood Deep-Dive
                    </span>
                  </motion.div>

                  <motion.h1
                    initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, delay: 0.2 }}
                    className="font-display font-bold leading-tight mb-5"
                    style={{ fontSize: 'clamp(40px, 6vw, 80px)', color: '#fdfbf7' }}
                  >
                    The World&apos;s Finest<br />
                    <em className="not-italic" style={{ color: '#f3a213' }}>Superfood</em><br />
                    You Need to Know.
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.4 }}
                    className="font-body text-base leading-[1.9] mb-8 max-w-lg"
                    style={{ color: 'rgba(253,251,247,0.5)' }}
                  >
                    Makhana (Euryale ferox) — a lotus seed from Bihar&apos;s sacred wetlands. Revered by Ayurveda for millennia, now backed by modern nutrition science. This is the snack the world has been waiting for.
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.55 }}
                    className="flex flex-wrap gap-3 mb-8"
                  >
                    {[['9–15g', 'Protein/100g', '#f3a213'], ['<55', 'Low GI', '#009846'], ['0mg', 'Cholesterol', '#7a4dff']].map(([v, l, c]) => (
                      <div key={l}
                        className="rounded-xl px-4 py-3 flex items-baseline gap-2"
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <span className="font-display font-bold text-xl" style={{ color: c as string }}>{v}</span>
                        <span className="font-body text-[10px] uppercase tracking-wider" style={{ color: 'rgba(253,251,247,0.4)' }}>{l}</span>
                      </div>
                    ))}
                  </motion.div>

                  <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.7 }}>
                    <Link href="/products">
                      <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                        className="inline-flex items-center gap-2 font-body font-bold text-sm px-9 py-4 rounded-full tracking-wide"
                        style={{ background: '#f3a213', color: '#050100', boxShadow: '0 8px 32px rgba(243,162,19,0.35)' }}>
                        Shop Makhana →
                      </motion.div>
                    </Link>
                  </motion.div>
                </div>

                {/* Illustration */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.88, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 1.1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  className="relative"
                >
                  <div className="absolute inset-0 rounded-full pointer-events-none"
                    style={{ background: 'radial-gradient(circle, rgba(243,162,19,0.12) 0%, transparent 70%)' }} />
                  <motion.div animate={{ y: [0, -12, 0] }} transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}>
                    <MakhanaScene className="w-full drop-shadow-2xl" />
                  </motion.div>
                  <motion.div
                    className="absolute top-4 right-0 lg:-right-4 px-5 py-2.5 rounded-full font-body font-bold text-sm"
                    style={{ background: '#f3a213', color: '#050100', boxShadow: '0 8px 24px rgba(243,162,19,0.4)' }}
                    animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 3 }}
                  >
                    9–15g Protein
                  </motion.div>
                  <motion.div
                    className="absolute bottom-8 left-0 lg:-left-4 px-5 py-2.5 rounded-full font-body font-bold text-sm text-white"
                    style={{ background: '#009846', boxShadow: '0 8px 24px rgba(0,152,70,0.4)' }}
                    animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 3.5 }}
                  >
                    Gluten-Free ✓
                  </motion.div>
                </motion.div>
              </div>

              {/* Bottom wave into white */}
              <div className="absolute bottom-0 left-0 right-0">
                <svg viewBox="0 0 1440 60" fill="none" preserveAspectRatio="none" className="w-full" style={{ height: 60 }}>
                  <path d="M0 60 Q360 20 720 40 Q1080 60 1440 25 L1440 60 Z" fill="#fff" />
                </svg>
              </div>
            </section>

            {/* ═══════════════════════════════════════════
                WHAT IS IT — botanical reveal
                ═══════════════════════════════════════════ */}
            <section className="py-24 md:py-32 bg-white">
              <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                  <motion.div
                    initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }} transition={{ duration: 0.8 }}
                    className="relative"
                  >
                    <div className="rounded-3xl overflow-hidden shadow-hover border border-sun-harvest/12 bg-ivory-grain p-4">
                      <LotusBotanicalScene inView className="w-full" />
                    </div>
                    <div className="absolute -bottom-5 -right-5 px-5 py-3.5 rounded-2xl shadow-card"
                      style={{ background: '#fff', border: '1px solid rgba(243,162,19,0.2)' }}>
                      <p className="font-display font-bold text-base italic" style={{ color: '#1a0e0a' }}>Euryale ferox</p>
                      <p className="font-body text-[10px] mt-0.5" style={{ color: 'rgba(26,14,10,0.5)' }}>Botanical Name</p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }} transition={{ duration: 0.8 }}
                  >
                    <p className="font-body font-bold text-[10px] tracking-[0.35em] uppercase mb-4" style={{ color: '#f3a213' }}>What Is It?</p>
                    <h2 className="font-display font-bold leading-tight mb-5" style={{ fontSize: 'clamp(28px, 4vw, 52px)', color: '#1a0e0a' }}>
                      Meet the<br />
                      <em className="not-italic" style={{ color: '#f3a213' }}>Fox Nut</em>
                    </h2>
                    <div className="space-y-4 font-body text-base leading-[1.9]" style={{ color: 'rgba(26,14,10,0.65)' }}>
                      <p>Makhana — also called fox nut or lotus seed — is the popped seed of the Euryale ferox plant, a giant water lily found in the wetlands of Bihar, Manipur, and parts of Japan and Korea.</p>
                      <p>India produces over 90% of the world&apos;s makhana, and Bihar alone accounts for 80% of that. The Mithila region, with its mineral-rich wetland ecosystem, produces the finest grade.</p>
                      <p>Unlike most snacks which are manufactured, makhana is <em className="font-semibold not-italic" style={{ color: '#1a0e0a' }}>harvested</em> — making it one of the most natural, minimally processed foods on Earth.</p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </section>

            {/* ═══════════════════════════════════════════
                NUTRITION FACTS — science cards
                ═══════════════════════════════════════════ */}
            <section className="py-24 md:py-32 bg-ivory-grain">
              <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-14">
                  <p className="font-body font-bold text-[10px] tracking-[0.35em] uppercase mb-4" style={{ color: '#f3a213' }}>
                    Backed by Science
                  </p>
                  <h2 className="font-display font-bold" style={{ fontSize: 'clamp(28px, 4vw, 52px)', color: '#1a0e0a' }}>
                    Why Nutritionists<br />
                    <em className="not-italic" style={{ color: '#f3a213' }}>Love Makhana</em>
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {nutritionFacts.map((fact, i) => <NutritionCard key={fact.label} fact={fact} index={i} />)}
                </div>
              </div>
            </section>

            {/* ═══════════════════════════════════════════
                POND TO PACK — dark journey
                ═══════════════════════════════════════════ */}
            <section className="py-24 md:py-32 overflow-hidden relative"
              style={{ background: 'linear-gradient(155deg, #0a0200 0%, #1a0e0a 50%, #0a0200 100%)' }}>
              {/* Logo watermark */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden" aria-hidden>
                <div className="relative" style={{ width: '55vw', height: '25vw', maxWidth: 600, opacity: 0.035 }}>
                  <Image src="/logo.png" alt="" fill className="object-contain" style={{ filter: 'brightness(0) invert(1)' }} />
                </div>
              </div>

              <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                  <p className="font-body font-bold text-[10px] tracking-[0.35em] uppercase mb-4" style={{ color: 'rgba(243,162,19,0.65)' }}>
                    The Journey
                  </p>
                  <h2 className="font-display font-bold" style={{ fontSize: 'clamp(28px, 4vw, 52px)', color: '#fdfbf7' }}>
                    From Pond to Pack
                  </h2>
                  <p className="font-body text-base mt-4 max-w-md mx-auto" style={{ color: 'rgba(253,251,247,0.45)' }}>
                    Six steps. Two thousand years of knowledge. One incredible snack.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {journeyStepsData.map((step, i) => (
                    <JourneyCard key={step.step} step={step} index={i} />
                  ))}
                </div>
              </div>
            </section>

            {/* ═══════════════════════════════════════════
                WHY MITHILA — map section
                ═══════════════════════════════════════════ */}
            <section className="py-24 md:py-32 bg-ivory-grain">
              <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
                  <p className="font-body font-bold text-[10px] tracking-[0.35em] uppercase mb-4" style={{ color: '#f3a213' }}>Geography & Heritage</p>
                  <h2 className="font-display font-bold leading-tight mb-6" style={{ fontSize: 'clamp(28px, 4vw, 52px)', color: '#1a0e0a' }}>
                    Why Mithila<br />
                    <em className="not-italic" style={{ color: '#f3a213' }}>Matters</em>
                  </h2>
                  <div className="space-y-4 font-body text-base leading-[1.9]" style={{ color: 'rgba(26,14,10,0.65)' }}>
                    <p>The Mithila region — spanning northern Bihar and southern Nepal — is blessed with extraordinary wetlands, fed by Himalayan rivers. Perfect mineral-rich, low-pollution environment for premium makhana.</p>
                    <p>The region also carries profound cultural significance — birthplace of Sita in the Ramayana, and home to the Madhubani art tradition, one of India&apos;s oldest living art forms.</p>
                    <p>Choosing NutriTribe means choosing Mithila — its farmers, its culture, its wisdom, its water.</p>
                  </div>
                </motion.div>
                <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="relative">
                  <div className="rounded-3xl overflow-hidden shadow-hover border border-sun-harvest/15 bg-white p-4">
                    <BiharMap className="w-full" />
                  </div>
                  <div className="absolute -bottom-5 -left-5 p-5 rounded-2xl font-body font-bold"
                    style={{ background: '#f3a213', boxShadow: '0 8px 32px rgba(243,162,19,0.4)' }}>
                    <p className="text-3xl leading-none text-[#050100]">80%</p>
                    <p className="text-xs opacity-80 mt-1.5 text-[#050100]">of World&apos;s Makhana<br />from Bihar</p>
                  </div>
                </motion.div>
              </div>
            </section>

            {/* ═══════════════════════════════════════════
                THE HARVEST — farmer
                ═══════════════════════════════════════════ */}
            <section className="py-24 md:py-32 bg-white">
              <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="relative">
                  <div className="rounded-3xl overflow-hidden shadow-hover border border-earthen-rust/8 bg-ivory-grain p-4">
                    <FarmerScene className="w-full" />
                  </div>
                </motion.div>
                <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
                  <p className="font-body font-bold text-[10px] tracking-[0.35em] uppercase mb-4" style={{ color: '#f3a213' }}>The People</p>
                  <h2 className="font-display font-bold leading-tight mb-5" style={{ fontSize: 'clamp(28px, 4vw, 52px)', color: '#1a0e0a' }}>
                    Harvested by<br />
                    <em className="not-italic" style={{ color: '#f3a213' }}>Human Hands</em>
                  </h2>
                  <div className="space-y-4 font-body text-base leading-[1.9] mb-8" style={{ color: 'rgba(26,14,10,0.65)' }}>
                    <p>The Mallah community of Bihar has mastered this harvest over generations. Men wade into lotus ponds at dawn, diving to collect seeds from the pond floor.</p>
                    <p>Women roast seeds in clay pots with sand over wood fires — a precise technique passed from mother to daughter. Each &ldquo;pop&rdquo; is a moment of artistry.</p>
                  </div>
                  <Link href="/our-story">
                    <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                      className="inline-flex items-center gap-2 font-body font-bold text-sm px-8 py-4 rounded-full"
                      style={{ border: '2px solid rgba(26,14,10,0.2)', color: '#1a0e0a' }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#1a0e0a'; (e.currentTarget as HTMLElement).style.color = '#f3a213'; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = ''; (e.currentTarget as HTMLElement).style.color = '#1a0e0a'; }}
                    >
                      Read Our Story →
                    </motion.div>
                  </Link>
                </motion.div>
              </div>
            </section>

            {/* ═══════════════════════════════════════════
                FINAL CTA — green
                ═══════════════════════════════════════════ */}
            <section className="py-24 relative overflow-hidden text-center"
              style={{ background: 'linear-gradient(135deg, #009846 0%, #007538 100%)' }}>
              <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.15) 0%, transparent 60%)' }} />
              {/* Logo */}
              <div className="flex justify-center mb-8 relative z-10">
                <div className="relative" style={{ width: 140, height: 40 }}>
                  <Image src="/logo.png" alt="NutriTribe" fill className="object-contain" style={{ filter: 'brightness(0) invert(1)', opacity: 0.7 }} />
                </div>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.7 }}
                className="max-w-2xl mx-auto px-6 relative z-10"
              >
                <h2 className="font-display font-bold italic text-white leading-tight mb-4" style={{ fontSize: 'clamp(28px, 5vw, 56px)' }}>
                  Experience it yourself.
                </h2>
                <p className="font-body text-base text-white/75 mb-10">
                  Now that you know the story, taste the difference.
                </p>
                <Link href="/products">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-2 font-body font-bold text-sm px-10 py-4 rounded-full"
                    style={{ background: '#fff', color: '#009846', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
                    Shop Makhana →
                  </motion.div>
                </Link>
              </motion.div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
