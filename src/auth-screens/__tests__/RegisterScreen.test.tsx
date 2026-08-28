import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RegisterScreen } from '../RegisterScreen'

describe('RegisterScreen (TASK-203)', () => {
  it('valida en cliente: contraseñas distintas -> error, onSubmit NO se llama', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    render(<RegisterScreen onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText(/^nombre completo/i), 'Jane Doe')
    await user.type(screen.getByLabelText(/^correo electrónico/i), 'jane@farutech.com')
    await user.type(screen.getByLabelText(/^contraseña/i), '12345678')
    await user.type(screen.getByLabelText(/^confirmar contraseña/i), '87654321')
    await user.click(screen.getByRole('button', { name: 'Registrarme' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Las contraseñas no coinciden')
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('flujo de éxito: envía name/email/password y entrega el payload con requires_confirmation', async () => {
    const user = userEvent.setup()
    const onSubmit = vi
      .fn()
      .mockResolvedValue({ message: 'Cuenta creada', requires_confirmation: true })
    const onSuccess = vi.fn()

    render(<RegisterScreen onSubmit={onSubmit} onSuccess={onSuccess} />)

    await user.type(screen.getByLabelText(/^nombre completo/i), 'Jane Doe')
    await user.type(screen.getByLabelText(/^correo electrónico/i), 'jane@farutech.com')
    await user.type(screen.getByLabelText(/^contraseña/i), '12345678')
    await user.type(screen.getByLabelText(/^confirmar contraseña/i), '12345678')
    await user.click(screen.getByRole('button', { name: 'Registrarme' }))

    await waitFor(() =>
      expect(onSuccess).toHaveBeenCalledWith({
        message: 'Cuenta creada',
        requires_confirmation: true,
      }),
    )
    expect(onSubmit).toHaveBeenCalledWith({
      name: 'Jane Doe',
      email: 'jane@farutech.com',
      password: '12345678',
    })
  })

  it('contraseña corta -> error y no envía', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    render(<RegisterScreen onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText(/^nombre completo/i), 'Jane')
    await user.type(screen.getByLabelText(/^correo electrónico/i), 'jane@farutech.com')
    await user.type(screen.getByLabelText(/^contraseña/i), '123')
    await user.type(screen.getByLabelText(/^confirmar contraseña/i), '123')
    await user.click(screen.getByRole('button', { name: 'Registrarme' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('al menos 8 caracteres')
    expect(onSubmit).not.toHaveBeenCalled()
  })
})