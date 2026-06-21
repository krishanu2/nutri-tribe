import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { ProductStatus, Prisma } from '@prisma/client';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') as ProductStatus | null;

    const where = {
      ...(status && Object.values(ProductStatus).includes(status) ? { status } : {}),
    };

    const products = await db.product.findMany({ where, orderBy: { sortOrder: 'asc' } });
    return NextResponse.json({ products });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name, slug, tagline, category, mainCategory, color, price, mrp,
      weights, description, features, badge, image, images,
      stockQuantity, lowStockThreshold, sortOrder, status,
    } = body;

    if (!name || !slug || !tagline || !category || !mainCategory || !color || !description || !image) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const productStatus: ProductStatus = status === 'DRAFT' ? 'DRAFT' : 'PUBLISHED';

    const product = await db.product.create({
      data: {
        name, slug, tagline, category, mainCategory, color,
        price: Number(price) || 0,
        mrp: mrp ? Number(mrp) : null,
        weights: Array.isArray(weights) ? weights : [],
        description,
        features: Array.isArray(features) ? features : [],
        badge: badge || null,
        image,
        images: Array.isArray(images) ? images.filter(Boolean) : [],
        stockQuantity: Number(stockQuantity) || 0,
        lowStockThreshold: Number(lowStockThreshold) || 10,
        sortOrder: Number(sortOrder) || 0,
        status: productStatus,
      },
    });

    return NextResponse.json(product);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      return NextResponse.json({ error: 'A product with this slug already exists' }, { status: 409 });
    }
    console.error(err);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
