import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const policies = await db.policy.findMany();
    return NextResponse.json({ policies });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ policies: [] });
  }
}
