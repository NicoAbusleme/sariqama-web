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
    <div className="min-h-screen bg-gradient-to-br from-[#1A3D5C] via-[#1F4D72] to-[#0A2238] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-2xl px-5 py-3 shadow-lg">
            <Image src="/logo.png" alt="SARIQAMA" width={160} height={56} className="h-14 w-auto object-contain" priority />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-xl">
          <h2 className="text-lg font-semibold text-slate-900 mb-1"
            style={{ fontFamily: "var(--font-fraunces)" }}>
            Crea tu cuenta familiar
          </h2>
          <p className="text-sm text-slate-500 mb-6">Gratis · Sin tarjeta de crédito</p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {[
              { name: "nombreFamilia", label: "Nombre de la familia", type: "text", placeholder: "Familia García" },
              { name: "email",         label: "Correo electrónico",   type: "email", placeholder: "tu@email.com" },
              { name: "password",      label: "Contraseña",           type: "password", placeholder: "Mínimo 8 caracteres" },
              { name: "confirmar",     label: "Confirmar contraseña", type: "password", placeholder: "Repite la contraseña" },
            ].map(f => (
              <div key={f.name}>
                <label className="text-xs font-semibold text-slate-600 mb-1.5 block uppercase tracking-wide">
                  {f.label}
                </label>
                <Input name={f.name} type={f.type} placeholder={f.placeholder}
                  className="h-11 rounded-xl border-slate-200 bg-slate-50" required />
              </div>
            ))}

            {/* Aceptación de Términos y Condiciones */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={aceptaTerminos}
                onChange={e => setAceptaTerminos(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#2D9E8C] accent-[#2D9E8C] flex-shrink-0"
              />
              <span className="text-[11px] text-slate-500 leading-relaxed">
                He leído y acepto los{" "}
                <a href="/terminos" target="_blank" className="text-[#2D9E8C] font-semibold hover:underline">
                  Términos y Condiciones
                </a>{" "}
                y el tratamiento de mis datos personales conforme a la Ley N° 19.628.
              </span>
            </label>

            <p className="text-[11px] text-slate-400 leading-relaxed -mt-1">
              SARIQAMA entrega <strong>orientación sanitaria</strong> y no reemplaza una evaluación médica profesional.
            </p>

            <Button type="submit" disabled={loading || !aceptaTerminos}
              className="w-full h-12 bg-[#2D9E8C] hover:bg-[#237F70] text-white rounded-2xl font-semibold mt-1 text-sm">
              {loading
                ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creando cuenta...</>
                : "Crear cuenta"}
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-white/60 mt-6">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="text-white font-semibold hover:underline">
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  )
}
