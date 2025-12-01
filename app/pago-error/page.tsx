'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function PagoErrorPage() {
  const [sessionId, setSessionId] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const id = searchParams.get('sessionId');
    if (id) {
      setSessionId(id);
    }
  }, [searchParams]);

  const handleRetry = () => {
    router.push('/checkout');
  };

  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4"
      style={{
        fontFamily: '"Open Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}
    >
      <div className="w-full max-w-md">
        
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          
          {/* Body */}
          <div className="px-8 py-10 text-center">
            
            {/* Error Icon */}
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              No se pudo procesar tu pago
            </h1>

            {/* Description */}
            <p className="text-gray-600 mb-6 leading-relaxed">
              Lo sentimos, hubo un problema al procesar tu transacción. Por favor verifica los datos de tu tarjeta o intenta con otro método de pago.
            </p>

            {/* Error Details */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
              <p className="text-sm text-red-800 font-medium mb-2">Posibles causas:</p>
              <ul className="text-xs text-red-700 space-y-1 ml-4">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Fondos insuficientes en la tarjeta</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Tarjeta bloqueada o vencida</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Datos incorrectos (CVV, fecha de vencimiento)</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Límite de compras excedido</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Rechazo por parte del banco emisor</span>
                </li>
              </ul>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={handleRetry}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
              >
                Intentar nuevamente
              </button>
              <button
                onClick={handleGoHome}
                className="w-full py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Volver al inicio
              </button>
            </div>

            {/* Support */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                ¿Necesitas ayuda?{' '}
                <a href="mailto:soporte@casaplay.shop" className="text-blue-600 hover:underline font-medium">
                  Contacta a soporte
                </a>
              </p>
            </div>

          </div>

        </div>

        {/* Reference */}
        {sessionId && (
          <div className="text-center mt-4 text-xs text-gray-500">
            <p>Referencia: {sessionId.slice(-8).toUpperCase()}</p>
          </div>
        )}

      </div>
    </div>
  );
}
