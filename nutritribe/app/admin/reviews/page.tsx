import { db } from '@/lib/db';
import { ReviewStatus } from '@prisma/client';
import Link from 'next/link';
import ReviewStatusBadge from '../_components/ReviewStatusBadge';
import { Star, MessageSquare } from 'lucide-react';

const STATUS_TABS: { label: string; value: string }[] = [
  { label: 'All',      value: '' },
  { label: 'Pending',  value: 'PENDING' },
  { label: 'Approved', value: 'APPROVED' },
  { label: 'Rejected', value: 'REJECTED' },
];

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: { status?: string; page?: string };
}

export default async function ReviewsPage({ searchParams }: PageProps) {
  const statusFilter = (searchParams.status ?? '') as ReviewStatus | '';
  const page  = Math.max(1, parseInt(searchParams.page ?? '1'));
  const limit = 20;

  const where = {
    ...(statusFilter ? { status: statusFilter } : {}),
  };

  const [reviews, total] = await db.$transaction([
    db.review.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.review.count({ where }),
  ]);

  const pages = Math.ceil(total / limit);

  const productSlugs = Array.from(new Set(reviews.map((r) => r.productSlug)));
  const productsBySlug = new Map(
    (await db.product.findMany({ where: { slug: { in: productSlugs } } }).catch(() => []))
      .map((p) => [p.slug, p])
  );

  const buildHref = (overrides: { status?: string; page?: number }) => {
    const params = new URLSearchParams();
    const s = overrides.status !== undefined ? overrides.status : statusFilter;
    const p = overrides.page ?? page;
    if (s) params.set('status', s);
    if (p > 1) params.set('page', String(p));
    const qs = params.toString();
    return `/admin/reviews${qs ? `?${qs}` : ''}`;
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-display font-bold text-3xl text-[#7d3627]">Reviews</h1>
        <p className="font-body text-sm text-[#7d3627]/50 mt-1">{total} total review{total !== 1 ? 's' : ''}</p>
      </div>

      {/* Status filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {STATUS_TABS.map(tab => {
          const active = statusFilter === tab.value;
          return (
            <Link
              key={tab.value}
              href={buildHref({ status: tab.value, page: 1 })}
              className={`font-body font-semibold text-xs px-4 py-2 rounded-full transition-all ${
                active
                  ? 'bg-[#f3a213] text-[#050100]'
                  : 'bg-white text-[#7d3627]/60 border border-[#7d3627]/12 hover:border-[#f3a213]/40'
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#7d3627]/8 overflow-hidden">
        {reviews.length === 0 ? (
          <div className="py-20 text-center">
            <MessageSquare size={44} className="text-[#7d3627]/15 mx-auto mb-3" />
            <p className="font-body text-sm text-[#7d3627]/40">No reviews found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#7d3627]/6 bg-[#7d3627]/2">
                  {['Product', 'Customer', 'Rating', 'Comment', 'Status', 'Date', 'Action'].map(h => (
                    <th key={h} className="px-5 py-3 text-left font-body text-[11px] font-semibold tracking-widest uppercase text-[#7d3627]/40">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {reviews.map((r, i) => {
                  const product = productsBySlug.get(r.productSlug);
                  return (
                    <tr key={r.id}
                      className={`border-b border-[#7d3627]/5 hover:bg-[#f3a213]/4 transition-colors ${
                        i === reviews.length - 1 ? 'border-b-0' : ''
                      }`}
                    >
                      <td className="px-5 py-3.5 font-body font-bold text-xs text-[#7d3627] whitespace-nowrap">
                        {product?.name ?? r.productSlug}
                      </td>
                      <td className="px-5 py-3.5 font-body text-sm text-[#7d3627] whitespace-nowrap">
                        {r.customerName}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, idx) => (
                            <Star key={idx} size={12} className={idx < r.rating ? 'fill-[#f3a213] text-[#f3a213]' : 'text-[#7d3627]/15'} />
                          ))}
                        </div>
                      </td>
                      <td className="px-5 py-3.5 font-body text-xs text-[#7d3627]/55 max-w-xs truncate">
                        {r.comment}
                      </td>
                      <td className="px-5 py-3.5">
                        <ReviewStatusBadge status={r.status} />
                      </td>
                      <td className="px-5 py-3.5 font-body text-xs text-[#7d3627]/45 whitespace-nowrap">
                        {new Date(r.createdAt).toLocaleDateString('en-IN')}
                      </td>
                      <td className="px-5 py-3.5">
                        <Link href={`/admin/reviews/${r.id}`}
                          className="inline-flex items-center gap-1 font-body text-xs font-semibold text-[#f3a213] hover:underline whitespace-nowrap">
                          Manage →
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

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="font-body text-xs text-[#7d3627]/45">
            Page {page} of {pages} · {total} reviews
          </p>
          <div className="flex gap-2">
            {page > 1 && (
              <Link
                href={buildHref({ page: page - 1 })}
                className="font-body text-xs font-semibold px-4 py-2 rounded-lg bg-white border border-[#7d3627]/12 text-[#7d3627]/70 hover:border-[#f3a213]/40 transition-all"
              >
                ← Prev
              </Link>
            )}
            {page < pages && (
              <Link
                href={buildHref({ page: page + 1 })}
                className="font-body text-xs font-semibold px-4 py-2 rounded-lg bg-[#f3a213] text-[#050100] hover:brightness-110 transition-all"
              >
                Next →
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
