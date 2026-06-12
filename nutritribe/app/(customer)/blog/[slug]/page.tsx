import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { db } from '@/lib/db';
import { ArrowLeft, Calendar } from 'lucide-react';

const ACCENT = '#f3a213';

export const revalidate = 60;

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = await db.blogPost.findUnique({ where: { slug: params.slug } });
  if (!post) return {};

  return {
    title: `${post.title} | NutriTribe Journal`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [{ url: post.coverImage }],
      type: 'article',
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const post = await db.blogPost.findUnique({ where: { slug: params.slug } });
  if (!post || post.status !== 'PUBLISHED') return notFound();

  const paragraphs = post.content.split(/\n\s*\n/).filter(Boolean);

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
            <div className="flex gap-2 flex-wrap mb-4">
              {post.tags.map((tag) => (
                <span key={tag} className="font-body text-[10px] font-bold tracking-[0.18em] uppercase px-2.5 py-1 rounded-full"
                  style={{ background: `${ACCENT}22`, color: ACCENT }}>
                  {tag}
                </span>
              ))}
            </div>
          )}
          <h1 className="font-display font-bold leading-tight mb-3" style={{ fontSize: 'clamp(32px, 5.5vw, 64px)', color: '#fdfbf7' }}>
            {post.title}
          </h1>
          {post.publishedAt && (
            <p className="font-body text-sm flex items-center gap-2" style={{ color: 'rgba(253,251,247,0.5)' }}>
              <Calendar size={14} />
              {new Date(post.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
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
              <p key={i} className="font-body text-base leading-relaxed text-earthen-rust/75">
                {p}
              </p>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-16 p-8 rounded-2xl text-center" style={{ background: 'linear-gradient(135deg, #1a0e0a 0%, #0d0500 100%)' }}>
            <p className="font-display italic text-xl mb-4" style={{ color: ACCENT }}>
              Ready to taste the tradition?
            </p>
            <Link href="/products">
              <span className="inline-flex font-body font-bold text-sm px-8 py-3.5 rounded-full text-white tracking-wide"
                style={{ background: ACCENT, color: '#050100', boxShadow: `0 8px 24px ${ACCENT}40` }}>
                Shop the Collection →
              </span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
