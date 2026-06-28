import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { TicketIssueType } from '@prisma/client';
import { sendTicketConfirmationEmail } from '@/lib/email';
import { rateLimit, getClientIp } from '@/lib/rateLimit';

export async function POST(req: NextRequest) {
  try {
    const allowed = await rateLimit(`ticket:${getClientIp(req)}`, 5, 10 * 60);
    if (!allowed) {
      return NextResponse.json({ error: 'Too many requests. Please try again shortly.' }, { status: 429 });
    }

    const body = await req.json();
    const {
      orderId, orderRef, issueType,
      customerName, email, phone,
      description, photoUrl,
    } = body;

    if (!orderId || !orderRef || !issueType || !customerName || !email || !phone || !description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    if (!Object.values(TicketIssueType).includes(issueType)) {
      return NextResponse.json({ error: 'Invalid issue type' }, { status: 400 });
    }
    if (!String(description).trim()) {
      return NextResponse.json({ error: 'Please describe the issue' }, { status: 400 });
    }

    const ticket = await db.ticket.create({
      data: {
        orderId: String(orderId),
        orderRef: String(orderRef),
        issueType,
        customerName: String(customerName),
        email: String(email),
        phone: String(phone),
        description: String(description).trim().slice(0, 1000),
        photoUrl: typeof photoUrl === 'string' && photoUrl ? photoUrl : null,
      },
    });

    try {
      await sendTicketConfirmationEmail(ticket);
    } catch (emailErr) {
      console.error('Ticket confirmation email failed:', emailErr);
    }

    return NextResponse.json({ success: true, id: ticket.id });
  } catch (err) {
    console.error('Ticket creation error:', err);
    return NextResponse.json({ success: false, error: 'Failed to submit ticket' }, { status: 500 });
  }
}
