interface BadgeProps {
  children: React.ReactNode;
  variant?: 'hot' | 'new' | 'bestseller' | 'premium';
}

const variantStyles = {
  hot: 'bg-red-500 text-white',
  new: 'bg-tribe-violet text-white',
  bestseller: 'bg-sun-harvest text-white',
  premium: 'bg-earthen-rust text-white',
};

const variantMap: Record<string, 'hot' | 'new' | 'bestseller' | 'premium'> = {
  'HOT SELLER': 'hot',
  'NEW': 'new',
  'BESTSELLER': 'bestseller',
  'PREMIUM': 'premium',
};

export default function Badge({ children, variant }: BadgeProps) {
  const label = String(children).toUpperCase();
  const v = variant || variantMap[label] || 'bestseller';

  return (
    <span className={`inline-block font-body font-bold text-xs px-3 py-1 rounded-full tracking-widest uppercase ${variantStyles[v]}`}>
      {children}
    </span>
  );
}
