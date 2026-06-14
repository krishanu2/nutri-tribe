import { notFound } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/lib/db';
import { ArrowLeft, Package, User, Star, MessageSquare, Calendar } from 'lucide-react';
import ReviewStatusBadge from '../../_components/ReviewStatusBadge';
import ReviewStatusPanel from '../../_components/ReviewStatusPanel';

export const dynamic = 'force-dynamic';

export default async function ReviewDetailPage({ params }: { params: { id: string } }) {
  const review = await db.review.findUnique({ where: { id: params.id } });

  if (!review) return notFound();

  const product = await db.product.findUnique({ where: { slug: review.productSlug } }).catch(() => null);

  return (
    <div className="p-8">
      {/* Back */}
      <Link href="/admin/reviews"
        className="inline-flex items-center gap-2 font-body text-sm text-[#7d3627]/50 hover:text-[#f3a213] transition-colors mb-6">
        <ArrowLeft size={14} />
        Back to Reviews
      </Link>

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="font-display font-bold text-3xl text-[#7d3627]">{product?.name ?? review.productSlug}</h1>
            <ReviewStatusBadge status={review.status} />
          </div>
          <p className="font-body text-sm text-[#7d3627]/50">
            Submitted on {new Date(review.createdAt).toLocaleString('en-IN', {
              day: 'numeric', month: 'long', year: 'numeric',
              hour: '2-digit', minute: '2-digit',
            })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT — review details */}
        <div className="lg:col-span-2 space-y-5">
          {/* Reviewer */}
          <div className="bg-white rounded-2xl border border-[#7d3627]/8 overflow-hidden">
            <div className="px-6 py-4 border-b border-[#7d3627]/8">
              <h2 className="font-display font-bold text-lg text-[#7d3627]">Reviewer Details</h2>
            </div>
            <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoRow icon={<User size={14} />} label="Customer Name" value={review.customerName} />
              <InfoRow icon={<Package size={14} />} label="Product" value={product?.name ?? review.productSlug} />
              <div>
                <p className="font-body text-[10px] font-semibold tracking-widest uppercase text-[#7d3627]/40 mb-1 flex items-center gap-1.5">
                  <span className="text-[#7d3627]/35"><Star size={14} /></span>
                  Rating
                </p>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star key={idx} size={16} className={idx < review.rating ? 'fill-[#f3a213] text-[#f3a213]' : 'text-[#7d3627]/15'} />
                  ))}
                  <span className="font-body text-sm text-[#7d3627] ml-1">({review.rating}/5)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Comment */}
          <div className="bg-white rounded-2xl border border-[#7d3627]/8 overflow-hidden">
            <div className="px-6 py-4 border-b border-[#7d3627]/8 flex items-center gap-2">
              <MessageSquare size={15} className="text-[#7d3627]/50" />
              <h2 className="font-display font-bold text-lg text-[#7d3627]">Review Comment</h2>
            </div>
            <div className="px-6 py-5">
              <p className="font-body text-sm text-[#7d3627] whitespace-pre-line">{review.comment}</p>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-2xl border border-[#7d3627]/8 overflow-hidden">
            <div className="px-6 py-4 border-b border-[#7d3627]/8 flex items-center gap-2">
              <Calendar size={14} className="text-[#7d3627]/50" />
              <h2 className="font-display font-bold text-lg text-[#7d3627]">Timeline</h2>
            </div>
            <div className="px-6 py-5 space-y-2">
              <InfoRow icon={<Calendar size={13} />} label="Submitted"
                value={new Date(review.createdAt).toLocaleString('en-IN')} />
              <InfoRow icon={<Calendar size={13} />} label="Last Updated"
                value={new Date(review.updatedAt).toLocaleString('en-IN')} />
            </div>
          </div>
        </div>

        {/* RIGHT — status management */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <ReviewStatusPanel
              reviewId={review.id}
              currentStatus={review.status}
              adminNote={review.adminNote}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div>
      <p className="font-body text-[10px] font-semibold tracking-widest uppercase text-[#7d3627]/40 mb-1 flex items-center gap-1.5">
        <span className="text-[#7d3627]/35">{icon}</span>
        {label}
      </p>
      <p className="font-body text-sm text-[#7d3627]">{value}</p>
    </div>
  );
}
