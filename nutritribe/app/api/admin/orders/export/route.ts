import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { OrderStatus } from '@prisma/client';

export const dynamic = 'force-dynamic';

function csvEscape(value: string | number) {
  const str = String(value);
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') as OrderStatus | null;
    const where = status && Object.values(OrderStatus).includes(status) ? { status } : {};

    const orders = await db.order.findMany({
      where,
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });

    const headers = [
      'Order ID', 'Date', 'Status', 'Customer Name', 'Email', 'Phone',
      'Address', 'City', 'State', 'Pincode', 'Items',
      'Subtotal', 'Delivery', 'Discount', 'Coupon Code', 'Total', 'Tracking Number',
    ];

    const rows = orders.map(o => [
      o.orderId,
      new Date(o.createdAt).toLocaleString('en-IN'),
      o.status,
      o.customerName,
      o.email,
      o.phone,
      o.address,
      o.city,
      o.state,
      o.pincode,
      o.items.map(i => `${i.name} (${i.weight}) x${i.quantity}`).join('; '),
      o.subtotal,
      o.delivery,
      o.discount,
      o.couponCode ?? '',
      o.total,
      o.trackingNumber ?? '',
    ]);

    const csv = [headers, ...rows]
      .map(row => row.map(csvEscape).join(','))
      .join('\n');

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="orders-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  } catch (err) {
    console.error('Order export error:', err);
    return NextResponse.json({ error: 'Failed to export orders' }, { status: 500 });
  }
}
