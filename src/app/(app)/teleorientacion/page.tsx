import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ChevronLeft, Stethoscope } from 'lucide-react'
import Link from 'next/link'
import { PlanGate } from '@/components/ui/plan-gate'
import { TeleorientacionClient } from './TeleorientacionClient'

export default async function TeleorientacionPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: familia } = await supabase
    .from('familias').select('id, plan').eq('user_id', user.id).single()
  if (!familia) redirect('/onboarding')

  const userPlan: string = familia.plan ?? 'gratis'

  return (
    <div className="min-h-screen bg-[#F8FAFB] flex flex-col">

      {/* ── Header limpio ─────────────────────────────────────────────── */}
      <header className="bg-white border-b border-[#E8EEF4] px-5 pt-5 pb-5">
        <div className="max-w-2xl mx-auto">
          <Link href="/dashboard"
            className="inline-flex items-center gap-1.5 text-slate-400 hover:text-[#1A3D5C] text-sm mb-4 transition-colors">
            <ChevronLeft className="h-4 w-4" aria-hidden="true" /> Inicio
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E8F7F4] flex items-center justify-center flex-shrink-0">
              <Stethoscope className="h-5 w-5 text-[#2D9E8C]" strokeWidth={1.8} aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-[#1A3D5C]"
                style={{ fontFamily: 'var(--font-fraunces)' }}>
                Teleorientación médica
              </h1>
              <p className="text-sm text-slate-400">Especialistas en medicina del viajero</p>
            </div>
          </div>
        </div>
      </header>

      {/* Contenido gateado — solo Acompañamiento */}
      <PlanGate
        userPlan={userPlan}
        requiredPlan="acompanamiento"
        feature="Teleorientación médica"
        description="Sesión con un especialista en medicina del viajero. Revisión clínica pre-viaje, triaje en ruta y seguimiento post-viaje."
      >
        <TeleorientacionClient />
      </PlanGate>

    </div>
  )
}
