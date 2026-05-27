// ============================================
// SARIQAMA — Destinos piloto
// Fuente: CDC Yellow Book 2026
// Revisado: 2026-05
// ============================================

import type { Destino } from '@/types'

export const DESTINOS_PILOTO: Destino[] = [
  // ── CENTROAMÉRICA ─────────────────────────────────────────────
  {
    id: 'mexico',
    slug: 'mexico',
    nombre: 'México',
    pais: 'México',
    pais_flag: '🇲🇽',
    pais_code: 'mx',
    continente: 'Centroamérica',
    region: 'América del Norte / Caribe',
    ciudades: [
      'Cancún / Riviera Maya',
      'Ciudad de México',
      'Los Cabos',
      'Puerto Vallarta',
      'Playa del Carmen',
      'Oaxaca',
      'Mérida / Yucatán',
    ],
    riesgos: {
      dengue: 'moderado',
      malaria: 'bajo',
      fiebre_amarilla: 'no_aplica',
      diarrea_viajero: 'alto',
      agua_alimentos: 'alto',
      rabia_animales: 'moderado',
      sol_calor: 'alto',
      seguridad_acuatica: 'moderado',
      notas_pediatricas:
        'Diarrea del viajero muy frecuente. No dar agua de la llave. Cuidado con alimentos en puestos callejeros.',
    },
    vacunas_recomendadas: ['Hepatitis A', 'Hepatitis B', 'Tifoidea'],
    vacunas_requeridas: [],
    fuente: 'CDC Yellow Book 2026 — Mexico',
    revisado_at: '2026-05-01',
    aprobado: true,
  },

  {
    id: 'costa-rica',
    slug: 'costa-rica',
    nombre: 'Costa Rica',
    pais: 'Costa Rica',
    pais_flag: '🇨🇷',
    pais_code: 'cr',
    continente: 'Centroamérica',
    region: 'Centroamérica',
    ciudades: [
      'Guanacaste / Nicoya',
      'Manuel Antonio',
      'San José',
      'Arenal / La Fortuna',
      'Puerto Viejo / Caribe',
      'Tortuguero',
      'Monteverde',
    ],
    riesgos: {
      dengue: 'alto',
      malaria: 'bajo',
      fiebre_amarilla: 'no_aplica',
      diarrea_viajero: 'moderado',
      agua_alimentos: 'moderado',
      rabia_animales: 'moderado',
      sol_calor: 'alto',
      seguridad_acuatica: 'alto',
      notas_pediatricas:
        'Seguridad acuática importante en playas del Pacífico. Mordedura de serpiente en zonas de aventura.',
    },
    vacunas_recomendadas: ['Hepatitis A', 'Hepatitis B', 'Tifoidea'],
    vacunas_requeridas: [],
    fuente: 'CDC Yellow Book 2026 — Costa Rica',
    revisado_at: '2026-05-01',
    aprobado: true,
  },

  {
    id: 'republica-dominicana',
    slug: 'republica-dominicana',
    nombre: 'República Dominicana',
    pais: 'República Dominicana',
    pais_flag: '🇩🇴',
    pais_code: 'do',
    continente: 'Centroamérica',
    region: 'Caribe',
    ciudades: [
      'Punta Cana',
      'Santo Domingo',
      'La Romana',
      'Puerto Plata',
      'Samaná',
      'Bávaro',
    ],
    riesgos: {
      dengue: 'alto',
      malaria: 'moderado',
      fiebre_amarilla: 'no_aplica',
      diarrea_viajero: 'alto',
      agua_alimentos: 'alto',
      rabia_animales: 'moderado',
      sol_calor: 'alto',
      seguridad_acuatica: 'moderado',
      notas_pediatricas:
        'Malaria presente en zonas rurales y fronterizas. Repelente obligatorio. Agua embotellada siempre.',
    },
    vacunas_recomendadas: [
      'Hepatitis A',
      'Hepatitis B',
      'Tifoidea',
      'Sarampión/Rubeola/Paperas',
    ],
    vacunas_requeridas: [],
    fuente: 'CDC Yellow Book 2026 — Dominican Republic',
    revisado_at: '2026-05-01',
    aprobado: true,
  },

  // ── SUDAMÉRICA ────────────────────────────────────────────────
  {
    id: 'brasil',
    slug: 'brasil',
    nombre: 'Brasil',
    pais: 'Brasil',
    pais_flag: '🇧🇷',
    pais_code: 'br',
    continente: 'Sudamérica',
    region: 'América del Sur',
    ciudades: [
      'Salvador de Bahía',
      'Fortaleza',
      'Natal',
      'Recife',
      'Florianópolis',
      'Río de Janeiro',
      'São Paulo',
      'Manaos / Amazonia',
    ],
    riesgos: {
      dengue: 'muy_alto',
      malaria: 'bajo',
      fiebre_amarilla: 'moderado',
      diarrea_viajero: 'alto',
      agua_alimentos: 'alto',
      rabia_animales: 'moderado',
      sol_calor: 'alto',
      seguridad_acuatica: 'moderado',
      notas_pediatricas:
        'Dengue especialmente relevante en niños: puede evolucionar rápido. Uso estricto de repelente DEET 10–30% desde los 2 meses (aplicar en ropa en lactantes). La Picaridina (Icaridina) es alternativa, pero no está disponible en Chile.',
    },
    vacunas_recomendadas: [
      'Fiebre amarilla (muy recomendada)',
      'Hepatitis A',
      'Hepatitis B',
      'Tifoidea',
      'Sarampión/Rubeola/Paperas',
    ],
    vacunas_requeridas: [],
    fuente: 'CDC Yellow Book 2026 — Brazil',
    revisado_at: '2026-05-01',
    aprobado: true,
  },

  {
    id: 'chile',
    slug: 'chile',
    nombre: 'Chile',
    pais: 'Chile',
    pais_flag: '🇨🇱',
    pais_code: 'cl',
    continente: 'Sudamérica',
    region: 'América del Sur',
    ciudades: [
      'Santiago',
      'Viña del Mar / Valparaíso',
      'San Pedro de Atacama',
      'Torres del Paine / Patagonia',
      'Chiloé',
      'Iquique / Norte Grande',
      'Puerto Montt / Los Lagos',
    ],
    riesgos: {
      dengue: 'no_aplica',
      malaria: 'no_aplica',
      fiebre_amarilla: 'no_aplica',
      diarrea_viajero: 'bajo',
      agua_alimentos: 'bajo',
      rabia_animales: 'bajo',
      sol_calor: 'moderado',
      seguridad_acuatica: 'moderado',
      notas_pediatricas:
        'Chile es un destino de bajo riesgo infeccioso. Principal precaución: protección solar (UV alto en norte y sur) y seguridad en playas del Pacífico con corrientes frías.',
    },
    vacunas_recomendadas: ['Hepatitis A', 'Hepatitis B'],
    vacunas_requeridas: [],
    fuente: 'CDC Yellow Book 2026 — Chile',
    revisado_at: '2026-05-01',
    aprobado: true,
  },
]

// Slugs de compatibilidad con viajes anteriores (no eliminar)
const SLUG_ALIASES: Record<string, string> = {
  'brasil-nordeste':             'brasil',
  'caribe-republica-dominicana': 'republica-dominicana',
  'centroamerica-costa-rica':    'costa-rica',
  'mexico-cancun-riviera':       'mexico',
}

export function getDestinoBySlug(slug: string): Destino | undefined {
  const resolvedSlug = SLUG_ALIASES[slug] ?? slug
  return DESTINOS_PILOTO.find((d) => d.slug === resolvedSlug)
}

export function buscarDestinos(query: string): Destino[] {
  const q = query.toLowerCase()
  return DESTINOS_PILOTO.filter(
    (d) =>
      d.nombre.toLowerCase().includes(q) ||
      d.pais.toLowerCase().includes(q) ||
      d.region.toLowerCase().includes(q)
  )
}

// Agrupados por continente para el selector
export const DESTINOS_POR_CONTINENTE: Record<string, Destino[]> = {
  'Centroamérica': DESTINOS_PILOTO.filter(d => d.continente === 'Centroamérica'),
  'Sudamérica':    DESTINOS_PILOTO.filter(d => d.continente === 'Sudamérica'),
}
