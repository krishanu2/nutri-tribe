import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { rateLimit, getClientIp } from '@/lib/rateLimit';

export async function POST(req: NextRequest) {
  try {
    const allowed = await rateLimit(`track:${getClientIp(req)}`, 10, 10 * 60);
    if (!allowed) {
      return NextResponse.json({ error: 'Too many attempts. Please try again shortly.' }, { status: 429 });
    }

    const { orderId, contact } = await req.json();

    if (!orderId || !contact) {
      return NextResponse.json({ error: 'Order ID and contact info are required' }, { status: 400 });
    }

    const order = await db.order.findUnique({
      where: { orderId: String(orderId).trim().toUpperCase() },
      include: { items: true },
    });

    const normalizedContact = String(contact).trim().toLowerCase();
    const matches = order && (
      order.email.toLowerCase() === normalizedContact ||
      order.phone.toLowerCase() === normalizedContact
    );

    if (!matches) {
      return NextResponse.json(
        { error: "We couldn't find that order — check your Order ID and the email or phone used at checkout." },
        { status: 404 }
      );
    }

    // Safe subset only — never adminNote
    return NextResponse.json({
      orderId: order!.orderId,
      createdAt: order!.createdAt,
      status: order!.status,
      trackingNumber: order!.trackingNumber,
      shippedAt: order!.shippedAt,
      deliveredAt: order!.deliveredAt,
      customerName: order!.customerName,
      email: order!.email,
      phone: order!.phone,
      address: order!.address,
      city: order!.city,
      state: order!.state,
      pincode: order!.pincode,
      giftNote: order!.giftNote,
      subtotal: order!.subtotal,
      delivery: order!.delivery,
      discount: order!.discount,
      couponCode: order!.couponCode,
      total: order!.total,
      items: order!.items.map(i => ({ name: i.name, weight: i.weight, quantity: i.quantity, price: i.price })),
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
