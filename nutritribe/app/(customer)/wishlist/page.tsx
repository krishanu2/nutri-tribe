'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { products } from '@/lib/products';
import ProductCard from '@/components/ProductCard';
import { useWishlist } from '@/lib/wishlistContext';

export default function WishlistPage() {
  const { slugs } = useWishlist();
  const wishlisted = products.filter((p) => slugs.includes(p.slug));

  return (
    <section className="pt-32 pb-20 bg-ivory-grain min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <p className="font-body font-bold text-xs tracking-[0.3em] uppercase text-sun-harvest mb-2">
            Saved For Later
          </p>
          <h1 className="font-display font-bold text-4xl md:text-5xl text-earthen-rust">
            Your Wishlist
          </h1>
        </motion.div>

        {wishlisted.length === 0 ? (
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
            <Link href="/products">
              <motion.div
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="font-body font-bold text-sm px-8 py-3.5 rounded-full text-white tracking-wide bg-sun-harvest"
              >
                Explore Products
              </motion.div>
            </Link>
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
  );
}
