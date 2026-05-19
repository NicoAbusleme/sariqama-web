'use client'

import { useState } from 'react'
import { Leaf, Plus, Trash2, Loader2, ChevronRight, Users, Heart, AlertTriangle, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import { agregarViajeros } from '@/app/actions/familia'

const CONDICIONES = [
  { id: 'alergia',          label: 'Alergias' },
  { id: 'asma',             label: 'Asma' },
  { id: 'diabetes',         label: 'Diabetes' },
  { id: 'cardiopatia',      label: 'Cardiopatía' },
  { id: 'inmunosupresion',  label: 'Inmunosupresión' },
  { id: 'embarazo',         label: 'Embarazo' },
]

const INMUNOSUPRESION_TIPOS = [
  { id: 'vih',         label: 'VIH/SIDA' },
  { id: 'cancer',      label: 'Cáncer activo' },
  { id: 'trasplante',  label: 'Trasplante de órgano' },
  { id: 'autoinmune',  label: 'Enfermedad autoinmune' },
  { id: 'corticoides', label: 'Corticoides crónicos' },
  { id: 'otro',        label: 'Otra causa' },
]

const VIH_CARGA_VIRAL_OPTS = [
  { id: 'indetectable', label: 'Indetectable' },
  { id: 'detectable',   label: 'Detectable' },
  { id: 'desconocida',  label: 'Desconocida / No sé' },
]

interface Viajero {
  nombre: string
  apellido: string
  edad: string
  condiciones: string[]
  inmunosupresion_tipo: string
  vih_carga_viral: string
  embarazo_fum: string
}

const viajeroVacio = (): Viajero => ({
  nombre: '',
  apellido: '',
  edad: '',
  condiciones: [],
  inmunosupresion_tipo: '',
  vih_carga_viral: '',
  embarazo_fum: '',
})

/** Calcula semanas de embarazo a partir de FUM en una fecha objetivo */
function calcularSemanasEnFecha(fum: string, fechaObjetivo: Date): number | null {
  if (!fum) return null
  const fumDate = new Date(fum)
  if (isNaN(fumDate.getTime())) return null
  const diffMs = fechaObjetivo.getTime() - fumDate.getTime()
  return Math.floor(diffMs / (1000 * 60 * 60 * 24 * 7))
}

/** Preview de semanas al día de hoy (solo referencial, el aviso real se muestra en el viaje) */
function PreviewEmbarazo({ fum }: { fum: string }) {
  const semanas = calcularSemanasEnFecha(fum, new Date())
  if (semanas === null || semanas < 0) return null

  if (semanas >= 36) {
    return (
      <div className="mt-2 flex items-start gap-2 p-2.5 rounded-lg bg-red-50 border border-red-200">
        <XCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-red-700 leading-snug">
          <strong>Semana {semanas} actualmente.</strong> Con ≥36 semanas en la fecha del viaje, muchas aerolíneas no permitirán el embarque. Se recomienda no viajar.
        </p>
      </div>
    )
  }
  if (semanas >= 28) {
    return (
      <div className="mt-2 flex items-start gap-2 p-2.5 rounded-lg bg-amber-50 border border-amber-200">
        <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-700 leading-snug">
          <strong>Semana {semanas} actualmente.</strong> A partir de semana 28 se requiere certificado médico para volar. Consulta con tu médico y la aerolínea.
        </p>
      </div>
    )
  }
  return (
    <p className="mt-1.5 text-xs text-slate-400">Semana {semanas} actualmente · El aviso exacto se mostrará según la fecha de tu viaje.</p>
  )
}

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
    const tenia = conds.includes(condicion)
    nuevos[i].condiciones = tenia
      ? conds.filter(c => c !== condicion)
      : [...conds, condicion]

    // Limpiar sub-campos si se deselecciona
    if (tenia && condicion === 'inmunosupresion') {
      nuevos[i].inmunosupresion_tipo = ''
      nuevos[i].vih_carga_viral = ''
    }
    if (tenia && condicion === 'embarazo') {
      nuevos[i].embarazo_fum = ''
    }
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
      apellido: v.apellido.trim() || undefined,
      edad: parseInt(v.edad),
      condiciones: v.condiciones.length > 0 ? v.condiciones : ['ninguna'],
      inmunosupresion_tipo: v.condiciones.includes('inmunosupresion') ? v.inmunosupresion_tipo || undefined : undefined,
      vih_carga_viral: (v.condiciones.includes('inmunosupresion') && v.inmunosupresion_tipo === 'vih') ? v.vih_carga_viral || undefined : undefined,
      embarazo_fum: v.condiciones.includes('embarazo') ? v.embarazo_fum || undefined : undefined,
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
                          Apellido <span className="text-slate-400 font-normal">(opcional)</span>
                        </label>
                        <Input
                          value={v.apellido}
                          onChange={e => actualizarViajero(i, 'apellido', e.target.value)}
                          placeholder="González"
                          className="h-10 bg-white"
                        />
                      </div>
                      <div className="col-span-2">
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
                  <p className="text-sm text-slate-500">Opcional — personaliza las recomendaciones</p>
                </div>
              </div>

              <div className="flex flex-col gap-7">
                {viajeros.map((v, i) => (
                  <div key={i}>
                    <p className="text-sm font-semibold text-slate-700 mb-3">
                      {v.nombre}{v.apellido ? ` ${v.apellido}` : ''} ({v.edad} años)
                    </p>

                    {/* Checkboxes de condiciones */}
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

                    {/* Sub-sección: Inmunosupresión */}
                    {v.condiciones.includes('inmunosupresion') && (
                      <div className="mt-3 ml-1 pl-3 border-l-2 border-teal-200">
                        <p className="text-xs font-semibold text-slate-600 mb-2">
                          Motivo de inmunosupresión
                        </p>
                        <div className="flex flex-col gap-1.5">
                          {INMUNOSUPRESION_TIPOS.map(t => (
                            <label
                              key={t.id}
                              className={`flex items-center gap-2.5 p-2 rounded-lg border cursor-pointer transition-all text-sm ${
                                v.inmunosupresion_tipo === t.id
                                  ? 'border-teal-400 bg-teal-50 text-teal-800 font-medium'
                                  : 'border-slate-100 hover:border-teal-200 text-slate-700'
                              }`}
                            >
                              <input
                                type="radio"
                                name={`inmuno_tipo_${i}`}
                                value={t.id}
                                checked={v.inmunosupresion_tipo === t.id}
                                onChange={() => {
                                  const nuevos = [...viajeros]
                                  nuevos[i].inmunosupresion_tipo = t.id
                                  if (t.id !== 'vih') nuevos[i].vih_carga_viral = ''
                                  setViajeros(nuevos)
                                }}
                                className="accent-teal-600"
                              />
                              {t.label}
                            </label>
                          ))}
                        </div>

                        {/* Sub-sub-sección: VIH carga viral */}
                        {v.inmunosupresion_tipo === 'vih' && (
                          <div className="mt-3 ml-1 pl-3 border-l-2 border-amber-200">
                            <p className="text-xs font-semibold text-slate-600 mb-2">
                              Carga viral actual
                            </p>
                            <div className="flex flex-col gap-1.5">
                              {VIH_CARGA_VIRAL_OPTS.map(o => (
                                <label
                                  key={o.id}
                                  className={`flex items-center gap-2.5 p-2 rounded-lg border cursor-pointer transition-all text-sm ${
                                    v.vih_carga_viral === o.id
                                      ? 'border-amber-400 bg-amber-50 text-amber-800 font-medium'
                                      : 'border-slate-100 hover:border-amber-200 text-slate-700'
                                  }`}
                                >
                                  <input
                                    type="radio"
                                    name={`vih_cv_${i}`}
                                    value={o.id}
                                    checked={v.vih_carga_viral === o.id}
                                    onChange={() => {
                                      const nuevos = [...viajeros]
                                      nuevos[i].vih_carga_viral = o.id
                                      setViajeros(nuevos)
                                    }}
                                    className="accent-amber-600"
                                  />
                                  {o.label}
                                </label>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Sub-sección: Embarazo */}
                    {v.condiciones.includes('embarazo') && (
                      <div className="mt-3 ml-1 pl-3 border-l-2 border-pink-200">
                        <p className="text-xs font-semibold text-slate-600 mb-1">
                          Fecha de última menstruación (FUM)
                        </p>
                        <p className="text-xs text-slate-400 mb-2">
                          Nos permite calcular las semanas de embarazo para la fecha del viaje.
                        </p>
                        <Input
                          type="date"
                          value={v.embarazo_fum}
                          max={new Date().toISOString().split('T')[0]}
                          onChange={e => actualizarViajero(i, 'embarazo_fum', e.target.value)}
                          className="h-10 bg-white"
                        />
                        {v.embarazo_fum && <PreviewEmbarazo fum={v.embarazo_fum} />}
                      </div>
                    )}
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
