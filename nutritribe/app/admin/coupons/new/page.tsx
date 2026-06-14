import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import CouponForm from '../../_components/CouponForm';

export default function NewCouponPage() {
  return (
    <div className="p-8">
      <Link href="/admin/coupons"
        className="inline-flex items-center gap-2 font-body text-sm text-[#7d3627]/50 hover:text-[#f3a213] transition-colors mb-6">
        <ArrowLeft size={14} />
        Back to Coupons
      </Link>

      <h1 className="font-display font-bold text-3xl text-[#7d3627] mb-6">New Coupon</h1>

      <CouponForm />
    </div>
  );
}
