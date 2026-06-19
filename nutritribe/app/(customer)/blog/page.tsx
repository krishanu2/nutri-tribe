import { Metadata } from 'next';
import { db } from '@/lib/db';
import BlogGridClient from './BlogGridClient';

export const dynamic = 'force-dynamic';
export const revalidate = 60;

export const metadata: Metadata = {
  title: 'The NutriTribe Journal | Makhana Stories, Health & Heritage',
  description:
    'Stories on healthy snacking, the Mithila heritage behind makhana, and wellness tips from the NutriTribe team.',
};

export default async function BlogPage() {
  const posts = await db.blogPost.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { publishedAt: 'desc' },
  });

  return <BlogGridClient posts={posts} />;
}
