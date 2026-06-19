import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminToken, SESSION_COOKIE } from '@/lib/auth';

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

  const isAdminArea = effectivePath.startsWith('/admin') && effectivePath !== '/admin/login';

  if (isAdminArea) {
    const token = req.cookies.get(SESSION_COOKIE.name)?.value;
    const valid = token ? await verifyAdminToken(token) : false;
    if (!valid) {
      const loginUrl = new URL(isAdminSubdomain ? '/login' : '/admin/login', req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return needsRewrite
    ? NextResponse.rewrite(new URL(effectivePath, req.url))
    : NextResponse.next();
}

export const config = {
  // Run on all paths except Next.js internals and static files so that
  // admin-subdomain requests (e.g. admin.nutritribe.com/orders) are caught.
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)',
  ],
};
