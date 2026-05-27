import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { ChevronLeft, Radio, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import { getDestinoBySlug } from '@/lib/content/destinos'
import { FlagImg } from '@/components/ui/flag-img'
import { getEscalaInfo, NIVEL_SALUD_META, VISA_META } from '@/lib/content/escalas'
import { RiskChip } from '@/components/ui/risk-chip'
import { fetchTugoAdvisory } from '@/lib/tugo/client'
import { fetchCdcNotices } from '@/lib/cdc/client'
import { CollapsibleSection } from '@/components/ui/collapsible-section'
import type { NivelRiesgo } from '@/types'
import type { TugoAdvisory, AdvisoryLevel } from '@/lib/tugo/types'
import type { CdcNotice, CdcAlertLevel } from '@/lib/cdc/types'

const RIESGOS_DETALLE = [
  { key: 'dengue',             label: 'Dengue',               icono: '🦟', tip: 'Transmitido por mosquitos Aedes. Activo durante el día. Usar repelente DEET 30%+. La Picaridina (Icaridina) es igualmente eficaz, pero no está disponible en Chile.' },
  { key: 'malaria',            label: 'Malaria',              icono: '🪱', tip: 'Causada por el parásito Plasmodium, transmitido por mosquito Anopheles (nocturno). Usar repelente DEET 30%+ desde el atardecer. Consulta con médico sobre profilaxis antipalúdica según la zona específica del destino.' },
  { key: 'fiebre_amarilla',    label: 'Fiebre amarilla',      icono: '💛', tip: 'Existe vacuna. Puede ser requerida para ingresar a algunos países. Consulta con médico con al menos 4 semanas de anticipación.' },
  { key: 'diarrea_viajero',    label: 'Diarrea del viajero',  icono: '💧', tip: 'Evita agua del grifo, hielo y alimentos crudos. Lleva suero oral. Lávate las manos frecuentemente.' },
  { key: 'agua_alimentos',     label: 'Agua y alimentos',     icono: '🚰', tip: 'Solo agua embotellada o hervida. Frutas y vegetales cocidos o pelados. Evita puestos de comida callejera en zonas de riesgo alto.' },
  { key: 'rabia_animales',     label: 'Rabia y animales',     icono: '🐾', tip: 'No tocar animales callejeros. Ante mordedura, buscar atención médica urgente: la profilaxis post-exposición debe iniciarse pronto.' },
  { key: 'sol_calor',          label: 'Sol y calor',          icono: '☀️', tip: 'FPS 50+, hidratación constante, evitar exposición entre 10:00-16:00 hrs.' },
  { key: 'seguridad_acuatica', label: 'Seguridad acuática',   icono: '🌊', tip: 'Respetar banderas de playa, no nadar solo y supervisar niños constantemente.' },
]

// ── TuGo ─────────────────────────────────────────────────────────────────

const ADVISORY_META: Record<AdvisoryLevel, { bg: string; border: string; badge: string; accent: string }> = {
  1: { bg: 'bg-green-50',  border: 'border-green-100',  badge: 'bg-green-100 text-green-700',  accent: 'border-green-300' },
  2: { bg: 'bg-amber-50',  border: 'border-amber-100',  badge: 'bg-amber-100 text-amber-700',  accent: 'border-amber-300' },
  3: { bg: 'bg-orange-50', border: 'border-orange-100', badge: 'bg-orange-100 text-orange-700', accent: 'border-orange-400' },
  4: { bg: 'bg-red-50',    border: 'border-red-100',    badge: 'bg-red-100 text-red-700',      accent: 'border-red-400' },
}

function TugoContent({ advisory }: { advisory: TugoAdvisory }) {
  const meta = ADVISORY_META[advisory.advisoryLevel]
  const pubDate = advisory.publishedDate
    ? new Date(advisory.publishedDate).toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })
    : null

  return (
    <div className={`rounded-xl border ${meta.border} ${meta.bg} p-3 space-y-3 mt-2`}>
      {advisory.advisoryText && (
        <p className="text-sm text-slate-700 leading-relaxed">{advisory.advisoryText}</p>
      )}
      {advisory.recentUpdates && advisory.recentUpdates.trim().length > 10 && (
        <div className="bg-white/70 rounded-xl border border-white/80 px-3 py-2.5">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">🔄 Actualización reciente</p>
          <p className="text-xs text-slate-600 leading-relaxed">{advisory.recentUpdates}</p>
        </div>
      )}
      {advisory.diseases.length > 0 && (
        <div className="space-y-2">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">🦠 Información sanitaria activa</p>
          {advisory.diseases.map((d, i) => (
            <div key={i} className="bg-white/70 rounded-xl border border-white/80 px-3 py-2.5">
              <p className="text-[11px] font-semibold text-slate-700 mb-0.5">{d.categoryEs}</p>
              <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">{d.description}</p>
            </div>
          ))}
        </div>
      )}
      <p className="text-[10px] text-slate-400 leading-relaxed">
        Fuente: TuGo Travel Advisory API · Gobierno de Canadá
        {pubDate ? ` · Actualizado: ${pubDate}` : ''}<br />
        <span className="italic">Este nivel refleja el riesgo general de seguridad del destino. Los riesgos sanitarios específicos (dengue, malaria, etc.) son independientes y se detallan más abajo.</span>
      </p>
    </div>
  )
}

// ── CDC ───────────────────────────────────────────────────────────────────

const CDC_LEVEL_META: Record<CdcAlertLevel, { bg: string; border: string; badge: string; icon: string }> = {
  1: { bg: 'bg-amber-50',  border: 'border-amber-100',  badge: 'bg-amber-100 text-amber-700',   icon: '🟡' },
  2: { bg: 'bg-orange-50', border: 'border-orange-100', badge: 'bg-orange-100 text-orange-700', icon: '🟠' },
  3: { bg: 'bg-red-50',    border: 'border-red-100',    badge: 'bg-red-100 text-red-700',       icon: '🔴' },
}

function CdcContent({ notices }: { notices: CdcNotice[] }) {
  return (
    <div className="space-y-3 mt-2">
      {notices.map((notice, i) => {
        const meta = CDC_LEVEL_META[notice.level]
        return (
          <div key={i} className={`rounded-xl border ${meta.border} ${meta.bg} px-4 py-3`}>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${meta.badge}`}>
                {meta.icon} Nivel {notice.level} — {notice.levelLabel}
              </span>
              {notice.isRegional && (
                <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">Regional</span>
              )}
            </div>
            <p className="text-sm font-semibold text-slate-800 leading-snug">{notice.titleEs}</p>
            {notice.description && (
              <p className="text-xs text-slate-500 leading-relaxed mt-1 line-clamp-2">{notice.description}</p>
            )}
            <div className="flex items-center gap-3 mt-2">
              <span className="text-[10px] text-slate-400">{notice.pubDateFormatted}</span>
              <a href={notice.link} target="_blank" rel="noopener noreferrer"
                className="text-[10px] text-teal-600 font-semibold hover:underline">
                Ver alerta completa →
              </a>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────

export default async function RiesgosPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: viaje } = await supabase.from('viajes').select('*').eq('id', id).single()
  if (!viaje) notFound()

  const { data: familia } = await supabase.from('familias').select('id').eq('user_id', user.id).single()
  if (!familia || viaje.familia_id !== familia.id) redirect('/dashboard')

  // Viajeros — campos necesarios para los avisos personalizados
  const { data: viajeros } = await supabase
    .from('viajeros')
    .select('edad, condiciones, alergia_huevo')
    .eq('familia_id', familia.id)

  const hayAlergicoHuevo  = viajeros?.some(v => v.alergia_huevo) ?? false
  const hayMayorSesenta   = viajeros?.some(v => v.edad >= 60) ?? false
  const hayInmunosuprimido = viajeros?.some(v => Array.isArray(v.condiciones) && v.condiciones.includes('inmunosupresion')) ?? false
  const hayNinos          = viajeros?.some(v => v.edad < 18) ?? false

  const destino = getDestinoBySlug(viaje.destino_slug)
  if (!destino) notFound()

  // TuGo + CDC en paralelo — nunca bloquean ni rompen el render
  const [tugoAdvisory, cdcNotices] = await Promise.all([
    fetchTugoAdvisory(destino.pais_code).catch(() => null),
    fetchCdcNotices(destino.pais_code).catch(() => []),
  ])

  const flagCode = destino?.pais_code ?? 'un'

  // Riesgos activos (excluye no_aplica)
  const riesgosActivos = RIESGOS_DETALLE.filter(r => {
    const nivel = destino.riesgos[r.key as keyof typeof destino.riesgos] as NivelRiesgo
    return nivel && nivel !== 'no_aplica'
  })
  const riesgosNoAplican = RIESGOS_DETALLE.filter(r => {
    const nivel = destino.riesgos[r.key as keyof typeof destino.riesgos] as NivelRiesgo
    return nivel === 'no_aplica'
  })

  const tugoMeta = tugoAdvisory ? ADVISORY_META[tugoAdvisory.advisoryLevel] : null
  const maxCdcLevel = cdcNotices.length > 0 ? Math.max(...cdcNotices.map(n => n.level)) as CdcAlertLevel : null

  const tieneRiesgoFiebreAmarilla = (destino.riesgos.fiebre_amarilla as NivelRiesgo) !== 'no_aplica'
  const alertaAlergiaFiebreAmarilla = hayAlergicoHuevo && tieneRiesgoFiebreAmarilla

  // Concordancia Fix 5: si TuGo es nivel 1 (bajo riesgo general) pero hay riesgos sanitarios altos propios
  const NIVELES_ORDENADOS: NivelRiesgo[] = ['no_aplica', 'bajo', 'moderado', 'alto', 'muy_alto']
  const nivelMax = (['dengue', 'malaria', 'fiebre_amarilla', 'diarrea_viajero'] as const)
    .map(k => destino.riesgos[k] as NivelRiesgo)
    .reduce((max, n) => NIVELES_ORDENADOS.indexOf(n) > NIVELES_ORDENADOS.indexOf(max) ? n : max, 'no_aplica' as NivelRiesgo)
  const alertaSanitariaVsTugo = tugoAdvisory?.advisoryLevel === 1
    && (nivelMax === 'alto' || nivelMax === 'muy_alto')

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
              <h1 className="text-xl font-semibold text-white" style={{ fontFamily: 'var(--font-fraunces)' }}>
                Riesgos de salud
              </h1>
              <p className="text-teal-200 text-sm">{destino.nombre}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-5 py-5 pb-28">

        {/* Fuente */}
        <div className="bg-teal-50 border border-teal-100 rounded-2xl px-4 py-3 mb-4 flex items-center gap-2">
          <span className="text-sm">📋</span>
          <p className="text-xs text-teal-700">
            Información basada en <strong>CDC Yellow Book 2026</strong> · Revisado {destino.revisado_at}
          </p>
        </div>

        {/* ── Alerta de viaje en vivo (TuGo) ── */}
        {tugoAdvisory && tugoMeta && (
          <CollapsibleSection
            title="Alerta de viaje en vivo"
            icon="📡"
            badge={
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${tugoMeta.badge}`}>
                Nivel {tugoAdvisory.advisoryLevel} · {tugoAdvisory.advisoryStateEs}
              </span>
            }
            accentClass={tugoMeta.accent}
            defaultOpen={tugoAdvisory.advisoryLevel >= 2}
          >
            <TugoContent advisory={tugoAdvisory} />
          </CollapsibleSection>
        )}

        {/* ── Alertas activas CDC ── */}
        {cdcNotices.length > 0 && (
          <CollapsibleSection
            title="Alertas activas · CDC"
            icon="🔔"
            count={cdcNotices.length}
            countLabel="alertas"
            accentClass={maxCdcLevel === 3 ? 'border-red-400' : maxCdcLevel === 2 ? 'border-orange-400' : 'border-amber-300'}
            defaultOpen={true}
          >
            <CdcContent notices={cdcNotices} />
          </CollapsibleSection>
        )}

        {/* ── Aviso concordancia: TuGo nivel 1 pero riesgos sanitarios altos ── */}
        {alertaSanitariaVsTugo && (
          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-orange-50 border border-orange-300 mb-4">
            <AlertTriangle className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-orange-800 leading-snug mb-1">
                ⚠️ Riesgo sanitario independiente del nivel de alerta general
              </p>
              <p className="text-xs text-orange-700 leading-relaxed">
                El nivel de alerta de viaje (Nivel 1 – Precaución normal) refleja el <strong>riesgo de seguridad general</strong>, no el riesgo de enfermedades infecciosas. Este destino tiene riesgos sanitarios <strong>{nivelMax === 'muy_alto' ? 'muy altos' : 'altos'}</strong> (dengue, malaria u otros) que requieren medidas preventivas específicas independientemente del nivel de alerta.
              </p>
            </div>
          </div>
        )}

        {/* ── Riesgos ── */}
        <CollapsibleSection
          title="Riesgos habituales del destino"
          icon="⚠️"
          count={riesgosActivos.length}
          countLabel="riesgos"
          accentClass="border-teal-300"
          defaultOpen={true}
        >
          <div className="flex flex-col gap-3 mt-2">
            {riesgosActivos.map(r => {
              const nivel = destino.riesgos[r.key as keyof typeof destino.riesgos] as NivelRiesgo
              return (
                <div key={r.key} className="bg-slate-50 rounded-xl border border-slate-100 p-4">
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
            {riesgosNoAplican.length > 0 && (
              <div className="bg-slate-50 rounded-xl border border-slate-100 p-4">
                <p className="text-xs font-semibold text-slate-400 mb-2">Sin riesgo relevante en este destino</p>
                <div className="flex flex-wrap gap-2">
                  {riesgosNoAplican.map(r => (
                    <span key={r.key} className="text-xs bg-white text-slate-400 border border-slate-100 px-3 py-1 rounded-full">
                      {r.icono} {r.label}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CollapsibleSection>

        {/* ── Vacunas ── */}
        <CollapsibleSection
          title="Vacunas"
          icon="💉"
          count={destino.vacunas_recomendadas.length + destino.vacunas_requeridas.length}
          countLabel="vacunas"
          accentClass="border-purple-300"
          defaultOpen={true}
        >
          <div className="mt-2 space-y-3">
            {/* Aviso: alergia al huevo + fiebre amarilla */}
            {alertaAlergiaFiebreAmarilla && (
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-50 border border-amber-300">
                <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-amber-800 leading-snug mb-1">
                    ⚠️ Alergia al huevo — precaución con vacuna de fiebre amarilla
                  </p>
                  <p className="text-xs text-amber-700 leading-relaxed">
                    La vacuna de fiebre amarilla se produce en embrión de pollo. Las personas con <strong>alergia al huevo</strong> pueden requerir evaluación previa por un <strong>alergólogo o inmunólogo</strong> antes de vacunarse. No omitas la vacuna sin consultar: puede ser obligatoria para ingresar al destino.
                  </p>
                </div>
              </div>
            )}

            {/* Aviso: mayores de 60 años + fiebre amarilla */}
            {hayMayorSesenta && tieneRiesgoFiebreAmarilla && (
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-50 border border-amber-300">
                <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-amber-800 leading-snug mb-1">
                    ⚠️ Mayores de 60 años — evaluación médica previa para fiebre amarilla
                  </p>
                  <p className="text-xs text-amber-700 leading-relaxed">
                    Los adultos mayores de 60 años tienen mayor riesgo de efectos adversos graves con la vacuna de fiebre amarilla. Un <strong>médico especialista</strong> debe evaluar si la vacuna es segura según el estado de salud individual antes de administrarla.
                  </p>
                </div>
              </div>
            )}

            {/* Aviso: inmunosupresión + vacunas vivas atenuadas */}
            {hayInmunosuprimido && (
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-red-50 border border-red-300">
                <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-red-800 leading-snug mb-1">
                    ⚠️ Inmunosupresión — precaución con vacunas vivas atenuadas
                  </p>
                  <p className="text-xs text-red-700 leading-relaxed">
                    Las personas inmunosuprimidas <strong>no pueden recibir vacunas vivas atenuadas</strong> (fiebre amarilla, sarampión, varicela). Es imprescindible consultar con el <strong>médico tratante</strong> para evaluar riesgos, alternativas y medidas compensatorias de protección.
                  </p>
                </div>
              </div>
            )}

            {destino.vacunas_requeridas.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-red-600 mb-2 uppercase tracking-wide">Requeridas ⚠️</p>
                <div className="flex flex-wrap gap-2">
                  {destino.vacunas_requeridas.map(v => (
                    <span key={v} className="text-xs bg-red-50 text-red-700 border border-red-100 px-3 py-1.5 rounded-full font-semibold">{v}</span>
                  ))}
                </div>
              </div>
            )}
            {/* Recomendadas — excluir las que ya aparecen en requeridas para evitar duplicados */}
            {(() => {
              const requeridas = destino.vacunas_requeridas.map(v => v.toLowerCase())
              const soloRecomendadas = destino.vacunas_recomendadas.filter(
                v => !requeridas.some(r => r.includes(v.toLowerCase().split(' ')[0]) || v.toLowerCase().includes(r.split(' ')[0]))
              )
              if (soloRecomendadas.length === 0) return null
              return (
                <div>
                  <p className="text-xs font-semibold text-green-700 mb-2 uppercase tracking-wide">Recomendadas</p>
                  <div className="flex flex-wrap gap-2">
                    {soloRecomendadas.map(v => (
                      <span key={v} className="text-xs bg-green-50 text-green-700 border border-green-100 px-3 py-1.5 rounded-full font-medium">{v}</span>
                    ))}
                  </div>
                </div>
              )
            })()}
            <p className="text-xs text-slate-400 leading-relaxed border-t border-slate-100 pt-3">
              ⚕️ Consulta con un médico especialista en medicina del viajero con <strong>al menos 4-6 semanas</strong> de anticipación.
            </p>
          </div>
        </CollapsibleSection>

        {/* ── Para familias con niños ── */}
        {(destino.riesgos.notas_pediatricas || hayNinos) && (
          <CollapsibleSection
            title="Para familias con niños"
            icon="👶"
            accentClass="border-amber-300"
            defaultOpen={true}
          >
            <div className="mt-2 space-y-3">
              {/* Notas específicas del destino */}
              {destino.riesgos.notas_pediatricas && (
                <p className="text-sm text-amber-800 leading-relaxed">{destino.riesgos.notas_pediatricas}</p>
              )}

              {/* Cuidados generales para niños viajeros */}
              {hayNinos && (
                <div className="bg-amber-50 rounded-xl border border-amber-100 p-3.5 space-y-2">
                  <p className="text-[11px] font-bold text-amber-700 uppercase tracking-wide">
                    🧒 Seguridad general para niños viajeros
                  </p>
                  <div className="flex flex-col gap-2">
                    {[
                      { icon: '🏊', text: 'Baño seguro: supervisión constante en piscinas, playas, ríos y bañeras. El ahogamiento es la principal causa de muerte accidental en niños viajeros — nunca dejarlos solos, aunque sepan nadar. Impedir que traguen agua de piscina, río o mar.' },
                      { icon: '💧', text: 'Suero de rehidratación oral (SRO/SRI): llevar siempre en el botiquín. Ante diarrea o vómitos, iniciar de inmediato con pequeños sorbos frecuentes. Los niños pequeños se deshidratan mucho más rápido que los adultos. Si hay signos de alarma (decaimiento extremo, orina escasa, llanto sin lágrimas), buscar atención médica urgente.' },
                      { icon: '☀️', text: 'Protector solar FPS 50+ y reposición cada 2 h. En menores de 6 meses evitar exposición directa al sol. Ropa manga larga y sombrero en horario pico (10:00–16:00).' },
                      { icon: '🦟', text: 'Repelente DEET al 10–30% desde los 2 meses. En lactantes, aplicar en ropa, no en piel. No usar en manos ni zona de ojos.' },
                      { icon: '🤕', text: 'Calzado cerrado en zonas de aventura, selva y playas rocosas. Evitar caminar descalzos en tierra húmeda o arena (riesgo de larva migrans y picaduras).' },
                      { icon: '🏥', text: 'Guardar número de emergencias locales, seguro de viaje y centro de salud más cercano desde el primer día. El deterioro en niños puede ser más rápido que en adultos.' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="text-base flex-shrink-0">{item.icon}</span>
                        <p className="text-xs text-amber-800 leading-relaxed">{item.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CollapsibleSection>
        )}

        {/* ── Escalas ── */}
        {viaje.escalas && viaje.escalas.length > 0 && (
          <CollapsibleSection
            title="Escalas en tu ruta"
            icon="✈️"
            count={viaje.escalas.length}
            countLabel="escalas"
            accentClass="border-blue-300"
            defaultOpen={false}
          >
            <div className="flex flex-col gap-4 mt-2">
              {viaje.escalas.map((escala: { destino: string; horas: number }, idx: number) => {
                const info = getEscalaInfo(escala.destino)
                if (!info) return null
                const saludMeta = NIVEL_SALUD_META[info.nivel_salud]
                const visaMeta  = VISA_META[info.aduana.visa as keyof typeof VISA_META]
                const durLabel  = escala.horas < 3 ? '< 2 h' : escala.horas <= 6 ? '3–6 h' : escala.horas <= 12 ? '7–12 h' : escala.horas <= 24 ? '13–24 h' : '+24 h'

                return (
                  <div key={idx} className="bg-slate-50 rounded-xl border border-slate-100 overflow-hidden">
                    <div className="flex items-center gap-3 px-4 pt-4 pb-3 border-b border-slate-100">
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
                      <div>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-2">🏥 Riesgos de salud</p>
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

                      <div>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-2">🛃 Aduana e ingreso</p>
                        <div className={`rounded-xl border px-3 py-2.5 mb-3 ${visaMeta.bg}`}>
                          <p className={`text-xs font-semibold ${visaMeta.color}`}>{visaMeta.icon} {info.aduana.visa_nota}</p>
                        </div>
                        <p className="text-[11px] font-semibold text-slate-500 mb-1.5">Documentos necesarios</p>
                        <div className="flex flex-col gap-1 mb-3">
                          {info.aduana.documentos.map((d, i) => (
                            <div key={i} className="flex items-start gap-2">
                              <span className="text-slate-400 text-xs mt-0.5">•</span>
                              <p className="text-xs text-slate-600">{d}</p>
                            </div>
                          ))}
                        </div>
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

                      {info.notas_transito && (
                        <div className="bg-blue-50 border border-blue-100 rounded-xl px-3 py-2.5">
                          <p className="text-xs text-blue-700 leading-relaxed">💡 {info.notas_transito}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </CollapsibleSection>
        )}

        {/* Disclaimer */}
        <p className="text-[11px] text-slate-400 text-center mt-2 leading-relaxed">
          SARIQAMA entrega orientación sanitaria basada en fuentes validadas.<br />
          No reemplaza evaluación médica profesional. Ante signos de alarma, busca atención inmediata.
        </p>
      </main>
    </div>
  )
}
