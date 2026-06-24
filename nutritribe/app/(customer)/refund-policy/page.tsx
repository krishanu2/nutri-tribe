import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { db } from '@/lib/db';
import PolicyContent from '@/components/PolicyContent';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Return & Refund Policy — NutriTribe',
  description: 'Return and refund policy for NutriTribe orders.',
};

export default async function RefundPage() {
  const policy = await db.policy.findUnique({ where: { type: 'REFUND' } }).catch(() => null);

  return (
    <div className="min-h-screen bg-ivory-grain pt-28 pb-20">
      <div className="max-w-3xl mx-auto px-6">
        <Link href="/" className="inline-flex items-center gap-2 font-body text-sm text-earthen-rust/50 hover:text-sun-harvest transition-colors mb-8">
          <ArrowLeft size={14} /> Back to Home
        </Link>

        <div className="mb-10">
          <p className="font-body text-xs font-semibold tracking-widest uppercase text-sun-harvest mb-3">Legal</p>
          <h1 className="font-display font-bold text-4xl text-earthen-rust mb-2">{policy?.title ?? 'Return & Refund Policy'}</h1>
          {policy && (
            <p className="font-body text-sm text-earthen-rust/45">
              Last updated: {new Date(policy.lastUpdated).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          )}
        </div>

        {policy
          ? <PolicyContent content={policy.content} />
          : <p className="font-body text-sm text-earthen-rust/50">This page&apos;s content is being updated — please check back shortly.</p>}

        <LegalNav current="refund" />
      </div>
    </div>
  );
}

function LegalNav({ current }: { current: string }) {
  const links = [
    { href: '/terms-and-conditions', label: 'Terms & Conditions', key: 'terms' },
    { href: '/privacy-policy', label: 'Privacy Policy', key: 'privacy' },
    { href: '/shipping-policy', label: 'Shipping Policy', key: 'shipping' },
    { href: '/refund-policy', label: 'Refund Policy', key: 'refund' },
  ];
  return (
    <div className="mt-16 pt-8 border-t border-earthen-rust/10">
      <p className="font-body text-xs font-semibold tracking-widest uppercase text-earthen-rust/40 mb-4">Other Legal Pages</p>
      <div className="flex flex-wrap gap-3">
        {links.filter(l => l.key !== current).map(l => (
          <Link key={l.href} href={l.href}
            className="font-body text-xs font-semibold text-earthen-rust/60 hover:text-sun-harvest border border-earthen-rust/15 hover:border-sun-harvest/30 px-4 py-2 rounded-full transition-all">
            {l.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
