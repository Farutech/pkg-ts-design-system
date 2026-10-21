import { useState, useCallback, useMemo } from 'react'
import {
  resolveMaskConfig,
  type MaskConfig,
  type MaskType,
} from '@/utils/maskEngine'

export type { MaskConfig, MaskType } from '@/utils/maskEngine'
export { DEFAULT_FORMATTERS, resolveMaskConfig } from '@/utils/maskEngine'

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

  const activeMaskConfig = useMemo<MaskConfig | null>(
    () => resolveMaskConfig(mask ?? null, unmaskOnFocus),
    [mask, unmaskOnFocus],
  )

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
