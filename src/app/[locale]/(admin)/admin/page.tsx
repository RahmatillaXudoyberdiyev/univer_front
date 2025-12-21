import MainDetails from '@/components/admin/main-detials'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata() {
    const t = await getTranslations()

    return {
        title: t('Admin Panel') + ' | ' + t('Asosiy sozlamalar'),
        description: t(
            'Samarqand viloyati Investitsiyalar sanoat va savdo boshqarmasi'
        ),
    }
}

const Page = () => {
    return (
        <div>
            <MainDetails />
        </div>
    )
}

export default Page
