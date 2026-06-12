import { notFound } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/lib/db';
import { ArrowLeft, Building2, Mail, Phone, FileText, MessageSquare, Calendar } from 'lucide-react';
import LeadStatusBadge, { LeadTypeBadge } from '../../_components/LeadStatusBadge';
import LeadStatusPanel from '../../_components/LeadStatusPanel';

export const dynamic = 'force-dynamic';

export default async function LeadDetailPage({ params }: { params: { id: string } }) {
  const lead = await db.lead.findUnique({ where: { id: params.id } });

  if (!lead) return notFound();

  return (
    <div className="p-8">
      {/* Back */}
      <Link href="/admin/leads"
        className="inline-flex items-center gap-2 font-body text-sm text-[#7d3627]/50 hover:text-[#f3a213] transition-colors mb-6">
        <ArrowLeft size={14} />
        Back to Leads
      </Link>

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="font-display font-bold text-3xl text-[#7d3627]">{lead.companyName}</h1>
            <LeadTypeBadge type={lead.type} />
            <LeadStatusBadge status={lead.status} />
          </div>
          <p className="font-body text-sm text-[#7d3627]/50">
            Submitted on {new Date(lead.createdAt).toLocaleString('en-IN', {
              day: 'numeric', month: 'long', year: 'numeric',
              hour: '2-digit', minute: '2-digit',
            })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT — lead details */}
        <div className="lg:col-span-2 space-y-5">
          {/* Contact */}
          <div className="bg-white rounded-2xl border border-[#7d3627]/8 overflow-hidden">
            <div className="px-6 py-4 border-b border-[#7d3627]/8">
              <h2 className="font-display font-bold text-lg text-[#7d3627]">Contact Details</h2>
            </div>
            <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoRow icon={<Building2 size={14} />} label="Company / Brand" value={lead.companyName} />
              <InfoRow icon={<Building2 size={14} />} label="Contact Name" value={lead.name} />
              <InfoRow icon={<Mail size={14} />} label="Email" value={lead.email} />
              <InfoRow icon={<Phone size={14} />} label="Phone" value={lead.phone} />
            </div>
          </div>

          {/* Details */}
          {lead.details && (
            <div className="bg-white rounded-2xl border border-[#7d3627]/8 overflow-hidden">
              <div className="px-6 py-4 border-b border-[#7d3627]/8 flex items-center gap-2">
                <FileText size={15} className="text-[#7d3627]/50" />
                <h2 className="font-display font-bold text-lg text-[#7d3627]">
                  {lead.type === 'B2B' ? 'Business Details' : 'Occasion / Order Details'}
                </h2>
              </div>
              <div className="px-6 py-5">
                <p className="font-body text-sm text-[#7d3627] whitespace-pre-line">{lead.details}</p>
              </div>
            </div>
          )}

          {/* Message */}
          <div className="bg-white rounded-2xl border border-[#7d3627]/8 overflow-hidden">
            <div className="px-6 py-4 border-b border-[#7d3627]/8 flex items-center gap-2">
              <MessageSquare size={15} className="text-[#7d3627]/50" />
              <h2 className="font-display font-bold text-lg text-[#7d3627]">Message</h2>
            </div>
            <div className="px-6 py-5">
              <p className="font-body text-sm text-[#7d3627] whitespace-pre-line">{lead.message}</p>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-2xl border border-[#7d3627]/8 overflow-hidden">
            <div className="px-6 py-4 border-b border-[#7d3627]/8 flex items-center gap-2">
              <Calendar size={14} className="text-[#7d3627]/50" />
              <h2 className="font-display font-bold text-lg text-[#7d3627]">Timeline</h2>
            </div>
            <div className="px-6 py-5 space-y-2">
              <InfoRow icon={<Calendar size={13} />} label="Submitted"
                value={new Date(lead.createdAt).toLocaleString('en-IN')} />
              <InfoRow icon={<Calendar size={13} />} label="Last Updated"
                value={new Date(lead.updatedAt).toLocaleString('en-IN')} />
            </div>
          </div>
        </div>

        {/* RIGHT — status management */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <LeadStatusPanel
              leadId={lead.id}
              currentStatus={lead.status}
              adminNote={lead.adminNote}
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
