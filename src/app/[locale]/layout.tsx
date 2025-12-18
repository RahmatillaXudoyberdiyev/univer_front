import Header from '@/components/header/header'
import Preheader from '@/components/preheader/preheader'
import Providers from '@/components/providers/providers'
import type { Metadata } from 'next'
import { Golos_Text } from 'next/font/google'
import '../globals.css'
import Prefooter from '@/components/prefooter/prefooter'
import Footer from '@/components/footer/footer'
import Postfooter from '@/components/postfooter/postfooter'

const golosText = Golos_Text({
    variable: '--font-golos-text',
    subsets: ['latin', 'cyrillic', 'latin-ext', 'cyrillic-ext'],
})

export const metadata: Metadata = {
    title: 'Create Next App',
    description: 'Created by ...',
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {

    return (
        <html lang="en">
            <body className={`${golosText.variable} antialiased `}>
                <Providers>
                    <Preheader />
                    <Header />
                    {children}
                    <Prefooter/>
                    <Footer/>
                    <Postfooter/>
                </Providers>
            </body>
        </html>
    )
}
