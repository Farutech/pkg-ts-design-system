import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { LoginCard } from '@/auth-screens/LoginCard'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'

const meta: Meta<typeof LoginCard> = {
  title: 'Auth/LoginCard (Modular & Turnkey)',
  component: LoginCard,
  parameters: {
    docs: {
      description: {
        component: 'Componente modular compuesto de autenticación. Gestiona automáticamente tokenStorage (localStorage, sessionStorage) y soporta inyección de acciones personalizadas o embedding en modales.',
      },
    },
  },
}
export default meta

export const Standalone: StoryObj<typeof LoginCard> = {
  render: () => (
    <div className="flex justify-center p-8 bg-gray-50 dark:bg-gray-950 min-h-[500px]">
      <LoginCard
        title="Ordeon Operaciones"
        subtitle="Acceso al sistema de gestión y manufactura"
        onSubmit={async ({ email, password: _password }) => {
          await new Promise((r) => setTimeout(r, 800))
          return { token: 'mock-jwt-token-12345', user: { email, role: 'operario' } }
        }}
        onTokenReceived={(token) => {
          console.log('Token guardado automáticamente:', token)
        }}
        onForgotPassword={() => alert('Abriendo recuperación de contraseña')}
        onRegister={() => alert('Abriendo registro')}
        customAction={{
          label: 'Ingreso Rápido con Huella / Carnet',
          onClick: () => alert('Disparando lectura NFC / Carnet...'),
        }}
      />
    </div>
  ),
}

export const InsideModal: StoryObj = {
  render: () => {
    const [open, setOpen] = useState(false)
    return (
      <div className="p-8 text-center">
        <Button variant="primary" onClick={() => setOpen(true)}>
          Abrir Modal de Autenticación
        </Button>

        <Modal isOpen={open} onClose={() => setOpen(false)} title="">
          <div className="p-2">
            <LoginCard
              className="border-none shadow-none p-0 max-w-none"
              title="Sesión Expirada"
              subtitle="Por tu seguridad, confirma tus credenciales para continuar"
              onSubmit={async () => {
                await new Promise((r) => setTimeout(r, 600))
                setOpen(false)
              }}
            />
          </div>
        </Modal>
      </div>
    )
  },
}
