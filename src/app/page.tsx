import Link from "next/link"
import { ChevronRight, Shield, MapPin, CheckCircle, Stethoscope } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FlagImg } from "@/components/ui/flag-img"

const BENEFICIOS = [
  { icon: MapPin,       bg: "bg-teal-50",   color: "text-teal-600",  titulo: "Riesgos por destino",     desc: "Dengue, malaria, vacunas y más según adonde viajes." },
  { icon: CheckCircle,  bg: "bg-green-50",  color: "text-green-600", titulo: "Checklist sanitario",     desc: "Lista personalizada según tu familia, destino y fechas." },
  { icon: Shield,       bg: "bg-amber-50",  color: "text-amber-600", titulo: "Evaluador de síntomas",   desc: "Semáforo clínico para adultos y niños por separado." },
  { icon: Stethoscope,  bg: "bg-teal-50",   color: "text-teal-600",  titulo: "Orientación profesional", desc: "Teleorientación con especialistas en medicina del viajero." },
]

const DESTINOS = [
  { code: "br", nombre: "Brasil",               riesgo: "Dengue muy alto",    chip: "bg-red-100 text-red-700",       continente: "Sudamérica" },
  { code: "do", nombre: "Rep. Dominicana",       riesgo: "Malaria moderado",   chip: "bg-yellow-100 text-yellow-700", continente: "Caribe" },
  { code: "cr", nombre: "Costa Rica",            riesgo: "Dengue alto",        chip: "bg-orange-100 text-orange-700", continente: "Centroamérica" },
  { code: "mx", nombre: "México",               riesgo: "Diarrea del viajero",chip: "bg-yellow-100 text-yellow-700", continente: "Centroamérica" },
  { code: "cl", nombre: "Chile",                riesgo: "Bajo riesgo infec.", chip: "bg-green-100 text-green-700",   continente: "Sudamérica" },
]

const STATS = [
  { num: "5", lbl: "Destinos" },
  { num: "CDC", lbl: "Fuente clínica" },
  { num: "24/7", lbl: "Disponible" },
]

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F0FDF9]">

      {/* NAVBAR */}
      <header className="bg-white/80 backdrop-blur border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-5 h-16 flex items-center justify-between">
          <span className="text-xl font-bold text-slate-900 tracking-tight"
            style={{ fontFamily: "var(--font-fraunces)" }}>
            SARIQAMA
          </span>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-slate-600">Iniciar sesión</Button>
            </Link>
            <Link href="/registro">
              <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-white rounded-xl">
                Empezar gratis
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">

        {/* HERO */}
        <section className="bg-gradient-to-br from-teal-600 via-teal-700 to-teal-900 px-5 py-20 sm:py-28 text-center relative overflow-hidden">
          {/* Decoración fondo */}
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: "radial-gradient(circle at 20% 80%, #fff 1px, transparent 1px), radial-gradient(circle at 80% 20%, #fff 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

          {/* Logo mark */}
          <div className="relative z-10 inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-6 text-4xl border border-white/25"
            style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)" }}>
            🌴
          </div>

          <h1 className="relative z-10 text-4xl sm:text-5xl lg:text-6xl font-semibold text-white tracking-tight mb-4 leading-tight"
            style={{ fontFamily: "var(--font-fraunces)" }}>
            SARIQAMA
          </h1>
          <p className="relative z-10 text-white/75 text-sm tracking-widest font-light mb-6 uppercase">
            Smart Tropical Health Protection
          </p>

          {/* Pills */}
          <div className="relative z-10 flex gap-2 flex-wrap justify-center mb-8">
            {["Travel Health", "AI Guidance", "Prevention", "Vaccines"].map(p => (
              <span key={p} className="px-4 py-1.5 rounded-full text-xs font-medium text-white/90 border border-white/20"
                style={{ background: "rgba(255,255,255,0.12)" }}>
                {p}
              </span>
            ))}
          </div>

          {/* Stats */}
          <div className="relative z-10 flex gap-8 justify-center mb-10">
            {STATS.map(s => (
              <div key={s.lbl} className="text-center">
                <div className="text-xl font-semibold text-white">{s.num}</div>
                <div className="text-xs text-white/60 mt-0.5">{s.lbl}</div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="relative z-10 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/registro">
              <Button size="lg" className="bg-amber-400 hover:bg-amber-300 text-slate-900 font-semibold px-8 h-13 rounded-2xl text-base w-full sm:w-auto">
                Crear mi viaje gratis
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="ghost"
                className="text-white/80 hover:text-white hover:bg-white/10 rounded-2xl text-sm w-full sm:w-auto">
                ¿Ya tienes cuenta? Inicia sesión
              </Button>
            </Link>
          </div>
        </section>

        {/* BENEFICIOS */}
        <section className="py-20 px-5">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-semibold text-slate-900 mb-3"
                style={{ fontFamily: "var(--font-fraunces)" }}>
                Todo lo que necesitas antes, durante y después
              </h2>
              <p className="text-slate-500 max-w-xl mx-auto text-sm leading-relaxed">
                Información clínica validada basada en CDC Yellow Book 2026, adaptada a tu familia y destino.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {BENEFICIOS.map(b => (
                <div key={b.titulo}
                  className="bg-white rounded-2xl border border-slate-100 p-6 hover:border-teal-200 hover:shadow-sm transition-all">
                  <div className={`w-11 h-11 ${b.bg} rounded-2xl flex items-center justify-center mb-4`}>
                    <b.icon className={`h-5 w-5 ${b.color}`} />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-1.5 text-[15px]">{b.titulo}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* DESTINOS */}
        <section className="py-16 px-5 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-semibold text-slate-900 mb-3"
                style={{ fontFamily: "var(--font-fraunces)" }}>
                Destinos cubiertos
              </h2>
              <p className="text-slate-500 text-sm">Información actualizada — CDC Yellow Book 2026</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {DESTINOS.map(d => (
                <div key={d.nombre}
                  className="bg-[#F0FDF9] rounded-2xl p-5 text-center border border-teal-100 hover:border-teal-300 hover:shadow-sm transition-all">
                  <div className="flex justify-center mb-3">
                    <FlagImg code={d.code} size={52} className="rounded-md shadow-sm" />
                  </div>
                  <div className="font-semibold text-slate-900 mb-1 text-sm">{d.nombre}</div>
                  <div className="text-[10px] text-slate-400 mb-2">{d.continente}</div>
                  <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${d.chip}`}>
                    {d.riesgo}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="py-20 px-5 bg-gradient-to-br from-teal-600 to-teal-900 text-center">
          <h2 className="text-3xl font-semibold text-white mb-3"
            style={{ fontFamily: "var(--font-fraunces)" }}>
            ¿Cuándo sale tu próximo viaje?
          </h2>
          <p className="text-teal-100 mb-8 text-sm max-w-md mx-auto">
            Crea el perfil de tu familia y obtén tu checklist sanitario en minutos.
          </p>
          <Link href="/registro">
            <Button size="lg"
              className="bg-amber-400 hover:bg-amber-300 text-slate-900 font-semibold px-8 h-13 rounded-2xl text-base">
              Empezar gratis
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </section>

        {/* DISCLAIMER */}
        <section className="py-8 px-5 bg-white border-t border-slate-100">
          <p className="text-center text-xs text-slate-400 max-w-2xl mx-auto leading-relaxed">
            <strong className="text-slate-500">Aviso importante:</strong>{" "}
            SARIQAMA entrega orientación sanitaria basada en fuentes clínicas validadas.
            No reemplaza una evaluación médica profesional.
            Ante signos de alarma, busca atención médica de inmediato.
          </p>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-slate-900 py-8 px-5">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3 text-sm">
          <span className="font-semibold text-white"
            style={{ fontFamily: "var(--font-fraunces)" }}>
            SARIQAMA
          </span>
          <p className="text-slate-400 text-xs">© 2026 SARIQAMA · Orientación sanitaria, no diagnóstico médico.</p>
        </div>
      </footer>
    </div>
  )
}
