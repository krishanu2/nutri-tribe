import { TicketStatus, TicketIssueType } from '@prisma/client';

const STATUS_CONFIG: Record<TicketStatus, { label: string; bg: string; text: string; dot: string }> = {
  OPEN:        { label: 'Open',        bg: 'bg-amber-50',  text: 'text-amber-700',  dot: 'bg-amber-400'  },
  IN_PROGRESS: { label: 'In Progress', bg: 'bg-blue-50',   text: 'text-blue-700',   dot: 'bg-blue-400'   },
  RESOLVED:    { label: 'Resolved',    bg: 'bg-green-50',  text: 'text-green-700',  dot: 'bg-green-400'  },
  CLOSED:      { label: 'Closed',      bg: 'bg-slate-100', text: 'text-slate-600',  dot: 'bg-slate-400'  },
};

const ISSUE_LABELS: Record<TicketIssueType, string> = {
  DAMAGED: 'Damaged Product',
  WRONG_ITEM: 'Wrong Item',
  MISSING_ITEM: 'Missing Item',
  QUALITY_ISSUE: 'Quality Issue',
  OTHER: 'Other',
};

export default function TicketStatusBadge({ status }: { status: TicketStatus }) {
  const { label, bg, text, dot } = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold font-body ${bg} ${text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  );
}

export function TicketIssueBadge({ issueType }: { issueType: TicketIssueType }) {
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold font-body bg-[#7d3627]/8 text-[#7d3627]/70">
      {ISSUE_LABELS[issueType]}
    </span>
  );
}
