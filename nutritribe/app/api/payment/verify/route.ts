import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return NextResponse.json({ error: 'Razorpay not configured' }, { status: 503 });
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expected = crypto
      .createHmac('sha256', keySecret)
      .update(body)
      .digest('hex');

    if (expected !== razorpay_signature) {
      return NextResponse.json({ verified: false, error: 'Signature mismatch' }, { status: 400 });
    }

    return NextResponse.json({ verified: true, paymentId: razorpay_payment_id });
  } catch {
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}
