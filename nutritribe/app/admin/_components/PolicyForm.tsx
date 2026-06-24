'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Save, Eye, EyeOff } from 'lucide-react';
import type { Policy } from '@prisma/client';
import PolicyContent from '@/components/PolicyContent';

interface Props {
  type: string;
  policy: Policy | null;
  fallbackTitle: string;
}

export default function PolicyForm({ type, policy, fallbackTitle }: Props) {
  const router = useRouter();

  const [title, setTitle] = useState(policy?.title ?? fallbackTitle);
  const [content, setContent] = useState(policy?.content ?? '');
  const [showPreview, setShowPreview] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSaved(false);

    try {
      const res = await fetch(`/api/admin/policies/${type}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to save');
      }
      setSaved(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block font-body text-xs font-semibold tracking-widest uppercase text-[#7d3627]/50 mb-2">
          Page Title
        </label>
        <input
          type="text"
          required
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="w-full font-body text-sm text-[#7d3627] bg-[#fdfbf7] border-2 border-[#7d3627]/15 rounded-xl px-4 py-2.5 outline-none focus:border-[#f3a213] transition-all"
        />
        <p className="font-body text-[11px] text-[#7d3627]/35 mt-1.5">Shown as the big heading at the top of this page.</p>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block font-body text-xs font-semibold tracking-widest uppercase text-[#7d3627]/50">
            Content
          </label>
          <button
            type="button"
            onClick={() => setShowPreview(v => !v)}
            className="inline-flex items-center gap-1.5 font-body text-xs font-semibold text-[#7d3627]/50 hover:text-[#f3a213] transition-colors"
          >
            {showPreview ? <EyeOff size={13} /> : <Eye size={13} />}
            {showPreview ? 'Hide preview' : 'Show preview'}
          </button>
        </div>
        <div className="bg-[#7d3627]/4 border border-[#7d3627]/10 rounded-xl px-4 py-3 mb-3">
          <p className="font-body text-[11px] text-[#7d3627]/55 leading-relaxed">
            Leave a blank line between paragraphs. Start a line with <code className="font-bold">## </code> for a section heading,
            {' '}<code className="font-bold">### </code> for a smaller sub-heading, and <code className="font-bold">- </code> for a bullet point.
            Use <code className="font-bold">**text**</code> to bold something, and <code className="font-bold">[text](url)</code> for a link.
          </p>
        </div>
        <textarea
          required
          rows={20}
          value={content}
          onChange={e => setContent(e.target.value)}
          className="w-full font-body text-sm text-[#7d3627] bg-[#fdfbf7] border-2 border-[#7d3627]/15 rounded-xl px-4 py-3 outline-none focus:border-[#f3a213] transition-all leading-relaxed"
          style={{ fontFamily: 'ui-monospace, monospace', fontSize: 13 }}
        />
      </div>

      {showPreview && (
        <div>
          <p className="font-body text-xs font-semibold tracking-widest uppercase text-[#7d3627]/50 mb-2">Live Preview</p>
          <div className="bg-white border border-[#7d3627]/10 rounded-xl p-6 max-h-[420px] overflow-y-auto">
            <h2 className="font-display font-bold text-2xl text-[#7d3627] mb-4">{title}</h2>
            {content
              ? <PolicyContent content={content} />
              : <p className="font-body text-sm text-[#7d3627]/35">Start typing to see a preview here.</p>}
          </div>
        </div>
      )}

      {error && <p className="font-body text-sm text-red-500">{error}</p>}
      {saved && !error && <p className="font-body text-sm text-[#009846]">Saved.</p>}

      <button
        type="submit"
        disabled={saving}
        className="inline-flex items-center gap-2 font-body font-semibold text-sm px-5 py-2.5 rounded-xl bg-[#f3a213] text-[#050100] hover:brightness-110 transition-all disabled:opacity-60"
      >
        {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
        {saving ? 'Saving…' : 'Save Changes'}
      </button>
    </form>
  );
}
