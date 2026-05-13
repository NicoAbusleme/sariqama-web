"use client"

import Link from "next/link"
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
    <div className="min-h-screen bg-gradient-to-br from-teal-600 via-teal-700 to-teal-900 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl text-3xl border border-white/25 mb-4"
            style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)" }}>
            🌴
          </div>
          <h1 className="text-2xl font-semibold text-white"
            style={{ fontFamily: "var(--font-fraunces)" }}>
            SARIQAMA
          </h1>
          <p className="text-white/60 text-xs mt-1 tracking-widest uppercase">Travel Health</p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-xl">
          <h2 className="text-lg font-semibold text-slate-900 mb-1"
            style={{ fontFamily: "var(--font-fraunces)" }}>
            Bienvenido de vuelta
          </h2>
          <p className="text-sm text-slate-500 mb-6">Ingresa a tu cuenta familiar</p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1.5 block uppercase tracking-wide">
                Correo electrónico
              </label>
              <Input name="email" type="email" placeholder="tu@email.com"
                className="h-11 rounded-xl border-slate-200 bg-slate-50" required />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1.5 block uppercase tracking-wide">
                Contraseña
              </label>
              <Input name="password" type="password" placeholder="••••••••"
                className="h-11 rounded-xl border-slate-200 bg-slate-50" required />
            </div>
            <Button type="submit" disabled={loading}
              className="w-full h-12 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl font-semibold mt-2 text-sm">
              {loading
                ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Ingresando...</>
                : "Iniciar sesión"}
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-white/60 mt-6">
          ¿No tienes cuenta?{" "}
          <Link href="/registro" className="text-white font-semibold hover:underline">
            Regístrate gratis
          </Link>
        </p>
      </div>
    </div>
  )
}
