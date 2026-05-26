// ============================================
// SARIQAMA — TuGo response transformer
// Convierte la respuesta cruda de TuGo al formato interno de SARIQAMA
// ============================================

import type {
  TugoCountryResponse,
  TugoAdvisory,
  TugoDisease,
  AdvisoryLevel,
} from './types'

// ── Advisory level ────────────────────────────────────────────────────────

function parseAdvisoryLevel(state: string): AdvisoryLevel {
  const s = (state ?? '').toLowerCase()
  if (s.includes('avoid all')) return 4
  if (s.includes('avoid non-essential') || s.includes('avoid non essential')) return 3
  if (s.includes('high degree') || s.includes('high degree of caution')) return 2
  return 1
}

const ADVISORY_STATE_ES: Record<AdvisoryLevel, string> = {
  1: 'Precauciones normales',
  2: 'Alta precaución',
  3: 'Evitar viaje no esencial',
  4: 'Evitar todo viaje',
}

// ── Disease category translation ──────────────────────────────────────────

const CATEGORY_ES: Record<string, string> = {
  'Insects':          'Transmisión por insectos',
  'Food and Water':   'Agua y alimentos',
  'Food/Water':       'Agua y alimentos',
  'Malaria':          'Malaria',
  'Vaccines':         'Vacunas',
  'Animals':          'Animales',
  'Person-to-Person': 'Persona a persona',
  'Other':            'Otros riesgos',
  'Routine':          'Vacunas de rutina',
  'Yellow Fever':     'Fiebre amarilla',
  'Hepatitis B':      'Hepatitis B',
  'Influenza':        'Influenza',
  'Measles':          'Sarampión',
}

function translateCategory(cat: string): string {
  return CATEGORY_ES[cat] ?? cat
}

// ── Main transformer ──────────────────────────────────────────────────────

export function transformTugoResponse(
  isoCode: string,
  data: TugoCountryResponse,
): TugoAdvisory {
  const level = parseAdvisoryLevel(data.advisoryState ?? '')

  const diseases: TugoDisease[] = (data.health?.diseasesAndVaccinesInfo ?? [])
    .filter(item => item.category && item.description?.trim())
    .map(item => ({
      category:   item.category,
      categoryEs: translateCategory(item.category),
      description: item.description.trim(),
    }))

  return {
    isoCode,
    countryName:      data.name ?? '',
    advisoryLevel:    level,
    advisoryState:    data.advisoryState ?? '',
    advisoryStateEs:  ADVISORY_STATE_ES[level],
    advisoryText:     data.advisoryText ?? '',
    hasWarning:       data.hasAdvisoryWarning ?? false,
    recentUpdates:    data.recentUpdates ?? '',
    healthDescription: data.health?.description ?? '',
    diseases,
    publishedDate:    data.publishedDate ?? '',
    fetchedAt:        new Date().toISOString(),
  }
}
