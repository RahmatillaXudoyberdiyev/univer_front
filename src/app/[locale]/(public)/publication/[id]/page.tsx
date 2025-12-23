import PublicationItem from '@/components/publication/publication-item'
import { cookies } from 'next/headers'

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
    const store = await cookies()
    const tab = store.get('publication-tab')?.value

    const { id } = await params
    return (
        <div>
            <PublicationItem id={id} tab={tab as any} />
        </div>
    )
}

export default Page
