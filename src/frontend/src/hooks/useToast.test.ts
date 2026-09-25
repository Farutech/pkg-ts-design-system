import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useToast } from './useToast'
import { useToastStore } from '@/store/toastStore'

describe('useToast hook', () => {
  beforeEach(() => {
    useToastStore.setState({ toasts: [] })
  })

  it('exposes toast store actions and state', () => {
    const { result } = renderHook(() => useToast())

    expect(result.current.toasts).toEqual([])

    let toastId = ''
    act(() => {
      toastId = result.current.addToast({
        type: 'success',
        message: 'Saved!',
      })
    })

    expect(result.current.toasts).toHaveLength(1)
    expect(result.current.toasts[0].id).toBe(toastId)
    expect(result.current.toasts[0].message).toBe('Saved!')

    act(() => {
      result.current.updateToast(toastId, { message: 'Updated!' })
    })

    expect(result.current.toasts[0].message).toBe('Updated!')

    act(() => {
      result.current.removeToast(toastId)
    })

    expect(result.current.toasts).toHaveLength(0)
  })

  it('triggers notify methods via hook', () => {
    const { result } = renderHook(() => useToast())

    act(() => {
      result.current.notify.error('Fatal error', 'Oops')
    })

    expect(result.current.toasts).toHaveLength(1)
    expect(result.current.toasts[0].type).toBe('error')
    expect(result.current.toasts[0].title).toBe('Oops')

    act(() => {
      result.current.clearToasts()
    })

    expect(result.current.toasts).toHaveLength(0)
  })
})
