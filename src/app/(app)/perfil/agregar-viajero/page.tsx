'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Loader2, AlertTriangle, XCircle } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { agregarUnViajero } from '@/app/actions/familia'

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
  { id: 'mujer',         label: 'Mujer' },
  { id: 'hombre',        label: 'Hombre' },
  { id: 'no_binario',    label: 'No binario' },
  { id: 'genero_fluido', label: 'Género fluido' },
  { id: 'otro',          label: 'Otro' },
  { id: 'no_indicado',   label: 'Prefiero no indicar' },
]

/** Calcula semanas de embarazo a partir de FUM en una fecha objetivo */
function calcularSemanas(fum: string, fecha: Date): number | null {
  if (!fum) return null
  const fumDate = new Date(fum)
  if (isNaN(fumDate.getTime())) return null
  return Math.floor((fecha.getTime() - fumDate.getTime()) / (1000 * 60 * 60 * 24 * 7))
}

function PreviewEmbarazo({ fum }: { fum: string }) {
  const semanas = calcularSemanas(fum, new Date())
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
    <p className="mt-1.5 text-xs text-slate-400">
      Semana {semanas} actualmente · El aviso exacto se mostrará según la fecha de tu viaje.
    </p>
  )
}

export default function AgregarViajeroPage() {
  const router = useRouter()
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [edad, setEdad] = useState('')
  const [sexo, setSexo] = useState('')
  const [genero, setGenero] = useState('')
  const [condiciones, setCondiciones] = useState<string[]>([])
  const [inmunosupresionTipo, setInmunosupresionTipo] = useState('')
  const [vihCargaViral, setVihCargaViral] = useState('')
  const [embarazoFum, setEmbarazoFum] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function toggleCondicion(id: string) {
    setCondiciones(prev => {
      const tenia = prev.includes(id)
      if (tenia) {
        if (id === 'inmunosupresion') { setInmunosupresionTipo(''); setVihCargaViral('') }
        if (id === 'embarazo') setEmbarazoFum('')
        return prev.filter(c => c !== id)
      }
      return [...prev, id]
    })
  }

  const isValid = nombre.trim().length > 0 && edad.trim().length > 0 && parseInt(edad) >= 0

  async function handleGuardar() {
    if (!isValid) return
    setLoading(true)
    setError(null)

    const result = await agregarUnViajero({
      nombre: nombre.trim(),
      apellido: apellido.trim() || undefined,
      edad: parseInt(edad),
      sexo: sexo || undefined,
      genero: genero || undefined,
      condiciones: condiciones.length > 0 ? condiciones : ['ninguna'],
      inmunosupresion_tipo: condiciones.includes('inmunosupresion') ? inmunosupresionTipo || undefined : undefined,
      vih_carga_viral: (condiciones.includes('inmunosupresion') && inmunosupresionTipo === 'vih') ? vihCargaViral || undefined : undefined,
      embarazo_fum: condiciones.includes('embarazo') ? embarazoFum || undefined : undefined,
    })

    if (result?.error) {
      setError(result.error)
      setLoading(false)
      return
    }

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

      <main className="max-w-2xl mx-auto px-5 pt-5 pb-32">
        <div className="bg-white rounded-2xl border border-slate-100 p-6">

          {/* Nombre */}
          <div className="mb-4">
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

          {/* Apellido */}
          <div className="mb-4">
            <label className="text-xs font-medium text-slate-600 mb-1.5 block">
              Apellido <span className="text-slate-400 font-normal">(opcional)</span>
            </label>
            <Input
              value={apellido}
              onChange={e => setApellido(e.target.value)}
              placeholder="Ej: González"
              className="h-11 bg-slate-50"
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

          {/* Sexo biológico */}
          <div className="mb-5">
            <label className="text-xs font-medium text-slate-600 mb-1.5 block">
              Sexo biológico
              <span className="text-slate-400 font-normal ml-1">(usado para recomendaciones médicas)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {SEXO_OPTS.map(o => (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => setSexo(prev => prev === o.id ? '' : o.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    sexo === o.id
                      ? 'bg-teal-600 text-white border-teal-600'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-teal-300'
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>

          {/* Identidad de género */}
          <div className="mb-6">
            <label className="text-xs font-medium text-slate-600 mb-1.5 block">
              Identidad de género
              <span className="text-slate-400 font-normal ml-1">(opcional)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {GENERO_OPTS.map(o => (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => setGenero(prev => prev === o.id ? '' : o.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    genero === o.id
                      ? 'bg-violet-600 text-white border-violet-600'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-violet-300'
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
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

            {/* Sub-sección: Inmunosupresión */}
            {condiciones.includes('inmunosupresion') && (
              <div className="mt-4 ml-1 pl-3 border-l-2 border-teal-200">
                <p className="text-xs font-semibold text-slate-600 mb-2">
                  Motivo de inmunosupresión
                </p>
                <div className="flex flex-col gap-1.5">
                  {INMUNOSUPRESION_TIPOS.map(t => (
                    <label
                      key={t.id}
                      className={`flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all text-sm ${
                        inmunosupresionTipo === t.id
                          ? 'border-teal-400 bg-teal-50 text-teal-800 font-medium'
                          : 'border-slate-100 hover:border-teal-200 text-slate-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="inmuno_tipo"
                        value={t.id}
                        checked={inmunosupresionTipo === t.id}
                        onChange={() => {
                          setInmunosupresionTipo(t.id)
                          if (t.id !== 'vih') setVihCargaViral('')
                        }}
                        className="accent-teal-600"
                      />
                      {t.label}
                    </label>
                  ))}
                </div>

                {/* Sub-sub-sección: VIH carga viral */}
                {inmunosupresionTipo === 'vih' && (
                  <div className="mt-3 ml-1 pl-3 border-l-2 border-amber-200">
                    <p className="text-xs font-semibold text-slate-600 mb-2">
                      Carga viral actual
                    </p>
                    <div className="flex flex-col gap-1.5">
                      {VIH_CARGA_VIRAL_OPTS.map(o => (
                        <label
                          key={o.id}
                          className={`flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all text-sm ${
                            vihCargaViral === o.id
                              ? 'border-amber-400 bg-amber-50 text-amber-800 font-medium'
                              : 'border-slate-100 hover:border-amber-200 text-slate-700'
                          }`}
                        >
                          <input
                            type="radio"
                            name="vih_cv"
                            value={o.id}
                            checked={vihCargaViral === o.id}
                            onChange={() => setVihCargaViral(o.id)}
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
            {condiciones.includes('embarazo') && (
              <div className="mt-4 ml-1 pl-3 border-l-2 border-pink-200">
                <p className="text-xs font-semibold text-slate-600 mb-1">
                  Fecha de última menstruación (FUM)
                </p>
                <p className="text-xs text-slate-400 mb-2">
                  Nos permite calcular las semanas de embarazo para la fecha del viaje.
                </p>
                <Input
                  type="date"
                  value={embarazoFum}
                  max={new Date().toISOString().split('T')[0]}
                  onChange={e => setEmbarazoFum(e.target.value)}
                  className="h-11 bg-white"
                />
                {embarazoFum && <PreviewEmbarazo fum={embarazoFum} />}
              </div>
            )}
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
