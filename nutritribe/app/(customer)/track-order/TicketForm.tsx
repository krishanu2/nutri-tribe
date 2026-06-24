'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { upload } from '@vercel/blob/client';
import { AlertTriangle, Loader2, ImagePlus, X, CheckCircle2, Send } from 'lucide-react';

const ISSUE_OPTIONS = [
  { value: 'DAMAGED', label: 'Damaged Product' },
  { value: 'WRONG_ITEM', label: 'Wrong Item Received' },
  { value: 'MISSING_ITEM', label: 'Item Missing from Order' },
  { value: 'QUALITY_ISSUE', label: 'Quality Issue' },
  { value: 'OTHER', label: 'Other' },
] as const;

const DESCRIPTION_MAX = 1000;

interface Props {
  orderRef: string;
  customerName: string;
  email: string;
  phone: string;
}

export default function TicketForm({ orderRef, customerName, email, phone }: Props) {
  const [open, setOpen] = useState(false);
  const [issueType, setIssueType] = useState<typeof ISSUE_OPTIONS[number]['value']>('DAMAGED');
  const [description, setDescription] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (file: File) => {
    setUploading(true);
    setUploadError('');
    try {
      const ext = file.name.includes('.') ? file.name.split('.').pop() : 'jpg';
      const pathname = `tickets/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const blob = await upload(pathname, file, { access: 'public', handleUploadUrl: '/api/tickets/upload' });
      setPhotoUrl(blob.url);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Photo upload failed — you can still submit without it.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: orderRef,
          orderRef,
          issueType,
          customerName, email, phone,
          description,
          photoUrl: photoUrl || null,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Failed to submit ticket');
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-sacred-leaf/25 p-6 flex items-start gap-3"
      >
        <CheckCircle2 size={20} className="text-sacred-leaf shrink-0 mt-0.5" />
        <div>
          <p className="font-body font-bold text-sm text-earthen-rust">Report submitted</p>
          <p className="font-body text-sm text-earthen-rust/60 mt-1">
            We&apos;ll get back to you at {email} within 24 hours.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-earthen-rust/10 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between gap-3 p-5 hover:bg-earthen-rust/2 transition-colors"
      >
        <span className="flex items-center gap-3">
          <AlertTriangle size={16} className="text-sun-harvest shrink-0" />
          <span className="font-body font-semibold text-sm text-earthen-rust">Report an Issue with This Order</span>
        </span>
        <span className="font-body text-xs text-earthen-rust/40">{open ? 'Close' : 'Open'}</span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <form onSubmit={handleSubmit} className="p-5 pt-0 space-y-4 border-t border-earthen-rust/8">
              <div>
                <label className="block font-body font-semibold text-xs tracking-widest uppercase text-earthen-rust/60 mb-2 mt-4">
                  What&apos;s the issue?
                </label>
                <select
                  value={issueType}
                  onChange={e => setIssueType(e.target.value as typeof issueType)}
                  className="w-full font-body text-sm text-earthen-rust bg-white border-2 border-earthen-rust/15 rounded-xl px-4 py-3 outline-none focus:border-sun-harvest transition-all"
                >
                  {ISSUE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>

              <div>
                <label className="block font-body font-semibold text-xs tracking-widest uppercase text-earthen-rust/60 mb-2">
                  Tell us what happened
                </label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={e => setDescription(e.target.value.slice(0, DESCRIPTION_MAX))}
                  placeholder="Describe the issue in a few sentences…"
                  className="w-full font-body text-sm text-earthen-rust bg-white border-2 border-earthen-rust/15 rounded-xl px-4 py-3 outline-none focus:border-sun-harvest transition-all resize-none"
                />
                <p className="font-body text-[11px] text-earthen-rust/40 mt-1 text-right">{description.length}/{DESCRIPTION_MAX}</p>
              </div>

              <div>
                <label className="block font-body font-semibold text-xs tracking-widest uppercase text-earthen-rust/60 mb-2">
                  Photo (optional)
                </label>
                {photoUrl ? (
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden border-2 border-earthen-rust/15">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={photoUrl} alt="Issue photo" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setPhotoUrl('')}
                      className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/50 text-white flex items-center justify-center"
                    >
                      <X size={11} />
                    </button>
                  </div>
                ) : (
                  <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-earthen-rust/20 text-earthen-rust/50 text-sm font-body cursor-pointer hover:border-sun-harvest/40 transition-all">
                    {uploading ? <Loader2 size={14} className="animate-spin" /> : <ImagePlus size={14} />}
                    {uploading ? 'Uploading…' : 'Add a photo'}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={uploading}
                      onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ''; }}
                    />
                  </label>
                )}
                {uploadError && <p className="font-body text-xs text-red-500 mt-1.5">{uploadError}</p>}
              </div>

              {error && <p className="font-body text-sm text-red-500 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>}

              <motion.button
                type="submit"
                disabled={submitting || uploading}
                whileHover={!submitting ? { scale: 1.02 } : {}}
                whileTap={!submitting ? { scale: 0.98 } : {}}
                className="w-full flex items-center justify-center gap-2 bg-earthen-rust text-white font-body font-bold text-sm py-3.5 rounded-2xl hover:brightness-110 transition-all tracking-wide uppercase disabled:opacity-70"
              >
                {submitting ? <Loader2 size={15} className="animate-spin" /> : <Send size={14} />}
                {submitting ? 'Submitting…' : 'Submit Report'}
              </motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
