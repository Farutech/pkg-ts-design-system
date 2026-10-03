import { useState, useEffect, useCallback } from 'react'

export interface StorageOptions<T> {
  serializer?: (value: T) => string
  deserializer?: (value: string) => T
}

function createStorageHook(type: 'localStorage' | 'sessionStorage') {
  return function useStorage<T>(
    key: string,
    initialValue: T,
    options?: StorageOptions<T>
  ): [T, (value: T | ((prev: T) => T)) => void, () => void] {
    const serializer = options?.serializer || JSON.stringify
    const deserializer = options?.deserializer || JSON.parse

    const readValue = useCallback((): T => {
      if (typeof window === 'undefined') return initialValue

      try {
        const storage = window[type]
        const raw = storage.getItem(key)
        return raw !== null ? deserializer(raw) : initialValue
      } catch (error) {
        console.warn(`[useStorage] Error leyendo ${key} de ${type}:`, error)
        return initialValue
      }
    }, [key, initialValue, deserializer])

    const [storedValue, setStoredValue] = useState<T>(readValue)

    const setValue = useCallback(
      (value: T | ((prev: T) => T)) => {
        if (typeof window === 'undefined') return

        try {
          const storage = window[type]
          const nextValue = value instanceof Function ? value(storedValue) : value
          storage.setItem(key, serializer(nextValue))
          setStoredValue(nextValue)
          window.dispatchEvent(new Event('storage'))
        } catch (error) {
          console.warn(`[useStorage] Error guardando ${key} en ${type}:`, error)
        }
      },
      [key, serializer, storedValue]
    )

    const removeValue = useCallback(() => {
      if (typeof window === 'undefined') return
      try {
        window[type].removeItem(key)
        setStoredValue(initialValue)
        window.dispatchEvent(new Event('storage'))
      } catch (error) {
        console.warn(`[useStorage] Error eliminando ${key} de ${type}:`, error)
      }
    }, [key, initialValue])

    useEffect(() => {
      const handleStorageChange = () => {
        setStoredValue(readValue())
      }

      window.addEventListener('storage', handleStorageChange)
      return () => window.removeEventListener('storage', handleStorageChange)
    }, [readValue])

    return [storedValue, setValue, removeValue]
  }
}

export const useLocalStorage = createStorageHook('localStorage')
export const useSessionStorage = createStorageHook('sessionStorage')
