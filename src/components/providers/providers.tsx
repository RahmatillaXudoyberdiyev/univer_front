import { NextIntlClientProvider } from 'next-intl'
import { ThemeProvider } from 'next-themes'
import { SidebarProvider } from '../ui/sidebar'
import { AppSidebar } from './app-sidebar'

const Providers = ({ children }: { children: React.ReactNode }) => {
    return (
        <NextIntlClientProvider >
            <ThemeProvider
                attribute="class"
                defaultTheme="light"
                enableSystem
                disableTransitionOnChange
            >
                <SidebarProvider className="flex w-full ">
                    <AppSidebar  />
                    <main className="w-full flex-1 h-screen overflow-y-auto no-scrollbar">
                        {children}
                    </main>
                </SidebarProvider>
            </ThemeProvider>
        </NextIntlClientProvider>
    )
}

export default Providers
