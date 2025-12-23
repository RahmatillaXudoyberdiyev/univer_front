import AdminPublication from '@/components/admin/media/admin-publication'
import { cookies } from 'next/headers'

const Page = async () => {
    const store = await cookies()
    const tab = store.get('admin-publication-tab')?.value

    return (
        <div>
            <AdminPublication tab={tab as any} />
        </div>
    )
}

export default Page
