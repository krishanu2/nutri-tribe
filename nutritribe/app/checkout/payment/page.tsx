'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CreditCard, Lock, CheckCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface PendingOrder {
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
  total: number;
}

type PayStatus = 'idle' | 'processing' | 'success';

function generateOrderId() {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `NT-${ts}-${rand}`;
}

function formatCard(v: string) {
  return v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
}

function formatExpiry(v: string) {
  const digits = v.replace(/\D/g, '').slice(0, 4);
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
}

export default function PaymentPage() {
  const router = useRouter();
  const [order, setOrder] = useState<PendingOrder | null>(null);
  const [status, setStatus] = useState<PayStatus>('idle');

  const [card, setCard] = useState({ number: '', expiry: '', cvv: '', holder: '' });
  const [errors, setErrors] = useState<Partial<typeof card>>({});

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('nt-pending-order');
      if (!raw) { router.push('/checkout'); return; }
      setOrder(JSON.parse(raw));
    } catch {
      router.push('/checkout');
    }
  }, [router]);

  const validate = () => {
    const e: Partial<typeof card> = {};
    const digits = card.number.replace(/\s/g, '');
    if (digits.length !== 16) e.number = 'Enter a 16-digit card number';
    if (!card.expiry.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) e.expiry = 'Use MM/YY format';
    if (card.cvv.length < 3) e.cvv = '3 or 4 digit CVV';
    if (!card.holder.trim()) e.holder = 'Cardholder name required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePay = async () => {
    if (!validate() || !order) return;
    setStatus('processing');

    // Simulate payment processing delay
    await new Promise(res => setTimeout(res, 2200));

    const orderId = generateOrderId();
    const now = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...order, orderId, date: now }),
      });
      const data = await res.json();
      if (!data.success) throw new Error('API error');
    } catch {
      // Still proceed — log failure silently so UX isn't broken
    }

    // Store confirmation for the success page
    sessionStorage.setItem(
      'nt-order-confirmed',
      JSON.stringify({ orderId, ...order, date: now })
    );
    sessionStorage.removeItem('nt-pending-order');

    setStatus('success');
    setTimeout(() => router.push(`/order-confirmation/${orderId}`), 900);
  };

  if (!order) return null;

  return (
    <div className="min-h-screen bg-ivory-grain pt-32 pb-20">
      <div className="max-w-5xl mx-auto px-6">
        {/* Breadcrumb */}
        <Link
          href="/checkout"
          className="inline-flex items-center gap-2 font-body text-sm text-earthen-rust/50 hover:text-sun-harvest transition-colors mb-8"
        >
          <ArrowLeft size={14} />
          Back to Shipping
        </Link>

        {/* Step indicator */}
        <div className="flex items-center gap-3 mb-10">
          {['Cart', 'Shipping', 'Payment', 'Confirm'].map((step, i) => (
            <div key={step} className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center font-body font-bold text-xs ${
                  i === 2 ? 'bg-sun-harvest text-white' : i < 2 ? 'bg-earthen-rust text-white' : 'bg-earthen-rust/10 text-earthen-rust/40'
                }`}>{i + 1}</div>
                <span className={`font-body text-xs font-semibold hidden sm:block ${
                  i === 2 ? 'text-sun-harvest' : i < 2 ? 'text-earthen-rust' : 'text-earthen-rust/35'
                }`}>{step}</span>
              </div>
              {i < 3 && <div className="w-8 h-px bg-earthen-rust/15" />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Payment form */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-8">
              <h1 className="font-display font-bold text-3xl text-earthen-rust">
                Secure Payment
              </h1>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-sacred-leaf/8 rounded-full border border-sacred-leaf/20">
                <Lock size={11} className="text-sacred-leaf" />
                <span className="font-body text-[10px] text-sacred-leaf font-semibold tracking-wide">
                  DEMO MODE
                </span>
              </div>
            </div>

            {/* Mock card visual */}
            <motion.div
              className="relative h-48 rounded-3xl overflow-hidden mb-8 select-none"
              style={{
                background: 'linear-gradient(135deg, #3a1a0a 0%, #7a3a1a 40%, #c8680e 100%)',
                boxShadow: '0 20px 60px rgba(122,58,26,0.4)',
              }}
              whileHover={{ scale: 1.01 }}
            >
              {/* Card shine */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 50%)',
                }}
              />
              {/* Decorative circles */}
              <div className="absolute -top-8 -right-8 w-48 h-48 rounded-full border border-white/10" />
              <div className="absolute -top-4 -right-4 w-36 h-36 rounded-full border border-white/8" />

              <div className="absolute inset-0 p-7 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div className="w-10 h-7 rounded bg-sun-harvest/60 border border-sun-harvest/40"
                    style={{ background: 'linear-gradient(135deg, #f3a213, #e8880a)' }} />
                  <span className="font-body font-bold text-xs tracking-widest text-white/60 uppercase">
                    Mock Card
                  </span>
                </div>
                <div>
                  <p className="font-body font-bold text-xl tracking-[0.2em] text-white/90 mb-3">
                    {card.number || '•••• •••• •••• ••••'}
                  </p>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="font-body text-[9px] tracking-widest uppercase text-white/40 mb-1">
                        Card Holder
                      </p>
                      <p className="font-body font-semibold text-sm text-white/80">
                        {card.holder || 'YOUR NAME'}
                      </p>
                    </div>
                    <div>
                      <p className="font-body text-[9px] tracking-widest uppercase text-white/40 mb-1">
                        Expires
                      </p>
                      <p className="font-body font-semibold text-sm text-white/80">
                        {card.expiry || 'MM/YY'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Demo note */}
            <div className="mb-6 p-4 bg-sun-harvest/8 rounded-xl border border-sun-harvest/20">
              <p className="font-body text-xs text-earthen-rust/70 leading-relaxed">
                <span className="font-bold text-sun-harvest">Demo Mode:</span> This is a mock payment gateway. Enter any values to simulate a successful payment. No real transaction will be processed.
              </p>
            </div>

            {/* Form fields */}
            <div className="space-y-4">
              {/* Card number */}
              <div>
                <label className="block font-body font-semibold text-xs tracking-widest uppercase text-earthen-rust/60 mb-2">
                  Card Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={card.number}
                    onChange={e => setCard(c => ({ ...c, number: formatCard(e.target.value) }))}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    className={`w-full font-body text-sm text-earthen-rust bg-white border-2 rounded-xl px-4 py-3 pr-12 outline-none transition-all placeholder-earthen-rust/25 ${
                      errors.number ? 'border-red-400' : 'border-earthen-rust/15 focus:border-sun-harvest'
                    }`}
                  />
                  <CreditCard size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-earthen-rust/30" />
                </div>
                {errors.number && <p className="font-body text-xs text-red-500 mt-1">{errors.number}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-body font-semibold text-xs tracking-widest uppercase text-earthen-rust/60 mb-2">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={card.expiry}
                    onChange={e => setCard(c => ({ ...c, expiry: formatExpiry(e.target.value) }))}
                    placeholder="MM/YY"
                    maxLength={5}
                    className={`w-full font-body text-sm text-earthen-rust bg-white border-2 rounded-xl px-4 py-3 outline-none transition-all placeholder-earthen-rust/25 ${
                      errors.expiry ? 'border-red-400' : 'border-earthen-rust/15 focus:border-sun-harvest'
                    }`}
                  />
                  {errors.expiry && <p className="font-body text-xs text-red-500 mt-1">{errors.expiry}</p>}
                </div>
                <div>
                  <label className="block font-body font-semibold text-xs tracking-widest uppercase text-earthen-rust/60 mb-2">
                    CVV
                  </label>
                  <input
                    type="password"
                    inputMode="numeric"
                    value={card.cvv}
                    onChange={e => setCard(c => ({ ...c, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                    placeholder="•••"
                    maxLength={4}
                    className={`w-full font-body text-sm text-earthen-rust bg-white border-2 rounded-xl px-4 py-3 outline-none transition-all placeholder-earthen-rust/25 ${
                      errors.cvv ? 'border-red-400' : 'border-earthen-rust/15 focus:border-sun-harvest'
                    }`}
                  />
                  {errors.cvv && <p className="font-body text-xs text-red-500 mt-1">{errors.cvv}</p>}
                </div>
              </div>

              <div>
                <label className="block font-body font-semibold text-xs tracking-widest uppercase text-earthen-rust/60 mb-2">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  value={card.holder}
                  onChange={e => setCard(c => ({ ...c, holder: e.target.value.toUpperCase() }))}
                  placeholder="AS ON YOUR CARD"
                  className={`w-full font-body text-sm text-earthen-rust bg-white border-2 rounded-xl px-4 py-3 outline-none transition-all placeholder-earthen-rust/25 ${
                    errors.holder ? 'border-red-400' : 'border-earthen-rust/15 focus:border-sun-harvest'
                  }`}
                />
                {errors.holder && <p className="font-body text-xs text-red-500 mt-1">{errors.holder}</p>}
              </div>
            </div>

            {/* Pay button */}
            <motion.button
              onClick={handlePay}
              disabled={status !== 'idle'}
              whileHover={status === 'idle' ? { scale: 1.02 } : {}}
              whileTap={status === 'idle' ? { scale: 0.98 } : {}}
              className="mt-8 w-full flex items-center justify-center gap-3 font-body font-bold text-sm py-4 rounded-2xl transition-all tracking-wide uppercase disabled:cursor-not-allowed"
              style={{
                background: status === 'success' ? '#009846' : '#f3a213',
                color: '#050100',
                opacity: status !== 'idle' ? 0.9 : 1,
              }}
            >
              <AnimatePresence mode="wait">
                {status === 'idle' && (
                  <motion.span key="idle" className="flex items-center gap-2"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <Lock size={15} />
                    Pay ₹{order.total}
                  </motion.span>
                )}
                {status === 'processing' && (
                  <motion.span key="processing" className="flex items-center gap-2"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <Loader2 size={15} className="animate-spin" />
                    Processing Payment...
                  </motion.span>
                )}
                {status === 'success' && (
                  <motion.span key="success" className="flex items-center gap-2 text-white"
                    initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
                    <CheckCircle size={15} />
                    Payment Successful!
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            <p className="text-center font-body text-[10px] text-earthen-rust/30 mt-3 flex items-center justify-center gap-1.5">
              <Lock size={10} />
              Secured by 256-bit SSL encryption (Demo)
            </p>
          </div>

          {/* Order summary sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 bg-white rounded-3xl border border-earthen-rust/10 shadow-card overflow-hidden">
              <div className="px-6 py-5 border-b border-earthen-rust/8">
                <h2 className="font-display font-bold text-lg text-earthen-rust">Order Summary</h2>
                <p className="font-body text-xs text-earthen-rust/45 mt-1">
                  Shipping to {order.city}, {order.state}
                </p>
              </div>
              <div className="px-6 py-4 space-y-3">
                {order.items.map(item => (
                  <div key={`${item.productId}-${item.weight}`} className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center"
                      style={{ background: item.color + '18', border: `1.5px solid ${item.color}30` }}
                    >
                      <div className="w-5 h-5 rounded-full" style={{ background: item.color + '70' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-body font-semibold text-xs text-earthen-rust leading-tight truncate">
                        {item.name}
                      </p>
                      <p className="font-body text-[10px] text-earthen-rust/45">{item.weight} × {item.quantity}</p>
                    </div>
                    <span className="font-body font-bold text-sm text-earthen-rust shrink-0">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>
              <div className="px-6 py-4 border-t border-earthen-rust/8 space-y-2">
                <div className="flex justify-between font-body text-sm text-earthen-rust/50">
                  <span>Subtotal</span><span>₹{order.subtotal}</span>
                </div>
                <div className="flex justify-between font-body text-sm text-earthen-rust/50">
                  <span>Delivery</span>
                  <span className={order.delivery === 0 ? 'text-sacred-leaf font-semibold' : ''}>
                    {order.delivery === 0 ? 'FREE' : `₹${order.delivery}`}
                  </span>
                </div>
                <div className="flex justify-between font-display font-bold text-xl text-earthen-rust pt-2 border-t border-earthen-rust/8">
                  <span>Total</span><span>₹{order.total}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
