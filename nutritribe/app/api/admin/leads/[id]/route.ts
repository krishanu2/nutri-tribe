import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { LeadStatus, Prisma } from '@prisma/client';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const lead = await db.lead.findUnique({ where: { id: params.id } });
    if (!lead) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(lead);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch lead' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { status, adminNote } = body;

    const data: Prisma.LeadUpdateInput = {};

    if (status !== undefined) {
      if (!Object.values(LeadStatus).includes(status)) {
        return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
      }
      data.status = status;
    }
    if (adminNote !== undefined) data.adminNote = adminNote;

    const lead = await db.lead.update({ where: { id: params.id }, data });
    return NextResponse.json(lead);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 });
  }
}
