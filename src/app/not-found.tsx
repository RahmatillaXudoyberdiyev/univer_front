import './globals.css'

import { Button } from '@/components/ui/button'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'

export async function generateMetadata() {
    const t = await getTranslations()

    return {
        title: t('Sahifa topilmadi'),
        description: t('not-found-description'),
    }
}
export default async function NotFound() {
    const t = await getTranslations()
    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-white px-4">
            <div className="flex flex-col items-center text-center max-w-lg">
                <div className="mb-6 w-20 h-20 rounded-xl bg-[#2B2B7A]/10 flex items-center justify-center">
                    <span className="text-[#2B2B7A] font-bold text-2xl">
                        404
                    </span>
                </div>

                <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-3">
                    {t('Sahifa topilmadi')}
                </h1>

                <p className="text-gray-600 leading-relaxed mb-8 max-w-md">
                    {t('not-found-description')}
                </p>

                <div className="w-full max-w-xs">
                    <Button
                        asChild
                        className="w-full bg-[#2B2B7A] hover:bg-[#232362] text-white py-6 text-base font-medium"
                    >
                        <Link href="/">{t('Bosh sahifaga qaytish')}</Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}
