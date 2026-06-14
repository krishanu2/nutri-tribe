import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { ReviewStatus } from '@prisma/client';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') as ReviewStatus | null;
    const page   = Math.max(1, parseInt(searchParams.get('page')  ?? '1'));
    const limit  = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') ?? '20')));

    const where = {
      ...(status && Object.values(ReviewStatus).includes(status) ? { status } : {}),
    };

    const [reviews, total] = await db.$transaction([
      db.review.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.review.count({ where }),
    ]);

    return NextResponse.json({ reviews, total, page, limit, pages: Math.ceil(total / limit) });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}
