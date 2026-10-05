import { forwardRef } from 'react'
import { Input } from './Input'
import type { FloatingInputProps } from './input/types'

export type { FloatingInputProps }

/**
 * FloatingInput
 * 
 * @deprecated FloatingInput ha sido unificado en el componente `Input`.
 * Utilice `<Input variant="floating" label="..." />` en su lugar.
 * Este wrapper garantiza retrocompatibilidad al 100% sin breaking changes.
 */
export const FloatingInput = forwardRef<HTMLInputElement, FloatingInputProps>(
  (props, ref) => {
    return <Input ref={ref} variant="floating" {...props} />
  }
)

FloatingInput.displayName = 'FloatingInput'
