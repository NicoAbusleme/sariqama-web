'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/dashboard', icon: '🏠', label: 'Inicio'   },
  { href: '/viaje/nuevo', icon: '✈️', label: 'Viaje'    },
  { href: '__sintomas__', icon: '🌡️', label: 'Síntomas' },
  { href: '/perfil',     icon: '👤', label: 'Perfil'   },
]

export function BottomNav() {
  const pathname = usePathname()

  // Si estamos dentro de un viaje (/viaje/[id]/...) extraemos el id
  const viajeMatch = pathname.match(/^\/viaje\/([^/]+)/)
  const viajeId = viajeMatch?.[1] !== 'nuevo' ? viajeMatch?.[1] : undefined

  function resolveHref(raw: string) {
    if (raw === '__sintomas__') {
      return viajeId ? `/viaje/${viajeId}/sintomas` : '/dashboard'
    }
    return raw
  }

  function isActive(raw: string) {
    const href = resolveHref(raw)
    if (href === '/dashboard') return pathname === '/dashboard'
    if (href === '/viaje/nuevo') return pathname === '/viaje/nuevo'
    return pathname.startsWith(href)
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 z-40">
      <div className="max-w-2xl mx-auto flex justify-around items-center py-2 px-4">
        {NAV_ITEMS.map(({ href: raw, icon, label }) => {
          const href   = resolveHref(raw)
          const active = isActive(raw)
          return (
            <Link key={raw} href={href}
              className="flex flex-col items-center gap-0.5 py-1 px-3">
              <div className={cn(
                'w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-colors',
                active ? 'bg-teal-100' : ''
              )}>
                {icon}
              </div>
              <span className={cn(
                'text-[10px] font-medium',
                active ? 'text-teal-600' : 'text-slate-400'
              )}>
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
