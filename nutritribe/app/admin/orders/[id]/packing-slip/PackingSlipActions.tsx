'use client';

import Link from 'next/link';
import { ArrowLeft, Printer } from 'lucide-react';

export default function PackingSlipActions({ orderDbId }: { orderDbId: string }) {
  return (
    <div className="flex items-center justify-between mb-6 print:hidden">
      <Link
        href={`/admin/orders/${orderDbId}`}
        className="inline-flex items-center gap-2 font-body text-sm text-[#7d3627]/50 hover:text-[#f3a213] transition-colors"
      >
        <ArrowLeft size={14} />
        Back to Order
      </Link>
      <button
        onClick={() => window.print()}
        className="inline-flex items-center gap-2 font-body font-semibold text-sm px-4 py-2.5 rounded-xl bg-[#f3a213] text-[#050100] hover:brightness-110 transition-all"
      >
        <Printer size={15} />
        Print Packing Slip
      </button>
    </div>
  );
}
