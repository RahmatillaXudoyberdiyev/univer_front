import Footer from '@/components/footer/footer'
import Header from '@/components/header/header'
import Postfooter from '@/components/postfooter/postfooter'
import Prefooter from '@/components/prefooter/prefooter'
import Preheader from '@/components/preheader/preheader'
import Providers from '@/components/providers/providers'
import { getTranslations } from 'next-intl/server'
import { Golos_Text } from 'next/font/google'
import '../../globals.css'

const golosText = Golos_Text({
    variable: '--font-golos-text',
    subsets: ['latin', 'cyrillic', 'latin-ext', 'cyrillic-ext'],
})

export async function generateMetadata() {
    const t = await getTranslations()

    return {
        title: t('Bosh sahifa'),
        description: t(
            'Samarqand viloyati Investitsiyalar sanoat va savdo boshqarmasi'
        ),
    }
}

const defaultTheme = 'light'

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html
            lang="uz"
            className={defaultTheme}
            style={{ colorScheme: defaultTheme }}
        >
            <body className={`${golosText.variable} antialiased `}>
                <Providers>
                    <Preheader />
                    <Header />
                    {children}
                    <Prefooter />
                    <Footer />
                    <Postfooter />
                </Providers>
            </body>
        </html>
    )
}
