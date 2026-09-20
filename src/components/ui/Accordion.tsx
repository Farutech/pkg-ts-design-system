/**
 * Accordion — acordeón accesible (patrón WAI-ARIA).
 * Comparable al Accordion de Bootstrap / Collapse de Material.
 *
 * @example
 * ```tsx
 * <Accordion>
 *   <AccordionItem title="¿Cómo instalo el paquete?">
 *     npm install @farutech/design-system
 *   </AccordionItem>
 *   <AccordionItem title="¿Cómo tematizo?">
 *     Usa DesignSystemProvider theme={{ colorPrimary: '#7c3aed' }}
 *   </AccordionItem>
 * </Accordion>
 * ```
 */
import { useId, useState, type ReactNode } from 'react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { cn } from '@/utils/cn'

export interface AccordionItemProps {
  title: ReactNode
  children: ReactNode
  /** Abre por defecto (solo para el primer render, modo no controlado). */
  defaultOpen?: boolean
  disabled?: boolean
  className?: string
}

export function AccordionItem({
  title,
  children,
  defaultOpen = false,
  disabled = false,
  className,
}: AccordionItemProps) {
  const headerId = useId()
  const panelId = useId()
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div
      className={cn(
        'border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-900',
        disabled && 'opacity-60',
        className,
      )}
    >
      <h3 className="m-0">
        <button
          type="button"
          id={headerId}
          aria-controls={panelId}
          aria-expanded={open}
          disabled={disabled}
          onClick={() => setOpen((prev) => !prev)}
          className={cn(
            'flex w-full items-center justify-between gap-4 px-4 py-3 text-left text-sm font-medium',
            'text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
            'disabled:cursor-not-allowed',
          )}
        >
          <span>{title}</span>
          <ChevronDownIcon
            className={cn('h-5 w-5 shrink-0 text-gray-400 transition-transform duration-200', open && 'rotate-180')}
            aria-hidden="true"
          />
        </button>
      </h3>
      <div
        id={panelId}
        role="region"
        aria-labelledby={headerId}
        hidden={!open}
        className="px-4 pb-4 text-sm text-gray-600 dark:text-gray-300"
      >
        {children}
      </div>
    </div>
  )
}

export interface AccordionProps {
  children: ReactNode
  /** Variante de separación entre items. */
  variant?: 'separated' | 'flush'
  className?: string
}

export function Accordion({ children, variant = 'separated', className }: AccordionProps) {
  return (
    <div
      className={cn(
        'w-full',
        variant === 'separated' ? 'space-y-3' : 'divide-y divide-gray-200 dark:divide-gray-700',
        className,
      )}
    >
      {children}
    </div>
  )
}
