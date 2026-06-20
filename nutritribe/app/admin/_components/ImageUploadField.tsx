'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { upload } from '@vercel/blob/client';
import { Loader2, ImagePlus, X } from 'lucide-react';

interface Props {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  hint?: string;
  className?: string;
}

const MAX_FILE_BYTES = 20 * 1024 * 1024;

export default function ImageUploadField({ value, onChange, label, hint, className = '' }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (file: File) => {
    if (file.size > MAX_FILE_BYTES) {
      setError(`That photo is too large (${(file.size / 1024 / 1024).toFixed(1)}MB) — please use one under 20MB.`);
      return;
    }
    setUploading(true);
    setError('');
    try {
      // Uploads go directly from the browser to Blob storage (not through our
      // server), so there's no ~4.5MB request-body ceiling — large product
      // photos straight from a phone camera work fine.
      const ext = file.name.includes('.') ? file.name.split('.').pop() : 'jpg';
      const pathname = `products/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const blob = await upload(pathname, file, {
        access: 'public',
        handleUploadUrl: '/api/admin/upload',
      });
      onChange(blob.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className={className}>
      {label && (
        <label className="block font-body text-xs font-semibold tracking-widest uppercase text-[#7d3627]/50 mb-2">
          {label}
        </label>
      )}

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        className="relative w-full aspect-square max-w-[180px] rounded-xl border-2 border-dashed border-[#7d3627]/20 bg-[#fdfbf7] overflow-hidden flex items-center justify-center"
      >
        {value ? (
          <>
            <Image src={value} alt="Uploaded image" fill className="object-cover" />
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-colors"
              aria-label="Remove image"
            >
              <X size={14} />
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="flex flex-col items-center justify-center gap-2 w-full h-full font-body text-xs text-[#7d3627]/40 hover:text-[#7d3627]/60 transition-colors px-3 text-center"
          >
            {uploading ? <Loader2 size={22} className="animate-spin" /> : <ImagePlus size={22} />}
            {uploading ? 'Uploading…' : 'Click or drop image here'}
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = '';
        }}
      />

      {value && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="mt-2 font-body text-xs font-semibold text-[#f3a213] hover:underline"
        >
          {uploading ? 'Uploading…' : 'Replace image'}
        </button>
      )}

      {error && <p className="font-body text-[11px] text-red-500 mt-1.5">{error}</p>}
      {hint && !error && <p className="font-body text-[11px] text-[#7d3627]/35 mt-1.5">{hint}</p>}
    </div>
  );
}
