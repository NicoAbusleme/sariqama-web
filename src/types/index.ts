// ============================================
// SARIQAMA — Tipos globales
// ============================================

export type SemaforoColor = 'verde' | 'amarillo' | 'rojo'

export type TipoViaje =
  | 'playa'
  | 'urbano'
  | 'aventura'
  | 'rural'
  | 'familiar'
  | 'crucero'
  | 'estudio'
  | 'trabajo'

export type CategoriaChecklist =
  | 'vacunas'
  | 'botiquin'
  | 'documentos'
  | 'repelente'
  | 'seguro'
  | 'otros'

export type CondicionMedica =
  | 'ninguna'
  | 'alergia'
  | 'embarazo'
  | 'inmunosupresion'
  | 'diabetes'
  | 'asma'
  | 'cardiopatia'
  | 'otra'

// Familia
export interface Familia {
  id: string
  nombre: string
  created_at: string
}

// Viajero
export interface Viajero {
  id: string
  familia_id: string
  nombre: string
  edad: number
  es_nino: boolean // < 18 años
  condiciones: CondicionMedica[]
  medicacion_habitual?: string
}

// Viaje
export interface Viaje {
  id: string
  familia_id: string
  destinos: Destino[]
  fecha_salida: string
  fecha_regreso: string
  tipo: TipoViaje
  notas?: string
  created_at: string
}

// Destino
export interface Destino {
  id: string
  slug: string
  nombre: string
  pais: string
  pais_flag: string           // emoji bandera del país
  continente: string          // 'Centroamérica' | 'Sudamérica'
  region: string
  ciudades: string[]          // ciudades o zonas seleccionables
  riesgos: RiesgoDestino
  vacunas_recomendadas: string[]
  vacunas_requeridas: string[]
  fuente: string
  revisado_at: string
  aprobado: boolean
}

// Riesgos del destino
export interface RiesgoDestino {
  dengue: NivelRiesgo
  malaria: NivelRiesgo
  fiebre_amarilla: NivelRiesgo
  diarrea_viajero: NivelRiesgo
  agua_alimentos: NivelRiesgo
  rabia_animales: NivelRiesgo
  sol_calor: NivelRiesgo
  seguridad_acuatica: NivelRiesgo
  notas_pediatricas?: string
}

export type NivelRiesgo = 'bajo' | 'moderado' | 'alto' | 'muy_alto' | 'no_aplica'

// Escala de viaje
export interface Escala {
  destino: string
  horas: number
}

// Item del checklist
export interface ChecklistItem {
  id: string
  viaje_id: string
  tarea: string
  descripcion?: string
  categoria: CategoriaChecklist
  completado: boolean
  fecha_limite?: string
  prioridad: 'alta' | 'media' | 'baja'
}

// Registro de síntomas
export interface RegistroSintomas {
  id: string
  viaje_id: string
  viajero_id: string
  fecha: string
  sintomas: string[]
  fiebre?: number
  dias_sintomas: number
  semaforo: SemaforoColor
  recomendacion: string
}

// Solicitud de teleorientación
export interface Teleorientacion {
  id: string
  familia_id: string
  viaje_id?: string
  motivo: string
  urgencia: SemaforoColor
  resumen_caso: string
  estado: 'pendiente' | 'confirmada' | 'completada' | 'cancelada'
  pago_estado: 'pendiente' | 'pagado'
  created_at: string
}
