import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Plus, MapPin, ChevronRight, Settings } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { FlagImg } from "@/components/ui/flag-img"
import { getDestinoBySlug } from "@/lib/content/destinos"

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

      {/* ── Header con ola ──────────────────────────────────────────────── */}
      <header className="relative bg-gradient-to-br from-[#1A3D5C] via-[#1F4D72] to-[#0A2238] px-5 pt-14 pb-16 overflow-hidden">
        {/* Patrón de puntos sutil */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        {/* Círculo decorativo */}
        <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #2D9E8C 0%, transparent 70%)' }} />
        <div className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #D4A338 0%, transparent 70%)' }} />

        <div className="relative z-10 max-w-2xl mx-auto">
          {/* Top row */}
          <div className="flex items-start justify-between mb-5">
            <div>
              <p className="text-[#A8C5DA] text-xs font-medium mb-1 tracking-wide uppercase">Bienvenido</p>
              <h1 className="text-2xl font-semibold text-white leading-tight"
                style={{ fontFamily: "var(--font-fraunces)" }}>
                {familia.nombre} 👋
              </h1>
            </div>
            <Link href="/perfil">
              <div className="card-glass w-10 h-10 flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                <Settings className="h-4 w-4 text-white/80" />
              </div>
            </Link>
          </div>

          {/* Viajeros pills */}
          {viajeros && viajeros.length > 0 && (
            <div className="flex gap-2 flex-wrap mb-5">
              {viajeros.map(v => (
                <span
                  key={v.id}
                  className="card-glass px-3 py-1 text-xs font-medium text-white/90"
                  style={{ borderRadius: '99px' }}
                >
                  {v.nombre} · {v.edad}a
                </span>
              ))}
            </div>
          )}

          {tieneViajes && (
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-white/60 uppercase tracking-widest">
                Viajes próximos
              </span>
              <Link href="/viaje/nuevo">
                <span className="inline-flex items-center gap-1.5 card-glass hover:bg-white/20 text-white text-xs font-semibold px-3 py-1.5 transition-colors cursor-pointer"
                  style={{ borderRadius: '10px' }}>
                  <Plus className="h-3 w-3" /> Nuevo viaje
                </span>
              </Link>
            </div>
          )}
        </div>

        {/* Ola SVG en el borde inferior */}
        <div className="absolute bottom-0 left-0 right-0 leading-none">
          <svg viewBox="0 0 375 40" preserveAspectRatio="none" className="w-full h-10 block">
            <path d="M0,40 C80,10 180,35 280,18 C330,8 360,28 375,20 L375,40 Z" fill="#F7FFFE"/>
          </svg>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-5 pt-5 pb-28">

        {/* ── Sin viajes ─────────────────────────────────────────────── */}
        {!tieneViajes && (
          <div className="mt-2 mb-6 bg-white rounded-3xl p-10 text-center animate-fade-up"
            style={{ boxShadow: 'var(--shadow-md)' }}>
            <div className="text-5xl mb-4 animate-float inline-block">✈️</div>
            <h3 className="font-semibold text-[#1A3D5C] mb-2 text-lg"
              style={{ fontFamily: "var(--font-fraunces)" }}>
              ¿A dónde viajan?
            </h3>
            <p className="text-sm text-slate-400 max-w-xs mx-auto mb-6 leading-relaxed">
              Crea tu primer viaje para obtener el checklist sanitario y los riesgos de tu destino.
            </p>
            <Link href="/viaje/nuevo">
              <button className="inline-flex items-center gap-2 bg-[#2D9E8C] hover:bg-[#237F70] text-white font-semibold px-6 py-3 rounded-2xl text-sm transition-all duration-200 hover:-translate-y-0.5"
                style={{ boxShadow: 'var(--shadow-md)' }}>
                <Plus className="h-4 w-4" />
                Crear mi primer viaje
              </button>
            </Link>
          </div>
        )}

        {/* ── Viajes próximos ────────────────────────────────────────── */}
        {tieneViajes && (
          <div className="mb-6 -mt-2">
            <div className="flex flex-col gap-3">
              {viajes!.map((v, i) => {
                const dias = Math.ceil((new Date(v.fecha_salida).getTime() - new Date().getTime()) / 86400000)
                const destino = getDestinoBySlug(v.destino_slug)
                const paisCode = destino?.pais_code ?? 'un'
                return (
                  <Link key={v.id} href={`/viaje/${v.id}`}>
                    <div
                      className="card-elevated bg-white rounded-2xl p-4 flex items-center gap-4 cursor-pointer animate-fade-up"
                      style={{ animationDelay: `${i * 60}ms` }}
                    >
                      <div className="relative flex-shrink-0">
                        <div className="w-12 h-12 rounded-2xl overflow-hidden bg-slate-100 flex items-center justify-center"
                          style={{ boxShadow: 'var(--shadow-xs)' }}>
                          <FlagImg code={paisCode} size={48} className="w-full h-full object-cover" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-[#1A3D5C] text-sm truncate">
                          {v.destino_nombre}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {new Date(v.fecha_salida).toLocaleDateString("es-CL", { day: "numeric", month: "short" })}
                          {" → "}
                          {new Date(v.fecha_regreso).toLocaleDateString("es-CL", { day: "numeric", month: "short" })}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Badge className={
                          dias <= 0 ? "bg-[#2D9E8C] text-white border-0" :
                          dias <= 7 ? "bg-red-100 text-red-700 border-0" :
                          dias <= 30 ? "bg-amber-100 text-amber-700 border-0" :
                          "bg-[#E0F5F2] text-[#2D9E8C] border-0"
                        }>
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

        {/* ── Quick actions ──────────────────────────────────────────── */}
        <div className="mb-2 px-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            Accesos rápidos
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {(() => {
            const primerViaje = viajes?.[0]
            return [
              {
                href: "/viaje/nuevo",
                gradient: "from-[#2D9E8C] to-[#1A7A6B]",
                iconBg: "rgba(255,255,255,0.20)",
                icon: "✈️",
                titulo: "Nuevo viaje",
                sub: "Planifica tu salud",
                textColor: "text-white",
                subColor: "text-white/70",
              },
              {
                href: primerViaje ? `/viaje/${primerViaje.id}/sintomas` : "/viaje/nuevo",
                gradient: "from-amber-500 to-orange-500",
                iconBg: "rgba(255,255,255,0.20)",
                icon: "🌡️",
                titulo: "Síntomas",
                sub: primerViaje ? primerViaje.destino_nombre : "Crea un viaje primero",
                textColor: "text-white",
                subColor: "text-white/70",
              },
              {
                href: primerViaje ? `/viaje/${primerViaje.id}/checklist` : "/viaje/nuevo",
                gradient: "from-slate-700 to-slate-800",
                iconBg: "rgba(255,255,255,0.15)",
                icon: "✅",
                titulo: "Checklist",
                sub: primerViaje ? primerViaje.destino_nombre : "Crea un viaje primero",
                textColor: "text-white",
                subColor: "text-white/60",
              },
              {
                href: "/teleorientacion",
                gradient: "from-[#1A3D5C] to-[#254E72]",
                iconBg: "rgba(255,255,255,0.15)",
                icon: "👩‍⚕️",
                titulo: "Orientación",
                sub: "Habla con un médico",
                textColor: "text-white",
                subColor: "text-white/60",
              },
            ]
          })().map((a, i) => (
            <Link key={a.titulo} href={a.href}>
              <div
                className={`bg-gradient-to-br ${a.gradient} rounded-2xl p-4 h-full cursor-pointer transition-all duration-200 hover:-translate-y-1 animate-fade-up`}
                style={{
                  boxShadow: 'var(--shadow-md)',
                  animationDelay: `${(i + (viajes?.length ?? 0)) * 50}ms`,
                }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl mb-3"
                  style={{ background: a.iconBg }}
                >
                  {a.icon}
                </div>
                <p className={`font-semibold text-sm ${a.textColor}`}
                  style={{ fontFamily: "var(--font-fraunces)" }}>
                  {a.titulo}
                </p>
                <p className={`text-xs mt-0.5 truncate ${a.subColor}`}>{a.sub}</p>
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
