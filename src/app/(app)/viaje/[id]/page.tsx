import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import {
  ChevronLeft, CheckSquare, Shield, Stethoscope, BookOpen,
  ChevronRight, AlertTriangle, XCircle, Plane, Pill, FileText, Pencil,
} from 'lucide-react'
import Link from 'next/link'
import { getDestinoBySlug } from '@/lib/content/destinos'
import { FlagImg } from '@/components/ui/flag-img'
import { RiskChip } from '@/components/ui/risk-chip'
import { EliminarViajeBtn } from './EliminarViajeBtn'
import type { NivelRiesgo } from '@/types'
import { decryptViajero } from '@/lib/crypto'

function calcularSemanasEmbarazo(fum: string, fechaViaje: string): number | null {
  if (!fum || !fechaViaje) return null
  const fumDate = new Date(fum)
  const viajeDate = new Date(fechaViaje)
  if (isNaN(fumDate.getTime()) || isNaN(viajeDate.getTime())) return null
  return Math.floor((viajeDate.getTime() - fumDate.getTime()) / (1000 * 60 * 60 * 24 * 7))
}

const RIESGOS_INFO = [
  { key: 'dengue',          label: 'Dengue' },
  { key: 'malaria',         label: 'Malaria' },
  { key: 'fiebre_amarilla', label: 'Fiebre amarilla' },
  { key: 'diarrea_viajero', label: 'Diarrea del viajero' },
  { key: 'agua_alimentos',  label: 'Agua y alimentos' },
  { key: 'sol_calor',       label: 'Sol y calor' },
]

const TIPO_LABEL: Record<string, string> = {
  playa: 'Playa', urbano: 'Ciudad', aventura: 'Aventura',
  rural: 'Rural', familiar: 'Familiar', crucero: 'Crucero',
}

export default async function DetalleViajePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: viaje } = await supabase.from('viajes').select('*').eq('id', id).single()
  if (!viaje) notFound()

  const { data: familia } = await supabase
    .from('familias').select('id, plan').eq('user_id', user.id).single()
  if (!familia || viaje.familia_id !== familia.id) redirect('/dashboard')

  const userPlan: string = (familia as { id: string; plan?: string }).plan ?? 'gratis'
  const puedeDescargarPDF = userPlan === 'preparacion' || userPlan === 'acompanamiento'

  const { data: checklist } = await supabase
    .from('checklist_items').select('*').eq('viaje_id', id).order('prioridad')

  const { data: rawViajeros } = await supabase
    .from('viajeros').select('nombre, condiciones, embarazo_fum').eq('familia_id', familia.id)
  const viajeros = (rawViajeros ?? []).map(decryptViajero)

  type AvisoEmbarazo = { nombre: string; semanas: number; nivel: 'advertencia' | 'critico' }
  const avisosEmbarazo: AvisoEmbarazo[] = (viajeros ?? [])
    .filter(v => Array.isArray(v.condiciones) && v.condiciones.includes('embarazo') && v.embarazo_fum)
    .map(v => {
      const semanas = calcularSemanasEmbarazo(v.embarazo_fum, viaje.fecha_salida)
      if (semanas === null) return null
      if (semanas >= 36) return { nombre: v.nombre, semanas, nivel: 'critico' as const }
      if (semanas >= 28) return { nombre: v.nombre, semanas, nivel: 'advertencia' as const }
      return null
    })
    .filter((x): x is AvisoEmbarazo => x !== null)

  const destino = getDestinoBySlug(viaje.destino_slug)
  const completados = checklist?.filter(i => i.completado).length ?? 0
  const totalItems = checklist?.length ?? 0
  const progreso = totalItems > 0 ? Math.round((completados / totalItems) * 100) : 0

  const diasRestantes = Math.ceil(
    (new Date(viaje.fecha_salida).getTime() - new Date().getTime()) / 86400000
  )
  const enViaje = diasRestantes <= 0 && new Date() <= new Date(viaje.fecha_regreso)

  const flagCode = destino?.pais_code ?? 'un'

  return (
    <div className="min-h-screen bg-[#F8FAFB]">

      {/* ── Header limpio ─────────────────────────────────────────────── */}
      <header className="bg-white border-b border-[#E8EEF4] px-5 pt-5 pb-5">
        <div className="max-w-2xl mx-auto">

          {/* Back */}
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-slate-400 hover:text-[#1A3D5C] text-sm mb-4 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" /> Dashboard
          </Link>

          {/* Destino info */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                <FlagImg code={flagCode} size={48} className="w-full h-full object-cover" />
              </div>
              <div className="min-w-0">
                <h1
                  className="text-xl font-semibold text-[#1A3D5C] leading-tight truncate"
                  style={{ fontFamily: 'var(--font-fraunces)' }}
                >
                  {viaje.destino_nombre}
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  {new Date(viaje.fecha_salida).toLocaleDateString('es-CL', { day: 'numeric', month: 'long' })}
                  {' — '}
                  {new Date(viaje.fecha_regreso).toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>

            {/* Estado dias */}
            <div className="flex-shrink-0 text-right">
              {enViaje ? (
                <span className="inline-flex items-center gap-1 text-xs font-semibold bg-[#E8F7F4] text-[#2D9E8C] px-3 py-1 rounded-full">
                  <Plane className="h-3 w-3" aria-hidden="true" /> En viaje
                </span>
              ) : diasRestantes > 0 ? (
                <div>
                  <p className="text-2xl font-bold text-[#1A3D5C] leading-none">{diasRestantes}</p>
                  <p className="text-xs text-slate-400 mt-0.5">días</p>
                </div>
              ) : (
                <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                  Finalizado
                </span>
              )}
            </div>
          </div>

          {/* Tags de tipo de viaje */}
          {viaje.tipos && viaje.tipos.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {viaje.tipos.map((t: string) => (
                <span key={t} className="text-[11px] font-medium text-slate-500 bg-[#F8FAFB] border border-[#E8EEF4] px-2.5 py-0.5 rounded-full">
                  {TIPO_LABEL[t] ?? t}
                </span>
              ))}
              {viaje.escalas && viaje.escalas.map((e: { destino: string; horas: number }, i: number) => (
                <span key={i} className="text-[11px] font-medium text-slate-400 bg-[#F8FAFB] border border-[#E8EEF4] px-2.5 py-0.5 rounded-full">
                  Escala: {e.destino}
                </span>
              ))}
            </div>
          )}

          {/* Editar viaje */}
          <div className="mt-3">
            <Link href={`/viaje/${id}/editar`}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-[#2D9E8C] transition-colors">
              <Pencil className="h-3 w-3" aria-hidden="true" />
              Editar fechas, tipos o seguro
            </Link>
          </div>

          {/* Barra de progreso */}
          {totalItems > 0 && (
            <div className="mt-4">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs text-slate-500 font-medium">Preparación pre-viaje</span>
                <span className="text-xs font-semibold text-[#2D9E8C]">{completados}/{totalItems}</span>
              </div>
              <div className="h-1.5 bg-[#F0F4F8] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#2D9E8C] rounded-full transition-all duration-500"
                  style={{ width: `${progreso}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-5 py-5 pb-28 space-y-4">

        {/* Avisos de embarazo */}
        {avisosEmbarazo.map(aviso => aviso.nivel === 'critico' ? (
          <div key={aviso.nombre} className="bg-red-50 rounded-2xl border border-red-200 p-4">
            <div className="flex items-start gap-3">
              <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="text-sm font-bold text-red-700 mb-1">
                  {aviso.nombre} no debería viajar — Semana {aviso.semanas}
                </p>
                <p className="text-xs text-red-600 leading-relaxed">
                  Con {aviso.semanas} semanas al momento del viaje, la mayoría de las aerolíneas <strong>no permitirán el embarque</strong>. Consulta con tu médico y la aerolínea antes de planificar.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div key={aviso.nombre} className="bg-amber-50 rounded-2xl border border-amber-200 p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="text-sm font-bold text-amber-700 mb-1">
                  {aviso.nombre} — Semana {aviso.semanas} al inicio del viaje
                </p>
                <p className="text-xs text-amber-700 leading-relaxed">
                  A partir de la semana 28 muchas aerolíneas exigen <strong>certificado médico</strong>. Consulta con tu médico y la aerolínea con anticipación.
                </p>
              </div>
            </div>
          </div>
        ))}

        {/* ── Acciones principales ───────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-3">
          {[
            {
              href:  `/viaje/${id}/checklist`,
              Icon:  CheckSquare,
              label: 'Checklist',
              sub:   totalItems > 0 ? `${completados}/${totalItems} completados` : 'Preparación pre-viaje',
              color: 'text-emerald-600',
              bg:    'bg-emerald-50',
            },
            {
              href:  `/viaje/${id}/riesgos`,
              Icon:  Shield,
              label: 'Riesgos',
              sub:   'Ver destino completo',
              color: 'text-[#2D9E8C]',
              bg:    'bg-[#E8F7F4]',
            },
            {
              href:  `/viaje/${id}/sintomas`,
              Icon:  Stethoscope,
              label: 'Síntomas',
              sub:   'Evaluar ahora',
              color: 'text-amber-600',
              bg:    'bg-amber-50',
            },
            {
              href:  `/viaje/${id}/botiquin`,
              Icon:  Pill,
              label: 'Botiquín',
              sub:   'Lo que llevar',
              color: 'text-blue-600',
              bg:    'bg-blue-50',
            },
          ].map(({ href, Icon, label, sub, color, bg }) => (
            <Link key={href} href={href}>
              <div
                className="bg-white rounded-2xl border border-[#E8EEF4] p-4 cursor-pointer transition-all duration-150 hover:border-[#2D9E8C]/30 hover:shadow-sm"
                style={{ boxShadow: 'var(--shadow-xs)' }}
              >
                <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
                  <Icon className={`h-5 w-5 ${color}`} strokeWidth={1.8} aria-hidden="true" />
                </div>
                <p className="font-semibold text-[#1A3D5C] text-sm">{label}</p>
                <p className="text-xs text-slate-400 mt-0.5">{sub}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* ── Resumen de riesgos ─────────────────────────────────────── */}
        {destino && (
          <div className="bg-white rounded-2xl border border-[#E8EEF4] p-5"
            style={{ boxShadow: 'var(--shadow-xs)' }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-[#1A3D5C] text-sm"
                style={{ fontFamily: 'var(--font-fraunces)' }}>
                Riesgos del destino
              </h2>
              <Link href={`/viaje/${id}/riesgos`}
                className="text-xs text-[#2D9E8C] font-semibold flex items-center gap-1">
                Ver todo <ChevronRight className="h-3 w-3" aria-hidden="true" />
              </Link>
            </div>
            <div className="space-y-2.5">
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

        {/* ── Vacunas ────────────────────────────────────────────────── */}
        {destino && (destino.vacunas_recomendadas.length > 0 || destino.vacunas_requeridas.length > 0) && (
          <div className="bg-white rounded-2xl border border-[#E8EEF4] p-5"
            style={{ boxShadow: 'var(--shadow-xs)' }}>
            <h2 className="font-semibold text-[#1A3D5C] text-sm mb-3"
              style={{ fontFamily: 'var(--font-fraunces)' }}>
              Vacunas
            </h2>
            <div className="flex flex-wrap gap-2">
              {destino.vacunas_requeridas.map(v => (
                <span key={v} className="text-xs bg-red-50 text-red-700 border border-red-100 px-2.5 py-1 rounded-full font-semibold">
                  {v} · Requerida
                </span>
              ))}
              {(() => {
                const requeridas = destino.vacunas_requeridas.map(v => v.toLowerCase())
                return destino.vacunas_recomendadas
                  .filter(v => !requeridas.some(r =>
                    r.includes(v.toLowerCase().split(' ')[0]) ||
                    v.toLowerCase().includes(r.split(' ')[0])
                  ))
                  .map(v => (
                    <span key={v} className="text-xs bg-[#E8F7F4] text-[#2D9E8C] border border-[#2D9E8C]/20 px-2.5 py-1 rounded-full font-medium">
                      {v}
                    </span>
                  ))
              })()}
            </div>
            <p className="text-xs text-slate-400 mt-3 leading-relaxed">
              Consulta con un profesional de salud con al menos 4–6 semanas de anticipación.
            </p>
          </div>
        )}

        {/* Notas pediátricas */}
        {destino?.riesgos.notas_pediatricas && (
          <div className="bg-amber-50 rounded-2xl border border-amber-100 p-4">
            <p className="text-xs font-semibold text-amber-700 mb-1">Consideraciones para niños</p>
            <p className="text-xs text-amber-700 leading-relaxed">{destino.riesgos.notas_pediatricas}</p>
          </div>
        )}

        {/* ── PDF ──────────────────────────────────────────────────── */}
        {puedeDescargarPDF ? (
          <a
            href={`/api/reporte/${id}`}
            download
            className="flex items-center justify-between bg-white rounded-2xl border border-[#E8EEF4] p-4 hover:border-[#2D9E8C]/30 transition-colors"
            style={{ boxShadow: 'var(--shadow-xs)' }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#E8F7F4] rounded-xl flex items-center justify-center">
                <FileText className="h-5 w-5 text-[#2D9E8C]" strokeWidth={1.8} aria-hidden="true" />
              </div>
              <div>
                <p className="font-semibold text-[#1A3D5C] text-sm">Descargar reporte PDF</p>
                <p className="text-xs text-slate-400 mt-0.5">Reporte familiar completo</p>
              </div>
            </div>
            <BookOpen className="h-4 w-4 text-[#2D9E8C]" aria-hidden="true" />
          </a>
        ) : (
          <Link href="/precios">
            <div className="flex items-center justify-between bg-[#E8F7F4] rounded-2xl border border-[#2D9E8C]/20 p-4 hover:border-[#2D9E8C]/40 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#2D9E8C]/10 rounded-xl flex items-center justify-center">
                  <FileText className="h-5 w-5 text-[#2D9E8C]" strokeWidth={1.8} aria-hidden="true" />
                </div>
                <div>
                  <p className="font-semibold text-[#1A3D5C] text-sm">Reporte PDF familiar</p>
                  <p className="text-xs text-[#2D9E8C] mt-0.5">Disponible en Preparación Total</p>
                </div>
              </div>
              <Shield className="h-4 w-4 text-[#2D9E8C]" aria-hidden="true" />
            </div>
          </Link>
        )}

        {/* ── CTA Teleorientación ────────────────────────────────────── */}
        <Link href="/teleorientacion">
          <div className="bg-[#1A3D5C] rounded-2xl p-5 flex items-center justify-between hover:bg-[#254E72] transition-colors cursor-pointer">
            <div>
              <p className="font-semibold text-white text-sm">¿Tienes dudas médicas?</p>
              <p className="text-[#A8C5DA] text-xs mt-0.5">Habla con un especialista en medicina del viajero</p>
            </div>
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <Stethoscope className="h-5 w-5 text-white" strokeWidth={1.8} aria-hidden="true" />
            </div>
          </div>
        </Link>

        {/* Disclaimer */}
        <p className="text-[11px] text-slate-400 text-center leading-relaxed">
          Fuente: CDC Yellow Book 2026{destino?.revisado_at ? ` · Revisado ${destino.revisado_at}` : ''}<br />
          SARIQAMA entrega orientación sanitaria. No reemplaza evaluación médica profesional.
        </p>

        {/* Eliminar viaje */}
        <div className="pt-2">
          <EliminarViajeBtn viajeId={id} />
        </div>
      </main>
    </div>
  )
}
