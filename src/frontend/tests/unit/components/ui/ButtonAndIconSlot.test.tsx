import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Button } from '@/components/ui/Button'
import { IconButton } from '@/components/ui/IconButton'
import { Badge } from '@/components/ui/Badge'
import { Chip } from '@/components/ui/Chip'
import { ButtonGroup } from '@/components/ui/ButtonGroup'
import { IconSlot } from '@/primitives/icon/IconSlot'

// Mock de un icono de lucide-react o SVG nativo
const MockLucidePlus = (props: React.SVGProps<SVGSVGElement>) => (
  <svg data-testid="lucide-plus" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)

describe('Fase 2 — Primitiva IconSlot y Composición Anti-Salto de Línea', () => {
  describe('IconSlot', () => {
    it('normaliza un icono SVG / lucide-react inyectando shrink-0 y aria-hidden', () => {
      render(<IconSlot icon={<MockLucidePlus />} />)
      const svg = screen.getByTestId('lucide-plus')
      expect(svg).toBeInTheDocument()
      expect(svg.getAttribute('class')).toContain('shrink-0')
      expect(svg.getAttribute('aria-hidden')).toBe('true')
    })

    it('renderiza un icono del catálogo IconAdapter mediante prop name', () => {
      const { container } = render(<IconSlot name="Plus" />)
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
      expect(container.firstChild).toHaveClass('shrink-0')
    })
  })

  describe('Button con protección anti-quiebre', () => {
    it('aplica whitespace-nowrap por defecto en la clase del botón', () => {
      render(<Button>Acción Segura</Button>)
      const button = screen.getByRole('button', { name: /acción segura/i })
      expect(button.className).toContain('whitespace-nowrap')
      expect(button.className).toContain('ft-inline-action')
    })

    it('mantiene icono y texto sin salto cuando el icono se pasa por prop leftIcon', () => {
      render(<Button leftIcon={<MockLucidePlus />}>Nuevo Registro</Button>)
      const button = screen.getByRole('button', { name: /nuevo registro/i })
      const svg = screen.getByTestId('lucide-plus')
      expect(svg).toBeInTheDocument()
      expect(svg.getAttribute('class')).toContain('shrink-0')
      expect(button.className).toContain('whitespace-nowrap')
    })

    it('protege de salto de línea cuando el icono se pasa directamente mezclado en children', () => {
      render(
        <Button>
          <MockLucidePlus />
          Crear Cliente
        </Button>
      )
      const button = screen.getByRole('button', { name: /crear cliente/i })
      const spanContainer = button.querySelector('span')
      expect(spanContainer).toBeInTheDocument()
      expect(spanContainer?.className).toContain('whitespace-nowrap')
      expect(spanContainer?.className).toContain('inline-flex')
      expect(spanContainer?.className).toContain('[&>svg]:shrink-0')
    })

    it('permite salto de línea cuando se activa allowWrap={true}', () => {
      render(<Button allowWrap={true}>Texto con envoltura permitida</Button>)
      const button = screen.getByRole('button', { name: /texto con envoltura/i })
      expect(button.className).not.toContain('whitespace-nowrap')
    })

    it('permite salto explícito con elemento <br />', () => {
      render(
        <Button>
          Línea 1
          <br data-testid="explicit-br" />
          Línea 2
        </Button>
      )
      const br = screen.getByTestId('explicit-br')
      expect(br).toBeInTheDocument()
    })
  })

  describe('Matriz de interactivos con protección anti-quiebre', () => {
    it('IconButton protege el icono contra encogimiento con shrink-0', () => {
      render(<IconButton icon={<MockLucidePlus />} aria-label="Añadir ítem" />)
      const button = screen.getByRole('button', { name: /añadir ítem/i })
      const svg = screen.getByTestId('lucide-plus')
      expect(button.className).toContain('shrink-0')
      expect(button.className).toContain('whitespace-nowrap')
      expect(svg.getAttribute('class')).toContain('shrink-0')
    })

    it('Badge protege texto e iconos contra saltos de línea involuntarios', () => {
      render(
        <Badge>
          <MockLucidePlus />
          En Proceso
        </Badge>
      )
      const badge = screen.getByText(/en proceso/i)
      expect(badge.className).toContain('whitespace-nowrap')
      expect(badge.className).toContain('shrink-0')
    })

    it('Chip protege texto e iconos contra saltos de línea involuntarios', () => {
      render(
        <Chip icon={<MockLucidePlus />} onDelete={() => {}}>
          Filtro Activo
        </Chip>
      )
      const chipText = screen.getByText(/filtro activo/i)
      expect(chipText).toBeInTheDocument()
      const svg = screen.getByTestId('lucide-plus')
      expect(svg.getAttribute('class')).toContain('shrink-0')
    })

    it('ButtonGroup mantiene botones en línea sin quiebres de línea', () => {
      render(
        <ButtonGroup>
          <Button key="1">Opción 1</Button>
          <Button key="2">Opción 2</Button>
        </ButtonGroup>
      )
      const group = screen.getByRole('group')
      expect(group.className).toContain('whitespace-nowrap')
      expect(group.className).toContain('shrink-0')
    })
  })
})
