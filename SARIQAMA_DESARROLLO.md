# SARIQAMA — Documentación de Desarrollo

> Archivo vivo — se actualiza al final de cada sesión de trabajo.
> Última actualización: 2026-07-09 (Sesión 14)

---

## 🌿 ¿Qué es SARIQAMA?

Plataforma web de **salud del viajero** para familias latinoamericanas.
Acompaña antes, durante y después de viajes a destinos tropicales con:
- Checklists sanitarios personalizados
- Evaluación de riesgos por destino
- Semáforo clínico de síntomas (adultos y niños)
- Orientación médica profesional (teleorientación)

**Promesa central:** "Prepara la salud de tu familia antes de viajar"
**Posicionamiento:** Salud del viajero — no turismo, no diagnóstico
**Disclaimer obligatorio:** SARIQAMA entrega orientación sanitaria. No reemplaza evaluación médica profesional.

---

## 👨‍👩‍👧 Usuario objetivo

- Familias chilenas/LATAM con hijos
- Viajan a Brasil, Caribe, Centroamérica, México
- 30-50 años, planificadores, valoran la prevención
- Validado: 88.5% evalúa utilidad 4-5/5 (encuesta 87 personas)

---

## 🏗️ Stack tecnológico

| Capa | Tecnología | Por qué |
|------|-----------|---------|
| Frontend | Next.js 15 + TypeScript | SSR, API routes, deploy fácil |
| Estilos | Tailwind CSS + shadcn/ui | UI rápida y consistente |
| Base de datos | Supabase (Postgres) | Auth + BD + RLS gratis |
| IA (Fase 3) | Claude API (Anthropic) | AI Advisor con guardrails |
| Deploy | Vercel | Auto-deploy desde GitHub |
| Repositorio | GitHub (privado) | Control de versiones |
| Dominio | sariqama.com (Bluehosting) | DNS apuntando a Vercel |
| Correos | Bluehosting | hola@sariqama.com |

---

## 🔗 URLs y accesos importantes

| Servicio | URL / Dato |
|---------|-----------|
| Sitio web (Vercel) | sariqama-web.vercel.app |
| Dominio propio | sariqama.com (propagando DNS) |
| Repositorio GitHub | github.com/NicoAbusleme/sariqama-web |
| Supabase proyecto | bivwxnpqjrnwntnqbgok.supabase.co |
| Supabase dashboard | supabase.com → proyecto sariqama |
| Vercel dashboard | vercel.com → proyecto sariqama-web |

---

## 📁 Estructura del proyecto

```
PROYECTOS/TROPICARE/
├── Documentos/                        → Docs originales del proyecto
│   ├── PITCH TROPICARE.docx
│   ├── TROPICARE_documento_fundador.docx
│   ├── CANVAS.docx
│   ├── TROPICARE_Roadmap_Informatico_y_Contenido.docx
│   └── ROADMAP_TROPICARE_CONTENIDO_MVP.docx
├── SARIQAMA_DESARROLLO.md             → Este archivo
└── web/                               → Código fuente
    ├── .env.local                     → Variables de entorno (NO subir a Git)
    ├── src/
    │   ├── app/
    │   │   ├── page.tsx               → Landing page pública
    │   │   ├── layout.tsx             → Layout raíz con metadata
    │   │   ├── (auth)/
    │   │   │   ├── login/page.tsx     → Login funcional
    │   │   │   └── registro/page.tsx  → Registro funcional
    │   │   ├── (app)/
    │   │   │   ├── onboarding/page.tsx → Onboarding multi-paso
    │   │   │   ├── dashboard/page.tsx  → Dashboard con datos reales
    │   │   │   ├── viaje/nuevo/        → [POR CONSTRUIR]
    │   │   │   ├── viaje/[id]/         → [POR CONSTRUIR]
    │   │   │   ├── advisor/            → [POR CONSTRUIR - Fase 3]
    │   │   │   ├── teleorientacion/    → [POR CONSTRUIR]
    │   │   │   └── perfil/             → [POR CONSTRUIR]
    │   │   ├── actions/
    │   │   │   ├── auth.ts            → registrar, iniciarSesion, cerrarSesion
    │   │   │   └── familia.ts         → agregarViajeros
    │   │   └── admin/                 → [POR CONSTRUIR - Fase 3]
    │   ├── middleware.ts              → Protección de rutas con Supabase
    │   ├── components/
    │   │   └── ui/                    → 18 componentes shadcn/ui
    │   ├── lib/
    │   │   ├── supabase/
    │   │   │   ├── client.ts          → Cliente browser
    │   │   │   └── server.ts          → Cliente server
    │   │   ├── clinical/
    │   │   │   └── semaforo.ts        → Lógica determinística del semáforo
    │   │   └── content/
    │   │       └── destinos.ts        → 4 destinos piloto (CDC Yellow Book 2026)
    │   └── types/
    │       └── index.ts               → Tipos TypeScript del dominio
    └── package.json                   → sariqama-web v0.1.0
```

---

## 🗄️ Base de datos — Supabase

### Tablas creadas

| Tabla | Campos principales | Relación |
|-------|-------------------|----------|
| `familias` | id, user_id, nombre, **plan** | 1 por cuenta |
| `viajeros` | id, familia_id, nombre, **apellido**, edad, es_nino, **sexo**, **genero**, condiciones[], **inmunosupresion_tipo**, **vih_carga_viral**, **embarazo_fum** | N por familia |
| `viajes` | id, familia_id, destino_slug, destino_nombre, fecha_salida, fecha_regreso, tipo, tipos[], escalas jsonb, **seguro_viaje**, **seguro_compania** | N por familia |
| `checklist_items` | id, viaje_id, tarea, categoria, completado, prioridad | N por viaje |
| `sintomas_log` | id, viaje_id, viajero_id, sintomas[], semaforo, fiebre | N por viaje |
| `teleorientaciones` | id, familia_id, viaje_id, motivo, urgencia, estado, pago_estado | N por familia |

### Seguridad
- **RLS activado** en todas las tablas
- Cada familia solo ve sus propios datos
- Políticas basadas en `auth.uid()` de Supabase

---

## 🔐 Variables de entorno

```bash
# En .env.local (local) y Vercel (producción)
NEXT_PUBLIC_SUPABASE_URL=https://bivwxnpqjrnwntnqbgok.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[ver .env.local]
SUPABASE_SERVICE_ROLE_KEY=[configurado en Vercel — necesario para eliminarCuenta y registro]
ANTHROPIC_API_KEY=[pendiente — agregar en Fase 3]
NEXT_PUBLIC_APP_URL=https://sariqama.com
NEXT_PUBLIC_APP_NAME=SARIQAMA
```

---

## 🗺️ Roadmap del MVP

### ✅ Fase 0 — Setup (COMPLETADA — 2026-05-11)
- [x] Proyecto Next.js 15 creado
- [x] Tailwind + shadcn/ui configurados
- [x] 18 componentes UI instalados
- [x] Tipos TypeScript del dominio
- [x] Lógica del semáforo clínico (determinística)
- [x] 4 destinos piloto con datos CDC Yellow Book 2026
- [x] Clientes Supabase (browser + server)
- [x] Repositorio GitHub configurado
- [x] Deploy en Vercel
- [x] DNS Bluehosting → Vercel configurado
- [x] Base de datos Supabase con 6 tablas + RLS
- [x] Auth de Supabase activado

### ✅ Fase 1 — Auth y Onboarding (COMPLETADA — 2026-05-11)
- [x] Middleware de protección de rutas
- [x] Registro funcional (crea usuario + familia en Supabase)
- [x] Login funcional con manejo de errores
- [x] Onboarding multi-paso (integrantes + condiciones médicas)
- [x] Dashboard dinámico con datos reales
- [x] Cerrar sesión

### ✅ Rediseño sistema de diseño (COMPLETADO — 2026-05-12)
- [x] Fuentes: DM Sans (cuerpo) + Fraunces (títulos serif)
- [x] Paleta de color: teal primario, fondo #F0FDF9, amber para CTAs
- [x] Landing page: hero gradiente oscuro, logo glassmorphism, pills, stats
- [x] Login/Registro: fondo gradiente teal, card blanca con bordes redondeados
- [x] Dashboard: header gradiente, bottom navigation, quick actions
- [x] Componente RiskChip (chips de riesgo color-coded)
- [x] Componente AppShell (layout con bottom nav reutilizable)

### ⚠️ Deuda técnica
- [ ] **Login con Google (OAuth)** — requiere Google Cloud Console + activar provider en Supabase. Diferido para después del piloto.

### ✅ Fase 1 — Semana 1 (COMPLETADA — 2026-05-12)
- [x] Creador de viaje multi-paso (destino, escalas, fechas, tipo)
- [x] Ficha de riesgos por destino (CDC Yellow Book 2026)
- [x] Página de detalle de viaje con progreso checklist

### ✅ Fase 1 — Semana 2 (COMPLETADA — 2026-05-12)
- [x] Checklist pre-viaje con toggle optimista, agrupado por categoría
- [x] Botiquín familiar adulto/niño, adaptado por destino
- [x] Eliminar viaje con confirmación inline

### ✅ Fase 1 — Semana 3 (COMPLETADA — 2026-05-12)
- [x] Symptom Checker unificado adulto + niño (semáforo determinístico)
- [x] Guardado de evaluaciones en sintomas_log con historial expandible
- [x] Opción "Otro / Invitado" con nombre libre y toggle pediátrico
- [x] Escalas en viajes: select por destino + riesgos de salud + aduana por país

### ✅ Fase 1 — Semana 4 — UX y navegación (COMPLETADA — 2026-05-13)
- [x] Reorganización destinos: selector 3 etapas (continente → país → ciudad)
- [x] 5 destinos con ciudades: México, Costa Rica, Rep. Dominicana, Brasil, Chile (nuevo)
- [x] Banderas reales via flagcdn.com (componente FlagImg — resuelve problema Windows)
- [x] Bottom nav global en todas las páginas via (app)/layout.tsx
- [x] Fix nav: "Viaje" abre viaje existente, "Síntomas" solo activo en su página
- [x] Página /perfil completa (familia, viajeros, historial viajes, cuenta, acerca de)
- [x] Página /perfil/agregar-viajero (formulario agregar integrante)
- [x] Fix header dashboard: botón ⚙️ → /perfil (antes era cerrar sesión con ícono 👤)

### ✅ Semana 5 — Modelo freemium + paywalls (COMPLETADA — 2026-05-16)
- [x] Adopción modelo freemium 3 niveles (Exploración / Preparación Total / Acompañamiento)
- [x] Migración SQL ejecutada: `ALTER TABLE familias ADD COLUMN plan text DEFAULT 'gratis'`
- [x] Componente `<PlanGate>` y `<PlanBanner>` — paywall reutilizable con CTA de upgrade
- [x] Checklist: vacunas + documentos gratis, resto bloqueado con PlanBanner (Nivel 2)
- [x] Botiquín: gateado completamente detrás de Nivel 2 (Preparación Total)
- [x] Síntomas: gateado completamente detrás de Nivel 3 (Acompañamiento)
- [x] Página `/precios`: 3 planes con features, precios y CTA por email (piloto sin gateway)
- [x] Página `/teleorientacion`: formulario motivo + urgencia + nota → mailto prellenado
- [x] Reporte familiar PDF descargable — `@react-pdf/renderer` + API route `/api/reporte/[viajeId]`
- [x] Landing actualizada con la propuesta de 3 niveles, "Cómo funciona" y testimonios

### ✅ Sesiones 6–7 — Perfil avanzado, bugs y seguro de viaje (COMPLETADA — 2026-05-18)
- [x] Fix: teleorientación ahora gateada correctamente detrás de Nivel 3 (era accesible sin plan)
- [x] Fix: emoji médico cambiado a 👩‍⚕️ (antes 👨‍⚕️) en toda la app
- [x] Eliminación de cuenta desde /perfil con confirmación en 2 pasos (`EliminarCuentaBtn`)
- [x] `createAdminClient()` con `SUPABASE_SERVICE_ROLE_KEY` para eliminar auth user (resuelve email bloqueado post-eliminación)
- [x] Fix registro: usa adminClient para INSERT en familias (evita fallo por RLS/sesión)
- [x] Fix registro: redirect a /onboarding solo si `data.user` no es null
- [x] Fix onboarding: campo "Nombre de la familia" + `agregarViajeros` crea familia si no existe (recuperación de registro incompleto)
- [x] Fix botón "Guardar" en agregar-viajero tapado por BottomNav → `bottom-[72px]`
- [x] Viajeros: campo **apellido** (opcional) en onboarding y agregar-viajero
- [x] Viajeros: **sexo biológico** (femenino/masculino/intersex/prefiero no indicar) — pills teal
- [x] Viajeros: **identidad de género** (mujer/hombre/no binario/género fluido/otro/prefiero no indicar) — pills violet
- [x] Viajeros: **inmunosupresión por categoría** (VIH/cáncer/trasplante/autoinmune/corticoides/otra) con subpregunta de carga viral si VIH
- [x] Viajeros: **embarazo con FUM** — calcula semanas al instante, alerta ≥28 semanas (certificado médico) y ≥36 semanas (NO viajar / aerolínea)
- [x] Viaje detalle: calcula semanas de embarazo a la **fecha de salida** del viaje y muestra tarjeta de advertencia/crítico
- [x] Creación de viaje: **Step 4 de seguro médico** (sí/no/no decidido) con campo de compañía aseguradora opcional, avisos contextuales según respuesta
- [x] Migraciones SQL ejecutadas (ver tabla abajo)

### ✅ Sesión 11 — Redesign "Clinical Calm" completo (COMPLETADA — 2026-06-02)
- [x] Design system tokens renovados: `--surface`, `--border-default`, `--text-*`, `--risk-*`
- [x] Background principal cambiado a `#FFFFFF` (blanco puro, más clínico)
- [x] Shadow scale revisada (`--shadow-card`, `--shadow-elevated`) — más sutil
- [x] Nueva clase `.card-clinical` (borde 1px + sombra mínima)
- [x] Nueva clase `.icon-action` (círculo teal para quick actions)
- [x] `bottom-nav`: emoji reemplazados por Lucide icons (Home/Plane/Thermometer/User), indicador activo como línea teal en top
- [x] `risk-chip`: dot de color + fondo muy sutil por nivel de riesgo (sin píldora opaca)
- [x] `collapsible-section`: `accentDot` en vez de borde izquierdo, separador interno entre header y contenido
- [x] `app-shell`: header sin blur frosted glass → blanco sólido con borde 1px nítido
- [x] Dashboard: header navy gradiente eliminado → header blanco con saludo + avatar inicial navy, viajeros como chips teal-tinted, viaje activo con progress bar teal, quick actions con Lucide icons (sin emoji ni gradientes de color)
- [x] Viaje `[id]`: header limpio con flag + título + días, barra de progreso integrada, acciones con Lucide icons, CTA teleorientación en navy sólido
- [x] Checklist: categorías con Lucide icons + dot acento, progress bar teal, items con checkbox circular animado, prioridad como dot de color
- [x] Perfil: header navy gradiente → avatar navy con initial + anillo teal sutil, section labels estandarizados

### ✅ Sesiones 8–9 — Clínica avanzada, identidad visual y logo (COMPLETADA — 2026-05-26)
- [x] Registro de alergias multi-nivel (tipo alimentaria/rinitis/fármacos + sub-tipos: huevo, PLV, fármaco libre)
- [x] Migraciones SQL: `alergia_tipos text[], alergia_huevo boolean, alergia_plv boolean, alergia_farmacos_cuales text`
- [x] 5 fixes clínicos en página de riesgos (ver Sesión 8)
- [x] 4 fixes adicionales clínicos (ver Sesión 9)
- [x] Paleta de color completamente alineada al logo (navy/teal/gold/terracotta)
- [x] Logo SARIQAMA integrado en navbar, login, registro, onboarding, landing y términos
- [x] Favicon automático vía `src/app/icon.png` (Next.js App Router)
- [x] Todos los elementos teal del sistema anterior reemplazados por `#2D9E8C` (23 archivos)

### ⏳ Pendientes inmediatos (próxima sesión)
- [x] **⚠️ Upstash** — configurar `UPSTASH_REDIS_REST_URL` y `UPSTASH_REDIS_REST_TOKEN` en Vercel para activar rate limiting en producción ✅ COMPLETADO 2026-07-09
- [ ] **Editar destino de viaje** — excluido intencionalmente (requiere decidir si regenerar checklist y perder el progreso)
- [x] **🔐 Seguridad Fase B** — rate limiting 5 intentos/IP/15 min + mensajes de error genéricos — COMPLETADO Sesión 14
- [x] **Editar perfil de viajero** — COMPLETADO Sesión 14
- [x] **Editar viaje** — COMPLETADO Sesión 14 (fechas, tipos, seguro)
- [x] **🔐 Seguridad Fase A** — cifrado AES-256-GCM de campos médicos CRÍTICOS — COMPLETADO Sesión 14

### 🔲 Fase 2 — MVP funcional
- [ ] Integración pasarela de pago (MercadoPago o Stripe — decidir post-piloto)
- [ ] **Integrar TuGo API** como fuente de datos clínicos por destino (diario, automatizado)
- [ ] **Integrar CDC RSS Travel Notices** para alertas de brotes en tiempo real
- [ ] Seguimiento post-viaje 30 días (Nivel 3)
- [ ] Diario de síntomas durante el viaje
- [ ] Analytics básico (PostHog)
- [ ] Login con Google (OAuth) — requiere Google Cloud Console
- [ ] Reemplazar testimonios placeholder por testimonios reales del piloto

### 🔲 Fase 3 — IA y piloto
- [ ] AI Health Advisor (Claude API con guardrails)
- [ ] Panel admin CRUD destinos/contenido clínico
- [ ] Piloto cerrado 36 familias
- [ ] Partnership con aseguradora de viaje (datos de `seguro_viaje` disponibles para segmentación)

---

## 🔐 Estrategia de Seguridad — Cifrado y protección de datos de salud

> Añadida en Sesión 14 — 2026-07-09
> SARIQAMA maneja datos de salud de alta sensibilidad (VIH, embarazo, inmunosupresión, síntomas).
> Esta sección define la estrategia de seguridad obligatoria antes del piloto.

---

### Por qué es crítico

Los datos almacenados incluyen:
- **VIH y carga viral** — máxima discriminación potencial
- **Embarazo con FUM** — dato sensible laboral y personal
- **Inmunosupresión y condiciones médicas** — alta discriminación
- **Historial de síntomas** — dato clínico personal
- **Detalles de teleorientación** — descripción libre de casos médicos

Sin cifrado adicional, cualquier acceso no autorizado a Supabase (brecha, credencial filtrada, error de RLS) expone estos datos en texto plano.

---

### Arquitectura de seguridad (3 capas)

```
┌─────────────────────────────────────────────────────────────┐
│  Capa 1 — Transporte          HTTPS (Vercel) + Headers HTTP │
│  Capa 2 — Acceso              Supabase RLS + JWT Auth       │
│  Capa 3 — Datos (NUEVA)       AES-256-GCM app-level encrypt │
└─────────────────────────────────────────────────────────────┘
```

Las capas 1 y 2 ya están implementadas. **La capa 3 es el trabajo pendiente.**

---

### Capa 3 — Cifrado AES-256-GCM a nivel de aplicación

**Algoritmo elegido:** AES-256-GCM
- Cifrado autenticado: detecta si el dato fue manipulado (integridad garantizada)
- Sin dependencias externas: usa `node:crypto` nativo de Node.js
- IV aleatorio por campo: cada escritura genera un vector de inicialización único

**Formato almacenado en BD:**
```
base64(iv):base64(authTag):base64(ciphertext)
```

**Variable de entorno necesaria:**
```bash
# .env.local + Vercel (32 bytes hex = 64 caracteres)
ENCRYPTION_KEY=a1b2c3d4e5f6...  # generar con: openssl rand -hex 32
```

**Módulo:** `src/lib/crypto.ts`
```ts
// encrypt(plaintext) → "iv:tag:cipher"  (para guardar en BD)
// decrypt("iv:tag:cipher") → plaintext  (para leer de BD)
```

---

### Clasificación de campos por sensibilidad

#### 🔴 CRÍTICO — cifrar antes del piloto

| Tabla | Campo | Razón |
|-------|-------|-------|
| `viajeros` | `vih_carga_viral` | Dato de salud con máxima discriminación potencial |
| `viajeros` | `inmunosupresion_tipo` | Dato de salud sensible |
| `viajeros` | `embarazo_fum` | Dato médico personal con impacto laboral |
| `viajeros` | `condiciones` (array) | Condiciones médicas del viajero |
| `viajeros` | `alergia_farmacos_cuales` | Texto libre con dato clínico |
| `viajeros` | `medicacion_habitual` | Texto libre con medicación |
| `sintomas_log` | `sintomas` (array) | Historial clínico del usuario |
| `teleorientaciones` | `resumen_caso` | Descripción libre del caso médico |

#### 🟡 SENSIBLE — cifrar en misma pasada (costo marginal bajo)

| Tabla | Campo | Razón |
|-------|-------|-------|
| `viajeros` | `alergia_tipos` (array) | Perfil de alergias |
| `viajeros` | `sexo` | Dato de identidad sensible |
| `viajeros` | `genero` | Dato de identidad sensible |
| `sintomas_log` | `fiebre` | Dato clínico |
| `sintomas_log` | `semaforo` | Resultado de triaje |
| `teleorientaciones` | `motivo` | Motivo de consulta médica |
| `teleorientaciones` | `urgencia` | Nivel de urgencia médica |

#### ✅ NO cifrar — datos funcionales / no sensibles

| Tabla | Campo | Razón |
|-------|-------|-------|
| `viajeros` | `nombre`, `apellido`, `edad`, `es_nino` | Display y queries, no clínicos |
| `viajes` | todos los campos | Destinos, fechas — funcional, no sensible |
| `checklist_items` | todos | Tareas genéricas, no datos personales |
| `familias` | `nombre`, `plan` | Funcional |

---

### Otras medidas de seguridad

#### HTTP Security Headers (`next.config.ts`)
```ts
// Headers a agregar:
Content-Security-Policy: default-src 'self'; img-src 'self' flagcdn.com; ...
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

#### Validación de inputs con Zod
- Todas las Server Actions deben validar con schemas Zod antes de escribir en BD
- Sanitizar campos de texto libre (medicacion_habitual, alergia_farmacos_cuales, resumen_caso)
- Limitar longitud de strings (max 500 chars en texto libre, max 50 en nombres)

#### Rate limiting en autenticación ✅ IMPLEMENTADO

**Qué es Upstash Redis:**  
Redis es una base de datos clave-valor en memoria, ultra-rápida, usada para contadores y caché. Upstash ofrece Redis como servicio serverless (compatible con Vercel Edge/Functions) con plan gratuito: 10.000 comandos/día, sin costo hasta escala real.

**Cómo funciona el rate limiting en SARIQAMA:**

```
Usuario intenta login
       ↓
Server Action iniciarSesion()
       ↓
loginRatelimit.limit(ip)  ← consulta a Upstash Redis
       ↓                        ↓
  success = true          success = false
  remaining = 4           (>5 intentos en 15 min)
       ↓                        ↓
  continuar login         retornar error genérico
                          sin llegar a Supabase
```

**Implementación técnica:**

```typescript
// src/lib/ratelimit.ts
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

export const loginRatelimit = new Ratelimit({
  redis: Redis.fromEnv(),               // lee UPSTASH_REDIS_REST_URL y _TOKEN
  limiter: Ratelimit.slidingWindow(5, '15 m'),  // 5 intentos, ventana deslizante 15 min
  prefix: 'sariqama:login',             // namespace en Redis
})
```

**Ventana deslizante vs. ventana fija:**  
- Ventana fija: reinicia el contador en punto exacto (ej: cada 15:00). Un atacante puede intentar en 14:59 y 15:01 = 10 intentos en 2 segundos.  
- Ventana deslizante: la ventana se mueve con cada intento. 5 intentos en cualquier período de 15 minutos. Más seguro.

**Variables de entorno requeridas:**
```
UPSTASH_REDIS_REST_URL=https://tu-db-region.upstash.io
UPSTASH_REDIS_REST_TOKEN=AXX...token...
```
Ambas se obtienen en: Upstash Console → tu base de datos → REST API section.

**Estado actual:** ✅ Configurado en Vercel (2026-07-09). En desarrollo local, si las variables no están en `.env.local`, el rate limiting falla con error — se puede ignorar en dev o agregar una instancia de Upstash de desarrollo separada.

**Qué protege:**
- Ataques de fuerza bruta contra contraseñas de usuarios
- Credential stuffing (probar listas de email/contraseña filtradas)
- No protege: DDoS (eso es a nivel de red/CDN), spam de registro (pendiente Fase C)

**Pendiente Fase C:**  
Agregar rate limiting también en `/registro` para prevenir creación masiva de cuentas spam.

#### Audit log (post-piloto, antes de escala)
```sql
CREATE TABLE audit_log (
  id uuid DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users,
  tabla text,
  accion text,  -- 'read' | 'write' | 'delete'
  registro_id uuid,
  ip text,
  created_at timestamptz DEFAULT now()
);
```

---

### Plan de implementación

#### Fase A — Antes del piloto (1–2 días)

1. `src/lib/crypto.ts` — módulo de cifrado/descifrado AES-256-GCM
2. Agregar `ENCRYPTION_KEY` a `.env.local` y Vercel
3. Cifrar todos los campos **CRÍTICOS** en Server Actions (familia.ts, viaje.ts)
4. Descifrar en Server Components al leer (dashboard, perfil, síntomas)
5. HTTP Security Headers en `next.config.ts`
6. Validación Zod en todas las Server Actions

#### Fase B — Durante el piloto (semana 2)

7. Cifrar campos **SENSIBLES** (mismo módulo, misma clave)
8. Rate limiting en `/login` y `/registro`
9. Revisar mensajes de error (no revelar información interna)

#### Fase C — Post-piloto

10. Key rotation mechanism (re-encrypt con nueva key sin downtime)
11. Audit log table activa
12. Revisión legal GDPR / Ley 19.628 (Chile) — privacidad de datos de salud
13. Penetration testing externo (contratar)

---

### Impacto en código existente

El cifrado es **transparente para el UI** — solo afecta las capas de Server Actions y Server Components:

```
Server Action (escribir) → encrypt(valor) → INSERT en Supabase
Server Component (leer)  → SELECT de Supabase → decrypt(valor) → render
```

Los Client Components no cambian. Los formularios no cambian. Solo cambia la capa de persistencia.

**Riesgo de migración:** los datos ya almacenados en texto plano deben ser re-cifrados en una migración controlada (script de migración, no destructivo).

---

### Migraciones SQL requeridas

Ninguna — los campos ya existen como `text` / `text[]`. El cifrado AES-256-GCM produce strings base64 que caben en los mismos campos.

---

## 🏆 Análisis competitivo

| Competidor | Foco | Gap principal |
|-----------|------|--------------|
| **Sitata** (app) | Seguro de viaje + alertas IA + telemedicina 24/7 | Solo inglés, sin foco familiar, sin LATAM, caro |
| **Mass General GTEN** (app) | Investigación académica + protocolos CDC | Solo inglés, UX compleja, solo pre-viaje, EEUU |
| **TravelHealthPro** (web) | Información clínica institucional UK | Solo inglés, sin personalización, sin interactividad |

### Diferenciadores SARIQAMA
1. **Primera plataforma de salud del viajero en español para LATAM**
2. **Diseñada para familias con niños** — flujos pediátricos, botiquín por edad
3. **Pre + durante + post viaje** — competidores solo cubren pre-viaje
4. **Teleorientación accesible en español** — Sitata la tiene pero cara y en inglés

---

## 💰 Modelo de negocio — Freemium 3 niveles (actualizado Sesión 5)

### Estructura de planes

| Plan | Precio | Incluye | Objetivo |
|------|--------|---------|----------|
| **Nivel 1 — Exploración** | Gratis | Creación de perfil de viaje, riesgos generales del destino, checklist básico (5–6 items) | Adquisición masiva, reducción de fricción |
| **Nivel 2 — Preparación Total** | USD 19–29 / viaje | Checklist detallado adulto/niño, botiquín específico por destino, reporte familiar PDF descargable | Monetización del Plan Familiar |
| **Nivel 3 — Acompañamiento** | USD 29–39 / evento | Revisión clínica pre-viaje (teleorientación), triaje de síntomas en ruta, seguimiento médico post-viaje | Monetización por urgencia médica |

### Campo en BD
```sql
-- familias.plan: 'gratis' | 'preparacion' | 'acompanamiento'
ALTER TABLE familias ADD COLUMN plan text NOT NULL DEFAULT 'gratis';
```

### Features por plan
| Feature | Gratis | Preparación | Acompañamiento |
|---------|--------|-------------|----------------|
| Creación de perfil/viaje | ✅ | ✅ | ✅ |
| Riesgos generales del destino | ✅ | ✅ | ✅ |
| Checklist básico (5–6 items) | ✅ | ✅ | ✅ |
| Checklist detallado adulto/niño | 🔒 | ✅ | ✅ |
| Botiquín específico por destino | 🔒 | ✅ | ✅ |
| Reporte familiar PDF | 🔒 | ✅ | ✅ |
| Evaluador de síntomas (triaje) | 🔒 | 🔒 | ✅ |
| Teleorientación médica | 🔒 | 🔒 | ✅ |
| Seguimiento post-viaje | 🔒 | 🔒 | ✅ |

### Estrategia piloto
- **Durante el piloto:** sin pasarela de pago → botón "Solicitar acceso" envía email a hola@sariqama.com
- **Post-piloto:** integrar MercadoPago (Chile/LATAM) o Stripe según resultados
- **Admin:** campo `plan` en `familias` se actualiza manualmente desde Supabase dashboard

> ⚠️ CONFLICTO con Sesión 4: se decidió que "todo era gratis excepto teleorientación". En Sesión 5 se adoptó el modelo freemium de 3 niveles según imagen del pitch deck. El checklist y botiquín ahora son parte del Nivel 2 de pago.

---

## 🧭 Guardrails clínicos (obligatorios)

SARIQAMA **nunca** debe:
- Diagnosticar ni confirmar/descartar enfermedades
- Prescribir medicamentos ni dosis pediátricas
- Reemplazar evaluación médica urgente

SARIQAMA **siempre** debe escalar a urgencia ante:
- Fiebre alta persistente
- Dificultad respiratoria
- Sangrado / diarrea con sangre
- Rechazo de líquidos (niños)
- Decaimiento marcado
- Mordedura de animal
- Signos neurológicos

**Texto obligatorio visible en toda página clínica:**
> "SARIQAMA entrega orientación sanitaria y no reemplaza una evaluación médica. Ante signos de alarma, busca atención médica de inmediato."

---

## 📋 Destinos piloto activos

| Slug | Destino | Riesgo principal |
|------|---------|-----------------|
| `brasil-nordeste` | Brasil — Nordeste | Dengue muy alto |
| `caribe-republica-dominicana` | Caribe — Rep. Dominicana | Dengue alto, Malaria moderado |
| `centroamerica-costa-rica` | Centroamérica — Costa Rica | Dengue alto |
| `mexico-cancun-riviera` | México — Cancún/Riviera Maya | Diarrea del viajero alto |

Fuente: CDC Yellow Book 2026. Revisado: 2026-05.

---

## 💰 Modelo de negocio — Decisiones tomadas (Sesión 4 → revisado Sesión 5)

~~**Modelo elegido: Solo pago por servicio** — REVISADO en Sesión 5~~

**Modelo actual (Sesión 5): Freemium 3 niveles**
- Ver sección "💰 Modelo de negocio — Freemium 3 niveles" más arriba
- El checklist básico y riesgos siguen siendo gratis
- Checklist detallado + botiquín = Nivel 2 (USD 19–29/viaje)
- Síntomas + teleorientación = Nivel 3 (USD 29–39/evento)

**Pasarela de pago:** Por decidir post-piloto (MercadoPago favorito para mercado chileno)
**Durante el piloto:** botón "Solicitar acceso" → email manual → upgrade manual en Supabase

---

## 🗄️ Migraciones SQL ejecutadas en Supabase

| Fecha | SQL | Motivo |
|-------|-----|--------|
| 2026-05-12 | `ALTER TABLE sintomas_log ADD COLUMN titulo text, viajero_nombre text, dias_sintomas int, exposiciones text[], acciones text[]` | Seguimiento de síntomas por viajero |
| 2026-05-12 | `CREATE POLICY insert_sintomas_log / select_sintomas_log ON sintomas_log` | RLS para guardar evaluaciones |
| 2026-05-12 | `ALTER TABLE viajes ADD COLUMN tipos text[], escalas jsonb` | Selección múltiple de tipo + escalas |
| 2026-05-16 | `ALTER TABLE familias ADD COLUMN plan text NOT NULL DEFAULT 'gratis'` | Modelo freemium 3 niveles — valores: 'gratis' / 'preparacion' / 'acompanamiento' |
| 2026-05-16 | `npm install @react-pdf/renderer` (dep nueva) | PDF generation server-side para reporte familiar |
| 2026-05-18 | `ALTER TABLE viajeros ADD COLUMN apellido text, inmunosupresion_tipo text, vih_carga_viral text, embarazo_fum date` | Datos clínicos avanzados por viajero |
| 2026-05-18 | `ALTER TABLE viajeros ADD COLUMN sexo text, genero text` | Sexo biológico e identidad de género |
| 2026-05-18 | `ALTER TABLE viajes ADD COLUMN seguro_viaje text, seguro_compania text` | Registro de seguro médico de viaje |
| 2026-05-26 | `ALTER TABLE viajeros ADD COLUMN alergia_tipos text[]` | Tipos de alergia (alimentaria/rinitis/farmacos) |
| 2026-05-26 | `ALTER TABLE viajeros ADD COLUMN alergia_huevo boolean` | Sub-tipo alergia alimentaria: huevo |
| 2026-05-26 | `ALTER TABLE viajeros ADD COLUMN alergia_plv boolean` | Sub-tipo alergia alimentaria: leche/PLV |
| 2026-05-26 | `ALTER TABLE viajeros ADD COLUMN alergia_farmacos_cuales text` | Detalle de alergia a fármacos (texto libre) |

> ℹ️ Para actualizar el plan de un usuario durante el piloto: `UPDATE familias SET plan = 'preparacion' WHERE id = '[uuid]';`

---

## 🔄 Historial de sesiones

### Sesión 14 — 2026-07-09

**Contexto:** Sesión de seguridad. El usuario solicitó agregar una estrategia de encriptación de datos médicos antes del piloto.

**Lo que se hizo:**

**1. Diseño de estrategia de seguridad (3 capas)**
- Capa 1 (transporte): HTTPS ya activo via Vercel
- Capa 2 (acceso): Supabase RLS + JWT — ya implementado
- Capa 3 (datos en reposo): AES-256-GCM a nivel de aplicación — **implementado en esta sesión**
- Documentado en nueva sección "🔐 Estrategia de Seguridad" dentro de `SARIQAMA_DESARROLLO.md`

**2. Módulo `src/lib/crypto.ts`** — nuevo archivo
- AES-256-GCM con IV aleatorio de 96 bits por operación (GCM recomendado)
- Sin dependencias externas — usa `node:crypto` nativo de Node.js
- Formato almacenado: `base64(iv):base64(authTag):base64(ciphertext)`
- Backward compatible: si un valor no tiene el formato esperado, se devuelve intacto (datos legacy)
- Helpers tipados: `decryptViajero<T>()` y `decryptSintoma<T>()` para filas de Supabase
- `encryptArray` / `decryptArray`: para `text[]` — JSON.stringify → encrypt → `[encryptedString]`

**3. Cifrado en escrituras (Server Actions)**
- `src/app/actions/familia.ts`: cifra al insertar viajero (tanto `agregarViajeros` como `agregarUnViajero`)
  - Campos CRÍTICOS cifrados: `condiciones`, `inmunosupresion_tipo`, `vih_carga_viral`, `embarazo_fum`, `alergia_farmacos_cuales`
  - Campos SENSIBLES cifrados: `sexo`, `genero`, `alergia_tipos`
- `src/app/actions/viaje.ts`: cifra al guardar evaluación de síntomas (`guardarSintomas`)
  - Campos cifrados: `sintomas`, `semaforo`

**4. Descifrado en lecturas (Server Components + API Routes)**
- `src/app/(app)/viaje/[id]/page.tsx` — descifra viajeros (condiciones, embarazo_fum para avisos)
- `src/app/(app)/viaje/[id]/sintomas/page.tsx` — descifra viajeros + historial de sintomas_log
- `src/app/(app)/perfil/page.tsx` — descifra viajeros (condiciones para chips de perfil)
- `src/app/api/reporte/[viajeId]/route.ts` — descifra viajeros (condiciones para PDF)
- `src/app/(app)/dashboard/page.tsx` — optimizado: cambiado `select("*")` a `select("id, nombre, edad, es_nino")` (no usa campos sensibles)

**5. HTTP Security Headers en `next.config.ts`**
- `X-Frame-Options: DENY` — previene clickjacking
- `X-Content-Type-Options: nosniff` — previene MIME sniffing
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
- `Content-Security-Policy` — whitelist: self, Google Fonts, flagcdn.com, Supabase

**6. Variable `ENCRYPTION_KEY` en `.env.local`**
- Clave AES-256 de 32 bytes (64 hex) generada con `crypto.randomBytes(32)`
- **Acción pendiente para Nicolás:** agregar `ENCRYPTION_KEY` en Vercel → Settings → Environment Variables

**Archivos modificados:**
- `src/lib/crypto.ts` — NUEVO
- `src/app/actions/familia.ts`
- `src/app/actions/viaje.ts`
- `src/app/(app)/viaje/[id]/page.tsx`
- `src/app/(app)/viaje/[id]/sintomas/page.tsx`
- `src/app/(app)/perfil/page.tsx`
- `src/app/api/reporte/[viajeId]/route.ts`
- `src/app/(app)/dashboard/page.tsx`
- `next.config.ts`
- `.env.local`

**Migraciones SQL:** Ninguna — los campos cifrados en base64 caben en los mismos campos `text` / `text[]` existentes.

**Decisiones tomadas:**
- AES-256-GCM sobre AES-CBC: autenticado (detecta tampering), sin padding oracle attacks
- `node:crypto` nativo sobre librerías externas (tweetnacl, libsodium): cero dependencias nuevas
- Backward compatible por diseño: el decrypt devuelve el valor intacto si no tiene formato cifrado
- `text[]` → encriptados como array de 1 elemento con JSON serializado — no requiere cambio de schema
- Dashboard: optimizado para no traer campos sensibles que no usa

**Pendiente obligatorio antes del deploy:**
⚠️ Agregar `ENCRYPTION_KEY=962cb8a5427b73464cad68748f769896ac0c1d2dc85ac553a76f4e9e273eca09` en Vercel. ✅ HECHO

---

### Sesión 15 — 2026-07-09

**Contexto:** Sesión de features + seguridad. Se completaron las 3 tareas pendientes: editar viajero, editar viaje, y Seguridad Fase B (rate limiting).

---

**1. Editar viajero**

- Nueva acción `editarViajero(id, data)` en `actions/familia.ts`
  - Verifica ownership: viajero debe pertenecer a la familia del usuario autenticado
  - Cifra todos los campos médicos sensibles igual que en el INSERT
  - `UPDATE viajeros SET ... WHERE id = $1`
- `src/app/(app)/perfil/editar-viajero/[id]/page.tsx` — Server Component
  - Fetch del viajero con verificación de ownership
  - Descifra con `decryptViajero()` y pasa como `initialData` al Client
- `src/app/(app)/perfil/editar-viajero/[id]/EditarViajeroClient.tsx` — Client Component
  - Mismo formulario que agregar-viajero, pre-poblado desde `initialData`
  - Las condiciones se inicializan filtrando 'ninguna'
  - Llama `editarViajero` y redirige a `/perfil` en éxito
- `perfil/page.tsx`: icono `Pencil` (Lucide) en cada tarjeta de viajero → link a `/perfil/editar-viajero/[id]`

**Editar viaje**

- Nueva acción `editarViaje(id, data)` en `actions/viaje.ts`
  - Edita: `fecha_salida`, `fecha_regreso`, `tipos`, `seguro_viaje`, `seguro_compania`
  - **Destino NO editable** — cambiarlo requeriría decisión sobre checklist existente (se agrega como deuda técnica futura)
  - Verifica ownership, redirige a `/viaje/[id]` en éxito
- `src/app/(app)/viaje/[id]/editar/page.tsx` — Server Component
- `src/app/(app)/viaje/[id]/editar/EditarViajeClient.tsx` — Client Component
  - 3 secciones: Fechas (inputs date), Tipo de viaje (grid multi-select), Seguro (3 opciones + campo compañía)
  - Diseño consistente con Clinical Calm
- `viaje/[id]/page.tsx`: link "Editar fechas, tipos o seguro" con icono Pencil debajo de los tags de tipo

**3. Seguridad Fase C — Validación de inputs con Zod**

- `src/lib/validators/schemas.ts` — NUEVO (Zod 4, ya instalado)
  - `registroSchema`: email, password min 8 chars, nombre familia max 80
  - `loginSchema`: email + password básico (el mensaje de error es siempre genérico para no dar pistas)
  - `viajeroSchema`: enums para condiciones/sexo/genero, edades 0-120, longitudes máximas en texto libre
  - `crearViajeSchema`: destino_slug sólo alfanumérico + guiones, fechas ISO, tipos restringidos a enum
  - `editarViajeSchema`: igual para edición
  - `guardarSintomasSchema`: viaje_id y viajero_id validados como UUID, sintomas y exposiciones contra enum exhaustivo
- Server Actions actualizadas para llamar `.safeParse()` antes de cualquier operación de base de datos:
  - `auth.ts`: `registrar` y `iniciarSesion`
  - `familia.ts`: `agregarViajeros`, `editarViajero`, `agregarUnViajero`
  - `viaje.ts`: `crearViaje`, `editarViaje`, `eliminarViaje`, `guardarSintomas`, `toggleChecklistItem`
- IDs validados con regex UUID antes de queries: previene SQL injection por formato

**Resumen de capas de seguridad implementadas (completo):**

| Capa | Implementación | Estado |
|------|---------------|--------|
| Transporte | HTTPS via Vercel | ✅ |
| Headers HTTP | CSP, HSTS, X-Frame-Options, etc. en `next.config.ts` | ✅ |
| Autenticación | Supabase Auth (JWT) | ✅ |
| Autorización | RLS en todas las tablas + ownership checks en actions | ✅ |
| Rate limiting | Upstash Redis — 5 intentos/15min por IP en login | ✅ |
| Validación de inputs | Zod en todas las Server Actions | ✅ |
| Cifrado en reposo | AES-256-GCM — todos los campos médicos sensibles | ✅ |

✅ **Upstash configurado en producción** (2026-07-09).

**Archivos modificados:**
- `src/lib/validators/schemas.ts` — NUEVO
- `src/app/actions/auth.ts`
- `src/app/actions/familia.ts`
- `src/app/actions/viaje.ts`
- `src/app/(app)/perfil/editar-viajero/[id]/page.tsx` — NUEVO
- `src/app/(app)/perfil/editar-viajero/[id]/EditarViajeroClient.tsx` — NUEVO
- `src/app/(app)/viaje/[id]/editar/page.tsx` — NUEVO
- `src/app/(app)/viaje/[id]/editar/EditarViajeClient.tsx` — NUEVO

**Migraciones SQL:** Ninguna.

---

### Sesión 13 — 2026-06-07

**Contexto:** Sesión de documentación técnica y análisis arquitectural. Foco en crear un artefacto HTML autocontenido con toda la documentación del sistema y analizar opciones de evolución hacia un backend separado.

**Lo que se hizo:**

**1. Archivo `SARIQAMA_diagramas.html` — documentación técnica completa**
- Creado y refinado como página HTML autocontenida (~1.400 líneas)
- Estructura: sidebar fijo + contenido con scroll — todo visible sin JS
- 9 secciones navegables con `IntersectionObserver` para resaltar sección activa

Secciones incluidas:
- **Resumen ejecutivo** — estado actual, fases, pendientes
- **Stack tecnológico** — tarjetas visuales para cada tecnología (Next.js, Supabase, Vercel, TuGo, CDC, etc.)
- **Arquitectura actual** — SVG de capas (Browser → Next.js → Supabase → APIs externas) + tabla de principios
- **Base de datos** — diagrama ER completo con 6 tablas y sus relaciones, políticas RLS por tabla
- **Rutas y páginas** — tabla con 15 rutas, tipo (Server/Client), plan mínimo requerido, descripción
- **Lógica de negocio** — todas las Server Actions, algoritmo del semáforo, generarChecklist(), sistema de planes
- **Diagramas de secuencias** — 6 flujos con tabs (Registro, Login, Crear viaje, Riesgos, Síntomas, Checklist)
- **Flujo de datos** — DFD Nivel 0 (contexto) + DFD Nivel 1 (7 procesos, 7 almacenes)
- **Opciones de backend** — análisis de 4 opciones con pros/contras y recomendación por fase

**2. Iteraciones técnicas del archivo HTML**
- Primera versión usó Mermaid.js → lineas cortadas en DFDs → migrado a SVG puro inline
- Segunda versión usó JS show/hide de secciones → secciones invisibles en algunos casos
- Versión final: secciones siempre `display:block`, navegación por scroll con `href="#id"`, sidebar sticky con `IntersectionObserver`
- Fix crítico: `overflow:hidden` en `.body-wrap` impedía que `href="#id"` funcionara → eliminado, el `body` scrollea directamente

**3. Análisis arquitectural: ¿backend separado?**
- Diagnosticado el estado actual: monolito Next.js con Server Actions como "backend"
- Evaluadas 4 opciones con pros/contras y esfuerzo estimado:
  - Opción 1: Mantener monolito (recomendado para piloto)
  - Opción 2: Next.js API Routes (~3 días, habilita app móvil)
  - Opción 3: Backend NestJS separado (para escala real)
  - Opción 4: Microservicio Python/FastAPI solo para AI Advisor (Fase 3)
- Conclusión: no cambiar arquitectura hasta post-piloto

**Archivos modificados:**
- `C:\Users\Nico Abusleme\Desktop\PROYECTOS\TROPICARE\SARIQAMA_diagramas.html` — creado/refinado (documentación técnica completa)

**Migraciones SQL:** Ninguna.

**Decisiones tomadas:**
- SVG inline > Mermaid.js para diagramas: más control, sin dependencias de CDN, sin bugs de renderizado
- Documentación técnica como HTML autocontenido (no Notion, no Confluence) — portable, sin login, compartible
- Arquitectura actual (monolito Next.js) es correcta para el piloto — no escalar prematuramente

---

### Sesión 12 — 2026-06-02

**Contexto:** Continuación directa de la Sesión 11. Foco en completar el redesign "Clinical Calm" en las 8 páginas restantes.

**Lo que se hizo:**

Patrón universal aplicado en las 8 páginas:
- Headers: gradiente navy → blanco con `border-b border-[#E8EEF4]`
- Fondo: `bg-[#F7FFFE]` → `bg-[#F8FAFB]`
- Teal claro: `#E0F5F2` → `#E8F7F4` en toda la app
- Bordes: `border-slate-100` → `border-[#E8EEF4]` en toda la app
- Emoji de UI → Lucide SVG icons

**Detalle por página:**
- `riesgos`: header blanco + bandera redondeada, badge fuente con ícono `Radio`, risk cards blancas
- `botiquin`: secciones como cards con `divide-y`, íconos `Plane`/`AlertTriangle`/`Stethoscope`
- `sintomas`: header blanco + badge de registros teal, aviso con `AlertTriangle`
- `viaje/nuevo`: fondo y bordes actualizados, emoji decorativo eliminado
- `onboarding`: progress bar teal custom, card con bordes semánticos, fondo `#F8FAFB`
- `agregar-viajero`: header blanco con back button sutil
- `precios`: plan destacado en `bg-[#1A3D5C]` sólido (sin gradiente), `AlertTriangle` en aviso piloto
- `teleorientacion`: header con `Stethoscope` en círculo teal, pantalla éxito con SVG check

**Estado:** Todas las 15 pantallas de la app están en "Clinical Calm". ✅

**Migraciones SQL:** Ninguna.

**Commits:**
- `design: Clinical Calm — las 8 páginas restantes`

**Decisiones:**
- Mantener emoji en contenido médico con significado semántico (tips, alertas TuGo) — son contenido, no UI
- `divide-y divide-[#F0F4F8]` como patrón de separación dentro de cards
- Plan destacado en precios: navy sólido es más "clínico" que gradiente

---

### Sesión 11 — 2026-06-02

**Contexto:** Redesign completo de la app con dirección de diseño "Clinical Calm" — minimalismo clínico moderno que evoca confianza médica, usando skills ui-ux-pro-max, frontend-design y emil-design-eng. Foco en toda la capa visual de la app (no landing, que ya estaba rediseñada).

**Dirección de diseño — "Clinical Calm":**
- Superficies blancas puras como base (no fondos con tinte teal)
- Headers pesados navy gradiente → headers blancos limpios con separador 1px
- Colores usados con propósito: teal solo para interactivos y estados activos
- Cards con borde 1px `#E8EEF4` en vez de shadow-heavy
- Iconos exclusivamente Lucide SVG (cero emoji en la interfaz de app)
- Indicadores visuales como dots de color (risk-chip, prioridad, categorías)
- Espaciado consistente 8dp
- Typography más audaz: jerarquía clara con Fraunces + DM Sans

**Lo que se hizo:**

**Bloque 0 — globals.css (design tokens)**
- Paleta semántica: `--surface`, `--surface-subtle`, `--surface-teal`, `--border-default`, `--border-subtle`, `--text-primary/secondary/muted`, `--risk-*`
- Background shadcn: `#FFFFFF` (antes `#F7FFFE`)
- Shadow scale revisada: `--shadow-card`, `--shadow-elevated` (más sutiles)
- Nuevas clases: `.card-clinical`, `.icon-action`
- Base font-size: 15px, `--radius: 0.875rem`

**Bloque 1 — Componentes compartidos**
- `bottom-nav.tsx`: emoji → Lucide (Home/Plane/Thermometer/User), indicador activo = línea 2px teal en top del item
- `risk-chip.tsx`: dot circular de color + background sutil por nivel (5 niveles distintos)
- `collapsible-section.tsx`: prop `accentDot` (dot izquierdo), separador interno h-px, compat con `accentClass` deprecado
- `app-shell.tsx`: header sin backdrop-filter blur → blanco con `border-b border-[#E8EEF4]`

**Bloque 2 — Dashboard**
- Header navy gradiente eliminado → header blanco con saludo dinámico (Buenos días/tardes/noches) + avatar inicial navy con ring teal
- Viajeros: chips teal-tinted `bg-[#E8F7F4]`
- Viaje activo: card blanca con flag + fecha + progress bar teal 1.5px
- Quick actions 2x2: Lucide icons en círculo `bg-[#E8F7F4]`, sin gradientes ni emoji
- CTA "Agregar otro viaje" con borde discontinuo teal
- Empty state con ícono `<Plane>` en círculo teal (sin emoji ✈️)

**Bloque 3 — Viaje detalle `[id]`**
- Header blanco con back link, flag, título, fecha, tag de tipo de viaje, barra de progreso
- Estado de días: `"En viaje"` como badge teal / número grande en navy / `"Finalizado"` slate
- Acciones (Checklist/Riesgos/Síntomas/Botiquín): Lucide icons con fondo de color específico por sección
- Resumen riesgos y vacunas en cards blancas con border
- Vacunas requeridas: badge rojo; vacunas recomendadas: badge teal
- CTA Teleorientación: navy sólido (no gradiente), con ícono Stethoscope

**Bloque 4 — Checklist + Perfil**
- `ChecklistClient.tsx`: categorías con Lucide icons + dot de color, progress bar teal, checkbox circular animado, indicador de prioridad como dot, item completado con line-through + `CheckCircle2` icon
- `perfil/page.tsx`: header navy → avatar navy con ring teal, section labels `text-[11px] tracking-widest`, borders estandarizados a `#E8EEF4`

**Migraciones SQL:** Ninguna en esta sesión.

**Commits de esta sesión:**
- `design: redesign Clinical Calm — tokens, components, dashboard, viaje`
- `design: Clinical Calm — checklist, perfil header`

**Decisiones tomadas:**
- Mantener `accentClass` como prop deprecado en CollapsibleSection (compat con riesgos/page.tsx que se redesignará en próxima sesión)
- `saludo()` es función SSR (no requiere hook cliente) — usa `new Date().getHours()`
- No se toca la lógica de negocio, server actions ni queries Supabase — solo capa visual
- Skills ui-ux-pro-max scripts no encontrados (dirs vacíos post-instalación) → se usó el SKILL.md cargado en contexto directamente

**Páginas pendientes de redesign (próxima sesión):**
- `viaje/[id]/riesgos/page.tsx` — la más compleja, usa CollapsibleSection con accentClass
- `viaje/[id]/botiquin/page.tsx`
- `viaje/[id]/sintomas/page.tsx` + `SintomasClient.tsx` + `HistorialCard.tsx`
- `viaje/nuevo/page.tsx` — wizard multi-paso
- `onboarding/page.tsx` — wizard multi-paso
- `perfil/agregar-viajero/page.tsx`
- `precios/page.tsx`
- `teleorientacion/page.tsx` + `TeleorientacionClient.tsx`

---

### Sesión 10 — 2026-05-28

**Contexto:** Sesión de modernización visual completa y corrección de accesibilidad. Foco en redesign radical del landing page con estética bento moderna (inspiración Apple/Vercel), auditoría y fixes de accesibilidad con la skill web-design-guidelines, corrección del favicon, y diagnóstico de problema de dominio en producción.

**Lo que se hizo:**

**1. Rediseño completo del landing page (`src/app/page.tsx`)**
- Landing reemplazada por diseño bento moderno de estética Apple/Vercel — "Radical — todo nuevo"
- **Navbar:** frosted glass oscuro con `rgba(10,34,56,0.85)` + `backdropFilter: blur(20px)`, safe area para iPhone Dynamic Island (`paddingTop: 'env(safe-area-inset-top)'`)
- **Hero:** fondo oscuro `#061826`, split layout — texto a la izquierda, mini bento preview decorativo a la derecha
- **Marquee strip:** barra oscura con logos/textos animados en loop infinito (2 copias + `translateX(-50%)`)
- **Bento grid:** 8 cards con mixed sizing (`col-span-2` para cards principales) y texturas de color distintas — navy, teal, gold, terracotta
- **Sección "Cómo funciona":** fondo `#0A2238`, sticky left panel, steps al lado derecho
- **Destinos, Precios, CTA final:** en secciones alternadas
- **Footer + Disclaimer:** fondo `#07192A` unificado (antes disclaimer era `#F7FFFE` — línea blanca visible entre secciones oscuras, corregido)
- **Server Component:** no usa event handlers. Hover effects via CSS puro (`.hover-lift`)

**2. Modernización de páginas de auth (login y registro)**
- Split-panel: izquierda navy `linear-gradient(145deg, #1A3D5C 0%, #0F2D45 50%, #0A2238 100%)`, derecha formulario sobre `bg-[#F7FFFE]`
- Login: testimonial card-glass en panel izquierdo
- Registro: 3 beneficios con emoji+glass chip en panel izquierdo
- Ambas páginas con `role="alert"` en error div, `htmlFor`/`id` en todos los campos, `autoComplete` explícito por campo

**3. Mejoras al sistema de diseño (`src/app/globals.css`)**
- Shadow scale con tinte navy: `--shadow-xs` → `--shadow-xl` + `--shadow-glow-teal` + `--shadow-glow-gold`
- Animation tokens: `--ease-out`, `--ease-in`, `--ease-base`, `--duration-fast/base/slow`
- Keyframes: `marquee`, `fade-up`, `fade-in`, `scale-in`, `shimmer`, `float`
- Clases utilitarias: `.animate-marquee`, `.animate-fade-up`, `.animate-float`, `.card-elevated`, `.card-glass`, `.hover-lift`, `.mesh-bg`, `.gradient-text`
- `@media (prefers-reduced-motion: reduce)` — desactiva todas las animaciones + `animate-pulse` de Tailwind
- `color-scheme: light` en `:root`

**4. AppShell actualizado**
- Top bar: `background: rgba(255,255,255,0.90)`, `backdropFilter: blur(16px)` (frosted glass)
- Bottom nav: `background: rgba(255,255,255,0.88)`, `backdropFilter: blur(20px)`, borde sutil `rgba(26,61,92,0.07)`
- Active state: `bg-[#E0F5F2] scale-105 shadow-[0_2px_8px_rgba(45,158,140,0.18)]`

**5. Auditoría y fixes de accesibilidad (web-design-guidelines)**
- `aria-hidden="true"` en íconos decorativos (Shield ×2, Clock, Users en landing)
- Skip link: `<a href="#main-content" className="sr-only focus:not-sr-only ...">` al inicio del landing
- `autoComplete` normalizado en todos los campos de los formularios de auth
- `role="alert"` en todos los divs de error dinámico
- Transiciones explícitas (`transition: 'background-color 200ms, opacity 200ms, transform 200ms'`) reemplazando `transition-all` genérico

**6. Favicon corregido**
- `src/app/icon.png` — copiado desde `public/icon.png` (isotipo SARIQAMA con transparencia)
- `src/app/favicon.ico` eliminado (era el favicon por defecto de Next.js)
- `src/app/layout.tsx` → `metadata.icons` explícito con icon + apple + shortcut apuntando a `/icon.png`

**7. Diagnóstico y resolución de problema de dominio sariqama.com**
- Síntoma: sariqama.com mostraba otro sitio web al ingresar
- Investigado: DNS en Bluehosting (A + CNAME) estaba correctamente configurado apuntando a Vercel
- Causa real: el dominio había expirado en Bluehosting porque el administrador no verificó su email a tiempo, y Bluehosting dio de baja el dominio
- Resolución: el administrador verificó su email → dominio reactivado → 48 hrs de propagación DNS

**8. Skills instaladas**
- `find-skills` — búsqueda en catálogo de skills
- `mcp-builder` — construcción de MCP servers
- `agent-browser` — automatización web con agentes
- `web-design-guidelines` — auditoría con Vercel Web Interface Guidelines
- `frontend-design` — diseño de interfaces frontend

**Bugs corregidos durante la sesión:**
- **Build error:** `page.tsx` (Server Component) tenía `onMouseEnter`/`onMouseLeave` en cards → reemplazado por clase CSS `.hover-lift`
- **TypeScript error:** `<FlagImg>` no acepta prop `style` → reemplazado por `className="shadow-sm"`
- **Línea blanca entre secciones oscuras:** disclaimer tenía `background: #F7FFFE` entre CTA y footer oscuros → cambiado a `#07192A`
- **git commit heredoc:** PowerShell requiere `@'...'@` (here-string) no `<<'EOF'` estilo bash

**Migraciones SQL:** Ninguna en esta sesión.

**Commits de esta sesión:**
- `design: rediseño radical del landing con bento moderno y frosted glass`
- `design: auth pages split-panel con paleta navy/teal y accesibilidad`
- `design: shadow scale, animaciones, card-glass y hover-lift en globals.css`
- `fix: favicon con icon.png nativo Next.js App Router`
- `fix: accesibilidad — aria-hidden, skip link, autoComplete y role=alert`

**Decisiones tomadas:**
- `.hover-lift` CSS-only es la estrategia correcta para hover en Server Components de Next.js (evita convertir a Client Component solo por hover)
- `backdropFilter` via `style={}` inline es necesario porque Tailwind v4 no soporta `backdrop-blur` en todas las situaciones de SSR
- Disclaimer de la landing debe estar siempre sobre fondo oscuro (mismo que footer) para no romper la continuidad visual
- El skill web-design-guidelines (Vercel) es el estándar de auditoría para este proyecto

---

### Sesión 9 — 2026-05-26

**Contexto:** Continuación de Sesión 8. Foco en identidad visual completa: integración del logo real SARIQAMA, favicon, y corrección exhaustiva de todos los colores del sistema anterior que no habían sido actualizados.

**Lo que se hizo:**

**1. Logo e identidad visual**
- Análisis del logo SARIQAMA desde archivo en `logos/WhatsApp Image 2026-05-26 at 20.44.11.jpeg`
- Paleta extraída: Navy `#1A3D5C` (estructura), Teal `#2D9E8C` (interactivo), Gold `#D4A338` (acento), Terracotta `#C27058` (decorativo)
- `src/app/globals.css` completamente reescrito con CSS custom properties para la nueva paleta
- `public/logo.jpeg` y `src/app/icon.jpeg` agregados (reemplazados luego por PNG)

**2. Corrección de paleta en toda la app (23 archivos)**
- Auth pages (login/registro): gradiente `from-teal-600` → navy `from-[#1A3D5C]`
- Layout body: `bg-teal-50` → `bg-[#F7FFFE]`
- Todos los botones primarios: `bg-teal-600` → `bg-[#2D9E8C]`
- Fondos suaves: `bg-teal-50/100` → `bg-[#E0F5F2]`
- Textos interactivos: `text-teal-600` → `text-[#2D9E8C]`
- Bordes hover, collapsible-section, bottom-nav, plan-gate, checklist, síntomas, botiquín, nuevo viaje, teleorientación

**3. Logo real integrado (sustituyendo Leaf/emoji)**
- AppShell navbar: `<Leaf>` → `<Image src="/logo.png">`
- Login y registro: emoji 🌴 → logo en card blanca sobre fondo navy
- Onboarding: `<Leaf>` → `<img src="/logo.png">`
- Landing hero: emoji 🌴 → logo en contenedor blanco translúcido
- Landing navbar: wordmark "SARIQAMA" texto → logo imagen
- Términos: `<Leaf>` → logo imagen

**4. Actualización a PNG con transparencia**
- Usuario entregó `logos/logo.png` (horizontal con nombre) y `logos/icon.png` (isotipo solo)
- `public/logo.png` y `public/icon.png` reemplazaron los JPEG
- `src/app/icon.png` para favicon automático Next.js App Router
- 6 archivos de código actualizados de `.jpeg` → `.png`

**Migraciones SQL:** Ninguna en esta sesión.

**Commits de esta sesión:**
- `design: alinear paleta de colores al logo SARIQAMA`
- `design: integrar logo SARIQAMA, favicon y completar paleta brand`
- `design: reemplazar logo JPEG por PNG con transparencia`

**Decisiones tomadas:**
- PNG con fondo transparente es obligatorio para logos (JPEG deja fondo blanco visible sobre gradientes)
- `src/app/icon.png` es el mecanismo nativo de Next.js App Router para favicon (sin config extra)
- El teal interactivo `#2D9E8C` reemplaza a `teal-600` de Tailwind (son similares pero distintos)
- `bg-[#E0F5F2]` reemplaza a `bg-teal-50` para todos los fondos claros interactivos

---

### Sesión 8 — 2026-05-26

**Contexto:** Múltiples fixes clínicos en la página de riesgos y expansión del perfil de alergias de cada viajero. Se trabajó con fuentes CDC Yellow Book 2026 y datos de TuGo.

**Lo que se hizo:**

**1. Registro de alergias multi-nivel**
- Nueva jerarquía: condición `alergia` → tipo (alimentaria / rinitis / fármacos) → sub-tipo
- Sub-tipos alimentarias: huevo (🥚) y leche/PLV (🥛) con checkbox
- Fármacos: campo de texto libre "¿cuáles?"
- Implementado en onboarding (multi-viajero) y agregar-viajero (perfil)
- `toggleAlergiaTipo()` y cascada de limpieza al desmarcar condición padre
- Migraciones SQL ejecutadas:
  ```sql
  ALTER TABLE viajeros ADD COLUMN alergia_tipos text[];
  ALTER TABLE viajeros ADD COLUMN alergia_huevo boolean;
  ALTER TABLE viajeros ADD COLUMN alergia_plv boolean;
  ALTER TABLE viajeros ADD COLUMN alergia_farmacos_cuales text;
  ```

**2. Fix cursor-pointer en "Agregar integrante"**
- El botón con borde discontinuo en `/perfil` no mostraba cursor de mano → agregado `cursor-pointer`

**3. Cinco fixes clínicos en página de riesgos (`/viaje/[id]/riesgos`)**
- **Advertencia viajeros >60 años en vacunas:** alerta visual para consultar médico antes de vacuna fiebre amarilla
- **Advertencia inmunosuprimidos en vacunas:** alerta para consultar médico por vacunas vivas atenuadas
- **DEET mencionado en dengue y malaria:** añadido en el tip de repelentes
- **Icaridina no disponible en Chile:** nota aclaratoria en tip de dengue
- **Sección cuidados especiales con niños:** expandida con 6 tips clínicos:
  - 🚗 SRI (Sistema de Retención Infantil — verificar silla en autos de alquiler)
  - 🏊 Baño seguro (prevención de ahogamiento, no tragar agua)
  - 💧 SRO (suero oral de rehidratación, signos de alarma)
  - ☀️ Protección solar
  - 🦟 DEET 10–30% desde 2 meses (en ropa para lactantes)
  - 🤕 Calzado cerrado (larva migrans)
  - 🏥 Números de emergencia locales
- **Concordancia TuGo vs. riesgos propios:** banner naranja cuando TuGo reporta nivel 1 (bajo) pero los riesgos internos son alto/muy_alto. Footer aclaratorio que TuGo mide seguridad, no salud específicamente.

**4. Cuatro fixes adicionales**
- **Deduplicación de vacunas:** fiebre amarilla dejó de aparecer dos veces (requerida + recomendada)
- **Brasil — Fiebre amarilla movida a "recomendadas"** (no es requerida en Brasil)
- **Icono malaria:** `🦟🩸` (zancudo + sangre) para distinguirlo del dengue `🦟`
- **Notas pediátricas Brasil actualizadas:** DEET desde 2 meses, Icaridina no disponible en Chile

**Archivos clave modificados:**
- `src/app/(app)/onboarding/page.tsx`
- `src/app/(app)/perfil/agregar-viajero/page.tsx`
- `src/app/actions/familia.ts`
- `src/app/(app)/viaje/[id]/riesgos/page.tsx`
- `src/app/(app)/viaje/[id]/page.tsx`
- `src/lib/content/destinos.ts`

**Commits de esta sesión:**
- `feat: registro de alergias multi-nivel (tipos + huevo + PLV + fármacos)`
- `fix: cursor-pointer en botón agregar integrante del perfil`
- `fix: advertencias clínicas vacunas (>60 años e inmunosuprimidos)`
- `fix: DEET en dengue y malaria, Icaridina no disponible en Chile`
- `fix: cuidados especiales niños expandidos (SRI, SRO, baño seguro)`
- `fix: concordancia TuGo vs riesgos propios con banner y nota aclaratoria`
- `fix: deduplicación vacunas, Brasil fiebre amarilla → recomendada, icono malaria 🦟🩸`
- `fix: SRI = Sistema de Retención Infantil (silla de auto)`

---

### Sesión 4 — 2026-05-13

**Lo que se hizo:**

**1. Reorganización de destinos con selector de 3 etapas**
- Nuevo selector en `/viaje/nuevo`: Continente → País → Ciudad (dropdown)
- Continentes: Centroamérica (México, Costa Rica, Rep. Dominicana) / Sudamérica (Brasil, Chile)
- 6–8 ciudades o zonas por cada país
- Chile agregado como nuevo destino (bajo riesgo infeccioso, UV alto, 7 ciudades)
- Slugs nuevos: `mexico`, `costa-rica`, `republica-dominicana`, `brasil`, `chile`
- Aliases de slugs anteriores (`brasil-nordeste`, etc.) para compatibilidad con viajes existentes
- `destino_nombre` compuesto: "México — Cancún / Riviera Maya" (sin nueva columna en BD)
- Landing actualizada: 5 destinos con subtexto de continente, stat "5 Destinos"

**2. Banderas reales (fix crítico Windows)**
- Problema: los emojis de bandera no se renderizan en Windows (aparecen como "BR", "MX")
- Solución: componente `<FlagImg code="mx" size={32} />` usando `flagcdn.com` (CDN gratuito)
- Nuevo campo `pais_code` (ISO alpha-2) en interfaz `Destino` y `flag_code` en `EscalaInfo`
- FlagImg reemplaza todos los emojis de bandera en: selector de destino, headers de viaje,
  checklist, botiquín, síntomas, riesgos, escalas y landing page
- Archivo: `src/components/ui/flag-img.tsx`

**3. Bottom nav global**
- Creado `src/app/(app)/layout.tsx` — inyecta `<BottomNav>` en todas las rutas autenticadas
- El layout (server) fetchea el primer viaje próximo del usuario y lo pasa como prop
- `<BottomNav primerViajeId?>` (client) usa `usePathname()` para detectar contexto
- Fix "Viaje": si hay un viaje, va a `/viaje/${id}` (detalles); si no, a `/viaje/nuevo`
- Fix "Síntomas": antes siempre activo (bug), ahora solo activo en `/viaje/[id]/sintomas`
- Fix "Síntomas" href: apunta al viaje actual o al primer viaje del usuario
- Eliminado nav hardcodeado del dashboard

**4. Página de Perfil**
- `/perfil` (server component): header con avatar de iniciales + nombre familia + email;
  cards de viajeros con condiciones médicas color-coded; historial de todos los viajes
  (próximos + pasados); sección cuenta con email; cerrar sesión; acerca de con disclaimer CDC
- `/perfil/agregar-viajero` (client component): formulario para añadir integrantes a la familia
- Nueva server action `agregarUnViajero()` en `familia.ts` (redirige a `/perfil`)

**5. Fix header dashboard**
- El botón 👤 en el header del dashboard cerraba sesión directamente — muy confuso
- Cambiado a ícono ⚙️ (Settings de Lucide) que navega a `/perfil`
- El cerrar sesión ahora vive solo en `/perfil` donde el usuario lo busca conscientemente

**6. Estrategia de monetización definida**
- Ver sección "💰 Modelo de negocio" más arriba
- Decisión: app gratis + teleorientación de pago (USD 29–39) + piloto gratis primero

**Commits de esta sesión:**
- `feat: reorganizar destinos por continente con selector de ciudad y agregar Chile`
- `feat: bottom nav global en todas las páginas de la app`
- `fix: footer nav — Viaje abre viaje existente y Síntomas no queda siempre activo`
- `fix: reemplazar emojis de bandera con imágenes reales (flagcdn.com)`
- `feat: página de Perfil completa con gestión de familia y viajes`
- `fix: reemplazar botón cerrar sesión del header por ícono de ajustes → perfil`

**Decisiones tomadas:**
- Banderas como imágenes (no emoji) — flagcdn.com es el estándar para esto
- El layout server hace el fetch del viaje para el nav (1 query extra por página, aceptable)
- Modelo de monetización: solo pago por servicio (teleorientación), app 100% free
- Pasarela de pago a definir post-piloto (MercadoPago favorito para Chile/LATAM)
- No se requirieron migraciones SQL en esta sesión

**Próxima sesión:**
→ Ver Sesión 5 abajo (se retomó con cambio de modelo de monetización)

---

### Sesión 7 — 2026-05-18

**Contexto:** Continuación de la sesión de trabajo. Foco en enriquecer el perfil de cada viajero con datos clínicos y demográficos relevantes, corregir bugs de UX, y agregar el módulo de seguro de viaje con visión de monetización futura.

**Lo que se hizo:**

**1. Campos avanzados en viajeros**
- `apellido` (opcional) — visible en perfil y en Step 2 del onboarding
- `sexo` biológico: femenino / masculino / intersex / prefiero no indicar — pills teal (relevante para recomendaciones médicas)
- `genero` identidad: mujer / hombre / no binario / género fluido / otro / prefiero no indicar — pills violet (opcional, se muestra en perfil)
- Inmunosupresión: selector de tipo (VIH/SIDA, cáncer activo, trasplante, autoinmune, corticoides, otra) con subpregunta de **carga viral** si es VIH
- Embarazo: campo **FUM** (fecha última menstruación) con cálculo automático de semanas. Alertas instantáneas: ≥28 semanas → requiere certificado médico, ≥36 semanas → no debe viajar
- En la página del viaje: calcula semanas al día de **salida del viaje** y muestra tarjetas de advertencia/crítico según corresponda

**2. Bugs corregidos**
- Fix: botón "Guardar" en `/perfil/agregar-viajero` quedaba tapado por el BottomNav (z-40) → subido a `bottom-[72px]` con z-30
- Fix: botón fijo de creación de viaje también movido a `bottom-[72px]` para consistencia
- Fix: "Familia no encontrada" en onboarding — causado por `redirect('/onboarding')` fuera del `if (data.user)` block + fallo de INSERT por RLS sin sesión → usar adminClient en `registrar` + validar `data.user`
- Fix: onboarding ahora incluye "Nombre de la familia" y `agregarViajeros` lo usa para crear la familia si no existe (recuperación de registros incompletos)

**3. Step 4 de seguro de viaje**
- Nuevo paso en `/viaje/nuevo`: "¿Viajarán con seguro médico?" con 3 opciones: sí (+ campo compañía) / no (aviso de riesgo) / no decidido (recordatorio en checklist)
- Datos guardados en `viajes.seguro_viaje` y `viajes.seguro_compania`
- Estrategia: datos listos para futura asociación con aseguradora y cobro de comisión

**4. Decisión de fuentes clínicas (roadmap)**
- Investigado: el CDC Yellow Book NO tiene API oficial
- Planificado integrar **TuGo API** (gratuita, diaria, 225+ países) + **CDC RSS Travel Notices** (alertas de brotes)
- Anotado en roadmap Fase 2

**Migraciones SQL de esta sesión:**
```sql
ALTER TABLE viajeros ADD COLUMN apellido text, inmunosupresion_tipo text, vih_carga_viral text, embarazo_fum date;
ALTER TABLE viajeros ADD COLUMN sexo text, genero text;
ALTER TABLE viajes ADD COLUMN seguro_viaje text, seguro_compania text;
```

**Commits de esta sesión:**
- `feat: apellido, categorías inmunosupresión y FUM embarazo en viajeros`
- `feat: sexo biológico e identidad de género en viajeros`
- `fix: registrar usa adminClient para crear familia y valida data.user`
- `fix: onboarding crea la familia si no existe (recuperación de registro incompleto)`
- `fix: botón Guardar de agregar-viajero visible sobre el BottomNav`
- `feat: step 4 de seguro de viaje en creación de viaje`

---

### Sesión 6 — 2026-05-17

**Contexto:** Sesión de corrección de bugs críticos y mejoras de seguridad.

**Lo que se hizo:**
- Fix: teleorientación ahora gateada correctamente detrás de Nivel 3 (era accesible a usuarios con plan 'preparacion'). Separado en `page.tsx` (server, chequea plan con PlanGate) + `TeleorientacionClient.tsx` (client, formulario)
- Fix: emoji médico cambiado de 👨‍⚕️ a 👩‍⚕️ en dashboard, botiquín, síntomas y viaje detalle
- Feature: Eliminación de cuenta desde `/perfil` — `EliminarCuentaBtn` client component con confirmación en 2 pasos
- Feature: `eliminarCuenta()` server action borra toda la data (checklist, síntomas, teleorientaciones, viajes, viajeros, familia) y elimina el auth user via `adminClient.auth.admin.deleteUser()`
- Feature: `createAdminClient()` en `src/lib/supabase/admin.ts` con `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` configurada en Vercel como variable de entorno

**Commits de esta sesión:**
- `feat: eliminar cuenta con confirmación desde /perfil`
- `fix: teleorientación correctamente gateada detrás de Acompañamiento`
- `fix: icono médico cambiado a mujer (👩‍⚕️)`

---

### Sesión 5 — 2026-05-16

**Contexto:** Retomada la sesión con imagen del pitch deck que define modelo freemium de 3 niveles (Exploración / Preparación Total / Acompañamiento). Se adopta este modelo reemplazando la decisión previa de "todo gratis".

**Cambios de modelo:**
- Nivel 1 (Gratis): perfil, riesgos, checklist básico
- Nivel 2 (USD 19–29/viaje): checklist detallado, botiquín, PDF
- Nivel 3 (USD 29–39/evento): síntomas, teleorientación, seguimiento

**Lo que se hizo esta sesión:**
- [x] Documentación actualizada con nuevo modelo freemium
- [x] Migración SQL ejecutada: `ALTER TABLE familias ADD COLUMN plan text DEFAULT 'gratis'`
- [x] Componente `<PlanGate>` y `<PlanBanner>` — paywall reutilizable con CTA de upgrade
- [x] Checklist con versión básica libre (vacunas + docs) + PlanBanner para el detallado
- [x] Botiquín gateado completamente detrás de Nivel 2
- [x] Síntomas gateado completamente detrás de Nivel 3
- [x] Página `/precios` — 3 planes con features, precios y "Solicitar acceso" por email
- [x] Página `/teleorientacion` — formulario motivo + urgencia + nota → mailto
- [x] Reporte familiar PDF (`@react-pdf/renderer`) — portada, riesgos CDC, vacunas, checklist
- [x] API route `GET /api/reporte/[viajeId]` — auth + plan check + descarga directa
- [x] Botón descarga PDF en página del viaje (gateado por plan, CTA de upgrade si gratis)
- [x] Landing page rediseñada — sección "Cómo funciona", sección "Planes", testimonios, footer expandido

**Commits de esta sesión:**
- `feat: modelo freemium 3 niveles con paywalls y páginas de precios/teleorientación`
- `feat: reporte familiar PDF descargable (Nivel 2 — Preparación Total)`
- `feat: landing page actualizada con modelo de 3 niveles y sección de planes`

**Decisiones técnicas:**
- `@react-pdf/renderer` via API route server-side (no puppeteer — compatible con Vercel)
- `serverExternalPackages: ['@react-pdf/renderer']` en next.config.ts para excluir canvas del bundle
- Buffer → `new Uint8Array(buffer)` para compatibilidad con Web API Response
- Testimonios en landing son placeholder para piloto — reemplazar con reales post-piloto

**Decisiones tomadas:**
- Modelo freemium 3 niveles adoptado definitivamente
- Durante piloto: sin gateway → botón "Solicitar acceso" envía a hola@sariqama.com
- `familias.plan` se actualiza manualmente desde Supabase dashboard durante el piloto
- Flexibilidad: campo `plan` permite liberar features para demos fácilmente

---

### Sesión 3 — 2026-05-12
**Lo que se hizo:**
- Creador de viaje (`/viaje/nuevo`): 3 pasos con destino, fechas y tipo
- Ficha de riesgos por destino (`/viaje/[id]/riesgos`): 8 riesgos + vacunas + notas pediátricas
- Página de detalle del viaje (`/viaje/[id]`): progreso checklist, acciones rápidas, riesgos resumen
- Checklist pre-viaje (`/viaje/[id]/checklist`): toggle optimista con `useTransition`, agrupado por categoría
- Botiquín familiar (`/viaje/[id]/botiquin`): curado por destino, sección pediátrica automática
- Symptom Checker (`/viaje/[id]/sintomas`): 3 pasos + semáforo determinístico (CDC)
- Guardado de síntomas en `sintomas_log` con historial expandible y detección de tendencia
- Opción "Otro / Invitado" con nombre libre y toggle ¿Es niño?
- Eliminación de viaje con confirmación inline (server action con ownership check)
- Escalas en viajes: select desplegable por destino (11 ciudades/países curados)
- Riesgos de salud + requerimientos de aduana por país de escala (`/lib/content/escalas.ts`)
- Correcciones dashboard: "años" completo, "Viajes próximos" en header, links accesos rápidos
- Fix: columna `fiebre` en sintomas_log es numeric → se omite el boolean, dato queda en sintomas[]
- Fix: viajero e invitado son mutuamente excluyentes en el selector de síntomas

**Decisiones tomadas:**
- Guardar síntomas automáticamente al llegar al resultado (sin botón extra), con `router.refresh()` para actualizar historial
- Escalas usan select con opciones curadas por destino (no texto libre)
- Tipos de viaje: multi-select con checkmarks, genera checklist acumulativo
- Información de aduana curada para chilenos/LATAM (visa, documentos, restricciones, ESTA para EE.UU.)

**Próxima sesión:**
- Formulario de teleorientación (`/teleorientacion`) con Calendly

### Sesión 2 — 2026-05-12
**Lo que se hizo:**
- Verificación dominio sariqama.com ✅ en Vercel (Valid Configuration)
- Rediseño completo del sistema de diseño basado en prototipo HTML de referencia
- Adopción de fuentes DM Sans + Fraunces
- Rediseño landing, login, registro y dashboard con nueva identidad visual
- Creación de componentes RiskChip y AppShell reutilizables

**Decisiones tomadas:**
- Opción A de rediseño: adopción completa del sistema de diseño del prototipo HTML
- Desfase de 1 sesión en el roadmap (justificado: evita deuda de diseño futura)
- Bottom navigation fija para experiencia mobile-first
- CTA principal en amber/amarillo sobre fondos teal (contraste del prototipo)

**Próxima sesión:**
- Creador de viaje funcional (destino, fechas, tipo)
- Ficha de riesgos por destino
- Página de detalle de viaje

---

### Sesión 1 — 2026-05-11
**Lo que se hizo:**
- Análisis completo de 5 documentos del proyecto (pitch, fundador, canvas, roadmaps)
- Definición de estrategia MVP: sitio web, mínimo costo, Claude como desarrollador
- Decisión de usar Vercel + dominio Bluehosting
- Renombrado de TROPICARE → SARIQAMA
- Setup completo de infraestructura (Next.js, GitHub, Vercel, Supabase)
- DNS configurado en Bluehosting apuntando a Vercel
- Auth y onboarding funcional con Supabase

**Decisiones tomadas:**
- PWA/app móvil → sitio web responsive
- Bluehosting hosting compartido → Vercel gratis (Bluehosting para dominio + email)
- Stack: Next.js 15 + Supabase + shadcn/ui
- Auth: Supabase Auth con email (sin confirmación en piloto)

**Próxima sesión:**
- Creador de viaje funcional
- Ficha de riesgos por destino
- Página de detalle de viaje

---

*Este archivo se actualiza al final de cada sesión. Si algo no está documentado aquí, pregunta.*
