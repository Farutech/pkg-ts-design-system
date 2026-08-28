import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LoginScreen } from '../LoginScreen'

describe('LoginScreen (TASK-203)', () => {
  it('flujo de éxito: llama onSubmit con las credenciales y expone el payload en onSuccess', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn().mockResolvedValue({ token: 'abc123' })
    const onSuccess = vi.fn()

    render(<LoginScreen onSubmit={onSubmit} onSuccess={onSuccess} />)

    await user.type(screen.getByLabelText(/^correo electrónico/i), 'admin@farutech.com')
    await user.type(screen.getByLabelText(/^contraseña/i), 'supersecret')
    await user.click(screen.getByRole('button', { name: 'Iniciar sesión' }))

    await waitFor(() => expect(onSuccess).toHaveBeenCalledWith({ token: 'abc123' }))
    expect(onSubmit).toHaveBeenCalledWith({
      email: 'admin@farutech.com',
      password: 'supersecret',
      remember: false,
    })
  })

  it('flujo de error: submit rechazado muestra Alert danger y NO llama onSuccess', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn().mockRejectedValue(new Error('Credenciales inválidas'))
    const onSuccess = vi.fn()

    render(<LoginScreen onSubmit={onSubmit} onSuccess={onSuccess} />)

    await user.type(screen.getByLabelText(/^correo electrónico/i), 'admin@farutech.com')
    await user.type(screen.getByLabelText(/^contraseña/i), 'wrong')
    await user.click(screen.getByRole('button', { name: 'Iniciar sesión' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Credenciales inválidas')
    expect(onSuccess).not.toHaveBeenCalled()
  })

  it('mientras espera al backend el botón queda deshabilitado/loading', async () => {
    const user = userEvent.setup()
    let resolvePromise: (v: unknown) => void = () => undefined
    const onSubmit = vi.fn().mockImplementation(() => new Promise((r) => { resolvePromise = r }))

    render(<LoginScreen onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText(/^correo electrónico/i), 'a@b.com')
    await user.type(screen.getByLabelText(/^contraseña/i), '12345678')
    await user.click(screen.getByRole('button', { name: 'Iniciar sesión' }))

    const btn = screen.getByRole('button', { name: 'Iniciar sesión' })
    expect(btn).toBeDisabled()
    expect(btn).toHaveAttribute('aria-busy', 'true')

    resolvePromise({ token: 'x' })
  })
})