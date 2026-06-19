'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar } from 'lucide-react';
import type { BlogPost } from '@prisma/client';

const ACCENT = '#f3a213';

export default function BlogPostBodyClient({ post, paragraphs }: { post: BlogPost; paragraphs: string[] }) {
  return (
    <>
      {/* ══════════════════════════════════════════════
          HERO
          ══════════════════════════════════════════════ */}
      <section className="relative min-h-[45vh] flex flex-col items-end overflow-hidden">
        <div className="absolute inset-0">
          <Image src={post.coverImage} alt={post.title} fill className="object-cover" priority />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(5,1,0,0.3) 0%, rgba(5,1,0,0.85) 100%)' }} />
        </div>

        <div className="relative z-10 w-full px-6 pt-36 pb-12 max-w-4xl mx-auto">
          {post.tags.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex gap-2 flex-wrap mb-4">
              {post.tags.map((tag) => (
                <span key={tag} className="font-body text-[10px] font-bold tracking-[0.18em] uppercase px-2.5 py-1 rounded-full"
                  style={{ background: `${ACCENT}22`, color: ACCENT }}>
                  {tag}
                </span>
              ))}
            </motion.div>
          )}
          <motion.h1 initial={{ opacity: 0, y: 20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display font-bold leading-tight mb-3" style={{ fontSize: 'clamp(32px, 5.5vw, 64px)', color: '#fdfbf7' }}>
            {post.title}
          </motion.h1>
          {post.publishedAt && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.3 }}
              className="font-body text-sm flex items-center gap-2" style={{ color: 'rgba(253,251,247,0.5)' }}>
              <Calendar size={14} />
              {new Date(post.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </motion.p>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          CONTENT
          ══════════════════════════════════════════════ */}
      <section style={{ background: '#fdfbf7' }}>
        <div className="max-w-3xl mx-auto px-6 py-16">
          <Link href="/blog"
            className="inline-flex items-center gap-2 font-body text-sm text-earthen-rust/50 hover:text-[#f3a213] transition-colors mb-10">
            <ArrowLeft size={14} />
            Back to Journal
          </Link>

          <div className="space-y-6">
            {paragraphs.map((p, i) => (
              <motion.p key={i}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: Math.min(i, 6) * 0.06 }}
                className="font-body text-base leading-relaxed text-earthen-rust/75">
                {p}
              </motion.p>
            ))}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-16 p-8 rounded-2xl text-center"
            style={{ background: 'linear-gradient(135deg, #1a0e0a 0%, #0d0500 100%)' }}
          >
            <p className="font-display italic text-xl mb-4" style={{ color: ACCENT }}>
              Ready to taste the tradition?
            </p>
            <Link href="/products">
              <motion.span whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                className="inline-flex font-body font-bold text-sm px-8 py-3.5 rounded-full text-white tracking-wide"
                style={{ background: ACCENT, color: '#050100', boxShadow: `0 8px 24px ${ACCENT}40` }}>
                Shop the Collection →
              </motion.span>
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
