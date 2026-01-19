import Announcements from '@/components/announcements/announcements'
import Events from '@/components/events/events'
import HeroSection from '@/components/hero-section/hero-section'
import NewsSection from '@/components/news-section/news-section'
import StatisticsSection from '@/components/statistics-section/statistics-section'
import UsefulLinks from '@/components/useful-links/useful-links'
import { getTranslations } from 'next-intl/server'
import { Metadata } from 'next'

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>
}): Promise<Metadata> {
    const { locale } = await params
    const t = await getTranslations({ locale })

    const title = t('Bosh sahifa')
    const description = t(
        'Samarqand viloyati Investitsiyalar sanoat va savdo boshqarmasi'
    )
    const keywords = [
        'samarqand invest kompaniyasi',
        'saminvest kompaniyasi',
        'samarqand investitsiya',
        'samarqand viloyati investitsiyalar',
        'saminvestcompany.uz',
        'инвестиционная компания Самарканд',
        'Саминвест компанияси',
        'Samarkand investment company',
    ]

    return {
        title,
        description,
        keywords,
        alternates: {
            canonical: `https://saminvestcompany.uz/${locale}`,
            languages: {
                uz: 'https://saminvestcompany.uz/uz',
                ru: 'https://saminvestcompany.uz/ru',
                en: 'https://saminvestcompany.uz/en',
            },
        },
        openGraph: {
            title,
            description,
            url: `https://saminvestcompany.uz/${locale}`,
            siteName: 'Saminvest Company',
            locale,
            type: 'website',
        },
        robots: {
            index: true,
            follow: true,
        },
    }
}

export default function Home() {
    return (
        <div>
            <HeroSection />
            <NewsSection />
            <StatisticsSection />
            <Announcements />
            <Events />
            <UsefulLinks />
        </div>
    )
}
