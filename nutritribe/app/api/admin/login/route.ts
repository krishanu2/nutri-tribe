import { NextRequest, NextResponse } from 'next/server';
import { signAdminToken, SESSION_COOKIE } from '@/lib/auth';
import { rateLimit, getClientIp } from '@/lib/rateLimit';

export async function POST(req: NextRequest) {
  try {
    const allowed = await rateLimit(`login:${getClientIp(req)}`, 8, 15 * 60);
    if (!allowed) {
      return NextResponse.json({ error: 'Too many attempts. Please try again in 15 minutes.' }, { status: 429 });
    }

    const { username, password } = await req.json();

    if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Admin login is not configured' }, { status: 503 });
    }

    const validUser = username === process.env.ADMIN_USERNAME;
    const validPass = String(password) === process.env.ADMIN_PASSWORD;

    if (!validUser || !validPass) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = await signAdminToken();
    const res = NextResponse.json({ ok: true });
    res.cookies.set(SESSION_COOKIE.name, token, {
      httpOnly: SESSION_COOKIE.httpOnly,
      secure: SESSION_COOKIE.secure,
      sameSite: SESSION_COOKIE.sameSite,
      maxAge: SESSION_COOKIE.maxAge,
      path: SESSION_COOKIE.path,
    });
    return res;
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
