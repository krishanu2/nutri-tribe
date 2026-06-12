import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { db } from '@/lib/db';
import { ArrowRight, Newspaper } from 'lucide-react';

const ACCENT = '#f3a213';

export const metadata: Metadata = {
  title: 'The NutriTribe Journal | Makhana Stories, Health & Heritage',
  description:
    'Stories on healthy snacking, the Mithila heritage behind makhana, and wellness tips from the NutriTribe team.',
};

export const revalidate = 60;

export default async function BlogPage() {
  const posts = await db.blogPost.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { publishedAt: 'desc' },
  });

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
          <span className="font-display font-bold italic"
            style={{ fontSize: 'clamp(80px, 20vw, 260px)', color: 'rgba(243,162,19,0.06)', letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>
            Journal
          </span>
        </div>

        <div className="relative z-10 text-center px-6 pt-36 pb-24">
          <div className="flex justify-center mb-8">
            <div className="relative" style={{ width: 140, height: 40 }}>
              <Image src="/logo.png" alt="NutriTribe" fill className="object-contain" style={{ filter: 'brightness(0) invert(1)' }} priority />
            </div>
          </div>

          <p className="font-body font-bold text-[10px] tracking-[0.45em] uppercase mb-4" style={{ color: `${ACCENT}99` }}>
            Stories &amp; Wellness
          </p>

          <h1 className="font-display font-bold leading-tight mb-5" style={{ fontSize: 'clamp(40px, 7vw, 88px)', color: '#fdfbf7' }}>
            The NutriTribe <em className="not-italic" style={{ color: ACCENT }}>Journal</em>
          </h1>

          <p className="font-body text-base max-w-lg mx-auto" style={{ color: 'rgba(253,251,247,0.45)' }}>
            Health, heritage, and everything in between — from the lily ponds of Mithila to your snack bowl.
          </p>
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
            <div className="py-20 text-center">
              <Newspaper size={44} className="text-earthen-rust/15 mx-auto mb-3" />
              <p className="font-body text-sm text-earthen-rust/40">More stories coming soon.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group relative rounded-2xl overflow-hidden shadow-card hover:shadow-hover transition-shadow duration-300 flex flex-col bg-white border border-earthen-rust/6"
                >
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
                      Read More <ArrowRight size={13} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
