import { forwardRef } from 'react'
import { Input, type InputProps } from './Input'

export interface PasswordInputProps extends Omit<InputProps, 'type'> {
  /** Si debe mostrar el toggle de visibilidad (default: true) */
  showToggle?: boolean
}

/**
 * PasswordInput:
 * Campo de contraseña optimizado con botón integrado de mostrar/ocultar y accesibilidad nativa.
 */
export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ showToggle = true, ...props }, ref) => {
    return (
      <Input
        ref={ref}
        type="password"
        showPasswordToggle={showToggle}
        autoComplete="current-password"
        {...props}
      />
    )
  }
)

PasswordInput.displayName = 'PasswordInput'
