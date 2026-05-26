// ============================================
// SARIQAMA — TuGo Travel Advisory API types
// https://developer.tugo.com/docs/read/travelsafe/v1/country
// ============================================

// ── Raw TuGo API response ──────────────────────────────────────────────────

export interface TugoInfoItem {
  category: string
  description: string
}

export interface TugoCountryResponse {
  code: string
  name: string
  publishedDate: string
  advisoryState: string
  advisoryText: string
  hasAdvisoryWarning: boolean
  hasRegionalAdvisory: boolean
  recentUpdates: string
  health?: {
    description: string
    healthInfo: TugoInfoItem[]
    diseasesAndVaccinesInfo: TugoInfoItem[]
  }
  safety?: {
    description: string
    safetyInfo: TugoInfoItem[]
  }
  advisory?: {
    description: string
    regionalAdvisories: { category: string; description: string }[]
  }
}

// ── SARIQAMA simplified format (post-transform) ────────────────────────────

/**
 * Advisory level 1-4 following Government of Canada convention:
 *  1 = Exercise normal safety precautions
 *  2 = Exercise a high degree of caution
 *  3 = Avoid non-essential travel
 *  4 = Avoid all travel
 */
export type AdvisoryLevel = 1 | 2 | 3 | 4

export interface TugoDisease {
  category: string     // Original English category from TuGo
  categoryEs: string   // Translated to Spanish
  description: string
}

export interface TugoAdvisory {
  isoCode: string        // pais_code de SARIQAMA (lowercase): 'mx', 'br', etc.
  countryName: string
  advisoryLevel: AdvisoryLevel
  advisoryState: string  // Original advisory state text (English)
  advisoryStateEs: string // Translated to Spanish
  advisoryText: string
  hasWarning: boolean
  recentUpdates: string
  healthDescription: string
  diseases: TugoDisease[]
  publishedDate: string
  fetchedAt: string
}
