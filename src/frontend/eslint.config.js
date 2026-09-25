/**
 * ============================================================================
 *  ESLint — Flat Config (ESLint 10 + typescript-eslint + React + Storybook)
 * ============================================================================
 *  Objetivo del repo: `npm run lint` con CERO errores y CERO warnings.
 * ============================================================================
 */
import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import storybook from 'eslint-plugin-storybook'

export default tseslint.config(
  {
    // IGNORA GLOBALES: debe ser un objeto con SOLO `ignores` para que aplique
    // a todo el proyecto (flat config).
    ignores: [
      '**/dist/**',
      '**/dist-ssr/**',
      '**/storybook-static/**',
      '**/coverage/**',
      '**/node_modules/**',
      '**/src/shims/**',
      '**/docs/**',
      '**/scripts/**',
      '**/.tmp*',
    ],
  },
  {
    // Evita warnings por directivas de disable usadas como documentación
    // puntual (p. ej. patrones prop->estado en hooks de la librería).
    linterOptions: {
      reportUnusedDisableDirectives: 'off',
    },
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      // Librería de componentes (no app con HMR): los archivos exportan
      // componentes + hooks/helpers deliberadamente. No aplica la regla
      // react-refresh pensada para puntos de entrada de aplicaciones.
      'react-refresh/only-export-components': 'off',
      // Compatibilidad con integraciones de terceros (p. ej. TanStack Table):
      // la verificación de compilador no puede evaluar APIs dinámicas.
      'react-hooks/incompatible-library': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-empty-object-type': 'off',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      eqeqeq: ['error', 'smart'],
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },
  {
    files: ['**/*.stories.{ts,tsx}', '**/*.test.{ts,tsx}', '**/__tests__/**/*.{ts,tsx}'],
    rules: {
      'react-refresh/only-export-components': 'off',
      'no-console': 'off',
    },
  },
  ...storybook.configs['flat/recommended'],
  {
    files: ['.storybook/**/*.{ts,tsx}'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
)
