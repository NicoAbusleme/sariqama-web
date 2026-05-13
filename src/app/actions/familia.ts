'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function agregarViajeros(viajeros: {
  nombre: string
  edad: number
  condiciones: string[]
}[]) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autorizado' }

  const { data: familia } = await supabase
    .from('familias')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!familia) return { error: 'Familia no encontrada' }

  const registros = viajeros.map(v => ({
    familia_id: familia.id,
    nombre: v.nombre,
    edad: v.edad,
    es_nino: v.edad < 18,
    condiciones: v.condiciones,
  }))

  const { error } = await supabase.from('viajeros').insert(registros)

  if (error) return { error: error.message }

  redirect('/dashboard')
}

export async function agregarUnViajero(data: {
  nombre: string
  edad: number
  condiciones: string[]
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
    edad: data.edad,
    es_nino: data.edad < 18,
    condiciones: data.condiciones,
  })

  if (error) return { error: error.message }

  redirect('/perfil')
}
