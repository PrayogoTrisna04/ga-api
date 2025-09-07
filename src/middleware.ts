// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';
// import jwt from 'jsonwebtoken';

// const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// File: middleware.ts

// middleware.ts
import { NextRequest, NextResponse } from 'next/server'

const ALLOWED_ORIGIN = 'http://localhost:3000'

const PUBLIC_API = [
  '/api/auth',
  '/api/submission-detail',
  '/api/approval',
  '/api/upload',
  '/api/asset',
  '/api/category',
  '/api/procurement',
  '/api/asset-assignment',
  '/api/vendor',
  '/api/vendor-product',
]

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const origin = req.headers.get('origin') || ''

  // Preflight (OPTIONS)
  if (req.method === 'OPTIONS') {
    if (origin === ALLOWED_ORIGIN) {
      return new NextResponse(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
          'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Allow-Credentials': 'true',
        },
      })
    }
    return new NextResponse(null, { status: 403 })
  }

  // Kalau route public, skip auth
  if (PUBLIC_API.some(path => pathname.startsWith(path))) {
    return withCors(NextResponse.next(), origin)
  }

  const token = req.cookies.get('token')?.value
  if (!token) {
    return withCors(
      NextResponse.json({ message: 'Unauthorized' }, { status: 401 }),
      origin
    )
  }

  return withCors(NextResponse.next(), origin)
}

function withCors(res: NextResponse, origin: string) {
  if (origin === ALLOWED_ORIGIN) {
    res.headers.set('Access-Control-Allow-Origin', ALLOWED_ORIGIN)
    res.headers.set('Access-Control-Allow-Credentials', 'true')
  }
  return res
}

export const config = {
  matcher: ['/api/:path*'],
}

// export function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl;
//   const token = request.cookies.get('token')?.value;
//   const isApi = pathname.startsWith('/api');

//   // Skip login route
//   if (pathname.startsWith('/api/auth/login') || pathname.startsWith('/api/auth/register')) {
//     return NextResponse.next();
//   }

//   // No token
//   if (!token) {
//     return isApi
//       ? NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
//       : NextResponse.redirect(new URL('/unauthorized', request.url));
//   }

//   // Token verification
//   try {
//     jwt.verify(token, JWT_SECRET);
//     return NextResponse.next();
//   } catch{
//     return isApi
//       ? NextResponse.json({ error: 'Invalid token' }, { status: 401 })
//       : NextResponse.redirect(new URL('/unauthorized', request.url));
//   }
// }

// export const config = {
//   matcher: ['/api/:path*', '/dashboard/:path*'], // protect all API and dashboard pages
// };
