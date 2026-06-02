"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Home, Plane, Thermometer, User } from "lucide-react"
import { cn } from "@/lib/utils"

const NAV_ITEMS = [
  { href: "/dashboard",   Icon: Home,        label: "Inicio"   },
  { href: "/viaje/nuevo", Icon: Plane,       label: "Viaje"    },
  { href: "/viaje",       Icon: Thermometer, label: "Síntomas" },
  { href: "/perfil",      Icon: User,        label: "Perfil"   },
]

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* Top bar — limpio, sin blur */}
      <header className="sticky top-0 z-50 bg-white border-b border-[#E8EEF4]">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center">
            <Image
              src="/logo.png"
              alt="SARIQAMA"
              width={120}
              height={36}
              className="h-8 w-auto object-contain"
              priority
            />
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-6 pb-28">
        {children}
      </main>

      {/* Bottom nav */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 bg-white"
        style={{
          borderTop: '1px solid #E8EEF4',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        <div className="max-w-2xl mx-auto flex justify-around items-stretch h-16">
          {NAV_ITEMS.map(({ href, Icon, label }) => {
            const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href))
            return (
              <Link
                key={href}
                href={href}
                className="relative flex flex-col items-center justify-center gap-0.5 flex-1 py-2"
              >
                <span
                  className={cn(
                    "absolute top-0 left-1/2 -translate-x-1/2 h-0.5 rounded-full transition-all duration-200",
                    active ? "w-6 bg-[#2D9E8C]" : "w-0"
                  )}
                />
                <Icon
                  className={cn(
                    "h-5 w-5 transition-colors duration-200",
                    active ? "text-[#2D9E8C]" : "text-slate-400"
                  )}
                  strokeWidth={active ? 2.2 : 1.8}
                  aria-hidden="true"
                />
                <span className={cn(
                  "text-[10px] font-medium transition-colors duration-200",
                  active ? "text-[#2D9E8C]" : "text-slate-400"
                )}>
                  {label}
                </span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
