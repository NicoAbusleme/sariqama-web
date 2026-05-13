import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { SintomasClient } from './SintomasClient'

const SEMAFORO_META = {
  verde:    { dot: 'bg-green-500',  badge: 'bg-green-100 text-green-700',  label: 'Sin alarma' },
  amarillo: { dot: 'bg-amber-400',  badge: 'bg-amber-100 text-amber-700',  label: 'Atención' },
  rojo:     { dot: 'bg-red-500',    badge: 'bg-red-100 text-red-700',      label: 'Urgencia' },
}

const SINTOMA_LABELS: Record<string, string> = {
  fiebre: 'Fiebre', fiebre_alta: 'Fiebre >38.5°C', diarrea: 'Diarrea',
  diarrea_con_sangre: 'Diarrea c/sangre', vomitos: 'Vómitos',
  cefalea_intensa: 'Cefalea', rash_manchas: 'Manchas', dolor_abdominal: 'Dolor abdominal',
  decaimiento_marcado: 'Decaimiento', sangrado: 'Sangrado',
  dificultad_respiratoria: 'Dif. respiratoria', rechazo_liquidos: 'Rechazo líquidos',
  llanto_sin_lagrimas: 'Llanto s/lágrimas', baja_orina: 'Poca orina',
}

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
    .from('viajeros').select('id, nombre, edad, es_nino, condiciones')
    .eq('familia_id', familia.id).order('edad', { ascending: false })

  // Historial de evaluaciones de este viaje
  const { data: historial } = await supabase
    .from('sintomas_log')
    .select('*')
    .eq('viaje_id', id)
    .order('created_at', { ascending: false })
    .limit(20)

  const flagEmoji = viaje.destino_slug.includes('brasil') ? '🇧🇷'
    : viaje.destino_slug.includes('caribe') ? '🏝️'
    : viaje.destino_slug.includes('costa') ? '🇨🇷' : '🇲🇽'

  return (
    <div className="min-h-screen bg-[#F0FDF9]">
      {/* Header */}
      <header className="bg-gradient-to-br from-teal-600 to-teal-800 px-5 pt-12 pb-8">
        <div className="max-w-2xl mx-auto">
          <Link href={`/viaje/${id}`}
            className="inline-flex items-center gap-1.5 text-teal-200 text-sm mb-5 hover:text-white transition-colors">
            <ChevronLeft className="h-4 w-4" /> Volver al viaje
          </Link>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{flagEmoji}</span>
              <div>
                <h1 className="text-xl font-semibold text-white" style={{ fontFamily: 'var(--font-fraunces)' }}>
                  Evaluador de síntomas
                </h1>
                <p className="text-teal-200 text-sm">{viaje.destino_nombre}</p>
              </div>
            </div>
            {(historial?.length ?? 0) > 0 && (
              <div className="bg-white/10 rounded-2xl px-4 py-2 text-center">
                <p className="text-2xl font-bold text-white">{historial!.length}</p>
                <p className="text-teal-200 text-xs">registros</p>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-5 py-5 pb-28">

        {/* Aviso clínico */}
        <div className="bg-amber-50 border border-amber-100 rounded-2xl px-4 py-3 mb-5 flex items-start gap-2">
          <span className="text-base mt-0.5">⚕️</span>
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
            <h2 className="font-semibold text-slate-800 mb-3 flex items-center gap-2"
              style={{ fontFamily: 'var(--font-fraunces)' }}>
              📋 Historial de evaluaciones
              <span className="text-xs font-normal text-slate-400 ml-1">{historial.length} registro{historial.length !== 1 ? 's' : ''}</span>
            </h2>

            <div className="flex flex-col gap-3">
              {historial.map((reg, idx) => {
                const meta = SEMAFORO_META[reg.semaforo as keyof typeof SEMAFORO_META] ?? SEMAFORO_META.verde
                const fecha = new Date(reg.created_at)
                const esHoy = new Date().toDateString() === fecha.toDateString()
                const sintTags: string[] = (reg.sintomas ?? [])
                  .filter((k: string) => !['fiebre_alta', 'diarrea_con_sangre'].includes(k))

                return (
                  <div key={reg.id} className="bg-white rounded-2xl border border-slate-100 p-4">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full flex-shrink-0 ${meta.dot}`} />
                        <span className="text-sm font-semibold text-slate-800">{reg.titulo ?? meta.label}</span>
                        {idx === 0 && (
                          <span className="text-[10px] bg-teal-100 text-teal-700 font-bold px-2 py-0.5 rounded-full">
                            ÚLTIMO
                          </span>
                        )}
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-xs font-medium text-slate-600">
                          {esHoy ? 'Hoy' : fecha.toLocaleDateString('es-CL', { day: 'numeric', month: 'short' })}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {fecha.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>

                    {/* Quién */}
                    {reg.viajero_nombre && (
                      <p className="text-xs text-slate-500 mb-2">
                        👤 {reg.viajero_nombre}
                        {reg.dias_sintomas > 1 && ` · ${reg.dias_sintomas} días de síntomas`}
                      </p>
                    )}

                    {/* Tags síntomas */}
                    {sintTags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {sintTags.map((k: string) => (
                          <span key={k} className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${meta.badge}`}>
                            {SINTOMA_LABELS[k] ?? k}
                          </span>
                        ))}
                        {(reg.exposiciones ?? []).map((k: string) => (
                          <span key={k} className="text-[11px] px-2 py-0.5 rounded-full font-medium bg-amber-100 text-amber-700">
                            {k === 'picadura_mosquito' ? '🦟 Mosquito' : k === 'mordedura_animal' ? '🐾 Animal' : '🚰 Agua'}
                          </span>
                        ))}
                      </div>
                    )}
                    {sintTags.length === 0 && (
                      <p className="text-xs text-slate-400 italic">Sin síntomas registrados</p>
                    )}
                  </div>
                )
              })}
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

      </main>
    </div>
  )
}
