import { cn } from "@/lib/utils"
import type { NivelRiesgo } from "@/types"

const CONFIG: Record<NivelRiesgo, {
  label: string
  dot: string
  text: string
  bg: string
  border: string
}> = {
  muy_alto: {
    label:  "Muy alto",
    dot:    "bg-red-500",
    text:   "text-red-700",
    bg:     "bg-red-50",
    border: "border-red-100",
  },
  alto: {
    label:  "Alto",
    dot:    "bg-orange-500",
    text:   "text-orange-700",
    bg:     "bg-orange-50",
    border: "border-orange-100",
  },
  moderado: {
    label:  "Moderado",
    dot:    "bg-amber-400",
    text:   "text-amber-700",
    bg:     "bg-amber-50",
    border: "border-amber-100",
  },
  bajo: {
    label:  "Bajo",
    dot:    "bg-emerald-500",
    text:   "text-emerald-700",
    bg:     "bg-emerald-50",
    border: "border-emerald-100",
  },
  no_aplica: {
    label:  "No aplica",
    dot:    "bg-slate-300",
    text:   "text-slate-500",
    bg:     "bg-slate-50",
    border: "border-slate-100",
  },
}

interface RiskChipProps {
  nivel: NivelRiesgo
  className?: string
}

export function RiskChip({ nivel, className }: RiskChipProps) {
  const { label, dot, text, bg, border } = CONFIG[nivel]

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border",
        bg, border, text,
        className
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", dot)} aria-hidden="true" />
      {label}
    </span>
  )
}
