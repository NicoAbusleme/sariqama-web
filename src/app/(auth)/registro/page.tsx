'use client'

import Link from "next/link"
import { Leaf, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { registrar } from "@/app/actions/auth"

export default function RegistroPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const password = formData.get('password') as string
    const confirmar = formData.get('confirmar') as string

    if (password !== confirmar) {
      setError('Las contraseñas no coinciden')
      setLoading(false)
      return
    }

    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres')
      setLoading(false)
      return
    }

    const result = await registrar(formData)
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
            Crea tu cuenta familiar
          </h1>
          <p className="text-sm text-slate-500 text-center mb-6">
            Gratis — sin tarjeta de crédito
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">
                Nombre de la familia
              </label>
              <Input
                name="nombreFamilia"
                type="text"
                placeholder="Familia García"
                className="h-11"
                required
              />
            </div>
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
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">
                Contraseña
              </label>
              <Input
                name="password"
                type="password"
                placeholder="Mínimo 8 caracteres"
                className="h-11"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">
                Confirmar contraseña
              </label>
              <Input
                name="confirmar"
                type="password"
                placeholder="Repite la contraseña"
                className="h-11"
                required
              />
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Al registrarte aceptas que SARIQAMA entrega{" "}
              <strong>orientación sanitaria</strong> y no reemplaza una
              evaluación médica profesional.
            </p>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-teal-600 hover:bg-teal-700 text-white mt-2"
            >
              {loading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creando cuenta...</>
              ) : (
                'Crear cuenta'
              )}
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-slate-500 mt-6">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="text-teal-600 hover:underline font-medium">
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  )
}
