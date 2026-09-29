// import { NextResponse } from 'next/server'
// import type { NextRequest } from 'next/server'

// export function middleware(request: NextRequest) {
//   const token = request.cookies.get('access_token')?.value
//   const isDashboard = request.nextUrl.pathname.startsWith('/app/dashboard')

//   if (isDashboard && !token) {
//     return NextResponse.redirect(new URL('/account', request.url))
//   }

//   return NextResponse.next()
// }

// export const config = {
//   matcher: ['/app/dashboard/:path*'],
// }