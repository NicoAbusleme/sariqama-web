'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { evaluarSemaforo, type EvaluacionSintomas } from '@/lib/clinical/semaforo'
import { guardarSintomas } from '@/app/actions/viaje'

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

const SINTOMAS_ADULTO = [
  { key: 'fiebre',                  emoji: '🌡️', label: 'Fiebre' },
  { key: 'diarrea',                 emoji: '💧', label: 'Diarrea' },
  { key: 'vomitos',                 emoji: '🤮', label: 'Vómitos' },
  { key: 'cefalea_intensa',         emoji: '🤕', label: 'Dolor de cabeza intenso' },
  { key: 'rash_manchas',            emoji: '🔴', label: 'Manchas o sarpullido en piel' },
  { key: 'dolor_abdominal',         emoji: '😣', label: 'Dolor abdominal' },
  { key: 'decaimiento_marcado',     emoji: '😓', label: 'Decaimiento marcado / postración' },
  { key: 'sangrado',                emoji: '🩸', label: 'Sangrado (nariz, encías, orina)' },
  { key: 'dificultad_respiratoria', emoji: '😮‍💨', label: 'Dificultad para respirar' },
]
const SINTOMAS_NINO_EXTRA = [
  { key: 'rechazo_liquidos',    emoji: '🚫', label: 'Rechaza tomar líquidos' },
  { key: 'llanto_sin_lagrimas', emoji: '😢', label: 'Llora sin lágrimas' },
  { key: 'baja_orina',          emoji: '🚽', label: 'Muy poca orina (últimas 6 h)' },
]

const SINTOMA_LABELS: Record<string, string> = {
  fiebre: 'Fiebre', fiebre_alta: 'Fiebre >38.5°C', fiebre_persistente: 'Fiebre persistente',
  diarrea: 'Diarrea', diarrea_con_sangre: 'Diarrea con sangre',
  vomitos: 'Vómitos', cefalea_intensa: 'Cefalea intensa', rash_manchas: 'Manchas/sarpullido',
  dolor_abdominal: 'Dolor abdominal', decaimiento_marcado: 'Decaimiento', sangrado: 'Sangrado',
  dificultad_respiratoria: 'Dif. respiratoria', rechazo_liquidos: 'Rechazo líquidos',
  llanto_sin_lagrimas: 'Llanto sin lágrimas', baja_orina: 'Poca orina',
}
const EXPOSICION_LABELS: Record<string, string> = {
  picadura_mosquito: 'Picadura mosquito',
  mordedura_animal:  'Mordedura animal',
  agua_no_segura:    'Agua no tratada',
}

const COLOR_META = {
  verde:    { bg: 'bg-green-50',  border: 'border-green-200',  dot: 'bg-green-500',  text: 'text-green-800',  sub: 'text-green-600',  badge: 'bg-green-100 text-green-800',  icon: '🟢' },
  amarillo: { bg: 'bg-amber-50',  border: 'border-amber-200',  dot: 'bg-amber-400',  text: 'text-amber-800',  sub: 'text-amber-600',  badge: 'bg-amber-100 text-amber-800',  icon: '🟡' },
  rojo:     { bg: 'bg-red-50',    border: 'border-red-200',    dot: 'bg-red-500',    text: 'text-red-800',    sub: 'text-red-600',    badge: 'bg-red-100 text-red-800',      icon: '🔴' },
}

export function SintomasClient({ viajeId, viajeros }: Props) {
  const router = useRouter()
  const [paso, setPaso] = useState<1 | 2 | 3 | 'resultado'>(viajeros.length > 0 ? 1 : 2)
  const [viajeroId, setViajeroId]     = useState<string | null>(null)
  const [nombreInvitado, setNombreInvitado] = useState('')
  const [invitadoNino, setInvitadoNino]     = useState(false)
  const [modoInvitado, setModoInvitado]     = useState(false)
  const [sintomas, setSintomas]       = useState<Set<string>>(new Set())
  const [diasSintomas, setDias]       = useState(1)
  const [exposiciones, setExposiciones] = useState<Set<string>>(new Set())
  const [resultado, setResultado]     = useState<ReturnType<typeof evaluarSemaforo> | null>(null)
  const [guardado, setGuardado]       = useState<'idle' | 'guardando' | 'ok' | 'error'>('idle')
  const [errorMsg, setErrorMsg]       = useState<string | null>(null)
  const [, startTransition]           = useTransition()

  const viajeroSel      = viajeros.find(v => v.id === viajeroId)
  const esNino          = modoInvitado ? invitadoNino : (viajeroSel?.es_nino ?? false)
  const embarazada      = viajeroSel?.condiciones?.includes('embarazo') ?? false
  const inmunosuprimido = viajeroSel?.condiciones?.includes('inmunosupresion') ?? false
  const nombreEvaluado  = modoInvitado ? (nombreInvitado.trim() || 'Invitado') : viajeroSel?.nombre

  function toggleSintoma(key: string) {
    setSintomas(prev => { const n = new Set(prev); n.has(key) ? n.delete(key) : n.add(key); return n })
  }
  function toggleExposicion(key: string) {
    setExposiciones(prev => { const n = new Set(prev); n.has(key) ? n.delete(key) : n.add(key); return n })
  }

  function evaluar() {
    const tieneFiebre  = sintomas.has('fiebre')
    const tieneDiarrea = sintomas.has('diarrea')

    const ev: EvaluacionSintomas = {
      fiebre:                  tieneFiebre,
      fiebre_alta:             tieneFiebre && sintomas.has('fiebre_alta'),
      fiebre_persistente:      tieneFiebre && diasSintomas >= 2,
      diarrea:                 tieneDiarrea,
      diarrea_con_sangre:      tieneDiarrea && sintomas.has('diarrea_con_sangre'),
      vomitos:                 sintomas.has('vomitos'),
      dolor_abdominal:         sintomas.has('dolor_abdominal'),
      cefalea_intensa:         sintomas.has('cefalea_intensa'),
      rash_manchas:            sintomas.has('rash_manchas'),
      sangrado:                sintomas.has('sangrado'),
      decaimiento_marcado:     sintomas.has('decaimiento_marcado'),
      dificultad_respiratoria: sintomas.has('dificultad_respiratoria'),
      rechazo_liquidos:        sintomas.has('rechazo_liquidos'),
      baja_orina:              sintomas.has('baja_orina'),
      llanto_sin_lagrimas:     sintomas.has('llanto_sin_lagrimas'),
      picadura_mosquito:       exposiciones.has('picadura_mosquito'),
      mordedura_animal:        exposiciones.has('mordedura_animal'),
      agua_no_segura:          exposiciones.has('agua_no_segura'),
      es_nino:                 esNino,
      embarazada,
      inmunosuprimido,
      dias_sintomas:           diasSintomas,
    }

    const res = evaluarSemaforo(ev)
    setResultado(res)
    setPaso('resultado')
    setGuardado('guardando')

    // Guardar en Supabase sin bloquear la UI
    startTransition(async () => {
      const r = await guardarSintomas({
        viaje_id:       viajeId,
        viajero_id:     viajeroId ?? undefined,
        viajero_nombre: nombreEvaluado,
        sintomas:       Array.from(sintomas),
        semaforo:       res.color,
        fiebre:         tieneFiebre,
        dias_sintomas:  diasSintomas,
        titulo:         res.titulo,
        exposiciones:   Array.from(exposiciones),
        acciones:       res.acciones,
      })
      if (r?.error) {
        setGuardado('error')
        setErrorMsg(r.error)
      } else {
        setGuardado('ok')
        router.refresh() // refresca el historial (server component)
      }
    })
  }

  function reiniciar() {
    setSintomas(new Set()); setExposiciones(new Set())
    setDias(1); setResultado(null); setGuardado('idle'); setErrorMsg(null)
    setPaso(viajeros.length > 0 ? 1 : 2)
    setViajeroId(null); setModoInvitado(false); setNombreInvitado(''); setInvitadoNino(false)
  }

  const sintomasVisibles = esNino ? [...SINTOMAS_ADULTO, ...SINTOMAS_NINO_EXTRA] : SINTOMAS_ADULTO

  // ─── Paso 1: ¿Quién? ─────────────────────────────────────────────────────
  if (paso === 1) return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="font-semibold text-slate-900 text-lg mb-1" style={{ fontFamily: 'var(--font-fraunces)' }}>
          ¿Quién tiene síntomas?
        </h2>
        <p className="text-sm text-slate-500">Selecciona el integrante para personalizar la evaluación</p>
      </div>
      <div className="flex flex-col gap-2.5">
        {viajeros.map(v => (
          <button key={v.id} onClick={() => { setViajeroId(v.id); setModoInvitado(false) }}
            className={cn('w-full bg-white rounded-2xl border p-4 text-left transition-all',
              viajeroId === v.id ? 'border-teal-400 ring-2 ring-teal-100 shadow-sm' : 'border-slate-100 hover:border-teal-200')}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-teal-50 flex items-center justify-center text-xl">
                {v.es_nino ? '👶' : '🧑'}
              </div>
              <div>
                <p className="font-semibold text-slate-900 text-sm">{v.nombre}</p>
                <p className="text-xs text-slate-400">{v.edad} años · {v.es_nino ? 'Niño/a' : 'Adulto'}</p>
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
        {/* Invitado */}
        <div className={cn(
          'w-full bg-white rounded-2xl border transition-all',
          modoInvitado ? 'border-teal-400 ring-2 ring-teal-100 shadow-sm' : 'border-slate-100'
        )}>
          <button
            onClick={() => { setModoInvitado(true); setViajeroId(null) }}
            className="w-full p-4 text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-xl">👤</div>
              <div>
                <p className="text-sm font-medium text-slate-700">Otro / Invitado</p>
                <p className="text-xs text-slate-400">Alguien que no está en tu lista</p>
              </div>
              {modoInvitado && (
                <div className="ml-auto w-5 h-5 rounded-full bg-teal-500 flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </div>
          </button>

          {/* Campos del invitado */}
          {modoInvitado && (
            <div className="px-4 pb-4 flex flex-col gap-3 border-t border-slate-100 pt-3">
              <div>
                <label className="text-xs font-semibold text-slate-500 mb-1.5 block">Nombre (opcional)</label>
                <input
                  type="text"
                  placeholder="Ej: Abuela Rosa"
                  value={nombreInvitado}
                  onChange={e => setNombreInvitado(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-teal-400"
                />
              </div>
              <button
                onClick={() => setInvitadoNino(v => !v)}
                className={cn(
                  'flex items-center gap-3 rounded-xl border px-3 py-2.5 transition-all text-left',
                  invitadoNino ? 'bg-amber-50 border-amber-200' : 'bg-slate-50 border-slate-100'
                )}
              >
                <span className="text-lg">{invitadoNino ? '👶' : '🧑'}</span>
                <span className={cn('text-sm flex-1', invitadoNino ? 'text-amber-800 font-medium' : 'text-slate-500')}>
                  {invitadoNino ? 'Es niño/a (activa preguntas pediátricas)' : '¿Es niño/a?'}
                </span>
                <div className={cn(
                  'w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center',
                  invitadoNino ? 'border-amber-500 bg-amber-500' : 'border-slate-300'
                )}>
                  {invitadoNino && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
      {(viajeroId || modoInvitado) && (
        <button onClick={() => setPaso(2)}
          className="w-full bg-teal-600 hover:bg-teal-700 text-white rounded-2xl py-3.5 font-semibold text-sm transition-colors">
          Continuar →
        </button>
      )}
    </div>
  )

  // ─── Paso 2: Síntomas ────────────────────────────────────────────────────
  if (paso === 2) return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="font-semibold text-slate-900 text-lg mb-1" style={{ fontFamily: 'var(--font-fraunces)' }}>
          {nombreEvaluado ? `¿Qué síntomas tiene ${nombreEvaluado}?` : '¿Qué síntomas tiene?'}
        </h2>
        <p className="text-sm text-slate-500">Selecciona todo lo que aplique ahora mismo</p>
      </div>
      <div className="flex flex-col gap-2">
        {sintomasVisibles.map(s => {
          const sel = sintomas.has(s.key)
          return (
            <div key={s.key}>
              <button onClick={() => toggleSintoma(s.key)}
                className={cn('w-full rounded-2xl border p-4 text-left transition-all',
                  sel ? 'bg-teal-50 border-teal-300 shadow-sm' : 'bg-white border-slate-100 hover:border-teal-200')}>
                <div className="flex items-center gap-3">
                  <span className="text-xl">{s.emoji}</span>
                  <span className={cn('text-sm font-medium flex-1', sel ? 'text-teal-800' : 'text-slate-700')}>{s.label}</span>
                  <div className={cn('w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all',
                    sel ? 'border-teal-500 bg-teal-500' : 'border-slate-300')}>
                    {sel && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                  </div>
                </div>
              </button>
              {s.key === 'fiebre' && sel && (
                <div className="ml-4 mt-1.5">
                  <button onClick={() => toggleSintoma('fiebre_alta')}
                    className={cn('w-full rounded-xl border px-4 py-2.5 text-left text-xs font-medium transition-all flex items-center gap-2',
                      sintomas.has('fiebre_alta') ? 'bg-red-50 border-red-200 text-red-700' : 'bg-white border-slate-100 text-slate-500 hover:border-red-200')}>
                    <span>{sintomas.has('fiebre_alta') ? '✅' : '☐'}</span>¿Temperatura mayor a 38.5°C?
                  </button>
                </div>
              )}
              {s.key === 'diarrea' && sel && (
                <div className="ml-4 mt-1.5">
                  <button onClick={() => toggleSintoma('diarrea_con_sangre')}
                    className={cn('w-full rounded-xl border px-4 py-2.5 text-left text-xs font-medium transition-all flex items-center gap-2',
                      sintomas.has('diarrea_con_sangre') ? 'bg-red-50 border-red-200 text-red-700' : 'bg-white border-slate-100 text-slate-500 hover:border-red-200')}>
                    <span>{sintomas.has('diarrea_con_sangre') ? '✅' : '☐'}</span>¿Hay sangre en las deposiciones?
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>
      <button onClick={() => setPaso(3)}
        className="w-full bg-teal-600 hover:bg-teal-700 text-white rounded-2xl py-3.5 font-semibold text-sm transition-colors">
        {sintomas.size === 0 ? 'No tengo síntomas →' : 'Continuar →'}
      </button>
      {viajeros.length > 0 && (
        <button onClick={() => setPaso(1)} className="text-xs text-slate-400 text-center">← Cambiar quién</button>
      )}
    </div>
  )

  // ─── Paso 3: Contexto ────────────────────────────────────────────────────
  if (paso === 3) return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="font-semibold text-slate-900 text-lg mb-1" style={{ fontFamily: 'var(--font-fraunces)' }}>
          Un poco de contexto
        </h2>
        <p className="text-sm text-slate-500">Nos ayuda a evaluar mejor el riesgo</p>
      </div>
      <div className="bg-white rounded-2xl border border-slate-100 p-4">
        <p className="text-sm font-semibold text-slate-700 mb-3">¿Cuántos días llevas con síntomas?</p>
        <div className="grid grid-cols-4 gap-2">
          {[{v:1,l:'1 día'},{v:2,l:'2 días'},{v:3,l:'3 días'},{v:4,l:'4+ días'}].map(op => (
            <button key={op.v} onClick={() => setDias(op.v)}
              className={cn('rounded-xl border py-2.5 text-sm font-medium transition-all',
                diasSintomas === op.v ? 'bg-teal-500 border-teal-500 text-white' : 'bg-white border-slate-200 text-slate-600 hover:border-teal-300')}>
              {op.l}
            </button>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-slate-100 p-4">
        <p className="text-sm font-semibold text-slate-700 mb-3">Exposiciones recientes (últimas 2 semanas)</p>
        <div className="flex flex-col gap-2">
          {[
            { key: 'picadura_mosquito', emoji: '🦟', label: 'Picadura de mosquito' },
            { key: 'mordedura_animal',  emoji: '🐾', label: 'Mordedura o arañazo de animal' },
            { key: 'agua_no_segura',    emoji: '🚰', label: 'Agua del grifo o sin tratar' },
          ].map(exp => {
            const sel = exposiciones.has(exp.key)
            return (
              <button key={exp.key} onClick={() => toggleExposicion(exp.key)}
                className={cn('w-full rounded-xl border p-3 text-left transition-all flex items-center gap-3',
                  sel ? 'bg-amber-50 border-amber-200' : 'bg-slate-50 border-slate-100 hover:border-amber-200')}>
                <span className="text-lg">{exp.emoji}</span>
                <span className={cn('text-sm flex-1', sel ? 'text-amber-800 font-medium' : 'text-slate-600')}>{exp.label}</span>
                <div className={cn('w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center',
                  sel ? 'border-amber-500 bg-amber-500' : 'border-slate-300')}>
                  {sel && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                </div>
              </button>
            )
          })}
        </div>
      </div>
      <button onClick={evaluar}
        className="w-full bg-amber-400 hover:bg-amber-300 text-slate-900 rounded-2xl py-3.5 font-bold text-sm transition-colors">
        Ver resultado del semáforo 🔍
      </button>
      <button onClick={() => setPaso(2)} className="text-xs text-slate-400 text-center">← Volver a síntomas</button>
    </div>
  )

  // ─── Resultado ────────────────────────────────────────────────────────────
  if (paso === 'resultado' && resultado) {
    const meta = COLOR_META[resultado.color]
    const sintomasArr = Array.from(sintomas).filter(k => !['fiebre_alta','diarrea_con_sangre'].includes(k))

    return (
      <div className="flex flex-col gap-4">

        {/* Card semáforo */}
        <div className={cn('rounded-3xl border-2 p-6', meta.bg, meta.border)}>
          <div className="flex items-center gap-3 mb-4">
            <div className={cn('w-5 h-5 rounded-full flex-shrink-0', meta.dot)} />
            <span className={cn('text-xs font-bold uppercase tracking-widest', meta.text)}>
              {resultado.color === 'verde' ? 'VERDE — Sin alarma' : resultado.color === 'amarillo' ? 'AMARILLO — Atención' : 'ROJO — Urgencia'}
            </span>
            {/* Indicador de guardado */}
            <span className="ml-auto text-xs text-slate-400">
              {guardado === 'guardando' && '⏳ Guardando...'}
              {guardado === 'ok'        && '✅ Guardado'}
              {guardado === 'error'     && (
                <span title={errorMsg ?? ''} className="text-red-500">⚠️ Error al guardar</span>
              )}
            </span>
          </div>
          <h2 className={cn('text-2xl font-semibold mb-2', meta.text)} style={{ fontFamily: 'var(--font-fraunces)' }}>
            {resultado.titulo}
          </h2>
          <p className={cn('text-sm leading-relaxed', meta.sub)}>{resultado.descripcion}</p>
        </div>

        {/* Resumen síntomas registrados */}
        {sintomasArr.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-100 p-4">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Síntomas registrados</p>
            <div className="flex flex-wrap gap-1.5">
              {sintomasArr.map(k => (
                <span key={k} className={cn('text-xs px-2.5 py-1 rounded-full font-medium', meta.badge)}>
                  {SINTOMA_LABELS[k] ?? k}
                </span>
              ))}
              {Array.from(exposiciones).map(k => (
                <span key={k} className="text-xs px-2.5 py-1 rounded-full font-medium bg-amber-100 text-amber-700">
                  {EXPOSICION_LABELS[k] ?? k}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Acciones */}
        <div className="bg-white rounded-2xl border border-slate-100 p-4">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Qué hacer ahora</p>
          <div className="flex flex-col gap-2.5">
            {resultado.acciones.map((acc, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-500 text-xs flex items-center justify-center flex-shrink-0 mt-0.5 font-bold">{i + 1}</span>
                <p className="text-sm text-slate-700 leading-relaxed">{acc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA urgencia */}
        {resultado.requiere_urgencia && (
          <div className="bg-red-500 rounded-2xl p-4 text-center">
            <p className="text-white font-bold text-sm mb-1">🚨 Busca urgencias ahora</p>
            <p className="text-red-100 text-xs">Llama al número de emergencias de tu destino o presenta en urgencias</p>
          </div>
        )}

        {/* CTA teleorientación */}
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

        {/* Error visible si falla el guardado */}
        {guardado === 'error' && errorMsg && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-3">
            <p className="text-xs font-semibold text-red-600 mb-1">⚠️ Error al guardar en base de datos:</p>
            <p className="text-xs text-red-500 font-mono break-all">{errorMsg}</p>
          </div>
        )}

        {/* Disclaimer */}
        <div className="bg-slate-50 rounded-2xl border border-slate-100 p-4">
          <p className="text-[11px] text-slate-400 leading-relaxed text-center">⚕️ {resultado.disclaimer}</p>
        </div>

        <button onClick={reiniciar}
          className="w-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 rounded-2xl py-3.5 font-medium text-sm transition-colors">
          ↩ Evaluar de nuevo
        </button>
        <Link href={`/viaje/${viajeId}`} className="text-xs text-teal-600 font-semibold text-center block">
          ← Volver al viaje
        </Link>
      </div>
    )
  }

  return null
}
