import { db } from '@/lib/db';
import Link from 'next/link';
import { FileText, ChevronRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

const POLICY_TYPES = [
  { type: 'PRIVACY', fallbackTitle: 'Privacy Policy', desc: 'How customer data is collected, used, and protected.' },
  { type: 'TERMS', fallbackTitle: 'Terms & Conditions', desc: 'The agreement customers accept by using the site.' },
  { type: 'REFUND', fallbackTitle: 'Return & Refund Policy', desc: 'Cancellation window and how returns are handled.' },
  { type: 'SHIPPING', fallbackTitle: 'Shipping & Delivery Policy', desc: 'Delivery timelines, pickup, and shipping options.' },
] as const;

export default async function AdminPoliciesPage() {
  const policies = await db.policy.findMany();
  const byType = new Map(policies.map(p => [p.type, p]));

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-display font-bold text-3xl text-[#7d3627]">Legal Policies</h1>
        <p className="font-body text-sm text-[#7d3627]/50 mt-1">
          Edit the content shown on your Privacy Policy, Terms, Refund, and Shipping pages — no code changes needed.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {POLICY_TYPES.map(({ type, fallbackTitle, desc }) => {
          const policy = byType.get(type);
          return (
            <Link
              key={type}
              href={`/admin/policies/${type.toLowerCase()}`}
              className="group bg-white rounded-2xl border border-[#7d3627]/8 p-5 flex items-start gap-4 hover:border-[#f3a213]/40 transition-all"
            >
              <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(243,162,19,0.12)' }}>
                <FileText size={18} className="text-[#f3a213]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-display font-bold text-base text-[#7d3627]">{policy?.title ?? fallbackTitle}</p>
                <p className="font-body text-xs text-[#7d3627]/50 mt-1 leading-relaxed">{desc}</p>
                <p className="font-body text-[11px] text-[#7d3627]/35 mt-2">
                  {policy
                    ? `Last updated ${new Date(policy.lastUpdated).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`
                    : 'Not yet created'}
                </p>
              </div>
              <ChevronRight size={16} className="text-[#7d3627]/25 group-hover:text-[#f3a213] transition-colors shrink-0 mt-1" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
