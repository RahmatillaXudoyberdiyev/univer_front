import axios from 'axios'
import createMiddleware from 'next-intl/middleware'
import { cookies } from 'next/headers'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { env } from 'process'
import { routing } from './i18n/routing'
import { baseBackendUrl } from './models/axios'

// i18n middleware
const intlMiddleware = createMiddleware(routing)

// private route ro‘yxati
const protectedRoutes = ['/admin']

// Auth + Role middleware
export async function proxy(req: NextRequest) {
  const cookiesStore = await cookies()
  const res = intlMiddleware(req)
  const token = req.cookies.get('saminvest-token')?.value

  const pathname = req.nextUrl.pathname
  const segments = pathname.split('/').filter(Boolean)
  const routePath = '/' + (segments[1] || '')

  if (!cookiesStore.get('intl-locale')?.value) {
    cookiesStore.set('intl-locale', 'uz')
  }
  const matchedRoute = protectedRoutes.find((r) => routePath.startsWith(r))

  if (matchedRoute) {
    if (env.ENV === 'production') {
      if (!token) {
        return NextResponse.redirect(new URL('/login', req.url))
      }

      try {
        const meRes = await axios.get(`${baseBackendUrl}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (meRes.status !== 200 && meRes.status !== 201) {
          return NextResponse.redirect(new URL('/login', req.url))
        }

        const user = meRes.data

        cookiesStore.set('saminvest-me', JSON.stringify(user))

        if (
          matchedRoute === '/admin' &&
          user.username?.toString().toLowerCase().replace('_', '-') !==
            'admin123'
        ) {
          return NextResponse.redirect(new URL('/admin', req.url))
        }
      } catch {
        return NextResponse.redirect(new URL('/login', req.url))
      }
    }
  }

  return res
}

export const config = {
  matcher: ['/((?!api|trpc|_next|_vercel|.*\\..*).*)'],
}
