import {
  forwardRef,
  useState,
  useRef,
  type FocusEvent,
  type KeyboardEvent,
} from 'react'
import { Input, type InputProps } from './Input'
import { Icon } from '@/primitives/Icon/Icon'

export interface NumberInputProps extends Omit<InputProps, 'type' | 'onChange' | 'onValueChange'> {
  value?: number
  defaultValue?: number
  min?: number
  max?: number
  step?: number
  precision?: number
  /** Callback tipado con el valor numérico */
  onChange?: (value: number | undefined) => void
  /** Si debe mostrar los botones incrementador/decrementador (default: true) */
  controls?: boolean
}

/**
 * NumberInput:
 * Campo numérico con botones de incremento/decremento, límites min/max y soporte de flechas del teclado.
 */
export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      value,
      defaultValue,
      min = -Infinity,
      max = Infinity,
      step = 1,
      precision,
      onChange,
      controls = true,
      disabled,
      ...props
    },
    ref
  ) => {
    const [internalVal, setInternalVal] = useState<string>(
      value !== undefined
        ? String(value)
        : defaultValue !== undefined
        ? String(defaultValue)
        : ''
    )

    const inputRef = useRef<HTMLInputElement>(null)
    const combinedRef = (node: HTMLInputElement | null) => {
      ;(inputRef as React.MutableRefObject<HTMLInputElement | null>).current = node
      if (typeof ref === 'function') ref(node)
      else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = node
    }

    const currentStringVal = value !== undefined ? String(value) : internalVal

    const clamp = (val: number): number => {
      return Math.min(Math.max(val, min), max)
    }

    const formatNumber = (num: number): string => {
      if (precision !== undefined) {
        return num.toFixed(precision)
      }
      return String(num)
    }

    const updateValue = (newNum: number) => {
      const clamped = clamp(newNum)
      const str = formatNumber(clamped)
      setInternalVal(str)
      onChange?.(clamped)
    }

    const handleStep = (direction: 1 | -1) => {
      if (disabled) return
      const current = parseFloat(currentStringVal)
      const base = isNaN(current) ? 0 : current
      updateValue(base + direction * step)
    }

    const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
      props.onBlur?.(e)
      const parsed = parseFloat(currentStringVal)
      if (!isNaN(parsed)) {
        updateValue(parsed)
      } else if (currentStringVal !== '') {
        setInternalVal('')
        onChange?.(undefined)
      }
    }

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      props.onKeyDown?.(e)
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        handleStep(1)
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        handleStep(-1)
      }
    }

    const stepperControls = controls && !disabled && (
      <div className="flex flex-col border-l border-gray-300 dark:border-gray-700 h-full justify-center px-1 select-none">
        <button
          type="button"
          tabIndex={-1}
          aria-label="Incrementar"
          onClick={() => handleStep(1)}
          className="p-0.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
        >
          <Icon.ChevronUp size="xs" />
        </button>
        <button
          type="button"
          tabIndex={-1}
          aria-label="Decrementar"
          onClick={() => handleStep(-1)}
          className="p-0.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
        >
          <Icon.ChevronDown size="xs" />
        </button>
      </div>
    )

    return (
      <Input
        ref={combinedRef}
        type="text"
        inputMode="decimal"
        value={currentStringVal}
        disabled={disabled}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        onValueChange={(val) => {
          setInternalVal(val)
          const parsed = parseFloat(val)
          onChange?.(isNaN(parsed) ? undefined : parsed)
        }}
        rightSection={stepperControls}
        {...props}
      />
    )
  }
)

NumberInput.displayName = 'NumberInput'
