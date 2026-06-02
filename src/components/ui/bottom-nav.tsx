'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Plane, Thermometer, User } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BottomNavProps {
  primerViajeId?: string
}

export function BottomNav({ primerViajeId }: BottomNavProps) {
  const pathname = usePathname()

  const viajeMatch = pathname.match(/^\/viaje\/([^/]+)/)
  const viajeEnPantalla = viajeMatch?.[1] !== 'nuevo' ? viajeMatch?.[1] : undefined
  const viajeId = viajeEnPantalla ?? primerViajeId

  const items = [
    {
      key:    'inicio',
      label:  'Inicio',
      Icon:   Home,
      href:   '/dashboard',
      active: pathname === '/dashboard',
    },
    {
      key:    'viaje',
      label:  'Viaje',
      Icon:   Plane,
      href:   viajeId ? `/viaje/${viajeId}` : '/viaje/nuevo',
      active: pathname === '/viaje/nuevo'
        || (!!viajeEnPantalla && pathname.startsWith(`/viaje/${viajeEnPantalla}`)),
    },
    {
      key:    'sintomas',
      label:  'Síntomas',
      Icon:   Thermometer,
      href:   viajeId ? `/viaje/${viajeId}/sintomas` : '/viaje/nuevo',
      active: !!viajeEnPantalla && pathname === `/viaje/${viajeEnPantalla}/sintomas`,
    },
    {
      key:    'perfil',
      label:  'Perfil',
      Icon:   User,
      href:   '/perfil',
      active: pathname.startsWith('/perfil'),
    },
  ]

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-white"
      style={{
        borderTop: '1px solid #E8EEF4',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <div className="max-w-2xl mx-auto flex justify-around items-stretch h-16">
        {items.map(({ key, href, Icon, label, active }) => (
          <Link
            key={key}
            href={href}
            className="relative flex flex-col items-center justify-center gap-0.5 flex-1 py-2"
          >
            {/* Línea activa en la parte superior */}
            <span
              className={cn(
                'absolute top-0 left-1/2 -translate-x-1/2 h-0.5 rounded-full transition-all duration-200',
                active ? 'w-6 bg-[#2D9E8C]' : 'w-0 bg-transparent'
              )}
            />

            {/* Ícono */}
            <Icon
              className={cn(
                'h-5 w-5 transition-colors duration-200',
                active ? 'text-[#2D9E8C]' : 'text-slate-400'
              )}
              strokeWidth={active ? 2.2 : 1.8}
              aria-hidden="true"
            />

            {/* Label */}
            <span
              className={cn(
                'text-[10px] font-medium transition-colors duration-200',
                active ? 'text-[#2D9E8C]' : 'text-slate-400'
              )}
            >
              {label}
            </span>
          </Link>
        ))}
      </div>
    </nav>
  )
}
