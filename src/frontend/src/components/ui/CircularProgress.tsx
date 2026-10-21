/**
 * CircularProgress - Componente nativo SVG de progreso circular y anillos métricos
 *
 * Características:
 * - ✅ Cero dependencias pesadas: renderizado puramente con SVG vectorial de alto rendimiento
 * - ✅ Modo determinado (porcentaje, métricas KPI, avance de carga)
 * - ✅ Modo indeterminado (anillo giratorio suave)
 * - ✅ Contenido central flexible: valor formateado, iconos, o elementos personalizados
 * - ✅ Tamaños predefinidos ('xs', 'sm', 'md', 'lg', 'xl') o diámetro numérico exacto en px
 * - ✅ Paleta de colores estándar ('primary', 'success', 'warning', 'error', 'info') o colores CSS
 * - ✅ Accesibilidad completa con roles ARIA (`role="progressbar"`)
 */

import React, { type ReactNode } from 'react'
import { cn } from '@/utils/cn'

export type CircularProgressSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number
export type CircularProgressColor = 'primary' | 'success' | 'warning' | 'error' | 'info' | string

export interface CircularProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Valor numérico actual del progreso */
  value?: number
  /** Valor mínimo (por defecto 0) */
  min?: number
  /** Valor máximo (por defecto 100) */
  max?: number
  /** Tamaño predefinido ('xs', 'sm', 'md', 'lg', 'xl') o diámetro numérico en píxeles */
  size?: CircularProgressSize
  /** Grosor del trazo en píxeles (si no se especifica, se calcula proporcionalmente) */
  strokeWidth?: number
  /** Color del progreso (token de color o clase de color) */
  color?: CircularProgressColor
  /** Color de fondo de la pista/track (opcional) */
  trackColor?: string
  /** Mostrar automáticamente el porcentaje o valor numérico en el centro */
  showValue?: boolean
  /** Función personalizada para formatear el valor dentro del círculo */
  formatValue?: (value: number, percentage: number) => ReactNode
  /** Contenido personalizado dentro del círculo (icono, texto, etc.) */
  children?: ReactNode
  /** Etiqueta descriptiva debajo del indicador */
  label?: ReactNode
  /** Estado indeterminado (animación continua) */
  indeterminate?: boolean
  /** Extremos del trazo redondeados (por defecto true) */
  rounded?: boolean
  /** Sentido horario de llenado (por defecto true) */
  clockwise?: boolean
}

const SIZE_MAP: Record<'xs' | 'sm' | 'md' | 'lg' | 'xl', { diameter: number; stroke: number; fontSize: string }> = {
  xs: { diameter: 32, stroke: 3, fontSize: 'text-[9px]' },
  sm: { diameter: 48, stroke: 4, fontSize: 'text-xs' },
  md: { diameter: 64, stroke: 6, fontSize: 'text-sm' },
  lg: { diameter: 96, stroke: 8, fontSize: 'text-lg' },
  xl: { diameter: 128, stroke: 10, fontSize: 'text-2xl' },
}

const COLOR_MAP: Record<string, { stroke: string; text: string }> = {
  primary: { stroke: 'stroke-primary-600 dark:stroke-primary-400', text: 'text-primary-700 dark:text-primary-300' },
  success: { stroke: 'stroke-emerald-500 dark:stroke-emerald-400', text: 'text-emerald-700 dark:text-emerald-300' },
  warning: { stroke: 'stroke-amber-500 dark:stroke-amber-400', text: 'text-amber-700 dark:text-amber-300' },
  error: { stroke: 'stroke-red-500 dark:stroke-red-400', text: 'text-red-700 dark:text-red-300' },
  info: { stroke: 'stroke-sky-500 dark:stroke-sky-400', text: 'text-sky-700 dark:text-sky-300' },
}

export function CircularProgress({
  value,
  min = 0,
  max = 100,
  size = 'md',
  strokeWidth,
  color = 'primary',
  trackColor,
  showValue = false,
  formatValue,
  children,
  label,
  indeterminate: propIndeterminate,
  rounded = true,
  clockwise = true,
  className,
  ...rest
}: CircularProgressProps) {
  const isIndeterminate = propIndeterminate || value === undefined

  // Resolver dimensiones
  let diameter: number
  let defaultStroke: number
  let fontSizeClass: string

  if (typeof size === 'number') {
    diameter = size
    defaultStroke = Math.max(2, Math.round(size / 10))
    fontSizeClass = size < 40 ? 'text-[10px]' : size < 80 ? 'text-sm' : 'text-xl'
  } else {
    const config = SIZE_MAP[size] || SIZE_MAP.md
    diameter = config.diameter
    defaultStroke = config.stroke
    fontSizeClass = config.fontSize
  }

  const stroke = strokeWidth ?? defaultStroke
  const center = diameter / 2
  const radius = Math.max(1, center - stroke / 2)
  const circumference = 2 * Math.PI * radius

  // Calcular porcentaje normalizado
  const safeValue = value ?? 0
  const normalizedValue = Math.min(Math.max(safeValue, min), max)
  const range = max - min
  const percentage = range > 0 ? Math.round(((normalizedValue - min) / range) * 100) : 0

  // Cálculo del dashoffset
  const offset = circumference - (circumference * percentage) / 100

  // Mapeo de estilos de color
  const colorPreset = COLOR_MAP[color]
  const strokeClass = colorPreset ? colorPreset.stroke : ''
  const textClass = colorPreset ? colorPreset.text : ''
  const customStroke = !colorPreset ? color : undefined

  return (
    <div
      className={cn('inline-flex flex-col items-center justify-center gap-1.5', className)}
      role="progressbar"
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={isIndeterminate ? undefined : normalizedValue}
      {...rest}
    >
      <div
        className="relative inline-flex items-center justify-center select-none"
        style={{ width: diameter, height: diameter }}
      >
        <svg
          width={diameter}
          height={diameter}
          viewBox={`0 0 ${diameter} ${diameter}`}
          className={cn(
            'transform',
            !isIndeterminate && clockwise && '-rotate-90',
            !isIndeterminate && !clockwise && '-rotate-90 scale-y-[-1]',
            isIndeterminate && 'animate-spin'
          )}
        >
          {/* Track (anillo de fondo) */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            strokeWidth={stroke}
            className={cn(
              trackColor || 'stroke-gray-200 dark:stroke-gray-700/60'
            )}
          />

          {/* Indicador de progreso activo */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            strokeWidth={stroke}
            strokeDasharray={circumference}
            strokeDashoffset={isIndeterminate ? circumference * 0.75 : offset}
            strokeLinecap={rounded ? 'round' : 'butt'}
            style={customStroke ? { stroke: customStroke } : undefined}
            className={cn(
              'transition-all duration-300 ease-out',
              strokeClass
            )}
          />
        </svg>

        {/* Contenido interior / métrica central */}
        {!isIndeterminate && (showValue || children) && (
          <div
            className={cn(
              'absolute inset-0 flex items-center justify-center font-semibold text-center pointer-events-none',
              fontSizeClass,
              textClass || 'text-gray-900 dark:text-gray-100'
            )}
          >
            {children
              ? children
              : formatValue
              ? formatValue(normalizedValue, percentage)
              : `${percentage}%`}
          </div>
        )}
      </div>

      {/* Etiqueta inferior si se suministra */}
      {label && (
        <span className="text-xs font-medium text-gray-600 dark:text-gray-400 text-center select-none">
          {label}
        </span>
      )}
    </div>
  )
}
