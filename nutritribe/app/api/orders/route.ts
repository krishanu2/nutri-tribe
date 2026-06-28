import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sendOrderStatusEmail } from '@/lib/email';

interface IncomingItem {
  productId: number;
  name: string;
  weight: string;
  quantity: number;
  price: number;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      orderId, name, email, phone,
      address, city, state, pincode,
      items, subtotal, delivery, discount, couponCode, total,
      paymentMethod, paymentId, giftNote,
    } = body;

    const orderItems = items as IncomingItem[];

    const products = await db.product.findMany({
      where: { id: { in: orderItems.map(i => i.productId) } },
    });
    const productsById = new Map(products.map(p => [p.id, p]));

    for (const item of orderItems) {
      const product = productsById.get(item.productId);
      if (!product || item.quantity > product.stockQuantity) {
        return NextResponse.json(
          { success: false, error: `Insufficient stock for ${product?.name ?? item.name}` },
          { status: 409 }
        );
      }
    }

    let coupon = null;
    if (couponCode) {
      coupon = await db.coupon.findUnique({ where: { code: String(couponCode).trim().toUpperCase() } });
      const couponStillValid = !!coupon
        && coupon.active
        && (!coupon.expiresAt || new Date(coupon.expiresAt) >= new Date())
        && (coupon.maxUses == null || coupon.usedCount < coupon.maxUses)
        && subtotal >= coupon.minOrderValue;
      if (!couponStillValid) {
        return NextResponse.json(
          { success: false, error: 'This coupon is no longer valid' },
          { status: 409 }
        );
      }
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
          subtotal,
          delivery,
          discount: discount || 0,
          couponCode: coupon ? coupon.code : null,
          total,
          paymentMethod: paymentMethod === 'ONLINE' ? 'ONLINE' : 'COD',
          paymentId: paymentId ?? null,
          giftNote: typeof giftNote === 'string' && giftNote.trim() ? giftNote.trim().slice(0, 200) : null,
          items: {
            create: orderItems.map(i => ({
              productId: i.productId,
              name:      i.name,
              weight:    i.weight,
              quantity:  i.quantity,
              price:     i.price,
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
      ...(coupon ? [db.coupon.update({ where: { id: coupon.id }, data: { usedCount: { increment: 1 } } })] : []),
    ]);

    try {
      await sendOrderStatusEmail({ orderId, email, customerName: name, total }, 'PENDING');
    } catch (emailErr) {
      console.error('Order confirmation email failed:', emailErr);
    }

    return NextResponse.json({ success: true, orderId });
  } catch (err) {
    console.error('Order save error:', err);
    return NextResponse.json({ success: false, error: 'Failed to save order' }, { status: 500 });
  }
}
