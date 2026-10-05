/**
 * Componente Form - Sistema de formularios empresarial con grid responsivo y contexto unificado
 */

import React, { createContext, useContext } from 'react'
import { cn } from '@/utils/cn'
import type { LabelMode } from './input/types'
import type { Density } from '@/tokens/tokens'

export interface FormContextValue {
  /** Modo de etiqueta por defecto para todos los controles descendientes ('external' | 'floating' | 'placeholder' | 'hidden') */
  defaultLabelMode?: LabelMode
  /** Densidad por defecto para el formulario ('comfortable' | 'compact' | 'dense') */
  density?: Density
}

export const FormContext = createContext<FormContextValue>({})

/**
 * Hook para consumir la configuración heredada del formulario padre
 */
export const useFormContext = () => useContext(FormContext)

export interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode
  className?: string
  /** Configura el modo de etiqueta para todos los campos hijos (ej. 'floating' para etiquetas elevadas automáticas) */
  defaultLabelMode?: LabelMode
  /** Configura la densidad global para los campos del formulario */
  density?: Density
}

/**
 * Form - Contenedor principal del formulario con propagación de contexto
 * @example
 * <Form defaultLabelMode="floating" onSubmit={handleSubmit}>
 *   <FormRow>
 *     <FormGroup cols={{ default: 12, md: 6 }}>
 *       <Input label="Nombre completo" floatingTitle="NOMBRE" />
 *     </FormGroup>
 *     <FormGroup cols={{ default: 12, md: 6 }}>
 *       <Select label="Departamento" floatingTitle="DEPARTAMENTO" options={...} />
 *     </FormGroup>
 *   </FormRow>
 * </Form>
 */
export function Form({
  children,
  className,
  defaultLabelMode,
  density,
  ...props
}: FormProps) {
  return (
    <FormContext.Provider value={{ defaultLabelMode, density }}>
      <form className={cn('space-y-6', className)} {...props}>
        {children}
      </form>
    </FormContext.Provider>
  )
}

export interface FormRowProps {
  children: React.ReactNode
  className?: string
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
}

/**
 * FormRow - Fila que contiene FormGroups en un grid responsivo de 12 columnas
 */
export function FormRow({ children, className, gap = 'md' }: FormRowProps) {
  const gapClasses = {
    none: 'gap-0',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
  }

  return (
    <div className={cn('grid grid-cols-12', gapClasses[gap], className)}>
      {children}
    </div>
  )
}

export type ColumnSize = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12

export interface FormGroupProps {
  children: React.ReactNode
  className?: string
  /** Configuración de columnas por breakpoint */
  cols?: {
    default?: ColumnSize
    sm?: ColumnSize
    md?: ColumnSize
    lg?: ColumnSize
    xl?: ColumnSize
    '2xl'?: ColumnSize
  }
  /** Atajo: usar un solo valor para todas las pantallas */
  col?: ColumnSize
}

/**
 * FormGroup - Grupo de formulario con sistema de columnas responsivo (1 a 12 cols)
 */
export function FormGroup({ children, className, cols, col }: FormGroupProps) {
  const columnConfig = col ? { default: col } : cols

  const colClasses = columnConfig
    ? Object.entries(columnConfig).map(([breakpoint, size]) => {
        if (breakpoint === 'default') {
          return `col-span-${size}`
        }
        return `${breakpoint}:col-span-${size}`
      })
    : ['col-span-12']

  return (
    <div className={cn(...colClasses, className)}>
      {children}
    </div>
  )
}

export interface FormSectionProps {
  children: React.ReactNode
  title?: string
  description?: string
  className?: string
}

/**
 * FormSection - Sección de formulario con encabezado, título y descripción
 */
export function FormSection({ 
  children, 
  title, 
  description, 
  className 
}: FormSectionProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {(title || description) && (
        <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
          {title && (
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
          )}
          {description && (
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {description}
            </p>
          )}
        </div>
      )}
      {children}
    </div>
  )
}

export interface FormActionsProps {
  children: React.ReactNode
  className?: string
  align?: 'left' | 'center' | 'right' | 'between'
}

/**
 * FormActions - Barra de botones de acción del formulario
 */
export function FormActions({ children, className, align = 'right' }: FormActionsProps) {
  const alignClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
    between: 'justify-between',
  }

  return (
    <div className={cn('flex items-center gap-3', alignClasses[align], className)}>
      {children}
    </div>
  )
}
