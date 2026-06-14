import { db } from '@/lib/db';
import { Package, TrendingUp, Clock, Truck, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import StatsCard from './_components/StatsCard';
import StatusBadge from './_components/StatusBadge';
import { OrderStatus } from '@prisma/client';

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const [
    totalOrders,
    pendingCount,
    shippedToday,
    todayRevenue,
    recentOrders,
    products,
  ] = await Promise.all([
    db.order.count(),
    db.order.count({ where: { status: 'PENDING' } }),
    db.order.count({ where: { status: 'SHIPPED', shippedAt: { gte: startOfToday() } } }),
    db.order.aggregate({ _sum: { total: true }, where: { createdAt: { gte: startOfToday() } } }),
    db.order.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true, orderId: true, createdAt: true,
        customerName: true, city: true, state: true, total: true, status: true,
        _count: { select: { items: true } },
      },
    }),
    db.product.findMany({ select: { stockQuantity: true, lowStockThreshold: true } }),
  ]);

  const revenue = todayRevenue._sum.total ?? 0;
  const lowStockCount = products.filter(p => p.stockQuantity <= p.lowStockThreshold).length;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="font-display font-bold text-3xl text-[#7d3627]">Dashboard</h1>
          <p className="font-body text-sm text-[#7d3627]/50 mt-1">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <Link href="/admin/analytics"
          className="font-body text-xs font-semibold text-[#f3a213] hover:underline whitespace-nowrap">
          View Sales Analytics →
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-5 gap-4 mb-10">
        <StatsCard
          label="Total Orders"
          value={totalOrders}
          sub="All time"
          accent="#7d3627"
          icon={<Package size={20} />}
        />
        <StatsCard
          label="Today's Revenue"
          value={`₹${revenue.toLocaleString('en-IN')}`}
          sub="Since midnight"
          accent="#f3a213"
          icon={<TrendingUp size={20} />}
        />
        <StatsCard
          label="Pending Orders"
          value={pendingCount}
          sub={pendingCount > 0 ? 'Need attention' : 'All clear!'}
          accent="#d97706"
          icon={<Clock size={20} />}
        />
        <StatsCard
          label="Shipped Today"
          value={shippedToday}
          sub="Dispatched"
          accent="#009846"
          icon={<Truck size={20} />}
        />
        <Link href="/admin/products?status=low-stock">
          <StatsCard
            label="Low Stock"
            value={lowStockCount}
            sub={lowStockCount > 0 ? 'Restock needed' : 'All stocked up'}
            accent="#dc2626"
            icon={<AlertTriangle size={20} />}
          />
        </Link>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl border border-[#7d3627]/8 overflow-hidden">
        <div className="px-6 py-4 border-b border-[#7d3627]/8 flex items-center justify-between">
          <h2 className="font-display font-bold text-lg text-[#7d3627]">Recent Orders</h2>
          <Link href="/admin/orders"
            className="font-body text-xs font-semibold text-[#f3a213] hover:underline">
            View all →
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <Package size={40} className="text-[#7d3627]/15 mx-auto mb-3" />
            <p className="font-body text-sm text-[#7d3627]/40">No orders yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#7d3627]/6">
                  {['Order ID', 'Customer', 'Location', 'Items', 'Total', 'Status', 'Date', ''].map(h => (
                    <th key={h} className="px-5 py-3 text-left font-body text-[11px] font-semibold tracking-widest uppercase text-[#7d3627]/40">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o, i) => (
                  <tr key={o.id} className={`border-b border-[#7d3627]/5 hover:bg-[#7d3627]/2 transition-colors ${i === recentOrders.length - 1 ? 'border-b-0' : ''}`}>
                    <td className="px-5 py-3.5 font-body font-bold text-xs text-[#7d3627] whitespace-nowrap">
                      {o.orderId}
                    </td>
                    <td className="px-5 py-3.5 font-body text-sm text-[#7d3627]">
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
                    <td className="px-5 py-3.5 font-body text-xs text-[#7d3627]/45 whitespace-nowrap">
                      {new Date(o.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-5 py-3.5">
                      <Link href={`/admin/orders/${o.id}`}
                        className="font-body text-xs font-semibold text-[#f3a213] hover:underline whitespace-nowrap">
                        View →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
