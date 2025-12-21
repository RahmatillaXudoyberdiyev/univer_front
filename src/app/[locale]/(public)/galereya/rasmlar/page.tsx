import PhotoGallery from '@/components/galereya/rasmlar/photo-gallery'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata() {
    const t = await getTranslations()

    return {
        title: t('Photo gallery'),
        description: t(
            'Photo gallery'
        ),
    }
}

const Page = () => {
    return <PhotoGallery />
}

export default Page
