import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import type { SidebarProps } from './Sidebar'
import { Navbar } from './Navbar'
import type { NavbarProps, NavbarUser } from './Navbar'
import { useSidebarStore } from '@/store/sidebarStore'
import { cn } from '@/utils/cn'

export interface MainLayoutProps {
  children?: ReactNode
  /** Nombre de la aplicación a mostrar en Sidebar y Navbar */
  appName?: string
  /** Alias brandName para parametrización */
  brandName?: string
  /** Nodo JSX del logo */
  logo?: ReactNode
  /** URL de la imagen del logo */
  logoUrl?: string
  /** Si se debe mostrar la atribución al creador al pie del sidebar */
  showCreator?: boolean
  /** Nombre del creador (default: "FaruTech") */
  creatorName?: string
  /** URL del creador */
  creatorUrl?: string
  /** Prefijo del creador (default: "Desarrollado por") */
  creatorPrefix?: string
  /** Usuario activo para Navbar */
  user?: NavbarUser
  /** Propiedades adicionales directas para el Sidebar */
  sidebarProps?: Partial<SidebarProps>
  /** Propiedades adicionales directas para el Navbar */
  navbarProps?: Partial<NavbarProps>
  /** Clases CSS para el contenedor raíz */
  className?: string
  /** Clases CSS para el área de contenido principal */
  contentClassName?: string
}

export function MainLayout({
  children,
  appName,
  brandName,
  logo,
  logoUrl,
  showCreator,
  creatorName,
  creatorUrl,
  creatorPrefix,
  user,
  sidebarProps,
  navbarProps,
  className,
  contentClassName,
}: MainLayoutProps) {
  const effectiveAppName = brandName || appName
  const { isOpen, isMobile, sidebarWidth, setMobile } = useSidebarStore()

  useEffect(() => {
    const checkMobile = () => {
      setMobile(window.innerWidth < 1024)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [setMobile])

  const getMarginLeft = () => {
    if (isMobile) return 0
    if (!isOpen) return 63 // Colapsado: 63px
    return sidebarWidth // Expandido: ancho dinámico
  }

  return (
    <div className={cn('h-screen overflow-hidden bg-gray-50 dark:bg-gray-900', className)}>
      <Sidebar
        appName={effectiveAppName}
        logo={logo}
        logoUrl={logoUrl}
        showCreator={showCreator}
        creatorName={creatorName}
        creatorUrl={creatorUrl}
        creatorPrefix={creatorPrefix}
        {...sidebarProps}
      />
      
      {/* Main Content Area */}
      <div
        style={{ marginLeft: `${getMarginLeft()}px` }}
        className="h-full transition-all duration-500 ease-out"
      >
        <Navbar
          appName={appName}
          user={user}
          {...navbarProps}
        />
        
        {/* Main content with scroll ONLY in content area, starts below navbar (h-14 = 56px) */}
        <main className={cn('h-[calc(100vh-3.5rem)] overflow-y-auto mt-14 px-6 py-6 lg:px-8 lg:py-8', contentClassName)}>
          {children}
        </main>
      </div>
    </div>
  )
}

export default MainLayout

