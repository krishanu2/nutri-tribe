'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle, Loader2 } from 'lucide-react';

export interface LeadFormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'select' | 'textarea';
  placeholder?: string;
  options?: string[];
  required?: boolean;
}

interface LeadFormProps {
  leadType: 'B2B' | 'CORPORATE_GIFTING';
  accent: string;
  detailFields: LeadFormField[];
}

const BASE_FIELDS: LeadFormField[] = [
  { name: 'companyName', label: 'Company / Brand Name', type: 'text', required: true, placeholder: 'e.g. Green Leaf Café' },
  { name: 'name', label: 'Your Name', type: 'text', required: true, placeholder: 'Full name' },
  { name: 'email', label: 'Email', type: 'email', required: true, placeholder: 'you@company.com' },
  { name: 'phone', label: 'Phone', type: 'tel', required: true, placeholder: '+91 98765 43210' },
];

const MESSAGE_FIELD: LeadFormField = {
  name: 'message', label: 'Message', type: 'textarea', placeholder: 'Tell us more about your requirements...',
};

export default function LeadForm({ leadType, accent, detailFields }: LeadFormProps) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [focused, setFocused] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (name: string, value: string) => setValues((v) => ({ ...v, [name]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const details = detailFields
        .map((f) => `${f.label}: ${values[f.name] || '—'}`)
        .join('\n');
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: leadType,
          name: values.name,
          email: values.email,
          phone: values.phone,
          companyName: values.companyName,
          details,
          message: values.message || '',
        }),
      });
      if (!res.ok) throw new Error('Failed');
      setSubmitted(true);
    } catch {
      setError('Something went wrong. Please try again or email us at sales@nutritribe.shop.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle = (field: string) => ({
    background: 'rgba(255,255,255,0.04)',
    border: `1px solid ${focused === field ? accent : 'rgba(255,255,255,0.1)'}`,
    boxShadow: focused === field ? `0 0 0 3px ${accent}20` : 'none',
    color: '#fdfbf7',
    outline: 'none',
    transition: 'all 0.25s',
  });

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center text-center py-24 rounded-3xl"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', minHeight: 400 }}
      >
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.1 }}>
          <CheckCircle size={56} style={{ color: accent }} />
        </motion.div>
        <h3 className="font-display font-bold text-2xl mt-6 mb-2" style={{ color: '#fdfbf7' }}>Enquiry Received!</h3>
        <p className="font-body text-sm max-w-sm" style={{ color: 'rgba(253,251,247,0.4)' }}>
          Thanks for reaching out — our team will get back to you within 1-2 business days.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {[...BASE_FIELDS, ...detailFields, MESSAGE_FIELD].map((field) => (
        <div key={field.name}>
          <label className="block font-body font-bold text-[10px] tracking-[0.3em] uppercase mb-2" style={{ color: 'rgba(243,162,19,0.6)' }}>
            {field.label}{field.required && ' *'}
          </label>
          {field.type === 'textarea' ? (
            <textarea
              required={field.required}
              rows={4}
              placeholder={field.placeholder}
              value={values[field.name] || ''}
              onChange={(e) => handleChange(field.name, e.target.value)}
              onFocus={() => setFocused(field.name)}
              onBlur={() => setFocused(null)}
              className="w-full font-body text-sm rounded-xl px-4 py-3 resize-none placeholder-white/25"
              style={inputStyle(field.name)}
            />
          ) : field.type === 'select' ? (
            <select
              required={field.required}
              value={values[field.name] || ''}
              onChange={(e) => handleChange(field.name, e.target.value)}
              onFocus={() => setFocused(field.name)}
              onBlur={() => setFocused(null)}
              className="w-full font-body text-sm rounded-xl px-4 py-3"
              style={inputStyle(field.name)}
            >
              <option value="" disabled>Select an option</option>
              {field.options?.map((opt) => (
                <option key={opt} value={opt} style={{ color: '#050100' }}>{opt}</option>
              ))}
            </select>
          ) : (
            <input
              type={field.type}
              required={field.required}
              placeholder={field.placeholder}
              value={values[field.name] || ''}
              onChange={(e) => handleChange(field.name, e.target.value)}
              onFocus={() => setFocused(field.name)}
              onBlur={() => setFocused(null)}
              className="w-full font-body text-sm rounded-xl px-4 py-3 placeholder-white/25"
              style={inputStyle(field.name)}
            />
          )}
        </div>
      ))}

      {error && (
        <p className="font-body text-xs text-red-400 bg-red-950/30 px-3 py-2 rounded-lg">{error}</p>
      )}

      <motion.button
        type="submit"
        disabled={submitting}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full flex items-center justify-center gap-2 font-body font-bold text-sm py-4 rounded-full tracking-wide"
        style={{ background: accent, color: '#050100' }}
      >
        {submitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={15} />}
        {submitting ? 'Sending...' : 'Send Enquiry'}
      </motion.button>
    </form>
  );
}
