import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Check, Shield, Clock, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FlagImg } from "@/components/ui/flag-img"

// ─── Data ─────────────────────────────────────────────────────────────────────

const DESTINOS = [
  { code: "br", nombre: "Brasil",          riesgo: "Dengue muy alto"     },
  { code: "do", nombre: "Rep. Dominicana", riesgo: "Malaria moderado"    },
  { code: "cr", nombre: "Costa Rica",      riesgo: "Dengue alto"         },
  { code: "mx", nombre: "México",          riesgo: "Diarrea del viajero" },
  { code: "cl", nombre: "Chile",           riesgo: "Bajo riesgo infec."  },
]

const PLANES = [
  {
    id: "gratis",
    nombre: "Exploración",
    precio: "Gratis",
    precioSub: "siempre",
    featured: false,
    cta: "Empezar gratis",
    ctaHref: "/registro",
    ctaStyle: "bg-[#1A3D5C] hover:bg-[#254E72] text-white",
    items: [
      { texto: "Perfil de viaje familiar",          ok: true  },
      { texto: "Riesgos generales del destino",     ok: true  },
      { texto: "Checklist básico (vacunas + docs)", ok: true  },
      { texto: "Checklist detallado adulto/niño",   ok: false },
      { texto: "Botiquín por destino + pediátrico", ok: false },
      { texto: "Evaluador de síntomas clínico",     ok: false },
      { texto: "Teleorientación médica",            ok: false },
    ],
  },
  {
    id: "preparacion",
    nombre: "Preparación Total",
    precio: "USD 19–29",
    precioSub: "por viaje",
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
      { texto: "Evaluador de síntomas clínico",     ok: false },
      { texto: "Teleorientación médica",            ok: false },
    ],
  },
  {
    id: "acompanamiento",
    nombre: "Acompañamiento",
    precio: "USD 29–39",
    precioSub: "por evento",
    featured: false,
    cta: "Solicitar acceso",
    ctaHref: "/registro",
    ctaStyle: "bg-[#D4A338] hover:bg-[#B8892C] text-white",
    items: [
      { texto: "Perfil de viaje familiar",          ok: true },
      { texto: "Riesgos generales del destino",     ok: true },
      { texto: "Checklist básico (vacunas + docs)", ok: true },
      { texto: "Checklist detallado adulto/niño",   ok: true },
      { texto: "Botiquín por destino + pediátrico", ok: true },
      { texto: "Evaluador de síntomas clínico",     ok: true },
      { texto: "Teleorientación médica",            ok: true },
    ],
  },
]

const MARQUEE_ITEMS = [
  "CDC Yellow Book 2026", "Dengue", "Malaria", "Diarrea del viajero",
  "Vacunas", "Botiquín familiar", "Repelentes", "Agua segura",
  "Altitud", "Enfermedades tropicales", "Checklist personalizado",
]

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: '#F7FFFE' }}>

      {/* ── NAVBAR ────────────────────────────────────────────────────────────── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          background: 'rgba(10,34,56,0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Image src="/logo.png" alt="SARIQAMA" width={120} height={36}
            className="h-8 w-auto object-contain brightness-0 invert opacity-90" />
          <div className="hidden sm:flex items-center gap-7 text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>
            <a href="#features" className="hover:text-white transition-colors font-medium">Features</a>
            <a href="#planes" className="hover:text-white transition-colors font-medium">Planes</a>
            <a href="#destinos" className="hover:text-white transition-colors font-medium">Destinos</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm"
                className="font-medium text-sm"
                style={{ color: 'rgba(255,255,255,0.5)' }}>
                Iniciar sesión
              </Button>
            </Link>
            <Link href="/registro">
              <Button size="sm"
                className="bg-[#2D9E8C] hover:bg-[#237F70] text-white rounded-xl font-semibold px-5 text-sm"
                style={{ boxShadow: '0 4px 14px rgba(45,158,140,0.35)' }}>
                Empezar gratis
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ──────────────────────────────────────────────────────────────── */}
      <section
        className="relative min-h-screen flex flex-col"
        style={{ background: 'linear-gradient(160deg, #07192A 0%, #0F2D45 40%, #1A3D5C 100%)' }}
      >
        {/* Gradient blobs */}
        <div className="absolute top-0 right-0 w-[700px] h-[700px] pointer-events-none"
          style={{ background: 'radial-gradient(circle at 70% 30%, rgba(45,158,140,0.18), transparent 65%)' }} />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] pointer-events-none"
          style={{ background: 'radial-gradient(circle at 30% 70%, rgba(212,163,56,0.10), transparent 65%)' }} />
        {/* Dot grid */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '36px 36px',
        }} />

        {/* Content */}
        <div className="relative z-10 flex-1 max-w-6xl mx-auto px-6 w-full flex flex-col justify-center pt-36 pb-20">
          <div className="grid lg:grid-cols-[1fr_420px] gap-16 items-center">

            {/* Left */}
            <div>
              <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-widest"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.10)',
                  color: 'rgba(255,255,255,0.55)',
                }}>
                <span className="w-1.5 h-1.5 rounded-full bg-[#2D9E8C] animate-pulse" />
                Family Travel Health · CDC 2026
              </div>

              <h1
                className="font-semibold text-white leading-[1.0] tracking-tight mb-6"
                style={{
                  fontFamily: "var(--font-fraunces)",
                  fontSize: 'clamp(3rem, 7vw, 5.5rem)',
                }}
              >
                La salud<br />
                de tu familia<br />
                <span style={{ color: '#2D9E8C' }}>no improvisa.</span>
              </h1>

              <p className="text-lg leading-relaxed mb-10 max-w-md"
                style={{ color: 'rgba(255,255,255,0.50)' }}>
                Checklists, riesgos y botiquín adaptados a tu destino,
                tus fechas y cada miembro de tu familia. Basado en CDC 2026.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/registro">
                  <Button size="lg"
                    className="bg-[#2D9E8C] hover:bg-[#237F70] text-white font-bold px-8 h-14 rounded-2xl text-base w-full sm:w-auto transition-all duration-200 hover:-translate-y-0.5"
                    style={{ boxShadow: '0 8px 32px rgba(45,158,140,0.35)' }}>
                    Crear mi viaje gratis
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="ghost"
                    className="rounded-2xl text-sm w-full sm:w-auto h-14 px-6 font-medium"
                    style={{
                      color: 'rgba(255,255,255,0.50)',
                      border: '1px solid rgba(255,255,255,0.10)',
                    }}>
                    Ya tengo cuenta
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right — mini bento preview */}
            <div className="hidden lg:flex flex-col gap-3">
              {/* Risk card */}
              <div className="rounded-2xl p-5"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.09)',
                  backdropFilter: 'blur(12px)',
                }}>
                <p className="text-[10px] font-bold text-[#2D9E8C] uppercase tracking-widest mb-3">
                  Perfil de riesgo · Brasil
                </p>
                <div className="flex flex-wrap gap-2">
                  {['🦟 Dengue alto', '💉 Vacuna Hep A', '💧 Agua filtrada', '🏥 Seguro viaje'].map(t => (
                    <span key={t}
                      className="text-xs px-3 py-1.5 rounded-full font-medium"
                      style={{
                        background: 'rgba(255,255,255,0.07)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        color: 'rgba(255,255,255,0.65)',
                      }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl p-5"
                  style={{ background: 'rgba(45,158,140,0.12)', border: '1px solid rgba(45,158,140,0.22)' }}>
                  <div className="text-4xl font-bold text-white mb-1" style={{ fontFamily: "var(--font-fraunces)" }}>5</div>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.40)' }}>destinos LATAM</p>
                </div>
                <div className="rounded-2xl p-5"
                  style={{ background: 'rgba(212,163,56,0.10)', border: '1px solid rgba(212,163,56,0.20)' }}>
                  <Shield className="h-5 w-5 text-[#D4A338] mb-3" />
                  <p className="text-xs font-bold text-[#D4A338]">CDC</p>
                  <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.30)' }}>Yellow Book 2026</p>
                </div>
              </div>

              {/* Checklist preview */}
              <div className="rounded-2xl p-5"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.09)',
                }}>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-3"
                  style={{ color: 'rgba(255,255,255,0.30)' }}>
                  Tu checklist familiar
                </p>
                <div className="space-y-2.5">
                  {[
                    { t: 'Vacuna Hepatitis A', done: true },
                    { t: 'Repelente DEET 30%', done: true },
                    { t: 'Antiparasitario pediátrico', done: false },
                  ].map(item => (
                    <div key={item.t} className="flex items-center gap-2.5">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${item.done ? 'bg-[#2D9E8C]' : ''}`}
                        style={item.done ? {} : { border: '1px solid rgba(255,255,255,0.20)' }}>
                        {item.done && <Check className="h-2.5 w-2.5 text-white" />}
                      </div>
                      <span className="text-xs"
                        style={{ color: item.done ? 'rgba(255,255,255,0.40)' : 'rgba(255,255,255,0.75)' }}>
                        {item.t}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Marquee strip */}
        <div className="relative z-10 overflow-hidden"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.03)' }}>
          <div className="flex animate-marquee whitespace-nowrap py-3">
            {[0, 1].map(rep => (
              <span key={rep} className="flex items-center flex-shrink-0">
                {MARQUEE_ITEMS.map(t => (
                  <span key={`${rep}-${t}`} className="flex items-center gap-4 px-4">
                    <span className="text-[11px] font-semibold uppercase tracking-widest"
                      style={{ color: 'rgba(255,255,255,0.25)' }}>
                      {t}
                    </span>
                    <span className="w-1 h-1 rounded-full flex-shrink-0"
                      style={{ background: 'rgba(255,255,255,0.12)' }} />
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── BENTO GRID ────────────────────────────────────────────────────────── */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">

          <div className="mb-16">
            <p className="text-[#2D9E8C] text-xs font-bold uppercase tracking-widest mb-4">Todo en un lugar</p>
            <h2 className="font-semibold text-[#1A3D5C] leading-tight"
              style={{ fontFamily: "var(--font-fraunces)", fontSize: 'clamp(2.2rem, 5vw, 3.5rem)' }}>
              Prepara el viaje.<br />No improvises la salud.
            </h2>
          </div>

          {/* Bento grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

            {/* Card 1: Destinos — col-span-2 */}
            <div className="lg:col-span-2 rounded-3xl p-8 relative overflow-hidden min-h-[260px] flex flex-col justify-between"
              style={{
                background: 'linear-gradient(135deg, #1A3D5C 0%, #2D9E8C 100%)',
                boxShadow: 'var(--shadow-lg)',
              }}>
              <div className="absolute inset-0 pointer-events-none" style={{
                backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)',
                backgroundSize: '22px 22px',
              }} />
              <div className="relative z-10">
                <p className="text-[10px] font-bold uppercase tracking-widest mb-3"
                  style={{ color: 'rgba(255,255,255,0.45)' }}>Cobertura clínica</p>
                <h3 className="text-2xl font-semibold text-white mb-6"
                  style={{ fontFamily: "var(--font-fraunces)" }}>
                  5 destinos LATAM cubiertos
                </h3>
                <div className="flex gap-2.5 flex-wrap">
                  {DESTINOS.map(d => (
                    <div key={d.code}
                      className="flex items-center gap-2 px-3 py-2 rounded-full"
                      style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.15)' }}>
                      <FlagImg code={d.code} size={16} className="rounded-full flex-shrink-0" />
                      <span className="text-xs font-medium text-white">{d.nombre}</span>
                    </div>
                  ))}
                </div>
              </div>
              <p className="relative z-10 text-[10px] mt-6" style={{ color: 'rgba(255,255,255,0.30)' }}>
                Actualizado · CDC Yellow Book 2026
              </p>
            </div>

            {/* Card 2: CDC */}
            <div className="rounded-3xl p-7 flex flex-col justify-between min-h-[260px]"
              style={{ background: '#FBF0D4', boxShadow: 'var(--shadow-sm)' }}>
              <div className="w-12 h-12 rounded-2xl bg-[#D4A338] flex items-center justify-center"
                style={{ boxShadow: '0 4px 14px rgba(212,163,56,0.40)' }}>
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-[#B8892C] uppercase tracking-widest mb-2">Fuente oficial</p>
                <h3 className="text-xl font-semibold text-[#1A3D5C] mb-2"
                  style={{ fontFamily: "var(--font-fraunces)" }}>
                  CDC Yellow Book 2026
                </h3>
                <p className="text-sm text-[#B8892C] leading-relaxed">
                  Única plataforma en LATAM con datos clínicos validados en español.
                </p>
              </div>
            </div>

            {/* Card 3: Checklist */}
            <div className="rounded-3xl p-7 flex flex-col min-h-[280px]"
              style={{ background: '#1A3D5C', boxShadow: 'var(--shadow-md)' }}>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-5"
                style={{ color: 'rgba(255,255,255,0.35)' }}>Checklist familiar</p>
              <div className="space-y-3 flex-1">
                {[
                  { t: 'Vacuna Hepatitis A', done: true  },
                  { t: 'Repelente DEET 30%', done: true  },
                  { t: 'Antiparasitario pediátrico', done: true  },
                  { t: 'Ropa manga larga', done: false },
                  { t: 'Seguro médico viaje', done: false },
                ].map(item => (
                  <div key={item.t} className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${item.done ? 'bg-[#2D9E8C]' : ''}`}
                      style={item.done ? {} : { border: '1px solid rgba(255,255,255,0.18)' }}>
                      {item.done && <Check className="h-3 w-3 text-white" />}
                    </div>
                    <span className="text-sm"
                      style={{ color: item.done ? 'rgba(255,255,255,0.40)' : 'rgba(255,255,255,0.80)',
                                textDecoration: item.done ? 'line-through' : 'none' }}>
                      {item.t}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-[11px] mt-4" style={{ color: 'rgba(255,255,255,0.20)' }}>
                Personalizado por familia, destino y edad
              </p>
            </div>

            {/* Card 4: Síntomas */}
            <div className="rounded-3xl p-7 flex flex-col justify-between min-h-[280px]"
              style={{
                background: 'linear-gradient(160deg, #0F2D45 0%, #1A3D5C 100%)',
                boxShadow: 'var(--shadow-md)',
              }}>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#2D9E8C] mb-4">
                  Evaluador de síntomas
                </p>
                <div className="space-y-2.5 mb-4">
                  {[
                    { s: 'Fiebre alta',     nivel: 'Alerta',    color: '#EF4444' },
                    { s: 'Dolor muscular',  nivel: 'Vigilar',   color: '#F59E0B' },
                    { s: 'Náuseas',         nivel: 'Monitorear',color: '#EAB308' },
                  ].map(s => (
                    <div key={s.s}
                      className="flex items-center justify-between px-3 py-2.5 rounded-xl"
                      style={{ background: 'rgba(255,255,255,0.05)' }}>
                      <div className="flex items-center gap-2.5">
                        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: s.color }} />
                        <span className="text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>{s.s}</span>
                      </div>
                      <span className="text-[10px] font-bold"
                        style={{ color: 'rgba(255,255,255,0.35)' }}>{s.nivel}</span>
                    </div>
                  ))}
                </div>
              </div>
              <h3 className="text-base font-semibold text-white" style={{ fontFamily: "var(--font-fraunces)" }}>
                ¿Síntomas en el viaje?{" "}
                <span style={{ color: '#2D9E8C' }}>Sabrás exactamente qué hacer.</span>
              </h3>
            </div>

            {/* Card 5: 24/7 */}
            <div className="rounded-3xl p-7 flex flex-col justify-between min-h-[160px] bg-white hover-lift"
              style={{ boxShadow: 'var(--shadow-sm)' }}>
              <Clock className="h-6 w-6 text-[#2D9E8C]" />
              <div>
                <div className="text-5xl font-bold text-[#1A3D5C] mb-1"
                  style={{ fontFamily: "var(--font-fraunces)" }}>24/7</div>
                <p className="text-sm text-slate-400">Orientación médica disponible</p>
              </div>
            </div>

            {/* Card 6: Viajeros */}
            <div className="rounded-3xl p-7 flex flex-col justify-between min-h-[160px] bg-white hover-lift"
              style={{ boxShadow: 'var(--shadow-sm)' }}>
              <Users className="h-6 w-6 text-[#D4A338]" />
              <div>
                <div className="text-5xl font-bold text-[#1A3D5C] mb-1"
                  style={{ fontFamily: "var(--font-fraunces)" }}>∞</div>
                <p className="text-sm text-slate-400">Viajeros por familia</p>
              </div>
            </div>

            {/* Card 7: CTA */}
            <div className="rounded-3xl p-7 flex flex-col justify-between min-h-[160px]"
              style={{
                background: 'linear-gradient(135deg, #2D9E8C 0%, #1A7A6B 100%)',
                boxShadow: 'var(--shadow-md)',
              }}>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-2"
                  style={{ color: 'rgba(255,255,255,0.55)' }}>Empieza hoy</p>
                <h3 className="text-xl font-semibold text-white"
                  style={{ fontFamily: "var(--font-fraunces)" }}>
                  Gratis.<br />Sin tarjeta.
                </h3>
              </div>
              <Link href="/registro">
                <div className="flex items-center gap-2 bg-white text-[#1A7A6B] font-bold text-sm px-4 py-2.5 rounded-xl w-fit hover-lift cursor-pointer">
                  Crear cuenta <ArrowRight className="h-4 w-4" />
                </div>
              </Link>
            </div>

            {/* Card 8: Testimonial — col-span-2 */}
            <div className="lg:col-span-2 rounded-3xl p-8 relative overflow-hidden"
              style={{ background: '#0F2D45', boxShadow: 'var(--shadow-lg)' }}>
              <div className="text-[#D4A338] text-7xl font-serif leading-none mb-3"
                style={{ opacity: 0.30 }}>&ldquo;</div>
              <p className="text-xl text-white leading-relaxed mb-6 max-w-2xl"
                style={{ fontFamily: "var(--font-fraunces)", opacity: 0.80 }}>
                Antes de viajar a Brasil con mis hijos no sabía nada sobre el dengue.
                SARIQAMA me explicó todo de forma clara y me dio la lista exacta de lo que necesitaba llevar.
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#2D9E8C] flex items-center justify-center font-bold text-white text-sm">
                  V
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Valentina R.</p>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>Viajó a Brasil · 2 hijos</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── CÓMO FUNCIONA ─────────────────────────────────────────────────────── */}
      <section id="como-funciona" className="py-24 px-6"
        style={{ background: '#0A2238' }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-20 items-start">

            {/* Sticky left */}
            <div className="lg:sticky lg:top-28 lg:w-72 flex-shrink-0">
              <p className="text-[#2D9E8C] text-xs font-bold uppercase tracking-widest mb-4">Proceso</p>
              <h2 className="font-semibold text-white mb-5 leading-tight"
                style={{ fontFamily: "var(--font-fraunces)", fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
                Tres pasos.<br />Un viaje<br />seguro.
              </h2>
              <p className="text-sm leading-relaxed mb-8"
                style={{ color: 'rgba(255,255,255,0.35)' }}>
                De cero a completamente preparado en menos de 5 minutos.
              </p>
              <Link href="/registro">
                <div className="inline-flex items-center gap-2 bg-[#2D9E8C] hover:bg-[#237F70] text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors cursor-pointer">
                  Empezar gratis <ArrowRight className="h-4 w-4" />
                </div>
              </Link>
            </div>

            {/* Steps */}
            <div className="flex-1">
              {[
                {
                  num: '01', emoji: '✈️', color: '#2D9E8C',
                  titulo: 'Crea tu viaje',
                  desc: 'Selecciona destino, fechas y agrega a cada miembro de tu familia. SARIQAMA construye el perfil sanitario personalizado.',
                },
                {
                  num: '02', emoji: '🗺️', color: '#D4A338',
                  titulo: 'Conoce los riesgos',
                  desc: 'Dengue, malaria, agua, vacunas — información CDC 2026 filtrada para tu destino específico, no genérica.',
                },
                {
                  num: '03', emoji: '✅', color: '#C27058',
                  titulo: 'Viaja protegido',
                  desc: 'Checklist personalizado, botiquín curado por destino y edad, y evaluador de síntomas si algo ocurre en el viaje.',
                },
              ].map((paso, i) => (
                <div key={paso.num} className={`flex gap-6 relative ${i < 2 ? 'pb-12' : ''}`}>
                  {/* Connector line */}
                  {i < 2 && (
                    <div className="absolute left-7 top-16 bottom-0 w-px"
                      style={{ background: 'rgba(255,255,255,0.07)' }} />
                  )}
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
                      style={{
                        background: `${paso.color}18`,
                        border: `1px solid ${paso.color}30`,
                      }}>
                      {paso.emoji}
                    </div>
                  </div>
                  <div className="pt-1">
                    <p className="text-xs font-bold tracking-widest mb-2"
                      style={{ color: 'rgba(255,255,255,0.20)' }}>{paso.num}</p>
                    <h3 className="text-xl font-semibold text-white mb-2"
                      style={{ fontFamily: "var(--font-fraunces)" }}>{paso.titulo}</h3>
                    <p className="text-sm leading-relaxed max-w-sm"
                      style={{ color: 'rgba(255,255,255,0.40)' }}>{paso.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── DESTINOS ──────────────────────────────────────────────────────────── */}
      <section id="destinos" className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
            <div>
              <p className="text-[#2D9E8C] text-xs font-bold uppercase tracking-widest mb-3">Cobertura</p>
              <h2 className="font-semibold text-[#1A3D5C]"
                style={{ fontFamily: "var(--font-fraunces)", fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
                Destinos cubiertos
              </h2>
            </div>
            <p className="text-sm text-slate-400">CDC Yellow Book 2026</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {DESTINOS.map(d => (
              <div key={d.nombre}
                className="rounded-2xl p-5 text-center bg-white hover-lift"
                style={{ boxShadow: 'var(--shadow-sm)' }}>
                <div className="flex justify-center mb-3">
                  <FlagImg code={d.code} size={52} className="rounded-xl shadow-sm" />
                </div>
                <p className="font-semibold text-[#1A3D5C] text-sm mb-1">{d.nombre}</p>
                <p className="text-[11px] text-slate-400 leading-tight">{d.riesgo}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PLANES ────────────────────────────────────────────────────────────── */}
      <section id="planes" className="py-24 px-6" style={{ background: '#F7FFFE' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[#2D9E8C] text-xs font-bold uppercase tracking-widest mb-4">Precios transparentes</p>
            <h2 className="font-semibold text-[#1A3D5C] mb-4"
              style={{ fontFamily: "var(--font-fraunces)", fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
              Elige tu nivel de protección
            </h2>
            <p className="text-slate-400 text-sm max-w-md mx-auto">
              Empieza gratis. Escala según lo que tu familia necesita.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {PLANES.map(plan => (
              <div key={plan.id}
                className={`rounded-3xl overflow-hidden flex flex-col ${plan.featured ? 'ring-2 ring-[#2D9E8C]' : ''}`}
                style={{ boxShadow: plan.featured ? 'var(--shadow-xl)' : 'var(--shadow-sm)' }}>
                {/* Header */}
                <div className={`px-6 py-7 ${plan.featured
                  ? 'bg-gradient-to-br from-[#1A3D5C] to-[#1F4D72]'
                  : 'bg-white border-b border-slate-100'}`}>
                  {plan.featured && (
                    <span className="inline-block text-[10px] font-bold text-[#2D9E8C] bg-[#2D9E8C]/15 px-2.5 py-1 rounded-full uppercase tracking-widest mb-3">
                      Más popular
                    </span>
                  )}
                  <p className={`text-xs font-bold uppercase tracking-widest mb-2 ${plan.featured ? 'text-white/40' : 'text-slate-400'}`}>
                    {plan.nombre}
                  </p>
                  <div className={`text-4xl font-bold mb-1 ${plan.featured ? 'text-white' : 'text-[#1A3D5C]'}`}
                    style={{ fontFamily: "var(--font-fraunces)" }}>
                    {plan.precio}
                  </div>
                  <p className={`text-xs ${plan.featured ? 'text-white/35' : 'text-slate-400'}`}>{plan.precioSub}</p>
                </div>
                {/* Items */}
                <div className="bg-white px-6 py-5 flex-1">
                  <ul className="space-y-3">
                    {plan.items.map(item => (
                      <li key={item.texto} className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${item.ok ? 'bg-[#E0F5F2]' : 'bg-slate-100'}`}>
                          {item.ok
                            ? <Check className="h-3 w-3 text-[#2D9E8C]" />
                            : <span className="w-2 h-px bg-slate-300 block rounded" />}
                        </div>
                        <span className={`text-sm ${item.ok ? 'text-slate-700' : 'text-slate-400'}`}>
                          {item.texto}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                {/* CTA */}
                <div className="bg-white px-6 pb-6">
                  <Link href={plan.ctaHref} className="block">
                    <Button className={`w-full rounded-xl font-semibold h-11 ${plan.ctaStyle}`}
                      style={{ boxShadow: plan.featured ? 'var(--shadow-md)' : 'none' }}>
                      {plan.cta}
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-xs text-slate-400 mt-8">
            🧪 Programa piloto —{" "}
            <a href="mailto:contacto@sariqama.com" className="text-[#2D9E8C] hover:underline font-medium">
              contacto@sariqama.com
            </a>
          </p>
        </div>
      </section>

      {/* ── CTA FINAL ─────────────────────────────────────────────────────────── */}
      <section className="py-32 px-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #1A3D5C 0%, #07192A 100%)' }}>
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }} />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] pointer-events-none"
          style={{ background: 'radial-gradient(circle at 70% 30%, rgba(45,158,140,0.15), transparent 65%)' }} />

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-widest mb-8"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.10)',
              color: 'rgba(255,255,255,0.45)',
            }}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#2D9E8C] animate-pulse" />
            Gratis para empezar
          </div>
          <h2 className="font-semibold text-white mb-6 leading-tight"
            style={{ fontFamily: "var(--font-fraunces)", fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}>
            ¿Cuándo sale<br />tu próximo viaje?
          </h2>
          <p className="text-lg mb-10 max-w-md mx-auto"
            style={{ color: 'rgba(255,255,255,0.40)' }}>
            Crea el perfil de tu familia en minutos y obtén tu primer reporte sanitario completo.
          </p>
          <Link href="/registro">
            <Button size="lg"
              className="bg-[#2D9E8C] hover:bg-[#237F70] text-white font-bold px-12 h-14 rounded-2xl text-base transition-all duration-200 hover:-translate-y-0.5"
              style={{ boxShadow: '0 8px 32px rgba(45,158,140,0.40)' }}>
              Empezar gratis
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <p className="text-xs mt-5" style={{ color: 'rgba(255,255,255,0.20)' }}>
            Sin tarjeta de crédito · Sin suscripción
          </p>
        </div>
      </section>

      {/* ── DISCLAIMER ────────────────────────────────────────────────────────── */}
      <div className="py-5 px-6 border-t border-slate-100" style={{ background: '#F7FFFE' }}>
        <p className="text-center text-[11px] text-slate-400 max-w-2xl mx-auto leading-relaxed">
          <strong className="text-slate-500">Aviso:</strong>{" "}
          SARIQAMA entrega orientación sanitaria basada en CDC Yellow Book 2026.
          No reemplaza evaluación médica profesional.
        </p>
      </div>

      {/* ── FOOTER ────────────────────────────────────────────────────────────── */}
      <footer className="px-6 pt-14 pb-8" style={{ background: '#07192A' }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-10 mb-12">
            <div className="sm:col-span-2">
              <Image src="/logo.png" alt="SARIQAMA" width={130} height={40}
                className="h-9 w-auto object-contain mb-4 brightness-0 invert opacity-80" />
              <p className="text-sm leading-relaxed max-w-xs" style={{ color: '#A8C5DA' }}>
                Salud del viajero para familias latinoamericanas.
                Información clínica validada, en español.
              </p>
              <div className="mt-5 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#2D9E8C] animate-pulse" />
                <span className="text-[11px] text-[#2D9E8C] font-semibold">Piloto activo · Acceso gratuito</span>
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-4"
                style={{ color: 'rgba(255,255,255,0.25)' }}>App</p>
              <div className="flex flex-col gap-2.5">
                {[
                  { href: '#features', label: 'Features' },
                  { href: '#planes',   label: 'Planes'   },
                  { href: '/login',    label: 'Iniciar sesión' },
                  { href: '/registro', label: 'Registrarse'    },
                ].map(l => (
                  <a key={l.label} href={l.href}
                    className="text-sm transition-colors hover:text-white"
                    style={{ color: '#A8C5DA' }}>
                    {l.label}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-4"
                style={{ color: 'rgba(255,255,255,0.25)' }}>Contacto</p>
              <div className="flex flex-col gap-2.5">
                <a href="mailto:contacto@sariqama.com"
                  className="text-sm transition-colors hover:text-white"
                  style={{ color: '#A8C5DA' }}>
                  contacto@sariqama.com
                </a>
                <Link href="/terminos"
                  className="text-sm transition-colors hover:text-white"
                  style={{ color: '#A8C5DA' }}>
                  Términos y condiciones
                </Link>
                <Link href="/terminos"
                  className="text-sm transition-colors hover:text-white"
                  style={{ color: '#A8C5DA' }}>
                  Privacidad
                </Link>
              </div>
            </div>
          </div>
          <div className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-2"
            style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.20)' }}>
              © 2026 SARIQAMA · Orientación sanitaria, no diagnóstico médico.
            </p>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.15)' }}>Hecho en Chile 🇨🇱</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
