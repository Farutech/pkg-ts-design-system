import type { Meta, StoryObj } from '@storybook/react-vite'
import { Carousel } from '@/components/ui/Carousel'

/**
 * Carousel — slider de slides con controles, indicadores y autoplay.
 *
 * Soporta autoplay con intervalo configurable, controles custom,
 * indicadores de posición, variantes de controles (default, arrows, minimal)
 * y bordes estilos.
 */
const SLIDES = [
  {
    title: 'Bienvenido a Farutech',
    description: 'Sistema de diseño profesional para aplicaciones modernas.',
    bg: 'from-primary-600 to-primary-800',
    icon: '⭐',
  },
  {
    title: 'Componentes accesibles',
    description: ' Todos nuestros componentes siguen WCAG 2.1 AA.',
    bg: 'from-success to-teal-600',
    icon: '♿',
  },
  {
    title: 'Personalizable sin fork',
    description: 'Cambia tokens, colores y radios sin modificar el código fuente.',
    bg: 'from-warning to-orange-500',
    icon: '🎨',
  },
]

function CarouselDemo({ autoPlay = false }: { autoPlay?: boolean }) {
  return (
    <Carousel
      className="w-[500px]"
      height="h-[280px]"
      autoPlay={autoPlay}
      interval={3000}
      showControls
      showIndicators
      controlsVariant="arrows"
    >
      {SLIDES.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 flex items-center justify-center p-8 bg-gradient-to-br ${slide.bg} text-white`}
          style={{ borderRadius: '0.75rem' }}
        >
          <div style={{ textAlign: 'center', maxWidth: '320px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{slide.icon}</div>
            <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.25rem', fontWeight: 700 }}>{slide.title}</h3>
            <p style={{ margin: 0, fontSize: '0.875rem', opacity: 0.85, lineHeight: 1.5 }}>{slide.description}</p>
          </div>
        </div>
      ))}
    </Carousel>
  )
}

const meta = {
  title: '5-Data Display/Carousel',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Slider de slides con controles, indicadores, autoplay y bordes estilos. Controles en 3 variantes: arrows, default y minimal.',
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const ConControles: Story = {
  render: () => <CarouselDemo />,
}

export const ConAutoplay: Story = {
  name: 'Con autoplay',
  parameters: {
    docs: {
      description: {
        story: 'El carousel avanza automáticamente cada 3 segundos. El intervalo es configurable.',
      },
    },
  },
  render: () => <CarouselDemo autoPlay />,
}

export const SinIndicadores: Story = {
  name: 'Sin indicadores',
  render: () => (
    <Carousel
      className="w-[500px]"
      height="h-[280px]"
      autoPlay
      interval={4000}
      showControls
      showIndicators={false}
      controlsVariant="minimal"
    >
      {SLIDES.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 flex items-center justify-center p-8 bg-gradient-to-br ${slide.bg} text-white`}
          style={{ borderRadius: '0.75rem' }}
        >
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>{slide.icon}</div>
            <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.125rem', fontWeight: 700 }}>{slide.title}</h3>
            <p style={{ margin: 0, fontSize: '0.8125rem', opacity: 0.85 }}>{slide.description}</p>
          </div>
        </div>
      ))}
    </Carousel>
  ),
}
