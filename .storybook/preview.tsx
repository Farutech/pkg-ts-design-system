import React, { useEffect } from 'react'
import type { Decorator, Preview } from '@storybook/react'
import { withThemeByDataAttribute } from '@storybook/addon-themes'

import '@/styles.css'
import { DesignSystemProvider } from '@/providers/DesignSystemProvider'

/**
 * Decorador raíz: DesignSystemProvider + fondo del canvas acorde al tema.
 * Así cada story se ve exactamente como se verá en las apps consumidoras.
 * El modo (light/dark) llega del toolbar de `@storybook/addon-themes`
 * (global `theme` → data-theme, el mismo atributo que consumen los tokens).
 *
 * Para stories con layout: 'fullscreen', el padding se elimina automáticamente.
 */
const withDesignSystem: Decorator = (Story, context) => {
  const colorMode = context.globals.theme === 'dark' ? 'dark' : 'light'
  const isFullscreen = context.parameters.layout === 'fullscreen'

  useEffect(() => {
    document.documentElement.style.colorScheme = colorMode
  }, [colorMode])

  return (
    <DesignSystemProvider colorMode={colorMode}>
      <div
        style={{
          minHeight: '100vh',
          padding: isFullscreen ? 0 : '2rem',
          background: 'var(--ft-color-background)',
          color: 'var(--ft-color-foreground)',
          fontFamily: 'var(--ft-font-sans)',
          transition: 'background-color .2s ease, color .2s ease',
        }}
      >
        <Story />
      </div>
    </DesignSystemProvider>
  )
}

/** Decorador de tema: alterna data-theme en <html> desde el toolbar. */
const withDataTheme = withThemeByDataAttribute({
  themes: {
    light: 'light',
    dark: 'dark',
  },
  defaultTheme: 'light',
  attributeName: 'data-theme',
})

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
      expanded: true,
    },
    layout: 'centered',
    backgrounds: { disable: true },
    options: {
      storySort: {
        order: [
          'Guía',
          ['Introducción', 'Instalación', 'Tokens', 'Theming', 'Migración'],
          '1-Foundations',
          ['Colors', 'Typography', 'Spacing', 'Shadows', 'Icons'],
          '2-Layout',
          ['MainLayout', 'Sidebar', 'Navbar', 'PageTransition'],
          '3-Navigation',
          ['TopNav', 'Breadcrumb', 'Tabs'],
          '4-Inputs',
          [
            'Button', 'Input', 'Textarea', 'Select', 'Checkbox',
            'RadioGroup', 'Switch', 'Slider', 'DatePicker', 'DateControls',
            'MaskedInput', 'PhoneInput', 'OTPInput', 'TagInput',
            'ImageUpload', 'SegmentedControl', 'Rating',
          ],
          '5-Data Display',
          [
            'Badge', 'Chip', 'Avatar', 'DataTable', 'Table', 'Charts',
            'StatsCard', 'Timeline', 'Skeleton', 'ListBox', 'ListGroup',
            'Accordion', 'Carousel', 'ProgressBar',
          ],
          '6-Feedback',
          ['Alert', 'Toast', 'Loading', 'EmptyState', 'GlobalLoading', 'Stepper', 'NotificationPanel'],
          '7-Overlays',
          ['Modal', 'Drawer', 'Popover', 'Tooltip', 'Dropdown', 'CommandPalette', 'FloatingActionButton'],
          '8-Auth',
          ['LoginScreen', 'RegisterScreen', 'ForgotPasswordScreen'],
          '9-Hooks & Stores',
          ['useToast', 'useThemeStore', 'useSidebarStore'],
          '10-Helpers',
          ['CodePreview', 'Divider', 'Link', 'IconButton', 'ThemeToggle', 'Form', 'ButtonGroup', 'Scheduler'],
          '11-Templates',
          ['Dashboard Admin', 'Dashboard Analytics', 'Landing Marketing', 'Landing App SaaS', 'CRUD Page'],
        ],
      },
    },
  },
  globalTypes: {
    locale: {
      description: 'Idioma de los textos de ejemplo',
      defaultValue: 'es',
      toolbar: {
        title: 'Idioma',
        icon: 'globe',
        items: [
          { value: 'es', title: 'Español' },
          { value: 'en', title: 'English' },
        ],
      },
    },
  },
  decorators: [withDataTheme, withDesignSystem],
  tags: ['autodocs'],
  initialGlobals: {
    theme: 'light',
    locale: 'es',
  },
}

export default preview
