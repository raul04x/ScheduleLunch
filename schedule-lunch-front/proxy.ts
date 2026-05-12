import { NextRequest, NextResponse } from 'next/server';

const AUTH_PATHS = ['/login', '/register'];

function decodeJwt(token: string): { role: string; exp: number } | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      role: payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ?? '',
      exp: payload.exp ?? 0,
    };
  } catch {
    return null;
  }
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const raw = req.cookies.get('sl_token')?.value;

  const decoded = raw ? decodeJwt(raw) : null;
  const isAuthenticated = decoded !== null && decoded.exp * 1000 > Date.now();
  const isAdmin = decoded?.role === 'SuperAdmin' || decoded?.role === 'GroupAdmin';

  // Setup: only accessible when not authenticated
  if (pathname.startsWith('/setup')) {
    if (isAuthenticated) return NextResponse.redirect(new URL('/login', req.url));
    return NextResponse.next();
  }

  // Auth pages: redirect authenticated users to their home
  if (AUTH_PATHS.some(p => pathname.startsWith(p))) {
    if (isAuthenticated)
      return NextResponse.redirect(new URL(isAdmin ? '/admin/users' : '/schedule', req.url));
    return NextResponse.next();
  }

  // All other pages require authentication
  if (!isAuthenticated) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Admin routes require admin role
  if (pathname.startsWith('/admin') && !isAdmin) {
    return NextResponse.redirect(new URL('/schedule', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
