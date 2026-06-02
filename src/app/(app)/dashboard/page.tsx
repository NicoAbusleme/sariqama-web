import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Plus, Plane, Thermometer, CheckSquare, Stethoscope, ChevronRight, Settings } from "lucide-react"
import Link from "next/link"
import { FlagImg } from "@/components/ui/flag-img"
import { getDestinoBySlug } from "@/lib/content/destinos"

function saludo() {
  const h = new Date().getHours()
  if (h < 12) return "Buenos días"
  if (h < 19) return "Buenas tardes"
  return "Buenas noches"
}

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

  const primerViaje = viajes?.[0]

  // Progreso del checklist del primer viaje
  let progreso = 0
  let completados = 0
  let totalItems = 0
  if (primerViaje) {
    const { data: checklist } = await supabase
      .from("checklist_items").select("completado").eq("viaje_id", primerViaje.id)
    totalItems = checklist?.length ?? 0
    completados = checklist?.filter(i => i.completado).length ?? 0
    progreso = totalItems > 0 ? Math.round((completados / totalItems) * 100) : 0
  }

  const tieneViajes = viajes && viajes.length > 0
  const inicialFamilia = familia.nombre?.[0]?.toUpperCase() ?? "F"

  return (
    <div className="min-h-screen bg-[#F8FAFB]">

      {/* ── Header limpio ─────────────────────────────────────────────── */}
      <header className="bg-white border-b border-[#E8EEF4] px-5 pt-6 pb-5">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs font-medium text-slate-400 mb-0.5">{saludo()}</p>
              <h1
                className="text-[26px] font-semibold text-[#1A3D5C] leading-tight"
                style={{ fontFamily: "var(--font-fraunces)" }}
              >
                {familia.nombre}
              </h1>
            </div>
            <Link href="/perfil" aria-label="Ir al perfil">
              <div className="w-10 h-10 rounded-full bg-[#1A3D5C] flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-bold">{inicialFamilia}</span>
              </div>
            </Link>
          </div>

          {/* Viajeros chips */}
          {viajeros && viajeros.length > 0 && (
            <div className="flex gap-1.5 flex-wrap">
              {viajeros.map(v => (
                <span
                  key={v.id}
                  className="text-xs font-medium text-[#2D9E8C] bg-[#E8F7F4] px-2.5 py-1 rounded-full"
                >
                  {v.nombre}{v.edad ? ` · ${v.edad}a` : ""}
                </span>
              ))}
            </div>
          )}
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-5 pt-5 pb-28 space-y-5">

        {/* ── Sin viajes: empty state ────────────────────────────────── */}
        {!tieneViajes && (
          <div className="bg-white rounded-2xl border border-[#E8EEF4] p-8 text-center"
            style={{ boxShadow: 'var(--shadow-xs)' }}>
            {/* Ilustración SVG */}
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#E8F7F4] flex items-center justify-center">
              <Plane className="h-8 w-8 text-[#2D9E8C]" strokeWidth={1.5} aria-hidden="true" />
            </div>
            <h3
              className="font-semibold text-[#1A3D5C] mb-2 text-lg"
              style={{ fontFamily: "var(--font-fraunces)" }}
            >
              ¿A dónde viajan?
            </h3>
            <p className="text-sm text-slate-400 max-w-xs mx-auto mb-6 leading-relaxed">
              Crea tu primer viaje para obtener el checklist sanitario personalizado y los riesgos de tu destino.
            </p>
            <Link href="/viaje/nuevo">
              <button
                className="inline-flex items-center gap-2 bg-[#2D9E8C] hover:bg-[#237F70] text-white font-semibold px-6 py-3 rounded-xl text-sm transition-colors duration-150"
                style={{ boxShadow: 'var(--shadow-sm)' }}
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
                Crear mi primer viaje
              </button>
            </Link>
          </div>
        )}

        {/* ── Viaje activo (card prominente) ────────────────────────── */}
        {tieneViajes && (() => {
          const v = primerViaje!
          const dias = Math.ceil((new Date(v.fecha_salida).getTime() - new Date().getTime()) / 86400000)
          const destino = getDestinoBySlug(v.destino_slug)
          const paisCode = destino?.pais_code ?? "un"
          const enViaje = dias <= 0
          return (
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
                  {enViaje ? "Viaje en curso" : "Próximo viaje"}
                </p>
                {viajes!.length > 1 && (
                  <Link href={`/viaje/${viajes![1].id}`}
                    className="text-[11px] font-medium text-[#2D9E8C]">
                    +{viajes!.length - 1} más
                  </Link>
                )}
              </div>

              <Link href={`/viaje/${v.id}`}>
                <div
                  className="bg-white rounded-2xl border border-[#E8EEF4] p-4 cursor-pointer transition-all duration-150 hover:border-[#2D9E8C]/30 hover:shadow-md"
                  style={{ boxShadow: 'var(--shadow-sm)' }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                      <FlagImg code={paisCode} size={48} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[#1A3D5C] text-sm truncate">{v.destino_nombre}</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {new Date(v.fecha_salida).toLocaleDateString("es-CL", { day: "numeric", month: "short" })}
                        {" → "}
                        {new Date(v.fecha_regreso).toLocaleDateString("es-CL", { day: "numeric", month: "short" })}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        enViaje ? "bg-[#E8F7F4] text-[#2D9E8C]" :
                        dias <= 7 ? "bg-red-50 text-red-600" :
                        dias <= 30 ? "bg-amber-50 text-amber-600" :
                        "bg-slate-100 text-slate-500"
                      }`}>
                        {enViaje ? "En curso" : `${dias}d`}
                      </span>
                      <ChevronRight className="h-4 w-4 text-slate-300" aria-hidden="true" />
                    </div>
                  </div>

                  {/* Progress checklist */}
                  {totalItems > 0 && (
                    <div>
                      <div className="h-1.5 bg-[#F0F4F8] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#2D9E8C] rounded-full transition-all duration-500"
                          style={{ width: `${progreso}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center mt-1.5">
                        <span className="text-[11px] text-slate-400">
                          Checklist · {completados}/{totalItems} completados
                        </span>
                        <span className="text-[11px] font-semibold text-[#2D9E8C]">{progreso}%</span>
                      </div>
                    </div>
                  )}
                </div>
              </Link>

              {/* Viajes adicionales en lista compacta */}
              {viajes!.slice(1).map(vx => {
                const dx = getDestinoBySlug(vx.destino_slug)
                const pcx = dx?.pais_code ?? "un"
                const dias2 = Math.ceil((new Date(vx.fecha_salida).getTime() - new Date().getTime()) / 86400000)
                return (
                  <Link key={vx.id} href={`/viaje/${vx.id}`}>
                    <div className="mt-2 bg-white rounded-xl border border-[#E8EEF4] px-4 py-3 flex items-center gap-3 cursor-pointer hover:border-[#2D9E8C]/30 transition-colors">
                      <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100">
                        <FlagImg code={pcx} size={32} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#1A3D5C] truncate">{vx.destino_nombre}</p>
                        <p className="text-[11px] text-slate-400">{dias2}d</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-300" aria-hidden="true" />
                    </div>
                  </Link>
                )
              })}
            </div>
          )
        })()}

        {/* ── Accesos rápidos ────────────────────────────────────────── */}
        <div>
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-2.5">
            Accesos rápidos
          </p>
          <div className="grid grid-cols-2 gap-3">
            {[
              {
                href:  "/viaje/nuevo",
                Icon:  Plane,
                label: "Nuevo viaje",
                sub:   "Planifica tu salud",
              },
              {
                href:  primerViaje ? `/viaje/${primerViaje.id}/sintomas` : "/viaje/nuevo",
                Icon:  Thermometer,
                label: "Síntomas",
                sub:   primerViaje ? primerViaje.destino_nombre : "Crea un viaje primero",
              },
              {
                href:  primerViaje ? `/viaje/${primerViaje.id}/checklist` : "/viaje/nuevo",
                Icon:  CheckSquare,
                label: "Checklist",
                sub:   primerViaje ? primerViaje.destino_nombre : "Crea un viaje primero",
              },
              {
                href:  "/teleorientacion",
                Icon:  Stethoscope,
                label: "Orientación",
                sub:   "Habla con un médico",
              },
            ].map(({ href, Icon, label, sub }) => (
              <Link key={label} href={href}>
                <div
                  className="bg-white rounded-2xl border border-[#E8EEF4] p-4 cursor-pointer transition-all duration-150 hover:border-[#2D9E8C]/30 h-full"
                  style={{ boxShadow: 'var(--shadow-xs)' }}
                >
                  <div className="w-10 h-10 rounded-xl bg-[#E8F7F4] flex items-center justify-center mb-3">
                    <Icon className="h-5 w-5 text-[#2D9E8C]" strokeWidth={1.8} aria-hidden="true" />
                  </div>
                  <p className="font-semibold text-sm text-[#1A3D5C]">{label}</p>
                  <p className="text-xs text-slate-400 mt-0.5 truncate">{sub}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* CTA Nuevo viaje (si ya tiene viajes) */}
        {tieneViajes && (
          <Link href="/viaje/nuevo">
            <div className="flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-[#2D9E8C]/30 text-[#2D9E8C] text-sm font-medium hover:bg-[#E8F7F4]/50 transition-colors cursor-pointer">
              <Plus className="h-4 w-4" aria-hidden="true" />
              Agregar otro viaje
            </div>
          </Link>
        )}

        {/* Disclaimer */}
        <p className="text-[11px] text-slate-400 text-center leading-relaxed px-2 pb-2">
          SARIQAMA entrega orientación sanitaria. No reemplaza evaluación médica profesional.
        </p>
      </main>
    </div>
  )
}
