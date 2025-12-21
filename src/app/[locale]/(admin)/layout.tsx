import { Geist, Geist_Mono } from 'next/font/google'

import { LanguageSwitcher } from '@/components/language-switcher/language-switcher'
import { ModeToggle } from '@/components/mode-toggle/mode-toggle'
import AdminProviders from '@/components/providers/admin-providers'
import { SidebarTrigger } from '@/components/ui/sidebar'
import Link from 'next/link'
import '../../globals.css'

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
    display: 'swap',
})

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
    display: 'swap',
})

const AdminLayout = ({
    children,
}: Readonly<{
    children: React.ReactNode
}>) => {
    return (
        <html suppressHydrationWarning lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <AdminProviders>
                    <main className="">
                        <header className="p-5 lg:px-10 flex justify-between items-center sticky top-0 z-50 w-full bg-background border-b-2 border-black/15 dark:border-white/15">
                            <SidebarTrigger />
                            <Link href="/admin">Admin Panel</Link>
                            <div className="flex gap-2 ">
                                <LanguageSwitcher />
                                <ModeToggle />
                            </div>
                        </header>
                        {children}
                    </main>
                </AdminProviders>
            </body>
        </html>
    )
}

export default AdminLayout
