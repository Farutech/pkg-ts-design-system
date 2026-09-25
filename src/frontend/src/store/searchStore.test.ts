import { describe, it, expect, beforeEach } from 'vitest'
import { useSearchStore } from './searchStore'

describe('searchStore', () => {
  beforeEach(() => {
    useSearchStore.setState({
      query: '',
      isOpen: false,
      recentSearches: [],
    })
  })

  it('updates search query and open status', () => {
    useSearchStore.getState().setQuery('button')
    expect(useSearchStore.getState().query).toBe('button')

    useSearchStore.getState().setOpen(true)
    expect(useSearchStore.getState().isOpen).toBe(true)
  })

  it('adds recent searches uniquely and caps at 5 items', () => {
    const store = useSearchStore.getState()
    store.addRecentSearch('button')
    store.addRecentSearch('input')
    store.addRecentSearch('card')
    store.addRecentSearch('modal')
    store.addRecentSearch('table')
    store.addRecentSearch('toast')

    const searches = useSearchStore.getState().recentSearches
    expect(searches).toHaveLength(5)
    expect(searches[0]).toBe('toast')
    expect(searches).not.toContain('button')

    // Duplicate search moves to front
    useSearchStore.getState().addRecentSearch('card')
    const updated = useSearchStore.getState().recentSearches
    expect(updated[0]).toBe('card')
    expect(updated.filter((s) => s === 'card')).toHaveLength(1)
  })

  it('clears recent searches', () => {
    useSearchStore.getState().addRecentSearch('test')
    useSearchStore.getState().clearRecentSearches()
    expect(useSearchStore.getState().recentSearches).toEqual([])
  })

  it('clears query and closes modal with clear()', () => {
    useSearchStore.getState().setQuery('something')
    useSearchStore.getState().setOpen(true)
    useSearchStore.getState().clear()

    expect(useSearchStore.getState().query).toBe('')
    expect(useSearchStore.getState().isOpen).toBe(false)
  })
})
