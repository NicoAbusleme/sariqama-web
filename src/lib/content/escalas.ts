// ============================================================
// SARIQAMA — Información de países de escala
// Fuentes: CDC, IATA, Ministerios de Relaciones Exteriores
// Revisado: 2026-05
// ============================================================

export interface EscalaInfo {
  pais: string
  flag: string
  nivel_salud: 'bajo' | 'moderado' | 'alto'
  riesgos_salud: string[]           // Lista corta de riesgos relevantes para tránsito
  vacunas_recomendadas?: string[]   // Solo si aplica para el tránsito
  aduana: {
    visa: string                    // 'no_requerida' | 'esta' | 'requerida' | 'gratuita'
    visa_nota: string               // Texto descriptivo
    documentos: string[]            // Documentos que debes llevar
    restricciones: string[]         // Qué no puedes ingresar o debes declarar
    declarar_dinero?: string        // Monto a declarar si aplica
  }
  notas_transito?: string           // Consejo especial si es solo tránsito
}

// Mapa país → info (la clave coincide con la segunda parte del label "Ciudad, País")
const ESCALAS: Record<string, EscalaInfo> = {

  'Brasil': {
    pais: 'Brasil', flag: '🇧🇷', nivel_salud: 'alto',
    riesgos_salud: [
      'Dengue muy alto (todo el año)',
      'Fiebre amarilla: vacuna recomendada para zonas fuera de aeropuertos costeros',
      'Diarrea del viajero: moderable en aeropuertos, mayor riesgo si sales del recinto',
    ],
    vacunas_recomendadas: ['Fiebre amarilla', 'Hepatitis A', 'Tifoidea'],
    aduana: {
      visa: 'no_requerida',
      visa_nota: 'Chilenos y ciudadanos LATAM no requieren visa. Estadía máxima 90 días.',
      documentos: ['Pasaporte vigente (mínimo 6 meses de validez)', 'Formulario de salud si aplica'],
      restricciones: [
        'Prohibido ingresar frutas frescas, verduras y carnes sin certificado sanitario',
        'Declarar dinero en efectivo superior a USD 10.000 o equivalente',
        'Prohibidos productos de origen animal sin certificación',
      ],
      declarar_dinero: 'USD 10.000 o equivalente',
    },
    notas_transito: 'Si tu escala es solo en el aeropuerto, el riesgo de salud es bajo. El riesgo de dengue aumenta si sales del recinto.',
  },

  'Perú': {
    pais: 'Perú', flag: '🇵🇪', nivel_salud: 'moderado',
    riesgos_salud: [
      'Dengue moderado (Lima tiene bajo riesgo, zonas selváticas tienen riesgo alto)',
      'Diarrea del viajero: moderada en Lima',
      'Altura: Lima es costera, sin problema de altitud',
    ],
    aduana: {
      visa: 'no_requerida',
      visa_nota: 'Chilenos pueden ingresar con cédula de identidad vigente. Estadía máxima 183 días.',
      documentos: ['Cédula de identidad vigente o pasaporte'],
      restricciones: [
        'Prohibido ingresar alimentos frescos sin declaración sanitaria',
        'Declarar dinero en efectivo superior a USD 10.000',
        'Declarar objetos de valor o equipos electrónicos de alto costo',
      ],
      declarar_dinero: 'USD 10.000 o equivalente',
    },
    notas_transito: 'El aeropuerto Jorge Chávez (Lima) es hub principal de LATAM. Escala segura con bajo riesgo si permaneces en el terminal.',
  },

  'Colombia': {
    pais: 'Colombia', flag: '🇨🇴', nivel_salud: 'moderado',
    riesgos_salud: [
      'Dengue alto en zonas cálidas (Bogotá a 2.600 m.s.n.m. tiene riesgo mínimo)',
      'Malaria: solo en zonas rurales tropicales, no en Bogotá',
      'Diarrea del viajero: baja en Bogotá',
    ],
    aduana: {
      visa: 'no_requerida',
      visa_nota: 'Chilenos pueden ingresar con cédula de identidad vigente. Estadía máxima 90 días.',
      documentos: ['Cédula de identidad vigente o pasaporte'],
      restricciones: [
        'Prohibido ingresar productos de origen vegetal o animal sin certificado',
        'Declarar dinero en efectivo superior a USD 10.000',
      ],
      declarar_dinero: 'USD 10.000 o equivalente',
    },
    notas_transito: 'El Aeropuerto El Dorado (Bogotá) es hub importante. Ciudad de altitud, sin riesgo de dengue en el aeropuerto.',
  },

  'Panamá': {
    pais: 'Panamá', flag: '🇵🇦', nivel_salud: 'moderado',
    riesgos_salud: [
      'Dengue alto (todo el año, especialmente en zonas urbanas)',
      'Malaria: solo en zonas rurales fronterizas con Colombia, no en Ciudad de Panamá',
      'Agua: segura en el aeropuerto Tocumen',
    ],
    aduana: {
      visa: 'no_requerida',
      visa_nota: 'Chilenos no requieren visa. Estadía máxima 180 días.',
      documentos: ['Pasaporte vigente (mínimo 6 meses)', 'Pasaje de retorno o continuación'],
      restricciones: [
        'Prohibido ingresar frutas y vegetales frescos',
        'Declarar dinero en efectivo superior a USD 10.000',
      ],
      declarar_dinero: 'USD 10.000 o equivalente',
    },
    notas_transito: 'Copa Airlines hub. El aeropuerto Tocumen tiene zona de tránsito amplia. Riesgo mínimo si no sales del recinto.',
  },

  'EE.UU.': {
    pais: 'Estados Unidos', flag: '🇺🇸', nivel_salud: 'bajo',
    riesgos_salud: [
      'Riesgo sanitario muy bajo en aeropuertos y ciudades principales',
      'Sin enfermedades tropicales relevantes en ciudades de escala (Miami, Dallas, NY)',
    ],
    aduana: {
      visa: 'esta',
      visa_nota: 'Chilenos deben tramitar ESTA antes de viajar (autorización electrónica, USD 21, válida 2 años). No es visa pero es obligatoria. Tramitar en esta.cbp.dhs.gov',
      documentos: ['Pasaporte vigente (mínimo 6 meses)', 'ESTA aprobado (tramitar con anticipación)', 'Dirección de alojamiento en EE.UU.'],
      restricciones: [
        '⚠️ Prohibición estricta de frutas, verduras, carnes, lácteos y suelo',
        'Declarar dinero en efectivo o instrumentos monetarios superiores a USD 10.000',
        'Declarar todos los alimentos al llegar (incluso sellados)',
        'Equipos agrícolas o de camping deben declararse',
      ],
      declarar_dinero: 'USD 10.000 o equivalente',
    },
    notas_transito: '⚠️ Aunque sea escala, debes pasar por control migratorio y aduana de EE.UU. El ESTA es obligatorio incluso en tránsito. Tramítalo con al menos 72 horas de anticipación.',
  },

  'Argentina': {
    pais: 'Argentina', flag: '🇦🇷', nivel_salud: 'moderado',
    riesgos_salud: [
      'Dengue moderado (brotes estacionales en verano, especialmente NOA y Litoral)',
      'Buenos Aires tiene riesgo bajo, mayor riesgo en provincias del norte',
    ],
    aduana: {
      visa: 'no_requerida',
      visa_nota: 'Chilenos pueden ingresar con cédula de identidad vigente. Sin límite de días establecido (recíproco con Chile).',
      documentos: ['Cédula de identidad vigente o pasaporte'],
      restricciones: [
        'Prohibido ingresar frutas, verduras y productos cárnicos sin certificado SENASA',
        'Declarar dinero en efectivo superior a USD 10.000',
        'Límite de compras sin declarar: USD 500 por persona',
      ],
      declarar_dinero: 'USD 10.000 o equivalente',
    },
    notas_transito: 'El Aeropuerto Internacional Ezeiza es escala frecuente desde Chile. Ciudad cosmopolita con riesgo sanitario bajo.',
  },

  'España': {
    pais: 'España', flag: '🇪🇸', nivel_salud: 'bajo',
    riesgos_salud: [
      'Riesgo sanitario muy bajo — país europeo desarrollado',
      'Agua potable de alta calidad en Madrid y principales ciudades',
    ],
    aduana: {
      visa: 'no_requerida',
      visa_nota: 'Chilenos no requieren visa para ingresar a la Unión Europea (acuerdo de exención). Estadía máxima 90 días en zona Schengen.',
      documentos: ['Pasaporte vigente (mínimo 3 meses tras la fecha de salida planeada)'],
      restricciones: [
        'Prohibido ingresar carnes, lácteos y frutas desde fuera de la UE',
        'Declarar dinero en efectivo superior a EUR 10.000',
        'Límite duty-free desde fuera de UE: EUR 430 en vuelo',
      ],
      declarar_dinero: 'EUR 10.000 o equivalente',
    },
    notas_transito: 'El Aeropuerto de Madrid Barajas (MAD) es hub de Iberia. Zona Schengen — si llegas desde fuera de Europa, deberás pasar por control al entrar a España.',
  },

  'Puerto Rico': {
    pais: 'Puerto Rico (EE.UU.)', flag: '🇵🇷', nivel_salud: 'moderado',
    riesgos_salud: [
      'Dengue moderado (territorio caribeño con mosquitos Aedes)',
      'Zika: riesgo bajo actualmente, pero monitorear si hay brotes',
      'Agua potable segura en zona metropolitana',
    ],
    aduana: {
      visa: 'esta',
      visa_nota: 'Puerto Rico es territorio de EE.UU. — aplican las mismas reglas que volar a EE.UU. continental. ESTA obligatorio.',
      documentos: ['Pasaporte vigente', 'ESTA aprobado'],
      restricciones: [
        '⚠️ Mismas restricciones que EE.UU. continental',
        'Prohibición estricta de frutas, verduras y carnes',
        'Declarar dinero en efectivo superior a USD 10.000',
      ],
      declarar_dinero: 'USD 10.000 o equivalente',
    },
    notas_transito: 'Al ser territorio de EE.UU., se aplican las normas de aduana e inmigración estadounidenses. ESTA obligatorio aunque sea escala.',
  },

  'México': {
    pais: 'México', flag: '🇲🇽', nivel_salud: 'moderado',
    riesgos_salud: [
      'Dengue moderado-alto (especialmente en zonas tropicales, CDMX tiene riesgo bajo por altitud)',
      'Diarrea del viajero: riesgo alto — agua del grifo no recomendada en todo el país',
      'CDMX a 2.240 m.s.n.m.: sin riesgo de malaria ni dengue significativo',
    ],
    aduana: {
      visa: 'no_requerida',
      visa_nota: 'Chilenos no requieren visa. Estadía máxima 180 días. Formulario FMM requerido al llegar.',
      documentos: ['Pasaporte vigente o cédula de identidad', 'Formulario Migratorio Múltiple (FMM) — se entrega en el vuelo'],
      restricciones: [
        'Prohibido ingresar frutas, verduras, carnes y productos animales sin declaración',
        'Declarar dinero en efectivo superior a USD 10.000',
        'Declarar artículos con valor superior a USD 500',
      ],
      declarar_dinero: 'USD 10.000 o equivalente',
    },
    notas_transito: 'El aeropuerto AICM (CDMX) es hub de Aeroméxico. Si la escala es en CDMX, el riesgo de dengue es mínimo por la altitud de la ciudad.',
  },

  'El Salvador': {
    pais: 'El Salvador', flag: '🇸🇻', nivel_salud: 'alto',
    riesgos_salud: [
      'Dengue alto (todo el año)',
      'Malaria: riesgo bajo en zona metropolitana, moderado en zonas rurales',
      'Diarrea del viajero: moderada',
    ],
    aduana: {
      visa: 'no_requerida',
      visa_nota: 'Chilenos no requieren visa. Parte del acuerdo CA-4 (centroamérica). Estadía máxima 90 días.',
      documentos: ['Pasaporte vigente'],
      restricciones: [
        'Prohibido ingresar frutas, vegetales y productos animales sin certificación',
        'Declarar dinero en efectivo superior a USD 10.000',
      ],
      declarar_dinero: 'USD 10.000 o equivalente',
    },
    notas_transito: 'Aeropuerto Internacional Monseñor Romero. País dolarizado. Riesgo de dengue mayor si sales del aeropuerto.',
  },

  'Guatemala': {
    pais: 'Guatemala', flag: '🇬🇹', nivel_salud: 'alto',
    riesgos_salud: [
      'Dengue alto (especialmente en zonas bajas y costeras)',
      'Malaria: moderado en zonas rurales y selváticas',
      'Diarrea del viajero: moderada-alta',
    ],
    aduana: {
      visa: 'no_requerida',
      visa_nota: 'Chilenos no requieren visa. Parte del acuerdo CA-4 (centroamérica). Estadía máxima 90 días.',
      documentos: ['Pasaporte vigente'],
      restricciones: [
        'Prohibido ingresar frutas, vegetales y productos animales sin certificación',
        'Declarar dinero en efectivo superior a USD 10.000',
      ],
      declarar_dinero: 'USD 10.000 o equivalente',
    },
    notas_transito: 'Aeropuerto La Aurora (Ciudad de Guatemala). Riesgo de dengue si sales del aeropuerto. La ciudad capital tiene menor riesgo que zonas tropicales.',
  },
}

// Extrae el país del label "Ciudad, País"
export function getPaisFromLabel(label: string): string {
  const parts = label.split(', ')
  return parts[parts.length - 1] ?? label
}

export function getEscalaInfo(label: string): EscalaInfo | null {
  const pais = getPaisFromLabel(label)
  return ESCALAS[pais] ?? null
}

export const NIVEL_SALUD_META = {
  bajo:     { dot: 'bg-green-500', badge: 'bg-green-100 text-green-700', label: 'Riesgo bajo' },
  moderado: { dot: 'bg-amber-400', badge: 'bg-amber-100 text-amber-700', label: 'Riesgo moderado' },
  alto:     { dot: 'bg-red-500',   badge: 'bg-red-100 text-red-700',     label: 'Riesgo alto' },
}

export const VISA_META = {
  no_requerida: { icon: '✅', color: 'text-green-700', bg: 'bg-green-50 border-green-100' },
  esta:         { icon: '⚠️', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-100' },
  requerida:    { icon: '🚫', color: 'text-red-700',   bg: 'bg-red-50 border-red-100' },
  gratuita:     { icon: '✅', color: 'text-green-700', bg: 'bg-green-50 border-green-100' },
}
