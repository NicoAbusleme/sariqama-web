import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Plus, MapPin, CheckCircle, AlertTriangle, Stethoscope, ChevronRight, Settings } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: familia } = await supabase
    .from("familias").select("*").eq("user_id", user.id).single()
  if (!familia) redirect("/onboarding")

  const { data: viajeros } = await supabase
    .from("viajeros").select("*").eq("familia_id", familia.id).order("edad", { ascending: false })

  const { data: viajes } = await supabase
    .from("viajes").select("*").eq("familia_id", familia.id)
    .gte("fecha_regreso", new Date().toISOString().split("T")[0])
    .order("fecha_salida", { ascending: true })

  const tieneViajes = viajes && viajes.length > 0

  return (
    <div className="min-h-screen bg-[#F7FFFE]">
      {/* Header con gradiente */}
      <header className="bg-gradient-to-br from-[#1A3D5C] to-[#0F2D45] px-5 pt-12 pb-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-[#A8C5DA] text-sm mb-1">Buenos días,</p>
              <h1 className="text-2xl font-semibold text-white"
                style={{ fontFamily: "var(--font-fraunces)" }}>
                {familia.nombre} 👋
              </h1>
            </div>
            <Link href="/perfil">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center"
                style={{ background: "rgba(255,255,255,0.15)" }}
                title="Mi perfil">
                <Settings className="h-5 w-5 text-white/80" />
              </div>
            </Link>
          </div>

          {/* Viajeros pills */}
          {viajeros && viajeros.length > 0 && (
            <div className="flex gap-2 flex-wrap mb-6">
              {viajeros.map(v => (
                <span key={v.id}
                  className="px-3 py-1 rounded-full text-xs font-medium text-white/90 border border-white/20"
                  style={{ background: "rgba(255,255,255,0.12)" }}>
                  {v.nombre} · {v.edad} años
                </span>
              ))}
            </div>
          )}

          {/* Título sección viajes dentro del header */}
          {tieneViajes && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-white/80 uppercase tracking-widest">Viajes próximos</span>
              <Link href="/viaje/nuevo">
                <span className="inline-flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors border border-white/20">
                  <Plus className="h-3 w-3" /> Nuevo
                </span>
              </Link>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-5 pt-5 pb-28">

        {/* Sin viajes */}
        {!tieneViajes && (
          <div className="bg-white rounded-3xl border border-dashed border-slate-200 p-10 text-center mb-5">
            <div className="text-5xl mb-4">✈️</div>
            <h3 className="font-semibold text-slate-800 mb-2"
              style={{ fontFamily: "var(--font-fraunces)" }}>
              ¿A dónde viajan?
            </h3>
            <p className="text-sm text-slate-400 max-w-xs mx-auto mb-6">
              Crea tu primer viaje para obtener el checklist sanitario y los riesgos de tu destino.
            </p>
            <Link href="/viaje/nuevo">
              <button className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-3 rounded-2xl text-sm transition-colors">
                <Plus className="h-4 w-4" />
                Crear mi primer viaje
              </button>
            </Link>
          </div>
        )}

        {/* Viajes próximos */}
        {tieneViajes && (
          <div className="mb-5">
            <div className="flex flex-col gap-3">
              {viajes!.map(v => {
                const dias = Math.ceil((new Date(v.fecha_salida).getTime() - new Date().getTime()) / 86400000)
                return (
                  <Link key={v.id} href={`/viaje/${v.id}`}>
                    <div className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-4 hover:border-teal-200 hover:shadow-sm transition-all">
                      <div className="w-11 h-11 bg-teal-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <MapPin className="h-5 w-5 text-teal-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-900 text-sm truncate">{v.destino_nombre}</p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {new Date(v.fecha_salida).toLocaleDateString("es-CL", { day: "numeric", month: "short" })}
                          {" → "}
                          {new Date(v.fecha_regreso).toLocaleDateString("es-CL", { day: "numeric", month: "short" })}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={dias <= 7 ? "bg-red-100 text-red-700" : dias <= 30 ? "bg-amber-100 text-amber-700" : "bg-teal-100 text-teal-700"}>
                          {dias <= 0 ? "Hoy" : `${dias}d`}
                        </Badge>
                        <ChevronRight className="h-4 w-4 text-slate-300" />
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {/* Quick actions */}
        <div className="px-1 mb-3">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Accesos rápidos</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {(() => {
            const primerViaje = viajes?.[0]
            return [
              { href: "/viaje/nuevo",                                                          bg: "bg-teal-50",   icon: "✈️",  titulo: "Nuevo viaje",  sub: "Planifica tu salud" },
              { href: primerViaje ? `/viaje/${primerViaje.id}/sintomas` : "/viaje/nuevo",      bg: "bg-amber-50",  icon: "🌡️", titulo: "Síntomas",      sub: primerViaje ? primerViaje.destino_nombre : "Crea un viaje primero" },
              { href: primerViaje ? `/viaje/${primerViaje.id}/checklist` : "/viaje/nuevo",     bg: "bg-green-50",  icon: "✅",  titulo: "Checklist",     sub: primerViaje ? primerViaje.destino_nombre : "Crea un viaje primero" },
              { href: "/teleorientacion",                                                       bg: "bg-blue-50",   icon: "👩‍⚕️", titulo: "Orientación",  sub: "Habla con un médico" },
            ]
          })().map(a => (
            <Link key={a.titulo} href={a.href}>
              <div className="bg-white rounded-2xl border border-slate-100 p-4 hover:border-teal-200 hover:shadow-sm transition-all cursor-pointer">
                <div className={`w-11 h-11 ${a.bg} rounded-2xl flex items-center justify-center text-xl mb-3`}>
                  {a.icon}
                </div>
                <p className="font-semibold text-slate-900 text-sm">{a.titulo}</p>
                <p className="text-xs text-slate-400 mt-0.5">{a.sub}</p>
              </div>
            </Link>
          ))}
        </div>

        <p className="text-[11px] text-slate-400 text-center mt-8 leading-relaxed px-4">
          SARIQAMA entrega orientación sanitaria. No reemplaza evaluación médica profesional.
        </p>
      </main>

    </div>
  )
}
