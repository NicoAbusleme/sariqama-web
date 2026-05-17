import Link from 'next/link'
import { Lock } from 'lucide-react'

// ─── Helpers ─────────────────────────────────────────────────────────────────
const PLAN_ORDER: Record<string, number> = {
  gratis: 0,
  preparacion: 1,
  acompanamiento: 2,
}

const PLAN_INFO = {
  preparacion: {
    nombre: 'Preparación Total',
    precio: 'USD 19–29 / viaje',
    descripcion: 'Accede al checklist completo, botiquín específico y reporte familiar PDF.',
    gradiente: 'from-teal-600 to-teal-700',
    badge: 'bg-teal-100 text-teal-700',
    checkColor: 'bg-teal-100 text-teal-600',
    items: [
      'Checklist detallado adulto/niño',
      'Botiquín específico por destino',
      'Reporte familiar PDF descargable',
    ],
  },
  acompanamiento: {
    nombre: 'Acompañamiento',
    precio: 'USD 29–39 / evento',
    descripcion: 'Evaluador de síntomas clínico, teleorientación con especialista y seguimiento post-viaje.',
    gradiente: 'from-amber-500 to-orange-500',
    badge: 'bg-amber-100 text-amber-700',
    checkColor: 'bg-amber-100 text-amber-600',
    items: [
      'Evaluador de síntomas clínico (triaje)',
      'Teleorientación con especialista',
      'Seguimiento médico post-viaje',
    ],
  },
}

// ─── Props ────────────────────────────────────────────────────────────────────
interface PlanGateProps {
  userPlan: string
  requiredPlan: 'preparacion' | 'acompanamiento'
  /** Nombre de la feature bloqueada, ej: "Botiquín familiar" */
  feature: string
  /** Texto opcional de descripción. Si no se pasa, usa el del plan. */
  description?: string
  children: React.ReactNode
}

// ─── Componente ───────────────────────────────────────────────────────────────
export function PlanGate({
  userPlan,
  requiredPlan,
  feature,
  description,
  children,
}: PlanGateProps) {
  const userLevel = PLAN_ORDER[userPlan] ?? 0
  const requiredLevel = PLAN_ORDER[requiredPlan]

  // Si el usuario tiene el plan requerido, mostrar el contenido normal
  if (userLevel >= requiredLevel) return <>{children}</>

  const info = PLAN_INFO[requiredPlan]

  return (
    <div className="flex flex-col items-center py-10 px-5">

      {/* Ícono lock con gradiente del plan */}
      <div className={`w-16 h-16 rounded-3xl bg-gradient-to-br ${info.gradiente} flex items-center justify-center mb-5 shadow-sm`}>
        <Lock className="h-7 w-7 text-white" />
      </div>

      {/* Título */}
      <h2
        className="text-xl font-semibold text-slate-900 mb-2 text-center"
        style={{ fontFamily: 'var(--font-fraunces)' }}
      >
        {feature}
      </h2>

      {/* Descripción */}
      <p className="text-sm text-slate-500 text-center max-w-xs mb-4 leading-relaxed">
        {description ?? info.descripcion}
      </p>

      {/* Badge de plan */}
      <span className={`text-xs font-bold px-3 py-1.5 rounded-full mb-6 ${info.badge}`}>
        {info.nombre} · {info.precio}
      </span>

      {/* Card con lo que incluye */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 w-full max-w-sm mb-6">
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-3">
          Incluido en {info.nombre}
        </p>
        <ul className="space-y-2.5">
          {info.items.map(item => (
            <li key={item} className="flex items-center gap-2.5 text-sm text-slate-700">
              <span className={`w-5 h-5 rounded-full ${info.checkColor} flex items-center justify-center flex-shrink-0`}>
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* CTA principal */}
      <Link
        href="/precios"
        className={`inline-flex items-center gap-2 bg-gradient-to-r ${info.gradiente} text-white font-semibold px-8 py-3.5 rounded-2xl text-sm hover:opacity-90 transition-all shadow-sm mb-3 w-full max-w-sm justify-center`}
      >
        Ver planes y solicitar acceso
      </Link>

      {/* Nota piloto */}
      <p className="text-xs text-slate-400 text-center max-w-xs leading-relaxed">
        Durante el piloto el acceso es manual.
        Te contactamos en menos de 24 horas.
      </p>

    </div>
  )
}

// ─── Banner compacto (para usar inline, ej. checklist parcial) ────────────────
interface PlanBannerProps {
  requiredPlan: 'preparacion' | 'acompanamiento'
  lockedCount: number
}

export function PlanBanner({ requiredPlan, lockedCount }: PlanBannerProps) {
  const info = PLAN_INFO[requiredPlan]

  return (
    <div className={`rounded-2xl bg-gradient-to-r ${info.gradiente} p-5 mt-2`}>
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
          <Lock className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-white font-semibold text-sm">
            +{lockedCount} ítem{lockedCount !== 1 ? 's' : ''} disponibles en {info.nombre}
          </p>
          <p className="text-white/80 text-xs mt-0.5 leading-relaxed">
            {info.descripcion}
          </p>
        </div>
      </div>
      <Link
        href="/precios"
        className="block w-full text-center bg-white/20 hover:bg-white/30 text-white font-semibold text-sm py-2.5 rounded-xl transition-colors border border-white/20"
      >
        Solicitar acceso — {info.precio}
      </Link>
    </div>
  )
}
