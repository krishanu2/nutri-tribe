import { db } from '@/lib/db';
import Link from 'next/link';
import Image from 'next/image';
import { TrendingUp, ShoppingBag, Package, AlertTriangle } from 'lucide-react';
import StatsCard from '../_components/StatsCard';
import StockBadge from '@/components/ui/StockBadge';
import { getStockStatus } from '@/lib/products';
import { RevenueTrendChart, OrderVolumeChart, TopProductsChart, DailyPoint, TopProduct } from './AnalyticsCharts';

export const dynamic = 'force-dynamic';

const DAYS = 30;

function formatDay(d: Date) {
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export default async function AnalyticsPage() {
  const start = new Date();
  start.setDate(start.getDate() - (DAYS - 1));
  start.setHours(0, 0, 0, 0);

  const [orders, topProductsRaw, products] = await Promise.all([
    db.order.findMany({
      where: { createdAt: { gte: start } },
      select: { createdAt: true, total: true },
    }).catch(() => []),
    db.orderItem.groupBy({
      by: ['productId', 'name'],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 5,
    }).catch(() => []),
    db.product.findMany({
      select: { id: true, slug: true, name: true, image: true, stockQuantity: true, lowStockThreshold: true },
    }).catch(() => []),
  ]);

  // Build a 30-day series, defaulting every day to zero, then fill from orders
  const series = new Map<string, DailyPoint>();
  for (let i = 0; i < DAYS; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    const key = formatDay(d);
    series.set(key, { date: key, revenue: 0, orders: 0 });
  }
  for (const o of orders) {
    const key = formatDay(new Date(o.createdAt));
    const point = series.get(key);
    if (point) {
      point.revenue += o.total;
      point.orders += 1;
    }
  }
  const dailyData = Array.from(series.values());

  const topProducts: TopProduct[] = topProductsRaw.map((p) => ({
    name: p.name,
    quantity: p._sum.quantity ?? 0,
  }));

  const lowStock = products
    .filter((p) => p.stockQuantity <= p.lowStockThreshold)
    .sort((a, b) => a.stockQuantity - b.stockQuantity);

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = orders.length;
  const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display font-bold text-3xl text-[#7d3627]">Sales Analytics</h1>
        <p className="font-body text-sm text-[#7d3627]/50 mt-1">
          Last {DAYS} days · {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatsCard
          label="Revenue (30 days)"
          value={`₹${totalRevenue.toLocaleString('en-IN')}`}
          sub="Total sales"
          accent="#f3a213"
          icon={<TrendingUp size={20} />}
        />
        <StatsCard
          label="Orders (30 days)"
          value={totalOrders}
          sub="Total placed"
          accent="#009846"
          icon={<ShoppingBag size={20} />}
        />
        <StatsCard
          label="Avg Order Value"
          value={`₹${avgOrderValue.toLocaleString('en-IN')}`}
          sub="Per order"
          accent="#7a4dff"
          icon={<Package size={20} />}
        />
      </div>

      {totalOrders === 0 ? (
        <div className="bg-white rounded-2xl border border-[#7d3627]/8 py-20 text-center mb-8">
          <TrendingUp size={40} className="text-[#7d3627]/15 mx-auto mb-3" />
          <p className="font-body text-sm text-[#7d3627]/40">No orders in the last {DAYS} days yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl border border-[#7d3627]/8 p-6">
            <h2 className="font-display font-bold text-lg text-[#7d3627] mb-4">Revenue Trend</h2>
            <RevenueTrendChart data={dailyData} />
          </div>
          <div className="bg-white rounded-2xl border border-[#7d3627]/8 p-6">
            <h2 className="font-display font-bold text-lg text-[#7d3627] mb-4">Order Volume</h2>
            <OrderVolumeChart data={dailyData} />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top-selling products */}
        <div className="bg-white rounded-2xl border border-[#7d3627]/8 p-6">
          <h2 className="font-display font-bold text-lg text-[#7d3627] mb-4">Top-Selling Products</h2>
          {topProducts.length === 0 ? (
            <p className="font-body text-sm text-[#7d3627]/40 text-center py-12">No sales data yet</p>
          ) : (
            <TopProductsChart data={topProducts} />
          )}
        </div>

        {/* Low stock table */}
        <div className="bg-white rounded-2xl border border-[#7d3627]/8 overflow-hidden">
          <div className="px-6 py-4 border-b border-[#7d3627]/8 flex items-center justify-between">
            <h2 className="font-display font-bold text-lg text-[#7d3627] flex items-center gap-2">
              <AlertTriangle size={16} className="text-red-500" />
              Low Stock
            </h2>
            <Link href="/admin/products?status=low-stock"
              className="font-body text-xs font-semibold text-[#f3a213] hover:underline">
              View all →
            </Link>
          </div>
          {lowStock.length === 0 ? (
            <p className="font-body text-sm text-[#7d3627]/40 text-center py-12">Everything is well stocked</p>
          ) : (
            <div className="divide-y divide-[#7d3627]/5 max-h-[280px] overflow-y-auto">
              {lowStock.map((p) => {
                const stock = getStockStatus(p.stockQuantity, p.lowStockThreshold);
                return (
                  <Link key={p.id} href={`/admin/products/${p.id}`}
                    className="flex items-center gap-3 px-6 py-3 hover:bg-[#f3a213]/4 transition-colors">
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-[#7d3627]/5 shrink-0">
                      <Image src={p.image} alt={p.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-body font-bold text-sm text-[#7d3627] truncate">{p.name}</p>
                      <StockBadge stock={stock} />
                    </div>
                    <span className="font-display font-bold text-sm text-[#7d3627]/70">{p.stockQuantity} left</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
