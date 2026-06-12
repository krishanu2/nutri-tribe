import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { OrderStatus } from '@prisma/client';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') as OrderStatus | null;
    const page   = Math.max(1, parseInt(searchParams.get('page')  ?? '1'));
    const limit  = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') ?? '20')));

    const where = status && Object.values(OrderStatus).includes(status) ? { status } : {};

    const [orders, total] = await db.$transaction([
      db.order.findMany({
        where,
        select: {
          id:           true,
          orderId:      true,
          createdAt:    true,
          customerName: true,
          city:         true,
          state:        true,
          total:        true,
          status:       true,
          trackingNumber: true,
          _count: { select: { items: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.order.count({ where }),
    ]);

    return NextResponse.json({ orders, total, page, limit, pages: Math.ceil(total / limit) });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
