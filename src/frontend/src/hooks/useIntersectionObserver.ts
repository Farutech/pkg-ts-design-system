import { useState, useEffect, useRef, type RefObject } from 'react'

export interface UseIntersectionObserverOptions extends IntersectionObserverInit {
  freezeOnceVisible?: boolean
}

/**
 * useIntersectionObserver - Detecta la visibilidad de un elemento en el viewport.
 */
export function useIntersectionObserver(
  elementRef: RefObject<Element | null>,
  {
    threshold = 0,
    root = null,
    rootMargin = '0%',
    freezeOnceVisible = false,
  }: UseIntersectionObserverOptions = {}
): IntersectionObserverEntry | undefined {
  const [entry, setEntry] = useState<IntersectionObserverEntry>()

  const frozen = entry?.isIntersecting && freezeOnceVisible

  const updateEntry = ([newEntry]: IntersectionObserverEntry[]): void => {
    setEntry(newEntry)
  }

  useEffect(() => {
    const node = elementRef?.current
    const hasIOSupport = typeof window !== 'undefined' && !!window.IntersectionObserver

    if (!hasIOSupport || frozen || !node) return

    const observerParams = { threshold, root, rootMargin }
    const observer = new IntersectionObserver(updateEntry, observerParams)

    observer.observe(node)

    return () => observer.disconnect()
  }, [elementRef, threshold, root, rootMargin, frozen])

  return entry
}

export interface UseInfiniteScrollOptions {
  onLoadMore: () => Promise<void> | void
  hasMore: boolean
  isLoading: boolean
  rootMargin?: string
}

/**
 * useInfiniteScroll - Dispara la carga incremental al alcanzar el final de una lista.
 */
export function useInfiniteScroll({
  onLoadMore,
  hasMore,
  isLoading,
  rootMargin = '200px',
}: UseInfiniteScrollOptions) {
  const sentinelRef = useRef<HTMLDivElement>(null)
  const entry = useIntersectionObserver(sentinelRef, { rootMargin })

  useEffect(() => {
    if (entry?.isIntersecting && hasMore && !isLoading) {
      onLoadMore()
    }
  }, [entry?.isIntersecting, hasMore, isLoading, onLoadMore])

  return { sentinelRef }
}
