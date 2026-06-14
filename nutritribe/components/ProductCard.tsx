'use client';

import { useRef, useCallback, useState } from 'react';
import { motion, useInView, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'framer-motion';
import Link from 'next/link';
import { ShoppingCart, Eye, Check, Heart } from 'lucide-react';
import { Product } from '@/lib/products';
import Badge from '@/components/ui/Badge';
import StockBadge from '@/components/ui/StockBadge';
import { useCart } from '@/lib/cartContext';
import { useWishlist } from '@/lib/wishlistContext';

interface ProductCardProps {
  product: Product;
  index?: number;
}

// Illustrated makhana bowl - uses product color as background accent
function MakhanaBowlIllustration({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 320 280" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        <radialGradient id={`mk-a-${color.replace('#', '')}`} cx="33%" cy="28%" r="70%">
          <stop offset="0%" stopColor="#fdfbf7" />
          <stop offset="40%" stopColor="#ecdfc4" />
          <stop offset="75%" stopColor="#d4b485" />
          <stop offset="100%" stopColor="#b8916a" />
        </radialGradient>
        <radialGradient id={`mk-b-${color.replace('#', '')}`} cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#f0e5cc" />
          <stop offset="50%" stopColor="#c8a878" />
          <stop offset="100%" stopColor="#9a7250" />
        </radialGradient>
        <linearGradient id={`bowl-${color.replace('#', '')}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={color} stopOpacity="0.7" />
          <stop offset="40%" stopColor={color} stopOpacity="0.9" />
          <stop offset="60%" stopColor={color} />
          <stop offset="100%" stopColor={color} stopOpacity="0.7" />
        </linearGradient>
        <radialGradient id={`bowl-inner-${color.replace('#', '')}`} cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#1a0806" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#1a0806" stopOpacity="0.35" />
        </radialGradient>
        <radialGradient id={`glow-${color.replace('#', '')}`} cx="50%" cy="50%">
          <stop offset="0%" stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Background glow */}
      <ellipse cx="160" cy="145" rx="130" ry="110" fill={`url(#glow-${color.replace('#', '')})`} />

      {/* Floating loose makhana balls - back */}
      <circle cx="45" cy="220" r="18" fill={`url(#mk-b-${color.replace('#', '')})`} opacity="0.7" />
      <circle cx="38" cy="213" r="3" fill="#7a5c30" opacity="0.35" />
      <circle cx="275" cy="215" r="20" fill={`url(#mk-b-${color.replace('#', '')})`} opacity="0.7" />
      <circle cx="268" cy="208" r="3.5" fill="#7a5c30" opacity="0.35" />

      {/* Bowl body */}
      <path
        d="M 64 148 Q 50 200 55 225 Q 72 258 160 263 Q 248 258 265 225 Q 270 200 256 148 Z"
        fill={`url(#bowl-${color.replace('#', '')})`}
      />
      {/* Bowl texture */}
      <path d="M 80 165 Q 68 210 74 232" stroke="white" strokeWidth="1" opacity="0.12" fill="none" />
      <path d="M 240 165 Q 252 210 246 232" stroke="white" strokeWidth="1" opacity="0.12" fill="none" />
      {/* Bowl base */}
      <ellipse cx="160" cy="260" rx="62" ry="10" fill={color} opacity="0.8" />
      <ellipse cx="160" cy="260" rx="62" ry="10" stroke="#f3a213" strokeWidth="1.5" fill="none" opacity="0.5" />

      {/* Bowl inner shadow */}
      <ellipse cx="160" cy="148" rx="96" ry="20" fill={`url(#bowl-inner-${color.replace('#', '')})`} />

      {/* Makhana in bowl - back row */}
      <circle cx="116" cy="136" r="24" fill={`url(#mk-b-${color.replace('#', '')})`} />
      <circle cx="109" cy="129" r="3.5" fill="#7a5c30" opacity="0.4" />
      <circle cx="122" cy="127" r="2.5" fill="#7a5c30" opacity="0.3" />

      <circle cx="204" cy="136" r="24" fill={`url(#mk-b-${color.replace('#', '')})`} />
      <circle cx="196" cy="129" r="3.5" fill="#7a5c30" opacity="0.4" />
      <circle cx="210" cy="127" r="2.5" fill="#7a5c30" opacity="0.3" />

      {/* Center top ball */}
      <circle cx="160" cy="127" r="26" fill={`url(#mk-a-${color.replace('#', '')})`} />
      <circle cx="151" cy="119" r="4" fill="#7a5c30" opacity="0.45" />
      <circle cx="163" cy="115" r="3" fill="#7a5c30" opacity="0.35" />
      <circle cx="170" cy="125" r="3.5" fill="#7a5c30" opacity="0.3" />
      <ellipse cx="152" cy="118" rx="8" ry="5" fill="white" opacity="0.32" transform="rotate(-22 152 118)" />

      {/* Bowl rim */}
      <ellipse cx="160" cy="148" rx="96" ry="20" stroke="#f3a213" strokeWidth="3" fill="none" opacity="0.7" />
      <ellipse cx="160" cy="148" rx="93" ry="17" stroke="#ffe08a" strokeWidth="1" fill="none" opacity="0.4" />

      {/* Foreground makhana balls - spilling out */}
      <circle cx="72" cy="190" r="28" fill={`url(#mk-a-${color.replace('#', '')})`} />
      <circle cx="63" cy="181" r="4" fill="#7a5c30" opacity="0.45" />
      <circle cx="76" cy="178" r="3" fill="#7a5c30" opacity="0.35" />
      <circle cx="83" cy="190" r="3.5" fill="#7a5c30" opacity="0.3" />
      <ellipse cx="64" cy="181" rx="8" ry="5" fill="white" opacity="0.3" transform="rotate(-25 64 181)" />

      <circle cx="136" cy="205" r="30" fill={`url(#mk-a-${color.replace('#', '')})`} />
      <circle cx="125" cy="195" r="4.5" fill="#7a5c30" opacity="0.45" />
      <circle cx="140" cy="192" r="3.5" fill="#7a5c30" opacity="0.35" />
      <circle cx="148" cy="204" r="4" fill="#7a5c30" opacity="0.3" />
      <ellipse cx="126" cy="195" rx="9" ry="6" fill="white" opacity="0.3" transform="rotate(-22 126 195)" />

      <circle cx="188" cy="203" r="28" fill={`url(#mk-a-${color.replace('#', '')})`} />
      <circle cx="178" cy="194" r="4" fill="#7a5c30" opacity="0.45" />
      <circle cx="192" cy="190" r="3" fill="#7a5c30" opacity="0.35" />
      <circle cx="199" cy="202" r="3.5" fill="#7a5c30" opacity="0.3" />
      <ellipse cx="179" cy="193" rx="8" ry="5" fill="white" opacity="0.3" transform="rotate(-20 179 193)" />

      <circle cx="250" cy="188" r="27" fill={`url(#mk-a-${color.replace('#', '')})`} />
      <circle cx="241" cy="179" r="3.5" fill="#7a5c30" opacity="0.45" />
      <circle cx="254" cy="176" r="3" fill="#7a5c30" opacity="0.35" />
      <circle cx="260" cy="188" r="3.5" fill="#7a5c30" opacity="0.3" />
      <ellipse cx="242" cy="179" rx="7.5" ry="5" fill="white" opacity="0.3" transform="rotate(-24 242 179)" />

      {/* Small lotus decoration */}
      <path d="M 290 268 Q 294 235 286 200" stroke="#009846" strokeWidth="3.5" strokeLinecap="round" fill="none" />
      <ellipse cx="291" cy="248" rx="20" ry="11" fill="#009846" opacity="0.65" transform="rotate(-25 291 248)" />
      <ellipse cx="286" cy="208" rx="8" ry="18" fill="#ffb8d0" opacity="0.9" transform="rotate(-18 286 208)" />
      <ellipse cx="294" cy="204" rx="8" ry="18" fill="#ff9ab8" opacity="0.9" transform="rotate(18 294 204)" />
      <circle cx="290" cy="196" r="8" fill="#f3a213" />
      <circle cx="290" cy="196" r="4" fill="#FFD700" />

      {/* Gold sparkles */}
      {[[22, 55, 7], [298, 75, 6], [15, 170, 5], [305, 165, 7], [155, 40, 8]].map(([x, y, r], i) => (
        <g key={i} opacity="0.65">
          <line x1={x} y1={y - r} x2={x} y2={y + r} stroke="#f3a213" strokeWidth="1.5" />
          <line x1={x - r} y1={y} x2={x + r} y2={y} stroke="#f3a213" strokeWidth="1.5" />
          <circle cx={x} cy={y} r="2" fill="#f3a213" />
        </g>
      ))}
    </svg>
  );
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.05 });
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const [added, setAdded] = useState(false);
  const wishlisted = isWishlisted(product.slug);

  const handleToggleWishlist = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    toggleWishlist(product.slug);
  }, [toggleWishlist, product.slug]);

  const handleAddToCart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    addToCart({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      weight: product.weights[0],
      price: product.price,
      color: product.color,
      category: product.category,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }, [addToCart, product]);

  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotX = useSpring(useTransform(my, [0, 1], [6, -6]), { stiffness: 200, damping: 20 });
  const rotY = useSpring(useTransform(mx, [0, 1], [-6, 6]), { stiffness: 200, damping: 20 });
  const glowX = useTransform(mx, [0, 1], [0, 100]);
  const glowY = useTransform(my, [0, 1], [0, 100]);
  const glare = useMotionTemplate`radial-gradient(circle at ${glowX}% ${glowY}%, rgba(255,255,255,0.13) 0%, transparent 58%)`;

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width);
    my.set((e.clientY - rect.top) / rect.height);
  }, [mx, my]);

  const onLeave = useCallback(() => {
    mx.set(0.5); my.set(0.5);
  }, [mx, my]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1, ease: 'easeOut' }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX: rotX, rotateY: rotY, transformStyle: 'preserve-3d', perspective: 800 }}
      whileHover={{ y: -6, scale: 1.02 }}
      className="group relative rounded-2xl overflow-hidden shadow-card hover:shadow-hover transition-shadow duration-300 flex flex-col cursor-pointer bg-white border border-earthen-rust/6"
    >
      {/* Mouse-follow glare */}
      <motion.div
        className="absolute inset-0 z-30 pointer-events-none rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ backgroundImage: glare }}
      />
      {/* Badge */}
      {product.badge && (
        <div className="absolute top-4 right-4 z-20">
          <Badge>{product.badge}</Badge>
        </div>
      )}

      {/* Wishlist toggle */}
      <motion.button
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleToggleWishlist}
        className="absolute top-4 left-4 z-20 w-9 h-9 rounded-full flex items-center justify-center bg-white/80 backdrop-blur-sm shadow-sm transition-colors"
        aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <Heart size={15} className={wishlisted ? 'fill-red-500 text-red-500' : 'text-earthen-rust/40'} />
      </motion.button>

      {/* Image / Illustration section */}
      <div
        className="relative h-56 flex items-center justify-center overflow-hidden"
        style={{ backgroundColor: product.color + '14' }}
      >
        {/* Subtle pattern */}
        <div className="absolute inset-0"
          style={{ background: `radial-gradient(ellipse at 30% 30%, ${product.color}20 0%, transparent 60%)` }} />

        {/* Product illustration */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.4 }}
          className="relative z-10 w-full h-full px-4 pt-2"
        >
          <MakhanaBowlIllustration color={product.color} />
        </motion.div>

        {/* Bottom fade into card */}
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-white to-transparent" />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col p-5">
        {/* Category + stock */}
        <div className="flex items-center justify-between mb-1.5">
          <span className="font-body text-[10px] font-bold tracking-[0.22em] uppercase"
            style={{ color: product.color }}>
            {product.category}
          </span>
          <StockBadge stock={product.stock} />
        </div>

        {/* Name */}
        <h3 className="font-display font-bold text-xl text-earthen-rust mb-0.5 leading-tight">
          {product.name}
        </h3>

        {/* Tagline */}
        <p className="font-body text-xs text-earthen-rust/50 italic mb-3">{product.tagline}</p>

        {/* Divider with makhana ball */}
        <div className="flex items-center gap-2 mb-3">
          <div className="h-px flex-1 bg-earthen-rust/10" />
          <svg width="8" height="8" viewBox="0 0 30 30" fill="none">
            <circle cx="15" cy="15" r="13" fill="#f3a213" opacity="0.7" />
            <circle cx="10" cy="10" r="2.5" fill="#7a5c30" opacity="0.35" />
            <ellipse cx="10" cy="10" rx="4" ry="2.5" fill="white" opacity="0.3" transform="rotate(-20 10 10)" />
          </svg>
          <div className="h-px flex-1 bg-earthen-rust/10" />
        </div>

        {/* Weights */}
        <div className="flex gap-2 mb-4">
          {product.weights.map((w) => (
            <span key={w} className="font-body text-xs font-semibold px-2.5 py-1 rounded-full border border-earthen-rust/15 text-earthen-rust/55">
              {w}
            </span>
          ))}
        </div>

        {/* Price + Buttons */}
        <div className="flex items-center justify-between mt-auto">
          <div>
            <span className="font-display font-bold text-2xl text-earthen-rust">₹{product.price}</span>
            <span className="font-body text-xs text-earthen-rust/35 ml-1.5 line-through">
              ₹{Math.round(product.price * 1.2)}
            </span>
          </div>
          <div className="flex gap-2">
            <motion.button
              whileHover={product.stock !== 'out' ? { scale: 1.12 } : {}}
              whileTap={product.stock !== 'out' ? { scale: 0.95 } : {}}
              onClick={product.stock !== 'out' ? handleAddToCart : undefined}
              disabled={product.stock === 'out'}
              className="w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
              style={{
                borderColor: added ? '#009846' : product.color + '40',
                backgroundColor: added ? '#009846' : '',
                color: added ? '#fff' : product.color,
              }}
              onMouseEnter={(e) => { if (!added && product.stock !== 'out') { (e.currentTarget as HTMLElement).style.backgroundColor = product.color; (e.currentTarget as HTMLElement).style.color = '#fff'; } }}
              onMouseLeave={(e) => { if (!added && product.stock !== 'out') { (e.currentTarget as HTMLElement).style.backgroundColor = ''; (e.currentTarget as HTMLElement).style.color = product.color; } }}
              aria-label="Add to cart"
            >
              {added ? <Check size={13} /> : <ShoppingCart size={14} />}
            </motion.button>
            <Link href={`/products/${product.slug}`}>
              <motion.div
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.95 }}
                className="w-9 h-9 rounded-full text-white flex items-center justify-center transition-all duration-200"
                style={{ backgroundColor: product.color }}
                aria-label="View details"
              >
                <Eye size={14} />
              </motion.div>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
