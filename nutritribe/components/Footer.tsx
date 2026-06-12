'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Mail, Heart } from 'lucide-react';
import { InstagramIcon, LinkedinIcon, FacebookIcon } from '@/components/SocialIcons';

/* ── Lotus petal ornament ── */
function LotusDecor({ size = 80, opacity = 0.07 }: { size?: number; opacity?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" style={{ opacity }}>
      {[0, 36, 72, 108, 144, 180, 216, 252, 288, 324].map((a, i) => (
        <ellipse
          key={i} cx="40" cy="14" rx="7" ry="18" fill="#f3a213"
          transform={`rotate(${a} 40 40)`}
        />
      ))}
      <circle cx="40" cy="40" r="10" fill="#f3a213" opacity="0.85" />
    </svg>
  );
}

/* ── Makhana dot separator ── */
function MkDot() {
  return (
    <svg width="10" height="10" viewBox="0 0 30 30" fill="none" style={{ display: 'inline-block' }}>
      <defs>
        <radialGradient id="fmkd" cx="33%" cy="28%" r="68%">
          <stop offset="0%" stopColor="#fdfbf7" /><stop offset="100%" stopColor="#b8916a" />
        </radialGradient>
      </defs>
      <circle cx="15" cy="15" r="13" fill="url(#fmkd)" />
      <circle cx="10" cy="10" r="2.5" fill="#7a5c30" opacity="0.35" />
      <ellipse cx="10" cy="10" rx="4" ry="2.5" fill="white" opacity="0.25" transform="rotate(-20 10 10)" />
    </svg>
  );
}

export default function Footer() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.05 });

  return (
    <footer ref={ref} className="bg-earthen-rust relative overflow-hidden">
      {/* ── Scattered lotus decorations ── */}
      <div className="absolute top-8 left-6 pointer-events-none"><LotusDecor size={90} /></div>
      <div className="absolute top-16 right-16 pointer-events-none"><LotusDecor size={130} /></div>
      <div className="absolute bottom-24 left-1/4 pointer-events-none"><LotusDecor size={70} /></div>
      <div className="absolute bottom-10 right-1/3 pointer-events-none"><LotusDecor size={100} /></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.025]">
        <LotusDecor size={500} opacity={1} />
      </div>

      {/* ── HERO LOGO SECTION ─────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col items-center pt-20 pb-10 px-6"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>

        {/* Large centered logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative mb-6"
        >
          {/* Glowing ring behind logo */}
          <div
            className="absolute inset-0 -m-8 rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(243,162,19,0.12) 0%, transparent 70%)',
            }}
          />
          <div className="relative" style={{ width: 280, height: 80 }}>
            <Image
              src="/logo.png"
              alt="NutriTribe"
              fill
              className="object-contain"
              style={{ filter: 'brightness(0) invert(1)' }}
            />
          </div>
        </motion.div>

        {/* Brand tagline */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="font-display text-3xl md:text-5xl italic text-white/90 text-center leading-relaxed max-w-3xl"
        >
          &ldquo;Rooted in tradition.<br />Crafted for today.&rdquo;
        </motion.p>

        {/* Ornamental separators */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={isInView ? { opacity: 1, scaleX: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex items-center gap-4 mt-8 origin-center"
        >
          <div className="h-px w-20" style={{ background: 'linear-gradient(to left, rgba(243,162,19,0.5), transparent)' }} />
          <MkDot />
          <div className="w-px h-4" style={{ background: 'rgba(243,162,19,0.3)' }} />
          <MkDot />
          <div className="h-px w-20" style={{ background: 'linear-gradient(to right, rgba(243,162,19,0.5), transparent)' }} />
        </motion.div>

        {/* Heritage label */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="font-body font-bold text-[10px] tracking-[0.4em] uppercase mt-4"
          style={{ color: 'rgba(243,162,19,0.5)' }}
        >
          Mithila, Bihar · Est. 2020 · Snack Bold. Live Rooted.
        </motion.p>
      </div>

      {/* ── MAIN LINKS GRID ─────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand col */}
          <div className="md:col-span-1">
            {/* Mini logo */}
            <div className="relative mb-5" style={{ width: 140, height: 44 }}>
              <Image
                src="/logo.png"
                alt="NutriTribe"
                fill
                className="object-contain object-left"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
            </div>
            <p className="font-body text-sm text-white/65 leading-relaxed mb-6">
              From Mithila&apos;s lily ponds to your palate — India&apos;s ancient superfood, reimagined for the bold.
            </p>
            <div className="flex gap-3">
              {[
                { href: 'https://instagram.com/NutriTribe', Icon: InstagramIcon },
                { href: 'https://linkedin.com/company/nutritribe', Icon: LinkedinIcon },
                { href: 'https://facebook.com/NutriTribe', Icon: FacebookIcon },
              ].map(({ href, Icon }) => (
                <motion.a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.15, y: -2, background: '#f3a213', borderColor: '#f3a213' }}
                  whileTap={{ scale: 0.92 }}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                  style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}
                >
                  <Icon size={16} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-body font-bold text-sm tracking-[0.28em] uppercase mb-5 flex items-center gap-2"
              style={{ color: '#f3a213' }}>
              <span className="w-3 h-px inline-block" style={{ background: '#f3a213' }} />
              Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                { label: 'Home', href: '/' },
                { label: 'Our Story', href: '/our-story' },
                { label: 'The Makhana', href: '/makhana' },
                { label: 'Journal', href: '/blog' },
                { label: 'Recipes', href: '/recipes' },
                { label: 'B2B & Bulk Orders', href: '/b2b' },
                { label: 'Corporate Gifting', href: '/corporate-gifting' },
                { label: 'Contact', href: '/contact' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-body text-sm text-white/60 hover:text-sun-harvest transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span
                      className="w-0 h-px group-hover:w-4 transition-all duration-300 inline-block"
                      style={{ background: '#f3a213' }}
                    />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-body font-bold text-sm tracking-[0.28em] uppercase mb-5 flex items-center gap-2"
              style={{ color: '#f3a213' }}>
              <span className="w-3 h-px inline-block" style={{ background: '#f3a213' }} />
              Products
            </h4>
            <ul className="space-y-3">
              {[
                { label: 'Roasted Flavours', href: '/products?category=Roasted%20Flavours' },
                { label: 'Raw / Premium 6-Suta', href: '/products?category=Raw%20%2F%20Premium%206-Suta' },
                { label: 'Premium Cookies', href: '/products?category=Premium%20Cookies' },
                { label: 'Seeds & Nuts', href: '/coming-soon?cat=seeds-nuts', soon: true },
                { label: 'Healthy Beverages', href: '/coming-soon?cat=healthy-beverages', soon: true },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-body text-sm text-white/60 hover:text-sun-harvest transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span
                      className="w-0 h-px group-hover:w-4 transition-all duration-300 inline-block"
                      style={{ background: '#f3a213' }}
                    />
                    {link.label}
                    {link.soon && (
                      <span
                        className="font-body font-bold text-[8px] tracking-[0.2em] uppercase px-2 py-0.5 rounded-full"
                        style={{ background: 'rgba(243,162,19,0.1)', color: 'rgba(243,162,19,0.6)' }}
                      >
                        Soon
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-body font-bold text-sm tracking-[0.28em] uppercase mb-5 flex items-center gap-2"
              style={{ color: '#f3a213' }}>
              <span className="w-3 h-px inline-block" style={{ background: '#f3a213' }} />
              Connect
            </h4>
            <ul className="space-y-4 mb-8">
              <li>
                <a
                  href="mailto:sales@nutritribe.com"
                  className="flex items-center gap-3 font-body text-sm text-white/60 hover:text-sun-harvest transition-colors"
                >
                  <Mail size={15} style={{ color: '#f3a213', flexShrink: 0 }} />
                  sales@nutritribe.com
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/NutriTribe"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 font-body text-sm text-white/60 hover:text-sun-harvest transition-colors"
                >
                  <InstagramIcon size={15} className="text-sun-harvest flex-shrink-0" />
                  @NutriTribe
                </a>
              </li>
            </ul>

            {/* Email signup */}
            <div
              className="p-4 rounded-2xl"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(243,162,19,0.15)' }}
            >
              <p className="font-body font-bold text-xs tracking-widest uppercase mb-1" style={{ color: '#f3a213' }}>
                Get Tribe Updates
              </p>
              <p className="font-body text-[11px] text-white/40 mb-3">Drop your email, join the tribe.</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 text-white text-xs font-body px-3 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-sun-harvest placeholder-white/25"
                  style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="font-body font-bold text-xs px-4 py-2.5 rounded-lg"
                  style={{ background: '#f3a213', color: '#050100' }}
                >
                  Join
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── BOTTOM BAR ──────────────────────────────────────────────── */}
      <div
        className="relative z-10 py-5"
        style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
      >
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Mini logo mark on bottom bar */}
          <div className="flex items-center gap-3">
            <div className="relative" style={{ width: 80, height: 24 }}>
              <Image
                src="/logo.png"
                alt="NT"
                fill
                className="object-contain object-left"
                style={{ filter: 'brightness(0) invert(1)', opacity: 0.4 }}
              />
            </div>
            <p className="font-body text-xs text-white/35">
              © 2025 NutriTribe. All rights reserved.
            </p>
          </div>
          <p className="font-body text-xs text-white/35 flex items-center gap-1.5">
            Made with <Heart size={12} className="text-sun-harvest fill-sun-harvest" /> in India
          </p>
        </div>
      </div>
    </footer>
  );
}
