/**
 * ThemeToggle — alterna claro/oscuro usando el themeStore del Design System
 * (aplica data-theme + clase dark en <html>).
 */
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline'
import { useThemeStore } from '@/store/themeStore'
import { IconButton } from './IconButton'
import { cn } from '@/utils/cn'

export interface ThemeToggleProps {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'ghost' | 'outline' | 'solid'
  className?: string
}

export function ThemeToggle({ size = 'md', variant = 'ghost', className }: ThemeToggleProps) {
  const { theme, toggleTheme } = useThemeStore()
  const isDark = theme === 'dark'

  return (
    <IconButton
      icon={isDark ? <SunIcon aria-hidden="true" /> : <MoonIcon aria-hidden="true" />}
      variant={variant}
      size={size}
      aria-label={isDark ? 'Activar tema claro' : 'Activar tema oscuro'}
      aria-pressed={isDark}
      onClick={toggleTheme}
      className={cn(className)}
    />
  )
}
