import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { ChevronLeft, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import { SintomasClient } from './SintomasClient'
import { HistorialCard } from './HistorialCard'
import { getDestinoBySlug } from '@/lib/content/destinos'
import { FlagImg } from '@/components/ui/flag-img'
import { PlanGate } from '@/components/ui/plan-gate'
import { decryptViajero, decryptSintoma } from '@/lib/crypto'

export default async function SintomasPage({ params }: { params: Promise<{ id: string }> }) {
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

  const { data: rawViajeros } = await supabase
    .from('viajeros').select('id, nombre, edad, es_nino, condiciones')
    .eq('familia_id', familia.id).order('edad', { ascending: false })
  const viajeros = (rawViajeros ?? []).map(decryptViajero)

  // Historial de evaluaciones de este viaje
  const { data: rawHistorial } = await supabase
    .from('sintomas_log')
    .select('*')
    .eq('viaje_id', id)
    .order('created_at', { ascending: false })
    .limit(20)
  const historial = (rawHistorial ?? []).map(decryptSintoma)

  const destino = getDestinoBySlug(viaje.destino_slug)
  const flagCode = destino?.pais_code ?? 'un'

  return (
    <div className="min-h-screen bg-[#F8FAFB]">
      {/* ── Header limpio ─────────────────────────────────────────────── */}
      <header className="bg-white border-b border-[#E8EEF4] px-5 pt-5 pb-5">
        <div className="max-w-2xl mx-auto">
          <Link href={`/viaje/${id}`}
            className="inline-flex items-center gap-1.5 text-slate-400 hover:text-[#1A3D5C] text-sm mb-4 transition-colors">
            <ChevronLeft className="h-4 w-4" aria-hidden="true" /> Volver al viaje
          </Link>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                <FlagImg code={flagCode} size={40} className="w-full h-full object-cover" />
              </div>
              <div className="min-w-0">
                <h1 className="text-xl font-semibold text-[#1A3D5C]" style={{ fontFamily: 'var(--font-fraunces)' }}>
                  Evaluador de síntomas
                </h1>
                <p className="text-sm text-slate-400">{viaje.destino_nombre}</p>
              </div>
            </div>
            {(historial?.length ?? 0) > 0 && (
              <div className="bg-[#E8F7F4] rounded-xl px-3 py-2 text-center flex-shrink-0">
                <p className="text-xl font-bold text-[#1A3D5C]">{historial!.length}</p>
                <p className="text-[11px] text-[#2D9E8C] font-medium">registros</p>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-5 py-5 pb-28">
        <PlanGate
          userPlan={userPlan}
          requiredPlan="acompanamiento"
          feature="Evaluador de síntomas clínico"
          description="Triaje determinístico basado en criterios CDC para adultos y niños, con historial de evaluaciones."
        >

        {/* Aviso clínico */}
        <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 mb-5 flex items-start gap-2.5">
          <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-xs text-amber-700 leading-relaxed">
            Este semáforo usa <strong>criterios clínicos validados</strong> (CDC Yellow Book 2026), sin inteligencia artificial.
            No reemplaza evaluación médica. Ante signos de alarma, busca atención inmediata.
          </p>
        </div>

        {/* Evaluador */}
        <SintomasClient viajeId={id} viajeros={viajeros ?? []} />

        {/* ─── Historial ─────────────────────────────────────────────────── */}
        {historial && historial.length > 0 && (
          <div className="mt-8">
            <h2 className="font-semibold text-[#1A3D5C] mb-3 flex items-center gap-2"
              style={{ fontFamily: 'var(--font-fraunces)' }}>
              Historial de evaluaciones
              <span className="text-xs font-normal text-slate-400">{historial.length} registro{historial.length !== 1 ? 's' : ''}</span>
            </h2>

            <div className="flex flex-col gap-3">
              {historial.map((reg, idx) => (
                <HistorialCard key={reg.id} reg={reg} isFirst={idx === 0} />
              ))}
            </div>

            {/* Tendencia si hay más de 1 registro */}
            {historial.length >= 2 && (() => {
              const ultimo  = historial[0].semaforo
              const anterior = historial[1].semaforo
              const orden: Record<string, number> = { verde: 0, amarillo: 1, rojo: 2 }
              const diff = orden[ultimo] - orden[anterior]
              if (diff === 0) return null
              return (
                <div className={`mt-3 rounded-2xl border p-3 flex items-center gap-2 ${diff < 0 ? 'bg-green-50 border-green-100' : 'bg-amber-50 border-amber-100'}`}>
                  <span className="text-lg">{diff < 0 ? '📈' : '📉'}</span>
                  <p className={`text-xs font-medium ${diff < 0 ? 'text-green-700' : 'text-amber-700'}`}>
                    {diff < 0
                      ? 'La última evaluación muestra mejoría respecto a la anterior.'
                      : 'La última evaluación muestra un deterioro. Considera consultar a un profesional.'}
                  </p>
                </div>
              )
            })()}
          </div>
        )}

        </PlanGate>
      </main>
    </div>
  )
}
