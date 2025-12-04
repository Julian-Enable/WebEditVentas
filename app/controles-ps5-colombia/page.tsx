'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ShoppingCart, Star } from 'lucide-react';
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

export default function ControlesPS5Page() {
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
          const controles = allProducts.filter((p: Product) => p.category === 'CONTROLES');
          setProducts(controles);
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
    "name": "Controles PS5 Colombia - CasaPlay",
    "description": "Compra controles PS5 originales en Colombia. Envío gratis, pago contra entrega. Controles DualSense de todos los colores al mejor precio.",
    "url": "https://casaplay.shop/controles-ps5-colombia",
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
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Controles PS5 Colombia
          </h1>
          <p className="text-xl md:text-2xl mb-6">
            DualSense originales de todos los colores | Envío gratis | Pago contra entrega
          </p>
          <div className="flex flex-wrap gap-4 text-sm md:text-base">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              <span>4.8/5 estrellas (47 reseñas)</span>
            </div>
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              <span>Entrega en 1-3 días</span>
            </div>
            <div className="bg-green-500 px-4 py-2 rounded-full font-bold">
              🎮 Stock Disponible
            </div>
          </div>
        </div>
      </div>

      {/* SEO Content */}
      <div className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Los Mejores Controles PS5 en Colombia
            </h2>
            <div className="prose prose-lg text-gray-700 space-y-4">
              <p>
                ¿Buscas <strong>controles PS5 originales en Colombia</strong>? En CasaPlay encontrarás 
                los mejores <strong>controles DualSense</strong> al mejor precio. Tenemos todas las ediciones: 
                control PS5 blanco, negro, camuflado, plateado y ediciones especiales.
              </p>
              <p>
                Todos nuestros <strong>controles PlayStation 5</strong> son 100% originales y cuentan con 
                garantía oficial Sony. Ofrecemos <strong>envío gratis a toda Colombia</strong> y 
                <strong> pago contra entrega</strong> para tu comodidad.
              </p>
              <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                ¿Por qué comprar tu Control PS5 en CasaPlay?
              </h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>✅ <strong>Controles 100% originales</strong> con garantía Sony</li>
                <li>✅ <strong>Envío gratis</strong> a Bogotá, Medellín, Cali, Barranquilla y toda Colombia</li>
                <li>✅ <strong>Pago contra entrega</strong> disponible</li>
                <li>✅ Todos los colores disponibles: blanco, negro, camuflado, plateado</li>
                <li>✅ <strong>Descuentos hasta del 50%</strong></li>
                <li>✅ Entrega rápida en 1-3 días hábiles</li>
                <li>✅ Atención al cliente vía WhatsApp</li>
              </ul>
              <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                Colores Disponibles
              </h3>
              <p>
                Encuentra tu <strong>control PS5</strong> en el color que prefieras:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>🎮 <strong>Control PS5 Blanco</strong> - El clásico DualSense blanco</li>
                <li>🎮 <strong>Control PS5 Negro</strong> - Elegante y sofisticado</li>
                <li>🎮 <strong>Control PS5 Camuflado</strong> - Edición militar</li>
                <li>🎮 <strong>Control PS5 Plateado</strong> - Edición premium</li>
                <li>🎮 <strong>Ediciones Especiales</strong> - Colecciones limitadas</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          Controles Disponibles ({products.length})
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => {
            const finalPrice = product.price * (1 - product.discount / 100);
            return (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group"
              >
                <div
                  onClick={() => router.push(`/productos/${product.id}`)}
                  className="relative h-64"
                >
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.discount > 0 && (
                    <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      -{product.discount}%
                    </div>
                  )}
                  {product.stock < 10 && (
                    <div className="absolute top-3 left-3 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                      ¡Solo {product.stock}!
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 text-yellow-400 fill-yellow-400"
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">(4.8)</span>
                  </div>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-2xl font-bold text-purple-600">
                      ${finalPrice.toLocaleString('es-CO')}
                    </span>
                    {product.discount > 0 && (
                      <span className="text-sm text-gray-400 line-through">
                        ${product.price.toLocaleString('es-CO')}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(product);
                    }}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Agregar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Preguntas Frecuentes sobre Controles PS5
            </h2>
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  ¿Cuánto cuesta un control PS5 en Colombia?
                </h3>
                <p className="text-gray-700">
                  En CasaPlay, los <strong>controles PS5</strong> tienen descuentos de hasta el 50%. 
                  Precios desde $140,000 COP con envío gratis incluido.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  ¿Los controles son originales?
                </h3>
                <p className="text-gray-700">
                  Sí, todos nuestros <strong>controles DualSense</strong> son 100% originales Sony 
                  con garantía oficial. No vendemos réplicas ni copias.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  ¿Hacen envíos a toda Colombia?
                </h3>
                <p className="text-gray-700">
                  Sí, hacemos <strong>envío gratis a toda Colombia</strong>: Bogotá, Medellín, Cali, 
                  Barranquilla, Cartagena, Bucaramanga y todas las ciudades.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  ¿Puedo pagar contra entrega?
                </h3>
                <p className="text-gray-700">
                  Sí, ofrecemos <strong>pago contra entrega</strong> en toda Colombia. 
                  Paga cuando recibas tu control PS5.
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
