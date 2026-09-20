/**
 * OTPInput — código de un solo uso (verificación 2FA/SMS).
 * Auto-avance, pegado del código completo y backspace hacia atrás.
 */
import { useRef, useState, type ClipboardEvent, type KeyboardEvent } from 'react'
import { cn } from '@/utils/cn'

export interface OTPInputProps {
  value: string
  onChange: (value: string) => void
  /** Número de dígitos (default 6). */
  length?: number
  disabled?: boolean
  error?: string
  /** Oculta los caracteres (para códigos sensibles). */
  secure?: boolean
  onComplete?: (value: string) => void
  className?: string
}

export function OTPInput({
  value,
  onChange,
  length = 6,
  disabled = false,
  error,
  secure = false,
  onComplete,
  className,
}: OTPInputProps) {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([])
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null)
  const chars = Array.from({ length }, (_, i) => value[i] ?? '')

  const commit = (next: string) => {
    const normalized = next.slice(0, length)
    onChange(normalized)
    if (normalized.length === length) onComplete?.(normalized)
  }

  const setCharAt = (index: number, char: string) => {
    const digits = [...chars]
    digits[index] = char
    commit(digits.join('').replace(/\s/g, ''))
  }

  const handleChange = (index: number, raw: string) => {
    const digit = raw.replace(/\D/g, '').slice(-1)
    if (!digit) return
    setCharAt(index, digit)
    if (index < length - 1) inputsRef.current[index + 1]?.focus()
  }

  const handleKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace') {
      event.preventDefault()
      if (chars[index]) {
        setCharAt(index, '')
      } else if (index > 0) {
        setCharAt(index - 1, '')
        inputsRef.current[index - 1]?.focus()
      }
    }
    if (event.key === 'ArrowLeft' && index > 0) inputsRef.current[index - 1]?.focus()
    if (event.key === 'ArrowRight' && index < length - 1) inputsRef.current[index + 1]?.focus()
  }

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault()
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    if (!pasted) return
    commit(pasted)
    inputsRef.current[Math.min(pasted.length, length - 1)]?.focus()
  }

  return (
    <div className={cn('inline-flex flex-col gap-1', className)}>
      <div
        className="flex gap-2"
        role="group"
        aria-label={`Código de verificación de ${length} dígitos`}
      >
        {chars.map((char, index) => (
          <input
            key={index}
            ref={(node) => {
              inputsRef.current[index] = node
            }}
            type={secure ? 'password' : 'text'}
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={1}
            value={char}
            disabled={disabled}
            aria-label={`Dígito ${index + 1}`}
            aria-invalid={error ? true : undefined}
            onChange={(event) => handleChange(index, event.target.value)}
            onKeyDown={(event) => handleKeyDown(index, event)}
            onPaste={handlePaste}
            onFocus={() => setFocusedIndex(index)}
            onBlur={() => setFocusedIndex(null)}
            className={cn(
              'h-12 w-11 rounded-xl border text-center text-lg font-semibold tabular-nums transition-all',
              'bg-white dark:bg-gray-900 text-gray-900 dark:text-white',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
              'disabled:cursor-not-allowed disabled:opacity-50',
              error
                ? 'border-danger'
                : focusedIndex === index
                  ? 'border-primary-500'
                  : 'border-gray-300 dark:border-gray-600',
            )}
          />
        ))}
      </div>
      {error && (
        <p role="alert" className="m-0 text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  )
}
