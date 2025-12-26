'use client'

import '@/app/globals.css' // agar global style bo'lsa
import { api } from '@/models/axios'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import remarkGfm from 'remark-gfm'

const Page = () => {
  const { menu, subMenu } = useParams()

  const pageData = useQuery({
    queryKey: ['page', menu, subMenu],
    queryFn: async () => {
      const res = await api.get(`/sub-menu/slug/${subMenu}`)
      return res.data
    },
    enabled: !!subMenu,
  })

  if (pageData.isLoading) {
    return (
      <div className="container-cs">
        <p>Yuklanmoqda...</p>
      </div>
    )
  }

  if (pageData.isError || !pageData.data) {
    return (
      <div className="container-cs">
        <p>Xatolik yuz berdi yoki sahifa topilmadi.</p>
      </div>
    )
  }

  const content = pageData.data.content || ''

  return (
    <div className="container-cs py-10">
      <article className="prose prose-lg lg:prose-xl mx-auto">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw, rehypeSanitize]}
          components={{
            img: ({ node, ...props }) => (
              <img
                {...props}
                alt={props.alt || 'Rasm'}
                className="max-w-full h-auto rounded-lg shadow-md my-6"
              />
            ),
            table: ({ children }) => (
              <div className="overflow-x-auto my-8">
                <table className="min-w-full divide-y divide-gray-300 border border-gray-300 rounded-lg">
                  {children}
                </table>
              </div>
            ),
            thead: ({ children }) => (
              <thead className="bg-gray-100">{children}</thead>
            ),
            th: ({ children }) => (
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {children}
              </td>
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </article>
    </div>
  )
}

export default Page
