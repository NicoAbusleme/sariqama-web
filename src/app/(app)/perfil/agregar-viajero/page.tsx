'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Loader2 } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { agregarUnViajero } from '@/app/actions/familia'

const CONDICIONES = [
  { id: 'alergia',         label: 'Alergias' },
  { id: 'asma',           label: 'Asma' },
  { id: 'diabetes',       label: 'Diabetes' },
  { id: 'cardiopatia',    label: 'Cardiopatía' },
  { id: 'inmunosupresion', label: 'Inmunosupresión' },
  { id: 'embarazo',       label: 'Embarazo' },
]

export default function AgregarViajeroPage() {
  const router = useRouter()
  const [nombre, setNombre] = useState('')
  const [edad, setEdad] = useState('')
  const [condiciones, setCondiciones] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function toggleCondicion(id: string) {
    setCondiciones(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    )
  }

  const isValid = nombre.trim().length > 0 && edad.trim().length > 0 && parseInt(edad) >= 0

  async function handleGuardar() {
    if (!isValid) return
    setLoading(true)
    setError(null)

    const result = await agregarUnViajero({
      nombre: nombre.trim(),
      edad: parseInt(edad),
      condiciones,
    })

    if (result?.error) {
      setError(result.error)
      setLoading(false)
      return
    }

    // Si no hay error, la server action ya redirigió a /perfil
    // Pero como es client component, forzamos el push por si acaso
    router.push('/perfil')
  }

  return (
    <div className="min-h-screen bg-[#F0FDF9]">
      {/* Header */}
      <header className="bg-gradient-to-br from-teal-600 to-teal-800 px-5 pt-12 pb-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3">
            <Link href="/perfil">
              <span className="w-9 h-9 rounded-xl flex items-center justify-center text-white hover:bg-white/10 transition-colors">
                <ChevronLeft className="h-5 w-5" />
              </span>
            </Link>
            <h1
              className="text-xl font-semibold text-white"
              style={{ fontFamily: 'var(--font-fraunces)' }}
            >
              Agregar integrante
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-5 pt-5 pb-28">
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          {/* Nombre */}
          <div className="mb-5">
            <label className="text-xs font-medium text-slate-600 mb-1.5 block">
              Nombre
            </label>
            <Input
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              placeholder="Ej: María"
              className="h-11 bg-slate-50"
              autoFocus
            />
          </div>

          {/* Edad */}
          <div className="mb-6">
            <label className="text-xs font-medium text-slate-600 mb-1.5 block">
              Edad (años)
            </label>
            <Input
              value={edad}
              onChange={e => setEdad(e.target.value)}
              type="number"
              min="0"
              max="120"
              placeholder="Ej: 35"
              className="h-11 bg-slate-50"
            />
          </div>

          {/* Condiciones */}
          <div>
            <p className="text-xs font-medium text-slate-600 mb-3">
              Condiciones de salud{' '}
              <span className="text-slate-400 font-normal">(opcional)</span>
            </p>
            <div className="grid grid-cols-2 gap-2">
              {CONDICIONES.map(c => (
                <label
                  key={c.id}
                  className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-100 hover:border-teal-200 hover:bg-teal-50 cursor-pointer transition-all"
                >
                  <Checkbox
                    checked={condiciones.includes(c.id)}
                    onCheckedChange={() => toggleCondicion(c.id)}
                  />
                  <span className="text-sm text-slate-700">{c.label}</span>
                </label>
              ))}
            </div>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
              {error}
            </div>
          )}
        </div>
      </main>

      {/* Fixed bottom button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-5 py-4 z-10">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={handleGuardar}
            disabled={!isValid || loading}
            className="w-full h-12 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-2xl flex items-center justify-center gap-2 transition-colors"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              'Guardar'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
