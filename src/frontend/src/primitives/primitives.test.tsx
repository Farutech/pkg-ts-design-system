import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Portal } from './Portal'
import { FocusTrap } from './FocusTrap'
import { ClickOutside } from './ClickOutside'
import { Icon } from './Icon/Icon'
import { IconProvider } from './Icon/IconContext'
import {
  ConfigProvider,
  useDensity,
  useVirtualizationConfig,
  useLocale,
  useDirection,
} from '@/providers/DesignSystemProvider'

describe('Fase 0 — Primitivas y Cimiento Arquitectónico', () => {
  describe('Portal', () => {
    it('debe renderizar el contenido dentro de document.body por defecto', () => {
      render(
        <Portal>
          <div data-testid="portal-content">Contenido en Portal</div>
        </Portal>
      )

      const content = screen.getByTestId('portal-content')
      expect(content).toBeInTheDocument()
      expect(content.parentElement?.id).toBe('ft-portal-root')
      expect(document.body.contains(content)).toBe(true)
    })

    it('debe renderizar dentro de un contenedor custom si se provee', () => {
      const customContainer = document.createElement('div')
      customContainer.id = 'my-custom-container'
      document.body.appendChild(customContainer)

      render(
        <Portal container={customContainer}>
          <span data-testid="custom-portal">En custom container</span>
        </Portal>
      )

      const element = screen.getByTestId('custom-portal')
      expect(element.parentElement).toBe(customContainer)
      document.body.removeChild(customContainer)
    })
  })

  describe('FocusTrap', () => {
    it('debe ciclar el foco entre elementos focusables al pulsar Tab y Shift+Tab', async () => {
      const user = userEvent.setup()

      render(
        <div>
          <button data-testid="outside-btn">Afuera</button>
          <FocusTrap>
            <button data-testid="btn-1">Primer botón</button>
            <input data-testid="input-1" placeholder="Texto" />
            <button data-testid="btn-2">Último botón</button>
          </FocusTrap>
        </div>
      )

      const btn1 = screen.getByTestId('btn-1')
      const btn2 = screen.getByTestId('btn-2')

      // Esperar que el foco inicial se posicione en el primer elemento
      await act(async () => {
        await new Promise((r) => setTimeout(r, 20))
      })

      expect(document.activeElement).toBe(btn1)

      // Tab hacia input
      await user.tab()
      expect(document.activeElement).toBe(screen.getByTestId('input-1'))

      // Tab hacia btn2
      await user.tab()
      expect(document.activeElement).toBe(btn2)

      // Tab desde btn2 cicla de vuelta a btn1
      await user.tab()
      expect(document.activeElement).toBe(btn1)

      // Shift+Tab desde btn1 cicla hacia btn2
      await user.tab({ shift: true })
      expect(document.activeElement).toBe(btn2)
    })

    it('debe llamar a onEscape cuando se presiona la tecla Escape', () => {
      const onEscape = vi.fn()

      render(
        <FocusTrap onEscape={onEscape}>
          <button data-testid="inside-btn">Dentro</button>
        </FocusTrap>
      )

      fireEvent.keyDown(document, { key: 'Escape' })
      expect(onEscape).toHaveBeenCalledTimes(1)
    })
  })

  describe('ClickOutside', () => {
    it('debe disparar onClickOutside solo al hacer clic fuera del contenedor', () => {
      const handleClickOutside = vi.fn()

      render(
        <div>
          <button data-testid="outside-click">Fuera</button>
          <ClickOutside onClickOutside={handleClickOutside}>
            <div data-testid="inside-box">
              <button data-testid="inside-click">Dentro</button>
            </div>
          </ClickOutside>
        </div>
      )

      // Clic dentro no dispara el callback
      fireEvent.mouseDown(screen.getByTestId('inside-click'))
      expect(handleClickOutside).not.toHaveBeenCalled()

      // Clic fuera sí dispara el callback
      fireEvent.mouseDown(screen.getByTestId('outside-click'))
      expect(handleClickOutside).toHaveBeenCalledTimes(1)
    })
  })

  describe('Sistema Semántico de Iconos y Adapters', () => {
    it('debe renderizar iconos semánticos con Heroicons por defecto', () => {
      render(
        <div>
          <Icon.ChevronDown data-testid="icon-chevron" size="lg" />
          <Icon.Clear data-testid="icon-clear" size="sm" />
          <Icon.Search data-testid="icon-search" />
        </div>
      )

      const chevron = screen.getByTestId('icon-chevron')
      expect(chevron).toBeInTheDocument()
      expect(chevron).toHaveClass('h-6 w-6')

      const clear = screen.getByTestId('icon-clear')
      expect(clear).toHaveClass('h-4 w-4')
    })

    it('debe permitir inyectar un IconAdapter custom mediante IconProvider', () => {
      const CustomCheck = (props: React.SVGProps<SVGSVGElement>) => (
        <svg data-testid="custom-check-svg" {...props}>
          <path d="M0 0" />
        </svg>
      )

      render(
        <IconProvider adapter={{ Check: CustomCheck as any }}>
          <Icon.Check />
          {/* Los demás iconos no provistos usan fallback al default */}
          <Icon.Search data-testid="fallback-search" />
        </IconProvider>
      )

      expect(screen.getByTestId('custom-check-svg')).toBeInTheDocument()
      expect(screen.getByTestId('fallback-search')).toBeInTheDocument()
    })
  })

  describe('ConfigProvider y Densidad', () => {
    function ConsumerComponent() {
      const density = useDensity()
      const virt = useVirtualizationConfig()
      const locale = useLocale()
      const dir = useDirection()
      return (
        <div>
          <span data-testid="density-val">{density}</span>
          <span data-testid="list-thresh">{virt.listThreshold}</span>
          <span data-testid="table-thresh">{virt.tableThreshold}</span>
          <span data-testid="locale-val">{locale}</span>
          <span data-testid="dir-val">{dir}</span>
        </div>
      )
    }

    it('debe proveer valores por defecto de densidad compacta y umbrales de virtualización', () => {
      render(
        <ConfigProvider>
          <ConsumerComponent />
        </ConfigProvider>
      )

      expect(screen.getByTestId('density-val').textContent).toBe('compact')
      expect(screen.getByTestId('list-thresh').textContent).toBe('80')
      expect(screen.getByTestId('table-thresh').textContent).toBe('100')
      expect(screen.getByTestId('locale-val').textContent).toBe('es-CO')
      expect(screen.getByTestId('dir-val').textContent).toBe('ltr')
    })

    it('debe permitir sobreescribir densidad y fusionar en subárboles', () => {
      render(
        <ConfigProvider density="comfortable" locale="en-US">
          <div data-testid="parent-scope">
            <ConsumerComponent />
            <ConfigProvider density="dense" dir="rtl">
              <div data-testid="child-scope">
                <ConsumerComponent />
              </div>
            </ConfigProvider>
          </div>
        </ConfigProvider>
      )

      const parentScope = screen.getByTestId('parent-scope')
      expect(parentScope.querySelector('[data-testid="density-val"]')?.textContent).toBe('comfortable')
      expect(parentScope.querySelector('[data-testid="locale-val"]')?.textContent).toBe('en-US')

      const childScope = screen.getByTestId('child-scope')
      expect(childScope.querySelector('[data-testid="density-val"]')?.textContent).toBe('dense')
      expect(childScope.querySelector('[data-testid="dir-val"]')?.textContent).toBe('rtl')
      // Hereda locale del padre
      expect(childScope.querySelector('[data-testid="locale-val"]')?.textContent).toBe('en-US')
    })
  })
})
