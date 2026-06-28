import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const productSlug = req.nextUrl.searchParams.get('product');
    if (!productSlug) {
      return NextResponse.json({ error: 'Missing product slug' }, { status: 400 });
    }

    const reviews = await db.review.findMany({
      where: { productSlug, status: 'APPROVED' },
      orderBy: { createdAt: 'desc' },
    });

    const count = reviews.length;
    const average = count > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / count : 0;

    return NextResponse.json({ reviews, average, count });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productSlug, customerName, rating, comment } = body;

    if (!productSlug || !customerName || !comment || !rating) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }
    const ratingNum = Number(rating);
    if (!Number.isInteger(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return NextResponse.json({ success: false, error: 'Rating must be between 1 and 5' }, { status: 400 });
    }

    const review = await db.review.create({
      data: {
        productSlug,
        customerName: String(customerName).trim().slice(0, 100),
        rating: ratingNum,
        comment: String(comment).trim().slice(0, 1000),
      },
    });

    return NextResponse.json({ success: true, id: review.id });
  } catch (err) {
    console.error('Review save error:', err);
    return NextResponse.json({ success: false, error: 'Failed to submit review' }, { status: 500 });
  }
}
