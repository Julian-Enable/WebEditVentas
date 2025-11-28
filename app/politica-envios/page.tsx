'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface SiteSettings {
  siteName: string;
  logoUrl: string;
}

export default function PoliticaEnviosPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const res = await fetch('/api/settings');
    const data = await res.json();
    setSettings(data);
  };

  if (!settings) return <div>Cargando...</div>;

  return (
    <main>
      <Navbar siteName={settings.siteName} logoUrl={settings.logoUrl} />
      
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl font-bold mb-8 text-gray-900">Política de Envíos</h1>
          
          <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">1. Cobertura de Envíos</h2>
              <p className="text-gray-600 leading-relaxed mb-3">
                En {settings.siteName}, realizamos envíos a todo el territorio nacional de Colombia. Nuestras zonas de 
                cobertura incluyen:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li><strong>Envío Nacional:</strong> Todas las ciudades principales y municipios de Colombia</li>
                <li><strong>Zonas Especiales:</strong> Algunas zonas rurales o de difícil acceso pueden tener costos adicionales</li>
                <li><strong>Islas y Territorios Especiales:</strong> Consultar disponibilidad y costos especiales</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">2. Métodos de Envío</h2>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold text-lg text-gray-800 mb-2">Envío Nacional Estándar (GRATIS)</h3>
                  <p className="text-gray-600">
                    <strong>Tiempo de entrega:</strong> 3-7 días hábiles<br/>
                    <strong>Costo:</strong> Gratis para todos los pedidos<br/>
                    <strong>Tracking:</strong> Número de seguimiento proporcionado
                  </p>
                </div>

                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-semibold text-lg text-gray-800 mb-2">Envío Express</h3>
                  <p className="text-gray-600">
                    <strong>Tiempo de entrega:</strong> 1-3 días hábiles<br/>
                    <strong>Costo:</strong> Variable según ubicación<br/>
                    <strong>Disponibilidad:</strong> Principales ciudades
                  </p>
                </div>

                <div className="border-l-4 border-orange-500 pl-4">
                  <h3 className="font-semibold text-lg text-gray-800 mb-2">Recogida en Tienda</h3>
                  <p className="text-gray-600">
                    <strong>Tiempo:</strong> Disponible al día siguiente<br/>
                    <strong>Costo:</strong> Gratis<br/>
                    <strong>Ubicación:</strong> Medellín, Colombia
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">3. Tiempos de Procesamiento</h2>
              <p className="text-gray-600 leading-relaxed mb-3">
                Los pedidos se procesan de la siguiente manera:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Pedidos realizados de lunes a viernes antes de las 2:00 PM: se procesan el mismo día</li>
                <li>Pedidos realizados después de las 2:00 PM o fines de semana: se procesan el siguiente día hábil</li>
                <li>Una vez procesado, recibirás un correo electrónico con el número de seguimiento</li>
                <li>El tiempo de procesamiento es adicional al tiempo de envío</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">4. Seguimiento de Pedidos</h2>
              <p className="text-gray-600 leading-relaxed">
                Una vez que tu pedido haya sido enviado, recibirás un correo electrónico con un número de seguimiento. 
                Puedes usar este número para rastrear tu paquete en tiempo real a través de la página web de la empresa 
                de mensajería. También puedes verificar el estado de tu pedido iniciando sesión en tu cuenta de 
                {settings.siteName}.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">5. Costos de Envío</h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-gray-700 mb-3">
                  <strong>Actualmente ofrecemos ENVÍO GRATIS en todos los pedidos dentro de Colombia.</strong>
                </p>
                <p className="text-gray-600 text-sm">
                  * Los envíos a zonas especiales o de difícil acceso pueden tener costos adicionales que se informarán 
                  antes de confirmar el pedido.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">6. Direcciones de Envío</h2>
              <p className="text-gray-600 leading-relaxed mb-3">
                Es responsabilidad del cliente proporcionar una dirección de envío completa y correcta. Por favor asegúrate de:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Incluir el nombre completo del destinatario</li>
                <li>Proporcionar la dirección completa con número de casa/apartamento</li>
                <li>Especificar referencias o indicaciones adicionales si es necesario</li>
                <li>Incluir un número de teléfono de contacto válido</li>
                <li>Verificar que la dirección sea accesible para servicios de mensajería</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">7. Intentos de Entrega</h2>
              <p className="text-gray-600 leading-relaxed">
                La empresa de mensajería realizará hasta 3 intentos de entrega en la dirección proporcionada. Si después 
                de los 3 intentos no es posible entregar el paquete, este será devuelto a nuestras instalaciones. En caso 
                de devolución por esta razón:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 mt-3">
                <li>Se te notificará por correo electrónico</li>
                <li>Podrás solicitar un nuevo envío (pueden aplicar cargos adicionales)</li>
                <li>Podrás solicitar un reembolso (menos los costos de envío)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">8. Pago Contra Entrega</h2>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">Seguro de Envío Obligatorio</h3>
                <p className="text-gray-700 mb-3">
                  Para pedidos con pago contra entrega, se requiere el pago de un seguro de envío de <strong>$2,700 COP</strong> 
                  al momento de realizar el pedido. Este seguro:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Debe pagarse con tarjeta de crédito o débito</li>
                  <li>Garantiza la protección de tu pedido durante el envío</li>
                  <li>Cubre pérdidas, daños o extravíos durante el transporte</li>
                  <li>Es requerido debido a la alta tasa de pedidos no recogidos</li>
                </ul>
                <p className="text-gray-600 text-sm mt-3">
                  El resto del pedido se paga en efectivo al momento de recibirlo.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">9. Productos Dañados o Perdidos</h2>
              <p className="text-gray-600 leading-relaxed">
                Si tu pedido llega dañado o se pierde durante el envío, por favor contacta nuestro servicio al cliente 
                dentro de las 48 horas posteriores a la entrega (en caso de daños) o inmediatamente si el paquete se 
                marca como entregado pero no lo recibiste. Investigaremos el problema y procederemos con un reemplazo 
                o reembolso según corresponda.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">10. Modificación de Pedidos</h2>
              <p className="text-gray-600 leading-relaxed">
                Una vez que un pedido ha sido procesado y enviado, no es posible modificar la dirección de entrega. 
                Si necesitas cambiar la dirección antes del envío, contacta inmediatamente a nuestro servicio al cliente. 
                Haremos todo lo posible para acomodar tu solicitud si el pedido aún no ha sido despachado.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">11. Días Festivos</h2>
              <p className="text-gray-600 leading-relaxed">
                Ten en cuenta que los envíos pueden retrasarse durante días festivos nacionales. Los tiempos de entrega 
                estimados no incluyen días festivos o fines de semana. Nuestro equipo de atención al cliente estará 
                disponible para asistirte con cualquier consulta relacionada con envíos durante estos períodos.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">12. Contacto para Envíos</h2>
              <p className="text-gray-600 leading-relaxed mb-3">
                Si tienes preguntas sobre el estado de tu envío o necesitas asistencia, puedes contactarnos:
              </p>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-gray-700"><strong>Email:</strong> pedidos@casaplay.shop</p>
                <p className="text-gray-700"><strong>Teléfono:</strong> +57 321 224 2773</p>
                <p className="text-gray-700"><strong>WhatsApp:</strong> +57 321 224 2773</p>
                <p className="text-gray-700"><strong>Horario de atención:</strong> Lunes a Viernes, 8:00 AM - 6:00 PM</p>
              </div>
            </section>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Última actualización: {new Date().toLocaleDateString('es-CO', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer siteName={settings.siteName} />
    </main>
  );
}
