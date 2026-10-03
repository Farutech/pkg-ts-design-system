import type { Meta, StoryObj } from '@storybook/react-vite'
import { Form, FormRow, FormGroup, Input, Button, Select, Checkbox } from '@/components/ui'
import { useForm } from '@/hooks/useForm'
import { useState } from 'react'

/**
 * Form — sistema de formularios con grid responsivo.
 *
 * Combina Form, FormRow, FormGroup con los inputs del sistema.
 * Soporta validación con useForm hook y envío asíncrono.
 */
function FormDemo() {
  const { values, errors, handleChange, handleBlur, handleSubmit, isSubmitting } = useForm({
    initialValues: {
      name: '',
      email: '',
      country: '',
      acceptTerms: false,
    },
    onSubmit: async (data) => {
      const newErrors: Record<string, string> = {}
      if (!data.name.trim()) newErrors.name = 'El nombre es requerido'
      if (!data.email.trim()) newErrors.email = 'El email es requerido'
      else if (!/\S+@\S+\.\S+/.test(data.email)) newErrors.email = 'El email no es válido'
      if (!data.country) newErrors.country = 'Selecciona un país'
      if (!data.acceptTerms) newErrors.acceptTerms = 'Debes aceptar los términos'

      if (Object.keys(newErrors).length > 0) {
        setFormErrors(newErrors)
        return
      }

      setFormErrors({})
      setSubmitted(true)
      await new Promise(r => setTimeout(r, 1500))
      setSubmitted(false)
    },
  })

  const [submitted, setSubmitted] = useState(false)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  return (
    <div style={{ width: '480px' }}>
      <Form
        onSubmit={(event) => {
          event.preventDefault()
          void handleSubmit(event)
        }}
      >
        <FormRow>
          <FormGroup cols={{ default: 12, md: 6 }}>
            <Input
              label="Nombre completo"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Ej. María García"
              error={formErrors.name || errors.name}
            />
          </FormGroup>
          <FormGroup cols={{ default: 12, md: 6 }}>
            <Input
              label="Correo electrónico"
              type="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="maria@empresa.com"
              error={formErrors.email || errors.email}
            />
          </FormGroup>
        </FormRow>

        <FormRow>
          <FormGroup cols={{ default: 12, md: 6 }}>
            <Select
              label="País de residencia"
              value={values.country}
              onChange={(val: any) => handleChange({ target: { name: 'country', value: typeof val === 'string' ? val : val?.target?.value } } as any)}
              options={[
                { value: '', label: 'Selecciona un país' },
                { value: 'co', label: 'Colombia' },
                { value: 'mx', label: 'México' },
                { value: 'es', label: 'España' },
              ]}
              error={formErrors.country || errors.country}
            />
          </FormGroup>
          <FormGroup cols={{ default: 12, md: 6 }}>
            <Checkbox
              label="Acepto los términos y condiciones"
              checked={values.acceptTerms}
              onChange={handleChange}
              error={formErrors.acceptTerms}
            />
          </FormGroup>
        </FormRow>

        <FormRow>
          <FormGroup cols={{ default: 12 }}>
            <Button type="submit" fullWidth disabled={isSubmitting}>
              {isSubmitting ? 'Enviando...' : 'Enviar formulario'}
            </Button>
          </FormGroup>
        </FormRow>
      </Form>

      {submitted && (
        <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--ft-color-success-soft)', borderRadius: '0.5rem', border: '1px solid var(--ft-color-success)', color: 'var(--ft-color-success)', fontSize: '0.875rem' }}>
          ✓ Formulario enviado correctamente
        </div>
      )}
    </div>
  )
}

const meta = {
  title: '10-Helpers/Form',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Sistema de formularios con Form, FormRow y FormGroup. Grid responsivo estilo Bootstrap + validación personalizada.',
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const FormularioConValidation: Story = {
  render: () => <FormDemo />,
}
