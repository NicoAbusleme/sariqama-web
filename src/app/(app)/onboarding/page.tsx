'use client'

import { useState } from 'react'
import { Leaf, Plus, Trash2, Loader2, ChevronRight, Users, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import { agregarViajeros } from '@/app/actions/familia'

const CONDICIONES = [
  { id: 'alergia', label: 'Alergias' },
  { id: 'asma', label: 'Asma' },
  { id: 'diabetes', label: 'Diabetes' },
  { id: 'cardiopatia', label: 'Cardiopatía' },
  { id: 'inmunosupresion', label: 'Inmunosupresión' },
  { id: 'embarazo', label: 'Embarazo' },
]

interface Viajero {
  nombre: string
  edad: string
  condiciones: string[]
}

const viajeroVacio = (): Viajero => ({ nombre: '', edad: '', condiciones: [] })

export default function OnboardingPage() {
  const [paso, setPaso] = useState(1)
  const [viajeros, setViajeros] = useState<Viajero[]>([viajeroVacio()])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const totalPasos = 2
  const progreso = (paso / totalPasos) * 100

  function agregarIntegrante() {
    setViajeros([...viajeros, viajeroVacio()])
  }

  function eliminarIntegrante(i: number) {
    if (viajeros.length === 1) return
    setViajeros(viajeros.filter((_, idx) => idx !== i))
  }

  function actualizarViajero(i: number, campo: keyof Viajero, valor: string) {
    const nuevos = [...viajeros]
    if (campo !== 'condiciones') nuevos[i][campo] = valor
    setViajeros(nuevos)
  }

  function toggleCondicion(i: number, condicion: string) {
    const nuevos = [...viajeros]
    const conds = nuevos[i].condiciones
    nuevos[i].condiciones = conds.includes(condicion)
      ? conds.filter(c => c !== condicion)
      : [...conds, condicion]
    setViajeros(nuevos)
  }

  function validarPaso1() {
    return viajeros.every(v => v.nombre.trim() && v.edad.trim() && parseInt(v.edad) >= 0)
  }

  async function finalizar() {
    setLoading(true)
    setError(null)

    const datos = viajeros.map(v => ({
      nombre: v.nombre.trim(),
      edad: parseInt(v.edad),
      condiciones: v.condiciones,
    }))

    const result = await agregarViajeros(datos)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg">

        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <Leaf className="h-6 w-6 text-teal-600" />
          <span className="font-bold text-xl text-slate-900">SARIQAMA</span>
        </div>

        {/* Progreso */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-slate-400 mb-2">
            <span>Paso {paso} de {totalPasos}</span>
            <span>{Math.round(progreso)}%</span>
          </div>
          <Progress value={progreso} className="h-2" />
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">

          {/* PASO 1 — Integrantes de la familia */}
          {paso === 1 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-teal-50 rounded-xl">
                  <Users className="h-5 w-5 text-teal-600" />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900 text-lg">¿Quiénes viajan?</h2>
                  <p className="text-sm text-slate-500">Agrega a cada integrante de tu familia</p>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                {viajeros.map((v, i) => (
                  <div key={i} className="border border-slate-100 rounded-xl p-4 bg-slate-50">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-slate-600">
                        Integrante {i + 1}
                      </span>
                      {viajeros.length > 1 && (
                        <button
                          onClick={() => eliminarIntegrante(i)}
                          className="text-red-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="col-span-2 sm:col-span-1">
                        <label className="text-xs font-medium text-slate-600 mb-1 block">
                          Nombre
                        </label>
                        <Input
                          value={v.nombre}
                          onChange={e => actualizarViajero(i, 'nombre', e.target.value)}
                          placeholder="María"
                          className="h-10 bg-white"
                        />
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <label className="text-xs font-medium text-slate-600 mb-1 block">
                          Edad (años)
                        </label>
                        <Input
                          value={v.edad}
                          onChange={e => actualizarViajero(i, 'edad', e.target.value)}
                          type="number"
                          min="0"
                          max="120"
                          placeholder="35"
                          className="h-10 bg-white"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={agregarIntegrante}
                className="mt-3 flex items-center gap-2 text-sm text-teal-600 hover:text-teal-700 font-medium transition-colors"
              >
                <Plus className="h-4 w-4" />
                Agregar otro integrante
              </button>
            </div>
          )}

          {/* PASO 2 — Condiciones médicas */}
          {paso === 2 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-teal-50 rounded-xl">
                  <Heart className="h-5 w-5 text-teal-600" />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900 text-lg">Condiciones de salud</h2>
                  <p className="text-sm text-slate-500">Opcional — nos ayuda a personalizar las recomendaciones</p>
                </div>
              </div>

              <div className="flex flex-col gap-6">
                {viajeros.map((v, i) => (
                  <div key={i}>
                    <p className="text-sm font-semibold text-slate-700 mb-3">
                      {v.nombre} ({v.edad} años)
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {CONDICIONES.map(c => (
                        <label
                          key={c.id}
                          className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-100 hover:border-teal-200 hover:bg-teal-50 cursor-pointer transition-all"
                        >
                          <Checkbox
                            checked={v.condiciones.includes(c.id)}
                            onCheckedChange={() => toggleCondicion(i, c.id)}
                          />
                          <span className="text-sm text-slate-700">{c.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                  {error}
                </div>
              )}
            </div>
          )}

          {/* Botones de navegación */}
          <div className="flex gap-3 mt-8">
            {paso > 1 && (
              <Button
                variant="outline"
                onClick={() => setPaso(paso - 1)}
                className="flex-1 h-11"
                disabled={loading}
              >
                Atrás
              </Button>
            )}
            {paso < totalPasos ? (
              <Button
                onClick={() => setPaso(paso + 1)}
                disabled={!validarPaso1()}
                className="flex-1 h-11 bg-teal-600 hover:bg-teal-700 text-white"
              >
                Continuar
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={finalizar}
                disabled={loading}
                className="flex-1 h-11 bg-teal-600 hover:bg-teal-700 text-white"
              >
                {loading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Guardando...</>
                ) : (
                  '¡Listo, empezar!'
                )}
              </Button>
            )}
          </div>
        </div>

        <p className="text-xs text-slate-400 text-center mt-6 leading-relaxed">
          Tus datos se guardan de forma segura y solo los usamos para personalizar las recomendaciones sanitarias de tu familia.
        </p>
      </div>
    </div>
  )
}
