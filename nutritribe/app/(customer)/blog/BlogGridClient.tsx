'use client';

import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Newspaper } from 'lucide-react';
import type { BlogPost } from '@prisma/client';

const ACCENT = '#f3a213';

function PostCard({ post, i }: { post: BlogPost; i: number }) {
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const glowX = useSpring(useTransform(mx, [0, 1], [0, 100]), { stiffness: 200, damping: 20 });
  const glowY = useSpring(useTransform(my, [0, 1], [0, 100]), { stiffness: 200, damping: 20 });
  const glare = useMotionTemplate`radial-gradient(circle at ${glowX}% ${glowY}%, rgba(255,255,255,0.35) 0%, transparent 60%)`;

  const onMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width);
    my.set((e.clientY - rect.top) / rect.height);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: i * 0.08 }}
    >
      <Link
        href={`/blog/${post.slug}`}
        onMouseMove={onMove}
        className="group relative rounded-2xl overflow-hidden shadow-card hover:shadow-hover transition-shadow duration-300 flex flex-col bg-white border border-earthen-rust/6"
      >
        <motion.div className="absolute inset-0 z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ backgroundImage: glare }} />
        <div className="relative h-52 overflow-hidden">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div className="flex-1 flex flex-col p-6">
          {post.tags.length > 0 && (
            <div className="flex gap-2 flex-wrap mb-3">
              {post.tags.map((tag) => (
                <span key={tag} className="font-body text-[10px] font-bold tracking-[0.18em] uppercase px-2.5 py-1 rounded-full"
                  style={{ background: `${ACCENT}14`, color: ACCENT }}>
                  {tag}
                </span>
              ))}
            </div>
          )}
          <h2 className="font-display font-bold text-xl text-earthen-rust mb-2 leading-tight">
            {post.title}
          </h2>
          <p className="font-body text-sm text-earthen-rust/55 leading-relaxed mb-4 flex-1">
            {post.excerpt}
          </p>
          <span className="inline-flex items-center gap-1.5 font-body font-bold text-xs uppercase tracking-wider"
            style={{ color: ACCENT }}>
            Read More <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

export default function BlogGridClient({ posts }: { posts: BlogPost[] }) {
  return (
    <>
      {/* ══════════════════════════════════════════════
          HERO
          ══════════════════════════════════════════════ */}
      <section
        className="relative min-h-[50vh] flex flex-col items-center justify-center overflow-hidden"
        style={{ background: 'linear-gradient(155deg, #1a0e0a 0%, #0d0500 60%, #050100 100%)' }}
      >
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden" aria-hidden>
          <motion.span className="font-display font-bold italic"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2 }}
            style={{ fontSize: 'clamp(80px, 20vw, 260px)', color: 'rgba(243,162,19,0.06)', letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>
            Journal
          </motion.span>
        </div>

        <div className="relative z-10 text-center px-6 pt-36 pb-24">
          <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="flex justify-center mb-8">
            <div className="relative" style={{ width: 140, height: 40 }}>
              <Image src="/logo.png" alt="NutriTribe" fill className="object-contain" style={{ filter: 'brightness(0) invert(1)' }} priority />
            </div>
          </motion.div>

          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="font-body font-bold text-[10px] tracking-[0.45em] uppercase mb-4" style={{ color: `${ACCENT}99` }}>
            Stories &amp; Wellness
          </motion.p>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.15 }}
            className="font-display font-bold leading-tight mb-5" style={{ fontSize: 'clamp(40px, 7vw, 88px)', color: '#fdfbf7' }}>
            The NutriTribe <em className="not-italic" style={{ color: ACCENT }}>Journal</em>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.35 }}
            className="font-body text-base max-w-lg mx-auto" style={{ color: 'rgba(253,251,247,0.45)' }}>
            Health, heritage, and everything in between — from the lily ponds of Mithila to your snack bowl.
          </motion.p>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" preserveAspectRatio="none" className="w-full" style={{ height: 60 }}>
            <path d="M0 60 Q360 20 720 40 Q1080 60 1440 25 L1440 60 Z" fill="#fdfbf7" />
          </svg>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          POST GRID
          ══════════════════════════════════════════════ */}
      <section style={{ background: '#fdfbf7' }}>
        <div className="max-w-7xl mx-auto px-6 py-16">
          {posts.length === 0 ? (
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="py-20 text-center">
              <Newspaper size={44} className="text-earthen-rust/15 mx-auto mb-3" />
              <p className="font-body text-sm text-earthen-rust/40">More stories coming soon.</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post, i) => (
                <PostCard key={post.id} post={post} i={i} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
