import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { TicketStatus, Prisma } from '@prisma/client';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const ticket = await db.ticket.findUnique({ where: { id: params.id } });
    if (!ticket) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(ticket);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch ticket' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { status, adminNote } = body;

    const data: Prisma.TicketUpdateInput = {};

    if (status !== undefined) {
      if (!Object.values(TicketStatus).includes(status)) {
        return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
      }
      data.status = status;
    }
    if (adminNote !== undefined) data.adminNote = adminNote;

    const ticket = await db.ticket.update({ where: { id: params.id }, data });
    return NextResponse.json(ticket);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to update ticket' }, { status: 500 });
  }
}
