import MainDetails from '@/components/admin/main-detials'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale })

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
