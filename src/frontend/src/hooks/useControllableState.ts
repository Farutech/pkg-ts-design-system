import { useState, useCallback, useRef, useEffect } from 'react'

export interface UseControllableStateProps<T> {
  value?: T
  defaultValue?: T | (() => T)
  onChange?: (value: T) => void
}

/**
 * Hook para gestionar componentes con doble modo (controlado vs no-controlado)
 * de acuerdo con el estándar de React UI primitives.
 */
export function useControllableState<T>({
  value: controlledValue,
  defaultValue,
  onChange,
}: UseControllableStateProps<T>) {
  const isControlled = controlledValue !== undefined
  const [uncontrolledValue, setUncontrolledValue] = useState<T>(defaultValue as T)

  const value = isControlled ? (controlledValue as T) : uncontrolledValue
  const onChangeRef = useRef(onChange)

  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  const setValue = useCallback(
    (next: T | ((prev: T) => T)) => {
      const setter = next as (prev: T) => T
      const nextValue = typeof next === 'function' ? setter(value) : next

      if (!isControlled) {
        setUncontrolledValue(nextValue)
      }

      onChangeRef.current?.(nextValue)
    },
    [isControlled, value]
  )

  return [value, setValue] as const
}
