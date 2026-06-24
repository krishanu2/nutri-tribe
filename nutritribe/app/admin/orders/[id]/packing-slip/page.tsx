import { notFound } from 'next/navigation';
import Image from 'next/image';
import { db } from '@/lib/db';
import PackingSlipActions from './PackingSlipActions';

export const dynamic = 'force-dynamic';

export default async function PackingSlipPage({ params }: { params: { id: string } }) {
  const order = await db.order.findUnique({
    where: { id: params.id },
    include: { items: true },
  });

  if (!order) return notFound();

  const totalItems = order.items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="p-8 print:p-0 max-w-3xl">
      <PackingSlipActions orderDbId={order.id} />

      <div className="bg-white border border-[#7d3627]/10 rounded-2xl print:border-0 print:rounded-none p-10 print:p-12">
        {/* Letterhead */}
        <div className="flex items-center justify-between pb-6 border-b-2 border-[#7d3627]/10">
          <div className="relative" style={{ width: 160, height: 44 }}>
            <Image src="/logo.png" alt="NutriTribe" fill className="object-contain object-left" />
          </div>
          <div className="text-right">
            <p className="font-display font-bold text-2xl text-[#7d3627]">Packing Slip</p>
            <p className="font-body text-xs text-[#7d3627]/50 mt-1">
              {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-6 mb-6">
          <div>
            <p className="font-body text-[10px] font-semibold tracking-widest uppercase text-[#7d3627]/40">Order ID</p>
            <p className="font-body font-bold text-base text-[#7d3627] tracking-widest">{order.orderId}</p>
          </div>
          <div className="text-right">
            <p className="font-body text-[10px] font-semibold tracking-widest uppercase text-[#7d3627]/40">Items</p>
            <p className="font-body font-bold text-base text-[#7d3627]">{totalItems} pcs</p>
          </div>
        </div>

        {/* Gift banner */}
        {order.giftNote && (
          <div className="mb-6 bg-[#fff8ec] border border-[#f3a213]/30 rounded-xl p-4">
            <p className="font-body font-bold text-xs tracking-widest uppercase text-[#f3a213] mb-1.5">🎁 Gift Order</p>
            <p className="font-body text-sm text-[#7d3627]/75 italic leading-relaxed">&ldquo;{order.giftNote}&rdquo;</p>
          </div>
        )}

        {/* Ship to */}
        <div className="mb-6">
          <p className="font-body text-[10px] font-semibold tracking-widest uppercase text-[#7d3627]/40 mb-2">Ship To</p>
          <p className="font-body font-bold text-sm text-[#7d3627]">{order.customerName}</p>
          <p className="font-body text-sm text-[#7d3627]/70 leading-relaxed mt-1">
            {order.address}<br />
            {order.city}, {order.state} — {order.pincode}
          </p>
          <p className="font-body text-sm text-[#7d3627]/70 mt-1">Phone: {order.phone}</p>
        </div>

        {/* Items table — no prices, this is a packing slip not an invoice */}
        <table className="w-full mb-8">
          <thead>
            <tr className="border-b border-[#7d3627]/15">
              <th className="text-left font-body text-[10px] font-semibold tracking-widest uppercase text-[#7d3627]/40 py-2">Item</th>
              <th className="text-left font-body text-[10px] font-semibold tracking-widest uppercase text-[#7d3627]/40 py-2">Variant</th>
              <th className="text-right font-body text-[10px] font-semibold tracking-widest uppercase text-[#7d3627]/40 py-2">Qty</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map(item => (
              <tr key={item.id} className="border-b border-[#7d3627]/6">
                <td className="font-body text-sm text-[#7d3627] py-2.5">{item.name}</td>
                <td className="font-body text-sm text-[#7d3627]/60 py-2.5">{item.weight}</td>
                <td className="font-body font-semibold text-sm text-[#7d3627] py-2.5 text-right">{item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Tracking + footer */}
        <div className="flex items-end justify-between pt-6 border-t border-[#7d3627]/10">
          <div>
            <p className="font-body text-[10px] font-semibold tracking-widest uppercase text-[#7d3627]/40 mb-1">Tracking Number</p>
            <p className="font-body font-bold text-sm text-[#7d3627] tracking-wide" style={{ minWidth: 160, borderBottom: order.trackingNumber ? 'none' : '1px solid rgba(125,54,39,0.25)' }}>
              {order.trackingNumber || ' '}
            </p>
          </div>
          <p className="font-display italic text-sm text-[#7d3627]/50">Thank you for choosing NutriTribe.</p>
        </div>
      </div>
    </div>
  );
}
