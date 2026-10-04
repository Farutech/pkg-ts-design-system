import React, { useId } from 'react'
import { cn } from '@/utils/cn'
import { Icon } from '@/primitives/Icon/Icon'

export interface FormFieldProps {
  label?: React.ReactNode
  description?: React.ReactNode
  hint?: React.ReactNode
  error?: React.ReactNode
  helperText?: React.ReactNode
  required?: boolean
  disabled?: boolean
  tooltip?: string
  labelPosition?: 'top' | 'left' | 'right' | 'bottom'
  htmlFor?: string
  className?: string
  labelClassName?: string
  errorClassName?: string
  helperClassName?: string
  style?: React.CSSProperties
  children: React.ReactNode | ((props: { id: string; describedBy?: string; invalid: boolean }) => React.ReactNode)
}

/**
 * FormField - Envoltura estructural accesible para controles de formulario.
 * Asocia automáticamente labels, mensajes de error y helpers mediante WAI-ARIA.
 * Soporta tanto hijos directos como render-prop: children={({ id, describedBy }) => <Input ... />}
 */
export function FormField({
  label,
  description,
  hint,
  error,
  helperText,
  required,
  disabled,
  tooltip,
  labelPosition = 'top',
  htmlFor,
  className,
  labelClassName,
  errorClassName,
  helperClassName,
  style,
  children,
}: FormFieldProps) {
  const generatedId = useId()
  const controlId = htmlFor ?? `field-${generatedId.replace(/:/g, '')}`
  const errorId = error ? `${controlId}-error` : undefined
  const descId = `${controlId}-desc`
  const describedBy = errorId ?? descId

  const displayDesc = description || helperText || hint

  const renderedChildren = typeof children === 'function'
    ? children({ id: controlId, describedBy, invalid: Boolean(error) })
    : children

  return (
    <div style={style} className={cn('w-full space-y-1.5', labelPosition === 'left' && 'flex items-center gap-4 space-y-0', disabled && 'opacity-60 pointer-events-none', className)}>
      {label && (
        <div className={cn('flex items-center justify-between', labelPosition === 'left' && 'min-w-[140px] shrink-0')}>
          <label htmlFor={controlId} className={cn("flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300", labelClassName)}>
            <span>{label}</span>
            {required && <span className="text-red-500 font-bold" aria-hidden="true">*</span>}
            {tooltip && (
              <span className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-help" title={tooltip}>
                <Icon.Info size="xs" />
              </span>
            )}
          </label>
        </div>
      )}

      <div className="relative flex-1">
        {renderedChildren}
      </div>

      {error ? (
        <p id={errorId} role="alert" className={cn("flex items-center gap-1 text-xs text-red-600 dark:text-red-400 mt-1", errorClassName)}>
          <Icon.Error size="xs" className="shrink-0" />
          <span>{error}</span>
        </p>
      ) : displayDesc ? (
        <p id={descId} className={cn("text-xs text-gray-500 dark:text-gray-400 mt-1", helperClassName)}>
          {displayDesc}
        </p>
      ) : null}
    </div>
  )
}

