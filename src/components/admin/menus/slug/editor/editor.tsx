'use client'

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
  MDXEditorMethods,
  Separator,
  toolbarPlugin,
  UndoRedo,
} from '@mdxeditor/editor'
import '@mdxeditor/editor/style.css'
import React, { useRef } from 'react'

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
import { useParams } from 'next/navigation'

const Editor: React.FC = () => {
  const { id } = useParams()
  const editorRef = useRef<MDXEditorMethods>(null)

  // Ma'lumotni yuklash
  const { data, isLoading } = useQuery({
    enabled: !!id,
    queryKey: ['sub-menu', id],
    queryFn: async () => {
      const response = await api.get(`/sub-menu/slug/${id}`)
      return response.data
    },
  })

  // Initial markdown qiymati — API dan kelganda ishlatiladi
  const initialMarkdown = data?.content || ''

  const handleSave = async () => {
    const currentMarkdown = editorRef.current?.getMarkdown()
    if (!currentMarkdown) return

    try {
      const response = await api.patch(`/sub-menu/update/${id}`, {
        content: currentMarkdown,
      })
      console.log('Menu saved successfully:', response.data)
    } catch (error) {
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
      return `${baseBackendUrl}/${uploadPath}`
    } catch (error) {
      console.error('Image upload error:', error)
      alert('Rasm yuklashda xato yuz berdi!')
      return 'https://via.placeholder.com/150?text=Upload+Failed'
    }
  }

  // Agar ma'lumot hali yuklanayotgan bo'lsa, loading ko'rsatish mumkin
  if (isLoading) {
    return <div>Yuklanmoqda...</div>
  }

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
      <MDXEditor
        className="shadow-sm"
        ref={editorRef}
        markdown={initialMarkdown} // Bu yerda to'g'ri initial qiymat berilmoqda
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
                  💾 Saqlash
                </Button>
              </>
            ),
          }),
        ]}
      />
    </div>
  )
}

export default Editor
