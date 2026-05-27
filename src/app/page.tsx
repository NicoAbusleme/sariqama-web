import Link from "next/link"
import { ChevronRight, Shield, MapPin, CheckCircle, Stethoscope, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FlagImg } from "@/components/ui/flag-img"

// ─── Datos ────────────────────────────────────────────────────────────────────

const STATS = [
  { num: "5",    lbl: "Destinos" },
  { num: "CDC",  lbl: "Fuente clínica" },
  { num: "24/7", lbl: "Disponible" },
]

const PASOS = [
  {
    num: "01",
    emoji: "✈️",
    titulo: "Crea tu viaje",
    desc: "Selecciona destino, fechas y tipo de viaje. SARIQAMA arma el perfil sanitario de tu familia.",
    color: "text-[#2D9E8C]",
    bg: "bg-[#E0F5F2]",
  },
  {
    num: "02",
    emoji: "🗺️",
    titulo: "Conoce los riesgos",
    desc: "Dengue, malaria, vacunas, agua potable — información CDC 2026 adaptada a tu destino específico.",
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    num: "03",
    emoji: "✅",
    titulo: "Prepárate y viaja seguro",
    desc: "Checklist personalizado, botiquín curado y evaluador de síntomas si algo ocurre durante el viaje.",
    color: "text-green-600",
    bg: "bg-green-50",
  },
]

const PLANES = [
  {
    id: "gratis",
    nombre: "Exploración",
    precio: "Gratis",
    precioSub: "siempre",
    descripcion: "Para familias que quieren saber a qué se enfrentan.",
    headerBg: "bg-slate-50",
    headerText: "text-slate-800",
    badge: null,
    borderClass: "border-slate-200",
    cta: "Empezar gratis",
    ctaHref: "/registro",
    ctaStyle: "bg-slate-900 hover:bg-slate-700 text-white",
    items: [
      { texto: "Perfil de viaje familiar",        ok: true },
      { texto: "Riesgos generales del destino",   ok: true },
      { texto: "Checklist básico (vacunas + docs)", ok: true },
      { texto: "Checklist detallado adulto/niño", ok: false },
      { texto: "Botiquín por destino + pediátrico", ok: false },
      { texto: "Reporte familiar PDF",            ok: false },
      { texto: "Evaluador de síntomas clínico",   ok: false },
      { texto: "Teleorientación médica",          ok: false },
    ],
  },
  {
    id: "preparacion",
    nombre: "Preparación Total",
    precio: "USD 19–29",
    precioSub: "por viaje",
    descripcion: "Todo lo que necesitas para llegar 100% preparado.",
    headerBg: "bg-gradient-to-br from-[#1A3D5C] to-[#1F4D72]",
    headerText: "text-white",
    badge: "Más popular",
    borderClass: "border-[#2D9E8C] ring-2 ring-[#2D9E8C]/30",
    cta: "Solicitar acceso",
    ctaHref: "/registro",
    ctaStyle: "bg-[#2D9E8C] hover:bg-[#237F70] text-white",
    items: [
      { texto: "Perfil de viaje familiar",        ok: true },
      { texto: "Riesgos generales del destino",   ok: true },
      { texto: "Checklist básico (vacunas + docs)", ok: true },
      { texto: "Checklist detallado adulto/niño", ok: true },
      { texto: "Botiquín por destino + pediátrico", ok: true },
      { texto: "Reporte familiar PDF",            ok: true },
      { texto: "Evaluador de síntomas clínico",   ok: false },
      { texto: "Teleorientación médica",          ok: false },
    ],
  },
  {
    id: "acompanamiento",
    nombre: "Acompañamiento",
    precio: "USD 29–39",
    precioSub: "por evento",
    descripcion: "Atención profesional antes, durante y después.",
    headerBg: "bg-gradient-to-br from-amber-500 to-orange-500",
    headerText: "text-white",
    badge: "Máxima protección",
    borderClass: "border-amber-200",
    cta: "Solicitar acceso",
    ctaHref: "/registro",
    ctaStyle: "bg-amber-500 hover:bg-amber-600 text-white",
    items: [
      { texto: "Perfil de viaje familiar",        ok: true },
      { texto: "Riesgos generales del destino",   ok: true },
      { texto: "Checklist básico (vacunas + docs)", ok: true },
      { texto: "Checklist detallado adulto/niño", ok: true },
      { texto: "Botiquín por destino + pediátrico", ok: true },
      { texto: "Reporte familiar PDF",            ok: true },
      { texto: "Evaluador de síntomas clínico",   ok: true },
      { texto: "Teleorientación médica",          ok: true },
    ],
  },
]

const DESTINOS = [
  { code: "br", nombre: "Brasil",          riesgo: "Dengue muy alto",     chip: "bg-red-100 text-red-700",       continente: "Sudamérica" },
  { code: "do", nombre: "Rep. Dominicana", riesgo: "Malaria moderado",    chip: "bg-yellow-100 text-yellow-700", continente: "Caribe" },
  { code: "cr", nombre: "Costa Rica",      riesgo: "Dengue alto",         chip: "bg-orange-100 text-orange-700", continente: "Centroamérica" },
  { code: "mx", nombre: "México",          riesgo: "Diarrea del viajero", chip: "bg-yellow-100 text-yellow-700", continente: "Centroamérica" },
  { code: "cl", nombre: "Chile",           riesgo: "Bajo riesgo infec.",  chip: "bg-green-100 text-green-700",   continente: "Sudamérica" },
]

const TESTIMONIOS = [
  {
    texto: "Antes de viajar a Brasil con mis hijos no sabía nada sobre el dengue. SARIQAMA me explicó todo de forma clara y me dio la lista exacta de lo que necesitaba llevar.",
    nombre: "Valentina R.",
    detalle: "Viajó a Brasil · 2 hijos",
  },
  {
    texto: "El evaluador de síntomas me ayudó a entender que la fiebre de mi hija era señal de alerta. Pudimos actuar rápido gracias a eso.",
    nombre: "Carlos M.",
    detalle: "Viajó a México · 1 hija",
  },
  {
    texto: "Muy útil el botiquín personalizado. Llevé exactamente lo que necesitaba y nada más. El médico en la teleorientación fue muy claro.",
    nombre: "Daniela P.",
    detalle: "Viajó a Costa Rica · Familia de 4",
  },
]

// ─── Página ───────────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F7FFFE]">

      {/* NAVBAR */}
      <header className="bg-white/80 backdrop-blur border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-5 h-16 flex items-center justify-between">
          <img src="/logo.png" alt="SARIQAMA" className="h-9 w-auto object-contain" />
          <nav className="hidden sm:flex items-center gap-6 text-sm text-slate-500">
            <a href="#como-funciona" className="hover:text-slate-900 transition-colors">Cómo funciona</a>
            <a href="#planes" className="hover:text-slate-900 transition-colors">Planes</a>
            <a href="#destinos" className="hover:text-slate-900 transition-colors">Destinos</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-slate-600">Iniciar sesión</Button>
            </Link>
            <Link href="/registro">
              <Button size="sm" className="bg-[#2D9E8C] hover:bg-[#237F70] text-white rounded-xl">
                Empezar gratis
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">

        {/* ── HERO ─────────────────────────────────────────────────────────── */}
        <section className="bg-gradient-to-br from-[#1A3D5C] via-[#1F4D72] to-[#0A2238] px-5 py-20 sm:py-28 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: "radial-gradient(circle at 20% 80%, #fff 1px, transparent 1px), radial-gradient(circle at 80% 20%, #fff 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

          <div className="relative z-10 inline-flex items-center justify-center rounded-2xl mb-6 px-6 py-3"
            style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(8px)" }}>
            <img src="/logo.png" alt="SARIQAMA" className="h-16 w-auto object-contain" />
          </div>

          {/* Tagline gold — estilo logo */}
          <p className="relative z-10 text-[#D4A338] text-xs font-bold uppercase tracking-[0.25em] mb-4 flex items-center justify-center gap-2">
            <span className="inline-block w-6 h-px bg-[#D4A338]/50" />
            Family Travel Health
            <span className="inline-block w-6 h-px bg-[#D4A338]/50" />
          </p>

          <h1 className="relative z-10 text-4xl sm:text-5xl lg:text-6xl font-semibold text-white tracking-tight mb-4 leading-tight"
            style={{ fontFamily: "var(--font-fraunces)" }}>
            Prepara la salud<br className="hidden sm:block" /> de tu familia para el viaje
          </h1>
          <p className="relative z-10 text-white/75 text-base max-w-lg mx-auto mb-8 leading-relaxed">
            Información clínica validada (CDC 2026) adaptada a tu destino, tu familia y tus fechas.
            Antes, durante y después del viaje.
          </p>

          {/* Pills de features */}
          <div className="relative z-10 flex gap-2 flex-wrap justify-center mb-8">
            {["Gratis para empezar", "5 destinos LATAM", "CDC Yellow Book 2026", "Para familias con niños"].map(p => (
              <span key={p} className="px-4 py-1.5 rounded-full text-xs font-medium text-white/90 border border-white/20"
                style={{ background: "rgba(255,255,255,0.12)" }}>
                {p}
              </span>
            ))}
          </div>

          {/* Stats */}
          <div className="relative z-10 flex gap-8 sm:gap-12 justify-center mb-10">
            {STATS.map(s => (
              <div key={s.lbl} className="text-center">
                <div className="text-2xl font-bold text-white">{s.num}</div>
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

        {/* ── CÓMO FUNCIONA ────────────────────────────────────────────────── */}
        <section id="como-funciona" className="py-20 px-5">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-[#D4A338] text-xs font-bold uppercase tracking-widest mb-3">Proceso simple</p>
              <h2 className="text-3xl font-semibold text-slate-900 mb-3"
                style={{ fontFamily: "var(--font-fraunces)" }}>
                Tres pasos para viajar protegido
              </h2>
              <p className="text-slate-500 max-w-xl mx-auto text-sm leading-relaxed">
                SARIQAMA te acompaña desde la planificación hasta el regreso, con información basada en fuentes clínicas reales.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {PASOS.map((paso) => (
                <div key={paso.num} className="bg-white rounded-2xl border border-slate-100 p-6 hover:border-[#2D9E8C]/30 hover:shadow-sm transition-all">
                  <div className="flex items-center gap-3 mb-5">
                    <div className={`w-12 h-12 ${paso.bg} rounded-2xl flex items-center justify-center text-2xl`}>
                      {paso.emoji}
                    </div>
                    <span className={`text-3xl font-bold ${paso.color} opacity-30`}>{paso.num}</span>
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2 text-[16px]"
                    style={{ fontFamily: "var(--font-fraunces)" }}>
                    {paso.titulo}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{paso.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PLANES ───────────────────────────────────────────────────────── */}
        <section id="planes" className="py-20 px-5 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-[#D4A338] text-xs font-bold uppercase tracking-widest mb-3">Precios transparentes</p>
              <h2 className="text-3xl font-semibold text-slate-900 mb-3"
                style={{ fontFamily: "var(--font-fraunces)" }}>
                Elige tu nivel de protección
              </h2>
              <p className="text-slate-500 max-w-lg mx-auto text-sm leading-relaxed">
                Empieza gratis y escala según lo que tu familia necesita.
                Sin suscripciones ni letras pequeñas.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
              {PLANES.map(plan => (
                <div key={plan.id}
                  className={`bg-white rounded-2xl border overflow-hidden flex flex-col ${plan.borderClass}`}>

                  {/* Header */}
                  <div className={`${plan.headerBg} px-5 py-5`}>
                    <div className="flex items-start justify-between mb-2">
                      <span className={`text-sm font-bold ${plan.headerText}`}>{plan.nombre}</span>
                      {plan.badge && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/25 text-white">
                          {plan.badge}
                        </span>
                      )}
                    </div>
                    <div className={`text-2xl font-bold ${plan.headerText} mb-0.5`}>{plan.precio}</div>
                    <div className={`text-[11px] ${plan.id === 'gratis' ? 'text-slate-400' : 'text-white/70'}`}>
                      {plan.precioSub}
                    </div>
                    <p className={`text-xs mt-3 leading-relaxed ${plan.id === 'gratis' ? 'text-slate-500' : 'text-white/80'}`}>
                      {plan.descripcion}
                    </p>
                  </div>

                  {/* Features */}
                  <div className="px-5 py-4 flex-1">
                    <ul className="space-y-2.5">
                      {plan.items.map(item => (
                        <li key={item.texto} className="flex items-center gap-2.5">
                          <span className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${item.ok ? 'bg-[#E0F5F2]' : 'bg-slate-100'}`}>
                            {item.ok ? (
                              <Check className="h-2.5 w-2.5 text-[#2D9E8C]" />
                            ) : (
                              <span className="w-1.5 h-0.5 bg-slate-300 rounded-full" />
                            )}
                          </span>
                          <span className={`text-sm ${item.ok ? 'text-slate-700' : 'text-slate-400'}`}>
                            {item.texto}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA */}
                  <div className="px-5 pb-5">
                    <Link href={plan.ctaHref} className="block">
                      <Button className={`w-full rounded-xl font-semibold ${plan.ctaStyle}`}>
                        {plan.cta}
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Nota piloto */}
            <p className="text-center text-xs text-slate-400 mt-8 max-w-md mx-auto leading-relaxed">
              🧪 <strong className="text-slate-500">Programa piloto activo.</strong>{" "}
              Los planes pagados se activan manualmente. Contáctanos en{" "}
              <a href="mailto:contacto@sariqama.com" className="text-[#2D9E8C] hover:underline">contacto@sariqama.com</a>{" "}
              y te respondemos en menos de 24 horas.
            </p>
          </div>
        </section>

        {/* ── DESTINOS ─────────────────────────────────────────────────────── */}
        <section id="destinos" className="py-20 px-5 bg-[#F7FFFE]">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-[#D4A338] text-xs font-bold uppercase tracking-widest mb-3">Cobertura clínica</p>
              <h2 className="text-3xl font-semibold text-slate-900 mb-3"
                style={{ fontFamily: "var(--font-fraunces)" }}>
                Destinos cubiertos
              </h2>
              <p className="text-slate-500 text-sm">Información actualizada — CDC Yellow Book 2026</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {DESTINOS.map(d => (
                <div key={d.nombre}
                  className="bg-white rounded-2xl p-5 text-center border border-teal-100 hover:border-[#2D9E8C]/50 hover:shadow-sm transition-all">
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

        {/* ── TESTIMONIOS ──────────────────────────────────────────────────── */}
        <section className="py-20 px-5 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-[#D4A338] text-xs font-bold uppercase tracking-widest mb-3">Familias SARIQAMA</p>
              <h2 className="text-3xl font-semibold text-slate-900"
                style={{ fontFamily: "var(--font-fraunces)" }}>
                Lo que dicen las familias
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {TESTIMONIOS.map((t, i) => (
                <div key={i} className="bg-[#F7FFFE] rounded-2xl border border-[#2D9E8C]/20 p-6">
                  <p className="text-sm text-slate-600 leading-relaxed mb-5 italic">
                    &ldquo;{t.texto}&rdquo;
                  </p>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{t.nombre}</p>
                    <p className="text-xs text-slate-400">{t.detalle}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA FINAL ────────────────────────────────────────────────────── */}
        <section className="py-24 px-5 bg-gradient-to-br from-[#1A3D5C] to-[#0A2238] text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: "radial-gradient(circle at 30% 70%, #fff 1px, transparent 1px)", backgroundSize: "50px 50px" }} />
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-4"
              style={{ fontFamily: "var(--font-fraunces)" }}>
              ¿Cuándo sale tu próximo viaje?
            </h2>
            <p className="text-[#C8DDE9] mb-10 text-sm max-w-md mx-auto leading-relaxed">
              Crea el perfil de tu familia en minutos y obtén tu primer reporte sanitario completo — gratis.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/registro">
                <Button size="lg"
                  className="bg-amber-400 hover:bg-amber-300 text-slate-900 font-semibold px-8 h-13 rounded-2xl text-base w-full sm:w-auto">
                  Empezar gratis
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <a href="mailto:contacto@sariqama.com">
                <Button size="lg" variant="ghost"
                  className="text-white/80 hover:text-white hover:bg-white/10 rounded-2xl text-sm w-full sm:w-auto">
                  Contactar al equipo
                </Button>
              </a>
            </div>
          </div>
        </section>

        {/* ── DISCLAIMER ───────────────────────────────────────────────────── */}
        <section className="py-8 px-5 bg-white border-t border-slate-100">
          <p className="text-center text-xs text-slate-400 max-w-2xl mx-auto leading-relaxed">
            <strong className="text-slate-500">Aviso importante:</strong>{" "}
            SARIQAMA entrega orientación sanitaria basada en fuentes clínicas validadas (CDC Yellow Book 2026).
            No reemplaza una evaluación médica profesional.
            Ante signos de alarma, busca atención médica de inmediato.
          </p>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-slate-900 py-10 px-5">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 mb-8">
            <div>
              <span className="text-lg font-bold text-white"
                style={{ fontFamily: "var(--font-fraunces)" }}>
                SARIQAMA
              </span>
              <p className="text-slate-400 text-xs mt-1 max-w-xs leading-relaxed">
                Salud del viajero para familias latinoamericanas. Información clínica validada, en español.
              </p>
            </div>
            <div className="flex gap-12 text-sm">
              <div>
                <p className="text-slate-400 font-semibold text-xs uppercase tracking-wider mb-3">App</p>
                <div className="flex flex-col gap-1.5">
                  <a href="#como-funciona" className="text-slate-500 hover:text-white transition-colors text-xs">Cómo funciona</a>
                  <a href="#planes" className="text-slate-500 hover:text-white transition-colors text-xs">Planes</a>
                  <a href="#destinos" className="text-slate-500 hover:text-white transition-colors text-xs">Destinos</a>
                </div>
              </div>
              <div>
                <p className="text-slate-400 font-semibold text-xs uppercase tracking-wider mb-3">Contacto</p>
                <div className="flex flex-col gap-1.5">
                  <a href="mailto:contacto@sariqama.com" className="text-slate-500 hover:text-white transition-colors text-xs">contacto@sariqama.com</a>
                  <Link href="/login" className="text-slate-500 hover:text-white transition-colors text-xs">Iniciar sesión</Link>
                  <Link href="/registro" className="text-slate-500 hover:text-white transition-colors text-xs">Registrarse</Link>
                </div>
              </div>
              <div>
                <p className="text-slate-400 font-semibold text-xs uppercase tracking-wider mb-3">Legal</p>
                <div className="flex flex-col gap-1.5">
                  <Link href="/terminos" className="text-slate-500 hover:text-white transition-colors text-xs">Términos y Condiciones</Link>
                  <Link href="/terminos#privacidad" className="text-slate-500 hover:text-white transition-colors text-xs">Política de privacidad</Link>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2">
            <p className="text-slate-500 text-xs">© 2026 SARIQAMA · Orientación sanitaria, no diagnóstico médico.</p>
            <div className="flex items-center gap-4">
              <Link href="/terminos" className="text-slate-600 hover:text-slate-400 text-xs transition-colors">Términos y Condiciones</Link>
              <p className="text-slate-600 text-xs">Fuente clínica: CDC Yellow Book 2026</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
