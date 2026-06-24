import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { PolicyType } from '@prisma/client';

function parseType(raw: string): PolicyType | null {
  const upper = raw.toUpperCase();
  return (Object.values(PolicyType) as string[]).includes(upper) ? (upper as PolicyType) : null;
}

export async function GET(_req: NextRequest, { params }: { params: { type: string } }) {
  try {
    const type = parseType(params.type);
    if (!type) return NextResponse.json({ error: 'Invalid policy type' }, { status: 400 });

    const policy = await db.policy.findUnique({ where: { type } });
    if (!policy) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(policy);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch policy' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { type: string } }) {
  try {
    const type = parseType(params.type);
    if (!type) return NextResponse.json({ error: 'Invalid policy type' }, { status: 400 });

    const body = await req.json();
    const { title, content } = body;
    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    const policy = await db.policy.upsert({
      where: { type },
      update: { title, content, lastUpdated: new Date() },
      create: { type, title, content, lastUpdated: new Date() },
    });

    return NextResponse.json(policy);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to save policy' }, { status: 500 });
  }
}
