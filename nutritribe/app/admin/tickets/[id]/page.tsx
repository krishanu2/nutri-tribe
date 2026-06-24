import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { db } from '@/lib/db';
import { ArrowLeft, Mail, Phone, Hash, MessageSquare, Calendar, ImageIcon } from 'lucide-react';
import TicketStatusBadge, { TicketIssueBadge } from '../../_components/TicketStatusBadge';
import TicketStatusPanel from '../../_components/TicketStatusPanel';

export const dynamic = 'force-dynamic';

export default async function TicketDetailPage({ params }: { params: { id: string } }) {
  const ticket = await db.ticket.findUnique({ where: { id: params.id } });

  if (!ticket) return notFound();

  return (
    <div className="p-8">
      <Link href="/admin/tickets"
        className="inline-flex items-center gap-2 font-body text-sm text-[#7d3627]/50 hover:text-[#f3a213] transition-colors mb-6">
        <ArrowLeft size={14} />
        Back to Tickets
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="font-display font-bold text-3xl text-[#7d3627]">{ticket.orderRef}</h1>
            <TicketIssueBadge issueType={ticket.issueType} />
            <TicketStatusBadge status={ticket.status} />
          </div>
          <p className="font-body text-sm text-[#7d3627]/50">
            Submitted on {new Date(ticket.createdAt).toLocaleString('en-IN', {
              day: 'numeric', month: 'long', year: 'numeric',
              hour: '2-digit', minute: '2-digit',
            })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          {/* Contact */}
          <div className="bg-white rounded-2xl border border-[#7d3627]/8 overflow-hidden">
            <div className="px-6 py-4 border-b border-[#7d3627]/8">
              <h2 className="font-display font-bold text-lg text-[#7d3627]">Customer</h2>
            </div>
            <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoRow icon={<Hash size={14} />} label="Order ID" value={ticket.orderRef} />
              <InfoRow icon={<Mail size={14} />} label="Email" value={ticket.email} />
              <InfoRow icon={<Phone size={14} />} label="Phone" value={ticket.phone} />
              <InfoRow icon={<Hash size={14} />} label="Name" value={ticket.customerName} />
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-2xl border border-[#7d3627]/8 overflow-hidden">
            <div className="px-6 py-4 border-b border-[#7d3627]/8 flex items-center gap-2">
              <MessageSquare size={15} className="text-[#7d3627]/50" />
              <h2 className="font-display font-bold text-lg text-[#7d3627]">Issue Description</h2>
            </div>
            <div className="px-6 py-5">
              <p className="font-body text-sm text-[#7d3627] whitespace-pre-line">{ticket.description}</p>
            </div>
          </div>

          {/* Photo */}
          {ticket.photoUrl && (
            <div className="bg-white rounded-2xl border border-[#7d3627]/8 overflow-hidden">
              <div className="px-6 py-4 border-b border-[#7d3627]/8 flex items-center gap-2">
                <ImageIcon size={15} className="text-[#7d3627]/50" />
                <h2 className="font-display font-bold text-lg text-[#7d3627]">Photo</h2>
              </div>
              <div className="px-6 py-5">
                <a href={ticket.photoUrl} target="_blank" rel="noopener noreferrer" className="inline-block relative w-48 h-48 rounded-xl overflow-hidden border border-[#7d3627]/10">
                  <Image src={ticket.photoUrl} alt="Issue photo" fill className="object-cover" />
                </a>
              </div>
            </div>
          )}

          {/* Timeline */}
          <div className="bg-white rounded-2xl border border-[#7d3627]/8 overflow-hidden">
            <div className="px-6 py-4 border-b border-[#7d3627]/8 flex items-center gap-2">
              <Calendar size={14} className="text-[#7d3627]/50" />
              <h2 className="font-display font-bold text-lg text-[#7d3627]">Timeline</h2>
            </div>
            <div className="px-6 py-5 space-y-2">
              <InfoRow icon={<Calendar size={13} />} label="Submitted"
                value={new Date(ticket.createdAt).toLocaleString('en-IN')} />
              <InfoRow icon={<Calendar size={13} />} label="Last Updated"
                value={new Date(ticket.updatedAt).toLocaleString('en-IN')} />
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <TicketStatusPanel
              ticketId={ticket.id}
              currentStatus={ticket.status}
              adminNote={ticket.adminNote}
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
