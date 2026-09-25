/**
 * Utilidades del Design System (helpers puros, sin React).
 * Se exportan también como subpath: `@farutech/design-system/utils`.
 */
export { cn, twMerge } from './cn'

/** Limita un número al rango [min, max]. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/** Trunca un texto agregando elipsis (por defecto `…`). */
export function truncate(value: string, maxLength: number, ellipsis = '…'): string {
  if (maxLength <= ellipsis.length) return ellipsis.slice(0, Math.max(0, maxLength))
  return value.length <= maxLength ? value : `${value.slice(0, maxLength - ellipsis.length).trimEnd()}${ellipsis}`
}

/** Convierte texto a slug URL-safe (sin acentos). */
export function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/** Capitaliza la primera letra. */
export function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

/** Devuelve un rango numérico [start, end]. */
export function range(start: number, end: number): number[] {
  const length = Math.max(0, end - start + 1)
  return Array.from({ length }, (_, i) => start + i)
}

/** Elimina duplicados por clave manteniendo el primer registro. */
export function uniqueBy<T>(items: T[], key: (item: T) => string | number): T[] {
  const seen = new Set<string | number>()
  return items.filter((item) => {
    const k = key(item)
    if (seen.has(k)) return false
    seen.add(k)
    return true
  })
}

/** Formatea un número con separadores locales. */
export function formatNumber(value: number, locale = 'es-CO', options?: Intl.NumberFormatOptions): string {
  return new Intl.NumberFormat(locale, options).format(value)
}

/** Formatea un valor monetario. */
export function formatCurrency(value: number, currency = 'COP', locale = 'es-CO'): string {
  return new Intl.NumberFormat(locale, { style: 'currency', currency, maximumFractionDigits: 0 }).format(value)
}

/** Formatea una fecha (Date | ISO string) sin dependencias externas. */
export function formatDate(value: Date | string | number, locale = 'es-CO', options?: Intl.DateTimeFormatOptions): string {
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat(locale, options ?? { day: '2-digit', month: 'short', year: 'numeric' }).format(date)
}

/** Formatea bytes en unidades legibles (KB, MB, GB...). */
export function formatBytes(bytes: number, decimals = 1): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1)
  const value = bytes / 1024 ** index
  return `${value.toFixed(index === 0 ? 0 : decimals)} ${units[index]}`
}

/** Promesa que resuelve tras `ms` milisegundos (útil en tests/loaders). */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
