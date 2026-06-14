import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const slugsParam = req.nextUrl.searchParams.get('slugs');

    if (slugsParam) {
      const slugs = slugsParam.split(',').map(s => s.trim()).filter(Boolean);
      const products = await db.product.findMany({
        where: { slug: { in: slugs } },
        orderBy: { sortOrder: 'asc' },
      });
      return NextResponse.json({ products });
    }

    const products = await db.product.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { sortOrder: 'asc' },
    });
    return NextResponse.json({ products });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ products: [] });
  }
}
