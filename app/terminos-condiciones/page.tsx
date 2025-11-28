'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface SiteSettings {
  siteName: string;
  logoUrl: string;
}

export default function TerminosCondicionesPage() {
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
          <h1 className="text-4xl font-bold mb-8 text-gray-900">Términos y Condiciones</h1>
          
          <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">1. Aceptación de los Términos</h2>
              <p className="text-gray-600 leading-relaxed">
                Al acceder y utilizar {settings.siteName}, aceptas estar sujeto a estos Términos y Condiciones de uso, 
                todas las leyes y regulaciones aplicables, y aceptas que eres responsable del cumplimiento de las leyes 
                locales aplicables. Si no estás de acuerdo con alguno de estos términos, tienes prohibido usar o acceder 
                a este sitio.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">2. Uso del Sitio Web</h2>
              <p className="text-gray-600 leading-relaxed mb-3">
                Al utilizar nuestro sitio web, te comprometes a:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Proporcionar información precisa, actual y completa sobre ti mismo</li>
                <li>Mantener la seguridad de tu contraseña y cuenta</li>
                <li>No utilizar el sitio para fines ilegales o no autorizados</li>
                <li>No interferir con el funcionamiento del sitio</li>
                <li>Cumplir con todas las leyes locales, estatales y nacionales aplicables</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">3. Productos y Servicios</h2>
              <p className="text-gray-600 leading-relaxed">
                Todos los productos y servicios están sujetos a disponibilidad. Nos reservamos el derecho de descontinuar 
                cualquier producto en cualquier momento. Los precios de nuestros productos están sujetos a cambios sin previo 
                aviso. Nos reservamos el derecho de modificar o descontinuar el servicio (o cualquier parte del mismo) sin 
                previo aviso en cualquier momento.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">4. Precios y Pagos</h2>
              <p className="text-gray-600 leading-relaxed">
                Todos los precios están expresados en Pesos Colombianos (COP) e incluyen IVA cuando corresponda. Nos 
                reservamos el derecho de rechazar cualquier pedido que realices con nosotros. Podemos, a nuestra discreción, 
                limitar o cancelar las cantidades compradas por persona, por hogar o por pedido. Aceptamos diversos métodos 
                de pago incluyendo tarjetas de crédito, débito y pago contra entrega.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">5. Envíos y Entregas</h2>
              <p className="text-gray-600 leading-relaxed mb-3">
                Los tiempos de entrega son estimados y pueden variar según la ubicación y disponibilidad. No nos hacemos 
                responsables por retrasos causados por:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Información de envío incorrecta proporcionada por el cliente</li>
                <li>Circunstancias fuera de nuestro control (desastres naturales, huelgas, etc.)</li>
                <li>Retrasos por parte de las empresas de mensajería</li>
                <li>Direcciones inaccesibles o zonas de difícil acceso</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">6. Devoluciones y Reembolsos</h2>
              <p className="text-gray-600 leading-relaxed">
                Aceptamos devoluciones dentro de los 30 días posteriores a la compra, siempre que el producto esté en su 
                estado original, sin usar y en su embalaje original. Los costos de envío de devolución corren por cuenta 
                del cliente a menos que el producto sea defectuoso o se haya enviado incorrectamente. Los reembolsos se 
                procesarán dentro de 5-10 días hábiles después de recibir el artículo devuelto.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">7. Propiedad Intelectual</h2>
              <p className="text-gray-600 leading-relaxed">
                Todo el contenido incluido en este sitio, como texto, gráficos, logos, íconos de botones, imágenes, clips 
                de audio, descargas digitales y compilaciones de datos, es propiedad de {settings.siteName} o de sus 
                proveedores de contenido y está protegido por las leyes de derechos de autor de Colombia e internacionales.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">8. Limitación de Responsabilidad</h2>
              <p className="text-gray-600 leading-relaxed">
                En ningún caso {settings.siteName} o sus proveedores serán responsables de daños especiales, incidentales 
                o consecuentes que resulten del uso o la imposibilidad de usar el sitio web, incluso si {settings.siteName} 
                o un representante autorizado ha sido notificado oralmente o por escrito de la posibilidad de tales daños.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">9. Garantías</h2>
              <p className="text-gray-600 leading-relaxed">
                Todos los productos vendidos en {settings.siteName} vienen con las garantías del fabricante cuando aplique. 
                No ofrecemos garantías adicionales más allá de las proporcionadas por el fabricante. Los productos defectuosos 
                cubiertos por garantía serán reparados o reemplazados según los términos de la garantía del fabricante.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">10. Modificaciones</h2>
              <p className="text-gray-600 leading-relaxed">
                Nos reservamos el derecho de revisar estos Términos y Condiciones en cualquier momento sin previo aviso. 
                Al utilizar este sitio web, aceptas estar sujeto a la versión actual de estos Términos y Condiciones de uso.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">11. Ley Aplicable</h2>
              <p className="text-gray-600 leading-relaxed">
                Estos términos y condiciones se rigen por las leyes de Colombia y cualquier disputa relacionada con estos 
                términos y condiciones estará sujeta a la jurisdicción exclusiva de los tribunales de Colombia.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">12. Contacto</h2>
              <p className="text-gray-600 leading-relaxed">
                Si tienes alguna pregunta sobre estos Términos y Condiciones, puedes contactarnos en:
              </p>
              <div className="mt-3 text-gray-700">
                <p><strong>Email:</strong> info@tienda.com</p>
                <p><strong>Teléfono:</strong> +57 300 123 4567</p>
                <p><strong>WhatsApp:</strong> +57 300 123 4567</p>
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
