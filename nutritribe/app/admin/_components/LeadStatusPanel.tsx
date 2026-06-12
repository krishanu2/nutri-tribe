'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LeadStatus } from '@prisma/client';
import { Loader2, CheckCircle, PhoneCall, Star, ThumbsUp, ThumbsDown, Sparkles } from 'lucide-react';
import LeadStatusBadge from './LeadStatusBadge';

const STATUS_OPTIONS: { value: LeadStatus; label: string; icon: React.ReactNode }[] = [
  { value: 'NEW',       label: 'New',       icon: <Sparkles size={14} /> },
  { value: 'CONTACTED', label: 'Contacted', icon: <PhoneCall size={14} /> },
  { value: 'QUALIFIED', label: 'Qualified', icon: <Star size={14} /> },
  { value: 'CONVERTED', label: 'Converted', icon: <ThumbsUp size={14} /> },
  { value: 'REJECTED',  label: 'Rejected',  icon: <ThumbsDown size={14} /> },
];

interface Props {
  leadId: string;
  currentStatus: LeadStatus;
  adminNote: string | null;
}

export default function LeadStatusPanel({ leadId, currentStatus, adminNote }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved]   = useState(false);
  const [error, setError]   = useState('');
  const [note, setNote]     = useState(adminNote ?? '');

  const handleUpdate = async (status?: LeadStatus) => {
    setSaving(true);
    setError('');
    try {
      const body: Record<string, string> = { adminNote: note };
      if (status) body.status = status;
      const res = await fetch(`/api/admin/leads/${leadId}`, {
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

  return (
    <div className="bg-white rounded-2xl border border-[#7d3627]/8 overflow-hidden">
      <div className="px-6 py-4 border-b border-[#7d3627]/8 flex items-center justify-between">
        <h2 className="font-display font-bold text-lg text-[#7d3627]">Lead Management</h2>
        <LeadStatusBadge status={currentStatus} />
      </div>

      {/* Status options */}
      <div className="px-6 py-5 border-b border-[#7d3627]/8">
        <p className="font-body text-xs font-semibold tracking-widest uppercase text-[#7d3627]/50 mb-3">
          Update Status
        </p>
        <div className="flex flex-wrap gap-2">
          {STATUS_OPTIONS.map(opt => {
            const active = currentStatus === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => handleUpdate(opt.value)}
                disabled={saving || active}
                className={`flex items-center gap-1.5 font-body font-semibold text-xs px-3.5 py-2 rounded-full transition-all ${
                  active
                    ? 'bg-[#f3a213] text-[#050100]'
                    : 'bg-[#7d3627]/6 text-[#7d3627]/60 hover:bg-[#7d3627]/12'
                }`}
              >
                {opt.icon}
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Note */}
      <div className="px-6 py-5 space-y-4">
        <div>
          <label className="block font-body text-xs font-semibold tracking-widest uppercase text-[#7d3627]/50 mb-2">
            Internal Note
          </label>
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            rows={4}
            placeholder="Notes visible only to admin..."
            className="w-full font-body text-sm text-[#7d3627] bg-[#fdfbf7] border-2 border-[#7d3627]/15 rounded-xl px-4 py-3 outline-none focus:border-[#f3a213] transition-all resize-none placeholder-[#7d3627]/25"
          />
        </div>

        {error && (
          <p className="font-body text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
        )}

        <button
          onClick={() => handleUpdate()}
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 bg-[#7d3627]/8 hover:bg-[#7d3627]/12 text-[#7d3627] font-body font-semibold text-sm py-3 rounded-xl transition-all"
        >
          {saving ? <Loader2 size={14} className="animate-spin" /> : null}
          {saved ? <><CheckCircle size={14} className="text-[#009846]" /> Saved!</> : 'Save Note'}
        </button>
      </div>
    </div>
  );
}
