import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}
export const supportedLanguages = ['uz', 'oz', 'ru', 'en']

export const languageNames = {
    uz: 'O\'zbekcha',
    oz: 'Ўзбекча',
    ru: 'Русский',
    en: 'English',
}

export const getStringValue = (value: unknown): string | null => {
    if (typeof value === 'string') return value
    if (value instanceof Date) return value.toISOString()
    return null
}

export const formatDateForInput = (value: unknown): string => {
    if (value instanceof Date) return value.toISOString().split('T')[0]
    if (typeof value === 'string' && value) return value.split('T')[0]
    return ''
}

export const emptyLocalized = () => ({ uz: '', oz: '', ru: '', en: '' })

export const emptyLocalizedArray = () => ({ uz: [], oz: [], ru: [], en: [] })
