import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const products = await db.product.findMany({ select: { category: true, mainCategory: true } });
    const categories = Array.from(new Set(products.map(p => p.category))).sort();
    const mainCategories = Array.from(new Set(products.map(p => p.mainCategory))).sort();
    return NextResponse.json({ categories, mainCategories });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ categories: [], mainCategories: [] });
  }
}
