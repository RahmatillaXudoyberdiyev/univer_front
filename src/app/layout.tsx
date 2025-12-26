import { Inter } from 'next/font/google'

import ReactQueryProvider from '@/components/providers/react-query-provider'
import ToastifyProvider from '@/components/providers/toastify-provider'
import { NextIntlClientProvider } from 'next-intl'
import './globals.css'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin', 'cyrillic', 'cyrillic-ext', 'latin-ext'],
  display: 'swap',
})

const defaultTheme: string = 'light'

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <html
      className={defaultTheme}
      style={{ colorScheme: defaultTheme }}
      suppressHydrationWarning
      lang="uz"
    >
      <body className={`${inter.className} antialiased`}>
        <NextIntlClientProvider>
          <ReactQueryProvider>
            <ToastifyProvider />
            {children}
          </ReactQueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}

export default Layout
