/**
 * FormField — envoltorio accesible para cualquier control:
 * label + control + hint/error + required. Equivalente a MUI FormControl
 * o al form-group de Bootstrap.
 */
import { useId, type ReactNode } from 'react'
import { cn } from '@/utils/cn'

export interface FormFieldProps {
  /** Etiqueta del campo (se asocia automáticamente por id). */
  label?: string
  /** Node de control al que se asocia la etiqueta. */
  children: (props: { id: string; describedBy?: string; invalid: boolean }) => ReactNode
  /** Texto de ayuda (se expone con aria-describedby). */
  hint?: ReactNode
  /** Mensaje de error (role=alert + aria-invalid). */
  error?: string
  required?: boolean
  /** Etiqueta arriba (default) o alineada a la izquierda. */
  labelPosition?: 'top' | 'left' | 'right' | 'bottom'
  htmlFor?: string
  className?: string
}

export function FormField({
  label,
  children,
  hint,
  error,
  required = false,
  labelPosition = 'top',
  htmlFor,
  className,
}: FormFieldProps) {
  const autoId = useId()
  const controlId = htmlFor ?? `field-${autoId.replace(/:/g, '')}`
  const hintId = hint ? `${controlId}-hint` : undefined
  const errorId = error ? `${controlId}-error` : undefined
  const describedBy = errorId ?? hintId

  return (
    <div
      className={cn(
        'flex gap-2',
        labelPosition === 'top' ? 'flex-col' : 'flex-row items-center',
        className,
      )}
    >
      {label && (
        <label
          htmlFor={controlId}
          className={cn(
            'text-sm font-medium text-gray-700 dark:text-gray-300',
            labelPosition === 'left' && 'w-40 shrink-0',
          )}
        >
          {label}
          {required && (
            <span aria-hidden="true" className="ml-0.5 text-danger">
              *
            </span>
          )}
        </label>
      )}
      <div className={cn(labelPosition === 'left' && 'flex-1')}>
        {children({ id: controlId, describedBy, invalid: Boolean(error) })}
      </div>
      {error ? (
        <p id={errorId} role="alert" className="m-0 text-xs text-danger">
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="m-0 text-xs text-gray-500 dark:text-gray-400">
          {hint}
        </p>
      ) : null}
    </div>
  )
}
