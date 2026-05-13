import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { getDestinoBySlug } from '@/lib/content/destinos'

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
  'brasil-nordeste': [
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

  const { data: familia } = await supabase.from('familias').select('id').eq('user_id', user.id).single()
  if (!familia || viaje.familia_id !== familia.id) redirect('/dashboard')

  // ¿Hay niños en la familia?
  const { data: viajeros } = await supabase
    .from('viajeros').select('es_nino').eq('familia_id', familia.id)
  const tieneNinos = viajeros?.some(v => v.es_nino) ?? false

  const destino = getDestinoBySlug(viaje.destino_slug)
  if (!destino) notFound()

  const flagEmoji = viaje.destino_slug.includes('brasil') ? '🇧🇷'
    : viaje.destino_slug.includes('caribe') ? '🏝️'
    : viaje.destino_slug.includes('costa') ? '🇨🇷' : '🇲🇽'

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
      color: 'bg-teal-50 border-teal-100',
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
    <div className="min-h-screen bg-[#F0FDF9]">
      {/* Header */}
      <header className="bg-gradient-to-br from-teal-600 to-teal-800 px-5 pt-12 pb-8">
        <div className="max-w-2xl mx-auto">
          <Link
            href={`/viaje/${id}`}
            className="inline-flex items-center gap-1.5 text-teal-200 text-sm mb-5 hover:text-white transition-colors"
          >
            <ChevronLeft className="h-4 w-4" /> Volver al viaje
          </Link>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{flagEmoji}</span>
              <div>
                <h1
                  className="text-xl font-semibold text-white"
                  style={{ fontFamily: 'var(--font-fraunces)' }}
                >
                  Botiquín familiar
                </h1>
                <p className="text-teal-200 text-sm">{destino.nombre}</p>
              </div>
            </div>
            <div className="bg-white/10 rounded-2xl px-4 py-2 text-center">
              <p className="text-2xl font-bold text-white">{totalItems}</p>
              <p className="text-teal-200 text-xs">ítems</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-5 py-5 pb-28">

        {/* Tip intro */}
        <div className="bg-teal-50 border border-teal-100 rounded-2xl px-4 py-3 mb-5 flex items-start gap-2">
          <span className="text-base mt-0.5">✈️</span>
          <p className="text-xs text-teal-700 leading-relaxed">
            <strong>Tip de equipaje:</strong> Líquidos limitados a 100 ml en equipaje de mano.
            Llevar medicamentos en su envase original con prospecto. Consulta restricciones de tu aerolínea.
          </p>
        </div>

        {tieneNinos && (
          <div className="bg-amber-50 border border-amber-100 rounded-2xl px-4 py-3 mb-5 flex items-start gap-2">
            <span className="text-base mt-0.5">👶</span>
            <p className="text-xs text-amber-700 leading-relaxed">
              <strong>Viajas con niños:</strong> Incluimos sección pediátrica personalizada. Siempre verifica
              dosis con tu pediatra antes de viajar.
            </p>
          </div>
        )}

        {/* Secciones */}
        <div className="flex flex-col gap-4">
          {secciones.map((seccion) => (
            <div key={seccion.titulo} className={`rounded-2xl border p-4 ${seccion.color}`}>
              {/* Encabezado sección */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">{seccion.emoji}</span>
                <h2
                  className="font-semibold text-slate-800 text-sm"
                  style={{ fontFamily: 'var(--font-fraunces)' }}
                >
                  {seccion.titulo}
                </h2>
                <span className="ml-auto text-xs text-slate-400 font-medium">
                  {seccion.items.length} ítems
                </span>
              </div>

              {/* Items */}
              <div className="flex flex-col gap-2">
                {seccion.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-xl border border-slate-100 p-3.5"
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400 flex-shrink-0 mt-2" />
                      <div>
                        <p className="text-sm font-medium text-slate-800 leading-snug">
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
          <div className="mt-5 bg-gradient-to-r from-teal-600 to-teal-700 rounded-2xl p-5 flex items-center justify-between hover:from-teal-700 hover:to-teal-800 transition-all">
            <div>
              <p className="font-semibold text-white text-sm">¿Dudas sobre qué llevar?</p>
              <p className="text-teal-200 text-xs mt-0.5">Habla con un especialista en medicina del viajero</p>
            </div>
            <div className="text-2xl">👨‍⚕️</div>
          </div>
        </Link>

        {/* Disclaimer */}
        <p className="text-[11px] text-slate-400 text-center mt-5 leading-relaxed">
          Contenido basado en recomendaciones CDC y OPS para viajeros.
          No reemplaza prescripción médica. Ante signos de alarma, busca atención inmediata.
        </p>
      </main>
    </div>
  )
}
