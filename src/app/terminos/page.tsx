import Link from 'next/link'
import { Leaf } from 'lucide-react'

export const metadata = {
  title: 'Términos y Condiciones · SARIQAMA',
  description: 'Términos y condiciones de uso y política de privacidad de SARIQAMA.',
}

export default function TerminosPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-5 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-teal-600" />
            <span className="font-bold text-slate-900" style={{ fontFamily: 'var(--font-fraunces)' }}>
              SARIQAMA
            </span>
          </Link>
          <Link href="/registro" className="text-sm text-teal-600 font-semibold hover:text-teal-700 transition-colors">
            Crear cuenta →
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-5 py-12 pb-20">
        {/* Título */}
        <div className="mb-10">
          <p className="text-xs font-semibold text-teal-600 uppercase tracking-widest mb-2">Legal</p>
          <h1 className="text-3xl font-bold text-slate-900 mb-2" style={{ fontFamily: 'var(--font-fraunces)' }}>
            Términos y Condiciones
          </h1>
          <p className="text-sm text-slate-500">Última actualización: mayo 2026</p>
        </div>

        <div className="prose prose-slate max-w-none space-y-10">

          {/* 1 */}
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3 pb-2 border-b border-slate-100">
              1. Sobre SARIQAMA
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              SARIQAMA es una plataforma digital de orientación en salud del viajero diseñada para familias latinoamericanas. Proporciona información sanitaria personalizada basada en destinos tropicales, checklists de preparación pre-viaje, evaluación referencial de síntomas y orientación médica a distancia.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed mt-3">
              SARIQAMA no es un proveedor de servicios médicos y no reemplaza la consulta, evaluación ni tratamiento por parte de un profesional de la salud. Toda la información entregada por la plataforma es de carácter orientativo.
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3 pb-2 border-b border-slate-100">
              2. Aceptación de los términos
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Al crear una cuenta en SARIQAMA, el usuario declara haber leído, comprendido y aceptado íntegramente estos Términos y Condiciones, así como la Política de Privacidad aquí contenida. Si no estás de acuerdo con alguna de las disposiciones, te pedimos que no utilices la plataforma.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed mt-3">
              El uso continuado de SARIQAMA tras cualquier modificación de estos términos constituye la aceptación de los cambios realizados.
            </p>
          </section>

          {/* 3 */}
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3 pb-2 border-b border-slate-100">
              3. Descripción del servicio
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              SARIQAMA ofrece los siguientes servicios:
            </p>
            <ul className="mt-3 space-y-2">
              {[
                'Perfil familiar con datos de salud de cada integrante para personalizar las recomendaciones',
                'Evaluación de riesgos sanitarios por destino basada en el CDC Yellow Book 2026 y fuentes oficiales equivalentes',
                'Checklist de preparación pre-viaje adaptado al destino, tipo de viaje y perfil familiar',
                'Recomendaciones de botiquín familiar, con consideraciones pediátricas',
                'Evaluador referencial de síntomas durante el viaje (semáforo clínico)',
                'Teleorientación médica a distancia con especialistas en medicina del viajero',
                'Reporte familiar PDF descargable',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                  <span className="text-teal-500 mt-0.5 flex-shrink-0">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-4 p-4 bg-amber-50 border border-amber-100 rounded-xl">
              <p className="text-xs font-bold text-amber-800 mb-1">⚠️ Límite del servicio</p>
              <p className="text-xs text-amber-700 leading-relaxed">
                SARIQAMA entrega orientación sanitaria. No reemplaza la evaluación médica profesional. Ante una emergencia o signos de alarma, acude inmediatamente a un servicio de salud. Ninguna información de esta plataforma constituye un diagnóstico médico.
              </p>
            </div>
          </section>

          {/* 4 */}
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3 pb-2 border-b border-slate-100">
              4. Datos personales que recolectamos
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-3">
              Para prestar el servicio, SARIQAMA recolecta y almacena los siguientes datos:
            </p>
            <div className="space-y-3">
              {[
                { cat: 'Cuenta', items: 'Correo electrónico y contraseña (encriptada).' },
                { cat: 'Perfil familiar', items: 'Nombre de la familia.' },
                { cat: 'Integrantes', items: 'Nombre, apellido (opcional), edad, sexo biológico (opcional), identidad de género (opcional), condiciones de salud (alergias, asma, diabetes, cardiopatía, inmunosupresión y su tipo, embarazo y fecha de última menstruación).' },
                { cat: 'Viajes', items: 'Destino, fechas, tipo de viaje, escalas y si cuentan con seguro médico de viaje.' },
                { cat: 'Uso del servicio', items: 'Checklists completados, evaluaciones de síntomas registradas y solicitudes de teleorientación.' },
              ].map(({ cat, items }) => (
                <div key={cat} className="bg-white rounded-xl border border-slate-100 p-4">
                  <p className="text-xs font-bold text-slate-700 mb-1">{cat}</p>
                  <p className="text-xs text-slate-500 leading-relaxed">{items}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 5 */}
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3 pb-2 border-b border-slate-100">
              5. Finalidad y uso de los datos
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-3">
              Los datos recolectados se utilizan exclusivamente para:
            </p>
            <ul className="space-y-2">
              {[
                'Personalizar las recomendaciones sanitarias según el perfil de salud familiar y el destino del viaje',
                'Generar el checklist, botiquín y evaluaciones de síntomas adaptados a cada familia',
                'Facilitar la teleorientación médica a distancia',
                'Mejorar continuamente el servicio y sus algoritmos de recomendación',
                'Comunicar actualizaciones relevantes del servicio (con posibilidad de baja)',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                  <span className="text-teal-500 mt-0.5 flex-shrink-0">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-sm text-slate-600 leading-relaxed mt-4">
              <strong>No vendemos ni cedemos tus datos a terceros con fines publicitarios.</strong> En el futuro, SARIQAMA podría asociarse con proveedores de seguros de viaje para ofrecer cotizaciones a usuarios que no cuenten con cobertura. En ese caso, la información compartida será agregada y anonimizada, salvo que el usuario otorgue consentimiento explícito para un contacto personalizado.
            </p>
          </section>

          {/* 6 */}
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3 pb-2 border-b border-slate-100">
              6. Almacenamiento y seguridad
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Los datos son almacenados en <strong>Supabase</strong> (PostgreSQL en la nube), con cifrado en tránsito (TLS) y en reposo. El acceso a los datos está controlado mediante políticas de seguridad a nivel de fila (<em>Row Level Security</em>), lo que garantiza que cada familia solo pueda acceder a sus propios datos.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed mt-3">
              La plataforma web es desplegada en <strong>Vercel</strong>, con certificado SSL activo. Las contraseñas nunca se almacenan en texto plano — son gestionadas íntegramente por Supabase Auth mediante encriptación bcrypt.
            </p>
          </section>

          {/* 7 */}
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3 pb-2 border-b border-slate-100">
              7. Derechos del usuario
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-3">
              De acuerdo con la Ley N° 19.628 sobre Protección de la Vida Privada (Chile) y principios equivalentes de protección de datos personales, tienes derecho a:
            </p>
            <ul className="space-y-2">
              {[
                { d: 'Acceso', t: 'Consultar los datos que tenemos almacenados sobre tu familia en cualquier momento.' },
                { d: 'Rectificación', t: 'Modificar datos incorrectos o desactualizados directamente desde tu perfil.' },
                { d: 'Eliminación', t: 'Eliminar completamente tu cuenta y todos los datos asociados desde la opción "Eliminar mi cuenta" en tu perfil, o solicitándolo a contacto@sariqama.com.' },
                { d: 'Portabilidad', t: 'Solicitar una copia de tus datos en formato legible enviando un correo a contacto@sariqama.com.' },
                { d: 'Oposición', t: 'Oponerte al uso de tus datos para fines distintos a los esenciales del servicio.' },
              ].map(({ d, t }) => (
                <li key={d} className="flex items-start gap-2 text-sm text-slate-600">
                  <span className="text-teal-500 mt-0.5 flex-shrink-0">✓</span>
                  <span><strong>{d}:</strong> {t}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 8 */}
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3 pb-2 border-b border-slate-100">
              8. Menores de edad
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              SARIQAMA está diseñada para ser usada por adultos responsables de la familia. Los datos de salud de menores de edad que se ingresen a la plataforma (como integrantes de la familia) solo deben ser ingresados por sus padres o tutores legales, quienes asumen la responsabilidad de dicho registro y dan su consentimiento en nombre del menor.
            </p>
          </section>

          {/* 9 */}
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3 pb-2 border-b border-slate-100">
              9. Limitación de responsabilidad médica
            </h2>
            <div className="p-4 bg-red-50 border border-red-100 rounded-xl">
              <p className="text-sm text-red-700 leading-relaxed">
                La información proporcionada por SARIQAMA se basa en fuentes clínicas reconocidas (CDC Yellow Book 2026 y equivalentes), pero <strong>no constituye consejo médico individual</strong>. SARIQAMA no se responsabiliza por decisiones de salud tomadas con base exclusiva en la información de la plataforma. Ante cualquier síntoma de alarma, emergencia médica o duda clínica, consulta inmediatamente a un profesional de la salud o acude a urgencias.
              </p>
            </div>
          </section>

          {/* 10 */}
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3 pb-2 border-b border-slate-100">
              10. Modificaciones a los términos
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              SARIQAMA se reserva el derecho de modificar estos Términos y Condiciones en cualquier momento. Las modificaciones serán notificadas mediante el correo electrónico registrado con al menos 15 días de anticipación antes de entrar en vigor. El uso continuado del servicio tras la notificación implica la aceptación de los nuevos términos.
            </p>
          </section>

          {/* 11 */}
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3 pb-2 border-b border-slate-100">
              11. Ley aplicable y jurisdicción
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Estos Términos y Condiciones se rigen por las leyes de la República de Chile, en particular la Ley N° 19.628 sobre Protección de la Vida Privada. Cualquier controversia derivada del uso de SARIQAMA será sometida a los tribunales ordinarios de justicia de la ciudad de Santiago de Chile.
            </p>
          </section>

          {/* 12 */}
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3 pb-2 border-b border-slate-100">
              12. Contacto
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Para ejercer tus derechos, hacer consultas sobre privacidad o reportar algún problema relacionado con el tratamiento de tus datos, puedes contactarnos en:
            </p>
            <div className="mt-3 p-4 bg-teal-50 border border-teal-100 rounded-xl">
              <p className="text-sm font-semibold text-teal-800">SARIQAMA</p>
              <a href="mailto:contacto@sariqama.com" className="text-sm text-teal-600 hover:text-teal-700 transition-colors">
                contacto@sariqama.com
              </a>
            </div>
          </section>

        </div>
      </main>

      {/* Footer mínimo */}
      <footer className="border-t border-slate-200 py-6 px-5 text-center">
        <p className="text-xs text-slate-400">© 2026 SARIQAMA · Orientación sanitaria, no diagnóstico médico.</p>
        <Link href="/" className="text-xs text-teal-600 hover:text-teal-700 transition-colors mt-1 inline-block">
          ← Volver al inicio
        </Link>
      </footer>
    </div>
  )
}
