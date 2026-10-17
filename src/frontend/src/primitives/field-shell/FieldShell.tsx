import React, { useId, useState } from 'react'
import { cn } from '@/utils/cn'
import { Icon } from '@/primitives/icon/Icon'
import { IconSlot } from '@/primitives/icon/IconSlot'
import type { FieldShellProps } from './FieldShell.types'

/**
 * FieldShell - Primitiva estructural unificada para controles de entrada del Design System.
 * 
 * Gestiona de forma centralizada:
 * - Modo de etiqueta: 'external' (estándar superior) y 'floating' (flotante interna accesible).
 * - Ciclo de vida visual flotante:
 *   1. Vacío y sin foco: el label actúa como prompt interno.
 *   2. Vacío y con foco: el label sube a la esquina superior izquierda y el placeholder se hace visible.
 *   3. Con dato: el label permanece elevado y se muestra el dato.
 * - Estados semánticos (error con role="alert", success, warning, disabled).
 * - Objetivos táctiles mínimos y dimensiones fluidas gobernadas por tokens.
 */
export function FieldShell({
  id: explicitId,
  label,
  floatingTitle,
  labelMode = 'external',
  required = false,
  disabled = false,
  readOnly = false,
  status = 'default',
  error,
  helperText,
  description,
  tooltip,
  hasValue = false,
  isFocused = false,
  prefix,
  suffix,
  leftSection,
  rightSection,
  fullWidth = true,
  className,
  style,
  children,
}: FieldShellProps) {
  const generatedId = useId()
  const fieldId = explicitId || generatedId
  const errorId = `${fieldId}-error`
  const descId = `${fieldId}-desc`
  const [isHovered, setIsHovered] = useState(false)

  const isFloating = labelMode === 'floating'
  const isFloatingActive = isFocused || hasValue
  const activeStatus = error ? 'error' : status
  const effectiveHelper = error || helperText || description

  // RENDERIZADO: Modo Floating Label
  if (isFloating) {
    return (
      <div
        className={cn(
          'relative flex flex-col',
          fullWidth && 'w-full',
          disabled && 'opacity-60 pointer-events-none cursor-not-allowed',
          className
        )}
        style={style}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Tooltip opcional */}
        {tooltip && isHovered && (
          <div
            role="tooltip"
            className="absolute -top-8 left-2 z-50 px-2.5 py-1 rounded-md text-[11px] font-medium tracking-wide bg-gray-900 text-gray-100 border border-primary-500/30 shadow-xl backdrop-blur-md whitespace-nowrap animate-fadeIn pointer-events-none"
          >
            {tooltip}
            <div className="absolute top-full left-4 -mt-1 border-4 border-transparent border-t-gray-900" />
          </div>
        )}

        <label
          htmlFor={fieldId}
          className={cn(
            'relative flex items-center min-h-[44px] sm:min-h-[48px] rounded-xl border transition-all duration-200 cursor-text overflow-hidden',
            'bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100',
            isFocused && 'border-primary-500 ring-2 ring-primary-500/25 shadow-sm',
            activeStatus === 'error' && 'border-red-500 ring-2 ring-red-500/20 text-red-900 dark:text-red-100',
            activeStatus === 'success' && 'border-emerald-500 ring-2 ring-emerald-500/20',
            disabled && 'bg-gray-50 dark:bg-gray-800/50'
          )}
        >
          {/* Adorno o sección izquierda */}
          {(leftSection || prefix) && (
            <div className="pl-3.5 pr-1 flex items-center text-gray-400 dark:text-gray-500 shrink-0">
              <IconSlot icon={leftSection || prefix} />
            </div>
          )}

          {/* Contenedor central del label flotante y el input */}
          <div className="relative flex-1 h-full flex flex-col justify-center px-3.5 pt-3 pb-1 min-w-0">
            {label && (
              <span
                className={cn(
                  'absolute left-3.5 pointer-events-none transition-all duration-200 ease-out select-none transform origin-top-left',
                  isFloatingActive
                    ? 'top-1.5 text-[11px] font-medium text-primary-600 dark:text-primary-400 tracking-wider uppercase scale-90'
                    : 'top-3.5 text-xs text-gray-500 dark:text-gray-400 font-normal scale-100'
                )}
              >
                {isFloatingActive && floatingTitle ? floatingTitle : label}
                {required && <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>}
              </span>
            )}

            <div className={cn('w-full', isFloatingActive ? 'mt-2 opacity-100' : 'opacity-0')}>
              {children}
            </div>
          </div>

          {/* Adorno o sección derecha */}
          {(rightSection || suffix) && (
            <div className="pr-3.5 pl-1 flex items-center text-gray-400 dark:text-gray-500 shrink-0">
              <IconSlot icon={rightSection || suffix} />
            </div>
          )}
        </label>

        {/* Mensaje de error o ayuda */}
        {error ? (
          <p id={errorId} role="alert" className="text-xs text-red-600 dark:text-red-400 mt-1 ml-1 flex items-center gap-1 font-medium">
            <Icon.Error size="xs" className="shrink-0" />
            <span>{error}</span>
          </p>
        ) : effectiveHelper ? (
          <p id={descId} className="text-xs text-gray-500 dark:text-gray-400 mt-1 ml-1">
            {effectiveHelper}
          </p>
        ) : null}
      </div>
    )
  }

  // RENDERIZADO: Modo External Label (Estándar)
  return (
    <div
      className={cn(
        'relative flex flex-col gap-1.5',
        fullWidth && 'w-full',
        disabled && 'opacity-60 pointer-events-none cursor-not-allowed',
        className
      )}
      style={style}
    >
      {label && labelMode !== 'hidden' && (
        <label
          htmlFor={fieldId}
          className="text-xs font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1 select-none"
        >
          {label}
          {required && <span className="text-red-500 font-bold" aria-hidden="true">*</span>}
        </label>
      )}

      <div
        className={cn(
          'relative flex items-center min-h-[40px] sm:min-h-[44px] rounded-xl border transition-all duration-150 overflow-hidden',
          'bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100',
          isFocused && 'border-primary-500 ring-2 ring-primary-500/25 shadow-sm',
          activeStatus === 'error' && 'border-red-500 ring-2 ring-red-500/20 text-red-900 dark:text-red-100',
          activeStatus === 'success' && 'border-emerald-500 ring-2 ring-emerald-500/20',
          disabled && 'bg-gray-50 dark:bg-gray-800/50'
        )}
      >
        {(leftSection || prefix) && (
          <div className="pl-3 pr-1.5 flex items-center text-gray-400 dark:text-gray-500 shrink-0">
            <IconSlot icon={leftSection || prefix} />
          </div>
        )}

        <div className="flex-1 min-w-0 px-3">
          {children}
        </div>

        {(rightSection || suffix) && (
          <div className="pr-3 pl-1.5 flex items-center text-gray-400 dark:text-gray-500 shrink-0">
            <IconSlot icon={rightSection || suffix} />
          </div>
        )}
      </div>

      {error ? (
        <p id={errorId} role="alert" className="text-xs text-red-600 dark:text-red-400 mt-0.5 ml-0.5 flex items-center gap-1 font-medium">
          <Icon.Error size="xs" className="shrink-0" />
          <span>{error}</span>
        </p>
      ) : effectiveHelper ? (
        <p id={descId} className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 ml-0.5">
          {effectiveHelper}
        </p>
      ) : null}
    </div>
  )
}
