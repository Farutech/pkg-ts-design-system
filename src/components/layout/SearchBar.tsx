import { useCallback, useEffect, useState, useRef } from 'react'
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useSearchStore } from '@/store/searchStore'
import { cn } from '@/utils/cn'

type SearchBarProps = {
  placeholder?: string
  onSubmit?: (q: string) => void
  /** Minimum number of characters required before triggering search (default: 0) */
  minChars?: number
  /** Debounce delay in milliseconds (default: 300) */
  debounceMs?: number
}

export function SearchBar({ 
  placeholder = 'Buscar...', 
  onSubmit,
  minChars = 0,
  debounceMs = 300
}: SearchBarProps) {
  const { query, setQuery, clear } = useSearchStore()
  const [local, setLocal] = useState(query)
  const timer = useRef<number | null>(null)

  const commit = useCallback(
    (next: string) => {
      if (next.length >= minChars || next.length === 0) {
        setQuery(next)
        if (onSubmit) onSubmit(next)
      }
    },
    [minChars, onSubmit, setQuery],
  )

  // Debounce to avoid spamming subscribers
  useEffect(() => {
    if (timer.current) window.clearTimeout(timer.current)

    timer.current = window.setTimeout(() => {
      commit(local)
    }, debounceMs)

    return () => {
      if (timer.current) window.clearTimeout(timer.current)
    }
  }, [local, debounceMs, commit])

  return (
    <div className="relative w-full max-w-md">
      <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700/40 px-3 py-1.5 rounded-xl w-full">
        <MagnifyingGlassIcon className="h-5 w-5 text-gray-500 flex-shrink-0" />
        <input
          aria-label="Buscar"
          className="bg-transparent outline-none text-sm text-gray-700 dark:text-gray-200 w-full"
          placeholder={placeholder}
          value={local}
          onChange={(e) => setLocal(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              // commit immediately if meets minimum chars
              if (timer.current) window.clearTimeout(timer.current)
              commit(local)
            }
          }}
        />

        {local ? (
          <button
            onClick={() => { setLocal(''); clear(); if (onSubmit) onSubmit('') }}
            className={cn('p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 flex-shrink-0')}
            title="Limpiar búsqueda"
          >
            <XMarkIcon className="h-4 w-4 text-gray-500" />
          </button>
        ) : null}
      </div>
      
      {/* Show hint if user hasn't typed enough characters */}
      {minChars > 0 && local.length > 0 && local.length < minChars && (
        <div className="absolute top-full mt-1 left-0 right-0 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg px-3 py-2 text-xs text-amber-700 dark:text-amber-300 shadow-sm z-10">
          Escribe al menos {minChars} {minChars === 1 ? 'carácter' : 'caracteres'} para buscar
        </div>
      )}
    </div>
  )
}

export default SearchBar
