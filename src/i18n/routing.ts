import { supportedLanguages } from '@/lib/utils'
import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
    locales: supportedLanguages,
    defaultLocale: 'uz',
    localeDetection: false,
})
