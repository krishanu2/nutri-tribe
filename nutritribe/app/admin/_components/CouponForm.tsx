'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Trash2, Save } from 'lucide-react';
import type { Coupon } from '@prisma/client';

interface Props {
  coupon?: Coupon;
}

function toDateInputValue(date: Date | null) {
  if (!date) return '';
  return new Date(date).toISOString().slice(0, 10);
}

export default function CouponForm({ coupon }: Props) {
  const router = useRouter();
  const isEdit = !!coupon;

  const [code, setCode] = useState(coupon?.code ?? '');
  const [type, setType] = useState<'PERCENT' | 'FIXED'>(coupon?.type ?? 'PERCENT');
  const [value, setValue] = useState(coupon?.value ?? 10);
  const [minOrderValue, setMinOrderValue] = useState(coupon?.minOrderValue ?? 0);
  const [maxUses, setMaxUses] = useState<string>(coupon?.maxUses != null ? String(coupon.maxUses) : '');
  const [expiresAt, setExpiresAt] = useState(toDateInputValue(coupon?.expiresAt ?? null));
  const [active, setActive] = useState(coupon?.active ?? true);

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const body = {
      code: code.trim().toUpperCase(),
      type,
      value: Number(value),
      minOrderValue: Number(minOrderValue) || 0,
      maxUses: maxUses.trim() === '' ? null : Number(maxUses),
      expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
      active,
    };

    try {
      const res = await fetch(isEdit ? `/api/admin/coupons/${coupon!.id}` : '/api/admin/coupons', {
        method: isEdit ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to save coupon');
      }
      router.push('/admin/coupons');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save coupon');
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!coupon) return;
    if (!confirm(`Delete coupon "${coupon.code}" permanently? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/coupons/${coupon.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      router.push('/admin/coupons');
      router.refresh();
    } catch {
      setError('Failed to delete coupon');
      setDeleting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl">
      <div className="bg-white rounded-2xl border border-[#7d3627]/8 overflow-hidden">
        <div className="px-6 py-4 border-b border-[#7d3627]/8">
          <h2 className="font-display font-bold text-lg text-[#7d3627]">Coupon Details</h2>
        </div>
        <div className="px-6 py-5 space-y-4">
          <Field label="Code customers will type" required hint="Shown at checkout, e.g. WELCOME10. Automatically saved in CAPS.">
            <input
              type="text"
              required
              value={code}
              onChange={e => setCode(e.target.value.toUpperCase())}
              placeholder="e.g. WELCOME10"
              className="w-full font-body font-bold tracking-widest text-sm text-[#7d3627] bg-[#fdfbf7] border-2 border-[#7d3627]/15 rounded-xl px-4 py-2.5 outline-none focus:border-[#f3a213] transition-all"
            />
          </Field>

          <Field label="Discount type" hint="Choose whether this coupon takes off a percentage or a flat rupee amount">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setType('PERCENT')}
                className={`font-body font-semibold text-xs px-4 py-2 rounded-full transition-all ${
                  type === 'PERCENT'
                    ? 'bg-[#f3a213] text-[#050100]'
                    : 'bg-[#7d3627]/6 text-[#7d3627]/60 hover:bg-[#7d3627]/12'
                }`}
              >
                Percentage off
              </button>
              <button
                type="button"
                onClick={() => setType('FIXED')}
                className={`font-body font-semibold text-xs px-4 py-2 rounded-full transition-all ${
                  type === 'FIXED'
                    ? 'bg-[#f3a213] text-[#050100]'
                    : 'bg-[#7d3627]/6 text-[#7d3627]/60 hover:bg-[#7d3627]/12'
                }`}
              >
                Flat amount off
              </button>
            </div>
          </Field>

          <Field
            label={type === 'PERCENT' ? 'Discount percentage' : 'Discount amount (₹)'}
            required
            hint={type === 'PERCENT' ? 'e.g. 10 means 10% off the order subtotal' : 'e.g. 100 means ₹100 off the order subtotal'}
          >
            <div className="relative">
              <input
                type="number"
                required
                min={1}
                max={type === 'PERCENT' ? 100 : undefined}
                value={value}
                onChange={e => setValue(Number(e.target.value))}
                className="w-full font-body text-sm text-[#7d3627] bg-[#fdfbf7] border-2 border-[#7d3627]/15 rounded-xl px-4 py-2.5 pr-10 outline-none focus:border-[#f3a213] transition-all"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 font-body text-sm text-[#7d3627]/40">
                {type === 'PERCENT' ? '%' : '₹'}
              </span>
            </div>
          </Field>

          <Field label="Minimum order value (optional)" hint="The cart subtotal must be at least this amount for the coupon to apply. Leave 0 for no minimum.">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-body text-sm text-[#7d3627]/40">₹</span>
              <input
                type="number"
                min={0}
                value={minOrderValue}
                onChange={e => setMinOrderValue(Number(e.target.value))}
                className="w-full font-body text-sm text-[#7d3627] bg-[#fdfbf7] border-2 border-[#7d3627]/15 rounded-xl pl-8 pr-4 py-2.5 outline-none focus:border-[#f3a213] transition-all"
              />
            </div>
          </Field>

          <Field label="Usage limit (optional)" hint="The maximum number of times this coupon can be used in total. Leave blank for unlimited uses.">
            <input
              type="number"
              min={1}
              value={maxUses}
              onChange={e => setMaxUses(e.target.value)}
              placeholder="Unlimited"
              className="w-full font-body text-sm text-[#7d3627] bg-[#fdfbf7] border-2 border-[#7d3627]/15 rounded-xl px-4 py-2.5 outline-none focus:border-[#f3a213] transition-all"
            />
            {isEdit && coupon && (
              <p className="font-body text-[11px] text-[#7d3627]/35 mt-1.5">Used {coupon.usedCount} time{coupon.usedCount !== 1 ? 's' : ''} so far</p>
            )}
          </Field>

          <Field label="Expiry date (optional)" hint="After this date, the coupon stops working automatically. Leave blank for no expiry.">
            <input
              type="date"
              value={expiresAt}
              onChange={e => setExpiresAt(e.target.value)}
              className="w-full font-body text-sm text-[#7d3627] bg-[#fdfbf7] border-2 border-[#7d3627]/15 rounded-xl px-4 py-2.5 outline-none focus:border-[#f3a213] transition-all"
            />
          </Field>

          <Field label="Status" hint="Inactive coupons are rejected at checkout even if a customer enters the code">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setActive(true)}
                className={`font-body font-semibold text-xs px-4 py-2 rounded-full transition-all ${
                  active
                    ? 'bg-[#009846] text-white'
                    : 'bg-[#7d3627]/6 text-[#7d3627]/60 hover:bg-[#7d3627]/12'
                }`}
              >
                Active
              </button>
              <button
                type="button"
                onClick={() => setActive(false)}
                className={`font-body font-semibold text-xs px-4 py-2 rounded-full transition-all ${
                  !active
                    ? 'bg-[#7d3627] text-white'
                    : 'bg-[#7d3627]/6 text-[#7d3627]/60 hover:bg-[#7d3627]/12'
                }`}
              >
                Inactive
              </button>
            </div>
          </Field>
        </div>
      </div>

      {error && (
        <p className="font-body text-xs text-red-500 bg-red-50 px-4 py-3 rounded-xl">{error}</p>
      )}

      <div className="flex items-center justify-between gap-3">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 font-body font-semibold text-sm px-5 py-3 rounded-xl bg-[#f3a213] text-[#050100] hover:brightness-110 transition-all disabled:opacity-60"
        >
          {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
          {isEdit ? 'Save Changes' : 'Create Coupon'}
        </button>

        {isEdit && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="inline-flex items-center gap-2 font-body font-semibold text-sm px-5 py-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-all disabled:opacity-60"
          >
            {deleting ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
            Delete Coupon
          </button>
        )}
      </div>
    </form>
  );
}

function Field({ label, required, hint, children }: { label: string; required?: boolean; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block font-body text-xs font-semibold tracking-widest uppercase text-[#7d3627]/50 mb-2">
        {label} {required && <span className="text-[#f3a213]">*</span>}
      </label>
      {children}
      {hint && <p className="font-body text-[11px] text-[#7d3627]/35 mt-1.5">{hint}</p>}
    </div>
  );
}
