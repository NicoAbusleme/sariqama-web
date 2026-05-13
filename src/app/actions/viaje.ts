'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function crearViaje(data: {
  destino_slug: string
  destino_nombre: string
  fecha_salida: string
  fecha_regreso: string
  tipo: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autorizado' }

  const { data: familia } = await supabase
    .from('familias').select('id').eq('user_id', user.id).single()
  if (!familia) return { error: 'Familia no encontrada' }

  const { data: viaje, error } = await supabase
    .from('viajes')
    .insert({ familia_id: familia.id, ...data })
    .select('id')
    .single()

  if (error) return { error: error.message }

  // Generar checklist automático según destino y tipo de viaje
  const items = generarChecklist(data.destino_slug, data.tipo)
  if (items.length > 0) {
    await supabase.from('checklist_items').insert(
      items.map(i => ({ ...i, viaje_id: viaje.id }))
    )
  }

  redirect(`/viaje/${viaje.id}`)
}

export async function eliminarViaje(viajeId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autorizado' }

  const { data: viaje } = await supabase.from('viajes').select('familia_id').eq('id', viajeId).single()
  if (!viaje) return { error: 'Viaje no encontrado' }
  const { data: familia } = await supabase.from('familias').select('id').eq('user_id', user.id).single()
  if (!familia || viaje.familia_id !== familia.id) return { error: 'No autorizado' }

  // Eliminar registros hijos primero
  await supabase.from('sintomas_log').delete().eq('viaje_id', viajeId)
  await supabase.from('checklist_items').delete().eq('viaje_id', viajeId)
  const { error } = await supabase.from('viajes').delete().eq('id', viajeId)

  if (error) return { error: error.message }
  redirect('/dashboard')
}

export async function guardarSintomas(data: {
  viaje_id: string
  viajero_id?: string
  viajero_nombre?: string
  sintomas: string[]
  semaforo: string
  fiebre: boolean
  dias_sintomas: number
  titulo: string
  exposiciones: string[]
  acciones: string[]
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autorizado' }

  const { data: viaje } = await supabase.from('viajes').select('familia_id').eq('id', data.viaje_id).single()
  if (!viaje) return { error: 'Viaje no encontrado' }
  const { data: familia } = await supabase.from('familias').select('id').eq('user_id', user.id).single()
  if (!familia || viaje.familia_id !== familia.id) return { error: 'No autorizado' }

  // fiebre en BD es numeric (temperatura). Lo omitimos ya que está en sintomas[].
  const { error } = await supabase.from('sintomas_log').insert({
    viaje_id:        data.viaje_id,
    viajero_id:      data.viajero_id ?? null,
    viajero_nombre:  data.viajero_nombre ?? null,
    sintomas:        data.sintomas,
    semaforo:        data.semaforo,
    dias_sintomas:   data.dias_sintomas,
    titulo:          data.titulo,
    exposiciones:    data.exposiciones,
    acciones:        data.acciones,
  })

  if (error) return { error: error.message }

  revalidatePath(`/viaje/${data.viaje_id}/sintomas`)
  return { ok: true }
}

export async function toggleChecklistItem(itemId: string, completado: boolean, viajeId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autorizado' }

  // Verify ownership via viaje → familia
  const { data: viaje } = await supabase.from('viajes').select('familia_id').eq('id', viajeId).single()
  if (!viaje) return { error: 'Viaje no encontrado' }
  const { data: familia } = await supabase.from('familias').select('id').eq('user_id', user.id).single()
  if (!familia || viaje.familia_id !== familia.id) return { error: 'No autorizado' }

  const { error } = await supabase
    .from('checklist_items')
    .update({ completado })
    .eq('id', itemId)

  if (error) return { error: error.message }

  revalidatePath(`/viaje/${viajeId}/checklist`)
  revalidatePath(`/viaje/${viajeId}`)
  return { ok: true }
}

function generarChecklist(destino_slug: string, tipo: string) {
  const base = [
    { tarea: 'Verificar vacunas requeridas y recomendadas', categoria: 'vacunas', prioridad: 'alta', descripcion: 'Consulta con un profesional de salud con al menos 4-6 semanas de anticipación.' },
    { tarea: 'Contratar seguro de viaje con cobertura médica', categoria: 'seguro', prioridad: 'alta', descripcion: 'Asegúrate de que cubra evacuación médica y enfermedades tropicales.' },
    { tarea: 'Comprar repelente de insectos (DEET 30%+ o Icaridina)', categoria: 'botiquin', prioridad: 'alta', descripcion: 'Aplicar en piel expuesta al amanecer y atardecer.' },
    { tarea: 'Preparar botiquín familiar básico', categoria: 'botiquin', prioridad: 'alta', descripcion: 'Incluye termómetro, suero oral, paracetamol, curitas y antidiarreico.' },
    { tarea: 'Llevar documentos médicos importantes', categoria: 'documentos', prioridad: 'media', descripcion: 'Certificados de vacunas, recetas de medicamentos crónicos, tarjeta de seguro.' },
    { tarea: 'Guardar número de emergencias del destino', categoria: 'documentos', prioridad: 'media', descripcion: 'Número local de emergencias y contacto de la embajada/consulado.' },
  ]

  const porDestino: Record<string, { tarea: string, categoria: string, prioridad: string, descripcion: string }[]> = {
    'brasil-nordeste': [
      { tarea: 'Vacuna fiebre amarilla (con certificado)', categoria: 'vacunas', prioridad: 'alta', descripcion: 'Requerida para ingreso a algunas zonas. Aplicar con al menos 10 días de anticipación.' },
      { tarea: 'Ropa de manga larga para amanecer/atardecer', categoria: 'botiquin', prioridad: 'alta', descripcion: 'Protección extra contra mosquitos transmisores de dengue.' },
    ],
    'caribe-republica-dominicana': [
      { tarea: 'Consultar profilaxis antipalúdica', categoria: 'vacunas', prioridad: 'alta', descripcion: 'Especialmente si visitas zonas rurales o fronterizas.' },
      { tarea: 'Solo agua embotellada o hervida', categoria: 'botiquin', prioridad: 'alta', descripcion: 'Evitar hielo, agua del grifo y vegetales crudos lavados con agua local.' },
    ],
    'centroamerica-costa-rica': [
      { tarea: 'Precaución con animales silvestres', categoria: 'botiquin', prioridad: 'media', descripcion: 'No tocar animales. En caso de mordedura, buscar atención médica inmediata.' },
      { tarea: 'Protector solar FPS 50+', categoria: 'botiquin', prioridad: 'media', descripcion: 'El sol tropical es más intenso. Reaplicar cada 2 horas.' },
    ],
    'mexico-cancun-riviera': [
      { tarea: 'Cuidado con alimentos en puestos callejeros', categoria: 'botiquin', prioridad: 'alta', descripcion: 'Alta incidencia de diarrea del viajero. Priorizar alimentos cocidos y calientes.' },
      { tarea: 'Llevar suero oral de rehidratación', categoria: 'botiquin', prioridad: 'alta', descripcion: 'Fundamental si viajas con niños. La deshidratación es el principal riesgo.' },
    ],
  }

  const extras = porDestino[destino_slug] || []

  if (tipo === 'aventura') {
    extras.push({ tarea: 'Kit de primeros auxilios para actividades de aventura', categoria: 'botiquin', prioridad: 'alta', descripcion: 'Vendas elásticas, antiséptico, esparadrapo, analgésico.' })
  }

  return [...base, ...extras]
}
