import { useState, type ReactNode } from 'react'
import { cn } from '@/utils/cn'
import { Icon } from '@/primitives/Icon/Icon'
import { useBrandConfig } from '@/providers/DesignSystemProvider'

export interface BreadcrumbItem {
  label: string
  href?: string
}

export interface AppShellNavItem {
  id: string
  label: string
  href: string
  icon?: ReactNode
  active?: boolean
  badge?: string
}

export interface AppShellProps {
  /** Contenido principal de la aplicación */
  children: ReactNode
  /** Nombre de la aplicación (anula o complementa brandConfig) */
  appName?: string
  /** Slot para la barra de navegación lateral (Sidebar) */
  sidebar?: ReactNode
  /** Lista de enlaces de navegación si no se pasa slot sidebar completo */
  navigation?: AppShellNavItem[]
  /** Slot para la barra superior (Navbar) */
  navbar?: ReactNode
  /** Acciones adicionales en el Navbar derecho */
  navbarActions?: ReactNode
  /** Datos del usuario activo */
  user?: { name?: string; email?: string; role?: string; avatarUrl?: string }
  /** Logo personalizado */
  logo?: ReactNode
  /** Migas de pan de navegación (ReactNode o array de items) */
  breadcrumbs?: ReactNode | BreadcrumbItem[]
  /** Slot para el pie de página */
  footer?: ReactNode
  /** Si la barra lateral inicia colapsada */
  defaultSidebarCollapsed?: boolean
  className?: string
}

/**
 * AppShell:
 * Estructura de layout empresarial responsiva con Sidebar replegable,
 * Navbar superior, área de migas de pan y contenedor principal adaptable.
 */
export function AppShell({
  children,
  appName,
  sidebar,
  navigation = [],
  navbar,
  navbarActions,
  user,
  logo,
  breadcrumbs,
  footer,
  defaultSidebarCollapsed = false,
  className,
}: AppShellProps) {
  const brand = useBrandConfig()
  const effectiveAppName = appName || brand.appName || brand.brandName
  const [sidebarCollapsed, setSidebarCollapsed] = useState(defaultSidebarCollapsed)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Renderizador automático de navegación si se pasa la lista `navigation`
  const effectiveSidebar = sidebar ?? (navigation.length > 0 ? (
    <nav className="space-y-1">
      {navigation.map((item) => (
        <a
          key={item.id}
          href={item.href}
          className={cn(
            'flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors',
            item.active
              ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-semibold'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
          )}
        >
          {item.icon && <span className="shrink-0">{item.icon}</span>}
          {!sidebarCollapsed && <span className="truncate flex-1">{item.label}</span>}
          {!sidebarCollapsed && item.badge && (
            <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300">
              {item.badge}
            </span>
          )}
        </a>
      ))}
    </nav>
  ) : null)

  return (
    <div className={cn('min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100', className)}>
      {/* Navbar Superior */}
      <header className="h-14 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 flex items-center justify-between z-20 shrink-0">
        <div className="flex items-center gap-3">
          {/* Botón menú móvil */}
          {effectiveSidebar && (
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Abrir menú de navegación"
            >
              <Icon.Menu size="md" />
            </button>
          )}

          {/* Logo / Branding */}
          <div className="flex items-center gap-2">
            {logo ?? (brand.logoNode || (brand.logoUrl && <img src={brand.logoUrl} alt={effectiveAppName} className="h-7 w-auto" />))}
            <span className="font-bold text-base tracking-tight hidden sm:inline">
              {effectiveAppName}
            </span>
          </div>

          {/* Breadcrumbs en header si se proveen */}
          {breadcrumbs && (
            <div className="hidden lg:flex items-center ml-4 pl-4 border-l border-gray-200 dark:border-gray-800">
              {Array.isArray(breadcrumbs) ? (
                <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-gray-500">
                  {breadcrumbs.map((b, i) => (
                    <span key={i} className="flex items-center gap-1.5">
                      {i > 0 && <span className="text-gray-400">/</span>}
                      {b.href ? (
                        <a href={b.href} className="hover:text-gray-900 dark:hover:text-white transition-colors">
                          {b.label}
                        </a>
                      ) : (
                        <span className="font-medium text-gray-800 dark:text-gray-200">{b.label}</span>
                      )}
                    </span>
                  ))}
                </nav>
              ) : (
                breadcrumbs
              )}
            </div>
          )}
        </div>

        {/* Slot derecho de Navbar (Perfil, Búsqueda, Notificaciones) */}
        <div className="flex items-center gap-3">
          {navbar}
          {navbarActions}
          {user && (
            <div className="flex items-center gap-2 pl-2 border-l border-gray-200 dark:border-gray-800">
              <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-xs">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="hidden md:block text-left text-xs">
                <div className="font-medium text-gray-900 dark:text-white">{user.name}</div>
                <div className="text-gray-500 text-[10px]">{user.role || user.email}</div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Contenedor Medio: Sidebar + Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Desktop */}
        {effectiveSidebar && (
          <aside
            className={cn(
              'hidden md:flex flex-col border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 transition-all duration-300 select-none shrink-0',
              sidebarCollapsed ? 'w-16' : 'w-64'
            )}
          >
            <div className="flex-1 overflow-y-auto p-2">
              {effectiveSidebar}
            </div>

            {/* Botón toggle de colapso */}
            <div className="p-2 border-t border-gray-100 dark:border-gray-800 flex justify-end">
              <button
                type="button"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label={sidebarCollapsed ? 'Expandir barra lateral' : 'Colapsar barra lateral'}
              >
                <Icon.ChevronLeft
                  size="sm"
                  className={cn('transition-transform duration-200', sidebarCollapsed && 'rotate-180')}
                />
              </button>
            </div>
          </aside>
        )}

        {/* Sidebar Móvil (Drawer overlay) */}
        {effectiveSidebar && mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-gray-900 p-4 shadow-xl z-10">
              <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-800 mb-2">
                <span className="font-bold">{effectiveAppName}</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <Icon.Close size="sm" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                {effectiveSidebar}
              </div>
            </div>
          </div>
        )}

        {/* Área Principal de Contenido */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 flex flex-col">
          <div className="flex-1 w-full max-w-7xl mx-auto">
            {children}
          </div>

          {/* Footer opcional */}
          {footer && (
            <footer className="mt-auto pt-6 border-t border-gray-200 dark:border-gray-800 text-xs text-gray-400 text-center">
              {footer}
            </footer>
          )}
        </main>
      </div>
    </div>
  )
}
