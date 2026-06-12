interface StatsCardProps {
  label: string;
  value: string | number;
  sub?: string;
  accent?: string;
  icon: React.ReactNode;
}

export default function StatsCard({ label, value, sub, accent = '#f3a213', icon }: StatsCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-[#7d3627]/8 p-5 flex items-start gap-4 shadow-sm">
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: accent + '18' }}
      >
        <span style={{ color: accent }}>{icon}</span>
      </div>
      <div>
        <p className="font-body text-xs font-semibold tracking-widest uppercase text-[#7d3627]/50 mb-1">
          {label}
        </p>
        <p className="font-display font-bold text-2xl text-[#7d3627] leading-none">
          {value}
        </p>
        {sub && <p className="font-body text-xs text-[#7d3627]/40 mt-1">{sub}</p>}
      </div>
    </div>
  );
}
