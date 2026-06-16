import { NextRequest, NextResponse } from 'next/server';

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

  // Auth guard disabled — admin is open access for now
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
