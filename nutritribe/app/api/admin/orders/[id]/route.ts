import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { OrderStatus, Prisma } from '@prisma/client';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const order = await db.order.findUnique({
      where: { id: params.id },
      include: { items: true },
    });
    if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(order);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { status, trackingNumber, adminNote } = body;

    const data: Prisma.OrderUpdateInput = {};

    if (status !== undefined) {
      if (!Object.values(OrderStatus).includes(status)) {
        return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
      }
      data.status = status;
      if (status === 'SHIPPED')    data.shippedAt   = new Date();
      if (status === 'DELIVERED')  data.deliveredAt = new Date();
    }
    if (trackingNumber !== undefined) data.trackingNumber = trackingNumber;
    if (adminNote !== undefined)      data.adminNote = adminNote;

    const order = await db.order.update({
      where: { id: params.id },
      data,
      include: { items: true },
    });
    return NextResponse.json(order);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
