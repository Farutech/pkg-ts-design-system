// Suppress Node DEP0205 emitted by Storybook internal module.register() in Node 22+
const _emitWarning = process.emitWarning
process.emitWarning = function (warning: any, ...args: any[]) {
  if (
    (typeof warning === 'string' && (warning.includes('DEP0205') || warning.includes('module.register()'))) ||
    (typeof warning === 'object' && warning?.code === 'DEP0205')
  ) {
    return
  }
  return Reflect.apply(_emitWarning, process, [warning, ...args])
}

import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'

/**
 * Configuración de pruebas unitarias / integración (jsdom) + Storybook Component Tests.
 * - `npm run test`           -> pruebas de componentes con Storybook
 * - `npm run test:unit`      -> pruebas unitarias de stores y hooks
 * - `npm run test:coverage`  -> con reporte y umbrales de cobertura
 */
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
      'use-sync-external-store/shim/with-selector.js': path.resolve(import.meta.dirname, './src/shims/use-sync-external-store-with-selector.ts'),
      'use-sync-external-store/shim/with-selector': path.resolve(import.meta.dirname, './src/shims/use-sync-external-store-with-selector.ts'),
      'use-sync-external-store/with-selector.js': path.resolve(import.meta.dirname, './src/shims/use-sync-external-store-with-selector.ts'),
      'use-sync-external-store/with-selector': path.resolve(import.meta.dirname, './src/shims/use-sync-external-store-with-selector.ts'),
      'use-sync-external-store/shim/index.js': path.resolve(import.meta.dirname, './src/shims/use-sync-external-store.ts'),
      'use-sync-external-store/shim': path.resolve(import.meta.dirname, './src/shims/use-sync-external-store.ts'),
      'use-sync-external-store': path.resolve(import.meta.dirname, './src/shims/use-sync-external-store.ts'),
    },
  },
  test: {
    projects: [
      {
        test: {
          name: 'unit',
          globals: true,
          environment: 'jsdom',
          setupFiles: ['./src/test-setup.ts'],
          css: false,
          include: ['src/**/*.{test,spec}.{ts,tsx}'],
          restoreMocks: true,
        },
      },
      {
        extends: true,
        plugins: [
          storybookTest({ configDir: path.join(import.meta.dirname, '.storybook') }),
        ],
        test: {
          name: 'storybook',
          globals: true,
          environment: 'jsdom',
          setupFiles: ['./src/test-setup.ts'],
          isolate: false,
          testTimeout: 20000,
        },
      },
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary', 'html'],
      reportsDirectory: './coverage',
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.test.{ts,tsx}',
        'src/**/__tests__/**',
        'src/**/*.stories.{ts,tsx}',
        'src/test-setup.ts',
        'src/docs/**',
        'src/shims/**',
        'src/index.ts',
        'src/**/index.ts',
        'src/**/*.d.ts',
      ],
      thresholds: {
        lines: 60,
        functions: 60,
        statements: 60,
        branches: 55,
      },
    },
  },
})
