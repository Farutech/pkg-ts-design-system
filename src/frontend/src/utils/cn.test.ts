import { describe, it, expect } from 'vitest'
import { cn, twMerge } from './cn'

describe('cn utility', () => {
  it('merges class names correctly', () => {
    expect(cn('px-2', 'py-1')).toBe('px-2 py-1')
  })

  it('handles conditional class names with clsx syntax', () => {
    const isPrimary = true
    const isDisabled = false
    expect(cn('btn', isPrimary && 'btn-primary', isDisabled && 'btn-disabled')).toBe(
      'btn btn-primary'
    )
  })

  it('resolves conflicting tailwind classes with last-wins semantics', () => {
    expect(cn('p-4', 'p-2')).toBe('p-2')
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500')
    expect(cn('bg-red-500', 'bg-primary-600')).toBe('bg-primary-600')
  })

  it('resolves custom design system rounded-ft classes correctly', () => {
    // Both are rounded-ft-* group, so the latter should win
    expect(cn('rounded-ft-sm', 'rounded-ft-lg')).toBe('rounded-ft-lg')
  })

  it('resolves custom design system shadow-ft classes correctly', () => {
    expect(cn('shadow-ft-sm', 'shadow-ft-xl')).toBe('shadow-ft-xl')
  })

  it('resolves custom design system z-index classes correctly', () => {
    expect(cn('z-dropdown', 'z-modal')).toBe('z-modal')
  })

  it('handles arrays, objects, and empty/undefined/null inputs', () => {
    expect(
      cn(
        'base',
        ['item-1', 'item-2'],
        { active: true, hidden: false },
        null,
        undefined,
        false
      )
    ).toBe('base item-1 item-2 active')
  })

  it('exposes configured twMerge instance', () => {
    expect(typeof twMerge).toBe('function')
    expect(twMerge('rounded-ft-sm', 'rounded-ft-full')).toBe('rounded-ft-full')
  })
})
