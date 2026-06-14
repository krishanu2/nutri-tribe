import { notFound } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/lib/db';
import { ArrowLeft } from 'lucide-react';
import CouponForm from '../../_components/CouponForm';

export const dynamic = 'force-dynamic';

export default async function EditCouponPage({ params }: { params: { id: string } }) {
  const coupon = await db.coupon.findUnique({ where: { id: params.id } });
  if (!coupon) return notFound();

  return (
    <div className="p-8">
      <Link href="/admin/coupons"
        className="inline-flex items-center gap-2 font-body text-sm text-[#7d3627]/50 hover:text-[#f3a213] transition-colors mb-6">
        <ArrowLeft size={14} />
        Back to Coupons
      </Link>

      <h1 className="font-display font-bold text-3xl text-[#7d3627] mb-6">Edit Coupon</h1>

      <CouponForm coupon={coupon} />
    </div>
  );
}
