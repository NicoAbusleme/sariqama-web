import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SARIQAMA — Salud del viajero para tu familia",
  description:
    "Prepara la salud de tu familia antes de viajar. Checklists sanitarios, evaluación de riesgos por destino y orientación médica profesional.",
  keywords: ["salud viajero", "vacunas viaje", "dengue", "familias", "tropical"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-slate-900">
        {children}
      </body>
    </html>
  );
}
