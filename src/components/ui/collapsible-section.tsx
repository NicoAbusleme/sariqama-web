'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface CollapsibleSectionProps {
  title: string
  icon?: string
  badge?: React.ReactNode          // chip/badge que aparece junto al título
  count?: number                   // número de items (ej: "4 alertas")
  countLabel?: string              // texto del conteo (default: "items")
  defaultOpen?: boolean
  accentClass?: string             // color del borde izquierdo (default: teal)
  children: React.ReactNode
}

export function CollapsibleSection({
  title,
  icon,
  badge,
  count,
  countLabel = 'items',
  defaultOpen = true,
  accentClass = 'border-[#2D9E8C]/40',
  children,
}: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className={`bg-white rounded-2xl border border-slate-100 overflow-hidden mb-4 border-l-4 ${accentClass}`}>
      {/* Header — siempre visible, clickable */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3.5 text-left hover:bg-slate-50 transition-colors"
        aria-expanded={open}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {icon && <span className="text-base flex-shrink-0">{icon}</span>}
          <span className="font-semibold text-slate-900 text-sm">{title}</span>
          {badge && <span className="flex-shrink-0">{badge}</span>}
          {count !== undefined && !open && (
            <span className="text-[11px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full flex-shrink-0">
              {count} {countLabel}
            </span>
          )}
        </div>
        <ChevronDown
          className={`h-4 w-4 text-slate-400 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Contenido colapsable */}
      {open && (
        <div className="px-4 pb-4 pt-1 border-t border-slate-50">
          {children}
        </div>
      )}
    </div>
  )
}
