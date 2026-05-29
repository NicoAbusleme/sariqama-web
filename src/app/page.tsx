import Link from "next/link"
import Image from "next/image"
import { ChevronRight, Check, Shield, MapPin, CheckCircle, Stethoscope } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FlagImg } from "@/components/ui/flag-img"

// ─── Datos ────────────────────────────────────────────────────────────────────

const STATS = [
  { num: "5",    lbl: "Destinos LATAM" },
  { num: "CDC",  lbl: "Fuente clínica" },
  { num: "24/7", lbl: "Disponible" },
]

const PASOS = [
  {
    num: "01",
    emoji: "✈️",
    titulo: "Crea tu viaje",
    desc: "Selecciona destino, fechas y tipo de viaje. SARIQAMA arma el perfil sanitario de tu familia.",
    gradient: "from-[#2D9E8C] to-[#1A7A6B]",
  },
  {
    num: "02",
    emoji: "🗺️",
    titulo: "Conoce los riesgos",
    desc: "Dengue, malaria, vacunas, agua potable — información CDC 2026 adaptada a tu destino específico.",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    num: "03",
    emoji: "✅",
    titulo: "Viaja protegido",
    desc: "Checklist personalizado, botiquín curado y evaluador de síntomas si algo ocurre durante el viaje.",
    gradient: "from-[#1A3D5C] to-[#254E72]",
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
    featured: false,
    cta: "Empezar gratis",
    ctaHref: "/registro",
    ctaStyle: "bg-slate-900 hover:bg-slate-700 text-white",
    items: [
      { texto: "Perfil de viaje familiar",          ok: true  },
      { texto: "Riesgos generales del destino",     ok: true  },
      { texto: "Checklist básico (vacunas + docs)", ok: true  },
      { texto: "Checklist detallado adulto/niño",   ok: false },
      { texto: "Botiquín por destino + pediátrico", ok: false },
      { texto: "Reporte familiar PDF",              ok: false },
      { texto: "Evaluador de síntomas clínico",     ok: false },
      { texto: "Teleorientación médica",            ok: false },
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
    featured: true,
    cta: "Solicitar acceso",
    ctaHref: "/registro",
    ctaStyle: "bg-[#2D9E8C] hover:bg-[#237F70] text-white",
    items: [
      { texto: "Perfil de viaje familiar",          ok: true  },
      { texto: "Riesgos generales del destino",     ok: true  },
      { texto: "Checklist básico (vacunas + docs)", ok: true  },
      { texto: "Checklist detallado adulto/niño",   ok: true  },
      { texto: "Botiquín por destino + pediátrico", ok: true  },
      { texto: "Reporte familiar PDF",              ok: true  },
      { texto: "Evaluador de síntomas clínico",     ok: false },
      { texto: "Teleorientación médica",            ok: false },
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
    featured: false,
    cta: "Solicitar acceso",
    ctaHref: "/registro",
    ctaStyle: "bg-amber-500 hover:bg-amber-600 text-white",
    items: [
      { texto: "Perfil de viaje familiar",          ok: true },
      { texto: "Riesgos generales del destino",     ok: true },
      { texto: "Checklist básico (vacunas + docs)", ok: true },
      { texto: "Checklist detallado adulto/niño",   ok: true },
      { texto: "Botiquín por destino + pediátrico", ok: true },
      { texto: "Reporte familiar PDF",              ok: true },
      { texto: "Evaluador de síntomas clínico",     ok: true },
      { texto: "Teleorientación médica",            ok: true },
    ],
  },
]

const DESTINOS = [
  { code: "br", nombre: "Brasil",          riesgo: "Dengue muy alto",     chip: "bg-red-100 text-red-700",       continente: "Sudamérica"    },
  { code: "do", nombre: "Rep. Dominicana", riesgo: "Malaria moderado",    chip: "bg-yellow-100 text-yellow-700", continente: "Caribe"        },
  { code: "cr", nombre: "Costa Rica",      riesgo: "Dengue alto",         chip: "bg-orange-100 text-orange-700", continente: "Centroamérica" },
  { code: "mx", nombre: "México",          riesgo: "Diarrea del viajero", chip: "bg-yellow-100 text-yellow-700", continente: "Centroamérica" },
  { code: "cl", nombre: "Chile",           riesgo: "Bajo riesgo infec.",  chip: "bg-green-100 text-green-700",   continente: "Sudamérica"    },
]

const TESTIMONIOS = [
  {
    texto: "Antes de viajar a Brasil con mis hijos no sabía nada sobre el dengue. SARIQAMA me explicó todo de forma clara y me dio la lista exacta de lo que necesitaba llevar.",
    nombre: "Valentina R.",
    detalle: "Viajó a Brasil · 2 hijos",
    inicial: "V",
  },
  {
    texto: "El evaluador de síntomas me ayudó a entender que la fiebre de mi hija era señal de alerta. Pudimos actuar rápido gracias a eso.",
    nombre: "Carlos M.",
    detalle: "Viajó a México · 1 hija",
    inicial: "C",
  },
  {
    texto: "Muy útil el botiquín personalizado. Llevé exactamente lo que necesitaba y nada más. El médico en la teleorientación fue muy claro.",
    nombre: "Daniela P.",
    detalle: "Viajó a Costa Rica · Familia de 4",
    inicial: "D",
  },
]

const FEATURES = [
  { icon: Shield,       label: "Datos clínicos CDC 2026",       desc: "Fuente médica oficial" },
  { icon: MapPin,       label: "5 destinos LATAM cubiertos",    desc: "Brasil, México, Caribe y más" },
  { icon: CheckCircle,  label: "Checklist personalizado",        desc: "Por familia y destino" },
  { icon: Stethoscope,  label: "Orientación médica en español",  desc: "Profesionales especializados" },
]

// ─── Página ───────────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F7FFFE]">

      {/* ── NAVBAR ────────────────────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-50 border-b border-[#1A3D5C]/08"
        style={{
          background: 'rgba(247,255,254,0.92)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        <div className="max-w-5xl mx-auto px-5 h-16 flex items-center justify-between">
          <Image src="/logo.png" alt="SARIQAMA" width={130} height={40} className="h-9 w-auto object-contain" />
          <nav className="hidden sm:flex items-center gap-7 text-sm text-slate-500">
            <a href="#como-funciona" className="hover:text-[#1A3D5C] transition-colors font-medium">Cómo funciona</a>
            <a href="#planes" className="hover:text-[#1A3D5C] transition-colors font-medium">Planes</a>
            <a href="#destinos" className="hover:text-[#1A3D5C] transition-colors font-medium">Destinos</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-slate-600 font-medium">Iniciar sesión</Button>
            </Link>
            <Link href="/registro">
              <Button size="sm" className="bg-[#1A3D5C] hover:bg-[#254E72] text-white rounded-xl font-semibold px-5"
                style={{ boxShadow: 'var(--shadow-sm)' }}>
                Empezar gratis
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">

        {/* ── HERO ──────────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#1A3D5C] via-[#1F4D72] to-[#0A2238] px-5 pt-20 pb-32 sm:pt-28 sm:pb-40">
          {/* Mesh gradient overlays */}
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-96 h-96 opacity-20"
              style={{ background: 'radial-gradient(circle at center, #2D9E8C, transparent 70%)' }} />
            <div className="absolute bottom-10 left-10 w-64 h-64 opacity-10"
              style={{ background: 'radial-gradient(circle at center, #D4A338, transparent 70%)' }} />
            <div className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
                backgroundSize: '32px 32px',
              }} />
          </div>

          <div className="relative z-10 max-w-3xl mx-auto text-center">
            {/* Badge flotante */}
            <div className="inline-flex items-center gap-2 card-glass px-4 py-2 mb-8 text-[11px] font-semibold text-white/90 uppercase tracking-widest rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2D9E8C] animate-pulse" />
              Family Travel Health · CDC Yellow Book 2026
            </div>

            {/* Logo */}
            <div className="flex justify-center mb-8">
              <div className="bg-white rounded-2xl px-8 py-4 inline-block"
                style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.20)' }}>
                <Image src="/logo.png" alt="SARIQAMA" width={180} height={60} className="h-14 w-auto object-contain" priority />
              </div>
            </div>

            {/* Tagline dorada */}
            <p className="text-[#D4A338] text-xs font-bold uppercase tracking-[0.3em] mb-5 flex items-center justify-center gap-3">
              <span className="inline-block w-8 h-px bg-[#D4A338]/40" />
              Salud del viajero para tu familia
              <span className="inline-block w-8 h-px bg-[#D4A338]/40" />
            </p>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-white tracking-tight mb-5 leading-[1.1]"
              style={{ fontFamily: "var(--font-fraunces)" }}>
              Prepara la salud<br className="hidden sm:block" />
              <span style={{ color: '#7DD4C8' }}> de tu familia</span> para el viaje
            </h1>

            <p className="text-white/70 text-base sm:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
              Información clínica validada adaptada a tu destino, tu familia y tus fechas.
              Antes, durante y después del viaje.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
              <Link href="/registro">
                <Button size="lg"
                  className="bg-[#D4A338] hover:bg-[#B8892C] text-white font-bold px-8 h-14 rounded-2xl text-base w-full sm:w-auto transition-all duration-200 hover:-translate-y-0.5"
                  style={{ boxShadow: '0 8px 24px rgba(212,163,56,0.40)' }}>
                  Crear mi viaje gratis
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="ghost"
                  className="card-glass hover:bg-white/20 text-white/90 font-medium rounded-2xl text-sm w-full sm:w-auto h-14 px-6">
                  ¿Ya tienes cuenta? Inicia sesión
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-8 sm:gap-16 justify-center">
              {STATS.map(s => (
                <div key={s.lbl} className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-white mb-0.5"
                    style={{ fontFamily: "var(--font-fraunces)" }}>{s.num}</div>
                  <div className="text-[11px] text-white/50 uppercase tracking-wider">{s.lbl}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Ola inferior */}
          <div className="absolute bottom-0 left-0 right-0 leading-none">
            <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="w-full h-16 sm:h-20 block">
              <path d="M0,80 C240,20 480,70 720,45 C960,20 1200,65 1440,35 L1440,80 Z" fill="#F7FFFE" />
            </svg>
          </div>
        </section>

        {/* ── FEATURE STRIPS ────────────────────────────────────────────────── */}
        <section className="py-10 px-5">
          <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4">
            {FEATURES.map(f => (
              <div key={f.label} className="flex flex-col items-center text-center p-5 bg-white rounded-2xl"
                style={{ boxShadow: 'var(--shadow-sm)' }}>
                <div className="w-10 h-10 rounded-xl bg-[#E0F5F2] flex items-center justify-center mb-3">
                  <f.icon className="h-5 w-5 text-[#2D9E8C]" />
                </div>
                <p className="text-xs font-semibold text-[#1A3D5C] mb-0.5 leading-tight">{f.label}</p>
                <p className="text-[11px] text-slate-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CÓMO FUNCIONA ─────────────────────────────────────────────────── */}
        <section id="como-funciona" className="py-20 px-5">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-[#D4A338] text-xs font-bold uppercase tracking-widest mb-3">Proceso simple</p>
              <h2 className="text-3xl sm:text-4xl font-semibold text-[#1A3D5C] mb-4"
                style={{ fontFamily: "var(--font-fraunces)" }}>
                Tres pasos para viajar protegido
              </h2>
              <p className="text-slate-500 max-w-xl mx-auto text-sm leading-relaxed">
                SARIQAMA te acompaña desde la planificación hasta el regreso,
                con información basada en fuentes clínicas reales.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {PASOS.map((paso, i) => (
                <div
                  key={paso.num}
                  className="group bg-white rounded-3xl p-7 hover-lift cursor-default"
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${paso.gradient} flex items-center justify-center text-2xl mb-5`}
                    style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
                    {paso.emoji}
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-bold text-[#D4A338] bg-[#FBF0D4] px-2.5 py-0.5 rounded-full">
                      Paso {paso.num}
                    </span>
                  </div>
                  <h3 className="font-semibold text-[#1A3D5C] mb-2 text-lg"
                    style={{ fontFamily: "var(--font-fraunces)" }}>
                    {paso.titulo}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{paso.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PLANES ────────────────────────────────────────────────────────── */}
        <section id="planes" className="py-20 px-5 relative overflow-hidden"
          style={{
            background: 'linear-gradient(to bottom, #F7FFFE 0%, #EEF8F6 100%)',
          }}>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-[#D4A338] text-xs font-bold uppercase tracking-widest mb-3">Precios transparentes</p>
              <h2 className="text-3xl sm:text-4xl font-semibold text-[#1A3D5C] mb-4"
                style={{ fontFamily: "var(--font-fraunces)" }}>
                Elige tu nivel de protección
              </h2>
              <p className="text-slate-500 max-w-lg mx-auto text-sm leading-relaxed">
                Empieza gratis y escala según lo que tu familia necesita.
                Sin suscripciones ni letras pequeñas.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto items-start">
              {PLANES.map(plan => (
                <div
                  key={plan.id}
                  className={`bg-white rounded-3xl overflow-hidden flex flex-col transition-all duration-300 ${
                    plan.featured
                      ? 'ring-2 ring-[#2D9E8C] hover:-translate-y-1'
                      : 'hover:-translate-y-0.5'
                  }`}
                  style={{ boxShadow: plan.featured ? 'var(--shadow-xl)' : 'var(--shadow-md)' }}
                >
                  {/* Header */}
                  <div className={`${plan.headerBg} px-6 py-6 relative`}>
                    {plan.badge && (
                      <div className="absolute top-4 right-4">
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/25 text-white backdrop-blur-sm">
                          {plan.badge}
                        </span>
                      </div>
                    )}
                    <p className={`text-xs font-bold uppercase tracking-widest mb-3 ${plan.id === 'gratis' ? 'text-slate-400' : 'text-white/70'}`}>
                      {plan.nombre}
                    </p>
                    <div className={`text-3xl font-bold mb-0.5 ${plan.headerText}`}
                      style={{ fontFamily: "var(--font-fraunces)" }}>
                      {plan.precio}
                    </div>
                    <div className={`text-xs mb-4 ${plan.id === 'gratis' ? 'text-slate-400' : 'text-white/60'}`}>
                      {plan.precioSub}
                    </div>
                    <p className={`text-xs leading-relaxed ${plan.id === 'gratis' ? 'text-slate-500' : 'text-white/80'}`}>
                      {plan.descripcion}
                    </p>
                  </div>

                  {/* Features */}
                  <div className="px-6 py-5 flex-1">
                    <ul className="space-y-3">
                      {plan.items.map(item => (
                        <li key={item.texto} className="flex items-center gap-3">
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${item.ok ? 'bg-[#E0F5F2]' : 'bg-slate-100'}`}>
                            {item.ok
                              ? <Check className="h-3 w-3 text-[#2D9E8C]" />
                              : <span className="w-2 h-px bg-slate-300 rounded-full" />
                            }
                          </span>
                          <span className={`text-sm leading-tight ${item.ok ? 'text-slate-700' : 'text-slate-400'}`}>
                            {item.texto}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA */}
                  <div className="px-6 pb-6">
                    <Link href={plan.ctaHref} className="block">
                      <Button className={`w-full rounded-xl font-semibold h-11 ${plan.ctaStyle} transition-all duration-200`}
                        style={{ boxShadow: plan.featured ? 'var(--shadow-md)' : 'none' }}>
                        {plan.cta}
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-center text-xs text-slate-400 mt-8 max-w-md mx-auto leading-relaxed">
              🧪 <strong className="text-slate-500">Programa piloto activo.</strong>{" "}
              Contáctanos en{" "}
              <a href="mailto:contacto@sariqama.com" className="text-[#2D9E8C] hover:underline font-medium">
                contacto@sariqama.com
              </a>{" "}
              y te activamos en menos de 24 horas.
            </p>
          </div>
        </section>

        {/* ── DESTINOS ──────────────────────────────────────────────────────── */}
        <section id="destinos" className="py-20 px-5 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-[#D4A338] text-xs font-bold uppercase tracking-widest mb-3">Cobertura clínica</p>
              <h2 className="text-3xl sm:text-4xl font-semibold text-[#1A3D5C] mb-3"
                style={{ fontFamily: "var(--font-fraunces)" }}>
                Destinos cubiertos
              </h2>
              <p className="text-slate-400 text-sm">Actualizado con CDC Yellow Book 2026</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {DESTINOS.map(d => (
                <div key={d.nombre} className="group rounded-2xl p-5 text-center bg-white hover-lift">
                  <div className="flex justify-center mb-3">
                    <FlagImg code={d.code} size={56} className="rounded-xl shadow-md" />
                  </div>
                  <div className="font-semibold text-[#1A3D5C] mb-0.5 text-sm">{d.nombre}</div>
                  <div className="text-[10px] text-slate-400 mb-2.5">{d.continente}</div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${d.chip}`}>
                    {d.riesgo}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TESTIMONIOS ───────────────────────────────────────────────────── */}
        <section className="py-20 px-5"
          style={{ background: 'linear-gradient(135deg, #1A3D5C 0%, #0A2238 100%)' }}>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-[#D4A338] text-xs font-bold uppercase tracking-widest mb-3">Familias SARIQAMA</p>
              <h2 className="text-3xl sm:text-4xl font-semibold text-white"
                style={{ fontFamily: "var(--font-fraunces)" }}>
                Lo que dicen las familias
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {TESTIMONIOS.map((t, i) => (
                <div key={i} className="card-glass rounded-2xl p-6 flex flex-col">
                  {/* Comillas decorativas */}
                  <div className="text-[#D4A338] text-4xl font-serif leading-none mb-3 opacity-70">&ldquo;</div>
                  <p className="text-white/80 text-sm leading-relaxed mb-6 flex-1">
                    {t.texto}
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#2D9E8C] flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-white">{t.inicial}</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{t.nombre}</p>
                      <p className="text-[11px] text-white/50">{t.detalle}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA FINAL ─────────────────────────────────────────────────────── */}
        <section className="py-24 px-5 bg-[#F7FFFE] text-center">
          <div className="max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-[#E0F5F2] text-[#2D9E8C] text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2D9E8C]" />
              Gratis para empezar
            </div>
            <h2 className="text-3xl sm:text-4xl font-semibold text-[#1A3D5C] mb-4"
              style={{ fontFamily: "var(--font-fraunces)" }}>
              ¿Cuándo sale tu próximo viaje?
            </h2>
            <p className="text-slate-500 mb-10 max-w-md mx-auto leading-relaxed">
              Crea el perfil de tu familia en minutos y obtén tu primer reporte sanitario completo — gratis.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/registro">
                <Button size="lg"
                  className="bg-[#1A3D5C] hover:bg-[#254E72] text-white font-bold px-10 h-14 rounded-2xl text-base w-full sm:w-auto transition-all duration-200 hover:-translate-y-0.5"
                  style={{ boxShadow: 'var(--shadow-lg)' }}>
                  Empezar gratis
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <a href="mailto:contacto@sariqama.com">
                <Button size="lg" variant="outline"
                  className="border-[#1A3D5C]/20 text-[#1A3D5C] hover:bg-[#1A3D5C]/05 rounded-2xl text-sm w-full sm:w-auto h-14 px-7 font-medium">
                  Contactar al equipo
                </Button>
              </a>
            </div>
          </div>
        </section>

        {/* ── DISCLAIMER ────────────────────────────────────────────────────── */}
        <div className="py-5 px-5 bg-[#F7FFFE] border-t border-slate-100">
          <p className="text-center text-[11px] text-slate-400 max-w-2xl mx-auto leading-relaxed">
            <strong className="text-slate-500">Aviso importante:</strong>{" "}
            SARIQAMA entrega orientación sanitaria basada en fuentes clínicas validadas (CDC Yellow Book 2026).
            No reemplaza una evaluación médica profesional. Ante signos de alarma, busca atención médica de inmediato.
          </p>
        </div>
      </main>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <footer className="bg-[#0F2D45] px-5 pt-14 pb-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-10 mb-12">
            {/* Brand col */}
            <div className="sm:col-span-2">
              <Image src="/logo.png" alt="SARIQAMA" width={140} height={44} className="h-10 w-auto object-contain mb-4 brightness-0 invert opacity-90" />
              <p className="text-[#A8C5DA] text-sm leading-relaxed max-w-xs">
                Salud del viajero para familias latinoamericanas.
                Información clínica validada, en español.
              </p>
              <div className="mt-5 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#2D9E8C] animate-pulse" />
                <span className="text-[11px] text-[#2D9E8C] font-semibold">Piloto activo — Acceso gratuito</span>
              </div>
            </div>

            {/* Links */}
            <div>
              <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-4">App</p>
              <div className="flex flex-col gap-2.5">
                {[
                  { href: "#como-funciona", label: "Cómo funciona" },
                  { href: "#planes",        label: "Planes"         },
                  { href: "#destinos",      label: "Destinos"       },
                  { href: "/login",         label: "Iniciar sesión" },
                  { href: "/registro",      label: "Registrarse"   },
                ].map(l => (
                  <a key={l.label} href={l.href} className="text-[#A8C5DA] hover:text-white text-sm transition-colors">
                    {l.label}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-4">Contacto</p>
              <div className="flex flex-col gap-2.5">
                <a href="mailto:contacto@sariqama.com" className="text-[#A8C5DA] hover:text-white text-sm transition-colors">
                  contacto@sariqama.com
                </a>
                <Link href="/terminos" className="text-[#A8C5DA] hover:text-white text-sm transition-colors">
                  Términos y condiciones
                </Link>
                <Link href="/terminos" className="text-[#A8C5DA] hover:text-white text-sm transition-colors">
                  Política de privacidad
                </Link>
              </div>
              <div className="mt-5 p-3 rounded-xl border border-white/10 bg-white/05">
                <p className="text-[10px] text-white/40 leading-relaxed">
                  Fuente clínica: <span className="text-white/60 font-medium">CDC Yellow Book 2026</span>
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-white/08 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2">
            <p className="text-white/30 text-xs">© 2026 SARIQAMA · Orientación sanitaria, no diagnóstico médico.</p>
            <p className="text-white/20 text-xs">Hecho en Chile 🇨🇱</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
