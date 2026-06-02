'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CollapsibleSectionProps {
  title: string
  icon?: React.ReactNode
  badge?: React.ReactNode
  count?: number
  countLabel?: string
  defaultOpen?: boolean
  /** Color del dot indicador izquierdo (clase Tailwind bg-*) */
  accentDot?: string
  /** @deprecated Usa accentDot en su lugar */
  accentClass?: string
  children: React.ReactNode
  className?: string
}

export function CollapsibleSection({
  title,
  icon,
  badge,
  count,
  countLabel = 'items',
  defaultOpen = true,
  accentDot,
  accentClass: _accentClass, // aceptado por compat, ignorado visualmente
  children,
  className,
}: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className={cn("bg-white rounded-2xl border border-[#E8EEF4] overflow-hidden mb-4", className)}>

      {/* Header */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3.5 text-left transition-colors hover:bg-slate-50/70 active:bg-slate-100/70"
        aria-expanded={open}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Dot acento izquierdo */}
          {accentDot && (
            <span className={cn("w-2 h-2 rounded-full flex-shrink-0", accentDot)} aria-hidden="true" />
          )}

          {/* Icono SVG (Lucide) */}
          {icon && (
            <span className="flex-shrink-0 text-slate-500">{icon}</span>
          )}

          <span className="font-semibold text-[#1A3D5C] text-sm leading-tight">{title}</span>

          {badge && <span className="flex-shrink-0">{badge}</span>}

          {count !== undefined && !open && (
            <span className="text-[11px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full flex-shrink-0">
              {count} {countLabel}
            </span>
          )}
        </div>

        <ChevronDown
          className={cn(
            "h-4 w-4 text-slate-400 flex-shrink-0 transition-transform duration-200",
            open ? 'rotate-180' : ''
          )}
          aria-hidden="true"
        />
      </button>

      {/* Separador y contenido */}
      {open && (
        <>
          <div className="h-px bg-[#F0F4F8] mx-4" />
          <div className="px-4 py-4">
            {children}
          </div>
        </>
      )}
    </div>
  )
}
