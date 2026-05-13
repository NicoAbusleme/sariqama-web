import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { ChevronLeft, CheckCircle, Shield, Stethoscope, BookOpen, ChevronRight, MapPin } from 'lucide-react'
import Link from 'next/link'
import { getDestinoBySlug } from '@/lib/content/destinos'
import { RiskChip } from '@/components/ui/risk-chip'
import { EliminarViajeBtn } from './EliminarViajeBtn'
import type { NivelRiesgo } from '@/types'

const RIESGOS_INFO = [
  { key: 'dengue',          label: '🦟 Dengue',                icono: '🦟' },
  { key: 'malaria',         label: '🦠 Malaria',               icono: '🦠' },
  { key: 'fiebre_amarilla', label: '💉 Fiebre amarilla',       icono: '💉' },
  { key: 'diarrea_viajero', label: '💧 Diarrea del viajero',   icono: '💧' },
  { key: 'agua_alimentos',  label: '🚰 Agua y alimentos',      icono: '🚰' },
  { key: 'sol_calor',       label: '☀️ Sol y calor',           icono: '☀️' },
]

export default async function DetalleViajePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: viaje } = await supabase.from('viajes').select('*').eq('id', id).single()
  if (!viaje) notFound()

  const { data: familia } = await supabase.from('familias').select('id').eq('user_id', user.id).single()
  if (!familia || viaje.familia_id !== familia.id) redirect('/dashboard')

  const { data: checklist } = await supabase
    .from('checklist_items').select('*').eq('viaje_id', id).order('prioridad')

  const destino = getDestinoBySlug(viaje.destino_slug)
  const completados = checklist?.filter(i => i.completado).length ?? 0
  const totalItems = checklist?.length ?? 0
  const progreso = totalItems > 0 ? Math.round((completados / totalItems) * 100) : 0

  const diasRestantes = Math.ceil(
    (new Date(viaje.fecha_salida).getTime() - new Date().getTime()) / 86400000
  )
  const enViaje = diasRestantes <= 0 && new Date() <= new Date(viaje.fecha_regreso)

  const flagEmoji = viaje.destino_slug.includes('brasil') ? '🇧🇷'
    : viaje.destino_slug.includes('caribe') ? '🏝️'
    : viaje.destino_slug.includes('costa') ? '🇨🇷' : '🇲🇽'

  return (
    <div className="min-h-screen bg-[#F0FDF9]">
      {/* Header gradiente */}
      <header className="bg-gradient-to-br from-teal-600 to-teal-800 px-5 pt-12 pb-8">
        <div className="max-w-2xl mx-auto">
          <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-teal-200 text-sm mb-5 hover:text-white transition-colors">
            <ChevronLeft className="h-4 w-4" /> Dashboard
          </Link>
          <div className="flex items-start justify-between">
            <div>
              <div className="text-3xl mb-2">{flagEmoji}</div>
              <h1 className="text-2xl font-semibold text-white leading-tight"
                style={{ fontFamily: 'var(--font-fraunces)' }}>
                {viaje.destino_nombre}
              </h1>
              <p className="text-teal-200 text-sm mt-1">
                {new Date(viaje.fecha_salida).toLocaleDateString('es-CL', { day: 'numeric', month: 'long' })}
                {' — '}
                {new Date(viaje.fecha_regreso).toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
            <div className="text-right">
              {enViaje ? (
                <div className="bg-green-400 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                  ✈️ En viaje
                </div>
              ) : diasRestantes > 0 ? (
                <div>
                  <div className="text-3xl font-bold text-white">{diasRestantes}</div>
                  <div className="text-teal-200 text-xs">días</div>
                </div>
              ) : (
                <div className="bg-slate-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                  Finalizado
                </div>
              )}
            </div>
          </div>

          {/* Progreso checklist */}
          {totalItems > 0 && (
            <div className="mt-5 bg-white/10 rounded-2xl p-4">
              <div className="flex justify-between text-xs text-teal-100 mb-2">
                <span>Preparación pre-viaje</span>
                <span>{completados}/{totalItems} completados</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div className="bg-amber-400 h-2 rounded-full transition-all" style={{ width: `${progreso}%` }} />
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-5 py-5 pb-28 -mt-2">

        {/* Acciones principales */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {[
            { href: `/viaje/${id}/checklist`,  emoji: '✅', label: 'Checklist',      sub: `${completados}/${totalItems} listos`,  bg: 'bg-green-50' },
            { href: `/viaje/${id}/riesgos`,    emoji: '🗺️', label: 'Riesgos',        sub: 'Ver destino',                          bg: 'bg-teal-50' },
            { href: `/viaje/${id}/sintomas`,   emoji: '🌡️', label: 'Síntomas',       sub: 'Evaluar ahora',                        bg: 'bg-amber-50' },
            { href: `/viaje/${id}/botiquin`,   emoji: '💊',  label: 'Botiquín',       sub: 'Lo que llevar',                        bg: 'bg-blue-50' },
          ].map(a => (
            <Link key={a.href} href={a.href}>
              <div className="bg-white rounded-2xl border border-slate-100 p-4 hover:border-teal-200 hover:shadow-sm transition-all">
                <div className={`w-11 h-11 ${a.bg} rounded-2xl flex items-center justify-center text-xl mb-3`}>
                  {a.emoji}
                </div>
                <p className="font-semibold text-slate-900 text-sm">{a.label}</p>
                <p className="text-xs text-slate-400 mt-0.5">{a.sub}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Riesgos resumen */}
        {destino && (
          <div className="bg-white rounded-2xl border border-slate-100 p-5 mb-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-slate-900"
                style={{ fontFamily: 'var(--font-fraunces)' }}>
                Riesgos del destino
              </h2>
              <Link href={`/viaje/${id}/riesgos`}
                className="text-xs text-teal-600 font-semibold flex items-center gap-1">
                Ver todo <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="flex flex-col gap-2.5">
              {RIESGOS_INFO.slice(0, 4).map(r => {
                const nivel = destino.riesgos[r.key as keyof typeof destino.riesgos] as NivelRiesgo
                return (
                  <div key={r.key} className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">{r.label}</span>
                    <RiskChip nivel={nivel} />
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Vacunas */}
        {destino && destino.vacunas_recomendadas.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-100 p-5 mb-4">
            <h2 className="font-semibold text-slate-900 mb-3"
              style={{ fontFamily: 'var(--font-fraunces)' }}>
              💉 Vacunas recomendadas
            </h2>
            <div className="flex flex-wrap gap-2">
              {destino.vacunas_recomendadas.map(v => (
                <span key={v} className="text-xs bg-green-50 text-green-700 border border-green-100 px-3 py-1 rounded-full font-medium">
                  {v}
                </span>
              ))}
              {destino.vacunas_requeridas.map(v => (
                <span key={v} className="text-xs bg-red-50 text-red-700 border border-red-100 px-3 py-1 rounded-full font-semibold">
                  {v} ⚠️
                </span>
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-3 leading-relaxed">
              Consulta con un profesional de salud con al menos 4-6 semanas de anticipación.
            </p>
          </div>
        )}

        {/* Notas pediátricas */}
        {destino?.riesgos.notas_pediatricas && (
          <div className="bg-amber-50 rounded-2xl border border-amber-100 p-4 mb-4">
            <p className="text-xs font-semibold text-amber-700 mb-1">👶 Consideraciones para niños</p>
            <p className="text-xs text-amber-600 leading-relaxed">{destino.riesgos.notas_pediatricas}</p>
          </div>
        )}

        {/* Teleorientación CTA */}
        <Link href="/teleorientacion">
          <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-2xl p-5 flex items-center justify-between hover:from-teal-700 hover:to-teal-800 transition-all">
            <div>
              <p className="font-semibold text-white text-sm">¿Tienes dudas médicas?</p>
              <p className="text-teal-200 text-xs mt-0.5">Habla con un especialista en medicina del viajero</p>
            </div>
            <div className="text-2xl">👨‍⚕️</div>
          </div>
        </Link>

        {/* Disclaimer */}
        <p className="text-[11px] text-slate-400 text-center mt-6 leading-relaxed">
          Fuente: CDC Yellow Book 2026 · {destino?.revisado_at && `Revisado ${destino.revisado_at}`}<br />
          SARIQAMA entrega orientación sanitaria. No reemplaza evaluación médica profesional.
        </p>

        {/* Eliminar viaje */}
        <div className="mt-6">
          <EliminarViajeBtn viajeId={id} />
        </div>
      </main>
    </div>
  )
}
