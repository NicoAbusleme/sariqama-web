'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function registrar(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const nombreFamilia = formData.get('nombreFamilia') as string

  const { data, error } = await supabase.auth.signUp({ email, password })

  if (error) {
    return { error: error.message }
  }

  if (data.user) {
    // Crear el registro de familia
    const { error: familiaError } = await supabase
      .from('familias')
      .insert({ user_id: data.user.id, nombre: nombreFamilia })

    if (familiaError) {
      return { error: familiaError.message }
    }
  }

  redirect('/onboarding')
}

export async function iniciarSesion(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { error: 'Correo o contraseña incorrectos' }
  }

  redirect('/dashboard')
}

export async function cerrarSesion() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}
