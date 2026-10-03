/**
 * TokenStorage - Estrategias seguras de almacenamiento de credenciales y tokens JWT.
 * 
 * Guía de Seguridad FaruTech:
 * 1. MEMORIA (`memory`): La más segura contra ataques XSS. Los tokens se mantienen en variable JS
 *    y se renuevan en background mediante Refresh Token en Cookie HttpOnly.
 * 2. COOKIE (`cookie`): Almacenamiento en cookie de cliente con banderas SameSite y Secure.
 *    (Nota: para máxima seguridad en producción corporativa, use cookies HttpOnly emitidas por el servidor).
 * 3. LOCAL_STORAGE (`localStorage`): Persistente entre pestañas y reinicios de navegador.
 * 4. SESSION_STORAGE (`sessionStorage`): Persistente solo en la pestaña actual.
 */

export type StorageStrategy = 'memory' | 'cookie' | 'localStorage' | 'sessionStorage'

export interface TokenEnvelope {
  accessToken: string
  refreshToken?: string
  expiresAt?: number // Timestamp en milisegundos
  tokenType?: string
  scope?: string
  user?: Record<string, unknown>
}

export interface TokenStorageConfig {
  strategy?: StorageStrategy
  storageKey?: string
  cookieDomain?: string
  cookiePath?: string
  sameSite?: 'Strict' | 'Lax' | 'None'
  secure?: boolean
  onTokenExpired?: () => void
  onTokenChanged?: (token: string | null) => void
}

let inMemoryToken: TokenEnvelope | null = null

export class TokenStorage {
  private strategy: StorageStrategy
  private key: string
  private config: TokenStorageConfig
  private expirationTimer: any = null

  constructor(config: TokenStorageConfig = {}) {
    this.strategy = config.strategy || 'memory'
    this.key = config.storageKey || 'ft_auth_token'
    this.config = {
      sameSite: 'Strict',
      secure: typeof window !== 'undefined' ? window.location.protocol === 'https:' : true,
      cookiePath: '/',
      ...config,
    }
  }

  /**
   * Guarda el token según la estrategia configurada
   */
  setToken(envelope: TokenEnvelope | string): void {
    const data: TokenEnvelope = typeof envelope === 'string' 
      ? { accessToken: envelope, expiresAt: this.extractExpiration(envelope) }
      : envelope

    this.scheduleExpiration(data.expiresAt)

    if (this.strategy === 'memory') {
      inMemoryToken = data
    } else if (typeof window !== 'undefined') {
      const serialized = JSON.stringify(data)

      if (this.strategy === 'localStorage') {
        try {
          window.localStorage.setItem(this.key, serialized)
        } catch (e) {
          console.error('[TokenStorage] Error escribiendo en localStorage:', e)
        }
      } else if (this.strategy === 'sessionStorage') {
        try {
          window.sessionStorage.setItem(this.key, serialized)
        } catch (e) {
          console.error('[TokenStorage] Error escribiendo en sessionStorage:', e)
        }
      } else if (this.strategy === 'cookie') {
        const expires = data.expiresAt ? new Date(data.expiresAt).toUTCString() : ''
        const cookieStr = `${encodeURIComponent(this.key)}=${encodeURIComponent(serialized)}; path=${this.config.cookiePath}; SameSite=${this.config.sameSite}${this.config.secure ? '; Secure' : ''}${expires ? `; expires=${expires}` : ''}`
        document.cookie = cookieStr
      }
    }

    this.config.onTokenChanged?.(data.accessToken)
  }

  /**
   * Obtiene el token actual si no ha expirado
   */
  getToken(): string | null {
    const envelope = this.getTokenEnvelope()
    if (!envelope) return null

    if (envelope.expiresAt && Date.now() >= envelope.expiresAt) {
      this.clearToken()
      return null
    }

    return envelope.accessToken
  }

  /**
   * Obtiene el envoltorio completo del token (access, refresh, exp)
   */
  getTokenEnvelope(): TokenEnvelope | null {
    if (this.strategy === 'memory') {
      return inMemoryToken
    }

    if (typeof window === 'undefined') return null

    let raw: string | null = null

    if (this.strategy === 'localStorage') {
      raw = window.localStorage.getItem(this.key)
    } else if (this.strategy === 'sessionStorage') {
      raw = window.sessionStorage.getItem(this.key)
    } else if (this.strategy === 'cookie') {
      const match = document.cookie.match(new RegExp('(^|;\\s*)(' + encodeURIComponent(this.key) + ')=([^;]*)'))
      raw = match ? decodeURIComponent(match[3]) : null
    }

    if (!raw) return null

    try {
      return JSON.parse(raw) as TokenEnvelope
    } catch {
      return { accessToken: raw }
    }
  }

  /**
   * Elimina el token de almacenamiento de forma limpia
   */
  clearToken(): void {
    if (this.expirationTimer) {
      clearTimeout(this.expirationTimer)
      this.expirationTimer = null
    }

    inMemoryToken = null

    if (typeof window !== 'undefined') {
      if (this.strategy === 'localStorage') {
        window.localStorage.removeItem(this.key)
      } else if (this.strategy === 'sessionStorage') {
        window.sessionStorage.removeItem(this.key)
      } else if (this.strategy === 'cookie') {
        document.cookie = `${encodeURIComponent(this.key)}=; path=${this.config.cookiePath}; expires=Thu, 01 Jan 1970 00:00:00 GMT`
      }
    }

    this.config.onTokenChanged?.(null)
  }

  /**
   * Extrae la fecha de expiración si el token es un JWT válido
   */
  private extractExpiration(jwtToken: string): number | undefined {
    try {
      const parts = jwtToken.split('.')
      if (parts.length !== 3) return undefined
      const payload = JSON.parse(atob(parts[1]))
      if (typeof payload.exp === 'number') {
        return payload.exp * 1000 // Convertir segundos a ms
      }
    } catch {
      // No es JWT o no es parseable
    }
    return undefined
  }

  private scheduleExpiration(expiresAt?: number): void {
    if (this.expirationTimer) {
      clearTimeout(this.expirationTimer)
      this.expirationTimer = null
    }

    if (!expiresAt) return

    const msUntilExp = expiresAt - Date.now()
    if (msUntilExp <= 0) {
      this.config.onTokenExpired?.()
      return
    }

    this.expirationTimer = setTimeout(() => {
      this.clearToken()
      this.config.onTokenExpired?.()
    }, msUntilExp)
  }
}

/** Instancia predeterminada de almacenamiento */
export const defaultTokenStorage = new TokenStorage({ strategy: 'localStorage' })
