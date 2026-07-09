'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { loginRatelimit } from '@/lib/ratelimit'

export async function registrar(formData: FormData) {
  const supabase = await createClient()
  const adminClient = createAdminClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const nombreFamilia = formData.get('nombreFamilia') as string

  const { data, error } = await supabase.auth.signUp({ email, password })

  if (error) {
    return { error: error.message }
  }

  // data.user puede ser null si el email ya existe como usuario no confirmado
  if (!data.user) {
    return { error: 'No se pudo crear la cuenta. Si ya tienes una cuenta, inicia sesión.' }
  }

  // Usamos el admin client para garantizar el insert sin importar el estado de la sesión o RLS
  const { error: familiaError } = await adminClient
    .from('familias')
    .insert({ user_id: data.user.id, nombre: nombreFamilia })

  if (familiaError) {
    return { error: familiaError.message }
  }

  redirect('/onboarding')
}

export async function iniciarSesion(formData: FormData) {
  // Rate limiting: máx 5 intentos por IP en 15 minutos
  const ip = (await headers()).get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1'
  const { success, remaining } = await loginRatelimit.limit(ip)
  if (!success) {
    return { error: `Demasiados intentos fallidos. Espera unos minutos antes de volver a intentarlo.` }
  }

  const supabase = await createClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    const aviso = remaining <= 1 ? ` (${remaining} intento${remaining === 1 ? '' : 's'} restante)` : ''
    return { error: `Correo o contraseña incorrectos.${aviso}` }
  }

  redirect('/dashboard')
}

export async function cerrarSesion() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}

export async function eliminarCuenta(): Promise<{ error?: string }> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  // 1. Obtener la familia del usuario
  const { data: familia } = await supabase
    .from('familias').select('id').eq('user_id', user.id).single()

  if (familia) {
    // 2. Obtener IDs de los viajes para borrar sus datos relacionados
    const { data: viajes } = await supabase
      .from('viajes').select('id').eq('familia_id', familia.id)

    const viajeIds = (viajes ?? []).map(v => v.id)

    if (viajeIds.length > 0) {
      // 3. Borrar checklist_items y sintomas_log de esos viajes
      await supabase.from('checklist_items').delete().in('viaje_id', viajeIds)
      await supabase.from('sintomas_log').delete().in('viaje_id', viajeIds)
      await supabase.from('teleorientaciones').delete().in('viaje_id', viajeIds)
    }

    // 4. Borrar viajes
    await supabase.from('viajes').delete().eq('familia_id', familia.id)
    // 5. Borrar viajeros
    await supabase.from('viajeros').delete().eq('familia_id', familia.id)
    // 6. Borrar familia
    await supabase.from('familias').delete().eq('id', familia.id)
  }

  // 7. Eliminar el usuario de Supabase Auth (requiere service role)
  const adminClient = createAdminClient()
  await adminClient.auth.admin.deleteUser(user.id)

  // 8. Cerrar sesión (por si acaso)
  await supabase.auth.signOut()

  redirect('/')
}
