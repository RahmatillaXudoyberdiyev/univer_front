import Announcements from '@/components/announcements/announcements'
import Events from '@/components/events/events'
import HeroSection from '@/components/hero-section/hero-section'
import NewsSection from '@/components/news-section/news-section'
import RegionalSection from '@/components/regional-section/regional-section'
import StatisticsSection from '@/components/statistics-section/statistics-section'
import UsefulLinks from '@/components/useful-links/useful-links'

export default function Home() {
    return (
        <div>
            <HeroSection />
            <NewsSection />
            <StatisticsSection />
            <Announcements />
            <RegionalSection />
            <Events />
            <UsefulLinks />
        </div>
    )
}
