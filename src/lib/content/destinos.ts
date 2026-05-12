// ============================================
// SARIQAMA — Destinos piloto
// Fuente: CDC Yellow Book 2026
// Revisado: 2026-05
// ============================================

import type { Destino } from '@/types'

export const DESTINOS_PILOTO: Destino[] = [
  {
    id: 'brasil-nordeste',
    slug: 'brasil-nordeste',
    nombre: 'Brasil — Nordeste',
    pais: 'Brasil',
    region: 'América del Sur',
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
        'Dengue especialmente relevante en niños. Uso estricto de repelente DEET o Icaridina desde los 2 meses.',
    },
    vacunas_recomendadas: [
      'Fiebre amarilla',
      'Hepatitis A',
      'Hepatitis B',
      'Tifoidea',
      'Sarampión/Rubeola/Paperas',
    ],
    vacunas_requeridas: ['Fiebre amarilla (algunas zonas)'],
    fuente: 'CDC Yellow Book 2026 — Brazil',
    revisado_at: '2026-05-01',
    aprobado: true,
  },
  {
    id: 'caribe-republica-dominicana',
    slug: 'caribe-republica-dominicana',
    nombre: 'Caribe — República Dominicana',
    pais: 'República Dominicana',
    region: 'Caribe',
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
  {
    id: 'centroamerica-costa-rica',
    slug: 'centroamerica-costa-rica',
    nombre: 'Centroamérica — Costa Rica',
    pais: 'Costa Rica',
    region: 'Centroamérica',
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
    vacunas_recomendadas: [
      'Hepatitis A',
      'Hepatitis B',
      'Tifoidea',
    ],
    vacunas_requeridas: [],
    fuente: 'CDC Yellow Book 2026 — Costa Rica',
    revisado_at: '2026-05-01',
    aprobado: true,
  },
  {
    id: 'mexico-cancun-riviera',
    slug: 'mexico-cancun-riviera',
    nombre: 'México — Cancún / Riviera Maya',
    pais: 'México',
    region: 'América del Norte / Caribe',
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
    vacunas_recomendadas: [
      'Hepatitis A',
      'Hepatitis B',
      'Tifoidea',
    ],
    vacunas_requeridas: [],
    fuente: 'CDC Yellow Book 2026 — Mexico',
    revisado_at: '2026-05-01',
    aprobado: true,
  },
]

export function getDestinoBySlug(slug: string): Destino | undefined {
  return DESTINOS_PILOTO.find((d) => d.slug === slug)
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
