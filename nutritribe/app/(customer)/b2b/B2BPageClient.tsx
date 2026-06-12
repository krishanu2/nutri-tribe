'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Boxes, Truck, Tag, HeartHandshake } from 'lucide-react';
import LeadForm from '@/components/forms/LeadForm';

const ACCENT = '#009846';

const VALUE_PROPS = [
  { icon: <Boxes size={20} />,        title: 'Bulk Pricing Tiers',  desc: 'Volume-based discounts that scale with your order size — the more you stock, the more you save.' },
  { icon: <Tag size={20} />,          title: 'Private Labeling',    desc: 'White-label our roasted makhana and cookies under your own brand, packaging included.' },
  { icon: <Truck size={20} />,        title: 'Reliable Supply',     desc: 'Direct sourcing from Mithila ponds means consistent quality and on-time fulfilment, every time.' },
  { icon: <HeartHandshake size={20} />, title: 'Dedicated Support', desc: 'A single point of contact for onboarding, reorders, and account management.' },
];

const BUSINESS_TYPES = [
  'Café / Restaurant',
  'Retail Store / Supermarket',
  'Distributor / Wholesaler',
  'Corporate Pantry',
  'E-commerce Reseller',
  'Other',
];

const VOLUME_TIERS = [
  'Under 50 kg / month',
  '50 – 200 kg / month',
  '200 – 500 kg / month',
  '500 kg+ / month',
];

export default function B2BPage() {
  return (
    <>
      {/* ══════════════════════════════════════════════
          HERO
          ══════════════════════════════════════════════ */}
      <section
        className="relative min-h-[60vh] flex flex-col items-center justify-center overflow-hidden"
        style={{ background: 'linear-gradient(155deg, #021a0c 0%, #0d0400 60%, #050100 100%)' }}
      >
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden" aria-hidden>
          <span className="font-display font-bold italic"
            style={{ fontSize: 'clamp(80px, 20vw, 260px)', color: 'rgba(0,152,70,0.05)', letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>
            Wholesale
          </span>
        </div>

        <div className="relative z-10 text-center px-6 pt-36 pb-24">
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
            B2B &amp;{' '}
            <em className="not-italic" style={{ color: ACCENT }}>Bulk Orders</em>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.35 }}
            className="font-body text-base max-w-lg mx-auto"
            style={{ color: 'rgba(253,251,247,0.45)' }}>
            Bring NutriTribe&apos;s roasted makhana and premium cookies to your café, store, or pantry — with pricing and support built for partners.
          </motion.p>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" preserveAspectRatio="none" className="w-full" style={{ height: 60 }}>
            <path d="M0 60 Q360 20 720 40 Q1080 60 1440 25 L1440 60 Z" fill="#0d0703" />
          </svg>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          VALUE PROPS
          ══════════════════════════════════════════════ */}
      <section style={{ background: '#0d0703' }}>
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {VALUE_PROPS.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className="p-6 rounded-2xl"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `${ACCENT}18`, color: ACCENT }}>
                  {item.icon}
                </div>
                <h3 className="font-display font-bold text-lg mb-2" style={{ color: '#fdfbf7' }}>{item.title}</h3>
                <p className="font-body text-sm leading-relaxed" style={{ color: 'rgba(253,251,247,0.4)' }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          FORM
          ══════════════════════════════════════════════ */}
      <section style={{ background: '#0d0703' }}>
        <div className="max-w-2xl mx-auto px-6 pb-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-10"
          >
            <h2 className="font-display font-bold mb-3" style={{ fontSize: 'clamp(28px, 4vw, 44px)', color: '#fdfbf7' }}>
              Tell us about your business
            </h2>
            <p className="font-body text-sm" style={{ color: 'rgba(253,251,247,0.4)' }}>
              Share a few details and our partnerships team will reach out with pricing and next steps.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.1 }}>
            <LeadForm
              leadType="B2B"
              accent={ACCENT}
              detailFields={[
                { name: 'businessType', label: 'Business Type', type: 'select', required: true, options: BUSINESS_TYPES },
                { name: 'volume', label: 'Estimated Monthly Volume', type: 'select', required: true, options: VOLUME_TIERS },
              ]}
            />
          </motion.div>
        </div>
      </section>
    </>
  );
}
