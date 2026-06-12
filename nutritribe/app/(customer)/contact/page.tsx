'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Send, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { InstagramIcon, LinkedinIcon, FacebookIcon } from '@/components/SocialIcons';
import ContactScene from '@/components/illustrations/ContactScene';

/* ── Who are you? intent types ─────────────────────────────── */
const INTENTS = [
  {
    id: 'customer',
    icon: '🛒',
    title: 'A Customer',
    sub: 'Order help, feedback, or just saying hi',
    accent: '#f3a213',
    placeholder: "Hi NutriTribe! I wanted to ask about my order / share some feedback...",
    subject: 'order',
  },
  {
    id: 'retailer',
    icon: '🏪',
    title: 'A Retailer',
    sub: 'Wholesale, distribution, or B2B enquiry',
    accent: '#009846',
    placeholder: "I run a store / café and would love to stock NutriTribe products...",
    subject: 'b2b',
  },
  {
    id: 'creator',
    icon: '🎨',
    title: 'A Food Creator',
    sub: 'Collaboration, content, or partnership',
    accent: '#7a4dff',
    placeholder: "I'm a food blogger / chef / creator and would love to collaborate...",
    subject: 'collab',
  },
  {
    id: 'curious',
    icon: '🌿',
    title: 'Just Curious',
    sub: 'Anything else on your mind',
    accent: '#7d3627',
    placeholder: "I just wanted to reach out and say...",
    subject: 'other',
  },
];

/* ── Makhana confetti particle ── */
function Confetti({ delay }: { x?: number; y?: number; delay: number }) {
  const angle = Math.random() * 360;
  const distance = 80 + Math.random() * 120;
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: '50%', top: '50%' }}
      initial={{ x: 0, y: 0, scale: 0, opacity: 1, rotate: 0 }}
      animate={{
        x: Math.cos((angle * Math.PI) / 180) * distance,
        y: Math.sin((angle * Math.PI) / 180) * distance - 60,
        scale: [0, 1.2, 0.8, 0],
        opacity: [0, 1, 1, 0],
        rotate: angle * 2,
      }}
      transition={{ duration: 1.2, delay, ease: 'easeOut' }}
    >
      <svg width="12" height="12" viewBox="0 0 30 30" fill="none">
        <defs>
          <radialGradient id={`cf-${delay}`} cx="33%" cy="28%" r="70%">
            <stop offset="0%" stopColor="#fdfbf7" /><stop offset="100%" stopColor="#b8916a" />
          </radialGradient>
        </defs>
        <circle cx="15" cy="15" r="13" fill={`url(#cf-${delay})`} />
      </svg>
    </motion.div>
  );
}

/* ── Intent card ── */
function IntentCard({ intent, selected, onSelect }: {
  intent: typeof INTENTS[0]; selected: boolean; onSelect: () => void;
}) {
  return (
    <motion.button
      onClick={onSelect}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      className="relative text-left w-full rounded-2xl p-5 overflow-hidden transition-all duration-300"
      style={{
        background: selected ? `linear-gradient(135deg, ${intent.accent}18, ${intent.accent}08)` : 'rgba(255,255,255,0.04)',
        border: `1.5px solid ${selected ? intent.accent : 'rgba(255,255,255,0.08)'}`,
        boxShadow: selected ? `0 0 24px ${intent.accent}25` : 'none',
      }}
    >
      {selected && (
        <motion.div
          layoutId="intent-active"
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{ border: `1.5px solid ${intent.accent}60` }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        />
      )}
      <div className="flex items-start gap-4">
        <span className="text-3xl shrink-0">{intent.icon}</span>
        <div>
          <p className="font-body font-bold text-sm" style={{ color: selected ? intent.accent : 'rgba(253,251,247,0.8)' }}>
            {intent.title}
          </p>
          <p className="font-body text-xs mt-0.5" style={{ color: 'rgba(253,251,247,0.35)' }}>
            {intent.sub}
          </p>
        </div>
        {selected && (
          <motion.div
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            className="ml-auto shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
            style={{ background: intent.accent }}
          >
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
              <path d="M1 4L3.5 6.5L9 1" stroke="#050100" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>
        )}
      </div>
    </motion.button>
  );
}

export default function ContactPage() {
  const [selectedIntent, setSelectedIntent] = useState<string | null>(null);
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [focused, setFocused] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  const intent = INTENTS.find(i => i.id === selectedIntent);
  const accent = intent?.accent || '#f3a213';

  const handleIntentSelect = (id: string) => {
    setSelectedIntent(id);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setConfetti(true);
    setTimeout(() => { setConfetti(false); setSubmitted(true); }, 1200);
  };

  const inputStyle = (field: string) => ({
    background: 'rgba(255,255,255,0.04)',
    border: `1px solid ${focused === field ? accent : 'rgba(255,255,255,0.1)'}`,
    boxShadow: focused === field ? `0 0 0 3px ${accent}20` : 'none',
    color: '#fdfbf7',
    outline: 'none',
    transition: 'all 0.25s',
  });

  return (
    <>
      {/* ══════════════════════════════════════════════
          CINEMATIC HERO — full dark
          ══════════════════════════════════════════════ */}
      <section
        className="relative min-h-[65vh] flex flex-col items-center justify-center overflow-hidden"
        style={{ background: 'linear-gradient(155deg, #080100 0%, #0d0400 50%, #050100 100%)' }}
      >
        {/* Grain */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='250' height='250'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='250' height='250' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")" }} />

        {/* Ambient glows */}
        <div className="absolute pointer-events-none" style={{ left: '20%', top: '30%', width: '40vw', height: '40vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(243,162,19,0.06) 0%, transparent 70%)' }} />
        <div className="absolute pointer-events-none" style={{ right: '15%', bottom: '20%', width: '30vw', height: '30vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(125,54,39,0.07) 0%, transparent 70%)' }} />

        {/* Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden" aria-hidden>
          <span className="font-display font-bold italic"
            style={{ fontSize: 'clamp(80px, 20vw, 260px)', color: 'rgba(243,162,19,0.025)', letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>
            Let&apos;s Talk
          </span>
        </div>

        <div className="relative z-10 text-center px-6 pt-36 pb-24">
          {/* Logo */}
          <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="flex justify-center mb-8">
            <div className="relative" style={{ width: 140, height: 40 }}>
              <Image src="/logo.png" alt="NutriTribe" fill className="object-contain" style={{ filter: 'brightness(0) invert(1)' }} priority />
            </div>
          </motion.div>

          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="font-body font-bold text-[10px] tracking-[0.45em] uppercase mb-4"
            style={{ color: 'rgba(243,162,19,0.6)' }}>
            Get In Touch
          </motion.p>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.15 }}
            className="font-display font-bold leading-tight mb-5"
            style={{ fontSize: 'clamp(48px, 8vw, 100px)', color: '#fdfbf7' }}>
            Let&apos;s{' '}
            <em className="not-italic" style={{ color: '#f3a213' }}>Talk</em>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.35 }}
            className="font-body text-base max-w-md mx-auto"
            style={{ color: 'rgba(253,251,247,0.4)' }}>
            Whether you&apos;re a customer, a retailer, or just a makhana lover — we&apos;d love to hear from you.
          </motion.p>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" preserveAspectRatio="none" className="w-full" style={{ height: 60 }}>
            <path d="M0 60 Q360 20 720 40 Q1080 60 1440 25 L1440 60 Z" fill="#0d0703" />
          </svg>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          MAIN — dark editorial split layout
          ══════════════════════════════════════════════ */}
      <section style={{ background: '#0d0703', minHeight: '100vh' }}>
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">

            {/* LEFT — Who are you + contact info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="font-display font-bold mb-2" style={{ fontSize: 'clamp(24px, 3vw, 40px)', color: '#fdfbf7' }}>
                First — who are you?
              </h2>
              <p className="font-body text-sm mb-8" style={{ color: 'rgba(253,251,247,0.35)' }}>
                Pick your vibe so we can respond better.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-12">
                {INTENTS.map((intent) => (
                  <IntentCard
                    key={intent.id}
                    intent={intent}
                    selected={selectedIntent === intent.id}
                    onSelect={() => handleIntentSelect(intent.id)}
                  />
                ))}
              </div>

              {/* Quick contact cards */}
              <div className="space-y-3">
                <p className="font-body font-bold text-[10px] tracking-[0.35em] uppercase mb-4" style={{ color: 'rgba(243,162,19,0.5)' }}>
                  Quick Connect
                </p>
                <motion.a
                  href="mailto:sales@nutritribe.com"
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-4 p-4 rounded-2xl group"
                  style={{ background: 'rgba(243,162,19,0.06)', border: '1px solid rgba(243,162,19,0.12)' }}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: 'rgba(243,162,19,0.12)' }}>
                    <Mail size={16} style={{ color: '#f3a213' }} />
                  </div>
                  <div>
                    <p className="font-body font-bold text-xs" style={{ color: 'rgba(253,251,247,0.8)' }}>sales@nutritribe.com</p>
                    <p className="font-body text-[10px]" style={{ color: 'rgba(253,251,247,0.3)' }}>We reply within 24 hours</p>
                  </div>
                  <ArrowRight size={14} style={{ color: 'rgba(243,162,19,0.4)', marginLeft: 'auto' }} />
                </motion.a>

                {/* Socials */}
                <div className="flex gap-3 pt-2">
                  {[
                    { href: 'https://instagram.com/NutriTribe', Icon: InstagramIcon, color: '#E1306C' },
                    { href: 'https://linkedin.com/company/nutritribe', Icon: LinkedinIcon, color: '#0A66C2' },
                    { href: 'https://facebook.com/NutriTribe', Icon: FacebookIcon, color: '#1877F2' },
                  ].map(({ href, Icon, color }) => (
                    <motion.a
                      key={href}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.12, y: -2 }}
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ background: `${color}18`, border: `1px solid ${color}30`, color }}
                    >
                      <Icon size={16} />
                    </motion.a>
                  ))}
                </div>

                {/* B2B note */}
                <div className="mt-6 p-5 rounded-2xl"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <p className="font-body font-bold text-sm mb-1.5" style={{ color: 'rgba(253,251,247,0.8)' }}>
                    🤝 Wholesale & B2B
                  </p>
                  <p className="font-body text-xs leading-relaxed" style={{ color: 'rgba(253,251,247,0.35)' }}>
                    Retailers, cafés, corporate gifting — we offer bulk pricing and custom branding. Reach us at <a href="mailto:sales@nutritribe.com" style={{ color: '#f3a213' }}>sales@nutritribe.com</a>
                  </p>
                </div>
              </div>
            </motion.div>

            {/* RIGHT — Dynamic form */}
            <motion.div
              ref={formRef}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <AnimatePresence mode="wait">
                {submitted ? (
                  /* SUCCESS STATE */
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="relative flex flex-col items-center justify-center py-24 text-center rounded-3xl overflow-hidden"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', minHeight: 500 }}
                  >
                    {/* Makhana confetti burst */}
                    {confetti && Array.from({ length: 20 }).map((_, i) => (
                      <Confetti key={i} x={0} y={0} delay={i * 0.04} />
                    ))}

                    <motion.div
                      initial={{ scale: 0 }} animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 300, delay: 0.2 }}
                      className="w-24 h-24 rounded-full flex items-center justify-center mb-6 text-5xl"
                      style={{ background: `${accent}15`, border: `2px solid ${accent}40`, boxShadow: `0 0 40px ${accent}25` }}
                    >
                      🌿
                    </motion.div>
                    <h3 className="font-display font-bold text-3xl mb-3" style={{ color: '#fdfbf7' }}>
                      Message Sent!
                    </h3>
                    <p className="font-body text-base leading-relaxed max-w-xs" style={{ color: 'rgba(253,251,247,0.5)' }}>
                      We&apos;ll get back to you within 24 hours. Welcome to the Tribe.
                    </p>
                    <motion.button
                      onClick={() => { setSubmitted(false); setSelectedIntent(null); setFormState({ name: '', email: '', message: '' }); }}
                      className="mt-8 font-body text-sm px-6 py-2.5 rounded-full"
                      style={{ border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(253,251,247,0.5)' }}
                      whileHover={{ scale: 1.04 }}
                    >
                      Send another message
                    </motion.button>
                  </motion.div>
                ) : (
                  /* FORM */
                  <motion.div key="form">
                    {/* Step header */}
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center font-body font-bold text-[10px]"
                        style={{ background: accent, color: '#050100' }}>2</div>
                      <h2 className="font-display font-bold text-2xl" style={{ color: '#fdfbf7' }}>
                        {selectedIntent ? `Write to us` : 'Then write to us'}
                      </h2>
                    </div>

                    {/* Intent badge */}
                    <AnimatePresence>
                      {intent && (
                        <motion.div
                          initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                          className="flex items-center gap-2 mb-6 px-4 py-2 rounded-full self-start inline-flex"
                          style={{ background: `${accent}15`, border: `1px solid ${accent}30` }}
                        >
                          <span>{intent.icon}</span>
                          <span className="font-body font-bold text-xs" style={{ color: accent }}>{intent.title}</span>
                          <button
                            onClick={() => setSelectedIntent(null)}
                            className="font-body text-[10px] tracking-widest"
                            style={{ color: 'rgba(253,251,247,0.3)', marginLeft: 4 }}
                          >
                            ✕
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Name */}
                      <div>
                        <label className="font-body font-bold text-[9px] tracking-[0.35em] uppercase block mb-2" style={{ color: 'rgba(253,251,247,0.4)' }}>
                          Your Name
                        </label>
                        <input
                          type="text" required
                          placeholder="Priya Sharma"
                          value={formState.name}
                          onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                          onFocus={() => setFocused('name')}
                          onBlur={() => setFocused(null)}
                          className="w-full py-3.5 px-4 rounded-xl font-body text-sm placeholder-white/20"
                          style={inputStyle('name')}
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label className="font-body font-bold text-[9px] tracking-[0.35em] uppercase block mb-2" style={{ color: 'rgba(253,251,247,0.4)' }}>
                          Email Address
                        </label>
                        <input
                          type="email" required
                          placeholder="priya@example.com"
                          value={formState.email}
                          onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                          onFocus={() => setFocused('email')}
                          onBlur={() => setFocused(null)}
                          className="w-full py-3.5 px-4 rounded-xl font-body text-sm placeholder-white/20"
                          style={inputStyle('email')}
                        />
                      </div>

                      {/* Message */}
                      <div>
                        <label className="font-body font-bold text-[9px] tracking-[0.35em] uppercase block mb-2" style={{ color: 'rgba(253,251,247,0.4)' }}>
                          Message
                        </label>
                        <textarea
                          required rows={5}
                          placeholder={intent?.placeholder || "Tell us what's on your mind…"}
                          value={formState.message}
                          onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                          onFocus={() => setFocused('message')}
                          onBlur={() => setFocused(null)}
                          className="w-full py-3.5 px-4 rounded-xl font-body text-sm resize-none placeholder-white/20"
                          style={inputStyle('message')}
                        />
                      </div>

                      {/* Submit */}
                      <div className="relative">
                        {confetti && Array.from({ length: 16 }).map((_, i) => (
                          <Confetti key={i} x={0} y={0} delay={i * 0.05} />
                        ))}
                        <motion.button
                          type="submit"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.97 }}
                          className="w-full font-body font-bold text-sm py-4 rounded-xl flex items-center justify-center gap-3 tracking-wide"
                          style={{
                            background: accent,
                            color: '#050100',
                            boxShadow: `0 8px 32px ${accent}35`,
                          }}
                        >
                          <Send size={15} />
                          Send Message
                        </motion.button>
                      </div>

                      <p className="font-body text-[10px] text-center" style={{ color: 'rgba(253,251,247,0.2)' }}>
                        We reply within 24 hours · Your data is never shared.
                      </p>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          AMBIENT SCENE — Bihar lotus pond
          ══════════════════════════════════════════════ */}
      <section style={{ background: '#0d0703', paddingTop: 0 }}>
        <div className="max-w-5xl mx-auto px-6 pb-4">
          <div className="relative">
            <p className="font-body font-bold text-[9px] tracking-[0.45em] uppercase text-center mb-4"
              style={{ color: 'rgba(243,162,19,0.35)' }}>
              From the Lotus Ponds of Bihar
            </p>
            <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(243,162,19,0.1)' }}>
              <ContactScene inView className="w-full" />
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          LOCATION STRIP — dark brand closing
          ══════════════════════════════════════════════ */}
      <section
        className="relative py-16 overflow-hidden text-center"
        style={{ background: 'linear-gradient(135deg, #0d0703 0%, #1a0e0a 100%)', borderTop: '1px solid rgba(243,162,19,0.08)' }}
      >
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="relative" style={{ width: 120, height: 34 }}>
            <Image src="/logo.png" alt="NutriTribe" fill className="object-contain" style={{ filter: 'brightness(0) invert(1)', opacity: 0.3 }} />
          </div>
        </div>
        <p className="font-display font-bold text-2xl italic mb-1" style={{ color: 'rgba(253,251,247,0.7)' }}>
          Patna, Bihar, India
        </p>
        <p className="font-body text-sm" style={{ color: 'rgba(253,251,247,0.25)' }}>
          🌿 The Heartland of Makhana · sales@nutritribe.com
        </p>
      </section>
    </>
  );
}
