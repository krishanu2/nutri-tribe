'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { CheckCircle, Package, MapPin, ArrowRight, Home } from 'lucide-react';
import { useCart } from '@/lib/cartContext';

/* ── Makhana orb (local, matches the site-wide inline-orb convention) ── */
function MkOrb({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 30 30" fill="none">
      <defs>
        <radialGradient id="oc-mk" cx="33%" cy="28%" r="70%">
          <stop offset="0%" stopColor="#fdfbf7" />
          <stop offset="60%" stopColor="#e8d4a8" />
          <stop offset="100%" stopColor="#b8916a" />
        </radialGradient>
      </defs>
      <circle cx="15" cy="15" r="13" fill="url(#oc-mk)" />
      <circle cx="10" cy="10" r="2.5" fill="#7a5c30" opacity="0.4" />
      <ellipse cx="10" cy="10" rx="4" ry="2.5" fill="white" opacity="0.3" transform="rotate(-20 10 10)" />
    </svg>
  );
}

/* One-shot settling burst — scatters from center and fades, doesn't loop */
const BURST_ORBS = [
  { x: -90, y: -50, size: 14, delay: 0.15 },
  { x: 90, y: -60, size: 11, delay: 0.22 },
  { x: -110, y: 20, size: 9, delay: 0.18 },
  { x: 110, y: 30, size: 13, delay: 0.28 },
  { x: -50, y: -100, size: 10, delay: 0.32 },
  { x: 60, y: -95, size: 8, delay: 0.2 },
];

interface ConfirmedOrder {
  orderId: string;
  date: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  items: Array<{ productId: number; name: string; weight: string; price: number; quantity: number; color: string }>;
  subtotal: number;
  delivery: number;
  discount: number;
  couponCode: string | null;
  total: number;
}

export default function OrderConfirmationPage() {
  const params = useParams();
  const router = useRouter();
  const { clearCart } = useCart();
  const [order, setOrder] = useState<ConfirmedOrder | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('nt-order-confirmed');
      if (!raw) { router.push('/'); return; }
      const data: ConfirmedOrder = JSON.parse(raw);
      if (data.orderId !== params.orderId) { router.push('/'); return; }
      setOrder(data);
      clearCart();
      sessionStorage.removeItem('nt-order-confirmed');
    } catch {
      router.push('/');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!order) return null;

  return (
    <div className="min-h-screen bg-ivory-grain pt-28 pb-20">
      <div className="max-w-3xl mx-auto px-6">
        {/* Success hero */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          {/* Animated checkmark + one-shot makhana burst */}
          <div className="relative inline-block mb-6">
            {BURST_ORBS.map((o, i) => (
              <motion.div key={i} className="absolute left-1/2 top-1/2 pointer-events-none"
                initial={{ x: 0, y: 0, opacity: 0, scale: 0.4 }}
                animate={{ x: o.x, y: o.y, opacity: [0, 1, 0], scale: [0.4, 1, 0.7] }}
                transition={{ duration: 1.1, delay: o.delay, ease: [0.22, 1, 0.36, 1] }}>
                <MkOrb size={o.size} />
              </motion.div>
            ))}
            <motion.div
              className="relative w-24 h-24 rounded-full bg-sacred-leaf/10 border-2 border-sacred-leaf/30 flex items-center justify-center mx-auto"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.2 }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: 'spring', stiffness: 400, damping: 15 }}
              >
                <CheckCircle size={44} className="text-sacred-leaf" />
              </motion.div>
            </motion.div>
          </div>

          <motion.h1
            className="font-display font-bold text-4xl md:text-5xl text-earthen-rust mb-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Order Placed!
          </motion.h1>
          <motion.p
            className="font-body text-earthen-rust/60 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Thank you, {order.name.split(' ')[0]}! Your makhana is on its way.
          </motion.p>
        </motion.div>

        {/* Order ID card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-3xl border border-earthen-rust/10 shadow-card overflow-hidden mb-6"
        >
          {/* Header */}
          <div
            className="px-6 py-5 flex items-center justify-between"
            style={{ background: 'linear-gradient(135deg, #3a1a0a08, #f3a21312)' }}
          >
            <div>
              <p className="font-body text-xs tracking-widest uppercase text-earthen-rust/50 mb-1">
                Order ID
              </p>
              <p className="font-body font-bold text-sm text-earthen-rust tracking-widest">
                {order.orderId}
              </p>
            </div>
            <div className="text-right">
              <p className="font-body text-xs tracking-widest uppercase text-earthen-rust/50 mb-1">
                Placed on
              </p>
              <p className="font-body font-semibold text-xs text-earthen-rust/70">
                {order.date}
              </p>
            </div>
          </div>

          {/* Items */}
          <div className="px-6 py-5 border-t border-earthen-rust/8 space-y-4">
            <p className="font-body font-semibold text-xs tracking-widest uppercase text-earthen-rust/50">
              Items Ordered
            </p>
            {order.items.map(item => (
              <div key={`${item.productId}-${item.weight}`} className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-xl shrink-0 flex items-center justify-center"
                  style={{ background: item.color + '18', border: `1.5px solid ${item.color}30` }}
                >
                  <div className="w-6 h-6 rounded-full" style={{ background: item.color + '70' }} />
                </div>
                <div className="flex-1">
                  <p className="font-body font-semibold text-sm text-earthen-rust">{item.name}</p>
                  <p className="font-body text-xs text-earthen-rust/45">{item.weight} × {item.quantity}</p>
                </div>
                <span className="font-display font-bold text-sm text-earthen-rust">
                  ₹{item.price * item.quantity}
                </span>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="px-6 py-4 border-t border-earthen-rust/8 space-y-2 bg-earthen-rust/2">
            <div className="flex justify-between font-body text-sm text-earthen-rust/50">
              <span>Subtotal</span><span>₹{order.subtotal}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between font-body text-sm text-sacred-leaf font-semibold">
                <span>Discount {order.couponCode ? `(${order.couponCode})` : ''}</span><span>−₹{order.discount}</span>
              </div>
            )}
            <div className="flex justify-between font-body text-sm text-earthen-rust/50">
              <span>Delivery</span>
              <span className={order.delivery === 0 ? 'text-sacred-leaf font-semibold' : ''}>
                {order.delivery === 0 ? 'FREE' : `₹${order.delivery}`}
              </span>
            </div>
            <div className="flex justify-between font-display font-bold text-xl text-earthen-rust pt-2 border-t border-earthen-rust/10">
              <span>Total Paid</span>
              <span>₹{order.total}</span>
            </div>
          </div>
        </motion.div>

        {/* Delivery info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8"
        >
          <div className="bg-white rounded-2xl border border-earthen-rust/10 p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl bg-sun-harvest/10 flex items-center justify-center">
                <MapPin size={16} className="text-sun-harvest" />
              </div>
              <p className="font-body font-semibold text-sm text-earthen-rust">Delivering To</p>
            </div>
            <p className="font-body text-sm text-earthen-rust/70 leading-relaxed">
              {order.address}<br />
              {order.city}, {order.state} — {order.pincode}
            </p>
            <p className="font-body text-xs text-earthen-rust/45 mt-2">{order.phone}</p>
          </div>

          <div className="bg-white rounded-2xl border border-earthen-rust/10 p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl bg-sacred-leaf/10 flex items-center justify-center">
                <Package size={16} className="text-sacred-leaf" />
              </div>
              <p className="font-body font-semibold text-sm text-earthen-rust">Delivery Timeline</p>
            </div>
            <p className="font-body text-sm text-earthen-rust/70 leading-relaxed">
              Dispatched within <strong>24 hours</strong>
            </p>
            <p className="font-body text-sm text-earthen-rust/70">
              Expected delivery in <strong>3–5 business days</strong>
            </p>
            <p className="font-body text-xs text-earthen-rust/45 mt-2">
              Confirmation sent to {order.email}
            </p>
          </div>
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link href="/products">
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center justify-center gap-2 bg-sun-harvest text-white font-body font-bold text-sm px-8 py-4 rounded-2xl hover:brightness-110 transition-all tracking-wide uppercase cursor-pointer"
            >
              Shop More
              <ArrowRight size={15} />
            </motion.div>
          </Link>
          <Link href="/">
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center justify-center gap-2 bg-white text-earthen-rust border-2 border-earthen-rust/20 font-body font-bold text-sm px-8 py-4 rounded-2xl hover:border-earthen-rust/40 transition-all tracking-wide uppercase cursor-pointer"
            >
              <Home size={15} />
              Back to Home
            </motion.div>
          </Link>
        </motion.div>

        {/* Fun note — bracketed by a thin animated rule, echoing the brand-voice quote treatment used elsewhere */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="flex items-center gap-3 mt-10 max-w-md mx-auto"
        >
          <motion.div className="flex-1 h-px origin-right" style={{ background: 'linear-gradient(to left, rgba(125,54,39,0.18), transparent)' }}
            initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.6, delay: 1.2 }} />
          <p className="text-center font-body italic text-sm text-earthen-rust/40 shrink-0 px-1">
            &ldquo;Snack Bold. Live Rooted.&rdquo;
          </p>
          <motion.div className="flex-1 h-px origin-left" style={{ background: 'linear-gradient(to right, rgba(125,54,39,0.18), transparent)' }}
            initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.6, delay: 1.2 }} />
        </motion.div>
      </div>
    </div>
  );
}
