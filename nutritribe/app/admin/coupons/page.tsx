import { db } from '@/lib/db';
import Link from 'next/link';
import { Tag, Plus } from 'lucide-react';

export const dynamic = 'force-dynamic';

function isExpired(expiresAt: Date | null) {
  return !!expiresAt && new Date(expiresAt) < new Date();
}

export default async function AdminCouponsPage() {
  const coupons = await db.coupon.findMany({ orderBy: { createdAt: 'desc' } });

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display font-bold text-3xl text-[#7d3627]">Coupons</h1>
          <p className="font-body text-sm text-[#7d3627]/50 mt-1">{coupons.length} coupon{coupons.length !== 1 ? 's' : ''}</p>
        </div>
        <Link
          href="/admin/coupons/new"
          className="inline-flex items-center gap-2 font-body font-semibold text-sm px-4 py-2.5 rounded-xl bg-[#f3a213] text-[#050100] hover:brightness-110 transition-all"
        >
          <Plus size={15} />
          New Coupon
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#7d3627]/8 overflow-hidden">
        {coupons.length === 0 ? (
          <div className="py-20 text-center">
            <Tag size={44} className="text-[#7d3627]/15 mx-auto mb-3" />
            <p className="font-body text-sm text-[#7d3627]/40">No coupons yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#7d3627]/6 bg-[#7d3627]/2">
                  {['Code', 'Discount', 'Min. Order', 'Usage', 'Expires', 'Status', 'Action'].map(h => (
                    <th key={h} className="px-5 py-3 text-left font-body text-[11px] font-semibold tracking-widest uppercase text-[#7d3627]/40">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {coupons.map((c, i) => {
                  const expired = isExpired(c.expiresAt);
                  const isActive = c.active && !expired;
                  return (
                    <tr key={c.id}
                      className={`border-b border-[#7d3627]/5 hover:bg-[#f3a213]/4 transition-colors ${
                        i === coupons.length - 1 ? 'border-b-0' : ''
                      }`}
                    >
                      <td className="px-5 py-3.5 font-body font-bold text-xs tracking-widest text-[#7d3627] whitespace-nowrap">
                        {c.code}
                      </td>
                      <td className="px-5 py-3.5 font-display font-bold text-sm text-[#7d3627] whitespace-nowrap">
                        {c.type === 'PERCENT' ? `${c.value}% off` : `₹${c.value} off`}
                      </td>
                      <td className="px-5 py-3.5 font-body text-xs text-[#7d3627]/55 whitespace-nowrap">
                        {c.minOrderValue > 0 ? `₹${c.minOrderValue}+` : '—'}
                      </td>
                      <td className="px-5 py-3.5 font-body text-xs text-[#7d3627]/55 whitespace-nowrap">
                        {c.usedCount}{c.maxUses != null ? ` / ${c.maxUses}` : ''}
                      </td>
                      <td className="px-5 py-3.5 font-body text-xs text-[#7d3627]/45 whitespace-nowrap">
                        {c.expiresAt ? new Date(c.expiresAt).toLocaleDateString('en-IN') : 'Never'}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 font-body font-semibold text-xs ${
                          isActive ? 'text-[#009846]' : 'text-[#7d3627]/45'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-[#009846]' : 'bg-[#7d3627]/30'}`} />
                          {expired ? 'Expired' : isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <Link href={`/admin/coupons/${c.id}`}
                          className="inline-flex items-center gap-1 font-body text-xs font-semibold text-[#f3a213] hover:underline whitespace-nowrap">
                          Edit →
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
