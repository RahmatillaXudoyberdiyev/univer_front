import Announcements from '@/components/announcements/announcements'
import Events from '@/components/events/events'
import HeroSection from '@/components/hero-section/hero-section'
import NewsSection from '@/components/news-section/news-section'
import RegionalSection from '@/components/regional-section/regional-section'
import StatisticsSection from '@/components/statistics-section/statistics-section'
import UsefulLinks from '@/components/useful-links/useful-links'
import { getTranslations } from 'next-intl/server'
import mainImg from '../../../../public/image.png'
import Chatbot from '@/components/chatbot/chatbot'

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>
}) {
    const { locale } = await params
    const t = await getTranslations({ locale })

    return {
        title: t('Bosh sahifa'),
        description: t(
            'Samarqand viloyati Investitsiyalar sanoat va savdo boshqarmasi'
        ),
    }
}

export default function Home() {
    const slides = Array.from({ length: 10 }).map((_, i) => ({
        id: i,
        title: 'Davlat fuqarolik xizmatchilari uchun navbatdagi "Siyosiy-ma’rifat soati" tashkil etildi',
        date: '05.12.2025',
        image: mainImg,
    }))

    return (
        <div>
            <HeroSection slides={slides} />
            <NewsSection />
            <StatisticsSection />
            <Announcements />
            <RegionalSection />
            <Events />
            <UsefulLinks />
        </div>
    )
}
