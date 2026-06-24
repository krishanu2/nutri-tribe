import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { db } from '@/lib/db';
import { PolicyType } from '@prisma/client';
import PolicyForm from '../../_components/PolicyForm';

export const dynamic = 'force-dynamic';

const FALLBACK_TITLES: Record<string, string> = {
  PRIVACY: 'Privacy Policy',
  TERMS: 'Terms & Conditions',
  REFUND: 'Return & Refund Policy',
  SHIPPING: 'Shipping & Delivery Policy',
};

export default async function EditPolicyPage({ params }: { params: { type: string } }) {
  const type = params.type.toUpperCase();
  if (!(Object.values(PolicyType) as string[]).includes(type)) return notFound();

  const policy = await db.policy.findUnique({ where: { type: type as PolicyType } });

  return (
    <div className="p-8 max-w-3xl">
      <Link href="/admin/policies"
        className="inline-flex items-center gap-2 font-body text-sm text-[#7d3627]/50 hover:text-[#f3a213] transition-colors mb-6">
        <ArrowLeft size={14} />
        Back to Policies
      </Link>

      <h1 className="font-display font-bold text-3xl text-[#7d3627] mb-6">
        Edit {policy?.title ?? FALLBACK_TITLES[type]}
      </h1>

      <PolicyForm type={params.type.toLowerCase()} policy={policy} fallbackTitle={FALLBACK_TITLES[type]} />
    </div>
  );
}
