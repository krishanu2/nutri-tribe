import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

function getSecret() {
  return new TextEncoder().encode(process.env.JWT_SECRET ?? 'fallback-dev-secret-change-me');
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isAdminPage  = pathname.startsWith('/admin') && pathname !== '/admin/login';
  const isAdminApi   = pathname.startsWith('/api/admin') && pathname !== '/api/admin/login';

  if (!isAdminPage && !isAdminApi) return NextResponse.next();

  const token = req.cookies.get('nt-admin-session')?.value;

  if (!token) {
    if (isAdminApi) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    return NextResponse.redirect(new URL('/admin/login', req.url));
  }

  try {
    await jwtVerify(token, getSecret());
    return NextResponse.next();
  } catch {
    if (isAdminApi) return NextResponse.json({ error: 'Session expired' }, { status: 401 });
    const res = NextResponse.redirect(new URL('/admin/login', req.url));
    res.cookies.delete('nt-admin-session');
    return res;
  }
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
