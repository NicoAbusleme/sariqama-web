// ============================================
// TROPICARE — Lógica determinística del semáforo
// SIN IA — reglas clínicas validadas
// Basado en CDC Yellow Book 2026
// ============================================

import type { SemaforoColor } from '@/types'

export interface EvaluacionSintomas {
  // Síntomas generales
  fiebre: boolean
  fiebre_alta: boolean       // > 38.5°C
  fiebre_persistente: boolean // > 48h
  diarrea: boolean
  diarrea_con_sangre: boolean
  vomitos: boolean
  dolor_abdominal: boolean
  cefalea_intensa: boolean
  rash_manchas: boolean
  sangrado: boolean
  decaimiento_marcado: boolean
  dificultad_respiratoria: boolean
  // Específicos niños
  rechazo_liquidos: boolean
  baja_orina: boolean
  llanto_sin_lagrimas: boolean
  // Exposición
  picadura_mosquito: boolean
  mordedura_animal: boolean
  agua_no_segura: boolean
  // Contexto
  es_nino: boolean
  embarazada: boolean
  inmunosuprimido: boolean
  dias_sintomas: number
}

export interface ResultadoSemaforo {
  color: SemaforoColor
  titulo: string
  descripcion: string
  acciones: string[]
  requiere_urgencia: boolean
  requiere_teleorientacion: boolean
  disclaimer: string
}

const DISCLAIMER =
  'TROPICARE entrega orientación sanitaria y no reemplaza una evaluación médica. Si los síntomas empeoran, busca atención de salud.'

// Señales de alarma absolutas → ROJO inmediato
const SIGNOS_ALARMA_ABSOLUTOS = (s: EvaluacionSintomas): boolean =>
  s.dificultad_respiratoria ||
  s.sangrado ||
  s.diarrea_con_sangre ||
  (s.es_nino && s.rechazo_liquidos) ||
  (s.es_nino && s.llanto_sin_lagrimas) ||
  (s.es_nino && s.baja_orina) ||
  (s.fiebre_alta && s.fiebre_persistente) ||
  (s.cefalea_intensa && s.fiebre) ||
  (s.rash_manchas && s.fiebre) ||
  s.mordedura_animal ||
  (s.embarazada && s.fiebre) ||
  (s.inmunosuprimido && s.fiebre)

// Señales de alerta → AMARILLO
const SIGNOS_ALERTA = (s: EvaluacionSintomas): boolean =>
  s.fiebre ||
  s.fiebre_alta ||
  (s.diarrea && s.dias_sintomas >= 2) ||
  (s.vomitos && s.dias_sintomas >= 2) ||
  s.decaimiento_marcado ||
  s.cefalea_intensa ||
  s.rash_manchas ||
  (s.picadura_mosquito && s.fiebre) ||
  (s.es_nino && s.diarrea) ||
  (s.es_nino && s.vomitos)

export function evaluarSemaforo(s: EvaluacionSintomas): ResultadoSemaforo {
  if (SIGNOS_ALARMA_ABSOLUTOS(s)) {
    return {
      color: 'rojo',
      titulo: 'Atención médica urgente',
      descripcion:
        'Presenta señales de alarma que requieren evaluación médica inmediata. No esperes.',
      acciones: [
        'Busca el servicio de urgencias o emergencias más cercano',
        'Si estás viajando, contacta al seguro de viaje ahora',
        'No uses medicamentos sin indicación médica',
        s.mordedura_animal
          ? 'La mordedura de animal en zona endémica requiere evaluación urgente por riesgo de rabia'
          : '',
      ].filter(Boolean),
      requiere_urgencia: true,
      requiere_teleorientacion: false,
      disclaimer: DISCLAIMER,
    }
  }

  if (SIGNOS_ALERTA(s)) {
    return {
      color: 'amarillo',
      titulo: 'Consulta orientación profesional',
      descripcion:
        'Tus síntomas requieren evaluación. Te recomendamos hablar con un profesional de salud antes de continuar.',
      acciones: [
        'Solicita una teleorientación con TROPICARE',
        'Mantén buena hidratación (agua o suero oral)',
        'Registra la evolución de los síntomas en el diario',
        s.es_nino
          ? 'En niños, el deterioro puede ser más rápido — consulta pronto'
          : '',
        s.picadura_mosquito && s.fiebre
          ? 'La combinación de picadura + fiebre en zona tropical requiere evaluación'
          : '',
      ].filter(Boolean),
      requiere_urgencia: false,
      requiere_teleorientacion: true,
      disclaimer: DISCLAIMER,
    }
  }

  return {
    color: 'verde',
    titulo: 'Sin señales de alarma',
    descripcion:
      'Por ahora no identificamos señales de alarma. Sigue las medidas preventivas y registra cualquier cambio.',
    acciones: [
      'Continúa con las medidas preventivas habituales',
      'Usa repelente y ropa adecuada si estás en zona de mosquitos',
      'Mantente hidratado/a',
      'Si aparecen nuevos síntomas, vuelve a esta evaluación',
    ],
    requiere_urgencia: false,
    requiere_teleorientacion: false,
    disclaimer: DISCLAIMER,
  }
}
