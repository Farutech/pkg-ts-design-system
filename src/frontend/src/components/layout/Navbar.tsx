/**
 * Componente Navbar con breadcrumbs y notificaciones
 */

import { Menu, Transition } from '@headlessui/react'
import { Fragment, useEffect } from 'react'
import type { ReactNode } from 'react'
import {
  Bars3Icon,
  BellIcon,
  MoonIcon,
  SunIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  Cog6ToothIcon,
  UserIcon,
} from '@heroicons/react/24/outline'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useSidebarStore } from '@/store/sidebarStore'
import { useThemeStore } from '@/store/themeStore'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import type { BreadcrumbItem } from '@/components/ui/Breadcrumb'
import { cn } from '@/utils/cn'
import { useState } from 'react'
import { SearchModal } from './SearchModal'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { useBrandConfig } from '@/providers/DesignSystemProvider'

export interface NavbarNotification {
  id: string | number
  type: 'success' | 'warning' | 'info' | 'error' | string
  title: string
  message: string
  time: string
  read?: boolean
}

export interface NavbarUser {
  name: string
  email?: string
  avatarUrl?: string
  role?: string
}

export interface NavbarMenuItem {
  label: string
  href?: string
  icon?: React.ComponentType<{ className?: string }>
  onClick?: () => void
}

export interface NavbarProps {
  /** Nombre de la aplicación */
  appName?: string
  /** Breadcrumbs directos a renderizar */
  breadcrumbs?: BreadcrumbItem[]
  /** Mapa de rutas a breadcrumbs */
  breadcrumbMap?: Record<string, BreadcrumbItem[]>
  /** Usuario activo a mostrar en el menú */
  user?: NavbarUser
  /** Lista de notificaciones */
  notifications?: NavbarNotification[]
  /** Callback al hacer click en una notificación */
  onNotificationClick?: (notification: NavbarNotification) => void
  /** Callback al hacer click en ver todas */
  onViewAllNotifications?: () => void
  /** Callback de cierre de sesión */
  onLogout?: () => void
  /** Si debe mostrar el buscador modal (default: true) */
  showSearch?: boolean
  /** Si debe mostrar el toggle de tema claro/oscuro (default: true) */
  showThemeToggle?: boolean
  /** Si debe mostrar el botón y menú de notificaciones (default: true) */
  showNotifications?: boolean
  /** Si debe mostrar el menú de usuario (default: true) */
  showUserMenu?: boolean
  /** Items personalizados para el menú de usuario */
  userMenuItems?: NavbarMenuItem[]
  /** Acciones adicionales en la parte derecha */
  rightActions?: ReactNode
  /** Clases CSS adicionales */
  className?: string
}

// Breadcrumb mapping default with routes
const defaultBreadcrumbMap: Record<string, BreadcrumbItem[]> = {
  '/dashboard': [{ label: 'Dashboard', href: '/dashboard' }],
  
  // CRM Module Routes
  '/crm/dashboard': [
    { label: 'CRM', href: '/crm/dashboard' },
    { label: 'Dashboard', href: '/crm/dashboard' }
  ],
  '/crm/clients': [
    { label: 'CRM', href: '/crm/dashboard' },
    { label: 'Clientes', href: '/crm/clients' }
  ],
  '/crm/leads': [
    { label: 'CRM', href: '/crm/dashboard' },
    { label: 'Leads', href: '/crm/leads' }
  ],
  '/crm/segments': [
    { label: 'CRM', href: '/crm/dashboard' },
    { label: 'Segmentos', href: '/crm/segments' }
  ],
  '/crm/calls': [
    { label: 'CRM', href: '/crm/dashboard' },
    { label: 'Llamadas', href: '/crm/calls' }
  ],
  '/crm/emails': [
    { label: 'CRM', href: '/crm/dashboard' },
    { label: 'Correos', href: '/crm/emails' }
  ],
  '/crm/meetings': [
    { label: 'CRM', href: '/crm/dashboard' },
    { label: 'Reuniones', href: '/crm/meetings' }
  ],
  
  // Ventas Module Routes
  '/ventas/dashboard': [
    { label: 'Ventas', href: '/ventas/dashboard' },
    { label: 'Dashboard', href: '/ventas/dashboard' }
  ],
  '/ventas/orders/new': [
    { label: 'Ventas', href: '/ventas/dashboard' },
    { label: 'Nueva Orden', href: '/ventas/orders/new' }
  ],
  '/ventas/orders/active': [
    { label: 'Ventas', href: '/ventas/dashboard' },
    { label: 'Órdenes Activas', href: '/ventas/orders/active' }
  ],
  '/ventas/invoices': [
    { label: 'Ventas', href: '/ventas/dashboard' },
    { label: 'Facturas', href: '/ventas/invoices' }
  ],
  
  // Inventario Module Routes
  '/inventario/dashboard': [
    { label: 'Inventario', href: '/inventario/dashboard' },
    { label: 'Dashboard', href: '/inventario/dashboard' }
  ],
  '/inventario/products': [
    { label: 'Inventario', href: '/inventario/dashboard' },
    { label: 'Productos', href: '/inventario/products' }
  ],
  '/inventario/low-stock': [
    { label: 'Inventario', href: '/inventario/dashboard' },
    { label: 'Stock Bajo', href: '/inventario/low-stock' }
  ],
  
  // Reportes Module Routes
  '/reportes/dashboard': [
    { label: 'Reportes', href: '/reportes/dashboard' },
    { label: 'Centro de Reportes', href: '/reportes/dashboard' }
  ],
  '/reportes/financial/balance': [
    { label: 'Reportes', href: '/reportes/dashboard' },
    { label: 'Balance General', href: '/reportes/financial/balance' }
  ],
  '/reportes/sales/period': [
    { label: 'Reportes', href: '/reportes/dashboard' },
    { label: 'Ventas por Período', href: '/reportes/sales/period' }
  ],
  
  // Design System Routes
  '/design-system/tokens': [
    { label: 'Design System', href: '/design-system/tokens' },
    { label: 'Tokens', href: '/design-system/tokens' }
  ],
  '/design-system/colors': [
    { label: 'Design System', href: '/design-system/tokens' },
    { label: 'Colores', href: '/design-system/colors' }
  ],
  '/design-system/typography': [
    { label: 'Design System', href: '/design-system/tokens' },
    { label: 'Tipografía', href: '/design-system/typography' }
  ],
  '/design-system/components': [
    { label: 'Design System', href: '/design-system/tokens' },
    { label: 'Componentes', href: '/design-system/components' }
  ],
  '/design-system/charts': [
    { label: 'Design System', href: '/design-system/tokens' },
    { label: 'Charts', href: '/design-system/charts' }
  ],
  
  // Examples Routes
  '/components': [
    { label: 'Ejemplos', href: '/components' },
    { label: 'UI Components', href: '/components' }
  ],
  '/charts': [
    { label: 'Ejemplos', href: '/components' },
    { label: 'Charts', href: '/charts' }
  ],
  
  // Management Routes
  '/users': [
    { label: 'Gestión', href: '/users' },
    { label: 'Usuarios', href: '/users' }
  ],
  '/processes': [
    { label: 'Gestión', href: '/processes' },
    { label: 'Procesos', href: '/processes' }
  ],
  '/reports': [
    { label: 'Gestión', href: '/reports' },
    { label: 'Reportes', href: '/reports' }
  ],
  
  // Security Routes
  '/security/roles': [
    { label: 'Seguridad', href: '/security/roles' },
    { label: 'Roles y Permisos', href: '/security/roles' }
  ],
  '/security/audit': [
    { label: 'Seguridad', href: '/security/audit' },
    { label: 'Auditoría', href: '/security/audit' }
  ],
  
  // Settings Routes
  '/settings/profile': [
    { label: 'Configuración', href: '/settings/profile' },
    { label: 'Perfil', href: '/settings/profile' }
  ],
  '/settings/general': [
    { label: 'Configuración', href: '/settings/general' },
    { label: 'General', href: '/settings/general' }
  ],
  '/settings/system': [
    { label: 'Configuración', href: '/settings/system' },
    { label: 'Sistema', href: '/settings/system' }
  ],
}

// Default mock notifications
const defaultNotifications: NavbarNotification[] = [
  {
    id: 1,
    type: 'success',
    title: 'Usuario creado',
    message: 'El usuario "Juan Pérez" ha sido creado exitosamente',
    time: 'Hace 5 minutos',
    read: false,
  },
  {
    id: 2,
    type: 'warning',
    title: 'Proceso pendiente',
    message: 'El proceso "Importación de datos" requiere atención',
    time: 'Hace 1 hora',
    read: false,
  },
  {
    id: 3,
    type: 'info',
    title: 'Actualización disponible',
    message: 'Nueva versión del sistema disponible',
    time: 'Hace 2 horas',
    read: true,
  },
]

export function Navbar({
  breadcrumbs: customBreadcrumbs,
  breadcrumbMap: customBreadcrumbMap,
  user: customUser,
  notifications: customNotifications,
  onNotificationClick,
  onViewAllNotifications,
  onLogout,
  showSearch = true,
  showThemeToggle = true,
  showNotifications = true,
  showUserMenu = true,
  userMenuItems,
  rightActions,
  className,
}: NavbarProps = {}) {
  const { toggle, isMobile, isOpen, sidebarWidth } = useSidebarStore()
  const { theme, toggleTheme } = useThemeStore()
  const { logout } = useAuth()
  const location = useLocation()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const brand = useBrandConfig()
  
  const effectiveUser: NavbarUser = customUser || (brand.user?.name ? {
    name: brand.user.name,
    email: brand.user.email,
    avatarUrl: brand.user.avatarUrl,
    role: brand.user.role,
  } : {
    name: 'Usuario Demo',
    email: 'usuario@demo.com',
  })

  const effectiveNotifications = customNotifications ?? defaultNotifications
  const effectiveBreadcrumbs = customBreadcrumbs
    || (customBreadcrumbMap ? customBreadcrumbMap[location.pathname] : undefined)
    || defaultBreadcrumbMap[location.pathname]
    || [{ label: 'Dashboard', href: '/dashboard' }]
  const unreadCount = effectiveNotifications.filter(n => !n.read).length

  const handleLogout = () => {
    if (onLogout) {
      onLogout()
    } else {
      logout()
    }
  }

  // Calcular ancho del navbar según estado del sidebar
  const getNavbarWidth = () => {
    if (isMobile) return '100%'
    if (!isOpen) return 'calc(100% - 63px)' // Sidebar colapsado: 63px
    return `calc(100% - ${sidebarWidth}px)` // Sidebar expandido: ancho dinámico
  }

  const getNavbarLeft = () => {
    if (isMobile) return 0
    if (!isOpen) return 63 // Colapsado
    return sidebarWidth // Expandido
  }

  // Atajo de teclado para abrir búsqueda
  useEffect(() => {
    if (!showSearch) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsSearchOpen(true)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showSearch])

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="h-5 w-5 text-green-600" />
      case 'warning':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600" />
      case 'info':
        return <InformationCircleIcon className="h-5 w-5 text-blue-600" />
      default:
        return <InformationCircleIcon className="h-5 w-5 text-gray-600" />
    }
  }

  return (
    <header 
      style={{ 
        width: getNavbarWidth(),
        left: `${getNavbarLeft()}px`
      }}
      className={cn(
        'fixed top-0 z-20 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm transition-all duration-500 ease-out',
        className
      )}
    >
      <div className="flex items-center justify-between h-14 px-4 lg:px-6">
        {/* Left side */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggle}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-all duration-200 p-2 hover:bg-gray-100/80 dark:hover:bg-gray-700/80 rounded-xl"
            title="Toggle menú"
          >
            <Bars3Icon className="h-5 w-5" />
          </button>

          {/* Breadcrumbs */}
          <div className="hidden sm:block">
            <Breadcrumb items={effectiveBreadcrumbs} showHome={false} />
          </div>

          {/* Mobile title */}
          <h1 className="sm:hidden text-base font-bold text-gray-900 dark:text-white">
            {effectiveBreadcrumbs[effectiveBreadcrumbs.length - 1]?.label}
          </h1>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Search Button - Trigger modal */}
          {showSearch && (
            <>
              <button
                onClick={() => setIsSearchOpen(true)}
                className="hidden md:flex items-center gap-2.5 px-3.5 py-2 text-sm text-gray-600 dark:text-gray-300 bg-gray-100/90 dark:bg-gray-700/60 hover:bg-gray-200/90 dark:hover:bg-gray-600/70 rounded-full transition-all duration-300 group border border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 shadow-sm hover:shadow-md"
                title="Buscar (⌘K)"
              >
                <MagnifyingGlassIcon className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                <span className="hidden lg:inline font-medium">Buscar...</span>
                <kbd className="hidden xl:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-bold text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm">
                  ⌘K
                </kbd>
              </button>

              <button
                onClick={() => setIsSearchOpen(true)}
                className="md:hidden p-2.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-all duration-200 rounded-full hover:bg-gray-100/80 dark:hover:bg-gray-700/80 shadow-sm hover:shadow-md"
                title="Buscar"
              >
                <MagnifyingGlassIcon className="h-5 w-5" />
              </button>
            </>
          )}

          {/* Theme toggle */}
          {showThemeToggle && (
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-all duration-200 rounded-xl hover:bg-gray-100/80 dark:hover:bg-gray-700/80 group"
              title="Cambiar tema"
            >
              {theme === 'dark' ? (
                <SunIcon className="h-5 w-5 group-hover:rotate-45 transition-transform duration-300" />
              ) : (
                <MoonIcon className="h-5 w-5 group-hover:-rotate-12 transition-transform duration-300" />
              )}
            </button>
          )}

          {/* Notifications */}
          {showNotifications && (
            <Menu as="div" className="relative">
              <Menu.Button className="relative p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-all duration-200 rounded-xl hover:bg-gray-100/80 dark:hover:bg-gray-700/80 group">
                <BellIcon className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-600 rounded-full shadow-lg shadow-red-600/50" />
                )}
              </Menu.Button>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-80 origin-top-right rounded-xl bg-white dark:bg-gray-800 shadow-2xl ring-1 ring-black/5 dark:ring-white/5 focus:outline-none overflow-hidden backdrop-blur-xl z-50">
                  <div className="p-3">
                    <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200 dark:border-gray-700">
                      <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <BellIcon className="h-4 w-4" />
                        Notificaciones
                      </h3>
                      {unreadCount > 0 && (
                        <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-white bg-gradient-to-r from-red-600 to-red-700 rounded-full shadow-sm">
                          {unreadCount} nueva{unreadCount !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>

                    <div className="max-h-96 overflow-y-auto custom-scrollbar">
                      {effectiveNotifications.length === 0 ? (
                        <div className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                          No hay notificaciones
                        </div>
                      ) : (
                        effectiveNotifications.map((notification) => (
                          <Menu.Item key={notification.id}>
                            {({ active }) => (
                              <button
                                onClick={() => onNotificationClick?.(notification)}
                                className={cn(
                                  'w-full px-3 py-3 text-left transition-all duration-200 border-b border-gray-100 dark:border-gray-700 last:border-0 rounded-lg my-1',
                                  active && 'bg-gray-50 dark:bg-gray-700/50 scale-[0.98]',
                                  !notification.read && 'bg-gradient-to-r from-blue-50/50 to-transparent dark:from-blue-900/10'
                                )}
                              >
                                <div className="flex gap-3">
                                  <div className="flex-shrink-0 mt-0.5">
                                    <div className={cn(
                                      'p-1.5 rounded-lg',
                                      notification.type === 'success' && 'bg-green-100 dark:bg-green-900/30',
                                      notification.type === 'warning' && 'bg-yellow-100 dark:bg-yellow-900/30',
                                      notification.type === 'info' && 'bg-blue-100 dark:bg-blue-900/30'
                                    )}>
                                      {getNotificationIcon(notification.type)}
                                    </div>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                      {notification.title}
                                    </p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                                      {notification.message}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1.5 flex items-center gap-1">
                                      <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                                      {notification.time}
                                    </p>
                                  </div>
                                  {!notification.read && (
                                    <div className="flex-shrink-0 mt-2">
                                      <div className="w-2 h-2 bg-blue-600 rounded-full shadow-lg shadow-blue-600/50 animate-pulse" />
                                    </div>
                                  )}
                                </div>
                              </button>
                            )}
                          </Menu.Item>
                        ))
                      )}
                    </div>

                    {onViewAllNotifications && (
                      <div className="px-3 py-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/20">
                        <button
                          onClick={onViewAllNotifications}
                          className="w-full text-center text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold py-1.5 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-200"
                        >
                          Ver todas las notificaciones
                        </button>
                      </div>
                    )}
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          )}

          {/* Right Actions custom slot */}
          {rightActions}

          {/* User menu */}
          {showUserMenu && (
            <Menu as="div" className="relative">
              <Menu.Button className="flex items-center gap-2 p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-all duration-200 rounded-xl hover:bg-gray-100/80 dark:hover:bg-gray-700/80 group">
                {effectiveUser.avatarUrl ? (
                  <img src={effectiveUser.avatarUrl} alt={effectiveUser.name} className="h-7 w-7 rounded-full object-cover" />
                ) : (
                  <UserCircleIcon className="h-6 w-6 group-hover:scale-110 transition-transform duration-200" />
                )}
                <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {effectiveUser.name}
                </span>
              </Menu.Button>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl bg-white dark:bg-gray-800 shadow-2xl ring-1 ring-black/5 dark:ring-white/5 focus:outline-none overflow-hidden backdrop-blur-xl z-50">
                  <div className="p-2">
                    {/* User info header */}
                    <div className="px-3 py-3 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2 truncate">
                        {effectiveUser.avatarUrl ? (
                          <img src={effectiveUser.avatarUrl} alt={effectiveUser.name} className="h-5 w-5 rounded-full object-cover shrink-0" />
                        ) : (
                          <UserCircleIcon className="h-5 w-5 text-primary-600 dark:text-primary-400 shrink-0" />
                        )}
                        <span className="truncate">{effectiveUser.name}</span>
                      </p>
                      {effectiveUser.email && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                          {effectiveUser.email}
                        </p>
                      )}
                      {effectiveUser.role && (
                        <span className="inline-block mt-1 px-1.5 py-0.5 text-[10px] font-semibold bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 rounded">
                          {effectiveUser.role}
                        </span>
                      )}
                    </div>

                    {/* Menu items */}
                    <div className="py-1">
                      {userMenuItems ? (
                        userMenuItems.map((item, index) => {
                          const IconComp = item.icon
                          return (
                            <Menu.Item key={index}>
                              {({ active }) => (
                                item.href ? (
                                  <Link
                                    to={item.href}
                                    onClick={item.onClick}
                                    className={cn(
                                      'flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-all duration-200',
                                      active
                                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                                        : 'text-gray-700 dark:text-gray-300'
                                    )}
                                  >
                                    {IconComp && <IconComp className="h-5 w-5" />}
                                    {item.label}
                                  </Link>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={item.onClick}
                                    className={cn(
                                      'w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-all duration-200',
                                      active
                                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                                        : 'text-gray-700 dark:text-gray-300'
                                    )}
                                  >
                                    {IconComp && <IconComp className="h-5 w-5" />}
                                    {item.label}
                                  </button>
                                )
                              )}
                            </Menu.Item>
                          )
                        })
                      ) : (
                        <>
                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                to="/settings/profile"
                                className={cn(
                                  'flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-all duration-200',
                                  active
                                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                                    : 'text-gray-700 dark:text-gray-300'
                                )}
                              >
                                <UserIcon className="h-5 w-5" />
                                Mi Perfil
                              </Link>
                            )}
                          </Menu.Item>

                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                to="/settings/general"
                                className={cn(
                                  'flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-all duration-200',
                                  active
                                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                                    : 'text-gray-700 dark:text-gray-300'
                                )}
                              >
                                <Cog6ToothIcon className="h-5 w-5" />
                                Configuración
                              </Link>
                            )}
                          </Menu.Item>
                        </>
                      )}
                    </div>

                    {/* Logout button */}
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-1 pb-1">
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={handleLogout}
                            className={cn(
                              'w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-all duration-200',
                              active
                                ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                                : 'text-gray-700 dark:text-gray-300'
                            )}
                          >
                            <ArrowRightOnRectangleIcon className="h-5 w-5" />
                            Cerrar Sesión
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          )}
        </div>
      </div>

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </header>
  )
}
