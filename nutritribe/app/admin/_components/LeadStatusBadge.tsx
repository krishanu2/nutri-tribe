import { LeadStatus, LeadType } from '@prisma/client';

const STATUS_CONFIG: Record<LeadStatus, { label: string; bg: string; text: string; dot: string }> = {
  NEW:        { label: 'New',        bg: 'bg-amber-50',  text: 'text-amber-700',  dot: 'bg-amber-400'  },
  CONTACTED:  { label: 'Contacted',  bg: 'bg-blue-50',   text: 'text-blue-700',   dot: 'bg-blue-400'   },
  QUALIFIED:  { label: 'Qualified',  bg: 'bg-purple-50', text: 'text-purple-700', dot: 'bg-purple-400' },
  CONVERTED:  { label: 'Converted',  bg: 'bg-green-50',  text: 'text-green-700',  dot: 'bg-green-400'  },
  REJECTED:   { label: 'Rejected',   bg: 'bg-red-50',    text: 'text-red-700',    dot: 'bg-red-400'    },
};

const TYPE_LABELS: Record<LeadType, string> = {
  B2B: 'B2B & Bulk',
  CORPORATE_GIFTING: 'Corporate Gifting',
};

export default function LeadStatusBadge({ status }: { status: LeadStatus }) {
  const { label, bg, text, dot } = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold font-body ${bg} ${text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  );
}

export function LeadTypeBadge({ type }: { type: LeadType }) {
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold font-body bg-[#7d3627]/8 text-[#7d3627]/70">
      {TYPE_LABELS[type]}
    </span>
  );
}
