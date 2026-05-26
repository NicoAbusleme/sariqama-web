// ============================================
// SARIQAMA — TuGo API client
// Consulta la Travel Advisory API con caché de 24 h
// ============================================

import { unstable_cache } from 'next/cache'
import type { TugoCountryResponse, TugoAdvisory } from './types'
import { transformTugoResponse } from './transform'

const TUGO_BASE = 'https://api.tugo.com/v1/travelsafe/countries'

// Mapeo pais_code SARIQAMA (lowercase) → ISO 3166-1 alpha-2 (uppercase) que usa TuGo
const ISO_MAP: Record<string, string> = {
  mx: 'MX',
  cr: 'CR',
  do: 'DO',
  br: 'BR',
  cl: 'CL',
}

async function _fetchAdvisory(isoCode: string): Promise<TugoAdvisory | null> {
  const apiKey = process.env.TUGO_API_KEY

  // Degrada graciosamente si la key no está configurada
  if (!apiKey || apiKey.startsWith('tu_')) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('[TuGo] TUGO_API_KEY no configurada — sección de alerta omitida')
    }
    return null
  }

  const tugoCode = ISO_MAP[isoCode]
  if (!tugoCode) {
    console.warn(`[TuGo] Sin mapeo ISO para código: ${isoCode}`)
    return null
  }

  try {
    const res = await fetch(`${TUGO_BASE}/${tugoCode}`, {
      headers: {
        'X-Auth-API-Key': apiKey,
        Accept: 'application/json',
      },
      // Cache a nivel de fetch: 24 h
      next: { revalidate: 86400, tags: [`tugo-${isoCode}`] },
    })

    if (!res.ok) {
      console.error(`[TuGo] HTTP ${res.status} para ${tugoCode}`)
      return null
    }

    const data: TugoCountryResponse = await res.json()
    return transformTugoResponse(isoCode, data)
  } catch (err) {
    console.error(`[TuGo] Error consultando ${tugoCode}:`, err)
    return null
  }
}

/**
 * Obtiene la alerta de viaje para un destino con caché de 24 h.
 * Retorna null si la API key no está configurada o la consulta falla.
 *
 * @param isoCode — pais_code de SARIQAMA en minúsculas: 'mx', 'br', 'cr', 'do', 'cl'
 */
export const fetchTugoAdvisory = unstable_cache(
  _fetchAdvisory,
  ['tugo-advisory'],
  { revalidate: 86400, tags: ['tugo'] },
)
