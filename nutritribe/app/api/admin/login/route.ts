import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { signAdminToken, SESSION_COOKIE } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    const validUser = username === process.env.ADMIN_USERNAME;
    // Always run bcrypt compare to avoid timing attacks even when username is wrong
    const hashToCheck = process.env.ADMIN_PASSWORD_HASH ?? '$2b$10$invalidhashpadding000000000000000000000000000000000000';
    const validPass = await bcrypt.compare(String(password), hashToCheck);

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
