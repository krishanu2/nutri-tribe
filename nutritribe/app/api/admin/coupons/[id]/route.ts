import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { DiscountType, Prisma } from '@prisma/client';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const coupon = await db.coupon.findUnique({ where: { id: params.id } });
    if (!coupon) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(coupon);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch coupon' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { code, type, value, minOrderValue, maxUses, expiresAt, active } = body;

    const existing = await db.coupon.findUnique({ where: { id: params.id } });
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const data: Prisma.CouponUpdateInput = {};
    if (code !== undefined) data.code = String(code).trim().toUpperCase();
    if (type !== undefined) {
      if (!Object.values(DiscountType).includes(type)) {
        return NextResponse.json({ error: 'Invalid discount type' }, { status: 400 });
      }
      data.type = type;
    }
    if (value !== undefined) data.value = Number(value);
    if (minOrderValue !== undefined) data.minOrderValue = Number(minOrderValue) || 0;
    if (maxUses !== undefined) data.maxUses = maxUses != null ? Number(maxUses) : null;
    if (expiresAt !== undefined) data.expiresAt = expiresAt ? new Date(expiresAt) : null;
    if (active !== undefined) data.active = !!active;

    const coupon = await db.coupon.update({ where: { id: params.id }, data });
    return NextResponse.json(coupon);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      return NextResponse.json({ error: 'A coupon with this code already exists' }, { status: 409 });
    }
    console.error(err);
    return NextResponse.json({ error: 'Failed to update coupon' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await db.coupon.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to delete coupon' }, { status: 500 });
  }
}
