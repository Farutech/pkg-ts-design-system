import {
  useRef,
  useEffect,
  type ReactNode,
  type RefObject,
  type HTMLAttributes,
} from 'react'

export interface UseClickOutsideOptions {
  enabled?: boolean
  /** Elementos o refs adicionales que deben considerarse "dentro" y no disparar el evento */
  ignoreRefs?: Array<RefObject<HTMLElement | null>>
}

/**
 * useClickOutside (Hook Headless):
 * Detecta clics fuera de un elemento objetivo y ejecuta un callback.
 */
export function useClickOutside(
  ref: RefObject<HTMLElement | null>,
  onClickOutside: (event: MouseEvent | TouchEvent) => void,
  options: UseClickOutsideOptions = {}
) {
  const { enabled = true, ignoreRefs = [] } = options

  useEffect(() => {
    if (!enabled || typeof document === 'undefined') return

    const listener = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node | null
      if (!target) return

      // Comprobar si el clic está dentro del elemento objetivo
      if (ref.current && ref.current.contains(target)) {
        return
      }

      // Comprobar si el clic está dentro de alguno de los refs ignorados (ej: triggers)
      for (const ignoreRef of ignoreRefs) {
        if (ignoreRef.current && ignoreRef.current.contains(target)) {
          return
        }
      }

      onClickOutside(event)
    }

    document.addEventListener('mousedown', listener, true)
    document.addEventListener('touchstart', listener, true)

    return () => {
      document.removeEventListener('mousedown', listener, true)
      document.removeEventListener('touchstart', listener, true)
    }
  }, [ref, onClickOutside, enabled, ignoreRefs])
}

export interface ClickOutsideProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  onClickOutside: (event: MouseEvent | TouchEvent) => void
  enabled?: boolean
  ignoreRefs?: Array<RefObject<HTMLElement | null>>
}

/**
 * ClickOutside (Componente Primitivo):
 * Envuelve cualquier subárbol para detectar clics exteriores de forma declarativa.
 */
export function ClickOutside({
  children,
  onClickOutside,
  enabled = true,
  ignoreRefs,
  className,
  ...props
}: ClickOutsideProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useClickOutside(containerRef, onClickOutside, { enabled, ignoreRefs })

  return (
    <div ref={containerRef} className={className} {...props}>
      {children}
    </div>
  )
}
