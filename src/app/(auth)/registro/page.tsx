import Link from "next/link";
import { Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function RegistroPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <Leaf className="h-7 w-7 text-teal-600" />
          <span className="font-bold text-2xl text-slate-900">SARIQAMA</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
          <h1 className="text-xl font-bold text-slate-900 mb-1 text-center">
            Crea tu cuenta familiar
          </h1>
          <p className="text-sm text-slate-500 text-center mb-6">
            Gratis — sin tarjeta de crédito
          </p>

          <form className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">
                Nombre de la familia
              </label>
              <Input
                type="text"
                placeholder="Familia García"
                className="h-11"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">
                Correo electrónico
              </label>
              <Input
                type="email"
                placeholder="tu@email.com"
                className="h-11"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">
                Contraseña
              </label>
              <Input
                type="password"
                placeholder="Mínimo 8 caracteres"
                className="h-11"
              />
            </div>

            {/* Consentimiento */}
            <p className="text-xs text-slate-400 leading-relaxed">
              Al registrarte aceptas que SARIQAMA entrega{" "}
              <strong>orientación sanitaria</strong> y no reemplaza una
              evaluación médica profesional.
            </p>

            <Button
              type="submit"
              className="w-full h-11 bg-teal-600 hover:bg-teal-700 text-white mt-2"
            >
              Crear cuenta
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-slate-500 mt-6">
          ¿Ya tienes cuenta?{" "}
          <Link
            href="/login"
            className="text-teal-600 hover:underline font-medium"
          >
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
