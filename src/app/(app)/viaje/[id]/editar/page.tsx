import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { EditarViajeClient } from './EditarViajeClient'

export default async function EditarViajePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: familia } = await supabase
    .from('familias').select('id').eq('user_id', user.id).single()
  if (!familia) redirect('/onboarding')

  const { data: viaje } = await supabase
    .from('viajes')
    .select('id, familia_id, destino_nombre, destino_slug, fecha_salida, fecha_regreso, tipos, seguro_viaje, seguro_compania')
    .eq('id', id)
    .single()
  if (!viaje || viaje.familia_id !== familia.id) notFound()

  return <EditarViajeClient viajeId={id} initialData={viaje} />
}
