import { addons } from 'storybook/manager-api'
import { themes } from 'storybook/theming'

/**
 * Branding del gestor de Storybook para todo el equipo FaruTech.
 */
addons.setConfig({
  theme: {
    ...themes.light,
    brandTitle: 'FaruTech Design System',
    brandUrl: 'https://github.com/Farutech/pkg-ts-design-system',
    brandImage: './Logo.png',
  },
})

// Título de la pestaña del navegador.
document.title = 'FaruTech Design System — Storybook'
