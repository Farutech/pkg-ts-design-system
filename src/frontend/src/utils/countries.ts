export interface CountryData {
  code: string          // ISO 3166-1 alpha-2 (ej. 'CO')
  iso3?: string         // ISO 3166-1 alpha-3 (ej. 'COL')
  name: string          // Nombre en español (ej. 'Colombia')
  nameEn?: string       // Nombre en inglés
  dialCode: string      // Prefijo telefónico (ej. '+57')
  flag: string          // Emoji de bandera (ej. '🇨🇴')
  currency?: string     // Código ISO 4217 (ej. 'COP')
  currencySymbol?: string // Símbolo monetario (ej. '$')
  placeholder?: string  // Formato sugerido
}

export interface CountryFilterOptions {
  /** Criterio de ordenamiento: 'name' (alfabético por nombre), 'nameEn', 'code' (ISO2), 'iso3', 'dialCode' o 'none' */
  sortBy?: 'name' | 'nameEn' | 'code' | 'iso3' | 'dialCode' | 'none'
  /** Dirección del ordenamiento: 'asc' o 'desc' (por defecto 'asc') */
  sortDirection?: 'asc' | 'desc'
  /** Códigos ISO (alpha-2 o alpha-3) o prefijos telefónicos a excluir (ej. ['KP', 'IR']) */
  exclude?: string[]
  /** Lista blanca de códigos ISO permitidos (si se define, solo se incluyen estos) */
  includeOnly?: string[]
  /** Códigos ISO a priorizar al inicio de la lista únicamente si es solicitado explícitamente */
  priority?: string[]
}

/**
 * Catálogo mundial completo de países sin priorización arbitraria por defecto.
 * Ordenado alfabéticamente por nombre.
 */
export const COUNTRIES: CountryData[] = [
  { code: 'AF', name: 'Afganistán', nameEn: 'Afghanistan', dialCode: '+93', flag: '🇦🇫' },
  { code: 'AL', name: 'Albania', nameEn: 'Albania', dialCode: '+355', flag: '🇦🇱' },
  { code: 'DE', iso3: 'DEU', name: 'Alemania', nameEn: 'Germany', dialCode: '+49', flag: '🇩🇪', currency: 'EUR', currencySymbol: '€', placeholder: '151 12345678' },
  { code: 'AD', name: 'Andorra', nameEn: 'Andorra', dialCode: '+376', flag: '🇦🇩' },
  { code: 'AO', name: 'Angola', nameEn: 'Angola', dialCode: '+244', flag: '🇦🇴' },
  { code: 'AI', name: 'Anguila', nameEn: 'Anguilla', dialCode: '+1264', flag: '🇦🇮' },
  { code: 'AG', name: 'Antigua y Barbuda', nameEn: 'Antigua and Barbuda', dialCode: '+1268', flag: '🇦🇬' },
  { code: 'SA', name: 'Arabia Saudita', nameEn: 'Saudi Arabia', dialCode: '+966', flag: '🇸🇦' },
  { code: 'DZ', name: 'Argelia', nameEn: 'Algeria', dialCode: '+213', flag: '🇩🇿' },
  { code: 'AR', iso3: 'ARG', name: 'Argentina', nameEn: 'Argentina', dialCode: '+54', flag: '🇦🇷', currency: 'ARS', currencySymbol: '$', placeholder: '11 1234-5678' },
  { code: 'AM', name: 'Armenia', nameEn: 'Armenia', dialCode: '+374', flag: '🇦🇲' },
  { code: 'AW', name: 'Aruba', nameEn: 'Aruba', dialCode: '+297', flag: '🇦🇼' },
  { code: 'AU', name: 'Australia', nameEn: 'Australia', dialCode: '+61', flag: '🇦🇺' },
  { code: 'AT', name: 'Austria', nameEn: 'Austria', dialCode: '+43', flag: '🇦🇹' },
  { code: 'AZ', name: 'Azerbaiyán', nameEn: 'Azerbaijan', dialCode: '+994', flag: '🇦🇿' },
  { code: 'BS', name: 'Bahamas', nameEn: 'Bahamas', dialCode: '+1242', flag: '🇧🇸' },
  { code: 'BD', name: 'Bangladés', nameEn: 'Bangladesh', dialCode: '+880', flag: '🇧🇩' },
  { code: 'BB', name: 'Barbados', nameEn: 'Barbados', dialCode: '+1246', flag: '🇧🇧' },
  { code: 'BH', name: 'Baréin', nameEn: 'Bahrain', dialCode: '+973', flag: '🇧🇭' },
  { code: 'BE', name: 'Bélgica', nameEn: 'Belgium', dialCode: '+32', flag: '🇧🇪' },
  { code: 'BZ', name: 'Belice', nameEn: 'Belize', dialCode: '+501', flag: '🇧🇿' },
  { code: 'BJ', name: 'Benín', nameEn: 'Benin', dialCode: '+229', flag: '🇧🇯' },
  { code: 'BM', name: 'Bermudas', nameEn: 'Bermuda', dialCode: '+1441', flag: '🇧🇲' },
  { code: 'BY', name: 'Bielorrusia', nameEn: 'Belarus', dialCode: '+375', flag: '🇧🇾' },
  { code: 'BO', iso3: 'BOL', name: 'Bolivia', nameEn: 'Bolivia', dialCode: '+591', flag: '🇧🇴', currency: 'BOB', currencySymbol: 'Bs', placeholder: '71234567' },
  { code: 'BA', name: 'Bosnia y Herzegovina', nameEn: 'Bosnia and Herzegovina', dialCode: '+387', flag: '🇧🇦' },
  { code: 'BW', name: 'Botsuana', nameEn: 'Botswana', dialCode: '+267', flag: '🇧🇼' },
  { code: 'BR', iso3: 'BRA', name: 'Brasil', nameEn: 'Brazil', dialCode: '+55', flag: '🇧🇷', currency: 'BRL', currencySymbol: 'R$', placeholder: '(11) 91234-5678' },
  { code: 'BN', name: 'Brunéi', nameEn: 'Brunei', dialCode: '+673', flag: '🇧🇳' },
  { code: 'BG', name: 'Bulgaria', nameEn: 'Bulgaria', dialCode: '+359', flag: '🇧🇬' },
  { code: 'BF', name: 'Burkina Faso', nameEn: 'Burkina Faso', dialCode: '+226', flag: '🇧🇫' },
  { code: 'BI', name: 'Burundi', nameEn: 'Burundi', dialCode: '+257', flag: '🇧🇮' },
  { code: 'BT', name: 'Bután', nameEn: 'Bhutan', dialCode: '+975', flag: '🇧🇹' },
  { code: 'CV', name: 'Cabo Verde', nameEn: 'Cape Verde', dialCode: '+238', flag: '🇨🇻' },
  { code: 'KH', name: 'Camboya', nameEn: 'Cambodia', dialCode: '+855', flag: '🇰🇭' },
  { code: 'CM', name: 'Camerún', nameEn: 'Cameroon', dialCode: '+237', flag: '🇨🇲' },
  { code: 'CA', iso3: 'CAN', name: 'Canadá', nameEn: 'Canada', dialCode: '+1', flag: '🇨🇦', currency: 'CAD', currencySymbol: '$', placeholder: '(416) 555-0123' },
  { code: 'QA', name: 'Catar', nameEn: 'Qatar', dialCode: '+974', flag: '🇶🇦' },
  { code: 'TD', name: 'Chad', nameEn: 'Chad', dialCode: '+235', flag: '🇹🇩' },
  { code: 'CZ', name: 'Chequia', nameEn: 'Czechia', dialCode: '+420', flag: '🇨🇿' },
  { code: 'CL', iso3: 'CHL', name: 'Chile', nameEn: 'Chile', dialCode: '+56', flag: '🇨🇱', currency: 'CLP', currencySymbol: '$', placeholder: '9 1234 5678' },
  { code: 'CN', name: 'China', nameEn: 'China', dialCode: '+86', flag: '🇨🇳' },
  { code: 'CY', name: 'Chipre', nameEn: 'Cyprus', dialCode: '+357', flag: '🇨🇾' },
  { code: 'CO', iso3: 'COL', name: 'Colombia', nameEn: 'Colombia', dialCode: '+57', flag: '🇨🇴', currency: 'COP', currencySymbol: '$', placeholder: '300 123 4567' },
  { code: 'CR', iso3: 'CRI', name: 'Costa Rica', nameEn: 'Costa Rica', dialCode: '+506', flag: '🇨🇷', currency: 'CRC', currencySymbol: '₡', placeholder: '8123-4567' },
  { code: 'CW', name: 'Curazao', nameEn: 'Curaçao', dialCode: '+599', flag: '🇨🇼' },
  { code: 'DK', name: 'Dinamarca', nameEn: 'Denmark', dialCode: '+45', flag: '🇩🇰' },
  { code: 'EC', iso3: 'ECU', name: 'Ecuador', nameEn: 'Ecuador', dialCode: '+593', flag: '🇪🇨', currency: 'USD', currencySymbol: '$', placeholder: '99 123 4567' },
  { code: 'EG', name: 'Egipto', nameEn: 'Egypt', dialCode: '+20', flag: '🇪🇬' },
  { code: 'AE', name: 'Emiratos Árabes Unidos', nameEn: 'United Arab Emirates', dialCode: '+971', flag: '🇦🇪' },
  { code: 'SK', name: 'Eslovaquia', nameEn: 'Slovakia', dialCode: '+421', flag: '🇸🇰' },
  { code: 'SI', name: 'Eslovenia', nameEn: 'Slovenia', dialCode: '+386', flag: '🇸🇮' },
  { code: 'ES', iso3: 'ESP', name: 'España', nameEn: 'Spain', dialCode: '+34', flag: '🇪🇸', currency: 'EUR', currencySymbol: '€', placeholder: '612 34 56 78' },
  { code: 'US', iso3: 'USA', name: 'Estados Unidos', nameEn: 'United States', dialCode: '+1', flag: '🇺🇸', currency: 'USD', currencySymbol: '$', placeholder: '(555) 123-4567' },
  { code: 'EE', name: 'Estonia', nameEn: 'Estonia', dialCode: '+372', flag: '🇪🇪' },
  { code: 'PH', name: 'Filipinas', nameEn: 'Philippines', dialCode: '+63', flag: '🇵🇭' },
  { code: 'FI', name: 'Finlandia', nameEn: 'Finland', dialCode: '+358', flag: '🇫🇮' },
  { code: 'FR', iso3: 'FRA', name: 'Francia', nameEn: 'France', dialCode: '+33', flag: '🇫🇷', currency: 'EUR', currencySymbol: '€', placeholder: '6 12 34 56 78' },
  { code: 'GR', name: 'Grecia', nameEn: 'Greece', dialCode: '+30', flag: '🇬🇷' },
  { code: 'GT', iso3: 'GTM', name: 'Guatemala', nameEn: 'Guatemala', dialCode: '+502', flag: '🇬🇹', currency: 'GTQ', currencySymbol: 'Q', placeholder: '5123-4567' },
  { code: 'HN', name: 'Honduras', nameEn: 'Honduras', dialCode: '+504', flag: '🇭🇳' },
  { code: 'HK', name: 'Hong Kong', nameEn: 'Hong Kong', dialCode: '+852', flag: '🇭🇰' },
  { code: 'HU', name: 'Hungría', nameEn: 'Hungary', dialCode: '+36', flag: '🇭🇺' },
  { code: 'IN', name: 'India', nameEn: 'India', dialCode: '+91', flag: '🇮🇳' },
  { code: 'ID', name: 'Indonesia', nameEn: 'Indonesia', dialCode: '+62', flag: '🇮🇩' },
  { code: 'IE', name: 'Irlanda', nameEn: 'Ireland', dialCode: '+353', flag: '🇮🇪' },
  { code: 'IL', name: 'Israel', nameEn: 'Israel', dialCode: '+972', flag: '🇮🇱' },
  { code: 'IT', iso3: 'ITA', name: 'Italia', nameEn: 'Italy', dialCode: '+39', flag: '🇮🇹', currency: 'EUR', currencySymbol: '€', placeholder: '312 345 6789' },
  { code: 'JM', name: 'Jamaica', nameEn: 'Jamaica', dialCode: '+1876', flag: '🇯🇲' },
  { code: 'JP', name: 'Japón', nameEn: 'Japan', dialCode: '+81', flag: '🇯🇵' },
  { code: 'JO', name: 'Jordania', nameEn: 'Jordan', dialCode: '+962', flag: '🇯🇴' },
  { code: 'KZ', name: 'Kazajistán', nameEn: 'Kazakhstan', dialCode: '+7', flag: '🇰🇿' },
  { code: 'KE', name: 'Kenia', nameEn: 'Kenya', dialCode: '+254', flag: '🇰🇪' },
  { code: 'KW', name: 'Kuwait', nameEn: 'Kuwait', dialCode: '+965', flag: '🇰🇼' },
  { code: 'LV', name: 'Letonia', nameEn: 'Latvia', dialCode: '+371', flag: '🇱🇻' },
  { code: 'LB', name: 'Líbano', nameEn: 'Lebanon', dialCode: '+961', flag: '🇱🇧' },
  { code: 'LT', name: 'Lituania', nameEn: 'Lithuania', dialCode: '+370', flag: '🇱🇹' },
  { code: 'LU', name: 'Luxemburgo', nameEn: 'Luxembourg', dialCode: '+352', flag: '🇱🇺' },
  { code: 'MY', name: 'Malasia', nameEn: 'Malaysia', dialCode: '+60', flag: '🇲🇾' },
  { code: 'MA', name: 'Marruecos', nameEn: 'Morocco', dialCode: '+212', flag: '🇲🇦' },
  { code: 'MX', iso3: 'MEX', name: 'México', nameEn: 'Mexico', dialCode: '+52', flag: '🇲🇽', currency: 'MXN', currencySymbol: '$', placeholder: '55 1234 5678' },
  { code: 'NI', name: 'Nicaragua', nameEn: 'Nicaragua', dialCode: '+505', flag: '🇳🇮' },
  { code: 'NG', name: 'Nigeria', nameEn: 'Nigeria', dialCode: '+234', flag: '🇳🇬' },
  { code: 'NO', name: 'Noruega', nameEn: 'Norway', dialCode: '+47', flag: '🇳🇴' },
  { code: 'NZ', name: 'Nueva Zelanda', nameEn: 'New Zealand', dialCode: '+64', flag: '🇳🇿' },
  { code: 'NL', name: 'Países Bajos', nameEn: 'Netherlands', dialCode: '+31', flag: '🇳🇱' },
  { code: 'PA', iso3: 'PAN', name: 'Panamá', nameEn: 'Panama', dialCode: '+507', flag: '🇵🇦', currency: 'USD', currencySymbol: '$', placeholder: '6123-4567' },
  { code: 'PY', iso3: 'PRY', name: 'Paraguay', nameEn: 'Paraguay', dialCode: '+595', flag: '🇵🇾', currency: 'PYG', currencySymbol: '₲', placeholder: '981 123456' },
  { code: 'PE', iso3: 'PER', name: 'Perú', nameEn: 'Peru', dialCode: '+51', flag: '🇵🇪', currency: 'PEN', currencySymbol: 'S/', placeholder: '912 345 678' },
  { code: 'PL', name: 'Polonia', nameEn: 'Poland', dialCode: '+48', flag: '🇵🇱' },
  { code: 'PT', name: 'Portugal', nameEn: 'Portugal', dialCode: '+351', flag: '🇵🇹' },
  { code: 'PR', name: 'Puerto Rico', nameEn: 'Puerto Rico', dialCode: '+1787', flag: '🇵🇷' },
  { code: 'GB', iso3: 'GBR', name: 'Reino Unido', nameEn: 'United Kingdom', dialCode: '+44', flag: '🇬🇧', currency: 'GBP', currencySymbol: '£', placeholder: '7911 123456' },
  { code: 'DO', iso3: 'DOM', name: 'República Dominicana', nameEn: 'Dominican Republic', dialCode: '+1', flag: '🇩🇴', currency: 'DOP', currencySymbol: 'RD$', placeholder: '(809) 555-0123' },
  { code: 'RO', name: 'Rumania', nameEn: 'Romania', dialCode: '+40', flag: '🇷🇴' },
  { code: 'SG', name: 'Singapur', nameEn: 'Singapore', dialCode: '+65', flag: '🇸🇬' },
  { code: 'ZA', name: 'Sudáfrica', nameEn: 'South Africa', dialCode: '+27', flag: '🇿🇦' },
  { code: 'SE', name: 'Suecia', nameEn: 'Sweden', dialCode: '+46', flag: '🇸🇪' },
  { code: 'CH', name: 'Suiza', nameEn: 'Switzerland', dialCode: '+41', flag: '🇨🇭' },
  { code: 'TH', name: 'Tailandia', nameEn: 'Thailand', dialCode: '+66', flag: '🇹🇭' },
  { code: 'TR', name: 'Turquía', nameEn: 'Turkey', dialCode: '+90', flag: '🇹🇷' },
  { code: 'UA', name: 'Ucrania', nameEn: 'Ukraine', dialCode: '+380', flag: '🇺🇦' },
  { code: 'UY', iso3: 'URY', name: 'Uruguay', nameEn: 'Uruguay', dialCode: '+598', flag: 'UYU', currency: 'UYU', currencySymbol: '$', placeholder: '91 234 567' },
  { code: 'VE', iso3: 'VEN', name: 'Venezuela', nameEn: 'Venezuela', dialCode: '+58', flag: '🇻🇪', currency: 'VES', currencySymbol: 'Bs.', placeholder: '412 1234567' },
  { code: 'VN', name: 'Vietnam', nameEn: 'Vietnam', dialCode: '+84', flag: '🇻🇳' },
]

export const DEFAULT_COUNTRY: CountryData = COUNTRIES[0]

/**
 * Obtiene el catálogo de países filtrado y ordenado según las opciones configuradas.
 * Permite exclusiones, listas blancas, ordenamiento alfabético/código/indicativo y prioridades personalizadas.
 */
export function getCountries(options?: CountryFilterOptions): CountryData[] {
  let list = [...COUNTRIES]

  // Inclusión estricta (whitelist)
  if (options?.includeOnly && options.includeOnly.length > 0) {
    const allowSet = new Set(options.includeOnly.map((c) => c.toUpperCase()))
    list = list.filter(
      (c) => allowSet.has(c.code.toUpperCase()) || (c.iso3 && allowSet.has(c.iso3.toUpperCase()))
    )
  }

  // Exclusiones (blacklist)
  if (options?.exclude && options.exclude.length > 0) {
    const excludeSet = new Set(options.exclude.map((c) => c.toUpperCase()))
    list = list.filter(
      (c) =>
        !excludeSet.has(c.code.toUpperCase()) &&
        (!c.iso3 || !excludeSet.has(c.iso3.toUpperCase())) &&
        !excludeSet.has(c.dialCode)
    )
  }

  // Ordenamiento base
  const sortBy = options?.sortBy ?? 'name'
  const direction = options?.sortDirection === 'desc' ? -1 : 1

  if (sortBy !== 'none') {
    list.sort((a, b) => {
      let valA = ''
      let valB = ''
      if (sortBy === 'name') {
        valA = a.name
        valB = b.name
      } else if (sortBy === 'nameEn') {
        valA = a.nameEn || a.name
        valB = b.nameEn || b.name
      } else if (sortBy === 'code') {
        valA = a.code
        valB = b.code
      } else if (sortBy === 'iso3') {
        valA = a.iso3 || a.code
        valB = b.iso3 || b.code
      } else if (sortBy === 'dialCode') {
        const numA = parseInt(a.dialCode.replace(/\D/g, ''), 10) || 0
        const numB = parseInt(b.dialCode.replace(/\D/g, ''), 10) || 0
        return (numA - numB) * direction
      }
      return valA.localeCompare(valB, 'es', { sensitivity: 'base' }) * direction
    })
  }

  // Priorización explícita (solo si se pasa en options.priority)
  if (options?.priority && options.priority.length > 0) {
    const priorityUpper = options.priority.map((p) => p.toUpperCase())
    const priorityMap = new Map<string, number>()
    priorityUpper.forEach((code, idx) => priorityMap.set(code, idx))

    const prioritized: CountryData[] = []
    const others: CountryData[] = []

    for (const c of list) {
      if (priorityMap.has(c.code.toUpperCase()) || (c.iso3 && priorityMap.has(c.iso3.toUpperCase()))) {
        prioritized.push(c)
      } else {
        others.push(c)
      }
    }

    prioritized.sort((a, b) => {
      const idxA = priorityMap.get(a.code.toUpperCase()) ?? (a.iso3 ? priorityMap.get(a.iso3.toUpperCase()) ?? 999 : 999)
      const idxB = priorityMap.get(b.code.toUpperCase()) ?? (b.iso3 ? priorityMap.get(b.iso3.toUpperCase()) ?? 999 : 999)
      return idxA - idxB
    })

    list = [...prioritized, ...others]
  }

  return list
}

export function findCountryByCode(code?: string, options?: CountryFilterOptions): CountryData {
  const pool = options ? getCountries(options) : COUNTRIES
  if (!code) return pool[0] || DEFAULT_COUNTRY
  const upper = code.toUpperCase()
  return (
    pool.find((c) => c.code === upper || c.iso3 === upper) ||
    COUNTRIES.find((c) => c.code === upper || c.iso3 === upper) ||
    pool[0] ||
    DEFAULT_COUNTRY
  )
}

export function findCountryByDialCode(dialCode?: string, options?: CountryFilterOptions): CountryData | undefined {
  if (!dialCode) return undefined
  const pool = options ? getCountries(options) : COUNTRIES
  return pool.find((c) => c.dialCode === dialCode) || COUNTRIES.find((c) => c.dialCode === dialCode)
}

export function searchCountries(query: string, options?: CountryFilterOptions): CountryData[] {
  const baseList = getCountries(options)
  if (!query.trim()) return baseList
  const q = query.toLowerCase().trim()
  return baseList.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      (c.nameEn && c.nameEn.toLowerCase().includes(q)) ||
      c.code.toLowerCase().includes(q) ||
      (c.iso3 && c.iso3.toLowerCase().includes(q)) ||
      c.dialCode.includes(q)
  )
}

export function detectCountryFromPhone(
  phone: string,
  options?: CountryFilterOptions
): { country: CountryData; nationalNumber: string } {
  const pool = options ? getCountries(options) : COUNTRIES
  const fallback = pool[0] || DEFAULT_COUNTRY
  if (!phone) return { country: fallback, nationalNumber: '' }
  const cleaned = phone.trim()
  const sorted = [...pool].sort((a, b) => b.dialCode.length - a.dialCode.length)
  for (const c of sorted) {
    if (cleaned.startsWith(c.dialCode)) {
      return {
        country: c,
        nationalNumber: cleaned.slice(c.dialCode.length).trim(),
      }
    }
  }
  return { country: fallback, nationalNumber: cleaned }
}
