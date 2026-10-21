import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CircularProgress } from '@/components/ui/CircularProgress'

describe('CircularProgress Component', () => {
  it('debe renderizar con rol progressbar y valores ARIA correctos', () => {
    render(<CircularProgress value={65} min={0} max={100} showValue />)

    const progress = screen.getByRole('progressbar')
    expect(progress).toBeInTheDocument()
    expect(progress).toHaveAttribute('aria-valuenow', '65')
    expect(progress).toHaveAttribute('aria-valuemin', '0')
    expect(progress).toHaveAttribute('aria-valuemax', '100')
    expect(screen.getByText('65%')).toBeInTheDocument()
  })

  it('debe soportar modo indeterminado (spinner continuo)', () => {
    render(<CircularProgress indeterminate />)

    const progress = screen.getByRole('progressbar')
    expect(progress).toBeInTheDocument()
    expect(progress).not.toHaveAttribute('aria-valuenow')

    const svg = progress.querySelector('svg')
    expect(svg).toHaveClass('animate-spin')
  })

  it('debe mostrar una etiqueta descriptiva cuando se provee', () => {
    render(<CircularProgress value={40} label="Progreso de Carga" />)

    expect(screen.getByText('Progreso de Carga')).toBeInTheDocument()
  })

  it('debe renderizar contenido hijo personalizado en el centro', () => {
    render(
      <CircularProgress value={100} size="lg">
        <span data-testid="custom-icon">✓</span>
      </CircularProgress>
    )

    expect(screen.getByTestId('custom-icon')).toBeInTheDocument()
    expect(screen.getByText('✓')).toBeInTheDocument()
  })

  it('debe soportar diámetros numéricos exactos en píxeles', () => {
    render(<CircularProgress value={80} size={120} />)

    const progress = screen.getByRole('progressbar')
    const wrapper = progress.querySelector('div')
    expect(wrapper).toHaveStyle({ width: '120px', height: '120px' })
  })
})
