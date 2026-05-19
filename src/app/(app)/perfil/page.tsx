import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Users, ChevronRight, LogOut } from 'lucide-react'
import { FlagImg } from '@/components/ui/flag-img'
import { getDestinoBySlug } from '@/lib/content/destinos'
import { cerrarSesion } from '@/app/actions/auth'
import { EliminarCuentaBtn } from './EliminarCuentaBtn'

const CONDICION_META: Record<string, { label: string; color: string }> = {
  alergia:         { label: 'Alergias',        color: 'bg-orange-50 text-orange-600 border-orange-100' },
  asma:            { label: 'Asma',            color: 'bg-blue-50 text-blue-600 border-blue-100' },
  diabetes:        { label: 'Diabetes',        color: 'bg-purple-50 text-purple-600 border-purple-100' },
  cardiopatia:     { label: 'Cardiopatía',     color: 'bg-red-50 text-red-600 border-red-100' },
  inmunosupresion: { label: 'Inmunosupresión', color: 'bg-amber-50 text-amber-600 border-amber-100' },
  embarazo:        { label: 'Embarazo',        color: 'bg-pink-50 text-pink-600 border-pink-100' },
  otra:            { label: 'Otra condición',  color: 'bg-slate-50 text-slate-600 border-slate-100' },
}

export default async function PerfilPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: familia } = await supabase
    .from('familias')
    .select('*')
    .eq('user_id', user.id)
    .single()
  if (!familia) redirect('/onboarding')

  const { data: viajeros } = await supabase
    .from('viajeros')
    .select('*')
    .eq('familia_id', familia.id)
    .order('edad', { ascending: false })

  const { data: viajes } = await supabase
    .from('viajes')
    .select('*')
    .eq('familia_id', familia.id)
    .order('fecha_salida', { ascending: false })

  const today = new Date().toISOString().split('T')[0]
  const proximos = (viajes ?? []).filter(v => v.fecha_regreso >= today)
  const pasados = (viajes ?? []).filter(v => v.fecha_regreso < today).slice(0, 5)

  const inicial = (familia.nombre as string).charAt(0).toUpperCase()

  return (
    <div className="min-h-screen bg-[#F0FDF9]">
      {/* Header */}
      <header className="bg-gradient-to-br from-teal-600 to-teal-800 px-5 pt-12 pb-8">
        <div className="max-w-2xl mx-auto flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center mb-3">
            <span
              className="text-3xl font-bold text-teal-600"
              style={{ fontFamily: 'var(--font-fraunces)' }}
            >
              {inicial}
            </span>
          </div>
          <h1
            className="text-2xl font-semibold text-white mb-1"
            style={{ fontFamily: 'var(--font-fraunces)' }}
          >
            {familia.nombre}
          </h1>
          <p className="text-teal-200 text-sm">{user.email}</p>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-5 pb-28">
        {/* Integrantes */}
        <section className="mt-5">
          <div className="flex items-center gap-2 mb-3">
            <Users className="h-4 w-4 text-slate-500" />
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Integrantes de la familia
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {(viajeros ?? []).map(v => {
              const condicionesFiltradas = (v.condiciones as string[]).filter(c => c !== 'ninguna')
              return (
                <div
                  key={v.id}
                  className="bg-white rounded-2xl border border-slate-100 p-4"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-teal-700">
                        {(v.nombre as string).charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900 text-sm">{v.nombre}{v.apellido ? ` ${v.apellido}` : ''}</p>
                      <p className="text-xs text-slate-400">
                        {v.edad} años{' '}
                        {v.es_nino && <span className="text-xs">👶</span>}
                        {v.genero && v.genero !== 'no_indicado' && (
                          <span className="ml-1 text-slate-300">·</span>
                        )}
                        {v.genero && v.genero !== 'no_indicado' && (
                          <span className="ml-1 capitalize">
                            {v.genero === 'no_binario' ? 'No binario'
                              : v.genero === 'genero_fluido' ? 'Género fluido'
                              : v.genero}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  {condicionesFiltradas.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {condicionesFiltradas.map(c => {
                        const meta = CONDICION_META[c]
                        if (!meta) return null
                        return (
                          <span
                            key={c}
                            className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${meta.color}`}
                          >
                            {meta.label}
                          </span>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <Link href="/perfil/agregar-viajero">
            <button className="mt-3 w-full border-2 border-dashed border-teal-300 rounded-2xl py-3 text-sm font-medium text-teal-600 hover:border-teal-400 hover:bg-teal-50 transition-colors">
              + Agregar integrante
            </button>
          </Link>
        </section>

        {/* Mis viajes */}
        <section className="mt-5">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Mis viajes
          </p>

          {proximos.length === 0 && pasados.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-8 text-center">
              <p className="text-3xl mb-3">✈️</p>
              <p className="text-sm text-slate-500 mb-4">Aún no tienes viajes registrados</p>
              <Link href="/viaje/nuevo">
                <span className="inline-block text-sm font-semibold text-teal-600 hover:text-teal-700 transition-colors">
                  Crear un viaje →
                </span>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {proximos.length > 0 && (
                <>
                  <p className="text-xs font-medium text-slate-400 mb-1 px-1">Próximos</p>
                  {proximos.map(v => (
                    <ViajeCard key={v.id} viaje={v} today={today} />
                  ))}
                </>
              )}
              {pasados.length > 0 && (
                <>
                  <p className="text-xs font-medium text-slate-400 mt-2 mb-1 px-1">Historial</p>
                  {pasados.map(v => (
                    <ViajeCard key={v.id} viaje={v} today={today} />
                  ))}
                </>
              )}
            </div>
          )}
        </section>

        {/* Cuenta */}
        <section className="mt-5">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Cuenta
          </p>
          <div className="bg-white rounded-2xl border border-slate-100 p-4">
            <p className="text-xs text-slate-400 mb-0.5">Correo electrónico</p>
            <p className="text-sm font-medium text-slate-800 mb-4">{user.email}</p>
            <form action={cerrarSesion}>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-xl py-2.5 text-sm font-medium transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Cerrar sesión
              </button>
            </form>
          </div>

          {/* Zona de peligro */}
          <div className="mt-3">
            <EliminarCuentaBtn />
          </div>
        </section>

        {/* Acerca de */}
        <section className="mt-5 mb-8">
          <div className="text-center space-y-1">
            <p className="text-xs text-slate-400">SARIQAMA · Versión 1.0</p>
            <p className="text-xs text-slate-400">Información clínica basada en CDC Yellow Book 2026</p>
            <p className="text-xs text-slate-400 leading-relaxed">
              Orientación sanitaria. No reemplaza evaluación médica profesional.
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}

interface ViajeRow {
  id: string
  destino_slug: string
  destino_nombre: string
  fecha_salida: string
  fecha_regreso: string
  [key: string]: string
}

function getViajeStatus(viaje: ViajeRow, today: string) {
  if (viaje.fecha_salida <= today && viaje.fecha_regreso >= today) return 'en_curso'
  if (viaje.fecha_salida > today) return 'proximo'
  return 'finalizado'
}

function ViajeCard({ viaje, today }: { viaje: ViajeRow; today: string }) {
  const status = getViajeStatus(viaje, today)
  const destino = getDestinoBySlug(viaje.destino_slug)
  const paisCode = destino?.pais_code ?? 'un'

  const statusBadge =
    status === 'en_curso'
      ? { label: 'En curso', cls: 'bg-green-100 text-green-700' }
      : status === 'proximo'
      ? { label: 'Próximo', cls: 'bg-teal-100 text-teal-700' }
      : { label: 'Finalizado', cls: 'bg-slate-100 text-slate-400' }

  return (
    <Link href={`/viaje/${viaje.id}`}>
      <div className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-3 hover:border-teal-200 hover:shadow-sm transition-all">
        <FlagImg code={paisCode} size={28} className="rounded flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-slate-900 text-sm truncate">{viaje.destino_nombre}</p>
          <p className="text-xs text-slate-400 mt-0.5">
            {new Date(viaje.fecha_salida).toLocaleDateString('es-CL', { day: 'numeric', month: 'short' })}
            {' → '}
            {new Date(viaje.fecha_regreso).toLocaleDateString('es-CL', { day: 'numeric', month: 'short' })}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${statusBadge.cls}`}>
            {statusBadge.label}
          </span>
          <ChevronRight className="h-4 w-4 text-slate-300" />
        </div>
      </div>
    </Link>
  )
}
