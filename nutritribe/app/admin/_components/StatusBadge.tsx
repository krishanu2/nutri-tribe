import { OrderStatus } from '@prisma/client';

const CONFIG: Record<OrderStatus, { label: string; bg: string; text: string; dot: string }> = {
  PENDING:    { label: 'Pending',    bg: 'bg-amber-50',  text: 'text-amber-700',  dot: 'bg-amber-400'  },
  CONFIRMED:  { label: 'Confirmed',  bg: 'bg-blue-50',   text: 'text-blue-700',   dot: 'bg-blue-400'   },
  PROCESSING: { label: 'Processing', bg: 'bg-purple-50', text: 'text-purple-700', dot: 'bg-purple-400' },
  SHIPPED:    { label: 'Shipped',    bg: 'bg-sky-50',    text: 'text-sky-700',    dot: 'bg-sky-400'    },
  DELIVERED:  { label: 'Delivered',  bg: 'bg-green-50',  text: 'text-green-700',  dot: 'bg-green-400'  },
  CANCELLED:  { label: 'Cancelled',  bg: 'bg-red-50',    text: 'text-red-700',    dot: 'bg-red-400'    },
};

export default function StatusBadge({ status }: { status: OrderStatus }) {
  const { label, bg, text, dot } = CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold font-body ${bg} ${text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  );
}
