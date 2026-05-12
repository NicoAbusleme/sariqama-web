import { Leaf, Plus, MapPin, CheckCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

// Placeholder — se conectará a Supabase en Fase 2
export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar app */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-teal-600" />
            <span className="font-bold text-lg text-slate-900">SARIQAMA</span>
          </div>
          <Link href="/perfil">
            <div className="w-9 h-9 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-semibold text-sm cursor-pointer">
              F
            </div>
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Saludo */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-1">
            Hola, Familia 👋
          </h1>
          <p className="text-slate-500">
            ¿Cuándo es tu próximo viaje?
          </p>
        </div>

        {/* Sin viajes — estado vacío */}
        <Card className="mb-6 border-dashed border-2 border-slate-200 bg-white">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <MapPin className="h-12 w-12 text-slate-300 mb-4" />
            <h3 className="font-semibold text-slate-700 mb-2">
              Aún no tienes viajes registrados
            </h3>
            <p className="text-sm text-slate-400 max-w-sm mb-6">
              Crea tu primer viaje para obtener tu checklist sanitario personalizado
              y la información de riesgos de tu destino.
            </p>
            <Link href="/viaje/nuevo">
              <Button className="bg-teal-600 hover:bg-teal-700 text-white">
                <Plus className="mr-2 h-4 w-4" />
                Crear mi primer viaje
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Cards de acceso rápido */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="hover:border-teal-200 transition-colors cursor-pointer">
            <CardHeader className="pb-2">
              <div className="p-2 bg-green-50 rounded-lg w-fit mb-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <CardTitle className="text-base">Checklist pre-viaje</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-500">
                Lista sanitaria personalizada para tu familia y destino.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:border-teal-200 transition-colors cursor-pointer">
            <CardHeader className="pb-2">
              <div className="p-2 bg-yellow-50 rounded-lg w-fit mb-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
              </div>
              <CardTitle className="text-base">Evaluar síntomas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-500">
                Semáforo clínico durante y después del viaje.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:border-teal-200 transition-colors cursor-pointer">
            <CardHeader className="pb-2">
              <div className="p-2 bg-teal-50 rounded-lg w-fit mb-2">
                <MapPin className="h-5 w-5 text-teal-600" />
              </div>
              <CardTitle className="text-base">Riesgos por destino</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-500">
                Dengue, malaria, vacunas y más según tu destino.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-slate-400 text-center mt-10 leading-relaxed">
          SARIQAMA entrega orientación sanitaria. No reemplaza evaluación médica profesional.
        </p>
      </main>
    </div>
  );
}
