import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sendOrderStatusEmail } from '@/lib/email';
import { computeOrderTotals, PricingError } from '@/lib/pricing';

interface IncomingItem {
  productId: number;
  name: string;
  weight: string;
  quantity: number;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      orderId, name, email, phone,
      address, city, state, pincode,
      items, couponCode,
      paymentMethod, paymentId, giftNote,
    } = body;

    const orderItems = items as IncomingItem[];

    let totals;
    try {
      totals = await computeOrderTotals(
        orderItems.map(i => ({ productId: i.productId, quantity: i.quantity })),
        couponCode
      );
    } catch (e) {
      const message = e instanceof PricingError ? e.message : 'One or more items are unavailable';
      return NextResponse.json({ success: false, error: message }, { status: 409 });
    }

    if (couponCode && totals.couponWasRejected) {
      return NextResponse.json(
        { success: false, error: 'This coupon is no longer valid' },
        { status: 409 }
      );
    }

    await db.$transaction([
      db.order.create({
        data: {
          orderId,
          customerName: name,
          email,
          phone,
          address,
          city,
          state,
          pincode,
          subtotal: totals.subtotal,
          delivery: totals.delivery,
          discount: totals.discount,
          couponCode: totals.coupon ? totals.coupon.code : null,
          total: totals.total,
          paymentMethod: paymentMethod === 'ONLINE' ? 'ONLINE' : 'COD',
          paymentId: paymentId ?? null,
          giftNote: typeof giftNote === 'string' && giftNote.trim() ? giftNote.trim().slice(0, 200) : null,
          items: {
            create: orderItems.map(i => ({
              productId: i.productId,
              name:      i.name,
              weight:    i.weight,
              quantity:  i.quantity,
              price:     totals!.productsById.get(i.productId)!.price,
            })),
          },
        },
      }),
      ...orderItems.map(i =>
        db.product.update({
          where: { id: i.productId },
          data: { stockQuantity: { decrement: i.quantity } },
        })
      ),
      ...(totals.coupon ? [db.coupon.update({ where: { id: totals.coupon.id }, data: { usedCount: { increment: 1 } } })] : []),
    ]);

    try {
      await sendOrderStatusEmail({ orderId, email, customerName: name, total: totals.total }, 'PENDING');
    } catch (emailErr) {
      console.error('Order confirmation email failed:', emailErr);
    }

    return NextResponse.json({ success: true, orderId });
  } catch (err) {
    console.error('Order save error:', err);
    return NextResponse.json({ success: false, error: 'Failed to save order' }, { status: 500 });
  }
}
