'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, Loader2, Calendar, Compass, Shield } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { editarViaje } from '@/app/actions/viaje'
import type { TipoViaje } from '@/types'

const TIPOS: { id: TipoViaje; emoji: string; label: string; desc: string }[] = [
  { id: 'playa',    emoji: '🏖️', label: 'Playa',    desc: 'Sol, mar y descanso' },
  { id: 'urbano',   emoji: '🏙️', label: 'Ciudad',   desc: 'Turismo urbano y cultura' },
  { id: 'aventura', emoji: '🏕️', label: 'Aventura', desc: 'Naturaleza y actividades' },
  { id: 'rural',    emoji: '🌿', label: 'Rural',     desc: 'Campo, selva o montaña' },
  { id: 'familiar', emoji: '👨‍👩‍👧', label: 'Familiar', desc: 'Visita a familia o amigos' },
  { id: 'crucero',  emoji: '🚢', label: 'Crucero',   desc: 'Viaje en crucero' },
]

interface InitialData {
  destino_nombre: string
  fecha_salida: string
  fecha_regreso: string
  tipos: string[] | null
  seguro_viaje?: string | null
  seguro_compania?: string | null
}

interface Props {
  viajeId: string
  initialData: InitialData
}

export function EditarViajeClient({ viajeId, initialData }: Props) {
  const hoy = new Date().toISOString().split('T')[0]

  const [fechaSalida,    setFechaSalida]    = useState(initialData.fecha_salida)
  const [fechaRegreso,   setFechaRegreso]   = useState(initialData.fecha_regreso)
  const [tipos,          setTipos]          = useState<TipoViaje[]>((initialData.tipos ?? []) as TipoViaje[])
  const [seguroViaje,    setSeguroViaje]    = useState<'si' | 'no' | 'no_decidido' | ''>(
    (initialData.seguro_viaje as 'si' | 'no' | 'no_decidido') ?? ''
  )
  const [seguroCompania, setSeguroCompania] = useState(initialData.seguro_compania ?? '')
  const [loading,        setLoading]        = useState(false)
  const [error,          setError]          = useState<string | null>(null)

  function toggleTipo(t: TipoViaje) {
    setTipos(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t])
  }

  const isValid = fechaSalida && fechaRegreso && fechaRegreso >= fechaSalida && tipos.length > 0

  async function handleGuardar() {
    if (!isValid) return
    setLoading(true)
    setError(null)

    const result = await editarViaje(viajeId, {
      fecha_salida:    fechaSalida,
      fecha_regreso:   fechaRegreso,
      tipos,
      seguro_viaje:    seguroViaje || undefined,
      seguro_compania: (seguroViaje === 'si' && seguroCompania.trim()) ? seguroCompania.trim() : undefined,
    })

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFB]">
      <header className="bg-white border-b border-[#E8EEF4] px-5 pt-5 pb-4">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Link href={`/viaje/${viajeId}`}>
            <span className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-[#1A3D5C] hover:bg-[#F0F4F8] transition-colors">
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </span>
          </Link>
          <div>
            <h1 className="text-xl font-semibold text-[#1A3D5C]" style={{ fontFamily: 'var(--font-fraunces)' }}>
              Editar viaje
            </h1>
            <p className="text-xs text-slate-400">{initialData.destino_nombre}</p>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-5 pt-5 pb-32 flex flex-col gap-5">

        {/* Fechas */}
        <section className="bg-white rounded-2xl border border-[#E8EEF4] p-5" style={{ boxShadow: 'var(--shadow-xs)' }}>
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="h-4 w-4 text-[#2D9E8C]" aria-hidden="true" />
            <p className="text-sm font-semibold text-[#1A3D5C]">Fechas</p>
          </div>
          <div className="flex flex-col gap-3">
            <div>
              <label className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5 block">
                Fecha de salida
              </label>
              <Input type="date" value={fechaSalida} min={hoy}
                onChange={e => { setFechaSalida(e.target.value); if (fechaRegreso && e.target.value > fechaRegreso) setFechaRegreso('') }}
                className="h-11 rounded-xl border-slate-200 text-slate-900" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5 block">
                Fecha de regreso
              </label>
              <Input type="date" value={fechaRegreso} min={fechaSalida || hoy}
                onChange={e => setFechaRegreso(e.target.value)}
                className="h-11 rounded-xl border-slate-200 text-slate-900" />
            </div>
            {fechaSalida && fechaRegreso && fechaRegreso >= fechaSalida && (
              <div className="p-3 bg-[#E8F7F4] rounded-xl border border-[#2D9E8C]/20 text-center">
                <p className="text-sm font-semibold text-[#237F70]">
                  {Math.ceil((new Date(fechaRegreso).getTime() - new Date(fechaSalida).getTime()) / 86400000)} días de viaje
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Tipo de viaje */}
        <section className="bg-white rounded-2xl border border-[#E8EEF4] p-5" style={{ boxShadow: 'var(--shadow-xs)' }}>
          <div className="flex items-center gap-2 mb-4">
            <Compass className="h-4 w-4 text-[#2D9E8C]" aria-hidden="true" />
            <p className="text-sm font-semibold text-[#1A3D5C]">Tipo de viaje</p>
            <span className="text-xs text-slate-400 ml-1">(puedes seleccionar más de uno)</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {TIPOS.map(t => {
              const sel = tipos.includes(t.id)
              return (
                <button key={t.id} onClick={() => toggleTipo(t.id)}
                  className={cn(
                    'bg-white rounded-2xl border p-3.5 text-left transition-all relative',
                    sel ? 'border-[#2D9E8C] ring-2 ring-[#E8F7F4] bg-[#F0FBF9]' : 'border-slate-100 hover:border-[#2D9E8C]/30'
                  )}>
                  {sel && (
                    <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#2D9E8C] flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                  <div className="text-xl mb-1.5">{t.emoji}</div>
                  <p className="font-semibold text-slate-900 text-sm">{t.label}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{t.desc}</p>
                </button>
              )
            })}
          </div>
        </section>

        {/* Seguro */}
        <section className="bg-white rounded-2xl border border-[#E8EEF4] p-5" style={{ boxShadow: 'var(--shadow-xs)' }}>
          <div className="flex items-center gap-2 mb-4">
            <Shield className="h-4 w-4 text-[#2D9E8C]" aria-hidden="true" />
            <p className="text-sm font-semibold text-[#1A3D5C]">Seguro médico de viaje</p>
          </div>
          <div className="flex flex-col gap-2">
            {([
              { id: 'si' as const,          label: 'Sí, ya tenemos seguro',          color: 'border-[#2D9E8C] bg-[#F0FBF9]' },
              { id: 'no' as const,          label: 'No, viajaremos sin seguro',      color: 'border-orange-300 bg-orange-50' },
              { id: 'no_decidido' as const, label: 'Aún no lo hemos decidido',       color: 'border-slate-300 bg-slate-50' },
            ] as const).map(op => (
              <button key={op.id} onClick={() => { setSeguroViaje(op.id); if (op.id !== 'si') setSeguroCompania('') }}
                className={cn(
                  'w-full text-left p-3.5 rounded-xl border transition-all text-sm font-medium',
                  seguroViaje === op.id ? op.color : 'border-slate-100 text-slate-600 hover:border-slate-200'
                )}>
                {op.label}
              </button>
            ))}
          </div>
          {seguroViaje === 'si' && (
            <div className="mt-3">
              <label className="text-xs font-medium text-slate-500 mb-1.5 block">
                Compañía aseguradora <span className="font-normal text-slate-400">(opcional)</span>
              </label>
              <Input value={seguroCompania} onChange={e => setSeguroCompania(e.target.value)}
                placeholder="Ej: Assist Card, Mapfre, AXA…" className="h-11 bg-slate-50" />
            </div>
          )}
        </section>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{error}</div>
        )}
      </main>

      <div className="fixed bottom-[72px] left-0 right-0 bg-white border-t border-slate-100 px-5 py-4 z-30">
        <div className="max-w-2xl mx-auto">
          <button onClick={handleGuardar} disabled={!isValid || loading}
            className="w-full h-12 bg-[#2D9E8C] hover:bg-[#237F70] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-2xl flex items-center justify-center gap-2 transition-colors">
            {loading ? <><Loader2 className="h-4 w-4 animate-spin" />Guardando...</> : 'Guardar cambios'}
          </button>
        </div>
      </div>
    </div>
  )
}
