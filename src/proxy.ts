import axios from 'axios'
import createMiddleware from 'next-intl/middleware'
import { cookies } from 'next/headers'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
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
  const segments = pathname.split('/').filter(Boolean) // ['uz', 'super-admin', ...]
  const routePath = '/' + (segments[1] || '') // /super-admin

  if (!cookiesStore.get('intl-locale')?.value) {
    cookiesStore.set('intl-locale', 'uz')
  }
  const matchedRoute = protectedRoutes.find((r) => routePath.startsWith(r))

  if (matchedRoute) {
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

      // Rolga qarab yo‘nalishni tekshiramiz
      if (
        matchedRoute === '/admin' &&
        user.username?.toString().toLowerCase().replace('_', '-') !== 'admin123'
      ) {
        return NextResponse.redirect(new URL('/admin', req.url))
      }
    } catch {
      // Token noto‘g‘ri bo‘lsa ham, login sahifasiga qaytarish
      return NextResponse.redirect(new URL('/login', req.url))
    }
  }

  // I18n ishlashini davom ettiramiz
  return res
}

// Middleware konfiguratsiyasi
export const config = {
  matcher: [
    '/((?!api|trpc|_next|_vercel|.*\\..*).*)', // i18n matcher
    // istasang protected yo‘llarni bu yerga ham kiritish mumkin
  ],
}
