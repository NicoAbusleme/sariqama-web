import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Leaf, Plus, MapPin, CheckCircle, AlertTriangle, LogOut, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { cerrarSesion } from '@/app/actions/auth'

export default async function DashboardPage() {
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
    .gte('fecha_regreso', new Date().toISOString().split('T')[0])
    .order('fecha_salida', { ascending: true })

  const tieneViajeros = viajeros && viajeros.length > 0
  const tieneViajes = viajes && viajes.length > 0

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-teal-600" />
            <span className="font-bold text-lg text-slate-900">SARIQAMA</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-500 hidden sm:block">
              {familia.nombre}
            </span>
            <form action={cerrarSesion}>
              <button
                type="submit"
                className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                title="Cerrar sesión"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

        {/* Saludo */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-1">
            Hola, {familia.nombre} 👋
          </h1>
          <p className="text-slate-500">
            {tieneViajes
              ? `Tienes ${viajes!.length} viaje${viajes!.length > 1 ? 's' : ''} próximo${viajes!.length > 1 ? 's' : ''}`
              : '¿Cuándo es tu próximo viaje?'}
          </p>
        </div>

        {/* Integrantes de la familia */}
        {tieneViajeros && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Users className="h-4 w-4 text-slate-400" />
              <span className="text-sm font-medium text-slate-600">Tu familia</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {viajeros!.map(v => (
                <Badge
                  key={v.id}
                  variant="secondary"
                  className="px-3 py-1 bg-teal-50 text-teal-700 border-teal-100"
                >
                  {v.nombre} · {v.edad} años
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Sin viajes — estado vacío */}
        {!tieneViajes && (
          <Card className="mb-6 border-dashed border-2 border-slate-200 bg-white">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <MapPin className="h-12 w-12 text-slate-300 mb-4" />
              <h3 className="font-semibold text-slate-700 mb-2">
                Aún no tienes viajes registrados
              </h3>
              <p className="text-sm text-slate-400 max-w-sm mb-6">
                Crea tu primer viaje para obtener tu checklist sanitario personalizado
                y la información de riesgos de tu destino.
              </p>
              <Link href="/viaje/nuevo">
                <Button className="bg-teal-600 hover:bg-teal-700 text-white">
                  <Plus className="mr-2 h-4 w-4" />
                  Crear mi primer viaje
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Viajes próximos */}
        {tieneViajes && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-slate-600">Viajes próximos</span>
              <Link href="/viaje/nuevo">
                <Button size="sm" variant="outline" className="h-8 text-xs">
                  <Plus className="mr-1 h-3 w-3" /> Nuevo viaje
                </Button>
              </Link>
            </div>
            <div className="flex flex-col gap-3">
              {viajes!.map(v => {
                const diasRestantes = Math.ceil(
                  (new Date(v.fecha_salida).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                )
                return (
                  <Link key={v.id} href={`/viaje/${v.id}`}>
                    <Card className="hover:border-teal-200 hover:shadow-sm transition-all cursor-pointer">
                      <CardContent className="flex items-center justify-between py-4 px-5">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-teal-50 rounded-lg">
                            <MapPin className="h-5 w-5 text-teal-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">{v.destino_nombre}</p>
                            <p className="text-sm text-slate-500">
                              {new Date(v.fecha_salida).toLocaleDateString('es-CL', { day: 'numeric', month: 'long' })}
                              {' → '}
                              {new Date(v.fecha_regreso).toLocaleDateString('es-CL', { day: 'numeric', month: 'long' })}
                            </p>
                          </div>
                        </div>
                        <Badge className={
                          diasRestantes <= 7
                            ? 'bg-red-100 text-red-700 border-red-200'
                            : diasRestantes <= 30
                            ? 'bg-yellow-100 text-yellow-700 border-yellow-200'
                            : 'bg-teal-100 text-teal-700 border-teal-200'
                        }>
                          {diasRestantes <= 0 ? 'Hoy' : `${diasRestantes}d`}
                        </Badge>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {/* Acceso rápido */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="hover:border-teal-200 transition-colors cursor-pointer">
            <CardHeader className="pb-2">
              <div className="p-2 bg-green-50 rounded-lg w-fit mb-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <CardTitle className="text-base">Checklist pre-viaje</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-500">
                Lista sanitaria personalizada para tu familia y destino.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:border-teal-200 transition-colors cursor-pointer">
            <CardHeader className="pb-2">
              <div className="p-2 bg-yellow-50 rounded-lg w-fit mb-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
              </div>
              <CardTitle className="text-base">Evaluar síntomas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-500">
                Semáforo clínico durante y después del viaje.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:border-teal-200 transition-colors cursor-pointer">
            <CardHeader className="pb-2">
              <div className="p-2 bg-teal-50 rounded-lg w-fit mb-2">
                <MapPin className="h-5 w-5 text-teal-600" />
              </div>
              <CardTitle className="text-base">Riesgos por destino</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-500">
                Dengue, malaria, vacunas y más según tu destino.
              </p>
            </CardContent>
          </Card>
        </div>

        <p className="text-xs text-slate-400 text-center mt-10 leading-relaxed">
          SARIQAMA entrega orientación sanitaria. No reemplaza evaluación médica profesional.
        </p>
      </main>
    </div>
  )
}
