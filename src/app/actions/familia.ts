'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import { encrypt, encryptArray } from '@/lib/crypto'

export async function agregarViajeros(viajeros: {
  nombre: string
  apellido?: string
  edad: number
  sexo?: string
  genero?: string
  condiciones: string[]
  inmunosupresion_tipo?: string
  vih_carga_viral?: string
  embarazo_fum?: string
  alergia_tipos?: string[]
  alergia_huevo?: boolean
  alergia_plv?: boolean
  alergia_farmacos_cuales?: string
}[], nombreFamilia?: string) {
  const supabase = await createClient()
  const adminClient = createAdminClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autorizado' }

  let { data: familia } = await supabase
    .from('familias')
    .select('id')
    .eq('user_id', user.id)
    .single()

  // Si no existe la familia (registro incompleto), la creamos con el nombre provisto
  if (!familia) {
    if (!nombreFamilia?.trim()) return { error: 'Ingresa el nombre de tu familia para continuar' }
    const { data: nueva, error: createError } = await adminClient
      .from('familias')
      .insert({ user_id: user.id, nombre: nombreFamilia.trim(), plan: 'gratis' })
      .select('id')
      .single()
    if (createError || !nueva) return { error: createError?.message ?? 'No se pudo crear la familia' }
    familia = nueva
  }

  const familiaId = familia!.id

  const registros = viajeros.map(v => ({
    familia_id: familiaId,
    nombre: v.nombre,
    apellido: v.apellido || null,
    edad: v.edad,
    es_nino: v.edad < 18,
    sexo:                    v.sexo                    ? encrypt(v.sexo)                                    : null,
    genero:                  v.genero                  ? encrypt(v.genero)                                  : null,
    condiciones:             v.condiciones.length       ? encryptArray(v.condiciones)!                      : [],
    inmunosupresion_tipo:    v.inmunosupresion_tipo    ? encrypt(v.inmunosupresion_tipo)                    : null,
    vih_carga_viral:         v.vih_carga_viral         ? encrypt(v.vih_carga_viral)                         : null,
    embarazo_fum:            v.embarazo_fum            ? encrypt(v.embarazo_fum)                            : null,
    alergia_tipos:           v.alergia_tipos?.length   ? encryptArray(v.alergia_tipos)                      : null,
    alergia_huevo:           v.alergia_huevo ?? false,
    alergia_plv:             v.alergia_plv ?? false,
    alergia_farmacos_cuales: v.alergia_farmacos_cuales ? encrypt(v.alergia_farmacos_cuales)                 : null,
  }))

  const { error } = await supabase.from('viajeros').insert(registros)

  if (error) return { error: error.message }

  redirect('/dashboard')
}

export async function agregarUnViajero(data: {
  nombre: string
  apellido?: string
  edad: number
  sexo?: string
  genero?: string
  condiciones: string[]
  inmunosupresion_tipo?: string
  vih_carga_viral?: string
  embarazo_fum?: string
  alergia_tipos?: string[]
  alergia_huevo?: boolean
  alergia_plv?: boolean
  alergia_farmacos_cuales?: string
}): Promise<{ error?: string }> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autorizado' }

  const { data: familia } = await supabase
    .from('familias')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!familia) return { error: 'Familia no encontrada' }

  const { error } = await supabase.from('viajeros').insert({
    familia_id: familia.id,
    nombre: data.nombre,
    apellido: data.apellido || null,
    edad: data.edad,
    es_nino: data.edad < 18,
    sexo:                    data.sexo                    ? encrypt(data.sexo)                    : null,
    genero:                  data.genero                  ? encrypt(data.genero)                  : null,
    condiciones:             data.condiciones.length       ? encryptArray(data.condiciones)!       : [],
    inmunosupresion_tipo:    data.inmunosupresion_tipo    ? encrypt(data.inmunosupresion_tipo)    : null,
    vih_carga_viral:         data.vih_carga_viral         ? encrypt(data.vih_carga_viral)         : null,
    embarazo_fum:            data.embarazo_fum            ? encrypt(data.embarazo_fum)            : null,
    alergia_tipos:           data.alergia_tipos?.length   ? encryptArray(data.alergia_tipos)      : null,
    alergia_huevo:           data.alergia_huevo ?? false,
    alergia_plv:             data.alergia_plv ?? false,
    alergia_farmacos_cuales: data.alergia_farmacos_cuales ? encrypt(data.alergia_farmacos_cuales) : null,
  })

  if (error) return { error: error.message }

  redirect('/perfil')
}
