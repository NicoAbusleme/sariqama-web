import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { ChevronLeft, Plane, AlertTriangle, Stethoscope } from 'lucide-react'
import Link from 'next/link'
import { getDestinoBySlug } from '@/lib/content/destinos'
import { FlagImg } from '@/components/ui/flag-img'
import { PlanGate } from '@/components/ui/plan-gate'

// ─── Tipos ───────────────────────────────────────────────────────────────────
interface BotiquinItem {
  nombre: string
  nota?: string
}
interface Seccion {
  emoji: string
  titulo: string
  color: string
  items: BotiquinItem[]
}

// ─── Contenido base ───────────────────────────────────────────────────────────
const MEDICAMENTOS: BotiquinItem[] = [
  { nombre: 'Paracetamol comprimidos (500 mg)', nota: 'Fiebre y dolor. Dosis según peso.' },
  { nombre: 'Ibuprofeno comprimidos (400 mg)', nota: 'Antiinflamatorio. No usar en menores de 6 meses.' },
  { nombre: 'Antihistamínico (cetirizina o loratadina)', nota: 'Alergias y picaduras de insectos.' },
  { nombre: 'Antidiarreico (loperamida)', nota: 'Solo adultos. No usar si hay fiebre o sangre en heces.' },
  { nombre: 'Suero oral de rehidratación (SRO)', nota: 'Esencial ante vómito o diarrea. Llevar varios sobres.' },
  { nombre: 'Antiácido (omeprazol o carbonato de calcio)', nota: 'Cambio de alimentación y agua.' },
  { nombre: 'Metoclopramida (antináusea)', nota: 'Náuseas por cambio horario o transporte.' },
]

const PRIMEROS_AUXILIOS: BotiquinItem[] = [
  { nombre: 'Termómetro digital', nota: 'Fiebre >38°C en zona tropical siempre evaluar.' },
  { nombre: 'Curitas de distintos tamaños', nota: 'Al menos 20 unidades.' },
  { nombre: 'Venda elástica 5 cm', nota: 'Torceduras y contenciones.' },
  { nombre: 'Gasas estériles (5x5 cm)', nota: 'Mínimo 10 unidades.' },
  { nombre: 'Alcohol isopropílico 70%', nota: 'Desinfección de heridas y superficies.' },
  { nombre: 'Agua oxigenada 3%', nota: 'Limpieza inicial de heridas.' },
  { nombre: 'Crema antibiótica (bacitracina)', nota: 'Heridas pequeñas para evitar infección.' },
  { nombre: 'Pinzas de punta fina', nota: 'Remoción de espinas, garrapatas o astillas.' },
  { nombre: 'Tijeras de punta roma', nota: 'Cortar vendas y gasas.' },
  { nombre: 'Guantes de nitrilo (2 pares)', nota: 'Protección al atender heridas.' },
]

const PROTECCION: BotiquinItem[] = [
  { nombre: 'Repelente DEET 30%+ o Icaridina 20%+', nota: 'Aplicar en piel expuesta cada 4-6 h. Seguro en embarazo con Icaridina.' },
  { nombre: 'Protector solar FPS 50+ resistente al agua', nota: 'Reaplicar cada 2 h. Aplicar antes del repelente.' },
  { nombre: 'Ropa de manga larga liviana', nota: 'Para amanecer y atardecer (pico de actividad del mosquito).' },
  { nombre: 'Gafas de sol con filtro UV', nota: 'Protección ocular en destinos tropicales.' },
]

// ─── Extras por destino ───────────────────────────────────────────────────────
const EXTRAS_DESTINO: Record<string, BotiquinItem[]> = {
  // Nuevos slugs
  'brasil': [
    { nombre: 'Profilaxis antipalúdica (si viaja a Amazonia)', nota: 'Consultar con médico. No aplica para playas del nordeste costero.' },
    { nombre: 'Mosquitero impregnado con permetrina', nota: 'Recomendado para zonas de selva o interior.' },
  ],
  'republica-dominicana': [
    { nombre: 'Cloroquina profiláctica (si va a zonas rurales)', nota: 'Solo con prescripción médica. Evaluar con especialista.' },
    { nombre: 'Tabletas purificadoras de agua', nota: 'Útil si sale de zonas turísticas.' },
    { nombre: 'Gotas oftálmicas antibióticas', nota: 'Conjuntivitis frecuente en playas y piscinas.' },
  ],
  'costa-rica': [
    { nombre: 'Crema antihistamínica tópica', nota: 'Reacciones por insectos y plantas en zona selvática.' },
    { nombre: 'Protección antiofídica (saber dónde está el centro médico más cercano)', nota: 'Riesgo bajo pero presente en zonas rurales. No manipular animales.' },
  ],
  'mexico': [
    { nombre: 'Probióticos (lactobacillus)', nota: 'Pueden reducir riesgo de diarrea del viajero.' },
    { nombre: 'Azitromicina o ciprofloxacino (prescrito)', nota: 'Antibiótico de rescate ante diarrea severa. Solo con receta médica.' },
    { nombre: 'Pastillas para agua / filtro portátil', nota: 'Para zonas fuera de resorts.' },
  ],
  'chile': [
    { nombre: 'Protector labial con FPS 50+', nota: 'El índice UV en Chile es muy alto, especialmente en el norte y la Patagonia.' },
    { nombre: 'Ropa térmica liviana (capa base)', nota: 'Las noches pueden ser frías incluso en verano en la Patagonia y Atacama.' },
    { nombre: 'Bastones de trekking (si hace senderismo)', nota: 'Útiles para Torres del Paine y otros senderos de alta dificultad.' },
  ],
  // Aliases para viajes registrados con slugs anteriores
  'brasil-nordeste':             [
    { nombre: 'Profilaxis antipalúdica (si viaja a Amazonia)', nota: 'Consultar con médico. No aplica para playas del nordeste costero.' },
    { nombre: 'Mosquitero impregnado con permetrina', nota: 'Recomendado para zonas de selva o interior.' },
  ],
  'caribe-republica-dominicana': [
    { nombre: 'Cloroquina profiláctica (si va a zonas rurales)', nota: 'Solo con prescripción médica. Evaluar con especialista.' },
    { nombre: 'Tabletas purificadoras de agua', nota: 'Útil si sale de zonas turísticas.' },
    { nombre: 'Gotas oftálmicas antibióticas', nota: 'Conjuntivitis frecuente en playas y piscinas.' },
  ],
  'centroamerica-costa-rica': [
    { nombre: 'Crema antihistamínica tópica', nota: 'Reacciones por insectos y plantas en zona selvática.' },
    { nombre: 'Protección antiofídica (saber dónde está el centro médico más cercano)', nota: 'Riesgo bajo pero presente en zonas rurales. No manipular animales.' },
  ],
  'mexico-cancun-riviera': [
    { nombre: 'Probióticos (lactobacillus)', nota: 'Pueden reducir riesgo de diarrea del viajero.' },
    { nombre: 'Azitromicina o ciprofloxacino (prescrito)', nota: 'Antibiótico de rescate ante diarrea severa. Solo con receta médica.' },
    { nombre: 'Pastillas para agua / filtro portátil', nota: 'Para zonas fuera de resorts.' },
  ],
}

// ─── Pediátrico ───────────────────────────────────────────────────────────────
const PEDIATRICO: BotiquinItem[] = [
  { nombre: 'Paracetamol gotas o jarabe pediátrico', nota: 'Dosis por peso corporal. Revisar prospecto.' },
  { nombre: 'Ibuprofeno suspensión pediátrica', nota: 'A partir de los 6 meses. Dosis por peso.' },
  { nombre: 'Suero oral de rehidratación pediátrico', nota: 'Ante el primer vómito o diarrea, iniciar rehidratación inmediata.' },
  { nombre: 'Antihistamínico pediátrico (cetirizina gotas)', nota: 'Picaduras y reacciones alérgicas leves.' },
  { nombre: 'Suero fisiológico nasal (spray)', nota: 'Limpieza nasal frecuente en destinos húmedos.' },
  { nombre: 'Termómetro rectal o de oído', nota: 'Más preciso en menores de 3 años.' },
  { nombre: 'Repelente pediátrico (Icaridina 10-20%)', nota: 'Seguro desde los 6 meses. No aplicar en manos, ojos ni boca.' },
  { nombre: 'Crema para dermatitis / Hidrocortisona 1%', nota: 'Reacciones cutáneas por calor, insectos o agua.' },
  { nombre: 'Bolsas para vómito (varias)', nota: 'Indispensable en transporte con niños.' },
]

export default async function BotiquinPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: viaje } = await supabase.from('viajes').select('*').eq('id', id).single()
  if (!viaje) notFound()

  const { data: familia } = await supabase
    .from('familias').select('id, plan').eq('user_id', user.id).single()
  if (!familia || viaje.familia_id !== familia.id) redirect('/dashboard')

  const userPlan: string = familia.plan ?? 'gratis'

  // ¿Hay niños en la familia?
  const { data: viajeros } = await supabase
    .from('viajeros').select('es_nino').eq('familia_id', familia.id)
  const tieneNinos = viajeros?.some(v => v.es_nino) ?? false

  const destino = getDestinoBySlug(viaje.destino_slug)
  if (!destino) notFound()

  const flagCode = destino?.pais_code ?? 'un'

  const extrasDestino = EXTRAS_DESTINO[viaje.destino_slug] ?? []

  // Armar secciones dinámicamente
  const secciones: Seccion[] = [
    {
      emoji: '💊',
      titulo: 'Medicamentos esenciales',
      color: 'bg-blue-50 border-blue-100',
      items: MEDICAMENTOS,
    },
    {
      emoji: '🩹',
      titulo: 'Primeros auxilios',
      color: 'bg-red-50 border-red-100',
      items: PRIMEROS_AUXILIOS,
    },
    {
      emoji: '🧴',
      titulo: 'Protección solar y contra insectos',
      color: 'bg-green-50 border-green-100',
      items: PROTECCION,
    },
  ]

  if (extrasDestino.length > 0) {
    secciones.push({
      emoji: '🗺️',
      titulo: `Específico para ${destino.nombre}`,
      color: 'bg-[#E0F5F2] border-[#2D9E8C]/20',
      items: extrasDestino,
    })
  }

  if (tieneNinos) {
    secciones.push({
      emoji: '👶',
      titulo: 'Pediátrico (para niños)',
      color: 'bg-amber-50 border-amber-100',
      items: PEDIATRICO,
    })
  }

  const totalItems = secciones.reduce((acc, s) => acc + s.items.length, 0)

  return (
    <div className="min-h-screen bg-[#F8FAFB]">
      {/* ── Header limpio ─────────────────────────────────────────────── */}
      <header className="bg-white border-b border-[#E8EEF4] px-5 pt-5 pb-5">
        <div className="max-w-2xl mx-auto">
          <Link
            href={`/viaje/${id}`}
            className="inline-flex items-center gap-1.5 text-slate-400 hover:text-[#1A3D5C] text-sm mb-4 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" /> Volver al viaje
          </Link>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                <FlagImg code={flagCode} size={40} className="w-full h-full object-cover" />
              </div>
              <div className="min-w-0">
                <h1
                  className="text-xl font-semibold text-[#1A3D5C]"
                  style={{ fontFamily: 'var(--font-fraunces)' }}
                >
                  Botiquín familiar
                </h1>
                <p className="text-sm text-slate-400">{destino.nombre}</p>
              </div>
            </div>
            <div className="bg-[#E8F7F4] rounded-xl px-3 py-2 text-center flex-shrink-0">
              <p className="text-xl font-bold text-[#1A3D5C]">{totalItems}</p>
              <p className="text-[11px] text-[#2D9E8C] font-medium">ítems</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-5 py-5 pb-28">
        <PlanGate
          userPlan={userPlan}
          requiredPlan="preparacion"
          feature="Botiquín familiar personalizado"
          description="Arma el botiquín perfecto para tu destino, con sección pediátrica si viajas con niños."
        >

        {/* Tip intro */}
        <div className="bg-[#E8F7F4] border border-[#2D9E8C]/20 rounded-xl px-4 py-3 mb-4 flex items-start gap-2.5">
          <Plane className="h-4 w-4 text-[#2D9E8C] flex-shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-xs text-[#237F70] leading-relaxed">
            <strong>Tip de equipaje:</strong> Líquidos limitados a 100 ml en equipaje de mano.
            Llevar medicamentos en su envase original con prospecto. Consulta restricciones de tu aerolínea.
          </p>
        </div>

        {tieneNinos && (
          <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 mb-4 flex items-start gap-2.5">
            <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-xs text-amber-700 leading-relaxed">
              <strong>Viajas con niños:</strong> Incluimos sección pediátrica personalizada. Siempre verifica
              dosis con tu pediatra antes de viajar.
            </p>
          </div>
        )}

        {/* Secciones */}
        <div className="space-y-4">
          {secciones.map((seccion) => (
            <div key={seccion.titulo} className="bg-white rounded-2xl border border-[#E8EEF4] overflow-hidden"
              style={{ boxShadow: 'var(--shadow-xs)' }}>
              {/* Encabezado sección */}
              <div className="flex items-center gap-2.5 px-4 py-3 border-b border-[#F0F4F8] bg-[#F8FAFB]">
                <span className="text-base" aria-hidden="true">{seccion.emoji}</span>
                <h2
                  className="font-semibold text-[#1A3D5C] text-sm flex-1"
                  style={{ fontFamily: 'var(--font-fraunces)' }}
                >
                  {seccion.titulo}
                </h2>
                <span className="text-[11px] text-slate-400 font-medium">
                  {seccion.items.length} ítems
                </span>
              </div>

              {/* Items */}
              <div className="divide-y divide-[#F0F4F8]">
                {seccion.items.map((item, idx) => (
                  <div key={idx} className="px-4 py-3.5">
                    <div className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2D9E8C] flex-shrink-0 mt-1.5" aria-hidden="true" />
                      <div>
                        <p className="text-sm font-medium text-[#1A3D5C] leading-snug">
                          {item.nombre}
                        </p>
                        {item.nota && (
                          <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                            {item.nota}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* CTA médico */}
        <Link href="/teleorientacion">
          <div className="mt-4 bg-[#1A3D5C] rounded-2xl p-5 flex items-center justify-between hover:bg-[#254E72] transition-colors cursor-pointer">
            <div>
              <p className="font-semibold text-white text-sm">¿Dudas sobre qué llevar?</p>
              <p className="text-[#A8C5DA] text-xs mt-0.5">Habla con un especialista en medicina del viajero</p>
            </div>
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <Stethoscope className="h-5 w-5 text-white" strokeWidth={1.8} aria-hidden="true" />
            </div>
          </div>
        </Link>

        {/* Disclaimer */}
        <p className="text-[11px] text-slate-400 text-center mt-5 leading-relaxed">
          Contenido basado en recomendaciones CDC y OPS para viajeros.
          No reemplaza prescripción médica. Ante signos de alarma, busca atención inmediata.
        </p>

        </PlanGate>
      </main>
    </div>
  )
}
