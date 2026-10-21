import type { Meta } from '@storybook/react-vite'
import { FormField } from '@/components/ui/FormField'
import { Input } from '@/components/ui/Input'

/**
 * FormField — wrapper para fields de formulario con label, hint y error.
 *
 * Provee accesibilidad automática (htmlFor, aria-describedby, aria-invalid)
 * y soporte para label position (top o left).
 */
const meta = {
  title: '10-Helpers/FormField',
  component: FormField,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text', description: 'Etiqueta del campo' },
    hint: { control: 'text', description: 'Texto de ayuda debajo del campo' },
    error: { control: 'text', description: 'Mensaje de error de validación' },
    required: { control: 'boolean', description: 'Marcar como campo obligatorio' },
    labelPosition: {
      control: 'select',
      options: ['top', 'left'],
      description: 'Posición de la etiqueta',
    },
    className: { control: 'text', description: 'Clases CSS adicionales' },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Wrapper para fields de formulario con label, hint, error y accesibilidad automática (htmlFor, aria-describedby).',
      },
    },
  },
} satisfies Meta

export default meta

export const LabelEncima = {
  render: () => (
    <div style={{ width: '360px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <FormField label="Email" required hint="Ingresa tu correo electrónico" error="El formato del email es inválido">
        {({ id, describedBy, invalid }) => (
          <Input id={id} aria-describedby={describedBy} aria-invalid={invalid} label="" placeholder="tu@email.com" type="email" />
        )}
      </FormField>
      <FormField label="Contraseña" required>
        {({ id, describedBy }) => (
          <Input id={id} aria-describedby={describedBy} label="" placeholder="••••••••" type="password" />
        )}
      </FormField>
      <FormField label="Confirmar contraseña" required hint="Debe coincidir con la contraseña anterior" error="Las contraseñas no coinciden">
        {({ id, describedBy, invalid }) => (
          <Input id={id} aria-describedby={describedBy} aria-invalid={invalid} label="" placeholder="••••••••" type="password" />
        )}
      </FormField>
    </div>
  ),
}

export const LabelAlLado = {
  name: 'Label al lado (labelPosition: left)',
  render: () => (
    <div style={{ width: '500px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <FormField label="Nombre" labelPosition="left" required>
        {({ id, describedBy }) => (
          <Input id={id} aria-describedby={describedBy} label="" placeholder="María García" />
        )}
      </FormField>
      <FormField label="Email" labelPosition="left">
        {({ id, describedBy }) => (
          <Input id={id} aria-describedby={describedBy} label="" placeholder="tu@email.com" />
        )}
      </FormField>
      <FormField label="Puesto" labelPosition="left" hint="Opcional">
        {({ id, describedBy }) => (
          <Input id={id} aria-describedby={describedBy} label="" placeholder="Desarrollador Frontend" />
        )}
      </FormField>
    </div>
  ),
}
