/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useDebounce, useDebouncedCallback } from './useDebounce'

describe('useDebounce hook', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial'))
    expect(result.current).toBe('initial')
  })

  it('updates value only after the specified delay', () => {
    const { result, rerender } = renderHook(
      ({ val, delay }) => useDebounce(val, { delay }),
      { initialProps: { val: 'first', delay: 300 } }
    )

    expect(result.current).toBe('first')

    rerender({ val: 'second', delay: 300 })
    expect(result.current).toBe('first')

    act(() => {
      vi.advanceTimersByTime(299)
    })
    expect(result.current).toBe('first')

    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(result.current).toBe('second')
  })

  it('uses default delay of 300ms if not specified', () => {
    const { result, rerender } = renderHook(({ val }) => useDebounce(val), {
      initialProps: { val: 'a' },
    })

    rerender({ val: 'b' })
    expect(result.current).toBe('a')

    act(() => {
      vi.advanceTimersByTime(300)
    })
    expect(result.current).toBe('b')
  })

  it('clears previous timer on rapid updates (debouncing)', () => {
    const { result, rerender } = renderHook(({ val }) => useDebounce(val, { delay: 200 }), {
      initialProps: { val: 'a' },
    })

    rerender({ val: 'b' })
    act(() => {
      vi.advanceTimersByTime(100)
    })
    expect(result.current).toBe('a')

    rerender({ val: 'c' })
    act(() => {
      vi.advanceTimersByTime(150)
    })
    // 250ms total, but only 150ms since 'c' was set
    expect(result.current).toBe('a')

    act(() => {
      vi.advanceTimersByTime(50)
    })
    expect(result.current).toBe('c')
  })
})

describe('useDebouncedCallback hook', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('delays callback invocation until delay has elapsed', () => {
    const callback = vi.fn()
    const { result } = renderHook(() => useDebouncedCallback(callback, { delay: 250 }))

    act(() => {
      result.current('arg1', 42)
    })

    expect(callback).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(249)
    })
    expect(callback).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(callback).toHaveBeenCalledTimes(1)
    expect(callback).toHaveBeenCalledWith('arg1', 42)
  })

  it('supports leading edge execution when leading is true', () => {
    const callback = vi.fn()
    const { result } = renderHook(() =>
      useDebouncedCallback(callback, { delay: 200, leading: true })
    )

    act(() => {
      result.current('first-call')
    })

    // Leading edge executes immediately
    expect(callback).toHaveBeenCalledTimes(1)
    expect(callback).toHaveBeenCalledWith('first-call')

    // Additional call within delay window
    act(() => {
      result.current('second-call')
    })
    expect(callback).toHaveBeenCalledTimes(1)

    // After timer elapses, the trailing call executes
    act(() => {
      vi.advanceTimersByTime(200)
    })
    expect(callback).toHaveBeenCalledTimes(2)
    expect(callback).toHaveBeenLastCalledWith('second-call')
  })

  it('uses default options (delay 300, leading false)', () => {
    const callback = vi.fn()
    const { result } = renderHook(() => useDebouncedCallback(callback))

    act(() => {
      result.current('test')
    })
    expect(callback).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(300)
    })
    expect(callback).toHaveBeenCalledTimes(1)
    expect(callback).toHaveBeenCalledWith('test')
  })
})
