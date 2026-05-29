"use client"

import Link from "next/link"
import Image from "next/image"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { registrar } from "@/app/actions/auth"

export default function RegistroPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [aceptaTerminos, setAceptaTerminos] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const formData = new FormData(e.currentTarget)
    const password = formData.get("password") as string
    const confirmar = formData.get("confirmar") as string
    if (password !== confirmar) { setError("Las contraseñas no coinciden"); setLoading(false); return }
    if (password.length < 8) { setError("La contraseña debe tener al menos 8 caracteres"); setLoading(false); return }
    const result = await registrar(formData)
    if (result?.error) { setError(result.error); setLoading(false) }
  }

  return (
    <div className="min-h-screen flex">

      {/* ── Panel visual izquierdo (solo desktop) ───────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #1A3D5C 0%, #0F2D45 50%, #0A2238 100%)' }}>
        {/* Decoraciones */}
        <div className="absolute top-0 left-0 w-96 h-96 opacity-15"
          style={{ background: 'radial-gradient(circle at center, #2D9E8C, transparent 70%)' }} />
        <div className="absolute bottom-32 right-0 w-64 h-64 opacity-10"
          style={{ background: 'radial-gradient(circle at center, #D4A338, transparent 70%)' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 opacity-05"
          style={{ background: 'radial-gradient(circle at center, #C27058, transparent 70%)' }} />
        <div className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }} />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <div>
            <Image src="/logo.png" alt="SARIQAMA" width={150} height={48}
              className="h-12 w-auto object-contain brightness-0 invert opacity-90 mb-16" />
          </div>

          <div>
            <p className="text-[#D4A338] text-xs font-bold uppercase tracking-[0.25em] mb-4 flex items-center gap-3">
              <span className="inline-block w-6 h-px bg-[#D4A338]/50" />
              Únete a SARIQAMA
            </p>
            <h2 className="text-4xl font-semibold text-white mb-4 leading-tight"
              style={{ fontFamily: "var(--font-fraunces)" }}>
              Tu familia merece<br />viajar segura<br />y preparada
            </h2>
            <p className="text-[#A8C5DA] text-sm leading-relaxed max-w-xs">
              Checklists de vacunas, riesgos por destino y orientación médica — todo en un solo lugar.
            </p>

            {/* Beneficios */}
            <div className="mt-10 flex flex-col gap-3">
              {[
                { icon: "✈️", text: "Análisis de riesgos para tu destino exacto" },
                { icon: "💉", text: "Vacunas recomendadas por el CDC para toda la familia" },
                { icon: "👩‍⚕️", text: "Orientación médica de viaje disponible 24/7" },
              ].map((b, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="card-glass w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0">
                    {b.icon}
                  </div>
                  <p className="text-white/75 text-sm leading-snug">{b.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-white/20 text-xs">© 2026 SARIQAMA · Gratis · Sin tarjeta de crédito</p>
          </div>
        </div>
      </div>

      {/* ── Panel formulario derecho ─────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-[#F7FFFE]">
        <div className="w-full max-w-sm">

          {/* Logo mobile */}
          <div className="lg:hidden flex justify-center mb-8">
            <Image src="/logo.png" alt="SARIQAMA" width={140} height={44} className="h-11 w-auto object-contain" />
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-[#1A3D5C]"
              style={{ fontFamily: "var(--font-fraunces)" }}>
              Crea tu cuenta familiar
            </h1>
            <p className="text-sm text-slate-400 mt-1">Gratis · Sin tarjeta de crédito</p>
          </div>

          {error && (
            <div role="alert" className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {[
              { name: "nombreFamilia", label: "Nombre de la familia", type: "text",     placeholder: "Familia García",       autoComplete: "name"             },
              { name: "email",         label: "Correo electrónico",   type: "email",    placeholder: "tu@email.com",         autoComplete: "email"            },
              { name: "password",      label: "Contraseña",           type: "password", placeholder: "Mínimo 8 caracteres",  autoComplete: "new-password"     },
              { name: "confirmar",     label: "Confirmar contraseña", type: "password", placeholder: "Repite la contraseña", autoComplete: "new-password"     },
            ].map(f => (
              <div key={f.name}>
                <label htmlFor={f.name} className="text-xs font-semibold text-slate-500 mb-1.5 block uppercase tracking-wide">
                  {f.label}
                </label>
                <Input id={f.name} name={f.name} type={f.type} placeholder={f.placeholder} autoComplete={f.autoComplete}
                  className="h-12 rounded-xl border-slate-200 bg-white focus:border-[#2D9E8C] focus:ring-[#2D9E8C]/20"
                  style={{ boxShadow: 'var(--shadow-xs)' }}
                  required />
              </div>
            ))}

            {/* Términos */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={aceptaTerminos}
                onChange={e => setAceptaTerminos(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#2D9E8C] accent-[#2D9E8C] flex-shrink-0"
              />
              <span className="text-[11px] text-slate-500 leading-relaxed">
                He leído y acepto los{" "}
                <a href="/terminos" target="_blank" className="text-[#2D9E8C] font-semibold hover:text-[#237F70] transition-colors">
                  Términos y Condiciones
                </a>{" "}
                y el tratamiento de mis datos personales conforme a la Ley N° 19.628.
              </span>
            </label>

            <p className="text-[11px] text-slate-400 leading-relaxed -mt-1">
              SARIQAMA entrega <strong className="text-slate-500">orientación sanitaria</strong> y no reemplaza una evaluación médica profesional.
            </p>

            <Button
              type="submit"
              disabled={loading || !aceptaTerminos}
              className="w-full h-12 bg-[#1A3D5C] hover:bg-[#254E72] text-white rounded-xl font-semibold mt-2 text-sm disabled:opacity-40"
              style={{ boxShadow: 'var(--shadow-md)', transition: 'background-color 200ms, opacity 200ms, transform 200ms' }}
            >
              {loading
                ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creando cuenta...</>
                : "Crear cuenta gratis"}
            </Button>
          </form>

          <p className="text-center text-sm text-slate-400 mt-7">
            ¿Ya tienes cuenta?{" "}
            <Link href="/login" className="text-[#2D9E8C] font-semibold hover:text-[#237F70] transition-colors">
              Iniciar sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
