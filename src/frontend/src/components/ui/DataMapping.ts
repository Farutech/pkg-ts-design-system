import type { ReactNode } from 'react'

/**
 * Contrato Universal de Mapeo de Datos:
 * Permite a cualquier componente de selección consumir cualquier tipo de objeto T
 * sin forzar al desarrollador a mapear a { value, label }.
 */
export interface DataMappingProps<T> {
  /** Clave o función para extraer el valor identificador único (ej: 'id', 'uuid', 'code') */
  valueKey?: keyof T | ((item: T) => string | number)
  /** Clave o función para extraer la etiqueta visible principal (ej: 'name', 'title') */
  textKey?: keyof T | ((item: T) => string)
  /** Plantilla interpolada con sintaxis {campo} (ej: "{name} ({code})") */
  textTemplate?: string
  /** Renderizado personalizado de la opción dentro de la lista desplegable */
  renderOption?: (item: T, state: { selected: boolean; active: boolean }) => ReactNode
  /** Renderizado personalizado del valor seleccionado en el trigger */
  renderValue?: (item: T | T[]) => ReactNode
  /** Condición de deshabilitación por elemento */
  isOptionDisabled?: (item: T) => boolean
}

/**
 * Resuelve el valor único identificador de una opción.
 */
export function resolveOptionValue<T>(
  item: T,
  valueKey?: keyof T | ((item: T) => string | number)
): string {
  if (item === null || item === undefined) return ''
  if (typeof item === 'string' || typeof item === 'number') return String(item)

  if (typeof valueKey === 'function') {
    return String(valueKey(item))
  }
  if (valueKey && typeof item === 'object' && valueKey in item) {
    return String((item as Record<string, unknown>)[valueKey as string] ?? '')
  }
  if (typeof item === 'object') {
    const record = item as Record<string, unknown>
    if ('value' in record) return String(record.value ?? '')
    if ('id' in record) return String(record.id ?? '')
    if ('uuid' in record) return String(record.uuid ?? '')
    if ('code' in record) return String(record.code ?? '')
  }
  return String(item)
}

/**
 * Resuelve el texto visible de una opción mediante textKey o textTemplate.
 */
export function resolveOptionLabel<T>(
  item: T,
  textKey?: keyof T | ((item: T) => string),
  textTemplate?: string
): string {
  if (item === null || item === undefined) return ''
  if (typeof item === 'string' || typeof item === 'number') return String(item)

  if (textTemplate && typeof item === 'object') {
    return textTemplate.replace(/\{(\w+)\}/g, (_, key) => {
      const val = (item as Record<string, unknown>)[key]
      return val !== undefined && val !== null ? String(val) : ''
    })
  }

  if (typeof textKey === 'function') {
    return textKey(item)
  }
  if (textKey && typeof item === 'object' && textKey in item) {
    return String((item as Record<string, unknown>)[textKey as string] ?? '')
  }
  if (typeof item === 'object') {
    const record = item as Record<string, unknown>
    if ('label' in record) return String(record.label ?? '')
    if ('name' in record) return String(record.name ?? '')
    if ('title' in record) return String(record.title ?? '')
    if ('text' in record) return String(record.text ?? '')
  }
  return String(item)
}
