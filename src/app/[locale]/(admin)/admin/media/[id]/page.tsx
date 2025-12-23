import AdminPublicationItem from '@/components/admin/media/item/admin-publication-item'
import { cookies } from 'next/headers'

const Page = async ({
    params,
}: {
    params: Promise<{ id: string }>
}) => {
    const store = await cookies()
    const tab = store.get('admin-publication-tab')?.value
    const { id } = await params
    return <div>
        <AdminPublicationItem id={id} tab={tab as any} />
    </div>
}

export default Page
