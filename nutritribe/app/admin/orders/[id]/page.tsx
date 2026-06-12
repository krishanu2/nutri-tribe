import { notFound } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/lib/db';
import { OrderStatus } from '@prisma/client';
import { ArrowLeft, MapPin, Phone, Mail, Package, Calendar, Hash } from 'lucide-react';
import StatusBadge from '../../_components/StatusBadge';
import StatusUpdatePanel from '../../_components/StatusUpdatePanel';

export const dynamic = 'force-dynamic';

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  const order = await db.order.findUnique({
    where: { id: params.id },
    include: { items: true },
  });

  if (!order) return notFound();

  return (
    <div className="p-8">
      {/* Back */}
      <Link href="/admin/orders"
        className="inline-flex items-center gap-2 font-body text-sm text-[#7d3627]/50 hover:text-[#f3a213] transition-colors mb-6">
        <ArrowLeft size={14} />
        Back to Orders
      </Link>

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="font-display font-bold text-3xl text-[#7d3627]">{order.orderId}</h1>
            <StatusBadge status={order.status as OrderStatus} />
          </div>
          <p className="font-body text-sm text-[#7d3627]/50">
            Placed on {new Date(order.createdAt).toLocaleString('en-IN', {
              day: 'numeric', month: 'long', year: 'numeric',
              hour: '2-digit', minute: '2-digit',
            })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT — order details */}
        <div className="lg:col-span-2 space-y-5">
          {/* Items */}
          <div className="bg-white rounded-2xl border border-[#7d3627]/8 overflow-hidden">
            <div className="px-6 py-4 border-b border-[#7d3627]/8 flex items-center gap-2">
              <Package size={15} className="text-[#7d3627]/50" />
              <h2 className="font-display font-bold text-lg text-[#7d3627]">Items Ordered</h2>
            </div>
            <div className="divide-y divide-[#7d3627]/5">
              {order.items.map(item => (
                <div key={item.id} className="flex items-center gap-4 px-6 py-4">
                  <div className="w-10 h-10 rounded-xl bg-[#f3a213]/10 flex items-center justify-center shrink-0">
                    <Package size={16} className="text-[#f3a213]" />
                  </div>
                  <div className="flex-1">
                    <p className="font-body font-semibold text-sm text-[#7d3627]">{item.name}</p>
                    <p className="font-body text-xs text-[#7d3627]/45">{item.weight} · Qty {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-display font-bold text-sm text-[#7d3627]">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                    <p className="font-body text-xs text-[#7d3627]/40">₹{item.price} each</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-6 py-4 bg-[#7d3627]/2 space-y-1.5 border-t border-[#7d3627]/6">
              <div className="flex justify-between font-body text-sm text-[#7d3627]/55">
                <span>Subtotal</span><span>₹{order.subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between font-body text-sm text-[#7d3627]/55">
                <span>Delivery</span>
                <span className={order.delivery === 0 ? 'text-[#009846] font-semibold' : ''}>
                  {order.delivery === 0 ? 'FREE' : `₹${order.delivery}`}
                </span>
              </div>
              <div className="flex justify-between font-display font-bold text-lg text-[#7d3627] pt-2 border-t border-[#7d3627]/10">
                <span>Total</span><span>₹{order.total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Customer details */}
          <div className="bg-white rounded-2xl border border-[#7d3627]/8 overflow-hidden">
            <div className="px-6 py-4 border-b border-[#7d3627]/8">
              <h2 className="font-display font-bold text-lg text-[#7d3627]">Customer</h2>
            </div>
            <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoRow icon={<Package size={14} />} label="Name"  value={order.customerName} />
              <InfoRow icon={<Mail    size={14} />} label="Email" value={order.email} />
              <InfoRow icon={<Phone   size={14} />} label="Phone" value={order.phone} />
              <InfoRow icon={<Hash    size={14} />} label="Pincode" value={order.pincode} />
              <div className="sm:col-span-2">
                <InfoRow
                  icon={<MapPin size={14} />}
                  label="Delivery Address"
                  value={`${order.address}, ${order.city}, ${order.state} — ${order.pincode}`}
                />
              </div>
            </div>
          </div>

          {/* Timestamps */}
          {(order.shippedAt || order.deliveredAt) && (
            <div className="bg-white rounded-2xl border border-[#7d3627]/8 overflow-hidden">
              <div className="px-6 py-4 border-b border-[#7d3627]/8 flex items-center gap-2">
                <Calendar size={14} className="text-[#7d3627]/50" />
                <h2 className="font-display font-bold text-lg text-[#7d3627]">Timeline</h2>
              </div>
              <div className="px-6 py-5 space-y-2">
                <InfoRow icon={<Calendar size={13} />} label="Order Placed"
                  value={new Date(order.createdAt).toLocaleString('en-IN')} />
                {order.shippedAt && (
                  <InfoRow icon={<Calendar size={13} />} label="Shipped"
                    value={new Date(order.shippedAt).toLocaleString('en-IN')} />
                )}
                {order.deliveredAt && (
                  <InfoRow icon={<Calendar size={13} />} label="Delivered"
                    value={new Date(order.deliveredAt).toLocaleString('en-IN')} />
                )}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT — status management */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <StatusUpdatePanel
              orderId={order.id}
              currentStatus={order.status as OrderStatus}
              trackingNumber={order.trackingNumber}
              adminNote={order.adminNote}
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
