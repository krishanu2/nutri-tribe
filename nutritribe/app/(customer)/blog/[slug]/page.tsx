import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { db } from '@/lib/db';
import BlogPostBodyClient from './BlogPostBodyClient';

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

  return <BlogPostBodyClient post={post} paragraphs={paragraphs} />;
}
