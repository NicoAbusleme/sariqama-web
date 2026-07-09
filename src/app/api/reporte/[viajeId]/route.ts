import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getDestinoBySlug } from '@/lib/content/destinos'
import { renderToBuffer } from '@react-pdf/renderer'
import { ReportePDF } from '@/lib/pdf/ReportePDF'
import React, { type ReactElement } from 'react'
import { decryptViajero } from '@/lib/crypto'

// Planes que tienen acceso al reporte PDF
const PLANES_CON_ACCESO = ['preparacion', 'acompanamiento']

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ viajeId: string }> }
) {
  const { viajeId } = await params

  try {
    const supabase = await createClient()

    // ── Auth ──────────────────────────────────────────────────────
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    // ── Familia + plan ────────────────────────────────────────────
    const { data: familia } = await supabase
      .from('familias')
      .select('id, nombre, plan')
      .eq('user_id', user.id)
      .single()

    if (!familia) {
      return NextResponse.json({ error: 'Familia no encontrada' }, { status: 404 })
    }

    const userPlan: string = familia.plan ?? 'gratis'
    if (!PLANES_CON_ACCESO.includes(userPlan)) {
      return NextResponse.json(
        { error: 'Esta función requiere el plan Preparación Total o superior.' },
        { status: 403 }
      )
    }

    // ── Viaje ─────────────────────────────────────────────────────
    const { data: viaje } = await supabase
      .from('viajes')
      .select('*')
      .eq('id', viajeId)
      .single()

    if (!viaje || viaje.familia_id !== familia.id) {
      return NextResponse.json({ error: 'Viaje no encontrado' }, { status: 404 })
    }

    // ── Viajeros ──────────────────────────────────────────────────
    const { data: rawViajeros } = await supabase
      .from('viajeros')
      .select('nombre, edad, es_nino, condiciones')
      .eq('familia_id', familia.id)
      .order('edad', { ascending: false })
    const viajeros = (rawViajeros ?? []).map(decryptViajero)

    // ── Checklist ─────────────────────────────────────────────────
    const { data: checklist } = await supabase
      .from('checklist_items')
      .select('tarea, categoria, completado, prioridad, descripcion')
      .eq('viaje_id', viajeId)
      .order('prioridad')

    // ── Destino (contenido clínico) ───────────────────────────────
    const destino = getDestinoBySlug(viaje.destino_slug)

    // ── Generar PDF ───────────────────────────────────────────────
    const generadoEn = new Date().toLocaleDateString('es-CL', {
      day: 'numeric', month: 'long', year: 'numeric',
    })

    const data = {
      familiaNombre:       familia.nombre,
      destinoNombre:       viaje.destino_nombre,
      destinoPais:         destino?.pais ?? viaje.destino_nombre,
      fechaSalida:         viaje.fecha_salida,
      fechaRegreso:        viaje.fecha_regreso,
      tipos:               viaje.tipos ?? [],
      viajeros:            viajeros ?? [],
      riesgos:             destino?.riesgos ?? {},
      vacunasRecomendadas: destino?.vacunas_recomendadas ?? [],
      vacunasRequeridas:   destino?.vacunas_requeridas ?? [],
      checklist:           checklist ?? [],
      generadoEn,
    }

    const element = React.createElement(ReportePDF, { data }) as ReactElement<any>
    const buffer = await renderToBuffer(element)

    // Nombre del archivo: sariqama-familia-destino.pdf
    const nombreArchivo = `sariqama-${familia.nombre.toLowerCase().replace(/\s+/g, '-')}-${destino?.pais_code ?? 'reporte'}.pdf`

    return new Response(new Uint8Array(buffer), {
      status: 200,
      headers: {
        'Content-Type':        'application/pdf',
        'Content-Disposition': `attachment; filename="${nombreArchivo}"`,
        'Content-Length':      buffer.length.toString(),
        'Cache-Control':       'no-store',
      },
    })

  } catch (error) {
    console.error('[reporte/pdf] Error generando PDF:', error)
    return NextResponse.json(
      { error: 'Error al generar el reporte. Intenta nuevamente.' },
      { status: 500 }
    )
  }
}
