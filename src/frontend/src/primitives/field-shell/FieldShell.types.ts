import type { ReactNode, CSSProperties } from 'react'

export type LabelMode = 'external' | 'floating' | 'hidden'
export type FieldStatus = 'default' | 'error' | 'success' | 'warning'
export type FieldDensity = 'comfortable' | 'compact' | 'dense'

export interface FieldShellProps {
  id?: string
  label?: ReactNode
  floatingTitle?: ReactNode
  labelMode?: LabelMode
  required?: boolean
  disabled?: boolean
  readOnly?: boolean
  status?: FieldStatus
  error?: ReactNode
  helperText?: ReactNode
  description?: ReactNode
  tooltip?: string
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
