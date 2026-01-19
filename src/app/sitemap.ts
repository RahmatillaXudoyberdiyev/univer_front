import { MetadataRoute } from 'next'
import { api } from '@/models/axios'

const staticRoutes = ['/', '/publication', '/galereya', '/calc']
const locales = ['uz', 'oz', 'ru', 'en']
const baseUrl = 'https://saminvestcompany.uz'

async function getDynamicSlugs() {
  try {
    const [newsRes, eventsRes, announcementsRes] = await Promise.all([
      api.get('/news?limit=100'),
      api.get('/events?limit=100'),
      api.get('/announcements?limit=100'),
    ])

    const newsSlugs = (newsRes.data?.items || []).map((item: any) => item.slug)
    const eventSlugs = (eventsRes.data?.items || []).map((item: any) => item.slug)
    const announcementSlugs = (announcementsRes.data?.items || []).map((item: any) => item.slug)

    return { newsSlugs, eventSlugs, announcementSlugs }
  } catch (error) {
    console.warn('Failed to fetch dynamic slugs for sitemap:', error)
    return { newsSlugs: [], eventSlugs: [], announcementSlugs: [] }
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { newsSlugs, eventSlugs, announcementSlugs } = await getDynamicSlugs()
  const sitemap: MetadataRoute.Sitemap = []

  locales.forEach((locale) => {
    staticRoutes.forEach((route) => {
      sitemap.push({
        url: `${baseUrl}${locale === 'uz' ? '' : `/${locale}`}${route === '/' ? '' : route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: route === '/' ? 1.0 : 0.8,
      })
    })

    newsSlugs.forEach((slug: string) => {
      sitemap.push({
        url: `${baseUrl}${locale === 'uz' ? '' : `/${locale}`}/news/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      })
    })

    eventSlugs.forEach((slug: string) => {
      sitemap.push({
        url: `${baseUrl}${locale === 'uz' ? '' : `/${locale}`}/events/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      })
    })

    announcementSlugs.forEach((slug: string) => {
      sitemap.push({
        url: `${baseUrl}${locale === 'uz' ? '' : `/${locale}`}/announcements/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      })
    })
  })

  return sitemap
}
