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
import { createContext, useContext, useId, useState, type ReactNode } from 'react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { cn } from '@/utils/cn'

interface AccordionContextValue {
  allowMultiple: boolean
  openItems: string[]
  toggleItem: (id: string) => void
}

const AccordionContext = createContext<AccordionContextValue | null>(null)

export interface AccordionItemProps {
  /** Identificador único del item (opcional, se autogenera si no se provee) */
  id?: string
  title: ReactNode
  children: ReactNode
  /** Abre por defecto (solo para el primer render, modo no controlado). */
  defaultOpen?: boolean
  disabled?: boolean
  className?: string
}

export function AccordionItem({
  id: propId,
  title,
  children,
  defaultOpen = false,
  disabled = false,
  className,
}: AccordionItemProps) {
  const generatedId = useId()
  const itemId = propId || generatedId
  const headerId = `${itemId}-header`
  const panelId = `${itemId}-panel`

  const context = useContext(AccordionContext)
  const [localOpen, setLocalOpen] = useState(defaultOpen)

  const isOpen = context ? context.openItems.includes(itemId) : localOpen

  const handleToggle = () => {
    if (disabled) return
    if (context) {
      context.toggleItem(itemId)
    } else {
      setLocalOpen((prev) => !prev)
    }
  }

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
          aria-expanded={isOpen}
          disabled={disabled}
          onClick={handleToggle}
          className={cn(
            'flex w-full items-center justify-between gap-4 px-4 py-3 text-left text-sm font-medium',
            'text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
            'disabled:cursor-not-allowed',
          )}
        >
          <span>{title}</span>
          <ChevronDownIcon
            className={cn('h-5 w-5 shrink-0 text-gray-400 transition-transform duration-200', isOpen && 'rotate-180')}
            aria-hidden="true"
          />
        </button>
      </h3>
      <div
        id={panelId}
        role="region"
        aria-labelledby={headerId}
        hidden={!isOpen}
        className="px-4 pb-4 text-sm text-gray-600 dark:text-gray-300"
      >
        {children}
      </div>
    </div>
  )
}

export interface AccordionProps {
  children: ReactNode
  /** Permitir desplegar múltiples elementos simultáneamente (por defecto: false) */
  allowMultiple?: boolean
  /** IDs de los elementos abiertos por defecto */
  defaultOpenItems?: string[]
  /** Variante de separación entre items. */
  variant?: 'separated' | 'flush'
  className?: string
}

export function Accordion({
  children,
  allowMultiple = false,
  defaultOpenItems = [],
  variant = 'separated',
  className,
}: AccordionProps) {
  const [openItems, setOpenItems] = useState<string[]>(defaultOpenItems)

  const toggleItem = (id: string) => {
    setOpenItems((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id)
      }
      if (allowMultiple) {
        return [...prev, id]
      }
      return [id]
    })
  }

  return (
    <AccordionContext.Provider value={{ allowMultiple, openItems, toggleItem }}>
      <div
        className={cn(
          'w-full',
          variant === 'separated' ? 'space-y-3' : 'divide-y divide-gray-200 dark:divide-gray-700',
          className,
        )}
      >
        {children}
      </div>
    </AccordionContext.Provider>
  )
}
