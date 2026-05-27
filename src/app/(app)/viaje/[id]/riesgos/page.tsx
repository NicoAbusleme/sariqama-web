import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { ChevronLeft, Radio } from 'lucide-react'
import Link from 'next/link'
import { getDestinoBySlug } from '@/lib/content/destinos'
import { FlagImg } from '@/components/ui/flag-img'
import { getEscalaInfo, NIVEL_SALUD_META, VISA_META } from '@/lib/content/escalas'
import { RiskChip } from '@/components/ui/risk-chip'
import { fetchTugoAdvisory } from '@/lib/tugo/client'
import type { NivelRiesgo } from '@/types'
import type { TugoAdvisory, AdvisoryLevel } from '@/lib/tugo/types'

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

// ── TuGo advisory helpers ────────────────────────────────────────────────

const ADVISORY_META: Record<AdvisoryLevel, {
  bg: string; border: string; badge: string; dot: string; label: string
}> = {
  1: { bg: 'bg-green-50',  border: 'border-green-100',  badge: 'bg-green-100 text-green-700',  dot: 'bg-green-500',  label: 'Nivel 1' },
  2: { bg: 'bg-amber-50',  border: 'border-amber-100',  badge: 'bg-amber-100 text-amber-700',  dot: 'bg-amber-500',  label: 'Nivel 2' },
  3: { bg: 'bg-orange-50', border: 'border-orange-100', badge: 'bg-orange-100 text-orange-700', dot: 'bg-orange-500', label: 'Nivel 3' },
  4: { bg: 'bg-red-50',    border: 'border-red-100',    badge: 'bg-red-100 text-red-700',    dot: 'bg-red-500',    label: 'Nivel 4' },
}

function TugoAdvisorySection({ advisory }: { advisory: TugoAdvisory }) {
  const meta = ADVISORY_META[advisory.advisoryLevel]
  const pubDate = advisory.publishedDate
    ? new Date(advisory.publishedDate).toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })
    : null

  return (
    <div className={`rounded-2xl border ${meta.border} ${meta.bg} overflow-hidden mb-5`}>
      {/* Cabecera */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-inherit">
        <div className="flex items-center gap-2">
          <Radio className="h-3.5 w-3.5 text-slate-500 animate-pulse" />
          <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">Alerta de viaje en vivo</span>
        </div>
        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${meta.badge}`}>
          {meta.label} · {advisory.advisoryStateEs}
        </span>
      </div>

      <div className="px-4 py-3 space-y-3">
        {/* Texto principal de la alerta */}
        {advisory.advisoryText && (
          <p className="text-sm text-slate-700 leading-relaxed">{advisory.advisoryText}</p>
        )}

        {/* Actualizaciones recientes */}
        {advisory.recentUpdates && advisory.recentUpdates.trim().length > 10 && (
          <div className="bg-white/70 rounded-xl border border-white/80 px-3 py-2.5">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">🔄 Actualización reciente</p>
            <p className="text-xs text-slate-600 leading-relaxed">{advisory.recentUpdates}</p>
          </div>
        )}

        {/* Enfermedades activas */}
        {advisory.diseases.length > 0 && (
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-2">🦠 Información sanitaria activa</p>
            <div className="space-y-2">
              {advisory.diseases.map((d, i) => (
                <div key={i} className="bg-white/70 rounded-xl border border-white/80 px-3 py-2.5">
                  <p className="text-[11px] font-semibold text-slate-700 mb-0.5">{d.categoryEs}</p>
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">{d.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Fuente y fecha */}
        <p className="text-[10px] text-slate-400">
          Fuente: TuGo Travel Advisory API · Gobierno de Canadá
          {pubDate ? ` · Actualizado: ${pubDate}` : ''}
        </p>
      </div>
    </div>
  )
}

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

  // TuGo advisory — nunca bloquea ni rompe el render
  const tugoAdvisory = await fetchTugoAdvisory(destino.pais_code).catch(() => null)

  const flagCode = destino?.pais_code ?? 'un'

  return (
    <div className="min-h-screen bg-[#F0FDF9]">
      {/* Header */}
      <header className="bg-gradient-to-br from-teal-600 to-teal-800 px-5 pt-12 pb-8">
        <div className="max-w-2xl mx-auto">
          <Link href={`/viaje/${id}`} className="inline-flex items-center gap-1.5 text-teal-200 text-sm mb-5 hover:text-white transition-colors">
            <ChevronLeft className="h-4 w-4" /> Volver al viaje
          </Link>
          <div className="flex items-center gap-3">
            <FlagImg code={flagCode} size={40} className="rounded" />
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

        {/* TuGo live advisory */}
        {tugoAdvisory && <TugoAdvisorySection advisory={tugoAdvisory} />}

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

        {/* ── Escalas ─────────────────────────────────────────────── */}
        {viaje.escalas && viaje.escalas.length > 0 && (
          <div className="mt-2">
            <h2 className="font-semibold text-slate-900 mb-3 flex items-center gap-2"
              style={{ fontFamily: 'var(--font-fraunces)' }}>
              ✈️ Escalas en tu ruta
            </h2>

            <div className="flex flex-col gap-4">
              {viaje.escalas.map((escala: { destino: string; horas: number }, idx: number) => {
                const info = getEscalaInfo(escala.destino)
                if (!info) return null
                const saludMeta = NIVEL_SALUD_META[info.nivel_salud]
                const visaMeta  = VISA_META[info.aduana.visa as keyof typeof VISA_META]
                const durLabel  = escala.horas < 3 ? '< 2 h' : escala.horas <= 6 ? '3–6 h' : escala.horas <= 12 ? '7–12 h' : escala.horas <= 24 ? '13–24 h' : '+24 h'

                return (
                  <div key={idx} className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                    {/* Cabecera escala */}
                    <div className="flex items-center gap-3 px-4 pt-4 pb-3 border-b border-slate-50">
                      <FlagImg code={info.flag_code} size={32} className="rounded" />
                      <div className="flex-1">
                        <p className="font-semibold text-slate-900 text-sm">{escala.destino}</p>
                        <p className="text-xs text-slate-400">{durLabel} de escala</p>
                      </div>
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${saludMeta.badge}`}>
                        {saludMeta.label}
                      </span>
                    </div>

                    <div className="p-4 flex flex-col gap-4">

                      {/* Riesgos de salud */}
                      <div>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-2">
                          🏥 Riesgos de salud
                        </p>
                        <div className="flex flex-col gap-1.5">
                          {info.riesgos_salud.map((r, i) => (
                            <div key={i} className="flex items-start gap-2">
                              <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${saludMeta.dot}`} />
                              <p className="text-xs text-slate-600 leading-relaxed">{r}</p>
                            </div>
                          ))}
                        </div>
                        {info.vacunas_recomendadas && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {info.vacunas_recomendadas.map(v => (
                              <span key={v} className="text-[11px] bg-purple-50 text-purple-700 border border-purple-100 px-2.5 py-0.5 rounded-full">
                                💉 {v}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Aduana */}
                      <div>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-2">
                          🛃 Aduana e ingreso
                        </p>

                        {/* Visa */}
                        <div className={`rounded-xl border px-3 py-2.5 mb-3 ${visaMeta.bg}`}>
                          <p className={`text-xs font-semibold ${visaMeta.color}`}>
                            {visaMeta.icon} {info.aduana.visa_nota}
                          </p>
                        </div>

                        {/* Documentos */}
                        <p className="text-[11px] font-semibold text-slate-500 mb-1.5">Documentos necesarios</p>
                        <div className="flex flex-col gap-1 mb-3">
                          {info.aduana.documentos.map((d, i) => (
                            <div key={i} className="flex items-start gap-2">
                              <span className="text-slate-400 text-xs mt-0.5">•</span>
                              <p className="text-xs text-slate-600">{d}</p>
                            </div>
                          ))}
                        </div>

                        {/* Restricciones */}
                        <p className="text-[11px] font-semibold text-slate-500 mb-1.5">Restricciones de aduana</p>
                        <div className="flex flex-col gap-1">
                          {info.aduana.restricciones.map((r, i) => (
                            <div key={i} className="flex items-start gap-2">
                              <span className="text-amber-400 text-xs mt-0.5">⚠</span>
                              <p className="text-xs text-slate-600">{r}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Nota de tránsito */}
                      {info.notas_transito && (
                        <div className="bg-blue-50 border border-blue-100 rounded-xl px-3 py-2.5">
                          <p className="text-xs text-blue-700 leading-relaxed">
                            💡 {info.notas_transito}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
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
