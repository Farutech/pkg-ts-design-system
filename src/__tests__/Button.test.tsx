import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '../components/Button'
import { DesignSystemProvider } from '../providers/DesignSystemProvider'

describe('Button (API reconciliada TASK-201)', () => {
  it('renderiza un <button> nativo y dispara onClick', async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Guardar</Button>)

    await userEvent.click(screen.getByRole('button', { name: 'Guardar' }))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('con loading queda deshabilitado y con aria-busy', () => {
    render(<Button loading>Enviar</Button>)
    const btn = screen.getByRole('button', { name: 'Enviar' })
    expect(btn).toBeDisabled()
    expect(btn).toHaveAttribute('aria-busy', 'true')
  })

  it('href renderiza un enlace externo seguro', () => {
    render(<Button href="https://farutech.com" external>Docs</Button>)
    const link = screen.getByRole('link', { name: 'Docs' })
    expect(link).toHaveAttribute('href', 'https://farutech.com')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('to usa el LinkComponent del provider (sin dependencia de router)', () => {
    function FakeLink({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
      return (
        <a data-testid="fake-link" data-href={href} className={className}>
          {children}
        </a>
      )
    }
    render(
      <DesignSystemProvider linkComponent={FakeLink}>
        <Button to="/servicios" variant="outline">Servicios</Button>
      </DesignSystemProvider>,
    )

    const link = screen.getByTestId('fake-link')
    expect(link).toHaveAttribute('data-href', '/servicios')
    expect(link).toHaveClass('ft-button', 'ft-button--outline')
  })

  it('aplica fullWidth y variantes sin duplicar API', () => {
    render(<Button variant="secondary" fullWidth>OK</Button>)
    expect(screen.getByRole('button', { name: 'OK' })).toHaveClass('ft-button--secondary', 'ft-button--full')
  })
})
