import type { Metadata } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["300", "600"],
  style: ["normal", "italic"],
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
    <html lang="es" className={`${dmSans.variable} ${fraunces.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#F7FFFE] text-slate-900 font-sans">
        {children}
      </body>
    </html>
  );
}
