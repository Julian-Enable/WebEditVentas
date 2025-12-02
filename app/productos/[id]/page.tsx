'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { ShoppingCart, ArrowLeft, Star, Check, Truck, Shield, CreditCard } from 'lucide-react';
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
  features?: string[];
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showAddedMessage, setShowAddedMessage] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setProduct(data);
        }
      } catch (error) {
        console.error('Error loading product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.id]);

  const handleAddToCart = () => {
    if (product) {
      const finalPrice = product.price * (1 - product.discount / 100);
      addItem({
        productId: product.id,
        name: product.name,
        price: finalPrice,
        originalPrice: product.discount > 0 ? product.price : undefined,
        discount: product.discount > 0 ? product.discount : undefined,
        imageUrl: product.imageUrl,
        quantity: quantity
      });
      setShowAddedMessage(true);
      setTimeout(() => setShowAddedMessage(false), 3000);
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/carrito');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Producto no encontrado</h1>
          <button
            onClick={() => router.push('/productos')}
            className="text-purple-600 hover:text-purple-700 font-semibold"
          >
            Volver a productos
          </button>
        </div>
        <Footer />
      </div>
  // Generar imágenes múltiples (simulado - en producción vendrían de la base de datos)
  const productImages = [product.imageUrl, product.imageUrl, product.imageUrl];
  
  // Calcular precio final con descuento
  const finalPrice = product.price * (1 - product.discount / 100);

  // Generar imágenes múltiples (simulado - en producción vendrían de la base de datos)
  const productImages = [product.image, product.image, product.image];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Mensaje de producto agregado */}
      {showAddedMessage && (
        <div className="fixed top-20 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-slide-in-right">
          <div className="flex items-center gap-2">
            <Check className="h-5 w-5" />
            <span className="font-semibold">¡Producto agregado al carrito!</span>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        {/* Botón volver */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-purple-600 mb-6 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="font-semibold">Volver</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Galería de imágenes */}
          <div className="space-y-4">
            {/* Imagen principal */}
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-white shadow-xl">
              <Image
                src={productImages[selectedImage]}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
              {product.stock <= 5 && product.stock > 0 && (
                <div className="absolute top-4 right-4 bg-orange-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg">
                  ¡Solo {product.stock} disponibles!
                </div>
              )}
            </div>

            {/* Miniaturas */}
            <div className="grid grid-cols-3 gap-4">
              {productImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square rounded-xl overflow-hidden transition-all ${
                    selectedImage === index
                      ? 'ring-4 ring-purple-600 scale-105'
                      : 'ring-2 ring-gray-200 hover:ring-purple-300'
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.name} - Vista ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Información del producto */}
          <div className="space-y-6">
            {/* Categoría */}
            <div className="inline-block bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold">
              {product.category}
            </div>

            {/* Título */}
            <h1 className="text-4xl font-black text-gray-900 leading-tight">
            {/* Precio */}
            <div className="space-y-2">
              {product.discount > 0 && (
                <div className="flex items-center gap-3">
                  <span className="text-2xl text-gray-400 line-through">
                    ${product.price.toLocaleString()}
                  </span>
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    -{product.discount}% OFF
                  </span>
                </div>
              )}
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black text-purple-600">
                  ${finalPrice.toLocaleString()}
                </span>
                <span className="text-xl text-gray-500">COP</span>
              </div>
            </div>product.price.toLocaleString()}
              </span>
              <span className="text-xl text-gray-500">COP</span>
            </div>

            {/* Descripción */}
            <p className="text-lg text-gray-600 leading-relaxed">
              {product.description}
            </p>

            {/* Características */}
            {product.features && product.features.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-gray-900">Características:</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Selector de cantidad */}
            <div className="space-y-3">
              <label className="text-lg font-bold text-gray-900">Cantidad:</label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 rounded-xl bg-gray-200 hover:bg-gray-300 font-bold text-xl transition-colors"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="text-2xl font-bold text-gray-900 w-12 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-12 h-12 rounded-xl bg-gray-200 hover:bg-gray-300 font-bold text-xl transition-colors"
                  disabled={quantity >= product.stock}
                >
                  +
                </button>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 flex items-center justify-center gap-3 bg-white border-2 border-purple-600 text-purple-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-purple-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                <ShoppingCart className="h-6 w-6" />
                Agregar al Carrito
              </button>
              <button
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                Comprar Ahora
              </button>
            </div>

            {product.stock === 0 && (
              <p className="text-red-500 font-semibold text-center">
                Producto agotado
              </p>
            )}

            {/* Beneficios */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t-2 border-gray-200">
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <Truck className="h-6 w-6 text-green-600" />
                </div>
                <span className="text-sm font-semibold text-gray-700">Envío Gratis</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
                <span className="text-sm font-semibold text-gray-700">Compra Segura</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-purple-600" />
                </div>
                <span className="text-sm font-semibold text-gray-700">Pago Contra Entrega</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
