import { useState, useCallback, useMemo } from 'react'

export type MaskType = 'currency' | 'phone' | 'date' | 'percent' | 'document' | 'custom'

export interface MaskConfig {
  type?: MaskType
  pattern?: string
  format?: (rawValue: string) => string
  parse?: (inputText: string) => string
  /** Mostrar valor transparente y editable mientras tiene el foco (por defecto true) */
  unmaskOnFocus?: boolean
}

/** Formateadores estándar integrados */
const DEFAULT_FORMATTERS: Record<MaskType, { format: (val: string) => string; parse: (val: string) => string }> = {
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

export interface UseMaskedValueOptions {
  value?: string
  defaultValue?: string
  mask?: MaskConfig | MaskType
  unmaskOnFocus?: boolean
  onChange?: (cleanValue: string, formattedValue: string) => void
}

/**
 * useMaskedValue - Hook para gestionar el ciclo de vida de valores con máscara.
 * 
 * Implementa el patrón "Focus Unmasked / Blur Formatted":
 * - En reposo (!isFocused): Muestra el valor formateado con máscara visual.
 * - En edición (isFocused): Si unmaskOnFocus === true, conmuta al dato transparente/limpio.
 * - Notifica siempre el valor limpio de dominio a callbacks y formularios.
 */
export function useMaskedValue({
  value: controlledValue,
  defaultValue = '',
  mask,
  unmaskOnFocus = true,
  onChange,
}: UseMaskedValueOptions) {
  const [internalValue, setInternalValue] = useState<string>(defaultValue)
  const [isFocused, setIsFocused] = useState<boolean>(false)

  const isControlled = controlledValue !== undefined
  const rawValue = isControlled ? controlledValue : internalValue

  const activeMaskConfig = useMemo<MaskConfig | null>(() => {
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
  }, [mask, unmaskOnFocus])

  // Formatear valor para reposo
  const formattedValue = useMemo(() => {
    if (!activeMaskConfig || !rawValue) return rawValue
    return activeMaskConfig.format ? activeMaskConfig.format(rawValue) : rawValue
  }, [activeMaskConfig, rawValue])

  // Valor presentado en la interfaz
  const shouldUnmask = isFocused && (activeMaskConfig?.unmaskOnFocus ?? unmaskOnFocus)
  const displayValue = shouldUnmask ? rawValue : formattedValue

  const handleFocus = useCallback(() => {
    setIsFocused(true)
  }, [])

  const handleBlur = useCallback(() => {
    setIsFocused(false)
  }, [])

  const handleChange = useCallback((inputText: string) => {
    const cleanValue = activeMaskConfig?.parse ? activeMaskConfig.parse(inputText) : inputText
    const formatted = activeMaskConfig?.format ? activeMaskConfig.format(cleanValue) : cleanValue

    if (!isControlled) {
      setInternalValue(cleanValue)
    }

    if (onChange) {
      onChange(cleanValue, formatted)
    }
  }, [activeMaskConfig, isControlled, onChange])

  return {
    rawValue,
    displayValue,
    formattedValue,
    isFocused,
    hasValue: Boolean(rawValue && String(rawValue).length > 0),
    handleFocus,
    handleBlur,
    handleChange,
  }
}
