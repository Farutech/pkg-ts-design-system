/**
 * maskEngine.ts — Motor puro de máscaras (Fase 3: Inputs & Formularios)
 *
 * Funciones puras sin dependencias de React: formatear (`format`) y
 * desformatear (`parse`) valores de dominio. Reutilizable desde
 * `useMaskedValue`, `MaskedInput`, `Input` y futuros consumidores
 * (p. ej. validaciones de servidor o helpers de formularios).
 *
 * Convenciones del repo:
 * - utils/engines en camelCase (`maskEngine.ts`, `cn.ts`)
 * - tipos públicos con prefijo `Mask*`
 * - sin efectos colaterales: toda función es determinista
 */

export type MaskType = 'currency' | 'phone' | 'date' | 'percent' | 'document' | 'custom'

export interface MaskConfig {
  type?: MaskType
  pattern?: string
  format?: (rawValue: string) => string
  parse?: (inputText: string) => string
  /** Mostrar valor transparente y editable mientras tiene el foco (por defecto true) */
  unmaskOnFocus?: boolean
}

export interface MaskEngine {
  format: (val: string) => string
  parse: (val: string) => string
}

/** Formateadores estándar integrados (puros, testeables sin React) */
export const DEFAULT_FORMATTERS: Record<MaskType, MaskEngine> = {
  currency: {
    format: (val: string) => {
      const clean = val.replace(/\D/g, '')
      if (!clean) return ''
      return `$ ${Number(clean).toLocaleString('es-CO')}`
    },
    parse: (val: string) => val.replace(/\D/g, ''),
  },
  phone: {
    format: (val: string) => {
      const clean = val.replace(/\D/g, '').slice(0, 10)
      if (!clean) return ''
      if (clean.length <= 3) return `(${clean}`
      if (clean.length <= 6) return `(${clean.slice(0, 3)}) ${clean.slice(3)}`
      return `(${clean.slice(0, 3)}) ${clean.slice(3, 6)}-${clean.slice(6, 10)}`
    },
    parse: (val: string) => val.replace(/\D/g, ''),
  },
  date: {
    format: (val: string) => {
      const clean = val.replace(/\D/g, '').slice(0, 8)
      if (!clean) return ''
      if (clean.length <= 2) return clean
      if (clean.length <= 4) return `${clean.slice(0, 2)}/${clean.slice(2)}`
      return `${clean.slice(0, 2)}/${clean.slice(2, 4)}/${clean.slice(4, 8)}`
    },
    parse: (val: string) => val.replace(/\D/g, ''),
  },
  percent: {
    format: (val: string) => {
      const clean = val.replace(/[^\d.]/g, '')
      if (!clean) return ''
      return `${clean}%`
    },
    parse: (val: string) => val.replace(/[^\d.]/g, ''),
  },
  document: {
    format: (val: string) => {
      const clean = val.replace(/\D/g, '').slice(0, 10)
      if (!clean) return ''
      if (clean.length <= 9) {
        return Number(clean).toLocaleString('es-CO')
      }
      return `${clean.slice(0, 9)}-${clean.slice(9, 10)}`
    },
    parse: (val: string) => val.replace(/\D/g, ''),
  },
  custom: {
    format: (val: string) => val,
    parse: (val: string) => val,
  },
}

/**
 * Resuelve la configuración activa de máscara combinando:
 * - `mask` como atajo (`MaskType`) o configuración completa (`MaskConfig`)
 * - `unmaskOnFocus` global como fallback cuando la config no lo define
 */
export function resolveMaskConfig(
  mask: MaskConfig | MaskType | undefined | null,
  unmaskOnFocus = true,
): MaskConfig | null {
  if (!mask) return null
  if (typeof mask === 'string') {
    return { type: mask, ...DEFAULT_FORMATTERS[mask] }
  }
  const defaultEngine = mask.type ? DEFAULT_FORMATTERS[mask.type] : DEFAULT_FORMATTERS.custom
  return {
    type: mask.type || 'custom',
    format: mask.format || defaultEngine.format,
    parse: mask.parse || defaultEngine.parse,
    unmaskOnFocus: mask.unmaskOnFocus !== undefined ? mask.unmaskOnFocus : unmaskOnFocus,
  }
}
