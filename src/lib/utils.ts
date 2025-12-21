import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const supportedLanguages: string[] = ['uz', 'oz', 'ru', 'en']

export const languageNames: Record<string, string> = {
  uz: "O'zbekcha",
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

export const emptyLocalized = () =>
  Object.entries(languageNames).reduce(
    (acc, [lang]) => ({ ...acc, [lang]: '' }),
    {} as Record<string, string>
  )

export const emptyLocalizedArray = () =>
  Object.entries(languageNames).reduce(
    (acc, [lang]) => ({ ...acc, [lang]: [] }),
    {} as Record<string, string[]>
  )
