import { NextRequest } from 'next/server';
import { db } from '@/lib/db';

export function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  return forwarded?.split(',')[0]?.trim() || 'unknown';
}

export async function rateLimit(key: string, limit: number, windowSeconds: number): Promise<boolean> {
  const windowStart = new Date(Date.now() - windowSeconds * 1000);
  const count = await db.rateLimitHit.count({ where: { key, createdAt: { gte: windowStart } } });
  if (count >= limit) return false;

  await db.rateLimitHit.create({ data: { key } });

  if (Math.random() < 0.01) {
    db.rateLimitHit
      .deleteMany({ where: { createdAt: { lt: new Date(Date.now() - 24 * 60 * 60 * 1000) } } })
      .catch(() => {});
  }

  return true;
}
