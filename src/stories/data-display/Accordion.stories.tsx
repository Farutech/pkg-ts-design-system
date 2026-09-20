import type { Meta, StoryObj } from '@storybook/react-vite'
import { Accordion, AccordionItem } from '@/components/ui/Accordion'

/**
 * Accordion — lista de items expandibles/colapsables.
 *
 * Cada AccordionItem tiene título, contenido y estado por defecto.
 * La variante de Accordion controla la separación entre items.
 */
function FAQAccordion() {
  return (
    <div style={{ width: '560px' }}>
      <h3 style={{ margin: '0 0 1rem', fontSize: '1rem', fontWeight: 600, color: 'var(--ft-color-foreground)' }}>
        Preguntas frecuentes
      </h3>
      <Accordion>
        <AccordionItem title="¿Cómo inicio sesión?">
          <p style={{ margin: 0, color: 'var(--ft-color-muted-foreground)', fontSize: '0.875rem' }}>
            Ingresa tu correo electrónico y contraseña en el formulario de la página de login.
            Si no tienes cuenta, puedes registrarte usando el enlace "Regístrate aquí".
          </p>
        </AccordionItem>
        <AccordionItem title="¿Cómo restablezco mi contraseña?">
          <p style={{ margin: 0, color: 'var(--ft-color-muted-foreground)', fontSize: '0.875rem' }}>
            Haz clic en "¿Olvidaste tu contraseña?" en el formulario de login. Te enviaremos
            un enlace de recuperación a tu correo electrónico registrado.
          </p>
        </AccordionItem>
        <AccordionItem title="¿Qué planes tienes disponibles?">
          <p style={{ margin: 0, color: 'var(--ft-color-muted-foreground)', fontSize: '0.875rem' }}>
            Ofrecemos tres planes: Gratis (funciones básicas), Pro (todas las funciones para
            equipos) y Enterprise (solución a medida con soporte dedicado).
          </p>
        </AccordionItem>
        <AccordionItem title="¿Cómo contacto a soporte?">
          <p style={{ margin: 0, color: 'var(--ft-color-muted-foreground)', fontSize: '0.875rem' }}>
            El soporte está disponible por correo a soporte@farutech.com o por chat
            en el panel de ayuda dentro de la aplicación.
          </p>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

const meta = {
  title: '5-Data Display/Accordion',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Lista de items expandibles/colapsables. Cada item tiene título, contenido y estado por defecto. 2 variantes: separated y flush.',
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const FAQ: Story = {
  render: () => <FAQAccordion />,
}

export const ConItemPorDefectoAbierto: Story = {
  name: 'Con item abierto por defecto',
  render: () => (
    <div style={{ width: '480px' }}>
      <Accordion>
        <AccordionItem title="Panel de administración" defaultOpen>
          <p style={{ margin: 0, color: 'var(--ft-color-muted-foreground)', fontSize: '0.875rem' }}>
            El panel de administración permite gestionar usuarios, configurar módulos,
            ver reportes y administrar el sistema completo.
          </p>
        </AccordionItem>
        <AccordionItem title="Panel de usuario">
          <p style={{ margin: 0, color: 'var(--ft-color-muted-foreground)', fontSize: '0.875rem' }}>
            El panel de usuario permite ver su perfil, cambiar contraseña, configurar
            notificaciones y gestionar sus preferencias.
          </p>
        </AccordionItem>
        <AccordionItem title="Panel de invitado">
          <p style={{ margin: 0, color: 'var(--ft-color-muted-foreground)', fontSize: '0.875rem' }}>
            Los invitados pueden ver contenido público sin necesidad de iniciar sesión.
          </p>
        </AccordionItem>
      </Accordion>
    </div>
  ),
}

export const VarianteFlush: Story = {
  name: 'Variante flush (separación mínima)',
  render: () => (
    <div style={{ width: '480px' }}>
      <Accordion variant="flush">
        <AccordionItem title="Sección A" defaultOpen>
          <p style={{ margin: 0, color: 'var(--ft-color-muted-foreground)', fontSize: '0.875rem' }}>Contenido de la sección A</p>
        </AccordionItem>
        <AccordionItem title="Sección B">
          <p style={{ margin: 0, color: 'var(--ft-color-muted-foreground)', fontSize: '0.875rem' }}>Contenido de la sección B</p>
        </AccordionItem>
        <AccordionItem title="Sección C">
          <p style={{ margin: 0, color: 'var(--ft-color-muted-foreground)', fontSize: '0.875rem' }}>Contenido de la sección C</p>
        </AccordionItem>
      </Accordion>
    </div>
  ),
}
