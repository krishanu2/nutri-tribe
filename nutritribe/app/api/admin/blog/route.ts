import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { PostStatus, Prisma } from '@prisma/client';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') as PostStatus | null;
    const page   = Math.max(1, parseInt(searchParams.get('page')  ?? '1'));
    const limit  = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') ?? '20')));

    const where = {
      ...(status && Object.values(PostStatus).includes(status) ? { status } : {}),
    };

    const [posts, total] = await db.$transaction([
      db.blogPost.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.blogPost.count({ where }),
    ]);

    return NextResponse.json({ posts, total, page, limit, pages: Math.ceil(total / limit) });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { slug, title, excerpt, content, coverImage, tags, status } = body;

    if (!slug || !title || !excerpt || !content || !coverImage) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const postStatus: PostStatus = status === 'PUBLISHED' ? 'PUBLISHED' : 'DRAFT';

    const post = await db.blogPost.create({
      data: {
        slug,
        title,
        excerpt,
        content,
        coverImage,
        tags: Array.isArray(tags) ? tags : [],
        status: postStatus,
        publishedAt: postStatus === 'PUBLISHED' ? new Date() : null,
      },
    });

    return NextResponse.json(post);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      return NextResponse.json({ error: 'A post with this slug already exists' }, { status: 409 });
    }
    console.error(err);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
