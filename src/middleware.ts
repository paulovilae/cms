import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  // Handle CORS for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const response = NextResponse.next()

    // Get the origin from the request
    const origin = request.headers.get('origin')

    // List of allowed origins (both HTTP and HTTPS for production domains)
    const allowedOrigins = [
      'https://salarium.paulovila.org',
      'http://salarium.paulovila.org',
      'https://intellitrade.paulovila.org',
      'http://intellitrade.paulovila.org',
      'https://latinos.paulovila.org',
      'http://latinos.paulovila.org',
      'https://trade.paulovila.org',
      'http://trade.paulovila.org',
      'http://localhost:3003',
      'http://localhost:3004',
      'http://localhost:3005',
      'http://localhost:3006',
    ]

    // Check if the origin is allowed
    if (origin && allowedOrigins.includes(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin)
    }

    // Set other CORS headers
    response.headers.set('Access-Control-Allow-Credentials', 'true')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
    response.headers.set(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization, x-business, x-requested-with, accept, origin, cache-control',
    )

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 200, headers: response.headers })
    }

    return response
  }

  // Handle font and static asset CORS
  if (
    request.nextUrl.pathname.startsWith('/__nextjs_font/') ||
    request.nextUrl.pathname.startsWith('/_next/') ||
    request.nextUrl.pathname.startsWith('/media/')
  ) {
    const response = NextResponse.next()
    const origin = request.headers.get('origin')

    const allowedOrigins = [
      'https://salarium.paulovila.org',
      'http://salarium.paulovila.org',
      'https://intellitrade.paulovila.org',
      'http://intellitrade.paulovila.org',
      'https://latinos.paulovila.org',
      'http://latinos.paulovila.org',
      'https://trade.paulovila.org',
      'http://trade.paulovila.org',
    ]

    if (origin && allowedOrigins.includes(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin)
    }

    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/api/:path*', '/__nextjs_font/:path*', '/_next/:path*', '/media/:path*'],
}
