import { z } from 'zod'

// ── Auth ──────────────────────────────────────────────────────────────────────

export const registroSchema = z.object({
  email: z.string().email('Correo inválido').max(254),
  password: z.string().min(8, 'Mínimo 8 caracteres').max(128),
  nombreFamilia: z.string().min(1, 'Nombre requerido').max(80).trim(),
})

export const loginSchema = z.object({
  email: z.string().email().max(254),
  password: z.string().min(1).max(128),
})

// ── Viajero ───────────────────────────────────────────────────────────────────

const CONDICIONES_VALIDAS = [
  'ninguna', 'alergia', 'asma', 'diabetes', 'cardiopatia',
  'inmunosupresion', 'embarazo', 'otra',
] as const

const GENEROS_VALIDOS = [
  'masculino', 'femenino', 'no_binario', 'genero_fluido', 'no_indicado',
] as const

const SEXOS_VALIDOS = ['masculino', 'femenino', 'intersexual', 'no_indicado'] as const

export const viajeroSchema = z.object({
  nombre:                  z.string().min(1).max(80).trim(),
  apellido:                z.string().max(80).trim().optional(),
  edad:                    z.number().int().min(0).max(120),
  sexo:                    z.enum(SEXOS_VALIDOS).optional(),
  genero:                  z.enum(GENEROS_VALIDOS).optional(),
  condiciones:             z.array(z.enum(CONDICIONES_VALIDAS)).max(8),
  inmunosupresion_tipo:    z.string().max(200).trim().optional(),
  vih_carga_viral:         z.string().max(200).trim().optional(),
  embarazo_fum:            z.string().max(20).trim().optional(),
  alergia_tipos:           z.array(z.string().max(100)).max(20).optional(),
  alergia_huevo:           z.boolean().optional(),
  alergia_plv:             z.boolean().optional(),
  alergia_farmacos_cuales: z.string().max(300).trim().optional(),
})

// ── Viaje ─────────────────────────────────────────────────────────────────────

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/

const TIPOS_VALIDOS = [
  'playa', 'urbano', 'aventura', 'rural', 'familiar', 'crucero', 'estudio', 'trabajo',
] as const

const SEGUROS_VALIDOS = ['si', 'no', 'no_decidido'] as const

export const crearViajeSchema = z.object({
  destino_slug:    z.string().min(1).max(80).regex(/^[a-z0-9-]+$/),
  destino_nombre:  z.string().min(1).max(120).trim(),
  fecha_salida:    z.string().regex(ISO_DATE_RE, 'Fecha inválida'),
  fecha_regreso:   z.string().regex(ISO_DATE_RE, 'Fecha inválida'),
  tipo:            z.enum(TIPOS_VALIDOS),
  tipos:           z.array(z.enum(TIPOS_VALIDOS)).min(1).max(7),
  escalas:         z.array(z.object({
    destino: z.string().max(120).trim(),
    horas:   z.number().int().min(0).max(720),
  })).max(10),
  seguro_viaje:    z.enum(SEGUROS_VALIDOS).optional(),
  seguro_compania: z.string().max(100).trim().optional(),
})

export const editarViajeSchema = z.object({
  fecha_salida:    z.string().regex(ISO_DATE_RE),
  fecha_regreso:   z.string().regex(ISO_DATE_RE),
  tipos:           z.array(z.enum(TIPOS_VALIDOS)).min(1).max(7),
  seguro_viaje:    z.enum(SEGUROS_VALIDOS).optional(),
  seguro_compania: z.string().max(100).trim().optional(),
})

// ── Síntomas ──────────────────────────────────────────────────────────────────

const SINTOMAS_VALIDOS = [
  'fiebre', 'fiebre_alta', 'fiebre_persistente',
  'diarrea', 'diarrea_con_sangre',
  'vomitos', 'cefalea_intensa', 'rash_manchas',
  'dolor_abdominal', 'decaimiento_marcado', 'sangrado',
  'dificultad_respiratoria', 'rechazo_liquidos',
  'llanto_sin_lagrimas', 'baja_orina',
] as const

const EXPOSICIONES_VALIDAS = [
  'picadura_mosquito', 'mordedura_animal', 'agua_no_segura',
] as const

const SEMAFORO_VALIDO = ['verde', 'amarillo', 'rojo'] as const

export const guardarSintomasSchema = z.object({
  viaje_id:       z.string().uuid(),
  viajero_id:     z.string().uuid().optional(),
  viajero_nombre: z.string().max(100).trim().optional(),
  sintomas:       z.array(z.enum(SINTOMAS_VALIDOS)).max(20),
  semaforo:       z.enum(SEMAFORO_VALIDO),
  fiebre:         z.boolean(),
  dias_sintomas:  z.number().int().min(1).max(30),
  titulo:         z.string().max(200).trim(),
  exposiciones:   z.array(z.enum(EXPOSICIONES_VALIDAS)).max(3),
  acciones:       z.array(z.string().max(500)).max(10),
})
