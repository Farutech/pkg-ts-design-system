import { describe, it, expect } from 'vitest'
import { TokenStorage } from '../TokenStorage'

describe('Fase 4 — Suite de Seguridad y Almacenamiento de Tokens', () => {
  describe('TokenStorage (Estrategia Memory)', () => {
    it('debe almacenar y recuperar tokens en memoria sin tocar localStorage', () => {
      const storage = new TokenStorage({ strategy: 'memory' })
      expect(storage.getToken()).toBeNull()

      storage.setToken('jwt-access-token-123')
      expect(storage.getToken()).toBe('jwt-access-token-123')

      storage.clearToken()
      expect(storage.getToken()).toBeNull()
    })
  })

  describe('TokenStorage (Estrategia localStorage)', () => {
    it('debe serializar y limpiar tokens en window.localStorage', () => {
      const storage = new TokenStorage({ strategy: 'localStorage', storageKey: 'test_auth' })

      storage.setToken({
        accessToken: 'access-456',
        refreshToken: 'refresh-789',
        expiresAt: Date.now() + 100000,
      })

      expect(storage.getToken()).toBe('access-456')
      expect(storage.getTokenEnvelope()?.refreshToken).toBe('refresh-789')

      storage.clearToken()
      expect(storage.getToken()).toBeNull()
      expect(window.localStorage.getItem('test_auth')).toBeNull()
    })

    it('debe descartar tokens si han expirado', () => {
      const storage = new TokenStorage({ strategy: 'localStorage', storageKey: 'test_exp' })

      storage.setToken({
        accessToken: 'expired-token',
        expiresAt: Date.now() - 5000, // Ya expiró hace 5 seg
      })

      expect(storage.getToken()).toBeNull()
    })
  })
})
