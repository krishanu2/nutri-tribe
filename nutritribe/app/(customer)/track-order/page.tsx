'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Search, Loader2, CheckCircle2, Package, MapPin, Truck, Gift, ArrowLeft } from 'lucide-react';

interface TrackedOrder {
  orderId: string;
  createdAt: string;
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  trackingNumber: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
  customerName: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  giftNote: string | null;
  subtotal: number;
  delivery: number;
  discount: number;
  couponCode: string | null;
  total: number;
  items: Array<{ name: string; weight: string; quantity: number; price: number }>;
}

const STAGES = [
  { key: 'PENDING', label: 'Pending' },
  { key: 'CONFIRMED', label: 'Confirmed' },
  { key: 'PROCESSING', label: 'Processing' },
  { key: 'SHIPPED', label: 'Shipped' },
  { key: 'DELIVERED', label: 'Delivered' },
] as const;

function StatusTimeline({ order }: { order: TrackedOrder }) {
  if (order.status === 'CANCELLED') {
    return (
      <div className="flex items-center gap-3 p-5 rounded-2xl bg-red-50 border border-red-200">
        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
          <span className="text-red-500 font-bold text-lg">×</span>
        </div>
        <div>
          <p className="font-body font-bold text-sm text-red-600">Order Cancelled</p>
          <p className="font-body text-xs text-red-500/70">If this is unexpected, reach out via the Contact page.</p>
        </div>
      </div>
    );
  }

  const currentIndex = STAGES.findIndex(s => s.key === order.status);

  return (
    <div className="flex items-start justify-between">
      {STAGES.map((stage, i) => {
        const done = i < currentIndex;
        const active = i === currentIndex;
        const future = i > currentIndex;
        const date = stage.key === 'SHIPPED' ? order.shippedAt : stage.key === 'DELIVERED' ? order.deliveredAt : null;

        return (
          <div key={stage.key} className="flex-1 flex flex-col items-center relative">
            {i > 0 && (
              <div className="absolute top-4 right-1/2 w-full h-0.5 -z-10"
                style={{ background: done || active ? '#009846' : 'rgba(125,54,39,0.12)' }} />
            )}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 320, damping: 22, delay: i * 0.1 }}
              className="relative z-10 w-8 h-8 rounded-full flex items-center justify-center shrink-0"
              style={{
                background: done ? '#009846' : active ? '#f3a213' : '#fdfbf7',
                border: future ? '2px solid rgba(125,54,39,0.15)' : 'none',
              }}
            >
              {done ? (
                <CheckCircle2 size={16} className="text-white" />
              ) : active ? (
                <motion.div
                  className="w-2.5 h-2.5 rounded-full bg-white"
                  animate={{ scale: [1, 1.4, 1] }}
                  transition={{ duration: 1.4, repeat: Infinity }}
                />
              ) : (
                <div className="w-1.5 h-1.5 rounded-full bg-earthen-rust/20" />
              )}
            </motion.div>
            <p className={`font-body text-[11px] font-semibold mt-2 text-center ${active ? 'text-sun-harvest' : done ? 'text-sacred-leaf' : 'text-earthen-rust/35'}`}>
              {stage.label}
            </p>
            {date && (
              <p className="font-body text-[9px] text-earthen-rust/35 mt-0.5">
                {new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('');
  const [contact, setContact] = useState('');
  const [order, setOrder] = useState<TrackedOrder | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setOrder(null);
    try {
      const res = await fetch('/api/orders/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, contact }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Order not found');
      setOrder(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ivory-grain pt-28 pb-20">
      <div className="max-w-2xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h1 className="font-display font-bold text-4xl text-earthen-rust mb-3">Track Your Order</h1>
          <p className="font-body text-earthen-rust/55 text-base">
            Enter your Order ID and the email or phone used at checkout.
          </p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-3xl border border-earthen-rust/10 shadow-card p-6 mb-8 space-y-4"
        >
          <div>
            <label className="block font-body font-semibold text-xs tracking-widest uppercase text-earthen-rust/60 mb-2">
              Order ID
            </label>
            <input
              type="text"
              required
              value={orderId}
              onChange={e => setOrderId(e.target.value)}
              placeholder="NT-XXXXXX-XXXX"
              className="w-full font-body text-sm text-earthen-rust bg-white border-2 border-earthen-rust/15 rounded-xl px-4 py-3 outline-none focus:border-sun-harvest transition-all tracking-widest"
            />
          </div>
          <div>
            <label className="block font-body font-semibold text-xs tracking-widest uppercase text-earthen-rust/60 mb-2">
              Email or Mobile Number
            </label>
            <input
              type="text"
              required
              value={contact}
              onChange={e => setContact(e.target.value)}
              placeholder="you@email.com or 9876543210"
              className="w-full font-body text-sm text-earthen-rust bg-white border-2 border-earthen-rust/15 rounded-xl px-4 py-3 outline-none focus:border-sun-harvest transition-all"
            />
          </div>

          {error && (
            <p className="font-body text-sm text-red-500 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>
          )}

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={!loading ? { scale: 1.02 } : {}}
            whileTap={!loading ? { scale: 0.98 } : {}}
            className="w-full flex items-center justify-center gap-2 bg-sun-harvest text-white font-body font-bold text-sm py-4 rounded-2xl hover:brightness-110 transition-all tracking-wide uppercase disabled:opacity-70"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={15} />}
            {loading ? 'Searching…' : 'Track Order'}
          </motion.button>
        </motion.form>

        <AnimatePresence>
          {order && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Order header + timeline */}
              <div className="bg-white rounded-3xl border border-earthen-rust/10 shadow-card overflow-hidden">
                <div className="px-6 py-5 flex items-center justify-between" style={{ background: 'linear-gradient(135deg, #3a1a0a08, #f3a21312)' }}>
                  <div>
                    <p className="font-body text-xs tracking-widest uppercase text-earthen-rust/50 mb-1">Order ID</p>
                    <p className="font-body font-bold text-sm text-earthen-rust tracking-widest">{order.orderId}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-body text-xs tracking-widest uppercase text-earthen-rust/50 mb-1">Placed on</p>
                    <p className="font-body font-semibold text-xs text-earthen-rust/70">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                </div>
                <div className="px-6 py-7">
                  <StatusTimeline order={order} />
                </div>
                {order.trackingNumber && (
                  <div className="px-6 py-4 border-t border-earthen-rust/8 flex items-center gap-3 bg-earthen-rust/2">
                    <Truck size={16} className="text-sun-harvest" />
                    <div>
                      <p className="font-body text-[10px] tracking-widest uppercase text-earthen-rust/45">Tracking Number</p>
                      <p className="font-body font-bold text-sm text-earthen-rust tracking-wide">{order.trackingNumber}</p>
                    </div>
                  </div>
                )}
              </div>

              {order.giftNote && (
                <div className="bg-white rounded-2xl border border-sun-harvest/25 p-5 flex items-start gap-3">
                  <Gift size={18} className="text-sun-harvest shrink-0 mt-0.5" />
                  <p className="font-body text-sm text-earthen-rust/70">This was sent as a gift 🎁</p>
                </div>
              )}

              {/* Items */}
              <div className="bg-white rounded-2xl border border-earthen-rust/10 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Package size={16} className="text-earthen-rust/50" />
                  <p className="font-body font-semibold text-sm text-earthen-rust">Items Ordered</p>
                </div>
                <div className="space-y-3">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div>
                        <p className="font-body font-semibold text-sm text-earthen-rust">{item.name}</p>
                        <p className="font-body text-xs text-earthen-rust/45">{item.weight} × {item.quantity}</p>
                      </div>
                      <span className="font-display font-bold text-sm text-earthen-rust">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-earthen-rust/8 flex justify-between font-display font-bold text-lg text-earthen-rust">
                  <span>Total</span>
                  <span>₹{order.total}</span>
                </div>
              </div>

              {/* Address */}
              <div className="bg-white rounded-2xl border border-earthen-rust/10 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin size={16} className="text-sun-harvest" />
                  <p className="font-body font-semibold text-sm text-earthen-rust">Delivering To</p>
                </div>
                <p className="font-body text-sm text-earthen-rust/70 leading-relaxed">
                  {order.customerName}<br />
                  {order.address}<br />
                  {order.city}, {order.state} — {order.pincode}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <Link href="/" className="inline-flex items-center gap-2 font-body text-sm text-earthen-rust/50 hover:text-sun-harvest transition-colors mt-10">
          <ArrowLeft size={14} /> Back to Home
        </Link>
      </div>
    </div>
  );
}
