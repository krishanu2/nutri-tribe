'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { Product } from '@/lib/products';
import ProductCard from '@/components/ProductCard';
import { useWishlist } from '@/lib/wishlistContext';
import Button from '@/components/ui/Button';

export default function WishlistPage() {
  const { slugs } = useWishlist();
  const [wishlisted, setWishlisted] = useState<Product[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (slugs.length === 0) {
      setWishlisted([]);
      setLoaded(true);
      return;
    }
    fetch(`/api/products?slugs=${slugs.join(',')}`)
      .then((r) => r.json())
      .then((data) => setWishlisted(data.products ?? []))
      .catch(() => setWishlisted([]))
      .finally(() => setLoaded(true));
  }, [slugs]);

  return (
    <>
      {/* Slim watermark hero band — keeps Wishlist visually in step with Blog/Recipes/B2B without the full-height treatment of a utility page */}
      <section className="relative overflow-hidden pt-32 pb-10" style={{ background: 'linear-gradient(155deg, #1a0e0a 0%, #0d0500 100%)' }}>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden" aria-hidden>
          <motion.span className="font-display font-bold italic"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2 }}
            style={{ fontSize: 'clamp(70px, 16vw, 200px)', color: 'rgba(243,162,19,0.06)', letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>
            Wishlist
          </motion.span>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="font-body font-bold text-xs tracking-[0.3em] uppercase mb-2" style={{ color: '#f3a213' }}>
              Saved For Later
            </p>
            <h1 className="font-display font-bold text-4xl md:text-5xl" style={{ color: '#fdfbf7' }}>
              Your Wishlist
            </h1>
          </motion.div>
        </div>
      </section>

      <section className="pt-10 pb-20 bg-ivory-grain min-h-screen">
        <div className="max-w-7xl mx-auto px-6">
          {!loaded ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="rounded-3xl border border-earthen-rust/10 bg-white overflow-hidden animate-pulse">
                  <div className="aspect-square bg-earthen-rust/5" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-earthen-rust/10 rounded-full w-3/4" />
                    <div className="h-4 bg-earthen-rust/10 rounded-full w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : wishlisted.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex flex-col items-center justify-center text-center py-24 rounded-3xl border border-earthen-rust/10 bg-white"
            >
              <div className="w-16 h-16 rounded-full bg-earthen-rust/5 flex items-center justify-center mb-6">
                <Heart size={28} className="text-earthen-rust/30" />
              </div>
              <h2 className="font-display font-bold text-2xl text-earthen-rust mb-2">
                Your wishlist is empty
              </h2>
              <p className="font-body text-sm text-earthen-rust/60 max-w-sm mb-8">
                Tap the heart on any product to save it here for later.
              </p>
              <Button href="/products" size="lg">Explore Products</Button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {wishlisted.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
