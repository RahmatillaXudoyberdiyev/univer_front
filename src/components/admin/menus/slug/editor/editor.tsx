'use client'

import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  Button,
  CreateLink,
  InsertCodeBlock,
  InsertImage,
  InsertTable,
  InsertThematicBreak,
  ListsToggle,
  MDXEditor,
  MDXEditorMethods,
  toolbarPlugin,
  UndoRedo,
} from '@mdxeditor/editor'
import '@mdxeditor/editor/style.css'
import React, { useRef, useState } from 'react'

// Barcha bepul pluginlarni import qilamiz
import {
  AdmonitionDirectiveDescriptor,
  codeBlockPlugin,
  codeMirrorPlugin,
  diffSourcePlugin,
  directivesPlugin,
  frontmatterPlugin,
  headingsPlugin,
  imagePlugin,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  quotePlugin,
  sandpackPlugin,
  Separator, // Toolbar uchun ajratuvchi
  tablePlugin,
  thematicBreakPlugin,
} from '@mdxeditor/editor'

const Editor: React.FC = () => {
  const [markdown, setMarkdown] = useState<string>(`# Salom MDX Editor!

Bu **MDX** editorning to'liq bepul featurelari bilan ishlaydigan versiyasi.

- Ro'yxatlar
- Jadval
- Kod bloklari
- Rasmlar
- va boshqalar...

\`\`\`jsx
import React from 'react';

export const MyComponent = () => <div>MDX ichida JSX!</div>;
\`\`\`

<MyComponent />
`)

  const editorRef = useRef<MDXEditorMethods>(null)

  const handleSave = () => {
    const currentMarkdown = editorRef.current?.getMarkdown()
    if (currentMarkdown) {
      // Bu yerda saqlash logikasi: masalan, API ga yuborish, localStorage ga saqlash yoki console ga chiqarish
      console.log('Saqlangan MDX/Markdown:', currentMarkdown)
      alert('MDX muvaffaqiyatli saqlandi!\n\n' + currentMarkdown)
      // Misol uchun localStorage ga saqlash:
      // localStorage.setItem('savedMDX', currentMarkdown);
    }
  }

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
      <h1>MDX Editor (Barcha bepul featurelar + Saqlash tugmasi)</h1>

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
          imagePlugin(),
          frontmatterPlugin(),
          codeBlockPlugin(),
          codeMirrorPlugin(),
          directivesPlugin({
            directiveDescriptors: [AdmonitionDirectiveDescriptor],
          }),
          diffSourcePlugin({
            viewMode: 'rich-text',
            diffMarkdown: '# Eski versiya',
          }),
          sandpackPlugin(),

          // Toolbar plugin - custom toolbar bilan
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
                <InsertCodeBlock />
                <Separator />

                {/* Custom Saqlash tugmasi */}
                <Button onClick={handleSave} title="Saqlash">
                  💾 Saqlash
                </Button>
              </>
            ),
          }),
        ]}
      />

      <div style={{ marginTop: '20px' }}>
        <h2>Joriy Markdown (real-time):</h2>
        <pre
          style={{
            background: '#f0f0f0',
            padding: '10px',
            borderRadius: '4px',
            whiteSpace: 'pre-wrap',
          }}
        >
          {markdown}
        </pre>
      </div>
    </div>
  )
}

export default Editor
