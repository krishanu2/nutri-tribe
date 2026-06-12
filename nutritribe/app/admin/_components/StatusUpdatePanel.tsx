'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { OrderStatus } from '@prisma/client';
import { Loader2, CheckCircle, Truck, Package, Clock, XCircle, ChevronRight } from 'lucide-react';
import StatusBadge from './StatusBadge';

const STATUS_FLOW: OrderStatus[] = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'];

const STATUS_ICONS: Record<OrderStatus, React.ReactNode> = {
  PENDING:    <Clock size={14} />,
  CONFIRMED:  <CheckCircle size={14} />,
  PROCESSING: <Package size={14} />,
  SHIPPED:    <Truck size={14} />,
  DELIVERED:  <CheckCircle size={14} />,
  CANCELLED:  <XCircle size={14} />,
};

interface Props {
  orderId: string;
  currentStatus: OrderStatus;
  trackingNumber: string | null;
  adminNote: string | null;
}

export default function StatusUpdatePanel({ orderId, currentStatus, trackingNumber, adminNote }: Props) {
  const router = useRouter();
  const [saving, setSaving]     = useState(false);
  const [saved, setSaved]       = useState(false);
  const [error, setError]       = useState('');
  const [tracking, setTracking] = useState(trackingNumber ?? '');
  const [note, setNote]         = useState(adminNote ?? '');

  const currentIdx  = STATUS_FLOW.indexOf(currentStatus);
  const nextStatus  = currentIdx >= 0 && currentIdx < STATUS_FLOW.length - 1
    ? STATUS_FLOW[currentIdx + 1]
    : null;
  const isFinal     = currentStatus === 'DELIVERED' || currentStatus === 'CANCELLED';

  const handleUpdate = async (status?: OrderStatus) => {
    if (status === 'SHIPPED' && !tracking.trim()) {
      setError('Tracking number is required before marking as Shipped.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const body: Record<string, string> = { adminNote: note, trackingNumber: tracking };
      if (status) body.status = status;
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('Update failed');
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      router.refresh();
    } catch {
      setError('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => handleUpdate('CANCELLED' as OrderStatus);

  return (
    <div className="bg-white rounded-2xl border border-[#7d3627]/8 overflow-hidden">
      <div className="px-6 py-4 border-b border-[#7d3627]/8 flex items-center justify-between">
        <h2 className="font-display font-bold text-lg text-[#7d3627]">Order Management</h2>
        <StatusBadge status={currentStatus} />
      </div>

      {/* Status stepper */}
      <div className="px-6 py-5 border-b border-[#7d3627]/8">
        <p className="font-body text-xs font-semibold tracking-widest uppercase text-[#7d3627]/50 mb-4">
          Progress
        </p>
        <div className="flex items-center gap-1">
          {STATUS_FLOW.map((s, i) => {
            const done    = STATUS_FLOW.indexOf(currentStatus) >= i;
            const current = currentStatus === s;
            return (
              <div key={s} className="flex items-center gap-1 flex-1">
                <div className="flex flex-col items-center gap-1 flex-1">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs transition-all ${
                    current  ? 'bg-[#f3a213] text-white shadow-md'
                    : done   ? 'bg-[#009846] text-white'
                    : 'bg-[#7d3627]/10 text-[#7d3627]/30'
                  }`}>
                    <span style={{ color: 'inherit' }}>{STATUS_ICONS[s]}</span>
                  </div>
                  <span className={`font-body text-[9px] font-semibold tracking-wide text-center ${
                    current ? 'text-[#f3a213]' : done ? 'text-[#009846]' : 'text-[#7d3627]/30'
                  }`}>
                    {s.slice(0, 4)}
                  </span>
                </div>
                {i < STATUS_FLOW.length - 1 && (
                  <div className={`h-0.5 flex-1 mb-4 transition-all ${done ? 'bg-[#009846]/50' : 'bg-[#7d3627]/10'}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Fields */}
      <div className="px-6 py-5 space-y-4">
        <div>
          <label className="block font-body text-xs font-semibold tracking-widest uppercase text-[#7d3627]/50 mb-2">
            Tracking Number
          </label>
          <input
            value={tracking}
            onChange={e => setTracking(e.target.value)}
            placeholder="e.g. DTDC1234567890"
            className="w-full font-body text-sm text-[#7d3627] bg-[#fdfbf7] border-2 border-[#7d3627]/15 rounded-xl px-4 py-3 outline-none focus:border-[#f3a213] transition-all placeholder-[#7d3627]/25"
          />
        </div>
        <div>
          <label className="block font-body text-xs font-semibold tracking-widest uppercase text-[#7d3627]/50 mb-2">
            Internal Note
          </label>
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            rows={3}
            placeholder="Notes visible only to admin..."
            className="w-full font-body text-sm text-[#7d3627] bg-[#fdfbf7] border-2 border-[#7d3627]/15 rounded-xl px-4 py-3 outline-none focus:border-[#f3a213] transition-all resize-none placeholder-[#7d3627]/25"
          />
        </div>

        {error && (
          <p className="font-body text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
        )}

        {/* Save note/tracking only */}
        <button
          onClick={() => handleUpdate()}
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 bg-[#7d3627]/8 hover:bg-[#7d3627]/12 text-[#7d3627] font-body font-semibold text-sm py-3 rounded-xl transition-all"
        >
          {saving && !nextStatus ? <Loader2 size={14} className="animate-spin" /> : null}
          {saved ? <><CheckCircle size={14} className="text-[#009846]" /> Saved!</> : 'Save Note & Tracking'}
        </button>

        {/* Advance to next status */}
        {nextStatus && !isFinal && (
          <button
            onClick={() => handleUpdate(nextStatus)}
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 font-body font-bold text-sm py-3.5 rounded-xl transition-all"
            style={{ background: '#f3a213', color: '#050100' }}
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <ChevronRight size={14} />}
            Mark as {nextStatus.charAt(0) + nextStatus.slice(1).toLowerCase()}
          </button>
        )}

        {/* Cancel (only if not already cancelled or delivered) */}
        {!isFinal && (
          <button
            onClick={handleCancel}
            disabled={saving}
            className="w-full font-body text-xs text-red-400 hover:text-red-600 py-2 transition-colors"
          >
            Cancel Order
          </button>
        )}
      </div>
    </div>
  );
}
