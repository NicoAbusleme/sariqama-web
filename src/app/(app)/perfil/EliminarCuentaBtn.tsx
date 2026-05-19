'use client'

import { useState, useTransition } from 'react'
import { Trash2, AlertTriangle } from 'lucide-react'
import { eliminarCuenta } from '@/app/actions/auth'

export function EliminarCuentaBtn() {
  const [confirmando, setConfirmando] = useState(false)
  const [pending, startTransition] = useTransition()

  function handleEliminar() {
    startTransition(async () => {
      await eliminarCuenta()
    })
  }

  if (!confirmando) {
    return (
      <button
        onClick={() => setConfirmando(true)}
        className="w-full flex items-center justify-center gap-2 text-slate-400 hover:text-red-500 text-xs py-2 transition-colors"
      >
        <Trash2 className="h-3.5 w-3.5" />
        Eliminar mi cuenta
      </button>
    )
  }

  return (
    <div className="bg-red-50 border border-red-100 rounded-2xl p-4 mt-1">
      <div className="flex items-start gap-2.5 mb-4">
        <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-red-700 mb-1">
            ¿Eliminar tu cuenta?
          </p>
          <p className="text-xs text-red-600 leading-relaxed">
            Se borrarán permanentemente tu perfil familiar, todos los viajeros,
            viajes, checklists y evaluaciones de síntomas. Esta acción no se puede deshacer.
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setConfirmando(false)}
          disabled={pending}
          className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors disabled:opacity-50"
        >
          Cancelar
        </button>
        <button
          onClick={handleEliminar}
          disabled={pending}
          className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
        >
          {pending ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              Eliminando…
            </>
          ) : (
            <>
              <Trash2 className="h-3.5 w-3.5" />
              Sí, eliminar todo
            </>
          )}
        </button>
      </div>
    </div>
  )
}
