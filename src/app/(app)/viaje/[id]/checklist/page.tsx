import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { ChecklistClient } from './ChecklistClient'
import { getDestinoBySlug } from '@/lib/content/destinos'
import { FlagImg } from '@/components/ui/flag-img'
import { PlanBanner } from '@/components/ui/plan-gate'

// Categorías visibles en el plan gratuito
const CATEGORIAS_GRATIS = ['documentos', 'vacunas']

export default async function ChecklistPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: viaje } = await supabase.from('viajes').select('*').eq('id', id).single()
  if (!viaje) notFound()

  const { data: familia } = await supabase
    .from('familias').select('id, plan').eq('user_id', user.id).single()
  if (!familia || viaje.familia_id !== familia.id) redirect('/dashboard')

  const userPlan: string = familia.plan ?? 'gratis'
  const isPaid = userPlan === 'preparacion' || userPlan === 'acompanamiento'

  const { data: checklist } = await supabase
    .from('checklist_items')
    .select('*')
    .eq('viaje_id', id)
    .order('prioridad')

  const allItems = checklist ?? []

  // Separar items libres y bloqueados
  const freeItems   = allItems.filter(i => CATEGORIAS_GRATIS.includes(i.categoria))
  const lockedItems = allItems.filter(i => !CATEGORIAS_GRATIS.includes(i.categoria))
  const visibleItems = isPaid ? allItems : freeItems

  const completados = visibleItems.filter(i => i.completado).length
  const total       = visibleItems.length

  const destino = getDestinoBySlug(viaje.destino_slug)
  const flagCode = destino?.pais_code ?? 'un'

  return (
    <div className="min-h-screen bg-[#F0FDF9]">
      {/* Header */}
      <header className="bg-gradient-to-br from-teal-600 to-teal-800 px-5 pt-12 pb-8">
        <div className="max-w-2xl mx-auto">
          <Link
            href={`/viaje/${id}`}
            className="inline-flex items-center gap-1.5 text-teal-200 text-sm mb-5 hover:text-white transition-colors"
          >
            <ChevronLeft className="h-4 w-4" /> Volver al viaje
          </Link>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FlagImg code={flagCode} size={36} className="rounded" />
              <div>
                <h1
                  className="text-xl font-semibold text-white"
                  style={{ fontFamily: 'var(--font-fraunces)' }}
                >
                  Checklist pre-viaje
                </h1>
                <p className="text-teal-200 text-sm">{viaje.destino_nombre}</p>
              </div>
            </div>
            <div className="bg-white/10 rounded-2xl px-4 py-2 text-center">
              <p className="text-2xl font-bold text-white">{completados}</p>
              <p className="text-teal-200 text-xs">de {total}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-5 py-5 pb-28">
        {allItems.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">📋</p>
            <p className="text-slate-500 text-sm">No hay items en el checklist.</p>
            <Link href={`/viaje/${id}`} className="text-teal-600 text-sm font-semibold mt-2 inline-block">
              Volver al viaje
            </Link>
          </div>
        ) : (
          <>
            {/* Items visibles (siempre se muestran los de documentos y vacunas) */}
            <ChecklistClient items={visibleItems} viajeId={id} />

            {/* Banner de upgrade si el usuario está en plan gratis y hay items bloqueados */}
            {!isPaid && lockedItems.length > 0 && (
              <div className="mt-2">
                <PlanBanner requiredPlan="preparacion" lockedCount={lockedItems.length} />
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
