'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface SiteSettings {
  siteName: string;
  logoUrl: string;
}

export default function PoliticaPrivacidadPage() {
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
          <h1 className="text-4xl font-bold mb-8 text-gray-900">Política de Privacidad</h1>
          
          <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">1. Información que Recopilamos</h2>
              <p className="text-gray-600 leading-relaxed">
                En {settings.siteName}, recopilamos información personal cuando realizas una compra, te registras en nuestro sitio, 
                te suscribes a nuestro boletín o completas un formulario. La información recopilada puede incluir tu nombre, 
                dirección de correo electrónico, dirección de envío, número de teléfono e información de pago.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">2. Uso de la Información</h2>
              <p className="text-gray-600 leading-relaxed mb-3">
                Utilizamos la información que recopilamos de las siguientes maneras:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Procesar tus transacciones y enviar confirmaciones de pedidos</li>
                <li>Mejorar nuestro sitio web y la experiencia del cliente</li>
                <li>Enviar correos electrónicos periódicos sobre pedidos o actualizaciones</li>
                <li>Responder a consultas, preguntas y solicitudes de atención al cliente</li>
                <li>Administrar promociones, encuestas u otras funcionalidades del sitio</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">3. Protección de la Información</h2>
              <p className="text-gray-600 leading-relaxed">
                Implementamos medidas de seguridad apropiadas para proteger tu información personal. Todas las transacciones 
                de pago se procesan a través de pasarelas de pago seguras y no almacenamos información completa de tarjetas de 
                crédito en nuestros servidores. Utilizamos cifrado SSL para proteger la información sensible transmitida en línea.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">4. Cookies</h2>
              <p className="text-gray-600 leading-relaxed">
                Utilizamos cookies para mejorar tu experiencia en nuestro sitio web. Las cookies son pequeños archivos que un 
                sitio o su proveedor de servicios transfiere al disco duro de tu computadora a través de tu navegador web 
                (si lo permites) que permite a los sitios o sistemas de proveedores de servicios reconocer tu navegador y 
                capturar y recordar cierta información.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">5. Divulgación a Terceros</h2>
              <p className="text-gray-600 leading-relaxed">
                No vendemos, intercambiamos ni transferimos de ninguna otra forma tu información personal identificable a 
                terceros. Esto no incluye a terceros de confianza que nos ayudan a operar nuestro sitio web, realizar nuestro 
                negocio o brindar servicios, siempre que esas partes acuerden mantener esta información confidencial. También 
                podemos divulgar tu información cuando creamos que la divulgación es apropiada para cumplir con la ley.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">6. Enlaces de Terceros</h2>
              <p className="text-gray-600 leading-relaxed">
                Nuestro sitio web puede contener enlaces a sitios de terceros. No somos responsables de las prácticas de 
                privacidad o el contenido de estos sitios. Te recomendamos revisar las políticas de privacidad de cualquier 
                sitio de terceros que visites.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">7. Tus Derechos</h2>
              <p className="text-gray-600 leading-relaxed mb-3">
                Tienes derecho a:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Acceder a la información personal que tenemos sobre ti</li>
                <li>Solicitar la corrección de información inexacta</li>
                <li>Solicitar la eliminación de tu información personal</li>
                <li>Oponerte al procesamiento de tu información personal</li>
                <li>Solicitar la restricción del procesamiento de tu información</li>
                <li>Solicitar la transferencia de tu información a otra organización</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">8. Cambios a Esta Política</h2>
              <p className="text-gray-600 leading-relaxed">
                Nos reservamos el derecho de actualizar esta Política de Privacidad en cualquier momento. Te notificaremos 
                sobre cualquier cambio publicando la nueva Política de Privacidad en esta página. Se te aconseja revisar 
                esta Política de Privacidad periódicamente para cualquier cambio.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">9. Contacto</h2>
              <p className="text-gray-600 leading-relaxed">
                Si tienes alguna pregunta sobre esta Política de Privacidad, puedes contactarnos en:
              </p>
              <div className="mt-3 text-gray-700">
                <p><strong>Email:</strong> pedidos@casaplay.shop</p>
                <p><strong>Teléfono:</strong> +57 321 224 2773</p>
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
