import { db } from '@/lib/db';
import { TicketStatus } from '@prisma/client';
import Link from 'next/link';
import TicketStatusBadge, { TicketIssueBadge } from '../_components/TicketStatusBadge';
import { LifeBuoy } from 'lucide-react';

const STATUS_TABS: { label: string; value: string }[] = [
  { label: 'All',         value: '' },
  { label: 'Open',        value: 'OPEN' },
  { label: 'In Progress', value: 'IN_PROGRESS' },
  { label: 'Resolved',    value: 'RESOLVED' },
  { label: 'Closed',      value: 'CLOSED' },
];

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: { status?: string; page?: string };
}

export default async function TicketsPage({ searchParams }: PageProps) {
  const statusFilter = (searchParams.status ?? '') as TicketStatus | '';
  const page = Math.max(1, parseInt(searchParams.page ?? '1'));
  const limit = 20;

  const where = statusFilter ? { status: statusFilter } : {};

  const [tickets, total] = await db.$transaction([
    db.ticket.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.ticket.count({ where }),
  ]);

  const pages = Math.ceil(total / limit);

  const buildHref = (overrides: { status?: string; page?: number }) => {
    const params = new URLSearchParams();
    const s = overrides.status !== undefined ? overrides.status : statusFilter;
    const p = overrides.page ?? page;
    if (s) params.set('status', s);
    if (p > 1) params.set('page', String(p));
    const qs = params.toString();
    return `/admin/tickets${qs ? `?${qs}` : ''}`;
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="font-display font-bold text-3xl text-[#7d3627]">Support Tickets</h1>
        <p className="font-body text-sm text-[#7d3627]/50 mt-1">{total} total ticket{total !== 1 ? 's' : ''}</p>
      </div>

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

      <div className="bg-white rounded-2xl border border-[#7d3627]/8 overflow-hidden">
        {tickets.length === 0 ? (
          <div className="py-20 text-center">
            <LifeBuoy size={44} className="text-[#7d3627]/15 mx-auto mb-3" />
            <p className="font-body text-sm text-[#7d3627]/40">No tickets found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#7d3627]/6 bg-[#7d3627]/2">
                  {['Order', 'Issue', 'Customer', 'Contact', 'Status', 'Date', 'Action'].map(h => (
                    <th key={h} className="px-5 py-3 text-left font-body text-[11px] font-semibold tracking-widest uppercase text-[#7d3627]/40">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tickets.map((t, i) => (
                  <tr key={t.id}
                    className={`border-b border-[#7d3627]/5 hover:bg-[#f3a213]/4 transition-colors ${
                      i === tickets.length - 1 ? 'border-b-0' : ''
                    }`}
                  >
                    <td className="px-5 py-3.5 font-body font-bold text-xs text-[#7d3627] tracking-widest whitespace-nowrap">
                      {t.orderRef}
                    </td>
                    <td className="px-5 py-3.5">
                      <TicketIssueBadge issueType={t.issueType} />
                    </td>
                    <td className="px-5 py-3.5 font-body text-sm text-[#7d3627] whitespace-nowrap">
                      {t.customerName}
                    </td>
                    <td className="px-5 py-3.5 font-body text-xs text-[#7d3627]/55 whitespace-nowrap">
                      {t.email} · {t.phone}
                    </td>
                    <td className="px-5 py-3.5">
                      <TicketStatusBadge status={t.status} />
                    </td>
                    <td className="px-5 py-3.5 font-body text-xs text-[#7d3627]/45 whitespace-nowrap">
                      {new Date(t.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-5 py-3.5">
                      <Link href={`/admin/tickets/${t.id}`}
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

      {pages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="font-body text-xs text-[#7d3627]/45">
            Page {page} of {pages} · {total} tickets
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
