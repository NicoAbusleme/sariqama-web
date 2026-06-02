'use client'

import { useState } from 'react'
import { ChevronLeft, Send, Clock, Shield, Star } from 'lucide-react'
import Link from 'next/link'

const MOTIVOS = [
  { id: 'pre_viaje',  label: 'Revisión clínica pre-viaje',   emoji: '🩺', desc: 'Evaluación de riesgos y vacunas antes de salir' },
  { id: 'sintomas',   label: 'Síntomas durante el viaje',    emoji: '🌡️', desc: 'Fiebre, diarrea, erupciones u otros síntomas' },
  { id: 'post_viaje', label: 'Seguimiento post-viaje',       emoji: '📋', desc: 'Evaluación de síntomas al regresar' },
  { id: 'vacunas',    label: 'Consulta de vacunas',          emoji: '💉', desc: 'Qué vacunas necesito para mi destino' },
  { id: 'otro',       label: 'Otro motivo',                  emoji: '💬', desc: 'Consulta libre con el especialista' },
]

const URGENCIAS = [
  { id: 'rutina',  label: 'Sin urgencia',     color: 'border-green-200 bg-green-50 text-green-700', dot: 'bg-green-400' },
  { id: 'pronto',  label: 'Pronto (24–48 h)', color: 'border-amber-200 bg-amber-50 text-amber-700', dot: 'bg-amber-400' },
  { id: 'urgente', label: 'Urgente (hoy)',     color: 'border-red-200 bg-red-50 text-red-700',       dot: 'bg-red-400' },
]

const MAILTO_BASE = 'contacto@sariqama.com'

export function TeleorientacionClient() {
  const [motivo,   setMotivo]   = useState('')
  const [urgencia, setUrgencia] = useState('')
  const [nota,     setNota]     = useState('')
  const [enviado,  setEnviado]  = useState(false)

  const puedeEnviar = motivo !== '' && urgencia !== ''

  function buildMailto() {
    const motivoLabel   = MOTIVOS.find(m => m.id === motivo)?.label ?? motivo
    const urgenciaLabel = URGENCIAS.find(u => u.id === urgencia)?.label ?? urgencia
    const subject = encodeURIComponent(`Solicitud Teleorientación SARIQAMA — ${motivoLabel}`)
    const body = encodeURIComponent(
      `Hola equipo SARIQAMA,\n\n` +
      `Solicito una teleorientación:\n\n` +
      `- Motivo: ${motivoLabel}\n` +
      `- Urgencia: ${urgenciaLabel}\n` +
      (nota ? `- Notas: ${nota}\n` : '') +
      `\nQuedo atento/a.\n\nSaludos`
    )
    return `mailto:${MAILTO_BASE}?subject=${subject}&body=${body}`
  }

  if (enviado) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center px-5 pb-28">
        <div className="text-center max-w-xs">
          <div className="w-16 h-16 rounded-full bg-[#E8F7F4] flex items-center justify-center mx-auto mb-5">
            <svg className="w-8 h-8 text-[#2D9E8C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-[#1A3D5C] mb-2"
            style={{ fontFamily: 'var(--font-fraunces)' }}>
            Solicitud enviada
          </h2>
          <p className="text-sm text-slate-500 mb-6 leading-relaxed">
            Hemos recibido tu solicitud. Un especialista en medicina del viajero
            te contactará en las próximas horas.
          </p>
          <div className="bg-[#E8F7F4] border border-[#2D9E8C]/20 rounded-2xl p-4 mb-6 text-left">
            <p className="text-xs text-[#237F70] font-semibold mb-2">¿Qué sigue?</p>
            <ol className="text-xs text-[#2D9E8C] space-y-1.5 list-decimal list-inside">
              <li>Revisamos tu solicitud</li>
              <li>Te contactamos para agendar la sesión</li>
              <li>Sesión por videollamada (30–45 min)</li>
            </ol>
          </div>
          <Link href="/dashboard"
            className="inline-flex items-center gap-2 bg-[#2D9E8C] hover:bg-[#237F70] text-white font-semibold px-6 py-3 rounded-2xl text-sm transition-colors">
            Volver al inicio
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="max-w-2xl mx-auto px-5 py-5 pb-28">

      {/* Propuesta de valor */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { icon: Clock,  label: '30–45 min',    sub: 'por sesión' },
          { icon: Shield, label: 'Especialistas', sub: 'med. del viajero' },
          { icon: Star,   label: 'USD 29–39',     sub: 'por evento' },
        ].map(({ icon: Icon, label, sub }) => (
          <div key={label} className="bg-white rounded-2xl border border-slate-100 p-3 text-center">
            <Icon className="h-5 w-5 text-[#2D9E8C] mx-auto mb-1.5" />
            <p className="text-sm font-semibold text-slate-800">{label}</p>
            <p className="text-[10px] text-slate-400">{sub}</p>
          </div>
        ))}
      </div>

      {/* Paso 1: Motivo */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-[#2D9E8C] text-white text-[11px] flex items-center justify-center font-bold">1</span>
          ¿Cuál es el motivo de la consulta?
        </h2>
        <div className="flex flex-col gap-2">
          {MOTIVOS.map(m => (
            <button key={m.id} onClick={() => setMotivo(m.id)}
              className={`w-full text-left p-4 rounded-xl border transition-all ${
                motivo === m.id
                  ? 'border-[#2D9E8C]/40 bg-[#E8F7F4]'
                  : 'border-[#E8EEF4] bg-white hover:border-[#2D9E8C]/30'
              }`}>
              <div className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#1A3D5C]">{m.label}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{m.desc}</p>
                </div>
                {motivo === m.id && (
                  <span className="w-5 h-5 rounded-full bg-[#2D9E8C] flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Paso 2: Urgencia */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-[#2D9E8C] text-white text-[11px] flex items-center justify-center font-bold">2</span>
          ¿Qué tan urgente es?
        </h2>
        <div className="flex flex-col gap-2">
          {URGENCIAS.map(u => (
            <button key={u.id} onClick={() => setUrgencia(u.id)}
              className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center gap-3 ${
                urgencia === u.id ? `${u.color} ring-2 ring-offset-0` : 'border-[#E8EEF4] bg-white hover:border-slate-200'
              }`}>
              <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${u.dot}`} />
              <span className="text-sm font-semibold">{u.label}</span>
              {urgencia === u.id && (
                <span className="ml-auto w-5 h-5 rounded-full bg-white/60 flex items-center justify-center">
                  <svg className="w-3 h-3 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Paso 3: Nota adicional */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-slate-300 text-white text-[11px] flex items-center justify-center font-bold">3</span>
          Información adicional
          <span className="text-xs font-normal text-slate-400 ml-1">(opcional)</span>
        </h2>
        <textarea
          value={nota}
          onChange={e => setNota(e.target.value)}
          placeholder="Describe brevemente tu situación: síntomas, destino, fechas, integrantes afectados..."
          rows={3}
          className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-[#2D9E8C]/40 resize-none"
        />
      </div>

      {/* Aviso piloto */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl px-4 py-3 mb-6 flex items-start gap-2">
        <span className="text-base mt-0.5">ℹ️</span>
        <p className="text-xs text-blue-700 leading-relaxed">
          <strong>Programa piloto:</strong> Tu solicitud llega a nuestro equipo por email.
          Te contactamos para confirmar la sesión y coordinar el pago (USD 29–39).
        </p>
      </div>

      {/* Botón enviar */}
      <a
        href={puedeEnviar ? buildMailto() : undefined}
        onClick={() => { if (puedeEnviar) setEnviado(true) }}
        className={`flex items-center justify-center gap-2 w-full font-semibold py-4 rounded-2xl text-sm transition-all ${
          puedeEnviar
            ? 'bg-[#2D9E8C] hover:bg-[#237F70] text-white shadow-sm cursor-pointer'
            : 'bg-slate-100 text-slate-400 cursor-not-allowed pointer-events-none'
        }`}
      >
        <Send className="h-4 w-4" />
        Solicitar teleorientación
      </a>

      {!puedeEnviar && (
        <p className="text-xs text-slate-400 text-center mt-2">
          Selecciona motivo y urgencia para continuar
        </p>
      )}

      <p className="text-[11px] text-slate-400 text-center mt-6 leading-relaxed">
        SARIQAMA entrega orientación sanitaria. No reemplaza evaluación médica de urgencia.
        Ante signos de alarma, busca atención inmediata.
      </p>
    </main>
  )
}
