import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { DiscountType, Prisma } from '@prisma/client';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const coupons = await db.coupon.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json({ coupons });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch coupons' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, type, value, minOrderValue, maxUses, expiresAt, active } = body;

    if (!code || !type || !value) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    if (!Object.values(DiscountType).includes(type)) {
      return NextResponse.json({ error: 'Invalid discount type' }, { status: 400 });
    }

    const coupon = await db.coupon.create({
      data: {
        code: String(code).trim().toUpperCase(),
        type,
        value: Number(value),
        minOrderValue: Number(minOrderValue) || 0,
        maxUses: maxUses != null ? Number(maxUses) : null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        active: active !== false,
      },
    });

    return NextResponse.json(coupon);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      return NextResponse.json({ error: 'A coupon with this code already exists' }, { status: 409 });
    }
    console.error(err);
    return NextResponse.json({ error: 'Failed to create coupon' }, { status: 500 });
  }
}
