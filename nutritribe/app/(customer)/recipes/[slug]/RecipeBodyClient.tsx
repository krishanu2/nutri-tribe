'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Clock, Users, ArrowRight } from 'lucide-react';
import type { Recipe, Product } from '@prisma/client';

const ACCENT = '#009846';

export default function RecipeBodyClient({ recipe, relatedProducts }: { recipe: Recipe; relatedProducts: Product[] }) {
  return (
    <>
      {/* ══════════════════════════════════════════════
          HERO
          ══════════════════════════════════════════════ */}
      <section className="relative min-h-[45vh] flex flex-col items-end overflow-hidden">
        <div className="absolute inset-0">
          <Image src={recipe.coverImage} alt={recipe.title} fill className="object-cover" priority />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(2,40,18,0.3) 0%, rgba(5,1,0,0.85) 100%)' }} />
        </div>

        <div className="relative z-10 w-full px-6 pt-36 pb-12 max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex gap-3 mb-4">
            <span className="inline-flex items-center gap-1.5 font-body text-xs font-semibold px-3 py-1.5 rounded-full"
              style={{ background: 'rgba(255,255,255,0.1)', color: '#fdfbf7' }}>
              <Clock size={13} /> {recipe.prepTime}
            </span>
            <span className="inline-flex items-center gap-1.5 font-body text-xs font-semibold px-3 py-1.5 rounded-full"
              style={{ background: 'rgba(255,255,255,0.1)', color: '#fdfbf7' }}>
              <Users size={13} /> Serves {recipe.servings}
            </span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display font-bold leading-tight mb-3" style={{ fontSize: 'clamp(32px, 5.5vw, 64px)', color: '#fdfbf7' }}>
            {recipe.title}
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.3 }}
            className="font-body text-base max-w-xl" style={{ color: 'rgba(253,251,247,0.55)' }}>
            {recipe.description}
          </motion.p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          CONTENT
          ══════════════════════════════════════════════ */}
      <section style={{ background: '#fdfbf7' }}>
        <div className="max-w-5xl mx-auto px-6 py-16">
          <Link href="/recipes"
            className="inline-flex items-center gap-2 font-body text-sm text-earthen-rust/50 hover:text-[#009846] transition-colors mb-10">
            <ArrowLeft size={14} />
            Back to Recipes
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Ingredients */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
              className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-earthen-rust/8 p-6 sticky top-24">
                <h2 className="font-display font-bold text-xl text-earthen-rust mb-4">Ingredients</h2>
                <ul className="space-y-3">
                  {recipe.ingredients.map((ing, i) => (
                    <motion.li key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: Math.min(i, 8) * 0.05 }}
                      className="flex items-start gap-3 font-body text-sm text-earthen-rust/70">
                      <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: ACCENT }} />
                      {ing}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Steps */}
            <div className="lg:col-span-2">
              <h2 className="font-display font-bold text-xl text-earthen-rust mb-6">Method</h2>
              <ol className="space-y-6">
                {recipe.steps.map((step, i) => (
                  <motion.li key={i}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: Math.min(i, 8) * 0.07 }}
                    className="flex gap-4">
                    <motion.span
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ type: 'spring', stiffness: 300, damping: 18, delay: Math.min(i, 8) * 0.07 + 0.1 }}
                      className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center font-display font-bold text-sm text-white"
                      style={{ background: ACCENT }}>
                      {i + 1}
                    </motion.span>
                    <p className="font-body text-base leading-relaxed text-earthen-rust/75 pt-1">{step}</p>
                  </motion.li>
                ))}
              </ol>
            </div>
          </div>

          {/* Shop the ingredients */}
          {relatedProducts.length > 0 && (
            <div className="mt-16">
              <h2 className="font-display font-bold text-2xl text-earthen-rust mb-6">Shop the Ingredients</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedProducts.map((product, i) => (
                  <motion.div key={product.slug}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
                  >
                    <Link
                      href={`/products/${product.slug}`}
                      className="group flex items-center gap-4 p-4 rounded-2xl border border-earthen-rust/8 bg-white hover:border-[#009846]/40 transition-all"
                    >
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0" style={{ background: `${product.color}14` }}>
                        <Image src={product.image} alt={product.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-display font-bold text-base text-earthen-rust leading-tight">{product.name}</h3>
                        <p className="font-body text-xs text-earthen-rust/50">₹{product.price}</p>
                      </div>
                      <ArrowRight size={16} className="text-earthen-rust/30 group-hover:text-[#009846] transition-colors flex-shrink-0" />
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
