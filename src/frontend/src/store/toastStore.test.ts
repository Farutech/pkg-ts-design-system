import { describe, it, expect, beforeEach } from 'vitest'
import { useToastStore } from './toastStore'

describe('toastStore', () => {
  beforeEach(() => {
    useToastStore.setState({ toasts: [] })
  })

  it('adds and removes a toast correctly', () => {
    const id = useToastStore.getState().addToast({
      type: 'info',
      message: 'Test message',
    })

    expect(id).toBeDefined()
    expect(useToastStore.getState().toasts).toHaveLength(1)
    expect(useToastStore.getState().toasts[0].message).toBe('Test message')
    expect(useToastStore.getState().toasts[0].position).toBe('top-right')

    useToastStore.getState().removeToast(id)
    expect(useToastStore.getState().toasts).toHaveLength(0)
  })

  it('updates a toast by id', () => {
    const id = useToastStore.getState().addToast({
      type: 'loading',
      message: 'Loading data...',
    })

    useToastStore.getState().updateToast(id, {
      type: 'success',
      message: 'Data loaded!',
    })

    const toast = useToastStore.getState().toasts[0]
    expect(toast.type).toBe('success')
    expect(toast.message).toBe('Data loaded!')
  })

  it('clears all toasts', () => {
    useToastStore.getState().addToast({ type: 'info', message: '1' })
    useToastStore.getState().addToast({ type: 'warning', message: '2' })
    expect(useToastStore.getState().toasts).toHaveLength(2)

    useToastStore.getState().clearToasts()
    expect(useToastStore.getState().toasts).toHaveLength(0)
  })

  it('provides helper notifications for success, error, warning, info, and loading', () => {
    const sId = useToastStore.getState().notify.success('Success message', 'Title', 3000, 'bottom-center')
    expect(sId).toBeDefined()

    const eId = useToastStore.getState().notify.error('Error message')
    expect(eId).toBeDefined()

    const wId = useToastStore.getState().notify.warning('Warning message')
    expect(wId).toBeDefined()

    const iId = useToastStore.getState().notify.info('Info message')
    expect(iId).toBeDefined()

    const lId = useToastStore.getState().notify.loading('Loading message')
    expect(lId).toBeDefined()

    const toasts = useToastStore.getState().toasts
    expect(toasts).toHaveLength(5)
    expect(toasts[0].position).toBe('bottom-center')
    expect(toasts[4].type).toBe('loading')
    expect(toasts[4].duration).toBe(0)
  })
})
