import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const session = request.cookies.get('treetracker_session')?.value
  const { pathname } = request.nextUrl

  // 1. Define public paths (always accessible)
  const isPublicPath = pathname === '/' || 
                       pathname === '/login' || 
                       pathname === '/signup' || 
                       pathname === '/about' ||
                       pathname.startsWith('/api') ||
                       pathname.startsWith('/_next') ||
                       pathname.includes('.') // for static files like icons/images

  // 2. Define auth paths (login/signup)
  const isAuthPath = pathname === '/login' || pathname === '/signup'

  // 3. Logic: Redirect to login if accessing protected route without session
  if (!isPublicPath && !session) {
    const url = new URL('/login', request.url)
    // Optional: add a callback URL to return to after login
    url.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(url)
  }

  // 4. Logic: Redirect to dashboard if trying to access login while already logged in
  if (isAuthPath && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
