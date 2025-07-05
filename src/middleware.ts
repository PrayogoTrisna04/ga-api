import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;
  const isApi = pathname.startsWith('/api');

  // Skip login route
  if (pathname.startsWith('/api/auth/login') || pathname.startsWith('/api/auth/register')) {
    return NextResponse.next();
  }

  // No token
  if (!token) {
    return isApi
      ? NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      : NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  // Token verification
  try {
    jwt.verify(token, JWT_SECRET);
    return NextResponse.next();
  } catch{
    return isApi
      ? NextResponse.json({ error: 'Invalid token' }, { status: 401 })
      : NextResponse.redirect(new URL('/unauthorized', request.url));
  }
}

export const config = {
  matcher: ['/api/:path*', '/dashboard/:path*'], // protect all API and dashboard pages
};
