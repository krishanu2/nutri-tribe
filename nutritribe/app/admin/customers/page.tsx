import { db } from '@/lib/db';
import Link from 'next/link';
import { Users, TrendingUp, ShoppingBag, MapPin } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Customers — NutriTribe Admin' };

async function getCustomers() {
  const orders = await db.order.findMany({
    select: {
      email: true,
      customerName: true,
      phone: true,
      city: true,
      state: true,
      total: true,
      createdAt: true,
      orderId: true,
      status: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  const map = new Map<string, {
    email: string;
    name: string;
    phone: string;
    city: string;
    state: string;
    orderCount: number;
    totalSpend: number;
    lastOrderAt: Date;
    lastOrderId: string;
  }>();

  for (const o of orders) {
    if (!map.has(o.email)) {
      map.set(o.email, {
        email: o.email,
        name: o.customerName,
        phone: o.phone,
        city: o.city,
        state: o.state,
        orderCount: 1,
        totalSpend: o.total,
        lastOrderAt: o.createdAt,
        lastOrderId: o.orderId,
      });
    } else {
      map.get(o.email)!.orderCount += 1;
      map.get(o.email)!.totalSpend += o.total;
    }
  }

  return Array.from(map.values()).sort((a, b) => b.totalSpend - a.totalSpend);
}

export default async function CustomersPage() {
  const customers = await getCustomers();

  const totalRevenue = customers.reduce((s, c) => s + c.totalSpend, 0);
  const repeatBuyers = customers.filter(c => c.orderCount > 1).length;
  const topCity = (() => {
    const freq: Record<string, number> = {};
    customers.forEach(c => { freq[c.city] = (freq[c.city] || 0) + 1; });
    return Object.entries(freq).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—';
  })();

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display font-bold text-3xl text-[#7d3627]">Customers</h1>
        <p className="font-body text-sm text-[#7d3627]/50 mt-1">
          {customers.length} unique customers across all orders
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total Customers', value: customers.length, icon: Users, color: '#f3a213' },
          { label: 'Repeat Buyers', value: repeatBuyers, icon: TrendingUp, color: '#009846' },
          { label: 'Top City', value: topCity, icon: MapPin, color: '#7a4dff' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl border border-[#7d3627]/8 p-5 flex items-center gap-4 shadow-sm">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: `${color}18` }}>
              <Icon size={18} style={{ color }} />
            </div>
            <div>
              <p className="font-display font-bold text-2xl text-[#7d3627] leading-none">{value}</p>
              <p className="font-body text-xs font-semibold tracking-widest uppercase text-[#7d3627]/50 mt-1">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#7d3627]/8 overflow-hidden">
        <div className="px-6 py-4 flex items-center justify-between border-b border-[#7d3627]/6 bg-[#7d3627]/2">
          <h2 className="font-body font-semibold text-sm text-[#7d3627]">All Customers</h2>
          <span className="font-body text-xs text-[#7d3627]/45">
            Total revenue: ₹{totalRevenue.toLocaleString('en-IN')}
          </span>
        </div>

        {customers.length === 0 ? (
          <div className="py-20 text-center">
            <Users size={32} className="text-[#7d3627]/15 mx-auto mb-3" />
            <p className="font-body text-sm text-[#7d3627]/40">No customers yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#7d3627]/6 bg-[#7d3627]/2">
                  {['Customer', 'Contact', 'Location', 'Orders', 'Lifetime Value', 'Last Order'].map(h => (
                    <th key={h} className="px-6 py-3 text-left font-body text-[11px] font-semibold tracking-widest uppercase text-[#7d3627]/40">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {customers.map((c, i) => (
                  <tr key={c.email}
                    className={`border-b border-[#7d3627]/5 hover:bg-[#f3a213]/4 transition-colors ${
                      i === customers.length - 1 ? 'border-b-0' : ''
                    }`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center font-body font-bold text-xs shrink-0"
                          style={{ background: 'rgba(243,162,19,0.15)', color: '#f3a213' }}>
                          {c.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-body font-semibold text-sm text-[#7d3627] whitespace-nowrap">{c.name}</p>
                          <p className="font-body text-[11px] text-[#7d3627]/40">{c.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-body text-sm text-[#7d3627]/70 whitespace-nowrap">{c.phone}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-body text-sm text-[#7d3627]/70 whitespace-nowrap">{c.city}</p>
                      <p className="font-body text-[11px] text-[#7d3627]/40">{c.state}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-body font-semibold text-xs"
                        style={{
                          background: c.orderCount > 1 ? 'rgba(0,152,70,0.12)' : 'rgba(125,54,39,0.06)',
                          color: c.orderCount > 1 ? '#009846' : 'rgba(125,54,39,0.5)',
                        }}>
                        <ShoppingBag size={10} />
                        {c.orderCount} {c.orderCount === 1 ? 'order' : 'orders'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-display font-bold text-sm whitespace-nowrap" style={{ color: '#f3a213' }}>
                        ₹{c.totalSpend.toLocaleString('en-IN')}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <Link href={`/admin/orders?search=${encodeURIComponent(c.email)}`}
                        className="font-body text-[11px] text-[#7d3627]/45 hover:text-[#f3a213] transition-colors whitespace-nowrap">
                        {new Date(c.lastOrderAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
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
