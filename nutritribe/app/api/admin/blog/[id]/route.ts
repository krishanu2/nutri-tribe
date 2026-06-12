import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { PostStatus, Prisma } from '@prisma/client';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const post = await db.blogPost.findUnique({ where: { id: params.id } });
    if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(post);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { slug, title, excerpt, content, coverImage, tags, status } = body;

    const existing = await db.blogPost.findUnique({ where: { id: params.id } });
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const data: Prisma.BlogPostUpdateInput = {};
    if (slug !== undefined) data.slug = slug;
    if (title !== undefined) data.title = title;
    if (excerpt !== undefined) data.excerpt = excerpt;
    if (content !== undefined) data.content = content;
    if (coverImage !== undefined) data.coverImage = coverImage;
    if (tags !== undefined) data.tags = Array.isArray(tags) ? tags : [];

    if (status !== undefined) {
      if (!Object.values(PostStatus).includes(status)) {
        return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
      }
      data.status = status;
      if (status === 'PUBLISHED' && !existing.publishedAt) {
        data.publishedAt = new Date();
      }
      if (status === 'DRAFT') {
        data.publishedAt = null;
      }
    }

    const post = await db.blogPost.update({ where: { id: params.id }, data });
    return NextResponse.json(post);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      return NextResponse.json({ error: 'A post with this slug already exists' }, { status: 409 });
    }
    console.error(err);
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await db.blogPost.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
