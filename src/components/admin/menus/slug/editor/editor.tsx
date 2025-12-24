'use client'

import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  Button,
  CreateLink,
  imagePlugin,
  InsertCodeBlock,
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
import React, { useRef, useState } from 'react'

// Barcha bepul pluginlarni import qilamiz
import { api, baseBackendUrl } from '@/models/axios'
import {
  AdmonitionDirectiveDescriptor,
  codeBlockPlugin,
  codeMirrorPlugin,
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

const Editor: React.FC = () => {
  const [markdown, setMarkdown] = useState<string>(`# Salom MDX Editor!

Bu **MDX** editorning to'liq bepul featurelari bilan ishlaydigan versiyasi.

`)

  const editorRef = useRef<MDXEditorMethods>(null)

  const handleSave = () => {
    const currentMarkdown = editorRef.current?.getMarkdown()
    if (currentMarkdown) {
      console.log('Saqlangan MDX/Markdown:', currentMarkdown)
      alert('MDX muvaffaqiyatli saqlandi!\n\n' + currentMarkdown)
    }
  }

  // Image upload handler - bu yerda siz o'zingizning serveringizga upload qilasiz
  const imageUploadHandler = async (image: File): Promise<string> => {
    // Misol uchun: serverga yuklash
    const formData = new FormData()
    formData.append('file', image)

    try {
      // O'zingizning API endpoint'ingizni qo'ying, masalan: /api/upload-image
      console.log('Uploading image:', image)

      const response = await api.post('/uploads', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      const uploadPath = response.data?.uploadPath
      return `${baseBackendUrl}/${uploadPath}`
    } catch (error) {
      console.error('Image upload error:', error)
      alert('Rasm yuklashda xato yuz berdi!')
      // Xato bo'lsa placeholder URL qaytarish mumkin
      return 'https://via.placeholder.com/150?text=Upload+Failed'
    }
  }

  // Demo uchun: real upload o'rniga placeholder URL qaytarish
  // const imageUploadHandler = async (image: File) => {
  //   console.log('Yuklanayotgan rasm:', image.name)
  //   // 2 sekund kutib, placeholder qaytarish
  //   await new Promise(resolve => setTimeout(resolve, 2000))
  //   return `https://picsum.photos/seed/${image.name}/800/600`
  // }

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
      <h1>MDX Editor (Image Upload + Saqlash tugmasi)</h1>

      <MDXEditor
        ref={editorRef}
        markdown={markdown}
        onChange={(md) => setMarkdown(md)}
        plugins={[
          headingsPlugin(),
          listsPlugin(),
          quotePlugin(),
          thematicBreakPlugin(),
          markdownShortcutPlugin(),
          tablePlugin(),
          linkPlugin(),
          linkDialogPlugin(),
          // Image plugin - upload handler bilan
          imagePlugin({
            imageUploadHandler, // Bu funksiya yuklangan rasm uchun URL qaytaradi
            // imageAutocompleteSuggestions: ['https://via.placeholder.com/150', 'https://picsum.photos/200'],
          }),
          frontmatterPlugin(),
          codeBlockPlugin(),
          codeMirrorPlugin({
            codeBlockLanguages: {
              js: 'JavaScript',
              jsx: 'JSX',
              ts: 'TypeScript',
              tsx: 'TSX',
              css: 'CSS',
              html: 'HTML',
            },
          }),
          directivesPlugin({
            directiveDescriptors: [AdmonitionDirectiveDescriptor],
          }),
          diffSourcePlugin({
            diffMarkdown: 'An older version',
            viewMode: 'rich-text',
          }),

          // Toolbar plugin
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
                <InsertImage /> {/* Bu tugma endi upload dialog ochadi */}
                <Separator />
                <InsertTable />
                <InsertThematicBreak />
                <InsertCodeBlock />
                <Separator />
                {/* Saqlash tugmasi */}
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
