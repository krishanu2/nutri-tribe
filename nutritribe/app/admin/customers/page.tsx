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
        <h1 className="font-display font-bold text-2xl text-ivory-grain">Customers</h1>
        <p className="font-body text-sm mt-1" style={{ color: 'rgba(253,251,247,0.4)' }}>
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
          <div key={label} className="rounded-2xl p-5 flex items-center gap-4"
            style={{ background: 'rgba(253,251,247,0.04)', border: '1px solid rgba(243,162,19,0.1)' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: `${color}18` }}>
              <Icon size={18} style={{ color }} />
            </div>
            <div>
              <p className="font-display font-bold text-xl text-ivory-grain">{value}</p>
              <p className="font-body text-xs" style={{ color: 'rgba(253,251,247,0.4)' }}>{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(243,162,19,0.1)' }}>
        <div className="px-6 py-4 flex items-center justify-between"
          style={{ background: 'rgba(253,251,247,0.03)', borderBottom: '1px solid rgba(243,162,19,0.08)' }}>
          <h2 className="font-body font-semibold text-sm text-ivory-grain">All Customers</h2>
          <span className="font-body text-xs" style={{ color: 'rgba(253,251,247,0.35)' }}>
            Total revenue: ₹{totalRevenue.toLocaleString('en-IN')}
          </span>
        </div>

        {customers.length === 0 ? (
          <div className="py-20 text-center">
            <Users size={32} style={{ color: 'rgba(243,162,19,0.2)' }} className="mx-auto mb-3" />
            <p className="font-body text-sm" style={{ color: 'rgba(253,251,247,0.3)' }}>No customers yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(243,162,19,0.08)' }}>
                  {['Customer', 'Contact', 'Location', 'Orders', 'Lifetime Value', 'Last Order'].map(h => (
                    <th key={h} className="px-6 py-3 text-left font-body font-semibold text-[10px] tracking-widest uppercase"
                      style={{ color: 'rgba(243,162,19,0.5)' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {customers.map((c, i) => (
                  <tr key={c.email}
                    style={{ borderBottom: i < customers.length - 1 ? '1px solid rgba(253,251,247,0.04)' : 'none' }}
                    className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center font-body font-bold text-xs"
                          style={{ background: 'rgba(243,162,19,0.15)', color: '#f3a213' }}>
                          {c.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-body font-semibold text-sm text-ivory-grain">{c.name}</p>
                          <p className="font-body text-[11px]" style={{ color: 'rgba(253,251,247,0.35)' }}>{c.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-body text-sm" style={{ color: 'rgba(253,251,247,0.6)' }}>{c.phone}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-body text-sm" style={{ color: 'rgba(253,251,247,0.6)' }}>{c.city}</p>
                      <p className="font-body text-[11px]" style={{ color: 'rgba(253,251,247,0.3)' }}>{c.state}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-body font-semibold text-xs"
                        style={{
                          background: c.orderCount > 1 ? 'rgba(0,152,70,0.15)' : 'rgba(253,251,247,0.06)',
                          color: c.orderCount > 1 ? '#009846' : 'rgba(253,251,247,0.5)',
                        }}>
                        <ShoppingBag size={10} />
                        {c.orderCount} {c.orderCount === 1 ? 'order' : 'orders'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-body font-bold text-sm" style={{ color: '#f3a213' }}>
                        ₹{c.totalSpend.toLocaleString('en-IN')}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <Link href={`/admin/orders?search=${encodeURIComponent(c.email)}`}
                        className="font-body text-[11px] hover:text-sun-harvest transition-colors"
                        style={{ color: 'rgba(253,251,247,0.35)' }}>
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
