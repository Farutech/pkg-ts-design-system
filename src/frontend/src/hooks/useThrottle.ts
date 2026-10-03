import { useState, useEffect, useRef, useCallback } from 'react'

/**
 * useThrottle - Limita la frecuencia de actualización de un valor.
 */
export function useThrottle<T>(value: T, intervalMs = 300): T {
  const [throttledValue, setThrottledValue] = useState<T>(value)
  const lastExecuted = useRef<number>(0)

  useEffect(() => {
    if (Date.now() >= lastExecuted.current + intervalMs) {
      lastExecuted.current = Date.now()
      setThrottledValue(value)
    } else {
      const timerId = setTimeout(() => {
        lastExecuted.current = Date.now()
        setThrottledValue(value)
      }, intervalMs)

      return () => clearTimeout(timerId)
    }
  }, [value, intervalMs])

  return throttledValue
}

/**
 * useThrottledCallback - Devuelve una versión throttled de una función callback.
 */
export function useThrottledCallback<T extends (...args: any[]) => any>(
  callback: T,
  intervalMs = 300
): (...args: Parameters<T>) => void {
  const lastCalled = useRef<number>(0)
  const timeoutRef = useRef<any>(null)
  const callbackRef = useRef<T>(callback)

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now()
      const timeRemaining = intervalMs - (now - lastCalled.current)

      if (timeRemaining <= 0) {
        lastCalled.current = now
        callbackRef.current(...args)
      } else {
        if (timeoutRef.current) clearTimeout(timeoutRef.current)
        timeoutRef.current = setTimeout(() => {
          lastCalled.current = Date.now()
          callbackRef.current(...args)
        }, timeRemaining)
      }
    },
    [intervalMs]
  )
}
