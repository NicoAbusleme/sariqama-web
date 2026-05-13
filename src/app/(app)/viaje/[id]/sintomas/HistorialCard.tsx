'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

const SEMAFORO_META = {
  verde:    { dot: 'bg-green-500',  badge: 'bg-green-100 text-green-700',  text: 'text-green-700',  label: 'Sin alarma' },
  amarillo: { dot: 'bg-amber-400',  badge: 'bg-amber-100 text-amber-700',  text: 'text-amber-700',  label: 'Atención' },
  rojo:     { dot: 'bg-red-500',    badge: 'bg-red-100 text-red-700',      text: 'text-red-700',    label: 'Urgencia' },
}

const SINTOMA_LABELS: Record<string, string> = {
  fiebre: '🌡️ Fiebre', fiebre_alta: '🌡️ Fiebre >38.5°C',
  diarrea: '💧 Diarrea', diarrea_con_sangre: '💧 Diarrea con sangre',
  vomitos: '🤮 Vómitos', cefalea_intensa: '🤕 Cefalea intensa',
  rash_manchas: '🔴 Manchas/sarpullido', dolor_abdominal: '😣 Dolor abdominal',
  decaimiento_marcado: '😓 Decaimiento', sangrado: '🩸 Sangrado',
  dificultad_respiratoria: '😮‍💨 Dif. respiratoria',
  rechazo_liquidos: '🚫 Rechazo de líquidos', llanto_sin_lagrimas: '😢 Llanto sin lágrimas',
  baja_orina: '🚽 Poca orina',
}
const EXPOSICION_LABELS: Record<string, string> = {
  picadura_mosquito: '🦟 Picadura de mosquito',
  mordedura_animal:  '🐾 Mordedura de animal',
  agua_no_segura:    '🚰 Agua sin tratar',
}

interface Registro {
  id: string
  semaforo: string
  titulo: string | null
  created_at: string
  viajero_nombre: string | null
  dias_sintomas: number | null
  sintomas: string[] | null
  exposiciones: string[] | null
  acciones: string[] | null
}

export function HistorialCard({ reg, isFirst }: { reg: Registro; isFirst: boolean }) {
  const [abierto, setAbierto] = useState(false)

  const meta = SEMAFORO_META[reg.semaforo as keyof typeof SEMAFORO_META] ?? SEMAFORO_META.verde
  const fecha = new Date(reg.created_at)
  const esHoy = new Date().toDateString() === fecha.toDateString()

  const sintTags = (reg.sintomas ?? []).filter(
    k => !['fiebre_alta', 'diarrea_con_sangre'].includes(k)
  )
  const expTags  = reg.exposiciones ?? []
  const acciones = reg.acciones ?? []

  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
      {/* Cabecera siempre visible — toca para expandir */}
      <button
        onClick={() => setAbierto(v => !v)}
        className="w-full p-4 text-left cursor-pointer"
      >
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2 flex-wrap">
            <div className={cn('w-3 h-3 rounded-full flex-shrink-0', meta.dot)} />
            <span className="text-sm font-semibold text-slate-800">
              {reg.titulo ?? meta.label}
            </span>
            {isFirst && (
              <span className="text-[10px] bg-teal-100 text-teal-700 font-bold px-2 py-0.5 rounded-full">
                ÚLTIMO
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="text-right">
              <p className="text-xs font-medium text-slate-600">
                {esHoy ? 'Hoy' : fecha.toLocaleDateString('es-CL', { day: 'numeric', month: 'short' })}
              </p>
              <p className="text-[11px] text-slate-400">
                {fecha.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            <ChevronDown className={cn('h-4 w-4 text-slate-400 transition-transform', abierto && 'rotate-180')} />
          </div>
        </div>

        {/* Resumen compacto */}
        <div className="flex flex-wrap gap-1.5">
          {reg.viajero_nombre && (
            <span className="text-[11px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
              👤 {reg.viajero_nombre}
            </span>
          )}
          {(reg.dias_sintomas ?? 0) > 0 && (
            <span className="text-[11px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
              📅 {reg.dias_sintomas} día{reg.dias_sintomas !== 1 ? 's' : ''}
            </span>
          )}
          {sintTags.slice(0, 3).map(k => (
            <span key={k} className={cn('text-[11px] px-2 py-0.5 rounded-full font-medium', meta.badge)}>
              {SINTOMA_LABELS[k]?.split(' ').slice(1).join(' ') ?? k}
            </span>
          ))}
          {sintTags.length > 3 && (
            <span className="text-[11px] bg-slate-100 text-slate-400 px-2 py-0.5 rounded-full">
              +{sintTags.length - 3} más
            </span>
          )}
          {sintTags.length === 0 && (
            <span className="text-[11px] text-slate-400 italic">Sin síntomas</span>
          )}
        </div>
      </button>

      {/* Detalle expandido */}
      {abierto && (
        <div className="border-t border-slate-100 p-4 flex flex-col gap-4">

          {/* Síntomas completos */}
          {sintTags.length > 0 && (
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-2">
                Síntomas registrados
              </p>
              <div className="flex flex-col gap-1.5">
                {sintTags.map(k => (
                  <div key={k} className="flex items-center gap-2">
                    <div className={cn('w-2 h-2 rounded-full flex-shrink-0', meta.dot)} />
                    <span className="text-sm text-slate-700">{SINTOMA_LABELS[k] ?? k}</span>
                  </div>
                ))}
                {/* Sub-síntomas */}
                {(reg.sintomas ?? []).includes('fiebre_alta') && (
                  <div className="flex items-center gap-2 ml-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                    <span className="text-xs text-red-600">Temperatura mayor a 38.5°C</span>
                  </div>
                )}
                {(reg.sintomas ?? []).includes('diarrea_con_sangre') && (
                  <div className="flex items-center gap-2 ml-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                    <span className="text-xs text-red-600">Con sangre en deposiciones</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Exposiciones */}
          {expTags.length > 0 && (
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-2">
                Exposiciones
              </p>
              <div className="flex flex-wrap gap-1.5">
                {expTags.map(k => (
                  <span key={k} className="text-xs bg-amber-50 text-amber-700 border border-amber-100 px-2.5 py-1 rounded-full">
                    {EXPOSICION_LABELS[k] ?? k}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Acciones recomendadas */}
          {acciones.length > 0 && (
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-2">
                Recomendaciones dadas
              </p>
              <div className="flex flex-col gap-2">
                {acciones.map((acc, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-500 text-xs flex items-center justify-center flex-shrink-0 font-bold">
                      {i + 1}
                    </span>
                    <p className="text-sm text-slate-600 leading-relaxed">{acc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
