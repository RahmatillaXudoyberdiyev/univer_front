import { Inter } from 'next/font/google'
import ReactQueryProvider from '@/components/providers/react-query-provider'
import ToastifyProvider from '@/components/providers/toastify-provider'
import { NextIntlClientProvider, useMessages } from 'next-intl'
import './globals.css'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin', 'cyrillic', 'cyrillic-ext', 'latin-ext'],
  display: 'swap',
})

const defaultTheme: string = 'light'

const Layout = ({
  children,
  params: { locale }
}: Readonly<{
  children: React.ReactNode
  params: { locale: string }
}>) => {
  const messages = useMessages()

  return (
    <html
      className={`${inter.variable} ${defaultTheme}`}
      style={{ colorScheme: defaultTheme }}
      suppressHydrationWarning
      lang={locale || "uz"}
    >
      <body className={`${inter.className} antialiased`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
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
