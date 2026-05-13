import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { getDestinoBySlug } from '@/lib/content/destinos'
import { RiskChip } from '@/components/ui/risk-chip'
import type { NivelRiesgo } from '@/types'

const RIESGOS_DETALLE = [
  { key: 'dengue',           label: 'Dengue',               icono: '🦟', tip: 'Transmitido por mosquitos Aedes. Activo durante el día. Usar repelente DEET 30%+ o Icaridina.' },
  { key: 'malaria',          label: 'Malaria',              icono: '🦠', tip: 'Consulta con médico sobre profilaxis según zona específica del destino.' },
  { key: 'fiebre_amarilla',  label: 'Fiebre amarilla',     icono: '💛', tip: 'Existe vacuna. Puede ser requerida para ingresar a algunos países.' },
  { key: 'diarrea_viajero',  label: 'Diarrea del viajero', icono: '💧', tip: 'Evita agua del grifo, hielo y alimentos crudos. Lleva suero oral.' },
  { key: 'agua_alimentos',   label: 'Agua y alimentos',    icono: '🚰', tip: 'Solo agua embotellada o hervida. Frutas y vegetales cocidos o pelados.' },
  { key: 'rabia_animales',   label: 'Rabia y animales',    icono: '🐾', tip: 'No tocar animales callejeros. Ante mordedura, buscar atención médica urgente.' },
  { key: 'sol_calor',        label: 'Sol y calor',         icono: '☀️', tip: 'FPS 50+, hidratación constante, evitar exposición entre 10:00-16:00 hrs.' },
  { key: 'seguridad_acuatica', label: 'Seguridad acuática', icono: '🌊', tip: 'Respetar banderas de playa, no nadar solo y supervisar niños constantemente.' },
]

export default async function RiesgosPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: viaje } = await supabase.from('viajes').select('*').eq('id', id).single()
  if (!viaje) notFound()

  const { data: familia } = await supabase.from('familias').select('id').eq('user_id', user.id).single()
  if (!familia || viaje.familia_id !== familia.id) redirect('/dashboard')

  const destino = getDestinoBySlug(viaje.destino_slug)
  if (!destino) notFound()

  const flagEmoji = viaje.destino_slug.includes('brasil') ? '🇧🇷'
    : viaje.destino_slug.includes('caribe') ? '🏝️'
    : viaje.destino_slug.includes('costa') ? '🇨🇷' : '🇲🇽'

  return (
    <div className="min-h-screen bg-[#F0FDF9]">
      {/* Header */}
      <header className="bg-gradient-to-br from-teal-600 to-teal-800 px-5 pt-12 pb-8">
        <div className="max-w-2xl mx-auto">
          <Link href={`/viaje/${id}`} className="inline-flex items-center gap-1.5 text-teal-200 text-sm mb-5 hover:text-white transition-colors">
            <ChevronLeft className="h-4 w-4" /> Volver al viaje
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{flagEmoji}</span>
            <div>
              <h1 className="text-xl font-semibold text-white"
                style={{ fontFamily: 'var(--font-fraunces)' }}>
                Riesgos de salud
              </h1>
              <p className="text-teal-200 text-sm">{destino.nombre}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-5 py-5 pb-28">

        {/* Fuente */}
        <div className="bg-teal-50 border border-teal-100 rounded-2xl px-4 py-3 mb-5 flex items-center gap-2">
          <span className="text-sm">📋</span>
          <p className="text-xs text-teal-700">
            Información basada en <strong>CDC Yellow Book 2026</strong> · Revisado {destino.revisado_at}
          </p>
        </div>

        {/* Riesgos */}
        <div className="flex flex-col gap-3 mb-5">
          {RIESGOS_DETALLE.map(r => {
            const nivel = destino.riesgos[r.key as keyof typeof destino.riesgos] as NivelRiesgo
            if (!nivel || nivel === 'no_aplica') return null
            return (
              <div key={r.key} className="bg-white rounded-2xl border border-slate-100 p-4">
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{r.icono}</span>
                    <span className="font-semibold text-slate-900 text-sm">{r.label}</span>
                  </div>
                  <RiskChip nivel={nivel} />
                </div>
                <p className="text-xs text-slate-500 leading-relaxed pl-8">{r.tip}</p>
              </div>
            )
          })}

          {/* No aplican */}
          <div className="bg-slate-50 rounded-2xl border border-slate-100 p-4">
            <p className="text-xs font-semibold text-slate-500 mb-2">Sin riesgo relevante en este destino</p>
            <div className="flex flex-wrap gap-2">
              {RIESGOS_DETALLE.filter(r => {
                const nivel = destino.riesgos[r.key as keyof typeof destino.riesgos] as NivelRiesgo
                return nivel === 'no_aplica'
              }).map(r => (
                <span key={r.key} className="text-xs bg-slate-100 text-slate-400 px-3 py-1 rounded-full">
                  {r.icono} {r.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Vacunas */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 mb-4">
          <h2 className="font-semibold text-slate-900 mb-3"
            style={{ fontFamily: 'var(--font-fraunces)' }}>
            💉 Vacunas
          </h2>
          {destino.vacunas_requeridas.length > 0 && (
            <div className="mb-3">
              <p className="text-xs font-semibold text-red-600 mb-2 uppercase tracking-wide">Requeridas ⚠️</p>
              <div className="flex flex-wrap gap-2">
                {destino.vacunas_requeridas.map(v => (
                  <span key={v} className="text-xs bg-red-50 text-red-700 border border-red-100 px-3 py-1.5 rounded-full font-semibold">{v}</span>
                ))}
              </div>
            </div>
          )}
          <p className="text-xs font-semibold text-green-700 mb-2 uppercase tracking-wide">Recomendadas</p>
          <div className="flex flex-wrap gap-2">
            {destino.vacunas_recomendadas.map(v => (
              <span key={v} className="text-xs bg-green-50 text-green-700 border border-green-100 px-3 py-1.5 rounded-full font-medium">{v}</span>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-4 leading-relaxed border-t border-slate-50 pt-3">
            ⚕️ Consulta con un médico especialista en medicina del viajero con <strong>al menos 4-6 semanas</strong> de anticipación.
          </p>
        </div>

        {/* Notas pediátricas */}
        {destino.riesgos.notas_pediatricas && (
          <div className="bg-amber-50 rounded-2xl border border-amber-100 p-5 mb-4">
            <h2 className="font-semibold text-amber-800 mb-2"
              style={{ fontFamily: 'var(--font-fraunces)' }}>
              👶 Para familias con niños
            </h2>
            <p className="text-sm text-amber-700 leading-relaxed">{destino.riesgos.notas_pediatricas}</p>
          </div>
        )}

        {/* Disclaimer */}
        <p className="text-[11px] text-slate-400 text-center mt-4 leading-relaxed">
          SARIQAMA entrega orientación sanitaria basada en fuentes validadas.<br />
          No reemplaza evaluación médica profesional. Ante signos de alarma, busca atención inmediata.
        </p>
      </main>
    </div>
  )
}
