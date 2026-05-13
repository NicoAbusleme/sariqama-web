'use client'

import { useState, useTransition } from 'react'
import { eliminarViaje } from '@/app/actions/viaje'
import { Trash2 } from 'lucide-react'

export function EliminarViajeBtn({ viajeId }: { viajeId: string }) {
  const [confirmar, setConfirmar] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleEliminar() {
    startTransition(async () => {
      await eliminarViaje(viajeId)
    })
  }

  if (!confirmar) {
    return (
      <button
        onClick={() => setConfirmar(true)}
        className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 font-semibold text-sm rounded-2xl py-3.5 transition-colors"
      >
        <Trash2 className="h-4 w-4" />
        Eliminar viaje
      </button>
    )
  }

  return (
    <div className="bg-red-50 border border-red-100 rounded-2xl p-4 text-center">
      <p className="text-sm font-semibold text-red-700 mb-1">¿Eliminar este viaje?</p>
      <p className="text-xs text-red-500 mb-4">
        Se borrará el checklist, síntomas y toda la información asociada. Esta acción no se puede deshacer.
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => setConfirmar(false)}
          className="flex-1 bg-white border border-slate-200 text-slate-600 rounded-xl py-2.5 text-sm font-medium hover:bg-slate-50 transition-colors"
        >
          Cancelar
        </button>
        <button
          onClick={handleEliminar}
          disabled={isPending}
          className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-xl py-2.5 text-sm font-semibold transition-colors disabled:opacity-60"
        >
          {isPending ? 'Eliminando...' : 'Sí, eliminar'}
        </button>
      </div>
    </div>
  )
}
