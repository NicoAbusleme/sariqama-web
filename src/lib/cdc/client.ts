// ============================================
// SARIQAMA — CDC Travel Notices RSS client
// Fuente: https://wwwnc.cdc.gov/travel/rss/notices.xml
// Caché: 6 horas (CDC actualiza varias veces al día)
// ============================================

import { unstable_cache } from 'next/cache'
import type { CdcNotice, CdcAlertLevel } from './types'

const CDC_RSS_URL = 'https://wwwnc.cdc.gov/travel/rss/notices.xml'

// ── Palabras clave por destino (para matching directo en title/description) ─

const COUNTRY_KEYWORDS: Record<string, string[]> = {
  mx: ['mexico', 'mexican'],
  cr: ['costa rica'],
  do: ['dominican republic'],
  br: ['brazil', 'brazil,', 'brazilian'],
  cl: ['chile', 'chile,', 'chilean'],
}

// Términos regionales que aplican a cada destino
const REGIONAL_KEYWORDS: Record<string, string[]> = {
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
  const searchText = `${item.title} ${item.description}`.toLowerCase()

  // 1. Directo: el país aparece explícitamente
  const countryKws = COUNTRY_KEYWORDS[isoCode] ?? []
  if (countryKws.some(kw => searchText.includes(kw))) {
    return { relevant: true, isRegional: false }
  }

  // 2. Regional: término de región que incluye este destino
  const regionalKws = REGIONAL_KEYWORDS[isoCode] ?? []
  if (regionalKws.some(kw => searchText.includes(kw))) {
    return { relevant: true, isRegional: true }
  }

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
