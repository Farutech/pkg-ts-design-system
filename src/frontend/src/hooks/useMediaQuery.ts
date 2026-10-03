import { useState, useEffect } from 'react'

/**
 * useMediaQuery - Hook seguro para SSR que evalúa media queries CSS.
 * 
 * @example
 * const isMobile = useMediaQuery('(max-width: 768px)')
 * const isDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
 */
export function useMediaQuery(query: string, defaultValue = false): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return defaultValue
    return window.matchMedia(query).matches
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    const mediaQueryList = window.matchMedia(query)
    setMatches(mediaQueryList.matches)

    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    if (mediaQueryList.addEventListener) {
      mediaQueryList.addEventListener('change', listener)
    } else {
      // Compatibilidad con navegadores antiguos
      ;(mediaQueryList as any).addListener(listener)
    }

    return () => {
      if (mediaQueryList.removeEventListener) {
        mediaQueryList.removeEventListener('change', listener)
      } else {
        ;(mediaQueryList as any).removeListener(listener)
      }
    }
  }, [query])

  return matches
}
