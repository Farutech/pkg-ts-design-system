import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Input } from '../components/Input'
import { Alert } from '../components/Alert'
import { DesignSystemProvider } from '../providers/DesignSystemProvider'

describe('Input (TASK-201 accesibilidad mínima)', () => {
  it('asocia label por id y soporta ref (forwardRef)', () => {
    let refValue = ''
    render(
      <Input
        label="Correo"
        ref={(el) => {
          refValue = el?.id ?? ''
        }}
      />,
    )
    const input = screen.getByLabelText('Correo')
    expect(input).toBeInTheDocument()
    expect(refValue).not.toBe('')
  })

  it('expone error con role=alert y aria-invalid', () => {
    render(<Input label="Email" error="Correo inválido" />)
    const input = screen.getByLabelText('Email')
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByRole('alert')).toHaveTextContent('Correo inválido')
  })
})

describe('Alert (TASK-201)', () => {
  it('cierra con el botón accesible y notifica onClose', async () => {
    const onClose = vi.fn()
    render(<Alert variant="warning" title="Atención" onClose={onClose}>Revisa tus datos</Alert>)

    await userEvent.click(screen.getByRole('button', { name: 'Cerrar aviso' }))
    expect(onClose).toHaveBeenCalledOnce()
    expect(screen.queryByText('Atención')).not.toBeInTheDocument()
  })

  it('danger usa role=alert', () => {
    render(<Alert variant="danger">Falló</Alert>)
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })
})

describe('DesignSystemProvider (tokens configurables, doc 08 req. 4)', () => {
  it('aplica overrides de tokens como custom properties en el subárbol', () => {
    render(
      <DesignSystemProvider theme={{ colorPrimary: '#ff0000' }}>
        <span>Hola</span>
      </DesignSystemProvider>,
    )
    const tree = screen.getByText('Hola').parentElement as HTMLElement
    expect(tree.style.getPropertyValue('--ft-color-primary')).toBe('#ff0000')
  })

  it('colorMode=dark activa data-theme en el subárbol', () => {
    render(
      <DesignSystemProvider colorMode="dark">
        <span>Oscuro</span>
      </DesignSystemProvider>,
    )
    const tree = screen.getByText('Oscuro').parentElement as HTMLElement
    expect(tree).toHaveAttribute('data-theme', 'dark')
  })
})
