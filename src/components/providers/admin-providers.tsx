import { NextIntlClientProvider } from 'next-intl'
import { ThemeProvider } from 'next-themes'
import { SidebarProvider } from '../ui/sidebar'
import { AdminSidebar } from './admin-sidebar'

const AdminProviders = ({ children }: { children: React.ReactNode }) => {
    return (
        <NextIntlClientProvider>
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
            >
                <SidebarProvider className='w-full flex'>
                    <AdminSidebar />
                    <div className="w-full flex-1 h-screen overflow-y-auto no-scrollbar">{children}</div>
                </SidebarProvider>
            </ThemeProvider>
        </NextIntlClientProvider>
    )
}

export default AdminProviders
