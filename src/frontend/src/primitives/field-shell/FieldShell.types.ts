import type { ReactNode, CSSProperties } from 'react'
import type { InputStatus, LabelMode } from '@/tokens/input-types'

// Re-exporta los tipos canónicos (fuente única en @/tokens/input-types) para
// no duplicar unions más estrechas que rompían el pase desde Input/Select.
export type { LabelMode, InputStatus }

/** Estados visuales que FieldShell sabe *estilizar* (subconjunto de InputStatus). */
export type FieldStatus = Extract<InputStatus, 'default' | 'error' | 'success' | 'warning'>
export type FieldDensity = 'comfortable' | 'compact' | 'dense'

export interface FieldShellProps {
  id?: string
  label?: ReactNode
  floatingTitle?: ReactNode
  labelMode?: LabelMode
  required?: boolean
  disabled?: boolean
  readOnly?: boolean
  status?: InputStatus
  error?: ReactNode
  helperText?: ReactNode
  description?: ReactNode
  tooltip?: ReactNode
  hasValue?: boolean
  isFocused?: boolean
  placeholder?: string
  prefix?: ReactNode
  suffix?: ReactNode
  leftSection?: ReactNode
  rightSection?: ReactNode
  density?: FieldDensity
  fullWidth?: boolean
  className?: string
  style?: CSSProperties
  children: ReactNode
}
