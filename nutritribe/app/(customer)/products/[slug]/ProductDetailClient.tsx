'use client';

import { useState, useRef, useEffect } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Star, ShoppingCart, Zap, ChevronDown, ChevronUp, ArrowLeft, Leaf, Award, Shield, Heart, ZoomIn, Loader2, CheckCircle, MessageSquare } from 'lucide-react';
import { products, getProductBySlug } from '@/lib/products';
import ProductCard from '@/components/ProductCard';
import Badge from '@/components/ui/Badge';
import StockBadge from '@/components/ui/StockBadge';
import MakhanaScene from '@/components/illustrations/MakhanaScene';
import { useCart } from '@/lib/cartContext';
import { useWishlist } from '@/lib/wishlistContext';

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

function ZoomableImage({ src, alt }: { src: string; alt: string }) {
  const [origin, setOrigin] = useState('50% 50%');
  const [zoomed, setZoomed] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setOrigin(`${x}% ${y}%`);
  };

  return (
    <div
      ref={ref}
      className="relative w-full h-full overflow-hidden cursor-zoom-in"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setZoomed(true)}
      onMouseLeave={() => setZoomed(false)}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover transition-transform duration-200"
        style={{ transformOrigin: origin, transform: zoomed ? 'scale(2)' : 'scale(1)' }}
        sizes="(max-width: 1024px) 100vw, 50vw"
      />
      {!zoomed && (
        <div className="absolute bottom-4 right-4 z-20 w-9 h-9 rounded-full flex items-center justify-center bg-white/80 backdrop-blur-sm">
          <ZoomIn size={16} className="text-earthen-rust/60" />
        </div>
      )}
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

interface ReviewItem {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <button key={i} type="button" onClick={() => onChange(i + 1)} aria-label={`Rate ${i + 1} stars`}>
          <Star size={24} className={i < value ? 'fill-sun-harvest text-sun-harvest' : 'text-earthen-rust/20'} />
        </button>
      ))}
    </div>
  );
}

function ProductReviews({ productSlug, productColor }: { productSlug: string; productColor: string }) {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [average, setAverage] = useState(0);
  const [count, setCount] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const [name, setName] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const fetchReviews = () => {
    fetch(`/api/reviews?product=${productSlug}`)
      .then((r) => r.json())
      .then((data) => {
        setReviews(data.reviews ?? []);
        setAverage(data.average ?? 0);
        setCount(data.count ?? 0);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  };

  useEffect(() => { fetchReviews(); }, [productSlug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim() || rating === 0) {
      setError('Please add a rating, your name, and a comment.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productSlug, customerName: name.trim(), rating, comment: comment.trim() }),
      });
      if (!res.ok) throw new Error('Failed');
      setSubmitted(true);
      setName('');
      setRating(0);
      setComment('');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-16 bg-ivory-grain">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Summary + list */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-4 mb-8">
              <h2 className="font-display font-bold text-3xl text-earthen-rust">Customer Reviews</h2>
              {count > 0 && (
                <span className="font-body text-sm text-earthen-rust/60">
                  {average.toFixed(1)} ★ · {count} review{count !== 1 ? 's' : ''}
                </span>
              )}
            </div>

            {loaded && reviews.length === 0 && (
              <div className="flex flex-col items-center text-center py-12 rounded-2xl border border-earthen-rust/10 bg-white">
                <MessageSquare size={28} className="text-earthen-rust/25 mb-3" />
                <p className="font-body text-sm text-earthen-rust/50">
                  No reviews yet. Be the first to share your experience!
                </p>
              </div>
            )}

            <div className="space-y-4">
              {reviews.map((r) => (
                <div key={r.id} className="p-5 rounded-2xl border border-earthen-rust/10 bg-white">
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <p className="font-display font-bold text-base text-earthen-rust">{r.customerName}</p>
                    <span className="font-body text-xs text-earthen-rust/40">
                      {new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <div className="flex gap-0.5 mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={14} className={i < r.rating ? 'fill-sun-harvest text-sun-harvest' : 'text-earthen-rust/15'} />
                    ))}
                  </div>
                  <p className="font-body text-sm text-earthen-rust/70 leading-relaxed">{r.comment}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Write a review */}
          <div>
            <div className="p-6 rounded-2xl border border-earthen-rust/10 bg-white lg:sticky lg:top-32">
              <h3 className="font-display font-bold text-xl text-earthen-rust mb-4">Write a Review</h3>

              {submitted ? (
                <div className="flex flex-col items-center text-center py-6">
                  <CheckCircle size={28} className="text-sacred-leaf mb-3" />
                  <p className="font-body text-sm text-earthen-rust/70">
                    Thanks for sharing! Your review will appear once approved.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <p className="font-body font-semibold text-xs tracking-widest uppercase text-earthen-rust/60 mb-2">
                      Your Rating
                    </p>
                    <StarPicker value={rating} onChange={setRating} />
                  </div>
                  <div>
                    <label className="block font-body font-semibold text-xs tracking-widest uppercase text-earthen-rust/60 mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Priya Sharma"
                      className="w-full font-body text-sm text-earthen-rust bg-ivory-grain border-2 border-earthen-rust/15 rounded-xl px-4 py-2.5 outline-none focus:border-sun-harvest transition-all placeholder-earthen-rust/25"
                    />
                  </div>
                  <div>
                    <label className="block font-body font-semibold text-xs tracking-widest uppercase text-earthen-rust/60 mb-2">
                      Your Review
                    </label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows={4}
                      placeholder="Tell us what you think..."
                      className="w-full font-body text-sm text-earthen-rust bg-ivory-grain border-2 border-earthen-rust/15 rounded-xl px-4 py-2.5 outline-none focus:border-sun-harvest transition-all resize-none placeholder-earthen-rust/25"
                    />
                  </div>

                  {error && (
                    <p className="font-body text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
                  )}

                  <motion.button
                    type="submit"
                    disabled={submitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center gap-2 font-body font-bold text-sm py-3.5 rounded-xl text-white tracking-wide uppercase transition-all"
                    style={{ background: productColor }}
                  >
                    {submitting && <Loader2 size={14} className="animate-spin" />}
                    Submit Review
                  </motion.button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function ProductDetailPage({ params }: PageProps) {
  const product = getProductBySlug(params.slug);
  const router = useRouter();
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const [selectedWeight, setSelectedWeight] = useState(product?.weights[0] ?? '50g');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [ratingSummary, setRatingSummary] = useState({ average: 0, count: 0 });

  useEffect(() => {
    if (!product) return;
    fetch(`/api/reviews?product=${product.slug}`)
      .then((r) => r.json())
      .then((data) => setRatingSummary({ average: data.average ?? 0, count: data.count ?? 0 }))
      .catch(() => {});
  }, [product?.slug]);

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
              {/* Main gallery panel */}
              <motion.div
                key={activeSlide}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="relative aspect-square rounded-3xl overflow-hidden shadow-hover"
                style={{ backgroundColor: product.color + '14', border: `2px solid ${product.color}25` }}
              >
                {activeSlide === 0 ? (
                  <>
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
                  </>
                ) : (
                  <ZoomableImage src={product.images[activeSlide - 1]} alt={`${product.name} — view ${activeSlide}`} />
                )}

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

              {/* Thumbnail strip */}
              <div className="flex gap-3">
                <button
                  onClick={() => setActiveSlide(0)}
                  className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 transition-all"
                  style={{
                    backgroundColor: product.color + '14',
                    border: activeSlide === 0 ? `2px solid ${product.color}` : '2px solid transparent',
                  }}
                  aria-label="Illustration view"
                >
                  <div className="p-2 w-full h-full">
                    <MakhanaScene className="w-full h-full" />
                  </div>
                </button>
                {product.images.map((img, i) => (
                  <button
                    key={img}
                    onClick={() => setActiveSlide(i + 1)}
                    className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 transition-all"
                    style={{ border: activeSlide === i + 1 ? `2px solid ${product.color}` : '2px solid transparent' }}
                    aria-label={`Product photo ${i + 1}`}
                  >
                    <Image src={img} alt={`${product.name} thumbnail ${i + 1}`} fill className="object-cover" sizes="80px" />
                  </button>
                ))}
              </div>

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
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="font-display font-bold text-4xl md:text-5xl text-earthen-rust leading-tight">
                    {product.name}
                  </h1>
                  <p className="font-body italic text-sun-harvest text-lg mt-2">{product.tagline}</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => toggleWishlist(product.slug)}
                  className="shrink-0 w-12 h-12 rounded-full flex items-center justify-center bg-white border border-earthen-rust/10 shadow-sm transition-colors mt-2"
                  aria-label={isWishlisted(product.slug) ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  <Heart size={20} className={isWishlisted(product.slug) ? 'fill-red-500 text-red-500' : 'text-earthen-rust/40'} />
                </motion.button>
              </div>

              {/* Stars + stock */}
              <div className="flex items-center gap-3 flex-wrap">
                <StarRating count={Math.round(ratingSummary.average)} />
                <span className="font-body text-sm text-earthen-rust/60">
                  {ratingSummary.count > 0
                    ? `${ratingSummary.average.toFixed(1)} (${ratingSummary.count} review${ratingSummary.count !== 1 ? 's' : ''})`
                    : 'No reviews yet'}
                </span>
                <span className="text-earthen-rust/20">|</span>
                <StockBadge stock={product.stock} />
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
                  whileHover={product.stock !== 'out' ? { scale: 1.02 } : {}}
                  whileTap={product.stock !== 'out' ? { scale: 0.98 } : {}}
                  onClick={product.stock !== 'out' ? handleAddToCart : undefined}
                  disabled={product.stock === 'out'}
                  className={`w-full flex items-center justify-center gap-3 font-body font-bold text-sm py-4 rounded-2xl transition-all duration-300 tracking-wide uppercase disabled:opacity-40 disabled:cursor-not-allowed ${
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
                  {added ? '✓ Added to Cart!' : product.stock === 'out' ? 'Out of Stock' : 'Add to Cart'}
                </motion.button>

                <motion.button
                  whileHover={product.stock !== 'out' ? { scale: 1.02 } : {}}
                  whileTap={product.stock !== 'out' ? { scale: 0.98 } : {}}
                  onClick={product.stock !== 'out' ? handleBuyNow : undefined}
                  disabled={product.stock === 'out'}
                  className="w-full flex items-center justify-center gap-3 bg-earthen-rust text-white font-body font-bold text-sm py-4 rounded-2xl hover:bg-earthen-rust/90 transition-all tracking-wide uppercase disabled:opacity-40 disabled:cursor-not-allowed"
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
                  <p className="mt-2 font-semibold text-earthen-rust">Per 100g: Protein 10g | Fat 0.1g | Carbs 77g | Calories 347 kcal</p>
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

      {/* Customer Reviews */}
      <ProductReviews productSlug={product.slug} productColor={product.color} />

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
