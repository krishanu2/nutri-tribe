'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, ShoppingBag, Search, Heart, ShoppingCart } from 'lucide-react';
import { useCart } from '@/lib/cartContext';
import { useWishlist } from '@/lib/wishlistContext';
import { useSearch } from '@/lib/searchContext';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { totalItems, openCart } = useCart();
  const { slugs } = useWishlist();
  const { openSearch } = useSearch();

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname === href || pathname?.startsWith(href + '/');

  const tabs = [
    { label: 'Home',     href: '/',          icon: Home },
    { label: 'Shop',     href: '/products',  icon: ShoppingBag },
    { label: 'Wishlist', href: '/wishlist',  icon: Heart, badge: slugs.length },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-[940] flex items-stretch"
      style={{
        background: 'rgba(7,1,0,0.96)',
        backdropFilter: 'blur(22px)',
        borderTop: '1px solid rgba(243,162,19,0.12)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      {tabs.map(({ label, href, icon: Icon, badge }) => {
        const active = isActive(href);
        return (
          <Link key={label} href={href} className="relative flex-1 flex flex-col items-center justify-center gap-1 py-2.5">
            {active && (
              <motion.div layoutId="bottom-nav-active" className="absolute top-1 w-8 h-8 rounded-full"
                style={{ background: 'rgba(243,162,19,0.12)' }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }} />
            )}
            <div className="relative z-10">
              <Icon size={18} style={{ color: active ? '#f3a213' : 'rgba(253,251,247,0.5)' }} />
              {!!badge && badge > 0 && (
                <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-sun-harvest flex items-center justify-center font-body font-bold text-[8px] text-white">
                  {badge > 9 ? '9+' : badge}
                </span>
              )}
            </div>
            <span className="relative z-10 font-body font-medium text-[10px]" style={{ color: active ? '#f3a213' : 'rgba(253,251,247,0.45)' }}>
              {label}
            </span>
          </Link>
        );
      })}

      {/* Search — opens overlay */}
      <button onClick={openSearch} className="relative flex-1 flex flex-col items-center justify-center gap-1 py-2.5">
        <Search size={18} style={{ color: 'rgba(253,251,247,0.5)' }} />
        <span className="font-body font-medium text-[10px]" style={{ color: 'rgba(253,251,247,0.45)' }}>
          Search
        </span>
      </button>

      {/* Cart — opens drawer instead of navigating */}
      <button onClick={openCart} className="relative flex-1 flex flex-col items-center justify-center gap-1 py-2.5">
        <div className="relative">
          <ShoppingCart size={18} style={{ color: 'rgba(253,251,247,0.5)' }} />
          {totalItems > 0 && (
            <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-sun-harvest flex items-center justify-center font-body font-bold text-[8px] text-white">
              {totalItems > 9 ? '9+' : totalItems}
            </span>
          )}
        </div>
        <span className="font-body font-medium text-[10px]" style={{ color: 'rgba(253,251,247,0.45)' }}>
          Cart
        </span>
      </button>
    </nav>
  );
}
