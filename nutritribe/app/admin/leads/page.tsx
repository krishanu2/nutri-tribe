import { db } from '@/lib/db';
import { LeadType, LeadStatus } from '@prisma/client';
import Link from 'next/link';
import LeadStatusBadge, { LeadTypeBadge } from '../_components/LeadStatusBadge';
import { Users2 } from 'lucide-react';

const TYPE_TABS: { label: string; value: string }[] = [
  { label: 'All',               value: '' },
  { label: 'B2B & Bulk',         value: 'B2B' },
  { label: 'Corporate Gifting',  value: 'CORPORATE_GIFTING' },
];

const STATUS_TABS: { label: string; value: string }[] = [
  { label: 'All',        value: '' },
  { label: 'New',        value: 'NEW' },
  { label: 'Contacted',  value: 'CONTACTED' },
  { label: 'Qualified',  value: 'QUALIFIED' },
  { label: 'Converted',  value: 'CONVERTED' },
  { label: 'Rejected',   value: 'REJECTED' },
];

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: { type?: string; status?: string; page?: string };
}

export default async function LeadsPage({ searchParams }: PageProps) {
  const typeFilter   = (searchParams.type ?? '') as LeadType | '';
  const statusFilter = (searchParams.status ?? '') as LeadStatus | '';
  const page  = Math.max(1, parseInt(searchParams.page ?? '1'));
  const limit = 20;

  const where = {
    ...(typeFilter ? { type: typeFilter } : {}),
    ...(statusFilter ? { status: statusFilter } : {}),
  };

  const [leads, total] = await db.$transaction([
    db.lead.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.lead.count({ where }),
  ]);

  const pages = Math.ceil(total / limit);

  const buildHref = (overrides: { type?: string; status?: string; page?: number }) => {
    const params = new URLSearchParams();
    const t = overrides.type !== undefined ? overrides.type : typeFilter;
    const s = overrides.status !== undefined ? overrides.status : statusFilter;
    const p = overrides.page ?? page;
    if (t) params.set('type', t);
    if (s) params.set('status', s);
    if (p > 1) params.set('page', String(p));
    const qs = params.toString();
    return `/admin/leads${qs ? `?${qs}` : ''}`;
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-display font-bold text-3xl text-[#7d3627]">Leads</h1>
        <p className="font-body text-sm text-[#7d3627]/50 mt-1">{total} total enquir{total !== 1 ? 'ies' : 'y'}</p>
      </div>

      {/* Type filter tabs */}
      <div className="flex flex-wrap gap-2 mb-3">
        {TYPE_TABS.map(tab => {
          const active = typeFilter === tab.value;
          return (
            <Link
              key={tab.value}
              href={buildHref({ type: tab.value, page: 1 })}
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

      {/* Status filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {STATUS_TABS.map(tab => {
          const active = statusFilter === tab.value;
          return (
            <Link
              key={tab.value}
              href={buildHref({ status: tab.value, page: 1 })}
              className={`font-body font-semibold text-xs px-4 py-2 rounded-full transition-all ${
                active
                  ? 'bg-[#7d3627] text-white'
                  : 'bg-white text-[#7d3627]/60 border border-[#7d3627]/12 hover:border-[#7d3627]/30'
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#7d3627]/8 overflow-hidden">
        {leads.length === 0 ? (
          <div className="py-20 text-center">
            <Users2 size={44} className="text-[#7d3627]/15 mx-auto mb-3" />
            <p className="font-body text-sm text-[#7d3627]/40">No leads found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#7d3627]/6 bg-[#7d3627]/2">
                  {['Type', 'Company', 'Contact', 'Email / Phone', 'Status', 'Date', 'Action'].map(h => (
                    <th key={h} className="px-5 py-3 text-left font-body text-[11px] font-semibold tracking-widest uppercase text-[#7d3627]/40">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {leads.map((l, i) => (
                  <tr key={l.id}
                    className={`border-b border-[#7d3627]/5 hover:bg-[#f3a213]/4 transition-colors ${
                      i === leads.length - 1 ? 'border-b-0' : ''
                    }`}
                  >
                    <td className="px-5 py-3.5">
                      <LeadTypeBadge type={l.type} />
                    </td>
                    <td className="px-5 py-3.5 font-body font-bold text-xs text-[#7d3627] whitespace-nowrap">
                      {l.companyName}
                    </td>
                    <td className="px-5 py-3.5 font-body text-sm text-[#7d3627] whitespace-nowrap">
                      {l.name}
                    </td>
                    <td className="px-5 py-3.5 font-body text-xs text-[#7d3627]/55 whitespace-nowrap">
                      {l.email} · {l.phone}
                    </td>
                    <td className="px-5 py-3.5">
                      <LeadStatusBadge status={l.status} />
                    </td>
                    <td className="px-5 py-3.5 font-body text-xs text-[#7d3627]/45 whitespace-nowrap">
                      {new Date(l.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-5 py-3.5">
                      <Link href={`/admin/leads/${l.id}`}
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
            Page {page} of {pages} · {total} leads
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
