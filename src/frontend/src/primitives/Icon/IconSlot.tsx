import React, { isValidElement, cloneElement, type ReactNode } from 'react'
import { cn } from '@/utils/cn'
import type { IconName } from './IconAdapter'
import { DynamicIcon } from './Icon'

export interface IconSlotProps {
  /** Icono directo (lucide-react, svg nativo, Icon.* o cualquier ReactNode) */
  icon?: ReactNode
  /** Nombre semántico del catálogo IconAdapter */
  name?: IconName
  /** Clases CSS adicionales */
  className?: string
  /** Tamaño semántico si se usa name o si el icono acepta size */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  /** Si es puramente decorativo (por defecto true, oculto para lectores de pantalla) */
  'aria-hidden'?: boolean | 'true' | 'false'
}

/**
 * IconSlot - Primitiva agnóstica para normalizar y proteger iconos en botones y acciones.
 * 
 * Garantiza:
 * 1. flex-shrink: 0 (nunca se aplasta ni fuerza quiebre de línea).
 * 2. Soporte universal para lucide-react (<Plus className="w-4 h-4" />), SVGs directos y catálogo IconAdapter.
 * 3. Accesibilidad por defecto (aria-hidden="true").
 */
export function IconSlot({
  icon,
  name,
  className,
  size,
  'aria-hidden': ariaHidden = true,
}: IconSlotProps) {
  if (name) {
    return (
      <span className={cn('inline-flex items-center justify-center shrink-0 [&>svg]:shrink-0', className)}>
        <DynamicIcon name={name} size={size} />
      </span>
    )
  }

  if (!icon) return null

  if (isValidElement(icon)) {
    const existingClassName = (icon.props as { className?: string })?.className || ''
    return cloneElement(icon as React.ReactElement<any>, {
      className: cn('shrink-0 select-none inline-block', existingClassName, className),
      'aria-hidden': ariaHidden ? 'true' : undefined,
    })
  }

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center shrink-0 select-none [&>svg]:shrink-0',
        className
      )}
      aria-hidden={ariaHidden ? 'true' : undefined}
    >
      {icon}
    </span>
  )
}
