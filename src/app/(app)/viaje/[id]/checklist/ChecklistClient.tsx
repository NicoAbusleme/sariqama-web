'use client'

import { useState, useTransition } from 'react'
import { toggleChecklistItem } from '@/app/actions/viaje'
import { cn } from '@/lib/utils'

interface Item {
  id: string
  tarea: string
  descripcion?: string | null
  categoria: string
  completado: boolean
  prioridad: string
}

interface Props {
  items: Item[]
  viajeId: string
}

const CATEGORIA_META: Record<string, { label: string; emoji: string; color: string }> = {
  vacunas:    { label: 'Vacunas',           emoji: '💉', color: 'bg-purple-50 border-purple-100' },
  botiquin:   { label: 'Botiquín',          emoji: '💊', color: 'bg-blue-50 border-blue-100' },
  documentos: { label: 'Documentos',        emoji: '📄', color: 'bg-amber-50 border-amber-100' },
  repelente:  { label: 'Protección',        emoji: '🦟', color: 'bg-green-50 border-green-100' },
  seguro:     { label: 'Seguro de viaje',   emoji: '🛡️', color: 'bg-teal-50 border-teal-100' },
  otros:      { label: 'Otros',             emoji: '📦', color: 'bg-slate-50 border-slate-100' },
}

const PRIORIDAD_COLOR: Record<string, string> = {
  alta:  'text-red-500',
  media: 'text-amber-500',
  baja:  'text-slate-400',
}
const PRIORIDAD_LABEL: Record<string, string> = {
  alta: '● Alta', media: '● Media', baja: '● Baja',
}

export function ChecklistClient({ items: initialItems, viajeId }: Props) {
  const [items, setItems] = useState(initialItems)
  const [pending, startTransition] = useTransition()

  function toggle(itemId: string, current: boolean) {
    // Optimistic update
    setItems(prev => prev.map(i => i.id === itemId ? { ...i, completado: !current } : i))

    startTransition(async () => {
      const res = await toggleChecklistItem(itemId, !current, viajeId)
      if (res?.error) {
        // Revert on error
        setItems(prev => prev.map(i => i.id === itemId ? { ...i, completado: current } : i))
      }
    })
  }

  // Group by category
  const categorias = Object.keys(CATEGORIA_META).filter(cat =>
    items.some(i => i.categoria === cat)
  )

  const completados = items.filter(i => i.completado).length
  const total = items.length
  const progreso = total > 0 ? Math.round((completados / total) * 100) : 0

  return (
    <>
      {/* Progress bar */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 mb-5">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold text-slate-700">Progreso de preparación</span>
          <span className="text-sm font-bold text-[#2D9E8C]">{completados}/{total}</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-3">
          <div
            className="bg-amber-400 h-3 rounded-full transition-all duration-500"
            style={{ width: `${progreso}%` }}
          />
        </div>
        <p className="text-xs text-slate-400 mt-2">
          {progreso === 100
            ? '🎉 ¡Todo listo para el viaje!'
            : `${progreso}% completado — ${total - completados} tarea${total - completados !== 1 ? 's' : ''} pendiente${total - completados !== 1 ? 's' : ''}`}
        </p>
      </div>

      {/* Groups */}
      <div className="flex flex-col gap-4">
        {categorias.map(cat => {
          const meta = CATEGORIA_META[cat]
          const catItems = items.filter(i => i.categoria === cat)
          const catCompletados = catItems.filter(i => i.completado).length

          return (
            <div key={cat} className={cn('rounded-2xl border p-4', meta.color)}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{meta.emoji}</span>
                  <span className="font-semibold text-slate-800 text-sm">{meta.label}</span>
                </div>
                <span className="text-xs text-slate-400 font-medium">
                  {catCompletados}/{catItems.length}
                </span>
              </div>

              <div className="flex flex-col gap-2.5">
                {catItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => toggle(item.id, item.completado)}
                    disabled={pending}
                    className={cn(
                      'w-full bg-white rounded-xl border p-3.5 text-left transition-all',
                      item.completado
                        ? 'border-[#2D9E8C]/30 bg-[#E0F5F2]/50'
                        : 'border-slate-100 hover:border-[#2D9E8C]/30'
                    )}
                  >
                    <div className="flex items-start gap-3">
                      {/* Checkbox visual */}
                      <div className={cn(
                        'w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-all',
                        item.completado
                          ? 'border-[#2D9E8C] bg-[#2D9E8C]'
                          : 'border-slate-300'
                      )}>
                        {item.completado && (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className={cn(
                          'text-sm font-medium leading-snug',
                          item.completado ? 'line-through text-slate-400' : 'text-slate-800'
                        )}>
                          {item.tarea}
                        </p>
                        {item.descripcion && !item.completado && (
                          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                            {item.descripcion}
                          </p>
                        )}
                        <span className={cn('text-[11px] font-semibold mt-1.5 block', PRIORIDAD_COLOR[item.prioridad])}>
                          {PRIORIDAD_LABEL[item.prioridad]}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Disclaimer */}
      <p className="text-[11px] text-slate-400 text-center mt-6 leading-relaxed">
        SARIQAMA entrega orientación sanitaria. No reemplaza evaluación médica profesional.
      </p>
    </>
  )
}
