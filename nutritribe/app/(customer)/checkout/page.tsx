'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, ShoppingBag, Leaf, Loader2, Tag } from 'lucide-react';
import { useCart } from '@/lib/cartContext';

const FREE_DELIVERY = 499;

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu & Kashmir', 'Ladakh',
];

interface FormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

function Field({
  label, name, type = 'text', placeholder, half = false, value, error, onChange,
}: {
  label: string; name: keyof FormData; type?: string; placeholder?: string; half?: boolean;
  value: string; error?: string; onChange: (value: string) => void;
}) {
  return (
    <div className={half ? 'col-span-1' : 'col-span-2'}>
      <label className="block font-body font-semibold text-xs tracking-widest uppercase text-earthen-rust/60 mb-2">
        {label}
      </label>
      <input
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full font-body text-sm text-earthen-rust bg-white border-2 rounded-xl px-4 py-3 outline-none transition-all placeholder-earthen-rust/25 ${
          error
            ? 'border-red-400 focus:border-red-400'
            : 'border-earthen-rust/15 focus:border-sun-harvest'
        }`}
        onFocus={e => { if (!error) e.target.style.boxShadow = '0 0 0 3px rgba(243,162,19,0.18)'; }}
        onBlur={e => { e.target.style.boxShadow = 'none'; }}
      />
      {error && (
        <p className="font-body text-xs text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, totalItems } = useCart();
  const delivery = totalPrice >= FREE_DELIVERY ? 0 : 49;

  const [form, setForm] = useState<FormData>({
    name: '', email: '', phone: '', address: '', city: '', state: '', pincode: '',
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const [couponInput, setCouponInput] = useState('');
  const [couponStatus, setCouponStatus] = useState<'idle' | 'checking' | 'applied' | 'error'>('idle');
  const [couponError, setCouponError] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);

  const discount = appliedCoupon?.discount ?? 0;
  const grandTotal = Math.max(0, totalPrice + delivery - discount);

  // Redirect if cart is empty
  useEffect(() => {
    if (totalItems === 0) router.push('/products');
  }, [totalItems, router]);

  const validate = () => {
    const e: Partial<FormData> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Valid email required';
    if (!form.phone.match(/^[6-9]\d{9}$/)) e.phone = 'Valid 10-digit mobile required';
    if (!form.address.trim()) e.address = 'Address is required';
    if (!form.city.trim()) e.city = 'City is required';
    if (!form.state) e.state = 'State is required';
    if (!form.pincode.match(/^\d{6}$/)) e.pincode = 'Valid 6-digit pincode required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const pendingOrder = {
      ...form,
      items,
      subtotal: totalPrice,
      delivery,
      discount,
      couponCode: appliedCoupon?.code ?? null,
      total: grandTotal,
    };
    sessionStorage.setItem('nt-pending-order', JSON.stringify(pendingOrder));
    router.push('/checkout/payment');
  };

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setCouponStatus('checking');
    setCouponError('');
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponInput.trim(), subtotal: totalPrice }),
      });
      const data = await res.json();
      if (!data.valid) {
        setAppliedCoupon(null);
        setCouponError(data.error ?? 'Invalid coupon code');
        setCouponStatus('error');
        return;
      }
      setAppliedCoupon({ code: data.code, discount: data.discount });
      setCouponStatus('applied');
    } catch {
      setAppliedCoupon(null);
      setCouponError('Could not validate coupon right now');
      setCouponStatus('error');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput('');
    setCouponStatus('idle');
    setCouponError('');
  };

  if (totalItems === 0) return null;

  return (
    <div className="min-h-screen bg-ivory-grain pt-32 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Breadcrumb */}
        <Link href="/products" className="inline-flex items-center gap-2 font-body text-sm text-earthen-rust/50 hover:text-sun-harvest transition-colors mb-8">
          <ArrowLeft size={14} />
          Continue Shopping
        </Link>

        {/* Step indicator */}
        <div className="flex items-center gap-3 mb-10">
          {['Cart', 'Shipping', 'Payment', 'Confirm'].map((step, i) => (
            <motion.div key={step} className="flex items-center gap-3"
              initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.06 }}>
              <div className="flex items-center gap-2">
                <motion.div
                  className={`w-7 h-7 rounded-full flex items-center justify-center font-body font-bold text-xs ${
                    i === 1 ? 'bg-sun-harvest text-white' : i < 1 ? 'bg-earthen-rust text-white' : 'bg-earthen-rust/10 text-earthen-rust/40'
                  }`}
                  animate={i === 1 ? { boxShadow: ['0 0 0px rgba(243,162,19,0)', '0 0 10px rgba(243,162,19,0.5)', '0 0 0px rgba(243,162,19,0)'] } : {}}
                  transition={i === 1 ? { duration: 2.2, repeat: Infinity, ease: 'easeInOut' } : {}}
                >{i + 1}</motion.div>
                <span className={`font-body text-xs font-semibold hidden sm:block ${
                  i === 1 ? 'text-sun-harvest' : i < 1 ? 'text-earthen-rust' : 'text-earthen-rust/35'
                }`}>{step}</span>
              </div>
              {i < 3 && <div className="w-8 h-px bg-earthen-rust/15" />}
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Form */}
          <div className="lg:col-span-2">
            <h1 className="font-display font-bold text-3xl text-earthen-rust mb-8">
              Shipping Details
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Full Name" name="name" placeholder="Arjun Kumar"
                  value={form.name} error={errors.name} onChange={v => setForm(f => ({ ...f, name: v }))} />
                <Field label="Email Address" name="email" type="email" placeholder="arjun@email.com"
                  value={form.email} error={errors.email} onChange={v => setForm(f => ({ ...f, email: v }))} />
                <Field label="Mobile Number" name="phone" type="tel" placeholder="9876543210"
                  value={form.phone} error={errors.phone} onChange={v => setForm(f => ({ ...f, phone: v }))} />
                <Field label="Full Address" name="address" placeholder="House no., Street, Area"
                  value={form.address} error={errors.address} onChange={v => setForm(f => ({ ...f, address: v }))} />
                <Field label="City" name="city" placeholder="Patna" half
                  value={form.city} error={errors.city} onChange={v => setForm(f => ({ ...f, city: v }))} />
                <div className="col-span-1">
                  <label className="block font-body font-semibold text-xs tracking-widest uppercase text-earthen-rust/60 mb-2">
                    State
                  </label>
                  <select
                    value={form.state}
                    onChange={e => setForm(f => ({ ...f, state: e.target.value }))}
                    className={`w-full font-body text-sm text-earthen-rust bg-white border-2 rounded-xl px-4 py-3 outline-none transition-all ${
                      errors.state ? 'border-red-400' : 'border-earthen-rust/15 focus:border-sun-harvest'
                    }`}
                  >
                    <option value="">Select state</option>
                    {INDIAN_STATES.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  {errors.state && <p className="font-body text-xs text-red-500 mt-1">{errors.state}</p>}
                </div>
                <Field label="Pincode" name="pincode" placeholder="800001" half
                  value={form.pincode} error={errors.pincode} onChange={v => setForm(f => ({ ...f, pincode: v }))} />
              </div>

              {/* Delivery note */}
              <div className="flex items-start gap-3 p-4 bg-sacred-leaf/5 rounded-xl border border-sacred-leaf/15">
                <Leaf size={15} className="text-sacred-leaf mt-0.5 shrink-0" />
                <p className="font-body text-xs text-sacred-leaf font-semibold leading-relaxed">
                  Orders are usually dispatched within 24 hours.{' '}
                  {delivery === 0
                    ? 'Free delivery applied!'
                    : `Add ₹${FREE_DELIVERY - totalPrice} more to unlock free delivery.`}
                </p>
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-3 bg-sun-harvest text-white font-body font-bold text-sm py-4 rounded-2xl hover:brightness-110 transition-all tracking-wide uppercase"
              >
                Proceed to Payment
                <ArrowRight size={16} />
              </motion.button>
            </form>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-32">
              <div className="bg-white rounded-3xl border border-earthen-rust/10 shadow-card overflow-hidden">
                <div className="px-6 py-5 border-b border-earthen-rust/8 flex items-center gap-2">
                  <ShoppingBag size={16} className="text-earthen-rust/60" />
                  <h2 className="font-display font-bold text-lg text-earthen-rust">
                    Order Summary
                  </h2>
                </div>

                <div className="px-6 py-4 space-y-3">
                  {items.map(item => (
                    <div
                      key={`${item.productId}-${item.weight}`}
                      className="flex items-center gap-3"
                    >
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
                        <p className="font-body text-[10px] text-earthen-rust/45">
                          {item.weight} × {item.quantity}
                        </p>
                      </div>
                      <span className="font-body font-bold text-sm text-earthen-rust shrink-0">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Coupon */}
                <div className="px-6 py-4 border-t border-earthen-rust/8">
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between bg-sacred-leaf/8 border border-sacred-leaf/20 rounded-xl px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <Tag size={14} className="text-sacred-leaf shrink-0" />
                        <div>
                          <p className="font-body font-bold text-xs tracking-widest text-sacred-leaf">{appliedCoupon.code}</p>
                          <p className="font-body text-[11px] text-sacred-leaf/70">You saved ₹{appliedCoupon.discount}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveCoupon}
                        className="font-body text-xs font-semibold text-earthen-rust/50 hover:text-red-500 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div>
                      <label className="block font-body font-semibold text-xs tracking-widest uppercase text-earthen-rust/60 mb-2">
                        Have a coupon?
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={couponInput}
                          onChange={e => {
                            setCouponInput(e.target.value.toUpperCase());
                            setCouponStatus('idle');
                            setCouponError('');
                          }}
                          placeholder="Enter code"
                          className="flex-1 font-body font-semibold text-sm tracking-widest text-earthen-rust bg-white border-2 border-earthen-rust/15 rounded-xl px-4 py-2.5 outline-none focus:border-sun-harvest transition-all"
                        />
                        <button
                          type="button"
                          onClick={handleApplyCoupon}
                          disabled={couponStatus === 'checking' || !couponInput.trim()}
                          className="font-body font-semibold text-sm px-5 py-2.5 rounded-xl bg-earthen-rust/8 text-earthen-rust hover:bg-earthen-rust/15 transition-all disabled:opacity-50"
                        >
                          {couponStatus === 'checking' ? <Loader2 size={14} className="animate-spin" /> : 'Apply'}
                        </button>
                      </div>
                      {couponStatus === 'error' && couponError && (
                        <p className="font-body text-xs text-red-500 mt-1.5">{couponError}</p>
                      )}
                    </div>
                  )}
                </div>

                <div className="px-6 py-4 border-t border-earthen-rust/8 space-y-2">
                  <div className="flex justify-between font-body text-sm text-earthen-rust/50">
                    <span>Subtotal</span><span>₹{totalPrice}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between font-body text-sm text-sacred-leaf font-semibold">
                      <span>Discount</span><span>−₹{discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-body text-sm text-earthen-rust/50">
                    <span>Delivery</span>
                    <span className={delivery === 0 ? 'text-sacred-leaf font-semibold' : ''}>
                      {delivery === 0 ? 'FREE' : `₹${delivery}`}
                    </span>
                  </div>
                  <div className="flex justify-between font-display font-bold text-xl text-earthen-rust pt-2 border-t border-earthen-rust/8">
                    <span>Total</span>
                    <span>₹{grandTotal}</span>
                  </div>
                </div>
              </div>

              {/* Trust badges */}
              <div className="mt-4 flex flex-col gap-2">
                {['100% Secure Checkout', 'Hand-Roasted Quality Guaranteed', 'Easy Returns Within 7 Days'].map(t => (
                  <div key={t} className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-sacred-leaf/20 flex items-center justify-center shrink-0">
                      <div className="w-1.5 h-1.5 rounded-full bg-sacred-leaf" />
                    </div>
                    <span className="font-body text-[11px] text-earthen-rust/50">{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
