import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

function getSecret() {
  return new TextEncoder().encode(process.env.JWT_SECRET ?? 'fallback-dev-secret-change-me');
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const host = req.headers.get('host') ?? '';
  const isAdminSubdomain = host.startsWith('admin.');

  // ── Subdomain rewrite ──────────────────────────────────────────────────────
  // On admin.<domain>, rewrite short paths to /admin/* so the same app serves
  // both admin.nutritribe.com/orders and nutritribe.com/admin/orders.
  let effectivePath = pathname;
  let needsRewrite = false;

  if (
    isAdminSubdomain &&
    !pathname.startsWith('/admin') &&
    !pathname.startsWith('/api/') &&
    !pathname.startsWith('/_next/') &&
    !pathname.match(/\.\w{1,5}$/) // skip static assets (*.png, *.ico, …)
  ) {
    effectivePath = pathname === '/' ? '/admin' : `/admin${pathname}`;
    needsRewrite = true;
  }

  // ── Auth guard ────────────────────────────────────────────────────────────
  const isAdminPage = effectivePath.startsWith('/admin') && effectivePath !== '/admin/login';
  const isAdminApi  = effectivePath.startsWith('/api/admin') && effectivePath !== '/api/admin/login';

  if (!isAdminPage && !isAdminApi) {
    return needsRewrite
      ? NextResponse.rewrite(new URL(effectivePath, req.url))
      : NextResponse.next();
  }

  const token = req.cookies.get('nt-admin-session')?.value;

  const loginRedirect = isAdminSubdomain
    ? new URL('/login', req.url)       // admin.domain.com/login rewrites → /admin/login
    : new URL('/admin/login', req.url);

  if (!token) {
    if (isAdminApi) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    return NextResponse.redirect(loginRedirect);
  }

  try {
    await jwtVerify(token, getSecret());
    return needsRewrite
      ? NextResponse.rewrite(new URL(effectivePath, req.url))
      : NextResponse.next();
  } catch {
    if (isAdminApi) return NextResponse.json({ error: 'Session expired' }, { status: 401 });
    const res = NextResponse.redirect(loginRedirect);
    res.cookies.delete('nt-admin-session');
    return res;
  }
}

export const config = {
  // Run on all paths except Next.js internals and static files so that
  // admin-subdomain requests (e.g. admin.nutritribe.com/orders) are caught.
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)',
  ],
};
