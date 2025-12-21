import AdminGalereya from '@/components/admin/galereya/galereya'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale })

  return {
    title: t('Admin - Galereya'),
    description: t(
      'Samarqand viloyati Investitsiyalar sanoat va savdo boshqarmasi'
    ),
  }
}

const Page = () => {
  return (
    <div>
      <AdminGalereya />
    </div>
  )
}

export default Page
