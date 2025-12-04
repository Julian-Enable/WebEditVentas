'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ShoppingCart, Star, Truck, Shield, Package } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '@/hooks/useCart';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  discount: number;
  imageUrl: string;
  category: string;
  stock: number;
}

export default function ConsolasPS5Page() {
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { addItem } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, settingsRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/settings')
        ]);

        if (productsRes.ok) {
          const allProducts = await productsRes.json();
          const consolas = allProducts.filter((p: Product) => 
            p.category === 'CONSOLAS' || p.category === 'Consolas'
          );
          setProducts(consolas);
        }

        if (settingsRes.ok) {
          setSettings(await settingsRes.json());
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddToCart = (product: Product) => {
    const finalPrice = product.price * (1 - product.discount / 100);
    addItem({
      productId: product.id,
      name: product.name,
      price: finalPrice,
      originalPrice: product.discount > 0 ? product.price : undefined,
      discount: product.discount > 0 ? product.discount : undefined,
      imageUrl: product.imageUrl,
      quantity: 1
    });
  };

  if (loading || !settings) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-600"></div>
      </div>
    );
  }

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Consola PS5 Colombia - PlayStation 5 Slim",
    "description": "Compra PlayStation 5 en Colombia. PS5 Slim Digital y PS5 Slim 1TB originales. Envío gratis, pago contra entrega, mejor precio garantizado.",
    "url": "https://casaplay.shop/consola-ps5-colombia",
    "isPartOf": {
      "@type": "WebSite",
      "name": "CasaPlay",
      "url": "https://casaplay.shop"
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      <Navbar siteName={settings.siteName} logoUrl={settings.logoUrl} />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Consola PS5 Colombia - PlayStation 5
          </h1>
          <p className="text-xl md:text-2xl mb-6">
            PS5 Slim Digital y PS5 Slim 1TB | Originales Sony | Envío Gratis 🚚
          </p>
          <div className="flex flex-wrap gap-4 text-sm md:text-base">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              <span>Calificación 4.9/5</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              <span>Garantía Oficial Sony</span>
            </div>
            <div className="bg-green-500 px-4 py-2 rounded-full font-bold">
              🎮 Stock Limitado
            </div>
          </div>
        </div>
      </div>

      {/* SEO Content */}
      <div className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Compra tu PlayStation 5 en Colombia
            </h2>
            <div className="prose prose-lg text-gray-700 space-y-4">
              <p>
                ¿Buscas dónde comprar <strong>PlayStation 5 en Colombia</strong>? En CasaPlay tenemos las 
                mejores <strong>consolas PS5</strong> al mejor precio. Contamos con la <strong>PS5 Slim Digital</strong> y 
                la <strong>PS5 Slim 1TB</strong> con lector de discos.
              </p>
              <p>
                Todas nuestras <strong>consolas PS5</strong> son 100% originales con garantía oficial Sony. 
                Ofrecemos <strong>envío gratis a toda Colombia</strong> y <strong>pago contra entrega</strong> 
                para mayor seguridad en tu compra.
              </p>
              <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                ¿Cuánto cuesta la PS5 en Colombia 2024?
              </h3>
              <p>
                El <strong>precio de la PS5 en Colombia</strong> varía según el modelo:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>💰 <strong>PS5 Slim Digital</strong> desde $1,400,000 COP (con 30% descuento)</li>
                <li>💰 <strong>PS5 Slim 1TB</strong> desde $1,200,000 COP (con 40% descuento)</li>
                <li>🎁 Incluye control DualSense de regalo</li>
                <li>🚚 Envío gratis a Bogotá, Medellín, Cali y toda Colombia</li>
              </ul>
              <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                Modelos Disponibles de PS5
              </h3>
              <div className="bg-blue-50 p-6 rounded-lg space-y-4">
                <div>
                  <h4 className="text-xl font-bold text-blue-900 mb-2">
                    🎮 PlayStation 5 Slim Digital
                  </h4>
                  <ul className="list-disc pl-6 text-gray-700">
                    <li>Versión completamente digital</li>
                    <li>Almacenamiento SSD ultra rápido</li>
                    <li>Gráficos 4K a 120fps</li>
                    <li>Ideal para juegos digitales</li>
                    <li>Diseño Slim más compacto</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-blue-900 mb-2">
                    💿 PlayStation 5 Slim 1TB con Lector
                  </h4>
                  <ul className="list-disc pl-6 text-gray-700">
                    <li>Lector de discos Blu-ray</li>
                    <li>1TB de almacenamiento</li>
                    <li>Compatibilidad con juegos físicos PS4 y PS5</li>
                    <li>Reproducción de películas 4K</li>
                    <li>Mejor relación calidad-precio</li>
                  </ul>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                ¿Por qué comprar tu PS5 en CasaPlay?
              </h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>✅ <strong>Consolas 100% originales</strong> directas de Sony Colombia</li>
                <li>✅ <strong>Garantía oficial</strong> de 1 año</li>
                <li>✅ <strong>Envío gratis</strong> a toda Colombia en 1-3 días</li>
                <li>✅ <strong>Pago contra entrega</strong> disponible</li>
                <li>✅ <strong>Descuentos hasta del 40%</strong></li>
                <li>✅ Control DualSense incluido</li>
                <li>✅ Atención personalizada por WhatsApp</li>
                <li>✅ Stock disponible inmediato</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          Consolas PlayStation 5 Disponibles ({products.length})
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => {
            const finalPrice = product.price * (1 - product.discount / 100);
            return (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow cursor-pointer group"
              >
                <div
                  onClick={() => router.push(`/productos/${product.id}`)}
                  className="relative h-80"
                >
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.discount > 0 && (
                    <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full text-base font-bold shadow-lg">
                      AHORRA {product.discount}%
                    </div>
                  )}
                  {product.stock < 10 && (
                    <div className="absolute top-4 left-4 bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg animate-pulse">
                      ¡ÚLTIMAS {product.stock}!
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-purple-600 transition-colors">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 text-yellow-400 fill-yellow-400"
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">(4.9)</span>
                  </div>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-3xl font-bold text-purple-600">
                      ${finalPrice.toLocaleString('es-CO')}
                    </span>
                    {product.discount > 0 && (
                      <span className="text-lg text-gray-400 line-through">
                        ${product.price.toLocaleString('es-CO')}
                      </span>
                    )}
                  </div>
                  <div className="space-y-2 mb-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-green-500" />
                      <span>Envío gratis en 1-3 días</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-blue-500" />
                      <span>Garantía oficial Sony</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-purple-500" />
                      <span>Pago contra entrega</span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(product);
                    }}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Agregar al Carrito
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Comparison Table */}
      <div className="bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Comparación de Modelos PS5
            </h2>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-purple-600 text-white">
                    <tr>
                      <th className="px-6 py-4 text-left">Característica</th>
                      <th className="px-6 py-4 text-center">PS5 Slim Digital</th>
                      <th className="px-6 py-4 text-center">PS5 Slim 1TB</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 font-semibold">Lector de Discos</td>
                      <td className="px-6 py-4 text-center">❌ No</td>
                      <td className="px-6 py-4 text-center">✅ Sí (Blu-ray 4K)</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-6 py-4 font-semibold">Almacenamiento</td>
                      <td className="px-6 py-4 text-center">825GB SSD</td>
                      <td className="px-6 py-4 text-center">1TB SSD</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-semibold">Resolución</td>
                      <td className="px-6 py-4 text-center">4K @ 120fps</td>
                      <td className="px-6 py-4 text-center">4K @ 120fps</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-6 py-4 font-semibold">Ray Tracing</td>
                      <td className="px-6 py-4 text-center">✅ Sí</td>
                      <td className="px-6 py-4 text-center">✅ Sí</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-semibold">Juegos PS4</td>
                      <td className="px-6 py-4 text-center">✅ Digitales</td>
                      <td className="px-6 py-4 text-center">✅ Físicos y Digitales</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-6 py-4 font-semibold">Control Incluido</td>
                      <td className="px-6 py-4 text-center">✅ DualSense</td>
                      <td className="px-6 py-4 text-center">✅ DualSense</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-semibold">Precio</td>
                      <td className="px-6 py-4 text-center font-bold text-purple-600">Desde $1,400,000</td>
                      <td className="px-6 py-4 text-center font-bold text-purple-600">Desde $1,200,000</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Preguntas Frecuentes sobre PS5 en Colombia
            </h2>
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  ¿Dónde comprar PS5 en Colombia barata?
                </h3>
                <p className="text-gray-700">
                  En CasaPlay ofrecemos los mejores precios de <strong>PS5 en Colombia</strong> con descuentos 
                  de hasta el 40%. Envío gratis y pago contra entrega disponible.
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  ¿Cuál PS5 es mejor, Digital o con lector?
                </h3>
                <p className="text-gray-700">
                  La <strong>PS5 Slim con lector</strong> es más versátil porque puedes usar juegos físicos y 
                  digitales. La <strong>PS5 Digital</strong> es ideal si solo compras juegos en la PlayStation Store.
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  ¿La PS5 trae garantía en Colombia?
                </h3>
                <p className="text-gray-700">
                  Sí, todas nuestras consolas tienen <strong>garantía oficial Sony Colombia</strong> de 1 año 
                  por defectos de fábrica.
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  ¿Hacen envíos de PS5 a toda Colombia?
                </h3>
                <p className="text-gray-700">
                  Sí, hacemos <strong>envío gratis de PS5 a toda Colombia</strong>: Bogotá, Medellín, Cali, 
                  Barranquilla, Cartagena, Bucaramanga, Pereira, Manizales y todas las ciudades.
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  ¿Cuánto demora el envío de la PS5?
                </h3>
                <p className="text-gray-700">
                  El envío demora entre <strong>1 a 3 días hábiles</strong> dependiendo de la ciudad. 
                  Bogotá, Medellín y Cali suelen recibir en 24-48 horas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer siteName={settings.siteName} />
    </div>
  );
}
