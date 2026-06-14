'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface WishlistContextType {
  slugs: string[];
  isWishlisted: (slug: string) => boolean;
  toggleWishlist: (slug: string) => void;
}

const WishlistContext = createContext<WishlistContextType | null>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [slugs, setSlugs] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('nt-wishlist');
      if (saved) setSlugs(JSON.parse(saved));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem('nt-wishlist', JSON.stringify(slugs));
    } catch {}
  }, [slugs, hydrated]);

  const isWishlisted = useCallback((slug: string) => slugs.includes(slug), [slugs]);

  const toggleWishlist = useCallback((slug: string) => {
    setSlugs(prev => prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]);
  }, []);

  return (
    <WishlistContext.Provider value={{ slugs, isWishlisted, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
}
