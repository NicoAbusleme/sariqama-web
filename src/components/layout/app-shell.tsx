"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Home, MapPin, Stethoscope, User } from "lucide-react"
import { cn } from "@/lib/utils"

const NAV_ITEMS = [
  { href: "/dashboard",  icon: Home,        label: "Inicio"    },
  { href: "/viaje/nuevo", icon: MapPin,      label: "Viaje"     },
  { href: "/viaje",      icon: Stethoscope,  label: "Síntomas"  },
  { href: "/perfil",     icon: User,         label: "Perfil"    },
]

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-[#F7FFFE] flex flex-col">

      {/* Top bar — glass refinado */}
      <header
        className="sticky top-0 z-50 border-b border-[#1A3D5C]/06"
        style={{
          background: 'rgba(255,255,255,0.90)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
        }}
      >
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

      {/* Bottom nav — frosted glass */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50"
        style={{
          background: 'rgba(255,255,255,0.88)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(26,61,92,0.07)',
        }}
      >
        <div className="max-w-2xl mx-auto flex justify-around items-center py-2 px-4 pb-safe">
          {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
            const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href))
            return (
              <Link
                key={href}
                href={href}
                className="flex flex-col items-center gap-0.5 py-1 px-3 rounded-2xl transition-all duration-200"
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200",
                    active
                      ? "bg-[#E0F5F2] scale-105 shadow-[0_2px_8px_rgba(45,158,140,0.18)]"
                      : "bg-transparent scale-100"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-5 w-5 transition-colors duration-200",
                      active ? "text-[#2D9E8C]" : "text-slate-400"
                    )}
                  />
                </div>
                <span
                  className={cn(
                    "text-[10px] font-medium transition-colors duration-200",
                    active ? "text-[#2D9E8C]" : "text-slate-400"
                  )}
                >
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
