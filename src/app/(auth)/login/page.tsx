"use client"

import Link from "next/link"
import Image from "next/image"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { iniciarSesion } from "@/app/actions/auth"

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const formData = new FormData(e.currentTarget)
    const result = await iniciarSesion(formData)
    if (result?.error) { setError(result.error); setLoading(false) }
  }

  return (
    <div className="min-h-screen flex">

      {/* ── Panel visual izquierdo (solo desktop) ───────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #1A3D5C 0%, #0F2D45 50%, #0A2238 100%)' }}>
        {/* Decoraciones */}
        <div className="absolute top-0 right-0 w-80 h-80 opacity-20"
          style={{ background: 'radial-gradient(circle at center, #2D9E8C, transparent 70%)' }} />
        <div className="absolute bottom-20 left-10 w-56 h-56 opacity-10"
          style={{ background: 'radial-gradient(circle at center, #D4A338, transparent 70%)' }} />
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
              Family Travel Health
            </p>
            <h2 className="text-4xl font-semibold text-white mb-4 leading-tight"
              style={{ fontFamily: "var(--font-fraunces)" }}>
              Viaja con la<br />salud de tu<br />familia protegida
            </h2>
            <p className="text-[#A8C5DA] text-sm leading-relaxed max-w-xs">
              Información clínica validada por CDC, adaptada a tu destino y tu familia.
            </p>

            {/* Mini testimonial */}
            <div className="mt-10 card-glass p-5 rounded-2xl max-w-xs">
              <p className="text-white/80 text-sm italic leading-relaxed mb-3">
                &ldquo;SARIQAMA me explicó todo sobre el dengue antes de ir a Brasil con mis hijos.&rdquo;
              </p>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#2D9E8C] flex items-center justify-center">
                  <span className="text-xs font-bold text-white">V</span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">Valentina R.</p>
                  <p className="text-[10px] text-white/50">Viajó a Brasil · 2 hijos</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <p className="text-white/20 text-xs">© 2026 SARIQAMA · Fuente: CDC Yellow Book 2026</p>
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
              Bienvenido de vuelta
            </h1>
            <p className="text-sm text-slate-400 mt-1">Ingresa a tu cuenta familiar</p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1.5 block uppercase tracking-wide">
                Correo electrónico
              </label>
              <Input name="email" type="email" placeholder="tu@email.com"
                className="h-12 rounded-xl border-slate-200 bg-white focus:border-[#2D9E8C] focus:ring-[#2D9E8C]/20"
                style={{ boxShadow: 'var(--shadow-xs)' }}
                required />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1.5 block uppercase tracking-wide">
                Contraseña
              </label>
              <Input name="password" type="password" placeholder="••••••••"
                className="h-12 rounded-xl border-slate-200 bg-white focus:border-[#2D9E8C] focus:ring-[#2D9E8C]/20"
                style={{ boxShadow: 'var(--shadow-xs)' }}
                required />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-[#1A3D5C] hover:bg-[#254E72] text-white rounded-xl font-semibold mt-2 text-sm transition-all duration-200"
              style={{ boxShadow: 'var(--shadow-md)' }}
            >
              {loading
                ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Ingresando...</>
                : "Iniciar sesión"}
            </Button>
          </form>

          <p className="text-center text-sm text-slate-400 mt-7">
            ¿No tienes cuenta?{" "}
            <Link href="/registro" className="text-[#2D9E8C] font-semibold hover:text-[#237F70] transition-colors">
              Regístrate gratis
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
