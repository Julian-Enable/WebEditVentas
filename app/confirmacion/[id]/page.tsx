'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CheckCircle } from 'lucide-react';

interface Order {
  id: number;
  totalAmount: number;
  paymentMethod: string;
  shippingInsuranceFee: number;
  createdAt: string;
  customer: {
    fullName: string;
    email: string;
  };
}

interface SiteSettings {
  siteName: string;
  logoUrl: string;
}

export default function ConfirmacionPage() {
  const params = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
    fetchOrder();
  }, []);

  const fetchSettings = async () => {
    const res = await fetch('/api/settings');
    const data = await res.json();
    setSettings(data);
  };

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/orders/${params.id}`);
      const data = await res.json();
      setOrder(data);
    } catch (error) {
      console.error('Error al obtener orden:', error);
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <main>
        <Navbar siteName={settings.siteName} logoUrl={settings.logoUrl} />
        <div className="container mx-auto px-4 py-16 text-center">
          <p>Cargando detalles del pedido...</p>
        </div>
        <Footer siteName={settings.siteName} />
      </main>
    );
  }

  if (!order) {
    return (
      <main>
        <Navbar siteName={settings.siteName} logoUrl={settings.logoUrl} />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold mb-4">Pedido no encontrado</h1>
          <a href="/" className="text-primary hover:underline">Volver al inicio</a>
        </div>
        <Footer siteName={settings.siteName} />
      </main>
    );
  }

  return (
    <main>
      <Navbar siteName={settings.siteName} logoUrl={settings.logoUrl} />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow text-center">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
          
          <h1 className="text-4xl font-bold text-green-600 mb-4">
            ¡Pedido Confirmado!
          </h1>
          
          <p className="text-xl text-gray-700 mb-8">
            Gracias por tu compra, <strong>{order.customer.fullName}</strong>
          </p>

          <div className="bg-gray-50 p-6 rounded-lg mb-6 text-left">
            <h2 className="text-2xl font-bold mb-4">Detalles del Pedido</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Número de pedido:</span>
                <span className="font-semibold">#{order.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Método de pago:</span>
                <span className="font-semibold">{order.paymentMethod}</span>
              </div>
              {order.shippingInsuranceFee > 0 && (
                <div className="flex justify-between text-sm text-orange-600">
                  <span>Seguro de envío:</span>
                  <span className="font-semibold">{formatPrice(order.shippingInsuranceFee)}</span>
                </div>
              )}
              <div className="flex justify-between text-xl pt-4 border-t">
                <span className="font-bold">Total:</span>
                <span className="font-bold text-primary">{formatPrice(order.totalAmount)}</span>
              </div>
            </div>
          </div>

          <p className="text-gray-600 mb-8">
            Hemos enviado un correo de confirmación a <strong>{order.customer.email}</strong> con los detalles de tu pedido.
          </p>

          <div className="flex gap-4 justify-center">
            <a
              href="/"
              className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition"
            >
              Volver al Inicio
            </a>
            <a
              href="/productos"
              className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
            >
              Seguir Comprando
            </a>
          </div>
        </div>
      </div>

      <Footer siteName={settings.siteName} />
    </main>
  );
}
