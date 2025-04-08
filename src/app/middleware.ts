// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request,secret:process.env.NEXTAUTH_SECRET})
  console.log("token::",token)
  const { pathname } = request.nextUrl

  // If NOT logged in and trying to access home (/), redirect to /sign-in
  if (!token && pathname === '/') {
    return NextResponse.redirect(new URL('/sign-in', request.url))
  }

  // If logged in and trying to access /sign-in, redirect to home (/)
  if (token && pathname === '/sign-in') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/sign-in'],
}
