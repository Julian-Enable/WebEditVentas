'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useCart } from '@/hooks/useCart'
import Swal from 'sweetalert2'

// Réplica exacta del diseño de Bold con integración completa
export default function BoldCheckoutPage() {
  const router = useRouter()
  const { items, getTotalPrice, clearCart } = useCart()
  
  const [formData, setFormData] = useState({
    phone: '',
    email: '',
    cardNumber: '',
    cardDate: '',
    cardCVC: '',
    cardHolder: '',
    acceptPrivacy: false,
    acceptTerms: false
  })

  const [dialCode, setDialCode] = useState('+57')
  const [selectedMethod, setSelectedMethod] = useState('CREDIT_CARD')
  const [isProcessing, setIsProcessing] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Redirigir si el carrito está vacío
  useEffect(() => {
    if (items.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Carrito vacío',
        text: 'No tienes productos en el carrito',
        confirmButtonColor: '#e34151'
      }).then(() => {
        router.push('/productos')
      })
    }
  }, [items, router])

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ''
    const parts = []

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(' ')
    } else {
      return value
    }
  }

  const formatCardDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    if (v.length >= 2) {
      return `${v.slice(0, 2)}/${v.slice(2, 4)}`
    }
    return v
  }

  // Detectar tipo de tarjeta
  const detectCardType = (cardNumber: string): string => {
    const number = cardNumber.replace(/\s/g, '')
    
    if (/^4/.test(number)) return 'visa'
    if (/^5[1-5]/.test(number)) return 'mastercard'
    if (/^3[47]/.test(number)) return 'amex'
    if (/^6(?:011|5)/.test(number)) return 'discover'
    if (/^3(?:0[0-5]|[68])/.test(number)) return 'diners'
    
    return 'unknown'
  }

  const cardType = detectCardType(formData.cardNumber)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }))
      return
    }

    let formattedValue = value
    if (name === 'cardNumber') {
      formattedValue = formatCardNumber(value)
    } else if (name === 'cardDate') {
      formattedValue = formatCardDate(value)
    } else if (name === 'cardCVC') {
      formattedValue = value.replace(/[^0-9]/g, '').slice(0, 3)
    } else if (name === 'phone') {
      formattedValue = value.replace(/[^0-9]/g, '').slice(0, 10)
    }

    setFormData(prev => ({ ...prev, [name]: formattedValue }))
  }

  // Validaciones de campos
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.phone || formData.phone.length < 10) {
      newErrors.phone = 'Ingresa un teléfono válido (10 dígitos)'
    }

    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Ingresa un correo electrónico válido'
    }

    if (!formData.cardNumber || formData.cardNumber.replace(/\s/g, '').length < 15) {
      newErrors.cardNumber = 'Ingresa un número de tarjeta válido'
    }

    if (!formData.cardDate || formData.cardDate.length !== 5) {
      newErrors.cardDate = 'Ingresa una fecha válida (MM/AA)'
    } else {
      const [month, year] = formData.cardDate.split('/')
      const currentYear = new Date().getFullYear() % 100
      const currentMonth = new Date().getMonth() + 1
      
      if (parseInt(month) < 1 || parseInt(month) > 12) {
        newErrors.cardDate = 'Mes inválido'
      } else if (parseInt(year) < currentYear || (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
        newErrors.cardDate = 'Tarjeta vencida'
      }
    }

    if (!formData.cardCVC || formData.cardCVC.length !== 3) {
      newErrors.cardCVC = 'CVV debe tener 3 dígitos'
    }

    if (!formData.cardHolder || formData.cardHolder.trim().length < 3) {
      newErrors.cardHolder = 'Ingresa el nombre del titular'
    }

    if (!formData.acceptPrivacy) {
      newErrors.acceptPrivacy = 'Debes aceptar la política de privacidad'
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'Debes aceptar los términos y condiciones'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      Swal.fire({
        icon: 'error',
        title: 'Campos incompletos',
        text: 'Por favor completa todos los campos correctamente',
        confirmButtonColor: '#e34151'
      })
      return
    }

    setIsProcessing(true)

    try {
      // Preparar datos del pedido
      const orderData = {
        items: items.map(item => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        total: getTotalPrice(),
        paymentMethod: 'credit_card',
        cardInfo: {
          lastFourDigits: formData.cardNumber.slice(-4),
          cardHolder: formData.cardHolder
        },
        contactInfo: {
          phone: `${dialCode}${formData.phone}`,
          email: formData.email
        }
      }

      // Llamar a la API de procesamiento de pago
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Error al procesar el pago')
      }

      // Limpiar carrito
      clearCart()

      // Mostrar éxito
      await Swal.fire({
        icon: 'success',
        title: '¡Pago exitoso!',
        text: 'Tu pedido ha sido procesado correctamente',
        confirmButtonColor: '#e34151'
      })

      // Redirigir a confirmación
      router.push(`/confirmacion/${result.orderId}`)

    } catch (error) {
      console.error('Error procesando pago:', error)
      Swal.fire({
        icon: 'error',
        title: 'Error en el pago',
        text: error instanceof Error ? error.message : 'Ocurrió un error al procesar tu pago. Por favor intenta nuevamente.',
        confirmButtonColor: '#e34151'
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row font-sans bg-white">
      {/* Panel Izquierdo - Gradiente Bold */}
      <div className="w-full lg:w-[40%] xl:w-[35%] bg-gradient-to-b from-[#e34151] via-[#c7325e] to-[#1e3a5f] text-white p-6 lg:p-8 flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-2">
            <div className="text-3xl font-bold">bold</div>
          </div>
          
          {/* Language Selector */}
          <button className="flex items-center gap-2 bg-white/20 rounded-full px-3 py-1.5 text-sm backdrop-blur-sm">
            <span>🇨🇴</span>
            <span>ES</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Merchant Info */}
        <div className="flex-1 flex flex-col justify-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg px-3 py-1 text-xs font-semibold flex items-center gap-1">
                <span>👑</span>
                <span>Negocio Master</span>
              </div>
            </div>
            <h3 className="text-xl font-bold mb-1">CasaPlay Gaming</h3>
            <p className="text-sm text-white/80">Más de 500 ventas exitosas con Bold</p>
          </div>

          {/* Cart Items */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mb-4 max-h-60 overflow-y-auto">
            <h4 className="text-sm font-semibold mb-3 text-white/90">Resumen del pedido</h4>
            <div className="space-y-2">
              {items.map((item) => (
                <div key={item.productId} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-white/70">{item.quantity}x</span>
                    <span className="text-white/90 truncate">{item.name}</span>
                  </div>
                  <span className="text-white font-medium">
                    ${(item.price * item.quantity).toLocaleString('es-CO')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Total Amount */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
            <p className="text-sm text-white/70 mb-2">Total a pagar</p>
            <p className="text-5xl font-bold">
              ${getTotalPrice().toLocaleString('es-CO')} COP
            </p>
            <p className="text-xs text-white/60 mt-2">
              {items.reduce((total, item) => total + item.quantity, 0)} {items.reduce((total, item) => total + item.quantity, 0) === 1 ? 'producto' : 'productos'}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8">
          <button className="text-sm text-white/70 hover:text-white transition-colors flex items-center gap-2">
            Calcular en <span className="underline font-semibold">mi moneda</span>
          </button>
        </div>
      </div>

      {/* Panel Derecho - Formulario */}
      <div className="flex-1 bg-gray-50 overflow-y-auto">
        <div className="max-w-2xl mx-auto p-6 lg:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Payment Methods */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">¿Cómo quieres pagar?</h2>
                <button type="button" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  Cambiar método de pago
                </button>
              </div>

              {/* Card Payment Option */}
              <div className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                selectedMethod === 'CREDIT_CARD' 
                  ? 'border-blue-600 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Pago con tarjeta</p>
                      <div className="flex items-center gap-2 mt-1">
                        {['amex', 'visa', 'mastercard', 'diners', 'discover', 'codensa'].map((brand, i) => (
                          <div key={i} className="w-8 h-5 bg-gray-200 rounded"></div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedMethod === 'CREDIT_CARD' 
                      ? 'border-blue-600 bg-blue-600' 
                      : 'border-gray-300'
                  }`}>
                    {selectedMethod === 'CREDIT_CARD' && (
                      <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
              {/* Phone */}
              <div className="flex gap-2">
                <div className="w-32">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                  <button
                    type="button"
                    className="w-full h-14 flex items-center justify-between px-4 border-2 border-gray-200 rounded-xl hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🇨🇴</span>
                      <span className="font-medium">{dialCode}</span>
                    </div>
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2 opacity-0">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="3123122244"
                    className={`w-full h-14 px-4 border-2 rounded-xl focus:ring-0 outline-none transition-colors ${
                      errors.phone ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-600'
                    }`}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ingresa tu correo electrónico
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="El que está registrado en tu banco"
                  className={`w-full h-14 px-4 border-2 rounded-xl focus:ring-0 outline-none transition-colors ${
                    errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-600'
                  }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              {/* Card Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número de tarjeta
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    placeholder="---- ---- ---- ----"
                    maxLength={19}
                    className={`w-full h-14 px-4 pr-12 border-2 rounded-xl focus:ring-0 outline-none transition-colors ${
                      errors.cardNumber ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-600'
                    }`}
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    {cardType !== 'unknown' ? (
                      <div className="text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-600 rounded">
                        {cardType.toUpperCase()}
                      </div>
                    ) : (
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    )}
                  </div>
                </div>
                {errors.cardNumber && (
                  <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>
                )}
              </div>

              {/* Expiry & CVV */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vencimiento
                  </label>
                  <input
                    type="text"
                    name="cardDate"
                    value={formData.cardDate}
                    onChange={handleInputChange}
                    placeholder="MM/AA"
                    maxLength={5}
                    className={`w-full h-14 px-4 border-2 rounded-xl focus:ring-0 outline-none transition-colors ${
                      errors.cardDate ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-600'
                    }`}
                  />
                  {errors.cardDate && (
                    <p className="text-red-500 text-xs mt-1">{errors.cardDate}</p>
                  )}
                </div>
                <div className="w-32">
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                    CVV o CVC
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </label>
                  <input
                    type="text"
                    name="cardCVC"
                    value={formData.cardCVC}
                    onChange={handleInputChange}
                    placeholder="---"
                    maxLength={3}
                    className={`w-full h-14 px-4 border-2 rounded-xl focus:ring-0 outline-none transition-colors ${
                      errors.cardCVC ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-600'
                    }`}
                  />
                  {errors.cardCVC && (
                    <p className="text-red-500 text-xs mt-1">{errors.cardCVC}</p>
                  )}
                </div>
              </div>

              {/* Cardholder Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del titular
                </label>
                <input
                  type="text"
                  name="cardHolder"
                  value={formData.cardHolder}
                  onChange={handleInputChange}
                  placeholder="Igual al que aparece en la tarjeta"
                  className={`w-full h-14 px-4 border-2 rounded-xl focus:ring-0 outline-none transition-colors ${
                    errors.cardHolder ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-600'
                  }`}
                />
                {errors.cardHolder && (
                  <p className="text-red-500 text-xs mt-1">{errors.cardHolder}</p>
                )}
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="space-y-3">
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    name="acceptPrivacy"
                    checked={formData.acceptPrivacy}
                    onChange={handleInputChange}
                    className="w-5 h-5 border-2 border-gray-300 rounded checked:bg-blue-600 checked:border-blue-600 cursor-pointer"
                  />
                </div>
                <span className="text-sm text-gray-700 leading-tight">
                  Acepto el tratamiento de mis datos personales de acuerdo con la{' '}
                  <a href="#" className="text-blue-600 hover:underline">Política de privacidad</a>
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    name="acceptTerms"
                    checked={formData.acceptTerms}
                    onChange={handleInputChange}
                    className="w-5 h-5 border-2 border-gray-300 rounded checked:bg-blue-600 checked:border-blue-600 cursor-pointer"
                  />
                </div>
                <span className="text-sm text-gray-700 leading-tight">
                  Acepto{' '}
                  <a href="#" className="text-blue-600 hover:underline">Términos y condiciones</a>
                </span>
              </label>
            </div>

            {/* Pay Button */}
            <button
              type="submit"
              disabled={!formData.acceptPrivacy || !formData.acceptTerms || isProcessing}
              className="w-full h-14 bg-[#e34151] hover:bg-[#d13545] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors text-lg shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Procesando...</span>
                </>
              ) : (
                <>
                  <span>Pagar ${getTotalPrice().toLocaleString('es-CO')}</span>
                </>
              )}
            </button>

            {/* Cancel Link */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => router.push('/carrito')}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                Abandonar pago
              </button>
            </div>

            {/* Security Footer */}
            <div className="pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 text-center mb-4">Paga seguro con Bold</p>
              <div className="flex items-center justify-center gap-3 flex-wrap">
                {['PCI', 'SSL', 'PSE', 'Visa', 'Mastercard', 'reCAPTCHA'].map((badge, i) => (
                  <div key={i} className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                    <span className="text-xs font-bold text-gray-500">{badge.slice(0, 2)}</span>
                  </div>
                ))}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
