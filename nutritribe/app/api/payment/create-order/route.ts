import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { computeOrderTotals, PricingError } from '@/lib/pricing';

interface IncomingItem {
  productId: number;
  quantity: number;
}

export async function POST(req: NextRequest) {
  try {
    const { items, couponCode } = await req.json();

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'No items provided' }, { status: 400 });
    }

    let totals;
    try {
      totals = await computeOrderTotals(
        (items as IncomingItem[]).map(i => ({ productId: i.productId, quantity: i.quantity })),
        couponCode
      );
    } catch (e) {
      const message = e instanceof PricingError ? e.message : 'One or more items are unavailable';
      return NextResponse.json({ error: message }, { status: 409 });
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return NextResponse.json({ error: 'Razorpay not configured' }, { status: 503 });
    }

    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });

    const order = await razorpay.orders.create({
      amount: totals.total * 100, // convert to paise — recomputed server-side, never trusts client amount
      currency: 'INR',
      receipt: `nt-${Date.now()}`,
    });

    return NextResponse.json({ razorpayOrderId: order.id, amount: order.amount, total: totals.total });
  } catch {
    return NextResponse.json({ error: 'Failed to create payment order' }, { status: 500 });
  }
}
