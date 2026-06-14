'use client';

import { useState } from 'react';

interface Props {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  hint?: string;
}

const ADD_NEW = '__add_new__';

export default function CategorySelect({ label, value, onChange, options, hint }: Props) {
  const [addingNew, setAddingNew] = useState(false);

  const allOptions = value && !options.includes(value) ? [...options, value] : options;

  if (addingNew) {
    return (
      <div>
        <label className="block font-body text-xs font-semibold tracking-widest uppercase text-[#7d3627]/50 mb-2">
          {label}
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            autoFocus
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Type the new category name"
            className="flex-1 font-body text-sm text-[#7d3627] bg-[#fdfbf7] border-2 border-[#7d3627]/15 rounded-xl px-4 py-2.5 outline-none focus:border-[#f3a213] transition-all"
          />
          <button
            type="button"
            onClick={() => setAddingNew(false)}
            className="font-body text-xs font-semibold px-4 py-2.5 rounded-xl bg-[#7d3627]/8 text-[#7d3627]/60 hover:bg-[#7d3627]/15 transition-all"
          >
            Choose existing
          </button>
        </div>
        {hint && <p className="font-body text-[11px] text-[#7d3627]/35 mt-1.5">{hint}</p>}
      </div>
    );
  }

  return (
    <div>
      <label className="block font-body text-xs font-semibold tracking-widest uppercase text-[#7d3627]/50 mb-2">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => {
          if (e.target.value === ADD_NEW) {
            onChange('');
            setAddingNew(true);
          } else {
            onChange(e.target.value);
          }
        }}
        className="w-full font-body text-sm text-[#7d3627] bg-[#fdfbf7] border-2 border-[#7d3627]/15 rounded-xl px-4 py-2.5 outline-none focus:border-[#f3a213] transition-all"
      >
        <option value="" disabled>Select a category…</option>
        {allOptions.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
        <option value={ADD_NEW}>+ Add new category…</option>
      </select>
      {hint && <p className="font-body text-[11px] text-[#7d3627]/35 mt-1.5">{hint}</p>}
    </div>
  );
}
