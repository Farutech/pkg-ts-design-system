import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/utils/cn'
import { useDensity } from '@/providers/DesignSystemProvider'
import type { Density } from '@/tokens/tokens'

export interface InputGroupProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  density?: Density
  fullWidth?: boolean
  /** Si debe tener apariencia compacta con bordes fusionados (default: true) */
  attached?: boolean
}

/**
 * InputGroup (Contenedor de Fusión de Inputs y Botones):
 * Permite unir de manera fluida botones, selectores, inputs y addons contiguos,
 * eliminando bordes dobles intermedios y coordinando el anillo de foco (`focus-within`).
 *
 * Ejemplo:
 * ```tsx
 * <InputGroup>
 *   <Input placeholder="Buscar por código..." />
 *   <Button variant="primary">Buscar</Button>
 * </InputGroup>
 * ```
 */
export const InputGroup = forwardRef<HTMLDivElement, InputGroupProps>(
  (
    {
      children,
      density: propDensity,
      fullWidth = true,
      attached = true,
      className,
      ...props
    },
    ref
  ) => {
    const contextDensity = useDensity()
    const activeDensity = propDensity ?? contextDensity

    return (
      <div
        ref={ref}
        data-density={activeDensity}
        className={cn(
          'relative flex items-stretch',
          fullWidth && 'w-full',
          attached && [
            // Fusión de bordes redondeados entre hijos contiguos
            '[&>*:not(:first-child):not(:last-child)]:rounded-none',
            '[&>*:not(:first-child):not(:last-child)]:border-l-0',
            '[&>*:first-child]:rounded-r-none',
            '[&>*:last-child]:rounded-l-none',
            '[&>*:last-child]:border-l-0',
            // Gestión de capas de foco para que el elemento enfocado sobresalga al frente
            '[&>*:focus-within]:z-20',
            '[&>*:focus]:z-20',
          ],
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

InputGroup.displayName = 'InputGroup'
