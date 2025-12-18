import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}
export const supportedLanguages = ['uz', 'oz', 'ru', 'en']

export const languageNames = {
    uz: 'Uzbek',
    oz: 'Ўзбекча',
    ru: 'Русский',
    en: 'English',
}
