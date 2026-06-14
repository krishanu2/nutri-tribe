import { StockStatus } from '@/lib/products';

const STYLES: Record<StockStatus, { label: string; dot: string; text: string }> = {
  in:  { label: 'In Stock',        dot: 'bg-sacred-leaf',  text: 'text-sacred-leaf' },
  low: { label: 'Only Few Left',   dot: 'bg-sun-harvest',  text: 'text-sun-harvest' },
  out: { label: 'Out of Stock',    dot: 'bg-earthen-rust/40', text: 'text-earthen-rust/50' },
};

export default function StockBadge({ stock, className = '' }: { stock: StockStatus; className?: string }) {
  const s = STYLES[stock];
  return (
    <span className={`inline-flex items-center gap-1.5 font-body font-semibold text-xs ${s.text} ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot} ${stock === 'low' ? 'animate-pulse' : ''}`} />
      {s.label}
    </span>
  );
}
