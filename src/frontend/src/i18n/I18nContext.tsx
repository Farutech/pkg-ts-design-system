import React, { createContext, useContext, useMemo } from 'react'
import { esMessages, enMessages, type DesignSystemMessages } from './locales'

export type LocaleCode = 'es' | 'en' | string

export interface I18nContextValue {
  locale: LocaleCode
  messages: DesignSystemMessages
  t: (path: string, params?: Record<string, string | number>) => string
}

export const I18nContext = createContext<I18nContextValue>({
  locale: 'es',
  messages: esMessages,
  t: (path, params) => interpolate(resolvePath(esMessages, path), params),
})

function resolvePath(obj: any, path: string): string {
  const parts = path.split('.')
  let current = obj
  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part]
    } else {
      return path
    }
  }
  return typeof current === 'string' ? current : path
}

function interpolate(text: string, params?: Record<string, string | number>): string {
  if (!params) return text
  return Object.entries(params).reduce((acc, [key, val]) => {
    return acc.replace(new RegExp(`\\{${key}\\}`, 'g'), String(val))
  }, text)
}

export interface I18nProviderProps {
  locale?: LocaleCode
  messages?: Partial<DesignSystemMessages>
  children: React.ReactNode
}

export function I18nProvider({ locale = 'es', messages: customMessages, children }: I18nProviderProps) {
  const value = useMemo<I18nContextValue>(() => {
    const base = locale === 'en' ? enMessages : esMessages
    const merged: DesignSystemMessages = {
      ...base,
      ...customMessages,
      dataTable: { ...base.dataTable, ...customMessages?.dataTable },
      select: { ...base.select, ...customMessages?.select },
      pagination: { ...base.pagination, ...customMessages?.pagination },
      fileUpload: { ...base.fileUpload, ...customMessages?.fileUpload },
      security: { ...base.security, ...customMessages?.security },
      general: { ...base.general, ...customMessages?.general },
    }

    return {
      locale,
      messages: merged,
      t: (path: string, params?: Record<string, string | number>) => {
        const template = resolvePath(merged, path)
        return interpolate(template, params)
      },
    }
  }, [locale, customMessages])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  return useContext(I18nContext)
}
