import { describe, it, expect, beforeEach } from 'vitest'
import { useSidebarStore } from './sidebarStore'

describe('sidebarStore', () => {
  beforeEach(() => {
    useSidebarStore.setState({
      isOpen: true,
      isCollapsed: false,
      isMobile: false,
      sidebarWidth: 280,
    })
  })

  it('initializes with default values', () => {
    const state = useSidebarStore.getState()
    expect(state.isOpen).toBe(true)
    expect(state.isCollapsed).toBe(false)
    expect(state.isMobile).toBe(false)
    expect(state.sidebarWidth).toBe(280)
  })

  it('toggles open/close state', () => {
    useSidebarStore.getState().toggle()
    expect(useSidebarStore.getState().isOpen).toBe(false)

    useSidebarStore.getState().toggle()
    expect(useSidebarStore.getState().isOpen).toBe(true)
  })

  it('collapses and expands the sidebar', () => {
    useSidebarStore.getState().collapse()
    expect(useSidebarStore.getState().isCollapsed).toBe(true)

    useSidebarStore.getState().expand()
    expect(useSidebarStore.getState().isCollapsed).toBe(false)
  })

  it('closes the sidebar directly', () => {
    useSidebarStore.getState().close()
    expect(useSidebarStore.getState().isOpen).toBe(false)
  })

  it('updates sidebar width and mobile mode', () => {
    useSidebarStore.getState().setSidebarWidth(320)
    expect(useSidebarStore.getState().sidebarWidth).toBe(320)

    useSidebarStore.getState().setMobile(true)
    expect(useSidebarStore.getState().isMobile).toBe(true)
  })
})
