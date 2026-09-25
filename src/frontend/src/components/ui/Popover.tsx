/**
 * Popover — panel flotante anclado a un trigger, con cierre por Escape y
 * clic externo. Complementa a Tooltip (contenido rico y accionable).
 */
import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { cn } from '@/utils/cn'

export interface PopoverProps {
  /** Contenido del trigger (botón u otro elemento clickeable). */
  trigger: (props: { open: boolean; toggle: () => void; ariaAttributes: Record<string, unknown> }) => ReactNode
  children: ReactNode
  /** Posición del panel respecto al trigger. */
  placement?: 'top' | 'bottom' | 'left' | 'right'
  /** Cierra al hacer clic fuera del panel. */
  dismissOnClickOutside?: boolean
  /** Cierra al pulsar Escape. */
  dismissOnEscape?: boolean
  className?: string
  panelClassName?: string
}

const PLACEMENTS = {
  top: 'bottom-full mb-2 left-1/2 -translate-x-1/2',
  bottom: 'top-full mt-2 left-1/2 -translate-x-1/2',
  left: 'right-full mr-2 top-1/2 -translate-y-1/2',
  right: 'left-full ml-2 top-1/2 -translate-y-1/2',
}

export function Popover({
  trigger,
  children,
  placement = 'bottom',
  dismissOnClickOutside = true,
  dismissOnEscape = true,
  className,
  panelClassName,
}: PopoverProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const panelId = useId()

  useEffect(() => {
    if (!open) return undefined

    const handleKeyDown = (event: KeyboardEvent) => {
      if (dismissOnEscape && event.key === 'Escape') setOpen(false)
    }
    const handleClickOutside = (event: MouseEvent) => {
      if (dismissOnClickOutside && rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [dismissOnEscape, dismissOnClickOutside, open])

  const toggle = () => setOpen((prev) => !prev)

  return (
    <div ref={rootRef} className={cn('relative inline-block', className)}>
      {trigger({
        open,
        toggle,
        ariaAttributes: {
          'aria-expanded': open,
          'aria-haspopup': 'dialog',
          'aria-controls': open ? panelId : undefined,
        },
      })}
      {open && (
        <div
          id={panelId}
          role="dialog"
          className={cn(
            'absolute z-popover w-64 rounded-xl border border-gray-200 dark:border-gray-700',
            'bg-white dark:bg-gray-800 p-4 shadow-xl text-sm text-gray-700 dark:text-gray-200',
            PLACEMENTS[placement],
            panelClassName,
          )}
        >
          {children}
        </div>
      )}
    </div>
  )
}
