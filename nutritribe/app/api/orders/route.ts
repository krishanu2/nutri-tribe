import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

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
      items, subtotal, delivery, total,
    } = body;

    await db.order.create({
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
        total,
        items: {
          create: (items as IncomingItem[]).map(i => ({
            productId: i.productId,
            name:      i.name,
            weight:    i.weight,
            quantity:  i.quantity,
            price:     i.price,
          })),
        },
      },
    });

    return NextResponse.json({ success: true, orderId });
  } catch (err) {
    console.error('Order save error:', err);
    return NextResponse.json({ success: false, error: 'Failed to save order' }, { status: 500 });
  }
}
