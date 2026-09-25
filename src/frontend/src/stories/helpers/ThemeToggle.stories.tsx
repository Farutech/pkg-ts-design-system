import type { Meta, StoryObj } from '@storybook/react-vite'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { useThemeStore } from '@/store/themeStore'

/**
 * ThemeToggle — botón para alternar tema claro/oscuro.
 *
 * Usa useThemeStore internamente. Soporta 3 tamaños (sm, md, lg)
 * y 3 variantes (ghost, outline, solid).
 */
function ThemeToggleDemo() {
  const { theme } = useThemeStore()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '400px' }}>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
        <ThemeToggle size="sm" variant="ghost" />
        <ThemeToggle size="md" variant="ghost" />
        <ThemeToggle size="lg" variant="ghost" />
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
        <ThemeToggle size="md" variant="outline" />
        <ThemeToggle size="md" variant="solid" />
      </div>

      <div style={{ textAlign: 'center', padding: '1rem', background: 'var(--ft-color-surface)', borderRadius: '0.5rem', border: '1px solid var(--ft-color-border)' }}>
        <p style={{ margin: '0 0 0.25rem', fontSize: '0.875rem', fontWeight: 600 }}>
          Tema actual: <span style={{ color: 'var(--ft-color-primary)', fontFamily: 'monospace' }}>{theme}</span>
        </p>
        <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--ft-color-muted-foreground)' }}>
          Haz clic en cualquier ThemeToggle para alternar.
        </p>
      </div>
    </div>
  )
}

const meta = {
  title: '10-Helpers/ThemeToggle',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Botón para alternar tema claro/oscuro usando useThemeStore. 3 tamaños y 3 variantes.',
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const AlternarTema: Story = {
  render: () => <ThemeToggleDemo />,
}
