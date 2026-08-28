import { render, screen } from '@testing-library/react'
import { Badge, StatusBadge } from '../components/Badge'

describe('Badge (API reconciliada TASK-201)', () => {
  it('renderiza variantes y tamaños', () => {
    render(<Badge variant="success" size="lg">Activo</Badge>)
    const badge = screen.getByText('Activo')
    expect(badge).toHaveClass('ft-badge', 'ft-badge--success', 'ft-badge--lg')
  })

  it('variant "neutral" reemplaza al "default" de dashboard (una sola API)', () => {
    render(<Badge variant="neutral">Sistema</Badge>)
    expect(screen.getByText('Sistema')).toHaveClass('ft-badge--neutral')
  })

  it('modo mono cubre el caso Tag del website', () => {
    render(<Badge variant="outline" mono>Kubernetes</Badge>)
    expect(screen.getByText('Kubernetes')).toHaveClass('ft-badge--mono', 'ft-badge--outline')
  })

  it('StatusBadge mapea estados a variantes con dot', () => {
    render(<StatusBadge status="live" label="En producción" />)
    const badge = screen.getByText('En producción')
    expect(badge).toHaveClass('ft-badge--success')
    expect(badge.querySelector('.ft-badge__dot')).toBeInTheDocument()
  })

  it('StatusBadge con estado desconocido cae a neutral', () => {
    render(<StatusBadge status="misterio" />)
    expect(screen.getByText('misterio')).toHaveClass('ft-badge--neutral')
  })
})
