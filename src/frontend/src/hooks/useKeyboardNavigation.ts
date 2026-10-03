import { useCallback, type KeyboardEvent } from 'react'

export interface UseKeyboardNavigationOptions {
  itemCount: number
  activeIndex: number
  onNavigate: (index: number) => void
  onSelect?: (index: number) => void
  onClose?: () => void
  loop?: boolean
  orientation?: 'vertical' | 'horizontal'
}

/**
 * Hook para navegación accesible por teclado según W3C WAI-ARIA APG
 * (flechas, Home, End, Enter, Espacio, Escape).
 */
export function useKeyboardNavigation({
  itemCount,
  activeIndex,
  onNavigate,
  onSelect,
  onClose,
  loop = true,
  orientation = 'vertical',
}: UseKeyboardNavigationOptions) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent | React.KeyboardEvent) => {
      const prevKey = orientation === 'vertical' ? 'ArrowUp' : 'ArrowLeft'
      const nextKey = orientation === 'vertical' ? 'ArrowDown' : 'ArrowRight'

      if (e.key === nextKey) {
        e.preventDefault()
        if (itemCount === 0) return
        const nextIndex = activeIndex + 1
        if (nextIndex >= itemCount) {
          onNavigate(loop ? 0 : itemCount - 1)
        } else {
          onNavigate(nextIndex)
        }
      } else if (e.key === prevKey) {
        e.preventDefault()
        if (itemCount === 0) return
        const prevIndex = activeIndex - 1
        if (prevIndex < 0) {
          onNavigate(loop ? itemCount - 1 : 0)
        } else {
          onNavigate(prevIndex)
        }
      } else if (e.key === 'Home') {
        e.preventDefault()
        onNavigate(0)
      } else if (e.key === 'End') {
        e.preventDefault()
        onNavigate(Math.max(0, itemCount - 1))
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        if (activeIndex >= 0 && activeIndex < itemCount) {
          onSelect?.(activeIndex)
        }
      } else if (e.key === 'Escape') {
        e.preventDefault()
        onClose?.()
      }
    },
    [itemCount, activeIndex, onNavigate, onSelect, onClose, loop, orientation]
  )

  return { handleKeyDown }
}
