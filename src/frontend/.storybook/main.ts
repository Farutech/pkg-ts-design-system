import type { StorybookConfig } from '@storybook/react-vite'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const config: StorybookConfig = {
  stories: [
    '../src/**/*.mdx',
    '../src/**/*.stories.tsx',
  ],

  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
    '@storybook/addon-themes',
    '@storybook/addon-links',
    '@storybook/addon-vitest',
  ],

  framework: {
    name: '@storybook/react-vite',
    options: {},
  },

  docs: {
    defaultName: 'Documentación',
  },

  staticDirs: ['../public'],

  /** Propaga el alias @/ de vite.config.ts al build de Storybook */
  viteFinal: async (config) => {
    config.resolve = config.resolve ?? {}
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
      '@': path.resolve(__dirname, '../src'),
      '@storybook/blocks': '@storybook/addon-docs/blocks',
    }
    config.build = {
      ...config.build,
      // Storybook's generated preview/runtime bundles are intentionally large;
      // application code is split through its own Vite build.
      chunkSizeWarningLimit: 1500,
    }
    config.server = config.server ?? {}
    config.server.watch = {
      ...(config.server.watch ?? {}),
      ignored: ['**/storybook-static/**', '**/dist/**'],
    }
    return config
  },
}

export default config
