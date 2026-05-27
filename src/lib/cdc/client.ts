// ============================================
// SARIQAMA — CDC Travel Notices RSS client
// Fuente: https://wwwnc.cdc.gov/travel/rss/notices.xml
// Caché: 6 horas (CDC actualiza varias veces al día)
// ============================================

import { unstable_cache } from 'next/cache'
import type { CdcNotice, CdcAlertLevel } from './types'

const CDC_RSS_URL = 'https://wwwnc.cdc.gov/travel/rss/notices.xml'

// ── Palabras clave por destino ────────────────────────────────────────────
//
// Regla de matching (en orden):
//  1. País aparece en el TÍTULO → directo, siempre relevante
//  2. País aparece en la DESCRIPCIÓN (Country List del CDC) → relevante
//     (isRegional = true si el título usa una región, no el país directamente)
//  3. Solo keyword regional sin mención del país → NO relevante
//
// Esto evita que "Global Dengue" aparezca en Chile si Chile no está
// en el Country List, y que "Hantavirus South America" aparezca en Brasil
// si la alerta solo nombra Argentina y Chile.

const COUNTRY_KEYWORDS: Record<string, string[]> = {
  mx: ['mexico', 'mexican'],
  cr: ['costa rica'],
  do: ['dominican republic'],
  br: ['brazil', 'brazilian'],
  cl: ['chile', 'chilean'],
}

// Keywords regionales — usados SOLO para marcar isRegional=true cuando
// el país ya fue confirmado en la descripción
const REGIONAL_TITLE_KEYWORDS: Record<string, string[]> = {
  mx: ['americas', 'latin america', 'central america', 'north america', 'global'],
  cr: ['americas', 'latin america', 'central america', 'global'],
  do: ['americas', 'latin america', 'caribbean', 'global'],
  br: ['americas', 'latin america', 'south america', 'global'],
  cl: ['americas', 'latin america', 'south america', 'global'],
}

// ── XML parsing sin dependencias externas ──────────────────────────────────

interface RawItem {
  title: string
  description: string
  link: string
  pubDate: string
}

function extractTag(block: string, tag: string): string {
  // Intenta extraer CDATA primero, luego texto plano
  const cdata = block.match(new RegExp(`<${tag}><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`))
  if (cdata) return cdata[1].trim()
  const plain = block.match(new RegExp(`<${tag}>([^<]*)<\\/${tag}>`))
  return plain ? plain[1].trim() : ''
}

function parseRss(xml: string): RawItem[] {
  const items: RawItem[] = []
  const itemRegex = /<item>([\s\S]*?)<\/item>/g
  let match
  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1]
    const title = extractTag(block, 'title')
    if (!title) continue
    items.push({
      title,
      description: extractTag(block, 'description'),
      link:        extractTag(block, 'link'),
      pubDate:     extractTag(block, 'pubDate'),
    })
  }
  return items
}

// ── Transform ──────────────────────────────────────────────────────────────

const LEVEL_LABELS: Record<CdcAlertLevel, string> = {
  1: 'Watch',
  2: 'Alert',
  3: 'Warning',
}

const LEVEL_LABELS_ES: Record<CdcAlertLevel, string> = {
  1: 'Vigilancia',
  2: 'Alerta',
  3: 'Advertencia',
}

function parseLevel(title: string): CdcAlertLevel {
  const m = title.match(/^Level\s+(\d)/i)
  const n = m ? parseInt(m[1]) : 1
  return (n >= 1 && n <= 3 ? n : 1) as CdcAlertLevel
}

function parseDiseaseAndLocation(title: string): { disease: string; location: string } {
  // Formato: "Level N - Disease Name in Location"
  const withoutLevel = title.replace(/^Level\s+\d+\s*-\s*/i, '').trim()
  const inIdx = withoutLevel.lastIndexOf(' in ')
  if (inIdx !== -1) {
    return {
      disease:  withoutLevel.slice(0, inIdx).trim(),
      location: withoutLevel.slice(inIdx + 4).trim(),
    }
  }
  return { disease: withoutLevel, location: '' }
}

function formatDate(pubDate: string): string {
  try {
    return new Date(pubDate).toLocaleDateString('es-CL', {
      day: 'numeric', month: 'long', year: 'numeric',
    })
  } catch {
    return pubDate
  }
}

function toIso(pubDate: string): string {
  try { return new Date(pubDate).toISOString() } catch { return pubDate }
}

// ── Relevance check ────────────────────────────────────────────────────────

function isRelevantForDestination(
  item: RawItem,
  isoCode: string,
): { relevant: boolean; isRegional: boolean } {
  const titleLower = item.title.toLowerCase()
  const descLower  = item.description.toLowerCase()
  const countryKws = COUNTRY_KEYWORDS[isoCode] ?? []

  // 1. País en el título → directo e inequívoco
  const inTitle = countryKws.some(kw => titleLower.includes(kw))
  if (inTitle) return { relevant: true, isRegional: false }

  // 2. País en la descripción (Country List del CDC)
  //    Solo se acepta si el nombre del país aparece explícitamente,
  //    lo que confirma que la alerta nombra ese país en concreto.
  const inDesc = countryKws.some(kw => descLower.includes(kw))
  if (inDesc) {
    // isRegional = true cuando el título usa una región ("Global X", "Americas")
    const regionalKws = REGIONAL_TITLE_KEYWORDS[isoCode] ?? []
    const titleIsRegional = regionalKws.some(kw => titleLower.includes(kw))
    return { relevant: true, isRegional: titleIsRegional }
  }

  // 3. Solo keyword regional sin confirmar el país → no relevante
  return { relevant: false, isRegional: false }
}

// ── Main fetch function ────────────────────────────────────────────────────

async function _fetchCdcNotices(isoCode: string): Promise<CdcNotice[]> {
  try {
    const res = await fetch(CDC_RSS_URL, {
      headers: { Accept: 'application/rss+xml, application/xml, text/xml' },
      signal: AbortSignal.timeout(8000),
      next: { revalidate: 21600, tags: ['cdc-rss'] }, // 6 horas
    })

    if (!res.ok) {
      console.error(`[CDC RSS] HTTP ${res.status}`)
      return []
    }

    const xml = await res.text()
    const rawItems = parseRss(xml)

    const notices: CdcNotice[] = []

    for (const item of rawItems) {
      const { relevant, isRegional } = isRelevantForDestination(item, isoCode)
      if (!relevant) continue

      const level = parseLevel(item.title)
      const { disease } = parseDiseaseAndLocation(item.title)

      notices.push({
        title:          item.title,
        titleEs:        `${LEVEL_LABELS_ES[level]}: ${disease}`,
        disease,
        level,
        levelLabel:     LEVEL_LABELS[level],
        description:    item.description,
        link:           item.link,
        pubDate:        toIso(item.pubDate),
        pubDateFormatted: formatDate(item.pubDate),
        isRegional,
      })
    }

    // Ordenar por nivel descendente (más grave primero), luego por fecha
    return notices.sort((a, b) => {
      if (b.level !== a.level) return b.level - a.level
      return new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
    })
  } catch (err) {
    console.error('[CDC RSS] Error:', err)
    return []
  }
}

/**
 * Obtiene las alertas de viaje del CDC relevantes para un destino.
 * Caché de 6 horas. Retorna array vacío si falla.
 *
 * @param isoCode — pais_code de SARIQAMA: 'mx' | 'br' | 'cr' | 'do' | 'cl'
 */
export const fetchCdcNotices = unstable_cache(
  _fetchCdcNotices,
  ['cdc-notices'],
  { revalidate: 21600, tags: ['cdc-rss'] },
)
