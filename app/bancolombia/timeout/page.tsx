'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function BancolombiaTimeoutPage() {
  const [sessionId, setSessionId] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Redirigir directamente al carrito con mensaje de error
    router.push('/carrito?error=pago_fallido');
  }, [router]);

  const handleRetry = () => {
    router.push('/checkout');
  };

  const handleGoHome = () => {
    router.push('/');
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
          <p className="text-blue-200">Tiempo Agotado</p>
        </div>

        {/* Timeout Card */}
        <div className="bg-white rounded-xl shadow-2xl p-8">
          <div className="text-center mb-6">
            <div className="bg-orange-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
              <svg className="w-10 h-10 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Tiempo Agotado</h2>
            <p className="text-gray-600 mb-4">
              El tiempo límite para completar la transacción ha expirado
            </p>
            <p className="text-sm text-gray-500">
              Por favor intenta nuevamente más tarde
            </p>
          </div>

          <div className="space-y-3 mb-6">
            <button
              onClick={handleRetry}
              className="w-full py-3 px-6 bg-[#004B87] text-white rounded-lg hover:bg-[#003666] transition font-medium"
            >
              Intentar Nuevamente
            </button>
            
            <button
              onClick={handleGoHome}
              className="w-full py-3 px-6 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
            >
              Volver al Inicio
            </button>
          </div>

          <div className="bg-yellow-50 rounded-lg p-4 mb-4">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div>
                <h4 className="text-sm font-medium text-yellow-800 mb-1">¿Por qué pasó esto?</h4>
                <p className="text-xs text-yellow-700">
                  Por seguridad, las transacciones bancarias tienen un tiempo límite. 
                  Esto protege tu cuenta de accesos no autorizados.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <div className="flex items-center justify-center space-x-2 text-green-600">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">Tu información está segura</span>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-center mt-6">
          <p className="text-blue-200 text-sm">
            No se realizó ningún cobro a tu cuenta
          </p>
          <p className="text-blue-300 text-xs mt-2">
            Session ID: {sessionId.slice(-8)}
          </p>
        </div>
      </div>
    </div>
  );
}