import VideoGallery from '@/components/galereya/videolar/video-gallery'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata() {
    const t = await getTranslations()

    return {
        title: t('Video gallery'),
        description: t(
            'Video gallery'
        ),
    }
}

const Page = () => {
    return (
        <div>
            <VideoGallery />
        </div>
    )
}

export default Page
