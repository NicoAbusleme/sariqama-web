'use client'

import Link from "next/link"
import { Leaf, Loader2 } from "lucide-react"
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

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <Leaf className="h-7 w-7 text-teal-600" />
          <span className="font-bold text-2xl text-slate-900">SARIQAMA</span>
        </Link>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
          <h1 className="text-xl font-bold text-slate-900 mb-1 text-center">
            Bienvenido de vuelta
          </h1>
          <p className="text-sm text-slate-500 text-center mb-6">
            Ingresa a tu cuenta familiar
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">
                Correo electrónico
              </label>
              <Input
                name="email"
                type="email"
                placeholder="tu@email.com"
                className="h-11"
                required
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-sm font-medium text-slate-700">
                  Contraseña
                </label>
              </div>
              <Input
                name="password"
                type="password"
                placeholder="••••••••"
                className="h-11"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-teal-600 hover:bg-teal-700 text-white mt-2"
            >
              {loading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Ingresando...</>
              ) : (
                'Iniciar sesión'
              )}
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-slate-500 mt-6">
          ¿No tienes cuenta?{" "}
          <Link href="/registro" className="text-teal-600 hover:underline font-medium">
            Regístrate gratis
          </Link>
        </p>
      </div>
    </div>
  )
}
