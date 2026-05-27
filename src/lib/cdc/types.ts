// ============================================
// SARIQAMA — CDC Travel Notices RSS types
// https://wwwnc.cdc.gov/travel/rss/notices.xml
// ============================================

export type CdcAlertLevel = 1 | 2 | 3

export interface CdcNotice {
  title: string          // Título original del CDC en inglés
  titleEs: string        // Título traducido/simplificado al español
  disease: string        // Enfermedad extraída del título
  level: CdcAlertLevel
  levelLabel: string     // "Watch" | "Alert" | "Warning"
  description: string    // Texto de la alerta (CDATA)
  link: string           // URL al aviso completo en CDC
  pubDate: string        // Fecha de publicación ISO
  pubDateFormatted: string // Fecha formateada en español
  isRegional: boolean    // true si aplica por región (no específico del país)
}
