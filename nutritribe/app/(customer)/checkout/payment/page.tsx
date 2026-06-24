'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CreditCard, Truck, Lock, CheckCircle, Loader2, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import Script from 'next/script';

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
  discount: number;
  couponCode: string | null;
  total: number;
  giftNote: string | null;
}

type PayMethod = 'online' | 'cod';
type PayStatus = 'idle' | 'processing' | 'success' | 'error';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: new (options: Record<string, any>) => { open(): void };
  }
}

function generateOrderId() {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `NT-${ts}-${rand}`;
}

export default function PaymentPage() {
  const router = useRouter();
  const [order, setOrder] = useState<PendingOrder | null>(null);
  const [method, setMethod] = useState<PayMethod>('online');
  const [status, setStatus] = useState<PayStatus>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [razorpayReady, setRazorpayReady] = useState(false);

  const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const razorpayEnabled = Boolean(razorpayKey);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('nt-pending-order');
      if (!raw) { router.push('/checkout'); return; }
      setOrder(JSON.parse(raw));
    } catch {
      router.push('/checkout');
    }
  }, [router]);

  useEffect(() => {
    if (!razorpayEnabled) setMethod('cod');
  }, [razorpayEnabled]);

  const createOrder = async (orderId: string, paymentId?: string) => {
    const now = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...order, orderId, date: now,
          paymentMethod: method === 'online' ? 'ONLINE' : 'COD',
          paymentId: paymentId ?? null,
        }),
      });
      const data = await res.json();
      if (!data.success && res.status === 409) {
        setErrorMsg(data.error ?? 'One or more items are out of stock.');
        setStatus('error');
        return false;
      }
    } catch {
      // proceed — don't block UX on DB error
    }
    sessionStorage.setItem('nt-order-confirmed', JSON.stringify({ orderId, ...order, date: now }));
    sessionStorage.removeItem('nt-pending-order');
    return true;
  };

  const handleOnlinePayment = async () => {
    if (!order || !razorpayKey) return;
    setStatus('processing');
    setErrorMsg('');

    try {
      const res = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: order.total }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      const options = {
        key: razorpayKey,
        amount: data.amount,
        currency: 'INR',
        name: 'NutriTribe',
        description: 'Premium Makhana Order',
        order_id: data.razorpayOrderId,
        prefill: { name: order.name, email: order.email, contact: order.phone },
        theme: { color: '#f3a213' },
        handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          const vRes = await fetch('/api/payment/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(response),
          });
          const vData = await vRes.json();
          if (!vData.verified) {
            setErrorMsg('Payment verification failed. Please contact support.');
            setStatus('error');
            return;
          }
          const orderId = generateOrderId();
          const ok = await createOrder(orderId, response.razorpay_payment_id);
          if (ok) {
            setStatus('success');
            setTimeout(() => router.push(`/order-confirmation/${orderId}`), 900);
          }
        },
        modal: {
          ondismiss: () => {
            if (status === 'processing') setStatus('idle');
          },
        },
      };

      const rp = new window.Razorpay(options);
      rp.open();
    } catch {
      setErrorMsg('Could not initiate payment. Please try again.');
      setStatus('error');
    }
  };

  const handleCOD = async () => {
    if (!order) return;
    setStatus('processing');
    setErrorMsg('');
    const orderId = generateOrderId();
    const ok = await createOrder(orderId);
    if (ok) {
      setStatus('success');
      setTimeout(() => router.push(`/order-confirmation/${orderId}`), 900);
    }
  };

  if (!order) return null;

  return (
    <>
      {razorpayEnabled && (
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="beforeInteractive"
          onReady={() => setRazorpayReady(true)}
        />
      )}

      <div className="min-h-screen bg-ivory-grain pt-32 pb-20">
        <div className="max-w-5xl mx-auto px-6">
          {/* Breadcrumb */}
          <Link href="/checkout"
            className="inline-flex items-center gap-2 font-body text-sm text-earthen-rust/50 hover:text-sun-harvest transition-colors mb-8">
            <ArrowLeft size={14} /> Back to Shipping
          </Link>

          {/* Step indicator */}
          <div className="flex items-center gap-3 mb-10">
            {['Cart', 'Shipping', 'Payment', 'Confirm'].map((step, i) => (
              <motion.div key={step} className="flex items-center gap-3"
                initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.06 }}>
                <div className="flex items-center gap-2">
                  <motion.div
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-body font-bold text-xs ${
                      i === 2 ? 'bg-sun-harvest text-white' : i < 2 ? 'bg-earthen-rust text-white' : 'bg-earthen-rust/10 text-earthen-rust/40'
                    }`}
                    animate={i === 2 ? { boxShadow: ['0 0 0px rgba(243,162,19,0)', '0 0 10px rgba(243,162,19,0.5)', '0 0 0px rgba(243,162,19,0)'] } : {}}
                    transition={i === 2 ? { duration: 2.2, repeat: Infinity, ease: 'easeInOut' } : {}}
                  >{i + 1}</motion.div>
                  <span className={`font-body text-xs font-semibold hidden sm:block ${
                    i === 2 ? 'text-sun-harvest' : i < 2 ? 'text-earthen-rust' : 'text-earthen-rust/35'
                  }`}>{step}</span>
                </div>
                {i < 3 && <div className="w-8 h-px bg-earthen-rust/15" />}
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Left — payment options */}
            <div className="lg:col-span-2">
              <h1 className="font-display font-bold text-3xl text-earthen-rust mb-8">Choose Payment</h1>

              {/* Payment method cards */}
              <div className="space-y-4 mb-8">
                {/* Online payment */}
                {razorpayEnabled && (
                  <motion.button
                    onClick={() => setMethod('online')}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.99 }}
                    className={`w-full text-left p-5 rounded-2xl border-2 transition-all ${
                      method === 'online'
                        ? 'border-sun-harvest bg-sun-harvest/5'
                        : 'border-earthen-rust/12 bg-white hover:border-earthen-rust/25'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        method === 'online' ? 'bg-sun-harvest/15' : 'bg-earthen-rust/6'
                      }`}>
                        <CreditCard size={18} className={method === 'online' ? 'text-sun-harvest' : 'text-earthen-rust/40'} />
                      </div>
                      <div className="flex-1">
                        <p className="font-body font-bold text-sm text-earthen-rust">Pay Online</p>
                        <p className="font-body text-xs text-earthen-rust/45 mt-0.5">
                          UPI · Cards · Net Banking · Wallets via Razorpay
                        </p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        method === 'online' ? 'border-sun-harvest' : 'border-earthen-rust/20'
                      }`}>
                        {method === 'online' && <div className="w-2.5 h-2.5 rounded-full bg-sun-harvest" />}
                      </div>
                    </div>
                  </motion.button>
                )}

                {/* COD */}
                <motion.button
                  onClick={() => setMethod('cod')}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.99 }}
                  className={`w-full text-left p-5 rounded-2xl border-2 transition-all ${
                    method === 'cod'
                      ? 'border-sun-harvest bg-sun-harvest/5'
                      : 'border-earthen-rust/12 bg-white hover:border-earthen-rust/25'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      method === 'cod' ? 'bg-sun-harvest/15' : 'bg-earthen-rust/6'
                    }`}>
                      <Truck size={18} className={method === 'cod' ? 'text-sun-harvest' : 'text-earthen-rust/40'} />
                    </div>
                    <div className="flex-1">
                      <p className="font-body font-bold text-sm text-earthen-rust">Cash on Delivery</p>
                      <p className="font-body text-xs text-earthen-rust/45 mt-0.5">
                        Pay when your order arrives · No extra charges
                      </p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      method === 'cod' ? 'border-sun-harvest' : 'border-earthen-rust/20'
                    }`}>
                      {method === 'cod' && <div className="w-2.5 h-2.5 rounded-full bg-sun-harvest" />}
                    </div>
                  </div>
                </motion.button>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap gap-3 mb-8">
                {['256-bit SSL', 'Secure Checkout', 'Easy Returns'].map(b => (
                  <div key={b} className="flex items-center gap-1.5 px-3 py-1.5 bg-sacred-leaf/6 rounded-full border border-sacred-leaf/15">
                    <ShieldCheck size={11} className="text-sacred-leaf" />
                    <span className="font-body text-[10px] text-sacred-leaf font-semibold">{b}</span>
                  </div>
                ))}
              </div>

              {/* Error */}
              {status === 'error' && errorMsg && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="font-body text-sm text-red-600">{errorMsg}</p>
                </div>
              )}

              {/* CTA */}
              <motion.button
                onClick={method === 'online' ? handleOnlinePayment : handleCOD}
                disabled={status === 'processing' || status === 'success' || (method === 'online' && !razorpayReady)}
                whileHover={status === 'idle' || status === 'error' ? { scale: 1.02 } : {}}
                whileTap={status === 'idle' || status === 'error' ? { scale: 0.98 } : {}}
                className="w-full flex items-center justify-center gap-3 font-body font-bold text-sm py-4 rounded-2xl transition-all tracking-wide uppercase disabled:cursor-not-allowed disabled:opacity-70"
                style={{ background: status === 'success' ? '#009846' : '#f3a213', color: '#050100' }}
              >
                <AnimatePresence mode="wait">
                  {(status === 'idle' || status === 'error') && (
                    <motion.span key="idle" className="flex items-center gap-2"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      {method === 'online' ? <CreditCard size={15} /> : <Truck size={15} />}
                      {method === 'online' ? `Pay ₹${order.total} Online` : `Place Order (COD) — ₹${order.total}`}
                    </motion.span>
                  )}
                  {status === 'processing' && (
                    <motion.span key="proc" className="flex items-center gap-2"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <Loader2 size={15} className="animate-spin" />
                      {method === 'online' ? 'Opening Payment...' : 'Placing Order...'}
                    </motion.span>
                  )}
                  {status === 'success' && (
                    <motion.span key="ok" className="flex items-center gap-2 text-white"
                      initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
                      <CheckCircle size={15} /> Order Confirmed!
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              <p className="text-center font-body text-[10px] text-earthen-rust/30 mt-3 flex items-center justify-center gap-1.5">
                <Lock size={10} />
                {method === 'online' ? 'Payments secured by Razorpay' : 'Pay in cash when your order is delivered'}
              </p>
            </div>

            {/* Right — order summary */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="lg:col-span-1">
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
                      <div className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center"
                        style={{ background: item.color + '18', border: `1.5px solid ${item.color}30` }}>
                        <div className="w-5 h-5 rounded-full" style={{ background: item.color + '70' }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-body font-semibold text-xs text-earthen-rust leading-tight truncate">{item.name}</p>
                        <p className="font-body text-[10px] text-earthen-rust/45">{item.weight} × {item.quantity}</p>
                      </div>
                      <span className="font-body font-bold text-sm text-earthen-rust shrink-0">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
                <div className="px-6 py-4 border-t border-earthen-rust/8 space-y-2">
                  <div className="flex justify-between font-body text-sm text-earthen-rust/50">
                    <span>Subtotal</span><span>₹{order.subtotal}</span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between font-body text-sm text-sacred-leaf font-semibold">
                      <span>Discount{order.couponCode ? ` (${order.couponCode})` : ''}</span>
                      <span>−₹{order.discount}</span>
                    </div>
                  )}
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
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}
