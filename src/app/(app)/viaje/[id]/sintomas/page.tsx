import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { SintomasClient } from './SintomasClient'

export default async function SintomasPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: viaje } = await supabase.from('viajes').select('*').eq('id', id).single()
  if (!viaje) notFound()

  const { data: familia } = await supabase.from('familias').select('id').eq('user_id', user.id).single()
  if (!familia || viaje.familia_id !== familia.id) redirect('/dashboard')

  const { data: viajeros } = await supabase
    .from('viajeros')
    .select('id, nombre, edad, es_nino, condiciones')
    .eq('familia_id', familia.id)
    .order('edad', { ascending: false })

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
          <div className="flex items-center gap-3">
            <span className="text-3xl">{flagEmoji}</span>
            <div>
              <h1
                className="text-xl font-semibold text-white"
                style={{ fontFamily: 'var(--font-fraunces)' }}
              >
                Evaluador de síntomas
              </h1>
              <p className="text-teal-200 text-sm">{viaje.destino_nombre}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-5 py-5 pb-28">
        {/* Aviso clínico */}
        <div className="bg-amber-50 border border-amber-100 rounded-2xl px-4 py-3 mb-5 flex items-start gap-2">
          <span className="text-base mt-0.5">⚕️</span>
          <p className="text-xs text-amber-700 leading-relaxed">
            Este semáforo usa <strong>criterios clínicos validados</strong> (CDC Yellow Book 2026),
            no inteligencia artificial. No reemplaza evaluación médica. Ante signos de alarma, busca atención inmediata.
          </p>
        </div>

        <SintomasClient
          viajeId={id}
          viajeros={viajeros ?? []}
        />
      </main>
    </div>
  )
}
