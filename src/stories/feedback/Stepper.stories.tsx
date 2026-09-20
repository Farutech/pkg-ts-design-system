import type { Meta, StoryObj } from '@storybook/react-vite'
import { Stepper } from '@/components/ui/Stepper'
import { useState } from 'react'

/**
 * Stepper — navegación por pasos secuenciales.
 *
 * Soporta orientación horizontal/vertical, pasos clickeables (con allowClickAhead),
 * pasos en estado de error, y callback onStepClick.
 */
function StepperDemo() {
  const [currentStep, setCurrentStep] = useState(1)

  const steps = [
    { label: 'Datos personales', title: 'Datos personales', description: 'Nombre, email, teléfono' },
    { label: 'Credenciales', title: 'Credenciales', description: 'Correo y contraseña' },
    { label: 'Confirmación', title: 'Confirmación', description: 'Revisa tu información' },
    { label: 'Completado', title: 'Completado', description: 'Cuenta creada exitosamente' },
  ]

  const handleStepClick = (index: number) => {
    if (index <= currentStep) setCurrentStep(index)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem', maxWidth: '600px' }}>
      <Stepper
        steps={steps}
        currentStep={currentStep}
        onStepClick={handleStepClick}
        orientation="horizontal"
        allowClickAhead
        errorSteps={[]}
      />

      <div style={{
        padding: '2rem',
        background: 'var(--ft-color-surface)',
        border: '1px solid var(--ft-color-border)',
        borderRadius: '0.75rem',
        width: '400px',
        textAlign: 'center',
        minHeight: '120px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: '0.5rem',
      }}>
        <p style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600 }}>Paso {currentStep}: {steps[currentStep - 1].title}</p>
        <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--ft-color-muted-foreground)' }}>{steps[currentStep - 1].description}</p>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem' }}>
        {currentStep > 1 && (
          <button
            onClick={() => setCurrentStep(currentStep - 1)}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            Anterior
          </button>
        )}
        {currentStep < steps.length && (
          <button
            onClick={() => setCurrentStep(currentStep + 1)}
            className="px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700"
          >
            Siguiente
          </button>
        )}
        {currentStep === steps.length && (
          <button
            onClick={() => setCurrentStep(1)}
            className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700"
          >
            Reiniciar
          </button>
        )}
      </div>
    </div>
  )
}

const meta = {
  title: '6-Feedback/Stepper',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Navegación por pasos secuenciales con orientación horizontal/vertical, pasos clickeables y estados de error.',
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const HorizontalInteractivo: Story = {
  render: () => <StepperDemo />,
}

export const Vertical: Story = {
  name: 'Orientación vertical',
  render: () => {
    const [step, setStep] = useState(1)
    const steps = [
      { label: 'Información básica', title: 'Información básica', icon: null },
      { label: 'Datos de contacto', title: 'Datos de contacto', icon: null },
      { label: 'Configuración adicional', title: 'Configuración adicional', icon: null },
      { label: 'Finalizar', title: 'Finalizar', icon: null },
    ]

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '360px' }}>
        <Stepper steps={steps} currentStep={step} onStepClick={idx => setStep(idx)} orientation="vertical" allowClickAhead />
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={() => step > 1 && setStep(step - 1)} className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium">
            Anterior
          </button>
          {step < steps.length && (
            <button onClick={() => setStep(step + 1)} className="px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700">
              Siguiente
            </button>
          )}
        </div>
      </div>
    )
  },
}
