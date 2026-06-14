'use client';

import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts';

export interface DailyPoint {
  date: string;
  revenue: number;
  orders: number;
}

export interface TopProduct {
  name: string;
  quantity: number;
}

interface TooltipPayloadItem {
  dataKey: string;
  value: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
  formatter?: (key: string, value: number) => string;
}

function CustomTooltip({ active, payload, label, formatter }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white rounded-xl border border-[#7d3627]/10 px-4 py-2.5 shadow-lg">
      <p className="font-body font-bold text-xs text-[#7d3627] mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} className="font-body text-xs text-[#7d3627]/60">
          {formatter ? formatter(p.dataKey, p.value) : `${p.dataKey}: ${p.value}`}
        </p>
      ))}
    </div>
  );
}

export function RevenueTrendChart({ data }: { data: DailyPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f3a213" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#f3a213" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#7d362710" vertical={false} />
        <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#7d362770' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: '#7d362770' }} axisLine={false} tickLine={false}
          tickFormatter={(v) => `₹${v}`} width={60} />
        <Tooltip content={<CustomTooltip formatter={(key: string, value: number) => `Revenue: ₹${value.toLocaleString('en-IN')}`} />} />
        <Area type="monotone" dataKey="revenue" stroke="#f3a213" strokeWidth={2} fill="url(#revenueFill)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function OrderVolumeChart({ data }: { data: DailyPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#7d362710" vertical={false} />
        <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#7d362770' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: '#7d362770' }} axisLine={false} tickLine={false} width={30} allowDecimals={false} />
        <Tooltip content={<CustomTooltip formatter={(key: string, value: number) => `Orders: ${value}`} />} />
        <Bar dataKey="orders" fill="#009846" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function TopProductsChart({ data }: { data: TopProduct[] }) {
  return (
    <ResponsiveContainer width="100%" height={Math.max(220, data.length * 50)}>
      <BarChart data={data} layout="vertical" margin={{ top: 10, right: 24, left: 10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#7d362710" horizontal={false} />
        <XAxis type="number" tick={{ fontSize: 11, fill: '#7d362770' }} axisLine={false} tickLine={false} allowDecimals={false} />
        <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: '#7d3627' }} axisLine={false} tickLine={false} width={140} />
        <Tooltip content={<CustomTooltip formatter={(key: string, value: number) => `Units sold: ${value}`} />} />
        <Bar dataKey="quantity" fill="#7a4dff" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
