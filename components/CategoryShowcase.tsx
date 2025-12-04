'use client';

import Link from 'next/link';
import { Gamepad2, Monitor, Sparkles } from 'lucide-react';

export default function CategoryShowcase() {
  return (
    <section className="py-16 bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Explora Nuestras Categorías
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Todo lo que necesitas para tu experiencia PlayStation 5 en Colombia
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Controles PS5 */}
          <Link href="/controles-ps5-colombia">
            <div className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer">
              <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
                <Gamepad2 className="w-16 h-16 mb-4 relative z-10" />
                <h3 className="text-2xl font-bold mb-2 relative z-10">Controles PS5</h3>
                <p className="text-purple-100 relative z-10">7 modelos disponibles</p>
              </div>
              <div className="p-6">
                <ul className="space-y-2 mb-4">
                  <li className="flex items-center text-gray-700">
                    <span className="text-green-500 mr-2">✓</span>
                    DualSense originales Sony
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="text-green-500 mr-2">✓</span>
                    Todos los colores disponibles
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="text-green-500 mr-2">✓</span>
                    Hasta 50% de descuento
                  </li>
                </ul>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold text-purple-600">
                    Desde $140K
                  </span>
                  <span className="text-sm text-gray-500 line-through">
                    $280K
                  </span>
                </div>
                <div className="mt-4 bg-purple-100 text-purple-700 px-4 py-2 rounded-lg text-center font-semibold group-hover:bg-purple-600 group-hover:text-white transition-colors">
                  Ver Controles →
                </div>
              </div>
            </div>
          </Link>

          {/* Consolas PS5 */}
          <Link href="/consola-ps5-colombia">
            <div className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer">
              <div className="bg-gradient-to-br from-blue-600 to-cyan-600 p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
                <Monitor className="w-16 h-16 mb-4 relative z-10" />
                <h3 className="text-2xl font-bold mb-2 relative z-10">Consolas PS5</h3>
                <p className="text-blue-100 relative z-10">2 modelos disponibles</p>
              </div>
              <div className="p-6">
                <ul className="space-y-2 mb-4">
                  <li className="flex items-center text-gray-700">
                    <span className="text-green-500 mr-2">✓</span>
                    PS5 Slim Digital y 1TB
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="text-green-500 mr-2">✓</span>
                    Garantía oficial Sony
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="text-green-500 mr-2">✓</span>
                    Hasta 40% de descuento
                  </li>
                </ul>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold text-blue-600">
                    Desde $1.2M
                  </span>
                  <span className="text-sm text-gray-500 line-through">
                    $2M
                  </span>
                </div>
                <div className="mt-4 bg-blue-100 text-blue-700 px-4 py-2 rounded-lg text-center font-semibold group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  Ver Consolas →
                </div>
              </div>
            </div>
          </Link>

          {/* Guía de Compra */}
          <Link href="/guia-compra-ps5-colombia">
            <div className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer">
              <div className="bg-gradient-to-br from-green-600 to-emerald-600 p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
                <Sparkles className="w-16 h-16 mb-4 relative z-10" />
                <h3 className="text-2xl font-bold mb-2 relative z-10">Guía de Compra</h3>
                <p className="text-green-100 relative z-10">Todo sobre PS5</p>
              </div>
              <div className="p-6">
                <ul className="space-y-2 mb-4">
                  <li className="flex items-center text-gray-700">
                    <span className="text-green-500 mr-2">✓</span>
                    ¿Cuál PS5 comprar?
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="text-green-500 mr-2">✓</span>
                    Comparación de modelos
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="text-green-500 mr-2">✓</span>
                    Preguntas frecuentes
                  </li>
                </ul>
                <div className="text-center">
                  <span className="text-2xl font-bold text-green-600">
                    Guía Gratuita
                  </span>
                </div>
                <div className="mt-4 bg-green-100 text-green-700 px-4 py-2 rounded-lg text-center font-semibold group-hover:bg-green-600 group-hover:text-white transition-colors">
                  Leer Guía →
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Trust Badges */}
        <div className="mt-16 bg-white rounded-2xl shadow-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">100%</div>
              <div className="text-gray-600 font-semibold">Productos Originales</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">🚚</div>
              <div className="text-gray-600 font-semibold">Envío Gratis Colombia</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">💳</div>
              <div className="text-gray-600 font-semibold">Pago Contra Entrega</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-600 mb-2">4.8★</div>
              <div className="text-gray-600 font-semibold">47 Reseñas</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
