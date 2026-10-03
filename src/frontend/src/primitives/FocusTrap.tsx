import {
  useRef,
  useEffect,
  useCallback,
  type ReactNode,
  type HTMLAttributes,
  type RefObject,
} from 'react'

export interface FocusTrapProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  /** Si la trampa de foco está activa (default: true) */
  active?: boolean
  /** Si la trampa está temporalmente pausada (por ejemplo, si se abre otro diálogo encima) */
  paused?: boolean
  /** Si debe restaurar el foco al elemento anterior al desmontarse (default: true) */
  restoreFocus?: boolean
  /** Referencia opcional al elemento que debe recibir el foco inicial */
  initialFocusRef?: RefObject<HTMLElement | null>
  /** Callback opcional al presionar Escape */
  onEscape?: () => void
}

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'area[href]',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'button:not([disabled])',
  'iframe',
  'object',
  'embed',
  '[contenteditable]',
  '[tabindex]:not([tabindex="-1"]):not([disabled])',
].join(',')

/**
 * FocusTrap (Primitiva Headless de Accesibilidad):
 * Mantiene el ciclo de navegación por teclado dentro de un contenedor (Modales, Drawers).
 * Garantiza cumplimiento estricto con WCAG 2.2 y ARIA APG.
 */
export function FocusTrap({
  children,
  active = true,
  paused = false,
  restoreFocus = true,
  initialFocusRef,
  onEscape,
  className,
  ...props
}: FocusTrapProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const previousActiveElementRef = useRef<HTMLElement | null>(null)

  const getFocusableElements = useCallback((): HTMLElement[] => {
    if (!rootRef.current) return []
    const elements = Array.from(
      rootRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
    )
    return elements.filter((el) => {
      if (el.hasAttribute('aria-hidden') && el.getAttribute('aria-hidden') !== 'false') {
        return false
      }
      if (typeof window !== 'undefined') {
        const style = window.getComputedStyle(el)
        if (style.display === 'none' || style.visibility === 'hidden') {
          return false
        }
      }
      return true
    })
  }, [])

  useEffect(() => {
    if (!active || paused) return

    // Guardar elemento enfocado antes de activar la trampa
    if (typeof document !== 'undefined') {
      previousActiveElementRef.current = document.activeElement as HTMLElement | null
    }

    // Foco inicial
    const timer = setTimeout(() => {
      if (initialFocusRef?.current) {
        initialFocusRef.current.focus()
      } else {
        const focusable = getFocusableElements()
        if (focusable.length > 0) {
          focusable[0].focus()
        } else if (rootRef.current) {
          // Si no hay elementos interactivos, enfocar el contenedor mismo
          rootRef.current.setAttribute('tabindex', '-1')
          rootRef.current.focus()
        }
      }
    }, 10)

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onEscape) {
        e.stopPropagation()
        onEscape()
        return
      }

      if (e.key !== 'Tab') return

      const focusable = getFocusableElements()
      if (focusable.length === 0) {
        e.preventDefault()
        return
      }

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (e.shiftKey) {
        // Shift + Tab: si estamos en el primero, ir al último
        if (document.activeElement === first || document.activeElement === rootRef.current) {
          e.preventDefault()
          last.focus()
        }
      } else {
        // Tab: si estamos en el último, ir al primero
        if (document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      clearTimeout(timer)
      document.removeEventListener('keydown', handleKeyDown)

      // Restaurar foco al elemento previo al desmontar
      if (restoreFocus && previousActiveElementRef.current) {
        previousActiveElementRef.current.focus?.()
      }
    }
  }, [active, paused, restoreFocus, initialFocusRef, onEscape, getFocusableElements])

  return (
    <div ref={rootRef} className={className} {...props}>
      {children}
    </div>
  )
}
