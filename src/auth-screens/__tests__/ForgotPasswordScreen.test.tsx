import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ForgotPasswordScreen } from '../ForgotPasswordScreen'

describe('ForgotPasswordScreen (TASK-203)', () => {
  it('flujo email: enviar -> estado "enviado" con el correo', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn().mockResolvedValue({ message: 'ok' })

    render(<ForgotPasswordScreen onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText(/^correo electrónico/i), 'jane@farutech.com')
    await user.click(screen.getByRole('button', { name: 'Enviar solicitud' }))

    expect(await screen.findByText(/enlace de recuperación/i)).toBeInTheDocument()
    expect(onSubmit).toHaveBeenCalledWith({ email: 'jane@farutech.com' })
  })

  it('flujo admin_request: muestra aviso de revisión con el correo de contacto', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn().mockResolvedValue({})

    render(
      <ForgotPasswordScreen
        onSubmit={onSubmit}
        method="admin_request"
        adminEmail="ti@farutech.com"
      />,
    )

    await user.type(screen.getByLabelText(/^correo electrónico/i), 'jane@farutech.com')
    await user.click(screen.getByRole('button', { name: 'Enviar solicitud' }))

    expect(await screen.findByText(/equipo de administración/i)).toBeInTheDocument()
    expect(screen.getByText('ti@farutech.com')).toBeInTheDocument()
  })

  it('error del backend -> estado de error con reintentar', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn().mockRejectedValue(new Error('Servicio no disponible'))

    render(<ForgotPasswordScreen onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText(/^correo electrónico/i), 'jane@farutech.com')
    await user.click(screen.getByRole('button', { name: 'Enviar solicitud' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Servicio no disponible')
    expect(screen.getByRole('button', { name: 'Intentar nuevamente' })).toBeInTheDocument()
  })
})