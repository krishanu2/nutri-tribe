import { notFound } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/lib/db';
import { ArrowLeft } from 'lucide-react';
import BlogPostForm from '../../_components/BlogPostForm';

export const dynamic = 'force-dynamic';

export default async function EditBlogPostPage({ params }: { params: { id: string } }) {
  const post = await db.blogPost.findUnique({ where: { id: params.id } });
  if (!post) return notFound();

  return (
    <div className="p-8">
      <Link href="/admin/blog"
        className="inline-flex items-center gap-2 font-body text-sm text-[#7d3627]/50 hover:text-[#f3a213] transition-colors mb-6">
        <ArrowLeft size={14} />
        Back to Blog Posts
      </Link>

      <h1 className="font-display font-bold text-3xl text-[#7d3627] mb-6">Edit Blog Post</h1>

      <BlogPostForm post={post} />
    </div>
  );
}
