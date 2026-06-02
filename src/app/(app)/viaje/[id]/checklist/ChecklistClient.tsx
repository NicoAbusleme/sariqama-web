'use client'

import { useState, useTransition } from 'react'
import { toggleChecklistItem } from '@/app/actions/viaje'
import { cn } from '@/lib/utils'
import { Syringe, Pill, FileText, Shield, ShieldCheck, Package, CheckCircle2 } from 'lucide-react'

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

const CATEGORIA_META: Record<string, {
  label: string
  Icon: React.ElementType
  dot: string
  bg: string
  border: string
}> = {
  vacunas:    { label: 'Vacunas',         Icon: Syringe,     dot: 'bg-purple-400', bg: 'bg-purple-50', border: 'border-purple-100' },
  botiquin:   { label: 'Botiquín',        Icon: Pill,        dot: 'bg-blue-400',   bg: 'bg-blue-50',   border: 'border-blue-100' },
  documentos: { label: 'Documentos',      Icon: FileText,    dot: 'bg-amber-400',  bg: 'bg-amber-50',  border: 'border-amber-100' },
  repelente:  { label: 'Protección',      Icon: Shield,      dot: 'bg-emerald-400',bg: 'bg-emerald-50',border: 'border-emerald-100' },
  seguro:     { label: 'Seguro de viaje', Icon: ShieldCheck, dot: 'bg-teal-400',   bg: 'bg-[#E8F7F4]', border: 'border-[#2D9E8C]/20' },
  otros:      { label: 'Otros',           Icon: Package,     dot: 'bg-slate-300',  bg: 'bg-slate-50',  border: 'border-slate-100' },
}

const PRIORIDAD_DOT: Record<string, string> = {
  alta:  'bg-red-400',
  media: 'bg-amber-400',
  baja:  'bg-slate-300',
}
const PRIORIDAD_LABEL: Record<string, string> = {
  alta: 'Alta', media: 'Media', baja: 'Baja',
}

export function ChecklistClient({ items: initialItems, viajeId }: Props) {
  const [items, setItems] = useState(initialItems)
  const [pending, startTransition] = useTransition()

  function toggle(itemId: string, current: boolean) {
    setItems(prev => prev.map(i => i.id === itemId ? { ...i, completado: !current } : i))
    startTransition(async () => {
      const res = await toggleChecklistItem(itemId, !current, viajeId)
      if (res?.error) {
        setItems(prev => prev.map(i => i.id === itemId ? { ...i, completado: current } : i))
      }
    })
  }

  const categorias = Object.keys(CATEGORIA_META).filter(cat =>
    items.some(i => i.categoria === cat)
  )

  const completados = items.filter(i => i.completado).length
  const total = items.length
  const progreso = total > 0 ? Math.round((completados / total) * 100) : 0
  const listo = progreso === 100

  return (
    <>
      {/* ── Progress card ─────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-[#E8EEF4] p-4 mb-5"
        style={{ boxShadow: 'var(--shadow-xs)' }}>
        <div className="flex justify-between items-center mb-2.5">
          <span className="text-sm font-semibold text-[#1A3D5C]">Progreso de preparación</span>
          <span className="text-sm font-bold text-[#2D9E8C]">{completados}/{total}</span>
        </div>
        <div className="h-2 bg-[#F0F4F8] rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500",
              listo ? "bg-emerald-500" : "bg-[#2D9E8C]"
            )}
            style={{ width: `${progreso}%` }}
          />
        </div>
        <p className="text-xs text-slate-400 mt-2">
          {listo
            ? '¡Todo listo para el viaje!'
            : `${progreso}% completado — ${total - completados} tarea${total - completados !== 1 ? 's' : ''} pendiente${total - completados !== 1 ? 's' : ''}`}
        </p>
      </div>

      {/* ── Grupos por categoría ───────────────────────────────────────── */}
      <div className="space-y-4">
        {categorias.map(cat => {
          const meta = CATEGORIA_META[cat]
          const { Icon } = meta
          const catItems = items.filter(i => i.categoria === cat)
          const catCompletados = catItems.filter(i => i.completado).length

          return (
            <div key={cat} className="bg-white rounded-2xl border border-[#E8EEF4] overflow-hidden"
              style={{ boxShadow: 'var(--shadow-xs)' }}>
              {/* Header categoría */}
              <div className={cn('px-4 py-3 border-b flex items-center justify-between', meta.bg, meta.border)}>
                <div className="flex items-center gap-2">
                  <span className={cn('w-2 h-2 rounded-full flex-shrink-0', meta.dot)} aria-hidden="true" />
                  <Icon className="h-3.5 w-3.5 text-slate-600" strokeWidth={2} aria-hidden="true" />
                  <span className="font-semibold text-slate-700 text-sm">{meta.label}</span>
                </div>
                <span className="text-xs text-slate-400 font-medium">
                  {catCompletados}/{catItems.length}
                </span>
              </div>

              {/* Items */}
              <div className="divide-y divide-[#F0F4F8]">
                {catItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => toggle(item.id, item.completado)}
                    disabled={pending}
                    className={cn(
                      'w-full px-4 py-3.5 text-left transition-colors duration-150',
                      item.completado ? 'bg-[#F8FAFB]' : 'bg-white hover:bg-slate-50/50'
                    )}
                  >
                    <div className="flex items-start gap-3">
                      {/* Checkbox */}
                      <div className={cn(
                        'w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-all duration-150',
                        item.completado
                          ? 'border-[#2D9E8C] bg-[#2D9E8C]'
                          : 'border-slate-300'
                      )}>
                        {item.completado && (
                          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor" strokeWidth={3} aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className={cn(
                          'text-sm font-medium leading-snug transition-colors',
                          item.completado ? 'line-through text-slate-400' : 'text-[#1A3D5C]'
                        )}>
                          {item.tarea}
                        </p>
                        {item.descripcion && !item.completado && (
                          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                            {item.descripcion}
                          </p>
                        )}
                        {!item.completado && (
                          <span className="inline-flex items-center gap-1 mt-1.5">
                            <span className={cn('w-1.5 h-1.5 rounded-full', PRIORIDAD_DOT[item.prioridad])} aria-hidden="true" />
                            <span className="text-[11px] text-slate-400 font-medium">
                              Prioridad {PRIORIDAD_LABEL[item.prioridad] ?? item.prioridad}
                            </span>
                          </span>
                        )}
                      </div>

                      {item.completado && (
                        <CheckCircle2 className="h-4 w-4 text-[#2D9E8C] flex-shrink-0 mt-0.5" aria-hidden="true" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <p className="text-[11px] text-slate-400 text-center mt-6 leading-relaxed">
        SARIQAMA entrega orientación sanitaria. No reemplaza evaluación médica profesional.
      </p>
    </>
  )
}
