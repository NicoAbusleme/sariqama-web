import { createClient } from '@/lib/supabase/server'
import { BottomNav } from '@/components/ui/bottom-nav'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  // Obtener el primer viaje próximo del usuario para el nav
  let primerViajeId: string | undefined

  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: familia } = await supabase
        .from('familias').select('id').eq('user_id', user.id).single()
      if (familia) {
        const { data: viajes } = await supabase
          .from('viajes').select('id')
          .eq('familia_id', familia.id)
          .gte('fecha_regreso', new Date().toISOString().split('T')[0])
          .order('fecha_salida', { ascending: true })
          .limit(1)
        primerViajeId = viajes?.[0]?.id
      }
    }
  } catch {
    // Si falla la consulta, el nav sigue funcionando sin el ID
  }

  return (
    <>
      {children}
      <BottomNav primerViajeId={primerViajeId} />
    </>
  )
}
