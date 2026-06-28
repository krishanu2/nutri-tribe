import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { LeadType } from '@prisma/client';
import { rateLimit, getClientIp } from '@/lib/rateLimit';

export async function POST(req: NextRequest) {
  try {
    const allowed = await rateLimit(`lead:${getClientIp(req)}`, 5, 10 * 60);
    if (!allowed) {
      return NextResponse.json({ success: false, error: 'Too many requests. Please try again shortly.' }, { status: 429 });
    }

    const body = await req.json();
    const { type, name, email, phone, companyName, details, message } = body;

    if (!type || !Object.values(LeadType).includes(type)) {
      return NextResponse.json({ success: false, error: 'Invalid lead type' }, { status: 400 });
    }
    if (!name || !email || !phone || !companyName || !message) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const lead = await db.lead.create({
      data: { type, name, email, phone, companyName, details: details ?? '', message },
    });

    return NextResponse.json({ success: true, id: lead.id });
  } catch (err) {
    console.error('Lead save error:', err);
    return NextResponse.json({ success: false, error: 'Failed to save enquiry' }, { status: 500 });
  }
}
