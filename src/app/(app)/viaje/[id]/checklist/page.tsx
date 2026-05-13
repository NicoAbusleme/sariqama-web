import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { ChecklistClient } from './ChecklistClient'

export default async function ChecklistPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: viaje } = await supabase.from('viajes').select('*').eq('id', id).single()
  if (!viaje) notFound()

  const { data: familia } = await supabase.from('familias').select('id').eq('user_id', user.id).single()
  if (!familia || viaje.familia_id !== familia.id) redirect('/dashboard')

  const { data: checklist } = await supabase
    .from('checklist_items')
    .select('*')
    .eq('viaje_id', id)
    .order('prioridad')

  const items = checklist ?? []
  const completados = items.filter(i => i.completado).length

  const flagEmoji = viaje.destino_slug.includes('brasil') ? '🇧🇷'
    : viaje.destino_slug.includes('caribe') ? '🏝️'
    : viaje.destino_slug.includes('costa') ? '🇨🇷' : '🇲🇽'

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
              <span className="text-3xl">{flagEmoji}</span>
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
            {/* Mini progress ring / badge */}
            <div className="bg-white/10 rounded-2xl px-4 py-2 text-center">
              <p className="text-2xl font-bold text-white">{completados}</p>
              <p className="text-teal-200 text-xs">de {items.length}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-5 py-5 pb-28">
        {items.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">📋</p>
            <p className="text-slate-500 text-sm">No hay items en el checklist.</p>
            <Link href={`/viaje/${id}`} className="text-teal-600 text-sm font-semibold mt-2 inline-block">
              Volver al viaje
            </Link>
          </div>
        ) : (
          <ChecklistClient items={items} viajeId={id} />
        )}
      </main>
    </div>
  )
}
