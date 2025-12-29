'use client'

import useNotify from '@/hooks/use-notify'
import {
    BlockTypeSelect,
    BoldItalicUnderlineToggles,
    Button,
    CreateLink,
    imagePlugin,
    InsertImage,
    InsertTable,
    InsertThematicBreak,
    ListsToggle,
    MDXEditor,
    Separator,
    toolbarPlugin,
    UndoRedo,
} from '@mdxeditor/editor'
import '@mdxeditor/editor/style.css'
import { useRef, useState } from 'react'

import { UploadedFile } from '@/components/file-upload-zone'
import { api, baseBackendUrl } from '@/models/axios'
import {
    AdmonitionDirectiveDescriptor,
    codeBlockPlugin,
    diffSourcePlugin,
    directivesPlugin,
    frontmatterPlugin,
    headingsPlugin,
    linkDialogPlugin,
    linkPlugin,
    listsPlugin,
    markdownShortcutPlugin,
    quotePlugin,
    tablePlugin,
    thematicBreakPlugin,
} from '@mdxeditor/editor'
import { useQuery } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'

const Editor = () => {
    const { id } = useParams()
    const t = useTranslations()
    const [files, setFiles] = useState<UploadedFile[]>([])
    const editorRef = useRef<any>(null)
    const { toastSuccess, toastWarning, toastError } = useNotify()
    const { data, isLoading } = useQuery({
        enabled: !!id,
        queryKey: ['sub-menu', id],
        refetchOnMount: true,
        refetchOnWindowFocus: false,
        queryFn: async () => {
            const response = await api.get(`/sub-menu/slug/${id}`)
            return response.data
        },
    })

    const initialMarkdown = data?.content || ''

    const handleSave = async () => {
        const currentMarkdown = editorRef.current?.getMarkdown()
        if (!currentMarkdown) return

        try {
            const response = await api.patch(`/sub-menu/update/${data.id}`, {
                content: currentMarkdown,
            })
            console.log('Menu saved successfully:', response.data)
            toastSuccess(t('Malumotlar muvaffaqiyatli saqlandi'))
        } catch (error) {
            toastError(t('Malumotlar saqlashda xatolik yuzaga keldi'))
            console.error('Error saving menu:', error)
        }
    }

    const imageUploadHandler = async (image: File): Promise<string> => {
        const formData = new FormData()
        formData.append('file', image)

        try {
            console.log('Uploading image:', image)
            const response = await api.post('/uploads', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })
            const uploadPath = response.data?.uploadPath
            toastSuccess(t('Rasmlar muvaffaqiyatli yuklandi'))
            return `${baseBackendUrl}/${uploadPath}`
        } catch (error) {
            console.error('Image upload error:', error)
            toastError(t('Rasmlar yuklashda xatolik yuz berdi'))
            return 'https://via.placeholder.com/150?text=Upload+Failed'
        }
    }

    if (isLoading) {
        return <div>{t('Yuklanmoqda')}...</div>
    }

    return (
        <div
            style={{ maxWidth: '900px' }}
            className="mx-auto py-10 flex flex-col gap-3"
        >
            <MDXEditor
                className="shadow-sm"
                ref={editorRef}
                markdown={initialMarkdown}
                plugins={[
                    headingsPlugin(),
                    listsPlugin(),
                    quotePlugin(),
                    thematicBreakPlugin(),
                    markdownShortcutPlugin(),
                    tablePlugin(),
                    linkPlugin(),
                    linkDialogPlugin(),
                    imagePlugin({ imageUploadHandler }),
                    frontmatterPlugin(),
                    codeBlockPlugin(),
                    directivesPlugin({
                        directiveDescriptors: [AdmonitionDirectiveDescriptor],
                    }),
                    diffSourcePlugin({
                        diffMarkdown: 'An older version',
                        viewMode: 'rich-text',
                    }),
                    toolbarPlugin({
                        toolbarContents: () => (
                            <>
                                <UndoRedo />
                                <Separator />
                                <BoldItalicUnderlineToggles />
                                <Separator />
                                <BlockTypeSelect />
                                <ListsToggle />
                                <Separator />
                                <CreateLink />
                                <InsertImage />
                                <Separator />
                                <InsertTable />
                                <InsertThematicBreak />
                                <Separator />
                                <Button onClick={handleSave} title="Saqlash">
                                    💾 {t('Saqlash')}
                                </Button>
                            </>
                        ),
                    }),
                ]}
            />
            {/* <FileUploadZone files={files} setFiles={setFiles} /> */}
        </div>
    )
}

export default Editor
