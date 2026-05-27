'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

interface BottomNavProps {
  /** ID del primer viaje próximo del usuario (viene del layout server) */
  primerViajeId?: string
}

export function BottomNav({ primerViajeId }: BottomNavProps) {
  const pathname = usePathname()

  // Si ya estamos dentro de un viaje, extraemos su ID de la URL
  const viajeMatch = pathname.match(/^\/viaje\/([^/]+)/)
  const viajeEnPantalla = viajeMatch?.[1] !== 'nuevo' ? viajeMatch?.[1] : undefined

  // El viaje a usar: el que estamos viendo ahora, o el primero del usuario
  const viajeId = viajeEnPantalla ?? primerViajeId

  const items = [
    {
      key:    'inicio',
      label:  'Inicio',
      icon:   '🏠',
      href:   '/dashboard',
      active: pathname === '/dashboard',
    },
    {
      key:    'viaje',
      label:  'Viaje',
      icon:   '✈️',
      // Si hay un viaje, abre sus detalles; si no, crea uno nuevo
      href:   viajeId ? `/viaje/${viajeId}` : '/viaje/nuevo',
      active: pathname === '/viaje/nuevo'
        || (!!viajeEnPantalla && pathname.startsWith(`/viaje/${viajeEnPantalla}`)),
    },
    {
      key:    'sintomas',
      label:  'Síntomas',
      icon:   '🌡️',
      href:   viajeId ? `/viaje/${viajeId}/sintomas` : '/viaje/nuevo',
      // Solo activo cuando estás exactamente en la página de síntomas
      active: !!viajeEnPantalla && pathname === `/viaje/${viajeEnPantalla}/sintomas`,
    },
    {
      key:    'perfil',
      label:  'Perfil',
      icon:   '👤',
      href:   '/perfil',
      active: pathname.startsWith('/perfil'),
    },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 z-40">
      <div className="max-w-2xl mx-auto flex justify-around items-center py-2 px-4">
        {items.map(({ key, href, icon, label, active }) => (
          <Link key={key} href={href}
            className="flex flex-col items-center gap-0.5 py-1 px-3">
            <div className={cn(
              'w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-colors',
              active ? 'bg-[#E0F5F2]' : ''
            )}>
              {icon}
            </div>
            <span className={cn(
              'text-[10px] font-medium',
              active ? 'text-[#2D9E8C]' : 'text-slate-400'
            )}>
              {label}
            </span>
          </Link>
        ))}
      </div>
    </nav>
  )
}
