import React, { useEffect } from 'react'
import type { Decorator, Preview } from '@storybook/react'
import { withThemeByDataAttribute } from '@storybook/addon-themes'
import { MemoryRouter } from 'react-router-dom'

import '@/styles.css'
import { DesignSystemProvider } from '@/providers/DesignSystemProvider'

/**
 * Decorador raíz: MemoryRouter + DesignSystemProvider + fondo del canvas acorde al tema.
 * Así cada story se ve exactamente como se verá en las apps consumidoras sin fallar por hooks de router.
 */
const withDesignSystem: Decorator = (Story, context) => {
  const colorMode = context.globals.theme === 'dark' ? 'dark' : 'light'
  const isFullscreen = context.parameters.layout === 'fullscreen'
  const isDocs = context.viewMode === 'docs'

  useEffect(() => {
    document.documentElement.style.colorScheme = colorMode
  }, [colorMode])

  return (
    <MemoryRouter initialEntries={['/dashboard']}>
      <DesignSystemProvider colorMode={colorMode}>
        <div
          style={{
            minHeight: !isDocs && isFullscreen ? '100vh' : 'auto',
            padding: isFullscreen ? 0 : isDocs ? '1rem' : '1.5rem',
            background: 'var(--ft-color-background)',
            color: 'var(--ft-color-foreground)',
            fontFamily: 'var(--ft-font-sans)',
            boxSizing: 'border-box',
            width: '100%',
            display: isFullscreen ? 'block' : 'flex',
            justifyContent: isFullscreen ? 'normal' : 'center',
            alignItems: isFullscreen ? 'normal' : 'center',
            transition: 'background-color .2s ease, color .2s ease',
          }}
        >
          <Story />
        </div>
      </DesignSystemProvider>
    </MemoryRouter>
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
    docs: {
      story: {
        inline: true,
        height: 'auto',
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
      expanded: true,
    },
    viewport: {
      viewports: {
        mobileSmall: {
          name: 'Mobile (Small - 375px)',
          styles: { width: '375px', height: '667px' },
        },
        mobileLarge: {
          name: 'Mobile (Large - 414px)',
          styles: { width: '414px', height: '896px' },
        },
        tablet: {
          name: 'Tablet (iPad - 768px)',
          styles: { width: '768px', height: '1024px' },
        },
        laptop: {
          name: 'Laptop (1280px)',
          styles: { width: '1280px', height: '800px' },
        },
        desktop: {
          name: 'Desktop (1440px)',
          styles: { width: '1440px', height: '900px' },
        },
      },
    },
    a11y: {
      test: 'todo',
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
