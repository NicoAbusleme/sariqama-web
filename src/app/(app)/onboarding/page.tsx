'use client'

import { useState } from 'react'
import { Plus, Trash2, Loader2, ChevronRight, Users, Heart, AlertTriangle, XCircle } from 'lucide-react'
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

const SEXO_OPTS = [
  { id: 'femenino',    label: 'Femenino' },
  { id: 'masculino',   label: 'Masculino' },
  { id: 'intersex',    label: 'Intersex' },
  { id: 'no_indicado', label: 'Prefiero no indicar' },
]

const GENERO_OPTS = [
  { id: 'mujer',           label: 'Mujer' },
  { id: 'hombre',          label: 'Hombre' },
  { id: 'no_binario',      label: 'No binario' },
  { id: 'genero_fluido',   label: 'Género fluido' },
  { id: 'otro',            label: 'Otro' },
  { id: 'no_indicado',     label: 'Prefiero no indicar' },
]

const ALERGIA_TIPOS = [
  { id: 'alimentaria', label: 'Alergias alimentarias' },
  { id: 'rinitis',     label: 'Rinitis alérgica' },
  { id: 'farmacos',    label: 'Alergia a fármacos' },
]

interface Viajero {
  nombre: string
  apellido: string
  edad: string
  sexo: string
  genero: string
  condiciones: string[]
  inmunosupresion_tipo: string
  vih_carga_viral: string
  embarazo_fum: string
  alergia_tipos: string[]
  alergia_huevo: boolean
  alergia_plv: boolean
  alergia_farmacos_cuales: string
}

const viajeroVacio = (): Viajero => ({
  nombre: '',
  apellido: '',
  edad: '',
  sexo: '',
  genero: '',
  condiciones: [],
  inmunosupresion_tipo: '',
  vih_carga_viral: '',
  embarazo_fum: '',
  alergia_tipos: [],
  alergia_huevo: false,
  alergia_plv: false,
  alergia_farmacos_cuales: '',
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
  const [nombreFamilia, setNombreFamilia] = useState('')
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
    if (campo !== 'condiciones') (nuevos[i] as unknown as Record<string, unknown>)[campo] = valor
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
    if (tenia && condicion === 'alergia') {
      nuevos[i].alergia_tipos = []
      nuevos[i].alergia_huevo = false
      nuevos[i].alergia_plv = false
      nuevos[i].alergia_farmacos_cuales = ''
    }
    setViajeros(nuevos)
  }

  function toggleAlergiaTipo(i: number, tipo: string) {
    const nuevos = [...viajeros]
    const tipos = nuevos[i].alergia_tipos
    const tenia = tipos.includes(tipo)
    nuevos[i].alergia_tipos = tenia ? tipos.filter(t => t !== tipo) : [...tipos, tipo]
    // Limpiar sub-campos si se deselecciona el tipo
    if (tenia && tipo === 'alimentaria') {
      nuevos[i].alergia_huevo = false
      nuevos[i].alergia_plv = false
    }
    if (tenia && tipo === 'farmacos') {
      nuevos[i].alergia_farmacos_cuales = ''
    }
    setViajeros(nuevos)
  }

  function validarPaso1() {
    return nombreFamilia.trim().length > 0 &&
      viajeros.every(v => v.nombre.trim() && v.edad.trim() && parseInt(v.edad) >= 0)
  }

  async function finalizar() {
    setLoading(true)
    setError(null)

    const datos = viajeros.map(v => ({
      nombre: v.nombre.trim(),
      apellido: v.apellido.trim() || undefined,
      edad: parseInt(v.edad),
      sexo: v.sexo || undefined,
      genero: v.genero || undefined,
      condiciones: v.condiciones.length > 0 ? v.condiciones : ['ninguna'],
      inmunosupresion_tipo: v.condiciones.includes('inmunosupresion') ? v.inmunosupresion_tipo || undefined : undefined,
      vih_carga_viral: (v.condiciones.includes('inmunosupresion') && v.inmunosupresion_tipo === 'vih') ? v.vih_carga_viral || undefined : undefined,
      embarazo_fum: v.condiciones.includes('embarazo') ? v.embarazo_fum || undefined : undefined,
      alergia_tipos: v.condiciones.includes('alergia') ? v.alergia_tipos : [],
      alergia_huevo: v.condiciones.includes('alergia') && v.alergia_tipos.includes('alimentaria') ? v.alergia_huevo : false,
      alergia_plv: v.condiciones.includes('alergia') && v.alergia_tipos.includes('alimentaria') ? v.alergia_plv : false,
      alergia_farmacos_cuales: v.condiciones.includes('alergia') && v.alergia_tipos.includes('farmacos') ? v.alergia_farmacos_cuales || undefined : undefined,
    }))

    const result = await agregarViajeros(datos, nombreFamilia)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFB] flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg">

        {/* Logo */}
        <div className="flex items-center justify-center mb-8">
          <img src="/logo.png" alt="SARIQAMA" className="h-10 w-auto object-contain" />
        </div>

        {/* Progreso */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-slate-400 mb-2">
            <span>Paso {paso} de {totalPasos}</span>
            <span>{Math.round(progreso)}%</span>
          </div>
          <div className="h-1.5 bg-[#E8EEF4] rounded-full overflow-hidden">
            <div className="h-full bg-[#2D9E8C] rounded-full transition-all duration-300"
              style={{ width: `${progreso}%` }} />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E8EEF4] p-8" style={{ boxShadow: 'var(--shadow-sm)' }}>

          {/* PASO 1 — Integrantes de la familia */}
          {paso === 1 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-[#E8F7F4] rounded-xl">
                  <Users className="h-5 w-5 text-[#2D9E8C]" />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900 text-lg">¿Quiénes viajan?</h2>
                  <p className="text-sm text-slate-500">Agrega a cada integrante de tu familia</p>
                </div>
              </div>

              {/* Nombre de la familia */}
              <div className="mb-5">
                <label className="text-xs font-medium text-slate-600 mb-1 block">
                  Nombre de la familia
                  <span className="text-slate-400 font-normal ml-1">(ej: Familia García)</span>
                </label>
                <Input
                  value={nombreFamilia}
                  onChange={e => setNombreFamilia(e.target.value)}
                  placeholder="Familia García"
                  className="h-10 bg-white"
                />
              </div>

              <div className="flex flex-col gap-4">
                {viajeros.map((v, i) => (
                  <div key={i} className="border border-[#E8EEF4] rounded-xl p-4 bg-[#F8FAFB]">
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

                      {/* Sexo biológico */}
                      <div className="col-span-2">
                        <label className="text-xs font-medium text-slate-600 mb-2 block">
                          Sexo biológico
                          <span className="text-slate-400 font-normal ml-1">(usado para recomendaciones médicas)</span>
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {SEXO_OPTS.map(o => (
                            <button
                              key={o.id}
                              type="button"
                              onClick={() => actualizarViajero(i, 'sexo', v.sexo === o.id ? '' : o.id)}
                              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                                v.sexo === o.id
                                  ? 'bg-[#2D9E8C] text-white border-[#2D9E8C]'
                                  : 'bg-white text-slate-600 border-slate-200 hover:border-[#2D9E8C]/30'
                              }`}
                            >
                              {o.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Identidad de género */}
                      <div className="col-span-2">
                        <label className="text-xs font-medium text-slate-600 mb-2 block">
                          Identidad de género
                          <span className="text-slate-400 font-normal ml-1">(opcional)</span>
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {GENERO_OPTS.map(o => (
                            <button
                              key={o.id}
                              type="button"
                              onClick={() => actualizarViajero(i, 'genero', v.genero === o.id ? '' : o.id)}
                              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                                v.genero === o.id
                                  ? 'bg-violet-600 text-white border-violet-600'
                                  : 'bg-white text-slate-600 border-slate-200 hover:border-violet-300'
                              }`}
                            >
                              {o.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={agregarIntegrante}
                className="mt-3 flex items-center gap-2 text-sm text-[#2D9E8C] hover:text-[#237F70] font-medium transition-colors"
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
                <div className="p-2 bg-[#E8F7F4] rounded-xl">
                  <Heart className="h-5 w-5 text-[#2D9E8C]" />
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
                          className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-100 hover:border-[#2D9E8C]/30 hover:bg-[#E8F7F4] cursor-pointer transition-all"
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
                      <div className="mt-3 ml-1 pl-3 border-l-2 border-[#2D9E8C]/30">
                        <p className="text-xs font-semibold text-slate-600 mb-2">
                          Motivo de inmunosupresión
                        </p>
                        <div className="flex flex-col gap-1.5">
                          {INMUNOSUPRESION_TIPOS.map(t => (
                            <label
                              key={t.id}
                              className={`flex items-center gap-2.5 p-2 rounded-lg border cursor-pointer transition-all text-sm ${
                                v.inmunosupresion_tipo === t.id
                                  ? 'border-[#2D9E8C] bg-[#E8F7F4] text-[#1A3D5C] font-medium'
                                  : 'border-slate-100 hover:border-[#2D9E8C]/30 text-slate-700'
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
                                className="accent-[#2D9E8C]"
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

                    {/* Sub-sección: Alergias */}
                    {v.condiciones.includes('alergia') && (
                      <div className="mt-3 ml-1 pl-3 border-l-2 border-orange-200">
                        <p className="text-xs font-semibold text-slate-600 mb-2">
                          Tipo de alergia
                        </p>
                        <div className="flex flex-col gap-1.5">
                          {ALERGIA_TIPOS.map(t => (
                            <label
                              key={t.id}
                              className={`flex items-center gap-2.5 p-2 rounded-lg border cursor-pointer transition-all text-sm ${
                                v.alergia_tipos.includes(t.id)
                                  ? 'border-orange-400 bg-orange-50 text-orange-800 font-medium'
                                  : 'border-slate-100 hover:border-orange-200 text-slate-700'
                              }`}
                            >
                              <Checkbox
                                checked={v.alergia_tipos.includes(t.id)}
                                onCheckedChange={() => toggleAlergiaTipo(i, t.id)}
                              />
                              {t.label}
                            </label>
                          ))}
                        </div>

                        {/* Sub-sub-sección: Alergias alimentarias */}
                        {v.alergia_tipos.includes('alimentaria') && (
                          <div className="mt-3 ml-1 pl-3 border-l-2 border-amber-200">
                            <p className="text-xs font-semibold text-slate-600 mb-2">
                              Especifica la alergia alimentaria
                            </p>
                            <div className="flex flex-col gap-1.5">
                              <label className="flex items-center gap-2.5 p-2 rounded-lg border border-slate-100 hover:border-amber-200 cursor-pointer text-sm text-slate-700">
                                <Checkbox
                                  checked={v.alergia_huevo}
                                  onCheckedChange={checked => {
                                    const nuevos = [...viajeros]
                                    nuevos[i].alergia_huevo = !!checked
                                    setViajeros(nuevos)
                                  }}
                                />
                                Alergia al huevo
                              </label>
                              <label className="flex items-center gap-2.5 p-2 rounded-lg border border-slate-100 hover:border-amber-200 cursor-pointer text-sm text-slate-700">
                                <Checkbox
                                  checked={v.alergia_plv}
                                  onCheckedChange={checked => {
                                    const nuevos = [...viajeros]
                                    nuevos[i].alergia_plv = !!checked
                                    setViajeros(nuevos)
                                  }}
                                />
                                Alergia a la proteína de leche de vaca (PLV)
                              </label>
                            </div>
                          </div>
                        )}

                        {/* Sub-sub-sección: Alergia a fármacos */}
                        {v.alergia_tipos.includes('farmacos') && (
                          <div className="mt-3 ml-1 pl-3 border-l-2 border-amber-200">
                            <p className="text-xs font-semibold text-slate-600 mb-1">
                              ¿A qué fármaco(s)?
                            </p>
                            <Input
                              value={v.alergia_farmacos_cuales}
                              onChange={e => {
                                const nuevos = [...viajeros]
                                nuevos[i].alergia_farmacos_cuales = e.target.value
                                setViajeros(nuevos)
                              }}
                              placeholder="Ej: penicilina, AINEs, sulfas…"
                              className="h-10 bg-white mt-1"
                            />
                          </div>
                        )}

                        {/* Aviso: consultar con inmunólogo */}
                        <div className="mt-3 flex items-start gap-2 p-2.5 rounded-lg bg-amber-50 border border-amber-200">
                          <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                          <p className="text-xs text-amber-700 leading-snug">
                            En caso de alergias, consulta con tu <strong>inmunólogo o alergólogo</strong> antes de viajar para verificar la compatibilidad con vacunas y medicamentos preventivos.
                          </p>
                        </div>
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
                className="flex-1 h-11 bg-[#2D9E8C] hover:bg-[#237F70] text-white"
              >
                Continuar
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={finalizar}
                disabled={loading}
                className="flex-1 h-11 bg-[#2D9E8C] hover:bg-[#237F70] text-white"
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
