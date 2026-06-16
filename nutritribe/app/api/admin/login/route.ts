import { NextRequest, NextResponse } from 'next/server';
import { signAdminToken, SESSION_COOKIE } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

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
