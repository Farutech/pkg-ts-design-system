import type { Meta, StoryObj } from '@storybook/react-vite'
import { useThemeStore } from '@/store/themeStore'
import { Button } from '@/components/ui/Button'

/**
 * useThemeStore — demo interactivo del store de tema.
 *
 * Muestra cómo usar setTheme, toggleTheme y leer el tema actual
 * desde el store zustand de forma reactiva.
 */
function UseThemeStoreDemo() {
  const { theme, setTheme, toggleTheme } = useThemeStore()

  const setRandomTheme = () => {
    const themes: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system']
    const random = themes[Math.floor(Math.random() * themes.length)]
    setTheme(random)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '400px' }}>
      <div style={{
        padding: '1.25rem',
        background: 'var(--ft-color-surface)',
        border: '1px solid var(--ft-color-border)',
        borderRadius: '0.75rem',
      }}>
        <p style={{ margin: '0 0 0.25rem', fontSize: '0.875rem', fontWeight: 600 }}>Tema actual</p>
        <p style={{ margin: '0 0 1rem', fontSize: '1.5rem', fontWeight: 700, color: 'var(--ft-color-primary)', fontFamily: 'monospace' }}>
          {theme}
        </p>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {(['light', 'dark', 'system'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${theme === t ? 'bg-primary-600 text-white border-primary-600' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <Button variant="outline" size="sm" onClick={toggleTheme}>
          🔄 Alternar tema
        </Button>
        <Button size="sm" onClick={setRandomTheme}>
          🎲 Tema aleatorio
        </Button>
      </div>

      <div style={{ padding: '0.75rem', background: 'var(--ft-color-background)', border: '1px dashed var(--ft-color-border)', borderRadius: '0.5rem' }}>
        <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--ft-color-muted-foreground)' }}>
          💡 El tema se lee desde <code>useThemeStore()</code>. Los componentes que dependen de él (ThemeToggle, Modal, etc.) reaccionan automáticamente a los cambios.
        </p>
      </div>
    </div>
  )
}

const meta = {
  title: '9-Hooks & Stores/useThemeStore',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Demostración interactiva del store useThemeStore (zustand). Alterna entre light, dark y system.',
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Interactivo: Story = {
  render: () => <UseThemeStoreDemo />,
}
