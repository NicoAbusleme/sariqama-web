import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ChevronLeft, Check, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

const PLANES = [
  {
    id: 'gratis',
    nombre: 'Exploración',
    precio: 'Gratis',
    precioSub: 'siempre',
    descripcion: 'Empieza a preparar tu viaje sin costo.',
    color: 'border-slate-200',
    headerBg: 'bg-slate-50',
    badge: null,
    cta: null,         // usuario ya lo tiene si está acá
    ctaStyle: '',
    items: [
      { texto: 'Perfil de viaje familiar',        disponible: true },
      { texto: 'Riesgos generales del destino',   disponible: true },
      { texto: 'Checklist básico (vacunas + docs)', disponible: true },
      { texto: 'Checklist detallado adulto/niño', disponible: false },
      { texto: 'Botiquín específico por destino', disponible: false },
      { texto: 'Reporte familiar PDF',            disponible: false },
      { texto: 'Evaluador de síntomas clínico',   disponible: false },
      { texto: 'Teleorientación médica',          disponible: false },
    ],
  },
  {
    id: 'preparacion',
    nombre: 'Preparación Total',
    precio: 'USD 19–29',
    precioSub: 'por viaje',
    descripcion: 'Todo lo que necesitas para llegar preparado.',
    color: 'border-[#2D9E8C]/40 ring-2 ring-teal-200',
    headerBg: 'bg-gradient-to-br from-[#1A3D5C] to-[#1F4D72]',
    badge: 'Más popular',
    cta: 'Solicitar Preparación Total',
    ctaStyle: 'bg-[#2D9E8C] hover:bg-[#237F70] text-white',
    items: [
      { texto: 'Perfil de viaje familiar',        disponible: true },
      { texto: 'Riesgos generales del destino',   disponible: true },
      { texto: 'Checklist básico (vacunas + docs)', disponible: true },
      { texto: 'Checklist detallado adulto/niño', disponible: true },
      { texto: 'Botiquín específico por destino', disponible: true },
      { texto: 'Reporte familiar PDF',            disponible: true },
      { texto: 'Evaluador de síntomas clínico',   disponible: false },
      { texto: 'Teleorientación médica',          disponible: false },
    ],
  },
  {
    id: 'acompanamiento',
    nombre: 'Acompañamiento',
    precio: 'USD 29–39',
    precioSub: 'por evento',
    descripcion: 'Atención profesional antes, durante y después.',
    color: 'border-amber-200',
    headerBg: 'bg-gradient-to-br from-amber-500 to-orange-500',
    badge: 'Máxima protección',
    cta: 'Solicitar Acompañamiento',
    ctaStyle: 'bg-amber-500 hover:bg-amber-600 text-white',
    items: [
      { texto: 'Perfil de viaje familiar',        disponible: true },
      { texto: 'Riesgos generales del destino',   disponible: true },
      { texto: 'Checklist básico (vacunas + docs)', disponible: true },
      { texto: 'Checklist detallado adulto/niño', disponible: true },
      { texto: 'Botiquín específico por destino', disponible: true },
      { texto: 'Reporte familiar PDF',            disponible: true },
      { texto: 'Evaluador de síntomas clínico',   disponible: true },
      { texto: 'Teleorientación médica',          disponible: true },
    ],
  },
]

const MAILTO = 'mailto:contacto@sariqama.com?subject=Solicitar%20acceso%20SARIQAMA&body=Hola%2C%20me%20interesa%20conocer%20m%C3%A1s%20sobre%20los%20planes%20de%20SARIQAMA.'

export default async function PreciosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: familia } = await supabase
    .from('familias').select('nombre, plan').eq('user_id', user.id).single()

  const userPlan: string = familia?.plan ?? 'gratis'

  return (
    <div className="min-h-screen bg-[#F8FAFB]">
      {/* ── Header limpio ─────────────────────────────────────────────── */}
      <header className="bg-white border-b border-[#E8EEF4] px-5 pt-5 pb-5">
        <div className="max-w-2xl mx-auto">
          <Link href="/dashboard"
            className="inline-flex items-center gap-1.5 text-slate-400 hover:text-[#1A3D5C] text-sm mb-4 transition-colors">
            <ChevronLeft className="h-4 w-4" aria-hidden="true" /> Inicio
          </Link>
          <h1 className="text-xl font-semibold text-[#1A3D5C]"
            style={{ fontFamily: 'var(--font-fraunces)' }}>
            Planes SARIQAMA
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Elige el nivel de protección que tu familia necesita.
          </p>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-5 py-5 pb-28">

        {/* Aviso piloto */}
        <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 mb-5 flex items-start gap-2.5">
          <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-xs text-amber-700 leading-relaxed">
            <strong>Programa piloto activo.</strong> Durante el piloto, el acceso a los planes
            pagados se gestiona manualmente. Contáctanos y te activamos el plan en menos de 24 horas.
          </p>
        </div>

        {/* Cards de planes */}
        <div className="flex flex-col gap-4 mb-8">
          {PLANES.map(plan => {
            const esPlanActual = plan.id === userPlan
            const isPopular = plan.id === 'preparacion'

            return (
              <div key={plan.id}
                className={`bg-white rounded-2xl border overflow-hidden ${
                  isPopular ? 'border-[#2D9E8C]/40 ring-2 ring-[#2D9E8C]/10' : 'border-[#E8EEF4]'
                }`}
                style={{ boxShadow: isPopular ? 'var(--shadow-sm)' : 'var(--shadow-xs)' }}>

                {/* Header del plan — limpio, sin gradiente */}
                <div className={`px-5 py-4 border-b ${isPopular ? 'bg-[#1A3D5C] border-[#1A3D5C]' : 'bg-[#F8FAFB] border-[#E8EEF4]'}`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={`text-sm font-bold ${isPopular ? 'text-white' : 'text-[#1A3D5C]'}`}>
                          {plan.nombre}
                        </span>
                        {plan.badge && (
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isPopular ? 'bg-white/20 text-white' : 'bg-[#E8F7F4] text-[#2D9E8C]'
                          }`}>
                            {plan.badge}
                          </span>
                        )}
                        {esPlanActual && (
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            isPopular ? 'bg-white/20 text-white border-white/30' : 'bg-[#E8F7F4] text-[#2D9E8C] border-[#2D9E8C]/20'
                          }`}>
                            Tu plan
                          </span>
                        )}
                      </div>
                      <p className={`text-xs leading-relaxed ${isPopular ? 'text-white/80' : 'text-slate-500'}`}>
                        {plan.descripcion}
                      </p>
                    </div>
                    <div className="text-right ml-4 flex-shrink-0">
                      <p className={`text-xl font-bold ${isPopular ? 'text-white' : 'text-[#1A3D5C]'}`}>
                        {plan.precio}
                      </p>
                      <p className={`text-[11px] ${isPopular ? 'text-white/70' : 'text-slate-400'}`}>
                        {plan.precioSub}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Lista de features */}
                <div className="px-5 py-4">
                  <ul className="space-y-2.5">
                    {plan.items.map(item => (
                      <li key={item.texto} className="flex items-center gap-2.5">
                        <span className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${
                          item.disponible ? 'bg-[#E8F7F4]' : 'bg-slate-100'
                        }`}>
                          {item.disponible ? (
                            <Check className="h-2.5 w-2.5 text-[#2D9E8C]" aria-hidden="true" />
                          ) : (
                            <span className="w-1.5 h-0.5 bg-slate-300 rounded-full" aria-hidden="true" />
                          )}
                        </span>
                        <span className={`text-sm ${item.disponible ? 'text-[#1A3D5C]' : 'text-slate-400'}`}>
                          {item.texto}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  {plan.cta && !esPlanActual && (
                    <a
                      href={`${MAILTO}&subject=Solicitar%20plan%20${encodeURIComponent(plan.nombre)}`}
                      className={`mt-5 block w-full text-center font-semibold text-sm py-3 rounded-xl transition-colors ${plan.ctaStyle}`}
                    >
                      {plan.cta}
                    </a>
                  )}

                  {esPlanActual && plan.id !== 'gratis' && (
                    <div className="mt-4 bg-[#E8F7F4] rounded-xl px-4 py-2.5 text-center">
                      <p className="text-xs text-[#2D9E8C] font-semibold">Plan activo</p>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-2xl border border-[#E8EEF4] p-5 mb-6" style={{ boxShadow: 'var(--shadow-xs)' }}>
          <h2 className="font-semibold text-slate-800 mb-4 text-sm"
            style={{ fontFamily: 'var(--font-fraunces)' }}>
            Preguntas frecuentes
          </h2>
          <div className="space-y-4">
            {[
              { q: '¿Cómo activo un plan pagado?', a: 'Durante el piloto, envíanos un email a contacto@sariqama.com y activamos tu plan manualmente en menos de 24 horas.' },
              { q: '¿El precio es por familia o por persona?', a: 'Por familia. Todos los viajeros de tu perfil familiar quedan cubiertos con un solo plan.' },
              { q: '¿Puedo cambiar de plan?', a: 'Sí. El plan se aplica a tu cuenta y puede actualizarse en cualquier momento.' },
            ].map(({ q, a }) => (
              <div key={q}>
                <p className="text-sm font-semibold text-slate-800 mb-1">{q}</p>
                <p className="text-xs text-slate-500 leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contacto */}
        <div className="text-center">
          <p className="text-xs text-slate-400 mb-2">¿Tienes dudas? Contáctanos directamente.</p>
          <a href={MAILTO}
            className="text-[#2D9E8C] text-sm font-semibold hover:underline">
            contacto@sariqama.com
          </a>
        </div>

      </main>
    </div>
  )
}
