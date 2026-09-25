import { describe, it, expect, beforeEach } from 'vitest'
import { useThemeStore } from './themeStore'

describe('themeStore', () => {
  beforeEach(() => {
    useThemeStore.setState({ theme: 'system' })
  })

  it('initializes with system theme by default', () => {
    expect(useThemeStore.getState().theme).toBe('system')
  })

  it('updates theme using setTheme', () => {
    useThemeStore.getState().setTheme('dark')
    expect(useThemeStore.getState().theme).toBe('dark')

    useThemeStore.getState().setTheme('light')
    expect(useThemeStore.getState().theme).toBe('light')

    useThemeStore.getState().setTheme('system')
    expect(useThemeStore.getState().theme).toBe('system')
  })

  it('toggles theme between dark and light', () => {
    // When initial/system, toggles to dark
    useThemeStore.getState().toggleTheme()
    expect(useThemeStore.getState().theme).toBe('dark')

    // When dark, toggles to light
    useThemeStore.getState().toggleTheme()
    expect(useThemeStore.getState().theme).toBe('light')

    // When light, toggles to dark
    useThemeStore.getState().toggleTheme()
    expect(useThemeStore.getState().theme).toBe('dark')
  })
})
