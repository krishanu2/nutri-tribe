import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { ProductStatus, Prisma } from '@prisma/client';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id, 10);
    if (Number.isNaN(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });

    const product = await db.product.findUnique({ where: { id } });
    if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(product);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id, 10);
    if (Number.isNaN(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });

    const body = await req.json();
    const {
      name, slug, tagline, category, mainCategory, color, price, mrp,
      weights, description, features, badge, image, images,
      stockQuantity, lowStockThreshold, sortOrder, status,
    } = body;

    const existing = await db.product.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const data: Prisma.ProductUpdateInput = {};
    if (name !== undefined) data.name = name;
    if (slug !== undefined) data.slug = slug;
    if (tagline !== undefined) data.tagline = tagline;
    if (category !== undefined) data.category = category;
    if (mainCategory !== undefined) data.mainCategory = mainCategory;
    if (color !== undefined) data.color = color;
    if (price !== undefined) data.price = Number(price) || 0;
    if (mrp !== undefined) data.mrp = mrp ? Number(mrp) : null;
    if (weights !== undefined) data.weights = Array.isArray(weights) ? weights : [];
    if (description !== undefined) data.description = description;
    if (features !== undefined) data.features = Array.isArray(features) ? features : [];
    if (badge !== undefined) data.badge = badge || null;
    if (image !== undefined) data.image = image;
    if (images !== undefined) data.images = Array.isArray(images) ? images.filter(Boolean) : [];
    if (stockQuantity !== undefined) data.stockQuantity = Number(stockQuantity) || 0;
    if (lowStockThreshold !== undefined) data.lowStockThreshold = Number(lowStockThreshold) || 10;
    if (sortOrder !== undefined) data.sortOrder = Number(sortOrder) || 0;

    if (status !== undefined) {
      if (!Object.values(ProductStatus).includes(status)) {
        return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
      }
      data.status = status;
    }

    const product = await db.product.update({ where: { id }, data });
    return NextResponse.json(product);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      return NextResponse.json({ error: 'A product with this slug already exists' }, { status: 409 });
    }
    console.error(err);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id, 10);
    if (Number.isNaN(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });

    await db.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
