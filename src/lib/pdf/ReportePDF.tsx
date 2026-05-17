// ─── IMPORTANTE ───────────────────────────────────────────────────────────────
// Este archivo solo se importa desde API routes (server-side).
// @react-pdf/renderer usa su propio renderer — no confundir con react-dom.
// ─────────────────────────────────────────────────────────────────────────────

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from '@react-pdf/renderer'

// ─── Tipos ────────────────────────────────────────────────────────────────────
interface Viajero {
  nombre: string
  edad: number
  es_nino: boolean
  condiciones?: string[]
}

interface ChecklistItem {
  tarea: string
  categoria: string
  completado: boolean
  prioridad: string
  descripcion?: string | null
}

interface Riesgos {
  dengue?: string
  malaria?: string
  fiebre_amarilla?: string
  diarrea_viajero?: string
  agua_alimentos?: string
  sol_calor?: string
  rabia_animales?: string
  seguridad_acuatica?: string
  notas_pediatricas?: string
}

export interface ReporteData {
  familiaNombre: string
  destinoNombre: string
  destinoPais: string
  fechaSalida: string
  fechaRegreso: string
  tipos: string[]
  viajeros: Viajero[]
  riesgos: Riesgos
  vacunasRecomendadas: string[]
  vacunasRequeridas: string[]
  checklist: ChecklistItem[]
  generadoEn: string
}

// ─── Estilos ──────────────────────────────────────────────────────────────────
const C = {
  teal:      '#0D9488',
  tealDark:  '#134E4A',
  tealLight: '#CCFBF1',
  tealBg:    '#F0FDF9',
  amber:     '#D97706',
  amberBg:   '#FEF3C7',
  red:       '#DC2626',
  redBg:     '#FEE2E2',
  green:     '#16A34A',
  greenBg:   '#DCFCE7',
  slate900:  '#0F172A',
  slate700:  '#334155',
  slate500:  '#64748B',
  slate300:  '#CBD5E1',
  slate100:  '#F1F5F9',
  white:     '#FFFFFF',
}

const RIESGO_COLOR: Record<string, { bg: string; text: string; label: string }> = {
  alto:      { bg: C.redBg,   text: C.red,   label: 'ALTO' },
  moderado:  { bg: C.amberBg, text: C.amber, label: 'MODERADO' },
  bajo:      { bg: C.greenBg, text: C.green, label: 'BAJO' },
  no_aplica: { bg: C.slate100, text: C.slate500, label: 'NO APLICA' },
}

const CATEGORIA_LABEL: Record<string, string> = {
  vacunas:    'Vacunas',
  botiquin:   'Botiquín',
  documentos: 'Documentos',
  repelente:  'Protección',
  seguro:     'Seguro de viaje',
  otros:      'Otros',
}

const CONDICION_LABEL: Record<string, string> = {
  alergia:         'Alergia',
  asma:            'Asma',
  diabetes:        'Diabetes',
  cardiopatia:     'Cardiopatía',
  inmunosupresion: 'Inmunosupresión',
  embarazo:        'Embarazo',
}

const s = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    backgroundColor: C.white,
    paddingBottom: 60,
  },

  // ── Header ──
  header: {
    backgroundColor: C.tealDark,
    paddingHorizontal: 36,
    paddingTop: 28,
    paddingBottom: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  logo: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    color: C.white,
    letterSpacing: 2,
  },
  logoSub: {
    fontSize: 8,
    color: '#99F6E4',
    letterSpacing: 1,
    marginTop: 2,
  },
  headerDate: {
    fontSize: 9,
    color: '#99F6E4',
    textAlign: 'right',
  },
  headerDestino: {
    fontSize: 22,
    fontFamily: 'Helvetica-Bold',
    color: C.white,
    marginBottom: 4,
  },
  headerFamilia: {
    fontSize: 11,
    color: '#99F6E4',
    marginBottom: 10,
  },
  headerDates: {
    fontSize: 10,
    color: '#99F6E4',
  },

  // ── Pills ──
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 8,
  },
  pill: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
    fontSize: 8,
    color: C.white,
  },

  // ── Body ──
  body: {
    paddingHorizontal: 36,
    paddingTop: 24,
  },

  // ── Sección ──
  seccion: {
    marginBottom: 20,
  },
  seccionTitulo: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: C.tealDark,
    borderBottomWidth: 1.5,
    borderBottomColor: C.teal,
    paddingBottom: 4,
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // ── Viajeros ──
  viajerosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  viajeroCard: {
    backgroundColor: C.tealBg,
    borderRadius: 6,
    padding: 10,
    width: '48%',
  },
  viajeroNombre: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: C.slate900,
    marginBottom: 2,
  },
  viajeroEdad: {
    fontSize: 9,
    color: C.slate500,
    marginBottom: 6,
  },
  condicionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 3,
  },
  condicionChip: {
    backgroundColor: C.amberBg,
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 2,
    fontSize: 7,
    color: C.amber,
  },

  // ── Riesgos ──
  riesgoTable: {
    flexDirection: 'column',
    gap: 4,
  },
  riesgoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 5,
    paddingHorizontal: 8,
    backgroundColor: C.slate100,
    borderRadius: 4,
  },
  riesgoLabel: {
    fontSize: 9,
    color: C.slate700,
    flex: 1,
  },
  riesgoBadge: {
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  riesgoBadgeText: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
  },

  // ── Vacunas ──
  vacunaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  vacunaChip: {
    borderRadius: 10,
    paddingHorizontal: 9,
    paddingVertical: 3,
    fontSize: 8.5,
  },

  // ── Checklist ──
  checkGrupo: {
    marginBottom: 12,
  },
  checkGrupoTitulo: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: C.teal,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 7,
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: 4,
    marginBottom: 2,
  },
  checkBox: {
    width: 11,
    height: 11,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: C.slate300,
    flexShrink: 0,
    marginTop: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkBoxDone: {
    backgroundColor: C.teal,
    borderColor: C.teal,
  },
  checkMark: {
    fontSize: 7,
    color: C.white,
    fontFamily: 'Helvetica-Bold',
  },
  checkTarea: {
    fontSize: 9,
    color: C.slate700,
    flex: 1,
    lineHeight: 1.4,
  },
  checkTareaDone: {
    color: C.slate300,
  },
  prioridadDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    flexShrink: 0,
    marginTop: 3.5,
  },

  // ── Notas pediátricas ──
  notaBox: {
    backgroundColor: C.amberBg,
    borderRadius: 6,
    padding: 10,
    marginTop: 8,
  },
  notaTitulo: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: C.amber,
    marginBottom: 4,
  },
  notaTexto: {
    fontSize: 8.5,
    color: '#92400E',
    lineHeight: 1.5,
  },

  // ── Footer ──
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: C.tealDark,
    paddingHorizontal: 36,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerTexto: {
    fontSize: 7.5,
    color: '#99F6E4',
  },
  footerBold: {
    fontFamily: 'Helvetica-Bold',
    color: C.white,
  },
  pageNumber: {
    fontSize: 7.5,
    color: '#99F6E4',
  },
})

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatFecha(iso: string) {
  try {
    return new Date(iso).toLocaleDateString('es-CL', {
      day: 'numeric', month: 'long', year: 'numeric',
    })
  } catch { return iso }
}

function RiesgoBadge({ nivel }: { nivel: string }) {
  const c = RIESGO_COLOR[nivel] ?? RIESGO_COLOR['no_aplica']
  return (
    <View style={[s.riesgoBadge, { backgroundColor: c.bg }]}>
      <Text style={[s.riesgoBadgeText, { color: c.text }]}>{c.label}</Text>
    </View>
  )
}

const RIESGOS_INFO = [
  { key: 'dengue',           label: 'Dengue' },
  { key: 'malaria',          label: 'Malaria' },
  { key: 'fiebre_amarilla',  label: 'Fiebre amarilla' },
  { key: 'diarrea_viajero',  label: 'Diarrea del viajero' },
  { key: 'agua_alimentos',   label: 'Agua y alimentos' },
  { key: 'sol_calor',        label: 'Sol y calor' },
  { key: 'rabia_animales',   label: 'Rabia / animales' },
  { key: 'seguridad_acuatica', label: 'Seguridad acuática' },
]

const TIPO_LABEL: Record<string, string> = {
  playa:    'Playa',
  urbano:   'Ciudad',
  aventura: 'Aventura',
  rural:    'Rural',
  familiar: 'Familiar',
  crucero:  'Crucero',
}

const PRIORIDAD_COLOR: Record<string, string> = {
  alta:  C.red,
  media: C.amber,
  baja:  C.slate300,
}

// ─── Documento ────────────────────────────────────────────────────────────────
export function ReportePDF({ data }: { data: ReporteData }) {
  const categorias = [...new Set(data.checklist.map(i => i.categoria))]
    .filter(cat => data.checklist.some(i => i.categoria === cat))

  const tieneNinos = data.viajeros.some(v => v.es_nino)

  return (
    <Document
      title={`SARIQAMA — Reporte ${data.destinoNombre}`}
      author="SARIQAMA"
      subject="Reporte familiar de salud del viajero"
    >
      <Page size="A4" style={s.page}>

        {/* ── Header ── */}
        <View style={s.header}>
          <View style={s.headerTop}>
            <View>
              <Text style={s.logo}>SARIQAMA</Text>
              <Text style={s.logoSub}>REPORTE FAMILIAR DE SALUD DEL VIAJERO</Text>
            </View>
            <Text style={s.headerDate}>Generado: {data.generadoEn}</Text>
          </View>

          <Text style={s.headerDestino}>{data.destinoNombre}</Text>
          <Text style={s.headerFamilia}>Familia {data.familiaNombre}</Text>
          <Text style={s.headerDates}>
            {formatFecha(data.fechaSalida)} → {formatFecha(data.fechaRegreso)}
          </Text>

          {data.tipos.length > 0 && (
            <View style={s.pillRow}>
              {data.tipos.map(t => (
                <View key={t} style={s.pill}>
                  <Text>{TIPO_LABEL[t] ?? t}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* ── Body ── */}
        <View style={s.body}>

          {/* ── Perfil familiar ── */}
          <View style={s.seccion}>
            <Text style={s.seccionTitulo}>Perfil familiar</Text>
            <View style={s.viajerosGrid}>
              {data.viajeros.map((v, i) => (
                <View key={i} style={s.viajeroCard}>
                  <Text style={s.viajeroNombre}>{v.nombre}</Text>
                  <Text style={s.viajeroEdad}>
                    {v.edad} años{v.es_nino ? '  ·  Niño/a' : '  ·  Adulto/a'}
                  </Text>
                  {v.condiciones && v.condiciones.length > 0 && (
                    <View style={s.condicionRow}>
                      {v.condiciones.map(c => (
                        <View key={c} style={s.condicionChip}>
                          <Text>{CONDICION_LABEL[c] ?? c}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              ))}
            </View>
          </View>

          {/* ── Riesgos del destino ── */}
          <View style={s.seccion}>
            <Text style={s.seccionTitulo}>Riesgos del destino — {data.destinoPais}</Text>
            <View style={s.riesgoTable}>
              {RIESGOS_INFO.map(r => {
                const nivel = (data.riesgos as Record<string, string>)[r.key]
                if (!nivel || nivel === 'no_aplica') return null
                return (
                  <View key={r.key} style={s.riesgoRow}>
                    <Text style={s.riesgoLabel}>{r.label}</Text>
                    <RiesgoBadge nivel={nivel} />
                  </View>
                )
              })}
            </View>

            {/* Notas pediátricas */}
            {tieneNinos && data.riesgos.notas_pediatricas && (
              <View style={s.notaBox}>
                <Text style={s.notaTitulo}>Consideraciones para niños</Text>
                <Text style={s.notaTexto}>{data.riesgos.notas_pediatricas}</Text>
              </View>
            )}
          </View>

          {/* ── Vacunas ── */}
          {(data.vacunasRecomendadas.length > 0 || data.vacunasRequeridas.length > 0) && (
            <View style={s.seccion}>
              <Text style={s.seccionTitulo}>Vacunas</Text>
              <View style={s.vacunaRow}>
                {data.vacunasRequeridas.map(v => (
                  <View key={v} style={[s.vacunaChip, { backgroundColor: C.redBg }]}>
                    <Text style={{ color: C.red, fontFamily: 'Helvetica-Bold', fontSize: 8.5 }}>
                      {v} ⚠ REQUERIDA
                    </Text>
                  </View>
                ))}
                {data.vacunasRecomendadas.map(v => (
                  <View key={v} style={[s.vacunaChip, { backgroundColor: C.greenBg }]}>
                    <Text style={{ color: C.green, fontSize: 8.5 }}>{v}</Text>
                  </View>
                ))}
              </View>
              <Text style={{ fontSize: 8, color: C.slate500, marginTop: 6, lineHeight: 1.5 }}>
                Consulta con un médico especialista en salud del viajero con al menos 4–6 semanas de anticipación.
              </Text>
            </View>
          )}

          {/* ── Checklist ── */}
          {data.checklist.length > 0 && (
            <View style={s.seccion}>
              <Text style={s.seccionTitulo}>
                Checklist pre-viaje — {data.checklist.filter(i => i.completado).length}/{data.checklist.length} completados
              </Text>
              {categorias.map(cat => {
                const items = data.checklist.filter(i => i.categoria === cat)
                return (
                  <View key={cat} style={s.checkGrupo}>
                    <Text style={s.checkGrupoTitulo}>
                      {CATEGORIA_LABEL[cat] ?? cat}
                    </Text>
                    {items.map((item, idx) => (
                      <View key={idx} style={[s.checkItem, { backgroundColor: item.completado ? '#F0FDF9' : C.white }]}>
                        {/* Dot de prioridad */}
                        <View style={[s.prioridadDot, { backgroundColor: PRIORIDAD_COLOR[item.prioridad] ?? C.slate300 }]} />
                        {/* Checkbox */}
                        <View style={item.completado ? [s.checkBox, s.checkBoxDone] : s.checkBox}>
                          {item.completado && <Text style={s.checkMark}>✓</Text>}
                        </View>
                        {/* Texto */}
                        <Text style={item.completado ? [s.checkTarea, s.checkTareaDone] : s.checkTarea}>
                          {item.tarea}
                        </Text>
                      </View>
                    ))}
                  </View>
                )
              })}
            </View>
          )}

          {/* ── Fuente ── */}
          <View style={{ backgroundColor: C.slate100, borderRadius: 6, padding: 10, marginTop: 4 }}>
            <Text style={{ fontSize: 8, color: C.slate500, lineHeight: 1.6 }}>
              <Text style={{ fontFamily: 'Helvetica-Bold' }}>Fuente clínica: </Text>
              CDC Yellow Book 2026. Información revisada por equipo SARIQAMA.{'\n'}
              <Text style={{ fontFamily: 'Helvetica-Bold' }}>Aviso importante: </Text>
              Este reporte entrega orientación sanitaria basada en fuentes clínicas validadas.
              No reemplaza una evaluación médica profesional. Ante signos de alarma, busca atención médica de inmediato.
            </Text>
          </View>

        </View>

        {/* ── Footer ── */}
        <View style={s.footer} fixed>
          <Text style={s.footerTexto}>
            <Text style={s.footerBold}>SARIQAMA</Text>
            {'  ·  '}sariqama.com{'  ·  '}hola@sariqama.com
          </Text>
          <Text
            style={s.pageNumber}
            render={({ pageNumber, totalPages }) => `Página ${pageNumber} de ${totalPages}`}
          />
        </View>

      </Page>
    </Document>
  )
}
