import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { code, subtotal } = await req.json();

    if (!code || typeof subtotal !== 'number') {
      return NextResponse.json({ valid: false, error: 'Missing coupon code' }, { status: 400 });
    }

    const coupon = await db.coupon.findUnique({ where: { code: String(code).trim().toUpperCase() } });

    if (!coupon || !coupon.active) {
      return NextResponse.json({ valid: false, error: 'Invalid coupon code' });
    }
    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return NextResponse.json({ valid: false, error: 'This coupon has expired' });
    }
    if (coupon.maxUses != null && coupon.usedCount >= coupon.maxUses) {
      return NextResponse.json({ valid: false, error: 'This coupon has reached its usage limit' });
    }
    if (subtotal < coupon.minOrderValue) {
      return NextResponse.json({ valid: false, error: `Add ₹${coupon.minOrderValue - subtotal} more to use this coupon (minimum order ₹${coupon.minOrderValue})` });
    }

    const discount = coupon.type === 'PERCENT'
      ? Math.round((subtotal * coupon.value) / 100)
      : Math.min(coupon.value, subtotal);

    return NextResponse.json({ valid: true, code: coupon.code, type: coupon.type, value: coupon.value, discount });
  } catch (err) {
    console.error('Coupon validation error:', err);
    return NextResponse.json({ valid: false, error: 'Could not validate coupon right now' }, { status: 500 });
  }
}
