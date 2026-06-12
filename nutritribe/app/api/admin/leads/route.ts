import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { LeadType, LeadStatus } from '@prisma/client';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type   = searchParams.get('type') as LeadType | null;
    const status = searchParams.get('status') as LeadStatus | null;
    const page   = Math.max(1, parseInt(searchParams.get('page')  ?? '1'));
    const limit  = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') ?? '20')));

    const where = {
      ...(type && Object.values(LeadType).includes(type) ? { type } : {}),
      ...(status && Object.values(LeadStatus).includes(status) ? { status } : {}),
    };

    const [leads, total] = await db.$transaction([
      db.lead.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.lead.count({ where }),
    ]);

    return NextResponse.json({ leads, total, page, limit, pages: Math.ceil(total / limit) });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
  }
}
