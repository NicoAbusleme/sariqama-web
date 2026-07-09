import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { decryptViajero } from '@/lib/crypto'
import { EditarViajeroClient } from './EditarViajeroClient'

export default async function EditarViajeroPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: familia } = await supabase
    .from('familias').select('id').eq('user_id', user.id).single()
  if (!familia) redirect('/onboarding')

  const { data: raw } = await supabase
    .from('viajeros').select('*').eq('id', id).single()
  if (!raw || raw.familia_id !== familia.id) notFound()

  const viajero = decryptViajero(raw)

  return <EditarViajeroClient viajeroId={id} initialData={viajero} />
}
