'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';

export default function GuiaCompraPS5() {
  const router = useRouter();
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(error => console.error('Error:', error));
  }, []);

  if (!settings) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-600"></div>
    </div>;
  }

  const schemaArticle = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Guía Completa para Comprar PS5 en Colombia 2024",
    "description": "Todo lo que necesitas saber antes de comprar tu PlayStation 5 en Colombia. Modelos, precios, dónde comprar y mejores ofertas.",
    "image": "https://casaplay.shop/images/ps5-guia.jpg",
    "author": {
      "@type": "Organization",
      "name": "CasaPlay"
    },
    "publisher": {
      "@type": "Organization",
      "name": "CasaPlay",
      "logo": {
        "@type": "ImageObject",
        "url": "https://casaplay.shop/logo.png"
      }
    },
    "datePublished": "2024-01-15",
    "dateModified": "2024-01-15"
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaArticle) }}
      />

      <Navbar siteName={settings.siteName} logoUrl={settings.logoUrl} />

      <div className="container mx-auto px-4 py-12">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-purple-600 mb-6 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="font-semibold">Volver</span>
        </button>

        <article className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8 md:p-12">
          <header className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Guía Completa para Comprar PS5 en Colombia 2024
            </h1>
            <div className="flex items-center gap-4 text-gray-600 text-sm">
              <span>📅 Actualizado: Enero 2024</span>
              <span>⏱️ 8 min de lectura</span>
            </div>
          </header>

          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-700 leading-relaxed mb-8">
              ¿Quieres comprar una <strong>PlayStation 5 en Colombia</strong> pero no sabes por dónde empezar? 
              Esta guía te ayudará a tomar la mejor decisión y encontrar las mejores ofertas del mercado.
            </p>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
              1. Modelos de PS5 Disponibles en Colombia
            </h2>
            
            <h3 className="text-2xl font-bold text-purple-600 mt-8 mb-4">
              🎮 PlayStation 5 Slim Digital
            </h3>
            <p className="text-gray-700 mb-4">
              La versión digital es completamente sin lector de discos. Esto significa que todos tus juegos 
              deben comprarse y descargarse desde PlayStation Store.
            </p>
            <div className="bg-blue-50 p-6 rounded-lg mb-6">
              <h4 className="font-bold text-gray-900 mb-3">✅ Ventajas:</h4>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Más económica (desde $1,400,000 COP)</li>
                <li>Diseño más compacto y silencioso</li>
                <li>Acceso instantáneo a juegos digitales</li>
                <li>Ofertas frecuentes en PlayStation Store</li>
              </ul>
              <h4 className="font-bold text-gray-900 mt-4 mb-3">❌ Desventajas:</h4>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>No puedes usar juegos físicos</li>
                <li>No puedes vender juegos usados</li>
                <li>Requiere buena conexión a internet</li>
              </ul>
            </div>

            <h3 className="text-2xl font-bold text-purple-600 mt-8 mb-4">
              💿 PlayStation 5 Slim 1TB con Lector
            </h3>
            <p className="text-gray-700 mb-4">
              La versión con lector de discos es la más completa. Puedes comprar juegos físicos, 
              juegos digitales y reproducir Blu-rays 4K.
            </p>
            <div className="bg-green-50 p-6 rounded-lg mb-6">
              <h4 className="font-bold text-gray-900 mb-3">✅ Ventajas:</h4>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Mayor versatilidad (físicos + digitales)</li>
                <li>Puedes comprar juegos usados más baratos</li>
                <li>Reproductor Blu-ray 4K incluido</li>
                <li>Compatibilidad con juegos PS4 físicos</li>
                <li>Puedes vender juegos que no uses</li>
              </ul>
              <h4 className="font-bold text-gray-900 mt-4 mb-3">❌ Desventajas:</h4>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Precio más alto (desde $1,200,000 COP en oferta)</li>
                <li>Ligeramente más pesada</li>
              </ul>
            </div>

            <div className="bg-purple-100 border-l-4 border-purple-600 p-6 my-8">
              <p className="text-lg font-semibold text-purple-900">
                💡 <strong>Recomendación:</strong> Si tu presupuesto lo permite, la <strong>PS5 con lector</strong> 
                ofrece mejor valor a largo plazo. Puedes ahorrar mucho comprando juegos físicos usados.
              </p>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
              2. ¿Cuánto Cuesta la PS5 en Colombia?
            </h2>
            
            <p className="text-gray-700 mb-6">
              Los precios de la <strong>PlayStation 5 en Colombia</strong> varían según el modelo y las promociones:
            </p>

            <div className="bg-white border-2 border-purple-200 rounded-lg p-6 mb-6">
              <h4 className="text-xl font-bold text-gray-900 mb-4">💰 Precios de Referencia 2024:</h4>
              <table className="w-full">
                <thead className="bg-purple-50">
                  <tr>
                    <th className="px-4 py-3 text-left">Modelo</th>
                    <th className="px-4 py-3 text-right">Precio Normal</th>
                    <th className="px-4 py-3 text-right">Precio con Descuento</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr>
                    <td className="px-4 py-3 font-semibold">PS5 Slim Digital</td>
                    <td className="px-4 py-3 text-right text-gray-500 line-through">$2,000,000</td>
                    <td className="px-4 py-3 text-right text-green-600 font-bold">$1,400,000</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-semibold">PS5 Slim 1TB</td>
                    <td className="px-4 py-3 text-right text-gray-500 line-through">$2,000,000</td>
                    <td className="px-4 py-3 text-right text-green-600 font-bold">$1,200,000</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
              3. ¿Dónde Comprar PS5 en Colombia?
            </h2>

            <p className="text-gray-700 mb-6">
              Al comprar tu <strong>PS5 en Colombia</strong>, considera estos factores importantes:
            </p>

            <div className="space-y-4 mb-8">
              <div className="bg-green-50 p-5 rounded-lg">
                <h4 className="font-bold text-green-900 mb-2">✅ Garantía Oficial</h4>
                <p className="text-gray-700">
                  Verifica que incluya garantía Sony Colombia de 1 año. Evita consolas importadas sin garantía local.
                </p>
              </div>
              
              <div className="bg-blue-50 p-5 rounded-lg">
                <h4 className="font-bold text-blue-900 mb-2">📦 Envío Gratis</h4>
                <p className="text-gray-700">
                  Busca tiendas que ofrezcan <strong>envío gratis a toda Colombia</strong>. Esto puede ahorrarte 
                  hasta $50,000 COP.
                </p>
              </div>

              <div className="bg-purple-50 p-5 rounded-lg">
                <h4 className="font-bold text-purple-900 mb-2">💳 Pago Contra Entrega</h4>
                <p className="text-gray-700">
                  La opción de <strong>pago contra entrega</strong> te da mayor seguridad. Pagas cuando recibes 
                  la consola en tu casa.
                </p>
              </div>

              <div className="bg-orange-50 p-5 rounded-lg">
                <h4 className="font-bold text-orange-900 mb-2">⭐ Reputación</h4>
                <p className="text-gray-700">
                  Lee reseñas de otros compradores. Una tienda con +100 reseñas positivas es más confiable.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-8 rounded-xl my-8">
              <h3 className="text-2xl font-bold mb-4">🏆 CasaPlay: Tu Mejor Opción</h3>
              <ul className="space-y-3 text-lg">
                <li>✅ Consolas 100% originales con garantía Sony</li>
                <li>✅ Envío gratis a toda Colombia en 1-3 días</li>
                <li>✅ Pago contra entrega disponible</li>
                <li>✅ Descuentos hasta del 40%</li>
                <li>✅ 4.8/5 estrellas (47 reseñas verificadas)</li>
                <li>✅ Atención por WhatsApp +57 318 205 5412</li>
              </ul>
              <button
                onClick={() => router.push('/consola-ps5-colombia')}
                className="mt-6 bg-white text-purple-600 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                Ver Consolas PS5 Disponibles
              </button>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
              4. Accesorios Esenciales para tu PS5
            </h2>

            <p className="text-gray-700 mb-6">
              Además de la consola, considera estos accesorios:
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="border-2 border-gray-200 rounded-lg p-5">
                <h4 className="text-xl font-bold text-gray-900 mb-2">🎮 Control DualSense Extra</h4>
                <p className="text-gray-700 mb-3">
                  Ideal para jugar con amigos o tener uno de repuesto. Disponible en varios colores.
                </p>
                <p className="text-purple-600 font-bold">Desde $140,000 COP</p>
              </div>

              <div className="border-2 border-gray-200 rounded-lg p-5">
                <h4 className="text-xl font-bold text-gray-900 mb-2">🔌 Estación de Carga</h4>
                <p className="text-gray-700 mb-3">
                  Carga dos controles simultáneamente. Muy práctica y ahorra espacio.
                </p>
                <p className="text-purple-600 font-bold">Desde $86,000 COP</p>
              </div>

              <div className="border-2 border-gray-200 rounded-lg p-5">
                <h4 className="text-xl font-bold text-gray-900 mb-2">🎧 Audífonos PULSE</h4>
                <p className="text-gray-700 mb-3">
                  Audio 3D oficial de PlayStation para experiencia inmersiva.
                </p>
                <p className="text-purple-600 font-bold">Consultar disponibilidad</p>
              </div>

              <div className="border-2 border-gray-200 rounded-lg p-5">
                <h4 className="text-xl font-bold text-gray-900 mb-2">💾 SSD Expansión</h4>
                <p className="text-gray-700 mb-3">
                  Aumenta el almacenamiento para más juegos instalados.
                </p>
                <p className="text-purple-600 font-bold">Próximamente</p>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
              5. Preguntas Frecuentes
            </h2>

            <div className="space-y-6">
              <div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">
                  ¿La PS5 es compatible con juegos de PS4?
                </h4>
                <p className="text-gray-700">
                  Sí, la PS5 es compatible con <strong>más del 99% de juegos PS4</strong>. Además, muchos juegos 
                  PS4 reciben mejoras gratis de gráficos y rendimiento en PS5.
                </p>
              </div>

              <div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">
                  ¿Necesito PlayStation Plus para jugar online?
                </h4>
                <p className="text-gray-700">
                  Sí, para jugar online necesitas <strong>PlayStation Plus</strong>. Hay 3 planes: Essential 
                  ($24,900/mes), Extra ($39,900/mes) y Premium ($49,900/mes).
                </p>
              </div>

              <div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">
                  ¿Qué juegos vienen incluidos con la PS5?
                </h4>
                <p className="text-gray-700">
                  La PS5 incluye <strong>Astro's Playroom</strong> preinstalado. Es gratis y perfecto para 
                  conocer las funciones del control DualSense.
                </p>
              </div>

              <div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">
                  ¿Cuánto pesa y mide la PS5 Slim?
                </h4>
                <p className="text-gray-700">
                  La <strong>PS5 Slim</strong> es 30% más pequeña y ligera que el modelo original. Mide 
                  aproximadamente 358mm x 216mm x 96mm.
                </p>
              </div>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 my-10">
              <h3 className="text-xl font-bold text-yellow-900 mb-3">
                ⚠️ Consejos para Evitar Estafas
              </h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Desconfía de precios extremadamente bajos (menos de $1,000,000)</li>
                <li>Verifica que la tienda tenga redes sociales activas</li>
                <li>Lee reseñas de otros compradores en Google</li>
                <li>Confirma que ofrezcan garantía oficial Sony</li>
                <li>Evita compras por Facebook Marketplace sin referencias</li>
                <li>Prefiere tiendas con pago contra entrega</li>
              </ul>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">
              Conclusión
            </h2>

            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              Comprar una <strong>PS5 en Colombia</strong> es una gran inversión. La clave está en elegir una 
              tienda confiable que ofrezca garantía oficial, envío gratis y buenas opciones de pago.
            </p>

            <p className="text-gray-700 text-lg leading-relaxed mb-8">
              En <strong>CasaPlay</strong> encontrarás las mejores ofertas de <strong>PlayStation 5</strong>, 
              con descuentos de hasta el 40%, envío gratis a toda Colombia y pago contra entrega. 
              Todos nuestros productos son 100% originales con garantía Sony.
            </p>

            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-8 rounded-xl text-center">
              <h3 className="text-2xl font-bold mb-4">
                ¿Listo para comprar tu PS5?
              </h3>
              <p className="text-lg mb-6">
                Explora nuestro catálogo con las mejores ofertas de Colombia
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => router.push('/consola-ps5-colombia')}
                  className="bg-white text-purple-600 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors inline-flex items-center justify-center gap-2"
                >
                  Ver Consolas PS5
                </button>
                <button
                  onClick={() => router.push('/controles-ps5-colombia')}
                  className="bg-white text-purple-600 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors inline-flex items-center justify-center gap-2"
                >
                  Ver Controles PS5
                </button>
              </div>
            </div>
          </div>
        </article>
      </div>

      <Footer siteName={settings.siteName} />
    </div>
  );
}
