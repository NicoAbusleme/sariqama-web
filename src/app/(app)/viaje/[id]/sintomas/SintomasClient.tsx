'use client'

import { useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { evaluarSemaforo, type EvaluacionSintomas } from '@/lib/clinical/semaforo'

interface Viajero {
  id: string
  nombre: string
  edad: number
  es_nino: boolean
  condiciones: string[]
}

interface Props {
  viajeId: string
  viajeros: Viajero[]
}

// ─── Síntomas del paso 2 ─────────────────────────────────────────────────────
const SINTOMAS_ADULTO = [
  { key: 'fiebre',               emoji: '🌡️', label: 'Fiebre' },
  { key: 'diarrea',              emoji: '💧', label: 'Diarrea' },
  { key: 'vomitos',              emoji: '🤮', label: 'Vómitos' },
  { key: 'cefalea_intensa',      emoji: '🤕', label: 'Dolor de cabeza intenso' },
  { key: 'rash_manchas',         emoji: '🔴', label: 'Manchas o sarpullido en piel' },
  { key: 'dolor_abdominal',      emoji: '😣', label: 'Dolor abdominal' },
  { key: 'decaimiento_marcado',  emoji: '😓', label: 'Decaimiento marcado / postración' },
  { key: 'sangrado',             emoji: '🩸', label: 'Sangrado (nariz, encías, orina)' },
  { key: 'dificultad_respiratoria', emoji: '😮‍💨', label: 'Dificultad para respirar' },
]
const SINTOMAS_NINO_EXTRA = [
  { key: 'rechazo_liquidos',     emoji: '🚫', label: 'Rechaza tomar líquidos' },
  { key: 'llanto_sin_lagrimas',  emoji: '😢', label: 'Llora sin lágrimas' },
  { key: 'baja_orina',           emoji: '🚽', label: 'Muy poca orina (últimas 6 h)' },
]

const COLOR_META = {
  verde: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    dot: 'bg-green-500',
    text: 'text-green-800',
    sub: 'text-green-600',
    badge: 'bg-green-100 text-green-700',
    icon: '🟢',
  },
  amarillo: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    dot: 'bg-amber-400',
    text: 'text-amber-800',
    sub: 'text-amber-600',
    badge: 'bg-amber-100 text-amber-700',
    icon: '🟡',
  },
  rojo: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    dot: 'bg-red-500',
    text: 'text-red-800',
    sub: 'text-red-600',
    badge: 'bg-red-100 text-red-700',
    icon: '🔴',
  },
}

export function SintomasClient({ viajeId, viajeros }: Props) {
  const [paso, setPaso] = useState<1 | 2 | 3 | 'resultado'>(viajeros.length > 0 ? 1 : 2)
  const [viajeroId, setViajeroId] = useState<string | null>(null)
  const [sintomas, setSintomas] = useState<Set<string>>(new Set())
  const [diasSintomas, setDiasSintomas] = useState(1)
  const [exposiciones, setExposiciones] = useState<Set<string>>(new Set())
  const [resultado, setResultado] = useState<ReturnType<typeof evaluarSemaforo> | null>(null)

  const viajeroSel = viajeros.find(v => v.id === viajeroId)
  const esNino = viajeroSel?.es_nino ?? false
  const embarazada = viajeroSel?.condiciones?.includes('embarazo') ?? false
  const inmunosuprimido = viajeroSel?.condiciones?.includes('inmunosupresion') ?? false

  function toggleSintoma(key: string) {
    setSintomas(prev => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })
  }
  function toggleExposicion(key: string) {
    setExposiciones(prev => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })
  }

  function evaluar() {
    const tieneFiebre = sintomas.has('fiebre')
    const tieneDiarrea = sintomas.has('diarrea')

    const evaluacion: EvaluacionSintomas = {
      fiebre: tieneFiebre,
      fiebre_alta: tieneFiebre && sintomas.has('fiebre_alta'),
      fiebre_persistente: tieneFiebre && diasSintomas >= 2,
      diarrea: tieneDiarrea,
      diarrea_con_sangre: tieneDiarrea && sintomas.has('diarrea_con_sangre'),
      vomitos: sintomas.has('vomitos'),
      dolor_abdominal: sintomas.has('dolor_abdominal'),
      cefalea_intensa: sintomas.has('cefalea_intensa'),
      rash_manchas: sintomas.has('rash_manchas'),
      sangrado: sintomas.has('sangrado'),
      decaimiento_marcado: sintomas.has('decaimiento_marcado'),
      dificultad_respiratoria: sintomas.has('dificultad_respiratoria'),
      rechazo_liquidos: sintomas.has('rechazo_liquidos'),
      baja_orina: sintomas.has('baja_orina'),
      llanto_sin_lagrimas: sintomas.has('llanto_sin_lagrimas'),
      picadura_mosquito: exposiciones.has('picadura_mosquito'),
      mordedura_animal: exposiciones.has('mordedura_animal'),
      agua_no_segura: exposiciones.has('agua_no_segura'),
      es_nino: esNino,
      embarazada,
      inmunosuprimido,
      dias_sintomas: diasSintomas,
    }
    setResultado(evaluarSemaforo(evaluacion))
    setPaso('resultado')
  }

  function reiniciar() {
    setSintomas(new Set())
    setExposiciones(new Set())
    setDiasSintomas(1)
    setResultado(null)
    setPaso(viajeros.length > 0 ? 1 : 2)
    setViajeroId(null)
  }

  const sintomasVisibles = esNino
    ? [...SINTOMAS_ADULTO, ...SINTOMAS_NINO_EXTRA]
    : SINTOMAS_ADULTO

  // ─── Paso 1: ¿Quién? ─────────────────────────────────────────────────────
  if (paso === 1) {
    return (
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="font-semibold text-slate-900 text-lg mb-1"
            style={{ fontFamily: 'var(--font-fraunces)' }}>
            ¿Quién tiene síntomas?
          </h2>
          <p className="text-sm text-slate-500">
            Selecciona el integrante para personalizar la evaluación
          </p>
        </div>

        <div className="flex flex-col gap-2.5">
          {viajeros.map(v => (
            <button
              key={v.id}
              onClick={() => setViajeroId(v.id)}
              className={cn(
                'w-full bg-white rounded-2xl border p-4 text-left transition-all',
                viajeroId === v.id
                  ? 'border-teal-400 ring-2 ring-teal-100 shadow-sm'
                  : 'border-slate-100 hover:border-teal-200'
              )}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-teal-50 flex items-center justify-center text-xl">
                  {v.es_nino ? '👶' : '🧑'}
                </div>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">{v.nombre}</p>
                  <p className="text-xs text-slate-400">
                    {v.edad} años{v.es_nino ? ' · Niño/a' : ' · Adulto'}
                  </p>
                </div>
                {viajeroId === v.id && (
                  <div className="ml-auto w-5 h-5 rounded-full bg-teal-500 flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>
            </button>
          ))}

          <button
            onClick={() => { setViajeroId(null); setPaso(2) }}
            className="w-full bg-white rounded-2xl border border-slate-100 p-4 text-left hover:border-teal-200 transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-xl">👤</div>
              <p className="text-sm text-slate-500">Evaluar sin seleccionar</p>
            </div>
          </button>
        </div>

        {viajeroId && (
          <button
            onClick={() => setPaso(2)}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white rounded-2xl py-3.5 font-semibold text-sm transition-colors">
            Continuar →
          </button>
        )}
      </div>
    )
  }

  // ─── Paso 2: Síntomas ────────────────────────────────────────────────────
  if (paso === 2) {
    return (
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="font-semibold text-slate-900 text-lg mb-1"
            style={{ fontFamily: 'var(--font-fraunces)' }}>
            {viajeroSel ? `¿Qué síntomas tiene ${viajeroSel.nombre}?` : '¿Qué síntomas tiene?'}
          </h2>
          <p className="text-sm text-slate-500">Selecciona todo lo que aplique ahora mismo</p>
        </div>

        <div className="flex flex-col gap-2">
          {sintomasVisibles.map(s => {
            const sel = sintomas.has(s.key)
            return (
              <div key={s.key}>
                <button
                  onClick={() => toggleSintoma(s.key)}
                  className={cn(
                    'w-full rounded-2xl border p-4 text-left transition-all',
                    sel
                      ? 'bg-teal-50 border-teal-300 shadow-sm'
                      : 'bg-white border-slate-100 hover:border-teal-200'
                  )}>
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{s.emoji}</span>
                    <span className={cn('text-sm font-medium flex-1',
                      sel ? 'text-teal-800' : 'text-slate-700')}>
                      {s.label}
                    </span>
                    <div className={cn(
                      'w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all',
                      sel ? 'border-teal-500 bg-teal-500' : 'border-slate-300'
                    )}>
                      {sel && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                </button>

                {/* Sub-preguntas condicionales */}
                {s.key === 'fiebre' && sel && (
                  <div className="ml-4 mt-1.5 flex flex-col gap-1.5">
                    {[
                      { key: 'fiebre_alta', label: '¿Temperatura mayor a 38.5°C?' },
                    ].map(sub => (
                      <button key={sub.key} onClick={() => toggleSintoma(sub.key)}
                        className={cn(
                          'w-full rounded-xl border px-4 py-2.5 text-left text-xs font-medium transition-all flex items-center gap-2',
                          sintomas.has(sub.key)
                            ? 'bg-red-50 border-red-200 text-red-700'
                            : 'bg-white border-slate-100 text-slate-500 hover:border-red-200'
                        )}>
                        <span>{sintomas.has(sub.key) ? '✅' : '☐'}</span>
                        {sub.label}
                      </button>
                    ))}
                  </div>
                )}
                {s.key === 'diarrea' && sel && (
                  <div className="ml-4 mt-1.5">
                    <button onClick={() => toggleSintoma('diarrea_con_sangre')}
                      className={cn(
                        'w-full rounded-xl border px-4 py-2.5 text-left text-xs font-medium transition-all flex items-center gap-2',
                        sintomas.has('diarrea_con_sangre')
                          ? 'bg-red-50 border-red-200 text-red-700'
                          : 'bg-white border-slate-100 text-slate-500 hover:border-red-200'
                      )}>
                      <span>{sintomas.has('diarrea_con_sangre') ? '✅' : '☐'}</span>
                      ¿Hay sangre en las deposiciones?
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <button
          onClick={() => setPaso(3)}
          className="w-full bg-teal-600 hover:bg-teal-700 text-white rounded-2xl py-3.5 font-semibold text-sm transition-colors">
          {sintomas.size === 0 ? 'No tengo síntomas →' : 'Continuar →'}
        </button>

        {viajeros.length > 0 && (
          <button onClick={() => setPaso(1)} className="text-xs text-slate-400 text-center">
            ← Cambiar quién
          </button>
        )}
      </div>
    )
  }

  // ─── Paso 3: Contexto ────────────────────────────────────────────────────
  if (paso === 3) {
    return (
      <div className="flex flex-col gap-5">
        <div>
          <h2 className="font-semibold text-slate-900 text-lg mb-1"
            style={{ fontFamily: 'var(--font-fraunces)' }}>
            Un poco de contexto
          </h2>
          <p className="text-sm text-slate-500">Nos ayuda a evaluar mejor el riesgo</p>
        </div>

        {/* Días de síntomas */}
        <div className="bg-white rounded-2xl border border-slate-100 p-4">
          <p className="text-sm font-semibold text-slate-700 mb-3">¿Cuántos días llevas con síntomas?</p>
          <div className="grid grid-cols-4 gap-2">
            {[
              { v: 1, label: '1 día' },
              { v: 2, label: '2 días' },
              { v: 3, label: '3 días' },
              { v: 4, label: '4+ días' },
            ].map(op => (
              <button key={op.v} onClick={() => setDiasSintomas(op.v)}
                className={cn(
                  'rounded-xl border py-2.5 text-sm font-medium transition-all',
                  diasSintomas === op.v
                    ? 'bg-teal-500 border-teal-500 text-white'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-teal-300'
                )}>
                {op.label}
              </button>
            ))}
          </div>
        </div>

        {/* Exposiciones */}
        <div className="bg-white rounded-2xl border border-slate-100 p-4">
          <p className="text-sm font-semibold text-slate-700 mb-3">
            Exposiciones recientes (últimas 2 semanas)
          </p>
          <div className="flex flex-col gap-2">
            {[
              { key: 'picadura_mosquito', emoji: '🦟', label: 'Picadura de mosquito' },
              { key: 'mordedura_animal',  emoji: '🐾', label: 'Mordedura o arañazo de animal' },
              { key: 'agua_no_segura',    emoji: '🚰', label: 'Agua del grifo o sin tratar' },
            ].map(exp => {
              const sel = exposiciones.has(exp.key)
              return (
                <button key={exp.key} onClick={() => toggleExposicion(exp.key)}
                  className={cn(
                    'w-full rounded-xl border p-3 text-left transition-all flex items-center gap-3',
                    sel
                      ? 'bg-amber-50 border-amber-200'
                      : 'bg-slate-50 border-slate-100 hover:border-amber-200'
                  )}>
                  <span className="text-lg">{exp.emoji}</span>
                  <span className={cn('text-sm flex-1', sel ? 'text-amber-800 font-medium' : 'text-slate-600')}>
                    {exp.label}
                  </span>
                  <div className={cn(
                    'w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center',
                    sel ? 'border-amber-500 bg-amber-500' : 'border-slate-300'
                  )}>
                    {sel && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        <button
          onClick={evaluar}
          className="w-full bg-amber-400 hover:bg-amber-300 text-slate-900 rounded-2xl py-3.5 font-bold text-sm transition-colors">
          Ver resultado del semáforo 🔍
        </button>

        <button onClick={() => setPaso(2)} className="text-xs text-slate-400 text-center">
          ← Volver a síntomas
        </button>
      </div>
    )
  }

  // ─── Resultado ────────────────────────────────────────────────────────────
  if (paso === 'resultado' && resultado) {
    const meta = COLOR_META[resultado.color]

    return (
      <div className="flex flex-col gap-4">

        {/* Card principal semáforo */}
        <div className={cn('rounded-3xl border-2 p-6', meta.bg, meta.border)}>
          {/* Indicador */}
          <div className="flex items-center gap-3 mb-4">
            <div className={cn('w-5 h-5 rounded-full flex-shrink-0', meta.dot)} />
            <span className={cn('text-xs font-bold uppercase tracking-widest', meta.text)}>
              {resultado.color === 'verde' ? 'VERDE — Sin alarma'
                : resultado.color === 'amarillo' ? 'AMARILLO — Atención'
                : 'ROJO — Urgencia'}
            </span>
          </div>

          {/* Título grande */}
          <h2 className={cn('text-2xl font-semibold mb-2', meta.text)}
            style={{ fontFamily: 'var(--font-fraunces)' }}>
            {resultado.titulo}
          </h2>
          <p className={cn('text-sm leading-relaxed', meta.sub)}>
            {resultado.descripcion}
          </p>
        </div>

        {/* Acciones */}
        <div className="bg-white rounded-2xl border border-slate-100 p-4">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">
            Qué hacer ahora
          </p>
          <div className="flex flex-col gap-2.5">
            {resultado.acciones.map((acc, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-500 text-xs flex items-center justify-center flex-shrink-0 mt-0.5 font-bold">
                  {i + 1}
                </span>
                <p className="text-sm text-slate-700 leading-relaxed">{acc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA urgencia / teleorientación */}
        {resultado.requiere_urgencia && (
          <div className="bg-red-500 rounded-2xl p-4 text-center">
            <p className="text-white font-bold text-sm mb-1">🚨 Busca urgencias ahora</p>
            <p className="text-red-100 text-xs">
              Llama al número de emergencias de tu destino o presenta en urgencias
            </p>
          </div>
        )}

        {resultado.requiere_teleorientacion && !resultado.requiere_urgencia && (
          <Link href="/teleorientacion">
            <div className="bg-gradient-to-r from-amber-400 to-amber-500 rounded-2xl p-4 flex items-center justify-between hover:from-amber-500 hover:to-amber-600 transition-all">
              <div>
                <p className="font-bold text-slate-900 text-sm">Hablar con un especialista</p>
                <p className="text-amber-900 text-xs mt-0.5">Teleorientación con médico del viajero</p>
              </div>
              <span className="text-2xl">👨‍⚕️</span>
            </div>
          </Link>
        )}

        {/* Disclaimer */}
        <div className="bg-slate-50 rounded-2xl border border-slate-100 p-4">
          <p className="text-[11px] text-slate-400 leading-relaxed text-center">
            ⚕️ {resultado.disclaimer}
          </p>
        </div>

        {/* Volver a evaluar */}
        <button
          onClick={reiniciar}
          className="w-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 rounded-2xl py-3.5 font-medium text-sm transition-colors">
          ↩ Evaluar de nuevo
        </button>

        <Link
          href={`/viaje/${viajeId}`}
          className="text-xs text-teal-600 font-semibold text-center block">
          ← Volver al viaje
        </Link>
      </div>
    )
  }

  return null
}
