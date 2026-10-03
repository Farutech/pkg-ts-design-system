import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AppShell } from './AppShell'
import { BulkActionsBar } from '@/components/ui/BulkActionsBar'
import { LoginPage } from '@/auth-screens/LoginPage'

describe('Fase 3 — Compuestos P0 y Patrones Empresariales', () => {
  describe('AppShell', () => {
    it('debe renderizar slots de sidebar, navbar, contenido y footer', () => {
      render(
        <AppShell
          logo={<span data-testid="app-logo">LogoTest</span>}
          navbar={<button data-testid="nav-profile">Mi Perfil</button>}
          sidebar={<nav data-testid="side-nav">Menú lateral</nav>}
          footer={<span data-testid="app-footer">© 2026 FaruTech</span>}
        >
          <div data-testid="page-content">Contenido de la vista</div>
        </AppShell>
      )

      expect(screen.getByTestId('app-logo')).toBeInTheDocument()
      expect(screen.getByTestId('nav-profile')).toBeInTheDocument()
      expect(screen.getAllByTestId('side-nav').length).toBeGreaterThan(0)
      expect(screen.getByTestId('page-content')).toBeInTheDocument()
      expect(screen.getByTestId('app-footer')).toBeInTheDocument()
    })
  })

  describe('BulkActionsBar', () => {
    it('no debe renderizar nada si selectedCount es 0', () => {
      const { container } = render(
        <BulkActionsBar selectedCount={0} onClearSelection={vi.fn()} />
      )
      expect(container.firstChild).toBeNull()
    })

    it('debe mostrar contador y ejecutar acciones masivas cuando selectedCount > 0', async () => {
      const user = userEvent.setup()
      const onExport = vi.fn()
      const onClear = vi.fn()

      render(
        <BulkActionsBar
          selectedCount={5}
          onClearSelection={onClear}
          actions={[
            { id: 'export', label: 'Exportar Lote', onClick: onExport },
          ]}
        />
      )

      expect(screen.getByText('5 seleccionados')).toBeInTheDocument()

      const exportBtn = screen.getByText('Exportar Lote')
      await user.click(exportBtn)
      expect(onExport).toHaveBeenCalledTimes(1)

      const clearBtn = screen.getByText('Deseleccionar')
      await user.click(clearBtn)
      expect(onClear).toHaveBeenCalledTimes(1)
    })
  })

  describe('LoginPage (Patrón Enterprise)', () => {
    it('debe manejar autenticación con validación y estados asíncronos', async () => {
      const user = userEvent.setup()
      const onLogin = vi.fn(async ({ email: _email, password }) => {
        if (password !== 'correcta') {
          throw new Error('Credenciales inválidas')
        }
      })

      render(
        <LoginPage
          title="Iniciar Sesión ERP"
          onLogin={onLogin}
          providers={['google', 'microsoft']}
        />
      )

      expect(screen.getByText('Iniciar Sesión ERP')).toBeInTheDocument()
      expect(screen.getByText('google')).toBeInTheDocument()
      expect(screen.getByText('microsoft')).toBeInTheDocument()

      const emailInput = screen.getByPlaceholderText('usuario@empresa.com')
      const passwordInput = screen.getByPlaceholderText('••••••••')
      const submitBtn = screen.getByRole('button', { name: /Ingresar al Sistema/i })

      // Intento con clave incorrecta
      await user.type(emailInput, 'admin@farutech.com')
      await user.type(passwordInput, 'incorrecta')
      await user.click(submitBtn)

      expect(onLogin).toHaveBeenCalledWith({
        email: 'admin@farutech.com',
        password: 'incorrecta',
        remember: false,
      })

      expect(await screen.findByText('Credenciales inválidas')).toBeInTheDocument()
    })
  })
})
