'use client';

import { useState } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Star, ShoppingCart, Zap, ChevronDown, ChevronUp, ArrowLeft, Leaf, Award, Shield } from 'lucide-react';
import { products, getProductBySlug } from '@/lib/products';
import ProductCard from '@/components/ProductCard';
import Badge from '@/components/ui/Badge';
import MakhanaScene from '@/components/illustrations/MakhanaScene';
import { useCart } from '@/lib/cartContext';

interface PageProps {
  params: { slug: string };
}

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={14} className={i < count ? 'fill-sun-harvest text-sun-harvest' : 'text-earthen-rust/20'} />
      ))}
    </div>
  );
}

function Accordion({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-earthen-rust/10">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 font-body font-semibold text-sm text-earthen-rust hover:text-sun-harvest transition-colors"
      >
        {title}
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="pb-4 font-body text-sm text-earthen-rust/70 leading-relaxed">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ProductDetailPage({ params }: PageProps) {
  const product = getProductBySlug(params.slug);
  const router = useRouter();
  const { addToCart } = useCart();

  const [selectedWeight, setSelectedWeight] = useState(product?.weights[0] ?? '50g');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) return notFound();

  const related = products.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 3);

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      weight: selectedWeight,
      price: product.price,
      color: product.color,
      category: product.category,
    }, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      weight: selectedWeight,
      price: product.price,
      color: product.color,
      category: product.category,
    }, quantity);
    router.push('/checkout');
  };

  return (
    <>
      {/* Breadcrumb */}
      <div className="pt-32 pb-4 bg-ivory-grain border-b border-earthen-rust/10">
        <div className="max-w-7xl mx-auto px-6">
          <Link href="/products" className="inline-flex items-center gap-2 font-body text-sm text-earthen-rust/60 hover:text-sun-harvest transition-colors">
            <ArrowLeft size={14} />
            Back to Products
          </Link>
        </div>
      </div>

      {/* Main layout */}
      <section className="py-12 bg-ivory-grain">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* LEFT — Product Visual */}
            <div className="space-y-4">
              {/* Main illustrated panel */}
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative aspect-square rounded-3xl overflow-hidden shadow-hover"
                style={{ backgroundColor: product.color + '14', border: `2px solid ${product.color}25` }}
              >
                {/* Radial glow */}
                <div className="absolute inset-0"
                  style={{ background: `radial-gradient(ellipse at 35% 30%, ${product.color}22 0%, transparent 65%)` }} />

                {/* Makhana illustration */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.4 }}
                  className="relative z-10 p-8 h-full"
                >
                  <MakhanaScene className="w-full h-full" />
                </motion.div>

                {product.badge && (
                  <div className="absolute top-4 left-4 z-20">
                    <Badge>{product.badge}</Badge>
                  </div>
                )}

                {/* Category color tag */}
                <div className="absolute bottom-4 right-4 z-20 font-body font-bold text-xs tracking-widest uppercase text-white px-3 py-1.5 rounded-full"
                  style={{ backgroundColor: product.color }}>
                  {product.category}
                </div>
              </motion.div>

              {/* Feature tags */}
              <div className="flex flex-wrap gap-2">
                {product.features.slice(0, 4).map((f) => (
                  <span key={f} className="font-body text-xs font-semibold px-3 py-1.5 rounded-full border border-earthen-rust/15 text-earthen-rust/60 bg-white">
                    ✦ {f}
                  </span>
                ))}
              </div>
            </div>

            {/* RIGHT — Details */}
            <div className="lg:sticky lg:top-32 lg:self-start space-y-6">
              {/* Category badge */}
              <div
                className="inline-block font-body font-bold text-xs tracking-widest uppercase px-4 py-1.5 rounded-full text-white"
                style={{ backgroundColor: product.color }}
              >
                {product.category}
              </div>

              {/* Name & tagline */}
              <div>
                <h1 className="font-display font-bold text-4xl md:text-5xl text-earthen-rust leading-tight">
                  {product.name}
                </h1>
                <p className="font-body italic text-sun-harvest text-lg mt-2">{product.tagline}</p>
              </div>

              {/* Stars */}
              <div className="flex items-center gap-3">
                <StarRating count={5} />
                <span className="font-body text-sm text-earthen-rust/60">4.9 (128 reviews)</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="font-display font-bold text-5xl text-earthen-rust">₹{product.price}</span>
                <span className="font-body text-sm text-earthen-rust/40 line-through">₹{Math.round(product.price * 1.2)}</span>
                <span className="font-body text-sm font-bold text-sacred-leaf bg-sacred-leaf/10 px-2 py-0.5 rounded">17% OFF</span>
              </div>

              {/* Weight selector */}
              <div>
                <p className="font-body font-semibold text-xs tracking-widest uppercase text-earthen-rust/60 mb-3">
                  Pack Size
                </p>
                <div className="flex gap-3">
                  {product.weights.map((w) => (
                    <button
                      key={w}
                      onClick={() => setSelectedWeight(w)}
                      className={`font-body font-bold text-sm px-5 py-2.5 rounded-xl border-2 transition-all duration-200 ${
                        selectedWeight === w
                          ? 'bg-earthen-rust text-white border-earthen-rust'
                          : 'bg-transparent text-earthen-rust border-earthen-rust/30 hover:border-earthen-rust'
                      }`}
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div>
                <p className="font-body font-semibold text-xs tracking-widest uppercase text-earthen-rust/60 mb-3">
                  Quantity
                </p>
                <div className="flex items-center gap-0 border-2 border-earthen-rust/20 rounded-xl w-fit overflow-hidden">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-11 h-11 flex items-center justify-center font-body font-bold text-earthen-rust hover:bg-earthen-rust/5 transition-colors text-xl"
                  >
                    −
                  </button>
                  <span className="w-12 text-center font-body font-bold text-earthen-rust">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-11 h-11 flex items-center justify-center font-body font-bold text-earthen-rust hover:bg-earthen-rust/5 transition-colors text-xl"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  className={`w-full flex items-center justify-center gap-3 font-body font-bold text-sm py-4 rounded-2xl transition-all duration-300 tracking-wide uppercase ${
                    added
                      ? 'bg-sacred-leaf text-white'
                      : 'bg-sun-harvest text-white hover:brightness-110'
                  }`}
                >
                  <motion.div
                    animate={added ? { rotate: [0, -10, 10, -10, 0] } : {}}
                    transition={{ duration: 0.4 }}
                  >
                    <ShoppingCart size={18} />
                  </motion.div>
                  {added ? '✓ Added to Cart!' : 'Add to Cart'}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleBuyNow}
                  className="w-full flex items-center justify-center gap-3 bg-earthen-rust text-white font-body font-bold text-sm py-4 rounded-2xl hover:bg-earthen-rust/90 transition-all tracking-wide uppercase"
                >
                  <Zap size={18} />
                  Buy Now
                </motion.button>
              </div>

              {/* Delivery badge */}
              <div className="flex items-center gap-3 p-4 bg-sacred-leaf/5 rounded-xl border border-sacred-leaf/20">
                <Leaf size={16} className="text-sacred-leaf flex-shrink-0" />
                <p className="font-body text-xs text-sacred-leaf font-semibold">
                  Free delivery on orders above ₹499. Usually dispatched within 24 hours.
                </p>
              </div>

              {/* Accordion */}
              <div className="pt-4">
                <Accordion title="Why You'll Love It">
                  <ul className="space-y-2">
                    {product.features.map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <span className="text-sun-harvest mt-0.5">✦</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </Accordion>

                <Accordion title="Description">
                  <p>{product.description}</p>
                </Accordion>

                <Accordion title="Ingredients & Nutrition">
                  <p>Fox Nuts (Makhana), natural spices and seasonings (variant-specific), rock salt. No artificial preservatives, no added MSG, no artificial colours.</p>
                  <p className="mt-2 font-semibold text-earthen-rust">Per 100g: Protein 9–15g | Fat 0.1g | Carbs 77g | Calories 347 kcal</p>
                </Accordion>

                <Accordion title="Storage Tips">
                  <p>Store in a cool, dry place away from direct sunlight. Best consumed within 3 months of manufacturing. Once opened, reseal tightly and consume within 7 days for best crunch.</p>
                </Accordion>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why NutriTribe */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Leaf, title: 'Hand-Roasted', desc: 'Small-batch roasting preserves every bit of nutrition and crunch.' },
              { icon: Award, title: 'Ethically Sourced', desc: 'Directly from Mallah farmers of the Mithila wetlands in Bihar.' },
              { icon: Shield, title: 'No Preservatives', desc: '100% natural. What you see is what you get — nothing hidden.' },
            ].map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="text-center p-8 rounded-3xl border border-earthen-rust/10 hover:shadow-card transition-shadow"
              >
                <div className="w-14 h-14 rounded-2xl bg-sun-harvest/10 flex items-center justify-center mx-auto mb-5">
                  <Icon size={24} className="text-sun-harvest" />
                </div>
                <h3 className="font-display font-bold text-xl text-earthen-rust mb-2">{title}</h3>
                <p className="font-body text-sm text-earthen-rust/60 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="py-16 bg-ivory-grain">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="font-display font-bold text-3xl text-earthen-rust mb-10">You Might Also Love</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
