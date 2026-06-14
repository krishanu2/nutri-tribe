'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

interface Props {
  label?: string;
  hint?: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}

export default function TagListField({ label, hint, values, onChange, placeholder = 'Type a value and press Enter' }: Props) {
  const [draft, setDraft] = useState('');

  const addTag = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    if (!values.includes(trimmed)) onChange([...values, trimmed]);
    setDraft('');
  };

  const removeTag = (tag: string) => {
    onChange(values.filter(v => v !== tag));
  };

  return (
    <div>
      {label && (
        <label className="block font-body text-xs font-semibold tracking-widest uppercase text-[#7d3627]/50 mb-2">
          {label}
        </label>
      )}

      <div className="w-full font-body text-sm bg-[#fdfbf7] border-2 border-[#7d3627]/15 rounded-xl px-3 py-2.5 focus-within:border-[#f3a213] transition-all flex flex-wrap gap-2 items-center">
        {values.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1.5 font-body text-xs font-semibold px-3 py-1.5 rounded-full bg-[#7d3627]/8 text-[#7d3627]"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="text-[#7d3627]/40 hover:text-red-500 transition-colors"
              aria-label={`Remove ${tag}`}
            >
              <X size={12} />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ',') {
              e.preventDefault();
              addTag();
            } else if (e.key === 'Backspace' && !draft && values.length > 0) {
              removeTag(values[values.length - 1]);
            }
          }}
          onBlur={addTag}
          placeholder={values.length === 0 ? placeholder : 'Add another…'}
          className="flex-1 min-w-[120px] bg-transparent outline-none text-[#7d3627] placeholder-[#7d3627]/25 py-0.5"
        />
      </div>

      {hint && <p className="font-body text-[11px] text-[#7d3627]/35 mt-1.5">{hint}</p>}
    </div>
  );
}
