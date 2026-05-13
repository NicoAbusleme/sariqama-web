'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronRight, MapPin, Calendar, Compass, Loader2, ChevronLeft, Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { crearViaje } from '@/app/actions/viaje'
import { DESTINOS_PILOTO } from '@/lib/content/destinos'
import { cn } from '@/lib/utils'
import type { TipoViaje } from '@/types'

const TIPOS: { id: TipoViaje; emoji: string; label: string; desc: string }[] = [
  { id: 'playa',    emoji: '🏖️', label: 'Playa',    desc: 'Sol, mar y descanso' },
  { id: 'urbano',   emoji: '🏙️', label: 'Ciudad',   desc: 'Turismo urbano y cultura' },
  { id: 'aventura', emoji: '🏕️', label: 'Aventura', desc: 'Naturaleza y actividades' },
  { id: 'rural',    emoji: '🌿', label: 'Rural',     desc: 'Campo, selva o montaña' },
  { id: 'familiar', emoji: '👨‍👩‍👧', label: 'Familiar', desc: 'Visita a familia o amigos' },
  { id: 'crucero',  emoji: '🚢', label: 'Crucero',   desc: 'Viaje en crucero' },
]

const NIVEL_COLOR: Record<string, string> = {
  muy_alto: 'bg-red-100 text-red-700',
  alto:     'bg-orange-100 text-orange-700',
  moderado: 'bg-yellow-100 text-yellow-700',
  bajo:     'bg-green-100 text-green-700',
  no_aplica:'bg-slate-100 text-slate-400',
}
const NIVEL_LABEL: Record<string, string> = {
  muy_alto: 'Muy alto', alto: 'Alto', moderado: 'Moderado', bajo: 'Bajo', no_aplica: 'N/A',
}

const ESCALAS_POR_DESTINO: Record<string, { label: string; flag: string }[]> = {
  'brasil-nordeste': [
    { label: 'São Paulo, Brasil',        flag: '🇧🇷' },
    { label: 'Rio de Janeiro, Brasil',   flag: '🇧🇷' },
    { label: 'Fortaleza, Brasil',        flag: '🇧🇷' },
    { label: 'Lima, Perú',               flag: '🇵🇪' },
    { label: 'Bogotá, Colombia',         flag: '🇨🇴' },
    { label: 'Buenos Aires, Argentina',  flag: '🇦🇷' },
    { label: 'Panamá, Panamá',           flag: '🇵🇦' },
    { label: 'Miami, EE.UU.',            flag: '🇺🇸' },
    { label: 'Madrid, España',           flag: '🇪🇸' },
  ],
  'caribe-republica-dominicana': [
    { label: 'Miami, EE.UU.',            flag: '🇺🇸' },
    { label: 'Bogotá, Colombia',         flag: '🇨🇴' },
    { label: 'Lima, Perú',               flag: '🇵🇪' },
    { label: 'Panamá, Panamá',           flag: '🇵🇦' },
    { label: 'San Juan, Puerto Rico',    flag: '🇵🇷' },
    { label: 'Ciudad de México, México', flag: '🇲🇽' },
    { label: 'Nueva York, EE.UU.',       flag: '🇺🇸' },
  ],
  'centroamerica-costa-rica': [
    { label: 'Panamá, Panamá',           flag: '🇵🇦' },
    { label: 'Bogotá, Colombia',         flag: '🇨🇴' },
    { label: 'Lima, Perú',               flag: '🇵🇪' },
    { label: 'Ciudad de México, México', flag: '🇲🇽' },
    { label: 'Miami, EE.UU.',            flag: '🇺🇸' },
    { label: 'San Salvador, El Salvador',flag: '🇸🇻' },
    { label: 'Guatemala, Guatemala',     flag: '🇬🇹' },
  ],
  'mexico-cancun-riviera': [
    { label: 'Ciudad de México, México', flag: '🇲🇽' },
    { label: 'Guadalajara, México',      flag: '🇲🇽' },
    { label: 'Monterrey, México',        flag: '🇲🇽' },
    { label: 'Bogotá, Colombia',         flag: '🇨🇴' },
    { label: 'Lima, Perú',               flag: '🇵🇪' },
    { label: 'Panamá, Panamá',           flag: '🇵🇦' },
    { label: 'Miami, EE.UU.',            flag: '🇺🇸' },
    { label: 'Dallas, EE.UU.',           flag: '🇺🇸' },
  ],
}

const HORAS_OPTIONS = [
  { v: 2,  label: '< 2 h' },
  { v: 6,  label: '3–6 h' },
  { v: 12, label: '7–12 h' },
  { v: 24, label: '13–24 h' },
  { v: 48, label: '+24 h' },
]

interface Escala {
  id: number
  destino: string
  horas: number
}

export default function NuevoViajePage() {
  const router = useRouter()
  const [paso, setPaso] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [destinoSlug, setDestinoSlug] = useState('')
  const [escalas, setEscalas] = useState<Escala[]>([])
  const [nextEscalaId, setNextEscalaId] = useState(0)
  const [fechaSalida, setFechaSalida] = useState('')
  const [fechaRegreso, setFechaRegreso] = useState('')
  const [tipos, setTipos] = useState<TipoViaje[]>([])

  const totalPasos = 3
  const progreso = (paso / totalPasos) * 100
  const destino = DESTINOS_PILOTO.find(d => d.slug === destinoSlug)
  const hoy = new Date().toISOString().split('T')[0]

  // Escala helpers
  function addEscala() {
    setEscalas(prev => [...prev, { id: nextEscalaId, destino: '', horas: 6 }])
    setNextEscalaId(n => n + 1)
  }
  function removeEscala(id: number) {
    setEscalas(prev => prev.filter(e => e.id !== id))
  }
  function updateEscala(id: number, field: 'destino' | 'horas', value: string | number) {
    setEscalas(prev => prev.map(e => e.id === id ? { ...e, [field]: value } : e))
  }

  // Tipo toggle
  function toggleTipo(t: TipoViaje) {
    setTipos(prev =>
      prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]
    )
  }

  async function handleSubmit() {
    if (!destinoSlug || !fechaSalida || !fechaRegreso || tipos.length === 0) return
    setLoading(true)
    setError(null)
    const result = await crearViaje({
      destino_slug:   destinoSlug,
      destino_nombre: destino!.nombre,
      fecha_salida:   fechaSalida,
      fecha_regreso:  fechaRegreso,
      tipo:           tipos[0],
      tipos,
      escalas: escalas
        .filter(e => e.destino !== '')
        .map(({ destino, horas }) => ({ destino, horas })),
    })
    if (result?.error) { setError(result.error); setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-[#F0FDF9]">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-5 h-14 flex items-center gap-3">
          <button onClick={() => paso > 1 ? setPaso(paso - 1) : router.back()}
            className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center">
            <ChevronLeft className="h-5 w-5 text-slate-500" />
          </button>
          <div className="flex-1">
            <p className="text-xs text-slate-400">Nuevo viaje · Paso {paso} de {totalPasos}</p>
            <Progress value={progreso} className="h-1 mt-1" />
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-5 py-6 pb-32">

        {/* ── PASO 1: Destino + Escalas ───────────────────────────────── */}
        {paso === 1 && (
          <div>
            <div className="mb-6">
              <div className="w-11 h-11 bg-teal-50 rounded-2xl flex items-center justify-center mb-3">
                <MapPin className="h-5 w-5 text-teal-600" />
              </div>
              <h1 className="text-2xl font-semibold text-slate-900 mb-1"
                style={{ fontFamily: 'var(--font-fraunces)' }}>
                ¿A dónde viajan?
              </h1>
              <p className="text-sm text-slate-500">Selecciona tu destino principal</p>
            </div>

            {/* Destinos */}
            <div className="flex flex-col gap-3 mb-6">
              {DESTINOS_PILOTO.map(d => {
                const dengue = d.riesgos.dengue
                const selected = destinoSlug === d.slug
                return (
                  <button key={d.slug} onClick={() => setDestinoSlug(d.slug)}
                    className={cn(
                      'w-full bg-white rounded-2xl border p-4 text-left transition-all',
                      selected ? 'border-teal-400 shadow-sm ring-2 ring-teal-100' : 'border-slate-100 hover:border-teal-200'
                    )}>
                    <div className="flex items-center gap-4">
                      <div className="text-3xl">
                        {d.pais === 'Brasil' ? '🇧🇷' : d.pais === 'República Dominicana' ? '🏝️' : d.pais === 'Costa Rica' ? '🇨🇷' : '🇲🇽'}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-slate-900 text-sm">{d.nombre}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{d.region}</p>
                      </div>
                      <span className={cn('text-[11px] font-semibold px-2.5 py-1 rounded-full', NIVEL_COLOR[dengue])}>
                        Dengue: {NIVEL_LABEL[dengue]}
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* ── Escalas ──────────────────────────────────────────────── */}
            {destinoSlug && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-700">¿Tendrán escalas?</p>
                    <p className="text-xs text-slate-400">Paradas en el camino al destino</p>
                  </div>
                  <button onClick={addEscala}
                    className="inline-flex items-center gap-1.5 bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-semibold px-3 py-2 rounded-xl transition-colors border border-teal-200">
                    <Plus className="h-3.5 w-3.5" /> Añadir escala
                  </button>
                </div>

                {escalas.length === 0 && (
                  <p className="text-xs text-slate-400 italic text-center py-3">Sin escalas — vuelo directo</p>
                )}

                <div className="flex flex-col gap-3">
                  {escalas.map((escala, idx) => (
                    <div key={escala.id} className="bg-white rounded-2xl border border-slate-100 p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                          Escala {idx + 1}
                        </span>
                        <button onClick={() => removeEscala(escala.id)}
                          className="w-6 h-6 rounded-full bg-slate-100 hover:bg-red-100 flex items-center justify-center transition-colors">
                          <X className="h-3.5 w-3.5 text-slate-400 hover:text-red-500" />
                        </button>
                      </div>

                      {/* Ciudad / País */}
                      <div className="mb-3">
                        <label className="text-xs font-medium text-slate-500 mb-1.5 block">
                          Ciudad o país de escala
                        </label>
                        <select
                          value={escala.destino}
                          onChange={e => updateEscala(escala.id, 'destino', e.target.value)}
                          className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 bg-white focus:outline-none focus:border-teal-400 cursor-pointer"
                        >
                          <option value="" disabled>Selecciona una ciudad…</option>
                          {(ESCALAS_POR_DESTINO[destinoSlug] ?? []).map(op => (
                            <option key={op.label} value={op.label}>
                              {op.flag} {op.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Duración */}
                      <div>
                        <label className="text-xs font-medium text-slate-500 mb-1.5 block">
                          Duración de la escala
                        </label>
                        <div className="flex gap-2 flex-wrap">
                          {HORAS_OPTIONS.map(op => (
                            <button key={op.v} onClick={() => updateEscala(escala.id, 'horas', op.v)}
                              className={cn(
                                'px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all',
                                escala.horas === op.v
                                  ? 'bg-teal-500 border-teal-500 text-white'
                                  : 'bg-white border-slate-200 text-slate-600 hover:border-teal-300'
                              )}>
                              {op.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-4 p-4 bg-teal-50 rounded-2xl border border-teal-100">
              <p className="text-xs text-teal-700 leading-relaxed">
                🌴 <strong>SARIQAMA</strong> es la única plataforma en español diseñada para familias que viajan a destinos tropicales.
              </p>
            </div>
          </div>
        )}

        {/* ── PASO 2: Fechas ──────────────────────────────────────────── */}
        {paso === 2 && (
          <div>
            <div className="mb-6">
              <div className="w-11 h-11 bg-teal-50 rounded-2xl flex items-center justify-center mb-3">
                <Calendar className="h-5 w-5 text-teal-600" />
              </div>
              <h1 className="text-2xl font-semibold text-slate-900 mb-1"
                style={{ fontFamily: 'var(--font-fraunces)' }}>
                ¿Cuándo viajan?
              </h1>
              <p className="text-sm text-slate-500">Las fechas nos ayudan a personalizar el checklist</p>
            </div>

            {/* Resumen destino + escalas */}
            <div className="bg-white rounded-2xl border border-slate-100 p-4 mb-5">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">
                  {destino?.pais === 'Brasil' ? '🇧🇷' : destino?.pais === 'República Dominicana' ? '🏝️' : destino?.pais === 'Costa Rica' ? '🇨🇷' : '🇲🇽'}
                </span>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">{destino?.nombre}</p>
                  <p className="text-xs text-slate-400">{destino?.region}</p>
                </div>
              </div>
              {escalas.filter(e => e.destino.trim()).length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2 pt-2 border-t border-slate-50">
                  {escalas.filter(e => e.destino.trim()).map((e, i) => (
                    <span key={e.id} className="text-[11px] bg-teal-50 text-teal-700 border border-teal-100 px-2.5 py-1 rounded-full">
                      ✈ Escala {i + 1}: {e.destino} · {HORAS_OPTIONS.find(o => o.v === e.horas)?.label}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-4">
              <div className="bg-white rounded-2xl border border-slate-100 p-5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3 block">
                  Fecha de salida
                </label>
                <Input type="date" value={fechaSalida} min={hoy}
                  onChange={e => { setFechaSalida(e.target.value); if (fechaRegreso && e.target.value > fechaRegreso) setFechaRegreso('') }}
                  className="h-11 rounded-xl border-slate-200 text-slate-900" />
              </div>
              <div className="bg-white rounded-2xl border border-slate-100 p-5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3 block">
                  Fecha de regreso
                </label>
                <Input type="date" value={fechaRegreso} min={fechaSalida || hoy}
                  onChange={e => setFechaRegreso(e.target.value)}
                  className="h-11 rounded-xl border-slate-200 text-slate-900" />
              </div>

              {fechaSalida && fechaRegreso && (
                <div className="p-4 bg-teal-50 rounded-2xl border border-teal-100 text-center">
                  <p className="text-sm font-semibold text-teal-700">
                    {Math.ceil((new Date(fechaRegreso).getTime() - new Date(fechaSalida).getTime()) / 86400000)} días de viaje
                  </p>
                  <p className="text-xs text-teal-600 mt-0.5">
                    {new Date(fechaSalida).toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' })}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── PASO 3: Tipo de viaje (multi-select) ─────────────────────── */}
        {paso === 3 && (
          <div>
            <div className="mb-6">
              <div className="w-11 h-11 bg-teal-50 rounded-2xl flex items-center justify-center mb-3">
                <Compass className="h-5 w-5 text-teal-600" />
              </div>
              <h1 className="text-2xl font-semibold text-slate-900 mb-1"
                style={{ fontFamily: 'var(--font-fraunces)' }}>
                ¿Qué tipo de viaje?
              </h1>
              <p className="text-sm text-slate-500">
                Puedes seleccionar más de uno — personalizamos el checklist
              </p>
            </div>

            {tipos.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-1.5">
                {tipos.map(t => {
                  const meta = TIPOS.find(x => x.id === t)!
                  return (
                    <span key={t} className="inline-flex items-center gap-1 text-xs bg-teal-100 text-teal-700 font-semibold px-2.5 py-1 rounded-full">
                      {meta.emoji} {meta.label}
                    </span>
                  )
                })}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              {TIPOS.map(t => {
                const sel = tipos.includes(t.id)
                return (
                  <button key={t.id} onClick={() => toggleTipo(t.id)}
                    className={cn(
                      'bg-white rounded-2xl border p-4 text-left transition-all relative',
                      sel ? 'border-teal-400 ring-2 ring-teal-100 shadow-sm' : 'border-slate-100 hover:border-teal-200'
                    )}>
                    {sel && (
                      <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-teal-500 flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                    <div className="text-2xl mb-2">{t.emoji}</div>
                    <p className="font-semibold text-slate-900 text-sm">{t.label}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{t.desc}</p>
                  </button>
                )
              })}
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                {error}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Botón fijo */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-4 z-50">
        <div className="max-w-2xl mx-auto">
          {paso < totalPasos ? (
            <Button
              onClick={() => setPaso(paso + 1)}
              disabled={
                (paso === 1 && !destinoSlug) ||
                (paso === 2 && (!fechaSalida || !fechaRegreso))
              }
              className="w-full h-13 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl font-semibold text-base">
              Continuar
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={tipos.length === 0 || loading}
              className="w-full h-13 bg-amber-400 hover:bg-amber-300 text-slate-900 rounded-2xl font-semibold text-base">
              {loading
                ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creando viaje...</>
                : `¡Crear mi viaje! 🌴`}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
