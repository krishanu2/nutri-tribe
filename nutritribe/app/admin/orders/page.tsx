import { db } from '@/lib/db';
import { OrderStatus } from '@prisma/client';
import Link from 'next/link';
import StatusBadge from '../_components/StatusBadge';
import { Package } from 'lucide-react';

const TABS: { label: string; value: string }[] = [
  { label: 'All',        value: '' },
  { label: 'Pending',    value: 'PENDING' },
  { label: 'Confirmed',  value: 'CONFIRMED' },
  { label: 'Processing', value: 'PROCESSING' },
  { label: 'Shipped',    value: 'SHIPPED' },
  { label: 'Delivered',  value: 'DELIVERED' },
  { label: 'Cancelled',  value: 'CANCELLED' },
];

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: { status?: string; page?: string };
}

export default async function OrdersPage({ searchParams }: PageProps) {
  const statusFilter = (searchParams.status ?? '') as OrderStatus | '';
  const page   = Math.max(1, parseInt(searchParams.page ?? '1'));
  const limit  = 20;

  const where = statusFilter ? { status: statusFilter } : {};

  const [orders, total] = await db.$transaction([
    db.order.findMany({
      where,
      select: {
        id: true, orderId: true, createdAt: true,
        customerName: true, city: true, state: true,
        total: true, status: true, trackingNumber: true,
        _count: { select: { items: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.order.count({ where }),
  ]);

  const pages = Math.ceil(total / limit);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-display font-bold text-3xl text-[#7d3627]">Orders</h1>
        <p className="font-body text-sm text-[#7d3627]/50 mt-1">{total} total order{total !== 1 ? 's' : ''}</p>
      </div>

      {/* Status filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {TABS.map(tab => {
          const active = statusFilter === tab.value;
          return (
            <Link
              key={tab.value}
              href={tab.value ? `/admin/orders?status=${tab.value}` : '/admin/orders'}
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
        {orders.length === 0 ? (
          <div className="py-20 text-center">
            <Package size={44} className="text-[#7d3627]/15 mx-auto mb-3" />
            <p className="font-body text-sm text-[#7d3627]/40">No orders found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#7d3627]/6 bg-[#7d3627]/2">
                  {['Order ID', 'Customer', 'Location', 'Items', 'Total', 'Status', 'Tracking', 'Date', 'Action'].map(h => (
                    <th key={h} className="px-5 py-3 text-left font-body text-[11px] font-semibold tracking-widest uppercase text-[#7d3627]/40">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map((o, i) => (
                  <tr key={o.id}
                    className={`border-b border-[#7d3627]/5 hover:bg-[#f3a213]/4 transition-colors ${
                      i === orders.length - 1 ? 'border-b-0' : ''
                    }`}
                  >
                    <td className="px-5 py-3.5 font-body font-bold text-xs text-[#7d3627] whitespace-nowrap">
                      {o.orderId}
                    </td>
                    <td className="px-5 py-3.5 font-body text-sm text-[#7d3627] whitespace-nowrap">
                      {o.customerName}
                    </td>
                    <td className="px-5 py-3.5 font-body text-xs text-[#7d3627]/55 whitespace-nowrap">
                      {o.city}, {o.state}
                    </td>
                    <td className="px-5 py-3.5 font-body text-sm text-[#7d3627]/70 text-center">
                      {o._count.items}
                    </td>
                    <td className="px-5 py-3.5 font-display font-bold text-sm text-[#7d3627] whitespace-nowrap">
                      ₹{o.total.toLocaleString('en-IN')}
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={o.status as OrderStatus} />
                    </td>
                    <td className="px-5 py-3.5 font-body text-xs text-[#7d3627]/50 whitespace-nowrap max-w-[140px] truncate">
                      {o.trackingNumber ?? '—'}
                    </td>
                    <td className="px-5 py-3.5 font-body text-xs text-[#7d3627]/45 whitespace-nowrap">
                      {new Date(o.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-5 py-3.5">
                      <Link href={`/admin/orders/${o.id}`}
                        className="inline-flex items-center gap-1 font-body text-xs font-semibold text-[#f3a213] hover:underline whitespace-nowrap">
                        Manage →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="font-body text-xs text-[#7d3627]/45">
            Page {page} of {pages} · {total} orders
          </p>
          <div className="flex gap-2">
            {page > 1 && (
              <Link
                href={`/admin/orders?${statusFilter ? `status=${statusFilter}&` : ''}page=${page - 1}`}
                className="font-body text-xs font-semibold px-4 py-2 rounded-lg bg-white border border-[#7d3627]/12 text-[#7d3627]/70 hover:border-[#f3a213]/40 transition-all"
              >
                ← Prev
              </Link>
            )}
            {page < pages && (
              <Link
                href={`/admin/orders?${statusFilter ? `status=${statusFilter}&` : ''}page=${page + 1}`}
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
