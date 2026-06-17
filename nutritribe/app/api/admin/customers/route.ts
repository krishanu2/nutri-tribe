import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const orders = await db.order.findMany({
      select: {
        email: true,
        customerName: true,
        phone: true,
        city: true,
        state: true,
        total: true,
        createdAt: true,
        orderId: true,
        status: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Aggregate by email
    const map = new Map<string, {
      email: string;
      name: string;
      phone: string;
      city: string;
      state: string;
      orderCount: number;
      totalSpend: number;
      lastOrderAt: Date;
      lastOrderId: string;
      lastStatus: string;
    }>();

    for (const o of orders) {
      if (!map.has(o.email)) {
        map.set(o.email, {
          email: o.email,
          name: o.customerName,
          phone: o.phone,
          city: o.city,
          state: o.state,
          orderCount: 1,
          totalSpend: o.total,
          lastOrderAt: o.createdAt,
          lastOrderId: o.orderId,
          lastStatus: o.status,
        });
      } else {
        const existing = map.get(o.email)!;
        existing.orderCount += 1;
        existing.totalSpend += o.total;
        // orders are already sorted desc so first occurrence = latest
      }
    }

    const customers = Array.from(map.values()).sort(
      (a, b) => b.totalSpend - a.totalSpend
    );

    return NextResponse.json({ customers });
  } catch {
    return NextResponse.json({ customers: [] });
  }
}
