import { ReviewStatus } from '@prisma/client';

const STATUS_CONFIG: Record<ReviewStatus, { label: string; bg: string; text: string; dot: string }> = {
  PENDING:  { label: 'Pending',  bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-400' },
  APPROVED: { label: 'Approved', bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-400' },
  REJECTED: { label: 'Rejected', bg: 'bg-red-50',   text: 'text-red-700',   dot: 'bg-red-400'   },
};

export default function ReviewStatusBadge({ status }: { status: ReviewStatus }) {
  const { label, bg, text, dot } = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold font-body ${bg} ${text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  );
}
