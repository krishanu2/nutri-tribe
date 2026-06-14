import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { ReviewStatus, Prisma } from '@prisma/client';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const review = await db.review.findUnique({ where: { id: params.id } });
    if (!review) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(review);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch review' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { status, adminNote } = body;

    const data: Prisma.ReviewUpdateInput = {};

    if (status !== undefined) {
      if (!Object.values(ReviewStatus).includes(status)) {
        return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
      }
      data.status = status;
    }
    if (adminNote !== undefined) data.adminNote = adminNote;

    const review = await db.review.update({ where: { id: params.id }, data });
    return NextResponse.json(review);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to update review' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await db.review.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 });
  }
}
