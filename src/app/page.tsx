import Link from "next/link";
import { Shield, MapPin, CheckCircle, Stethoscope, ChevronRight, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Colores TROPICARE: teal-600 (#0d9488) como primario
const BENEFICIOS = [
  {
    icon: MapPin,
    titulo: "Riesgos por destino",
    descripcion:
      "Información actualizada sobre dengue, malaria, agua y vacunas según adonde viajes.",
  },
  {
    icon: CheckCircle,
    titulo: "Checklist sanitario familiar",
    descripcion:
      "Lista personalizada según tu familia, destino y fechas. Sin olvidar nada importante.",
  },
  {
    icon: Shield,
    titulo: "Evaluador de síntomas",
    descripcion:
      "Semáforo clínico durante y después del viaje. Para adultos y niños por separado.",
  },
  {
    icon: Stethoscope,
    titulo: "Orientación profesional",
    descripcion:
      "Teleorientación con especialistas en medicina del viajero cuando lo necesitas.",
  },
];

const DESTINOS_DESTACADOS = [
  { nombre: "Brasil", emoji: "🇧🇷", riesgo: "Dengue alto" },
  { nombre: "Caribe", emoji: "🏝️", riesgo: "Malaria moderado" },
  { nombre: "Costa Rica", emoji: "🇨🇷", riesgo: "Dengue alto" },
  { nombre: "México", emoji: "🇲🇽", riesgo: "Diarrea del viajero" },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* NAVBAR */}
      <header className="border-b border-slate-100 bg-white/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-teal-600" />
            <span className="font-bold text-xl text-slate-900 tracking-tight">
              TROPICARE
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-slate-600">
            <Link href="#como-funciona" className="hover:text-teal-600 transition-colors">
              Cómo funciona
            </Link>
            <Link href="#destinos" className="hover:text-teal-600 transition-colors">
              Destinos
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Iniciar sesión
              </Button>
            </Link>
            <Link href="/registro">
              <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-white">
                Empezar gratis
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* HERO */}
        <section className="bg-gradient-to-b from-teal-50 to-white py-20 sm:py-28">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <Badge className="mb-6 bg-teal-100 text-teal-700 border-teal-200 hover:bg-teal-100">
              🌿 Salud del viajero para familias
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight tracking-tight mb-6">
              Prepara la salud de tu familia{" "}
              <span className="text-teal-600">antes de viajar</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
              Checklist sanitario, riesgos por destino y orientación médica
              personalizada. Diseñado para familias que viajan con niños a
              destinos tropicales.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/registro">
                <Button
                  size="lg"
                  className="bg-teal-600 hover:bg-teal-700 text-white px-8 h-12 text-base"
                >
                  Crear mi viaje gratis
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="#como-funciona">
                <Button variant="outline" size="lg" className="px-8 h-12 text-base">
                  Cómo funciona
                </Button>
              </Link>
            </div>
            <p className="mt-4 text-sm text-slate-400">
              Sin tarjeta de crédito · Orientación, no diagnóstico
            </p>
          </div>
        </section>

        {/* BENEFICIOS */}
        <section id="como-funciona" className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-14">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Todo lo que necesitas antes, durante y después del viaje
              </h2>
              <p className="text-slate-500 max-w-xl mx-auto">
                Información clínica validada, adaptada a tu familia y destino.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {BENEFICIOS.map((b) => (
                <div
                  key={b.titulo}
                  className="flex flex-col items-start p-6 rounded-2xl border border-slate-100 hover:border-teal-100 hover:shadow-sm transition-all"
                >
                  <div className="p-3 bg-teal-50 rounded-xl mb-4">
                    <b.icon className="h-6 w-6 text-teal-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">{b.titulo}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {b.descripcion}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* DESTINOS PILOTO */}
        <section id="destinos" className="py-20 bg-slate-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-14">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Destinos cubiertos
              </h2>
              <p className="text-slate-500">
                Información actualizada basada en CDC Yellow Book 2026.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {DESTINOS_DESTACADOS.map((d) => (
                <div
                  key={d.nombre}
                  className="bg-white rounded-2xl p-6 text-center border border-slate-100 hover:border-teal-200 hover:shadow-sm transition-all"
                >
                  <div className="text-4xl mb-3">{d.emoji}</div>
                  <div className="font-semibold text-slate-900 mb-1">{d.nombre}</div>
                  <div className="text-xs text-slate-400">{d.riesgo}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* DISCLAIMER CLÍNICO */}
        <section className="py-10 bg-white border-t border-slate-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <p className="text-sm text-slate-400 leading-relaxed">
              <strong className="text-slate-500">Aviso importante:</strong>{" "}
              TROPICARE entrega orientación sanitaria basada en fuentes clínicas
              validadas. No reemplaza una evaluación médica profesional. Ante
              signos de alarma, busca atención médica de inmediato.
            </p>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="py-20 bg-teal-600">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              ¿Cuándo sale tu próximo viaje?
            </h2>
            <p className="text-teal-100 mb-8 text-lg">
              Crea el perfil de tu familia y obtén tu checklist sanitario en minutos.
            </p>
            <Link href="/registro">
              <Button
                size="lg"
                className="bg-white text-teal-700 hover:bg-teal-50 px-8 h-12 text-base font-semibold"
              >
                Empezar gratis
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Leaf className="h-4 w-4 text-teal-400" />
            <span className="text-white font-semibold">TROPICARE</span>
          </div>
          <p>© 2026 TROPICARE. Orientación sanitaria, no diagnóstico médico.</p>
        </div>
      </footer>
    </div>
  );
}
