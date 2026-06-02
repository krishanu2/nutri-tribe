import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import path from 'path';
import fs from 'fs';

export async function POST(req: NextRequest) {
  try {
    const order = await req.json();

    const filePath = path.join(process.cwd(), 'orders.xlsx');

    const row = {
      'Order ID': order.orderId,
      'Date & Time': order.date,
      'Customer Name': order.name,
      'Email': order.email,
      'Phone': order.phone,
      'Address': order.address,
      'City': order.city,
      'State': order.state,
      'Pincode': order.pincode,
      'Items': (order.items as Array<{ name: string; weight: string; quantity: number; price: number }>)
        .map(i => `${i.name} (${i.weight}) ×${i.quantity} @ ₹${i.price}`)
        .join(' | '),
      'Subtotal (₹)': order.subtotal,
      'Delivery (₹)': order.delivery,
      'Total (₹)': order.total,
      'Payment Status': 'PAID (Mock)',
    };

    let workbook: XLSX.WorkBook;

    if (fs.existsSync(filePath)) {
      workbook = XLSX.readFile(filePath);
      const ws = workbook.Sheets['Orders'];
      const existing = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws);
      const updated = XLSX.utils.json_to_sheet([...existing, row]);
      workbook.Sheets['Orders'] = updated;
    } else {
      workbook = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet([row]);
      // Auto-width columns
      const colWidths = Object.keys(row).map(k => ({ wch: Math.max(k.length, 20) }));
      ws['!cols'] = colWidths;
      XLSX.utils.book_append_sheet(workbook, ws, 'Orders');
    }

    XLSX.writeFile(workbook, filePath);

    return NextResponse.json({ success: true, orderId: order.orderId });
  } catch (err) {
    console.error('Order save error:', err);
    return NextResponse.json({ success: false, error: 'Failed to save order' }, { status: 500 });
  }
}
