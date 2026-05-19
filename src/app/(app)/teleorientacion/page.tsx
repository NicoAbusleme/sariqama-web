import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
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
    <div className="min-h-screen bg-[#F0FDF9] flex flex-col">

      {/* Header — siempre visible */}
      <header className="bg-gradient-to-br from-teal-600 to-teal-800 px-5 pt-12 pb-8">
        <div className="max-w-2xl mx-auto">
          <Link href="/dashboard"
            className="inline-flex items-center gap-1.5 text-teal-200 text-sm mb-5 hover:text-white transition-colors">
            <ChevronLeft className="h-4 w-4" /> Inicio
          </Link>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center text-2xl">
              👩‍⚕️
            </div>
            <div>
              <h1 className="text-xl font-semibold text-white"
                style={{ fontFamily: 'var(--font-fraunces)' }}>
                Teleorientación médica
              </h1>
              <p className="text-teal-200 text-sm">Especialistas en medicina del viajero</p>
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
