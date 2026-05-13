import { cn } from "@/lib/utils"
import type { NivelRiesgo } from "@/types"

const ESTILOS: Record<NivelRiesgo, string> = {
  muy_alto: "bg-red-100 text-red-700 border-red-200",
  alto:     "bg-orange-100 text-orange-700 border-orange-200",
  moderado: "bg-yellow-100 text-yellow-700 border-yellow-200",
  bajo:     "bg-green-100 text-green-700 border-green-200",
  no_aplica:"bg-slate-100 text-slate-500 border-slate-200",
}

const ETIQUETAS: Record<NivelRiesgo, string> = {
  muy_alto: "Muy alto",
  alto:     "Alto",
  moderado: "Moderado",
  bajo:     "Bajo",
  no_aplica:"No aplica",
}

interface RiskChipProps {
  nivel: NivelRiesgo
  className?: string
}

export function RiskChip({ nivel, className }: RiskChipProps) {
  return (
    <span className={cn(
      "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border",
      ESTILOS[nivel],
      className
    )}>
      {ETIQUETAS[nivel]}
    </span>
  )
}
