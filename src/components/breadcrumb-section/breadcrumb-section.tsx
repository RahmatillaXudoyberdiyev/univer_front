import Link from 'next/link'

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

type BreadcrumbSectionProps = {
    prevPagesPaths: string[]
    prevPages: string[]
    currentPage: string

}

export function BreadcrumbSection({
    prevPagesPaths,
    prevPages,

    currentPage,
}: BreadcrumbSectionProps) {
    return (
        <Breadcrumb className='w-full'>
            <BreadcrumbList>
            {
                prevPages.map((prevPage, index) => (
                    <BreadcrumbItem key={index}>
                        <BreadcrumbLink asChild>
                            <Link href={prevPagesPaths[index]}>{prevPage}</Link>
                        </BreadcrumbLink>
                        <BreadcrumbSeparator />
                    </BreadcrumbItem>
                ))
            }
            {
                <BreadcrumbItem>
                    <BreadcrumbPage>{currentPage}</BreadcrumbPage>
                </BreadcrumbItem>
            }
            </BreadcrumbList>
        </Breadcrumb>
    )
}
