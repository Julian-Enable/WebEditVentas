'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '@/hooks/useCart';
import { Trash2, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

interface SiteSettings {
  siteName: string;
  logoUrl: string;
}

export default function CarritoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { items, removeItem, updateQuantity, getTotalPrice, updateItem } = useCart();
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    fetchSettings();
    syncCartPrices();
    
    // Verificar si hay un error de pago
    const error = searchParams.get('error');
    if (error === 'pago_fallido') {
      toast.error('Hubo un problema procesando tu pago. Por favor intenta nuevamente o usa otro método de pago.', {
        duration: 6000,
        position: 'top-center',
      });
      // Limpiar el parámetro de la URL
      window.history.replaceState({}, '', '/carrito');
    }
  }, [searchParams]);

  const fetchSettings = async () => {
    const res = await fetch('/api/settings');
    const data = await res.json();
    setSettings(data);
  };

  const syncCartPrices = async () => {
    setSyncing(true);
    try {
      // Obtener información actualizada de todos los productos en el carrito
      const productIds = items.map(item => item.productId);
      if (productIds.length === 0) return;

      const res = await fetch('/api/products');
      const products = await res.json();

      let updated = false;
      items.forEach(item => {
        const product = products.find((p: any) => p.id === item.productId);
        if (product && product.discount > 0) {
          const finalPrice = product.price * (1 - product.discount / 100);
          // Solo actualizar si no tiene la info de descuento
          if (!item.originalPrice || !item.discount) {
            updateItem(item.productId, {
              price: finalPrice,
              originalPrice: product.price,
              discount: product.discount
            });
            updated = true;
          }
        }
      });

      if (updated) {
        toast.success('Precios actualizados con descuentos');
      }
    } catch (error) {
      console.error('Error syncing prices:', error);
    } finally {
      setSyncing(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (!settings) return <div>Cargando...</div>;

  if (items.length === 0) {
    return (
      <main>
        <Navbar siteName={settings.siteName} logoUrl={settings.logoUrl} />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold mb-4">Tu carrito está vacío</h1>
          <p className="text-gray-600 mb-8">Agrega productos para continuar</p>
          <a
            href="/productos"
            className="bg-primary text-white px-6 py-3 rounded-lg inline-block hover:bg-opacity-90 transition"
          >
            Ver Productos
          </a>
        </div>
        <Footer siteName={settings.siteName} />
      </main>
    );
  }

  return (
    <main>
      <Navbar siteName={settings.siteName} logoUrl={settings.logoUrl} />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Tu Carrito</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {items.map((item) => (
              <div key={item.productId} className="bg-white p-4 rounded-lg shadow mb-4 flex gap-4">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  {item.originalPrice && item.originalPrice > item.price ? (
                    <div className="flex items-center gap-2">
                      <p className="text-gray-400 line-through text-sm">{formatPrice(item.originalPrice)}</p>
                      <p className="text-green-600 font-bold">{formatPrice(item.price)}</p>
                      <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded">-{item.discount}%</span>
                    </div>
                  ) : (
                    <p className="text-primary font-bold">{formatPrice(item.price)}</p>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
                    >
                      -
                    </button>
                    <span className="font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="flex flex-col justify-between items-end">
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  {item.originalPrice && item.originalPrice > item.price ? (
                    <div className="text-right">
                      <p className="text-sm text-gray-400 line-through">{formatPrice(item.originalPrice * item.quantity)}</p>
                      <p className="font-bold text-lg text-green-600">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  ) : (
                    <p className="font-bold text-lg">{formatPrice(item.price * item.quantity)}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow h-fit sticky top-24">
            <h2 className="text-2xl font-bold mb-4">Resumen del Pedido</h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-semibold">{formatPrice(getTotalPrice())}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Envío:</span>
                <span>Calculado en checkout</span>
              </div>
            </div>
            <div className="border-t pt-4 mb-6">
              <div className="flex justify-between text-xl font-bold">
                <span>Total:</span>
                <span className="text-primary">{formatPrice(getTotalPrice())}</span>
              </div>
            </div>
            <button
              onClick={() => router.push('/checkout')}
              className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-opacity-90 transition"
            >
              Proceder al Checkout
            </button>
            <a
              href="/productos"
              className="block text-center mt-4 text-gray-600 hover:text-primary transition"
            >
              Continuar comprando
            </a>
          </div>
        </div>
      </div>

      <Footer siteName={settings.siteName} />
    </main>
  );
}
