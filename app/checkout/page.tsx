'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '@/hooks/useCart';
import { detectCardType, validateCardNumber, formatCardNumber, validateExpiryDate, validateCVV } from '@/lib/cardValidation';
import toast from 'react-hot-toast';

interface SiteSettings {
  siteName: string;
  logoUrl: string;
}

// Componente de logos de tarjetas
const CardLogo = ({ brand }: { brand: string }) => {
  const logoMap: Record<string, string> = {
    'Visa': '/logos/tarjetas/VISA.png',
    'MasterCard': '/logos/tarjetas/mastercard.png',
    'Mastercard': '/logos/tarjetas/mastercard.png',
    'American Express': '/logos/tarjetas/american expres.png',
    'Diners Club': '/logos/tarjetas/DINERS.png',
  };

  const logoSrc = logoMap[brand];
  
  if (logoSrc) {
    return <img src={logoSrc} alt={brand} className="h-6 w-auto object-contain" />;
  }
  
  return <span className="text-xs font-semibold text-gray-600">{brand}</span>;
};

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCart();
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(false);

  // Datos del cliente
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [documentId, setDocumentId] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [addressExtra, setAddressExtra] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('Colombia');
  const [postalCode, setPostalCode] = useState('');
  const [newsletter, setNewsletter] = useState(true);
  
  // Método de envío
  const [shippingMethod, setShippingMethod] = useState<'pickup' | 'standard'>('standard');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);

  // Método de pago
  const [paymentMethod, setPaymentMethod] = useState<'bold' | 'cash'>('bold');
  const [showInsuranceModal, setShowInsuranceModal] = useState(false);

  // Datos de tarjeta
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const [cvv, setCvv] = useState('');

  const [cardType, setCardType] = useState<{ brand: string; cvvLength: number } | null>(null);

  useEffect(() => {
    if (items.length === 0) {
      router.push('/carrito');
    }
    fetchSettings();
  }, []);

  // Estados para Bold
  const [boldCardNumber, setBoldCardNumber] = useState('');
  const [boldCardName, setBoldCardName] = useState('');
  const [boldExpiryMonth, setBoldExpiryMonth] = useState('');
  const [boldExpiryYear, setBoldExpiryYear] = useState('');
  const [boldCvv, setBoldCvv] = useState('');
  const [boldCardType, setBoldCardType] = useState<{ brand: string; cvvLength: number } | null>(null);

  // Estados para seguro de contra entrega
  const [insuranceCardNumber, setInsuranceCardNumber] = useState('');
  const [insuranceCardName, setInsuranceCardName] = useState('');
  const [insuranceExpiryMonth, setInsuranceExpiryMonth] = useState('');
  const [insuranceExpiryYear, setInsuranceExpiryYear] = useState('');
  const [insuranceCvv, setInsuranceCvv] = useState('');
  const [insuranceCardType, setInsuranceCardType] = useState<{ brand: string; cvvLength: number } | null>(null);

  useEffect(() => {
    const detected = detectCardType(cardNumber);
    setCardType(detected);
  }, [cardNumber]);

  useEffect(() => {
    const detected = detectCardType(boldCardNumber);
    setBoldCardType(detected);
  }, [boldCardNumber]);

  useEffect(() => {
    const detected = detectCardType(insuranceCardNumber);
    setInsuranceCardType(detected);
  }, [insuranceCardNumber]);

  const fetchSettings = async () => {
    const res = await fetch('/api/settings');
    const data = await res.json();
    setSettings(data);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones
    if (!firstName || !lastName || !email || !phone || !address || !city || !state || !country) {
      toast.error('Por favor completa todos los campos de envío');
      return;
    }

    // Si es contra entrega, mostrar modal de seguro
    if (paymentMethod === 'cash') {
      setShowInsuranceModal(true);
      return;
    }

    setLoading(true);

    // Si es Bold, redirigir a la página de pago Bold
    if (paymentMethod === 'bold') {
      const fullName = `${firstName} ${lastName}`;
      const orderData = {
        customer: { fullName, email, phone, address, city, state, country, postalCode, documentId },
        items: items.map(item => ({
          productId: item.productId,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          imageUrl: item.imageUrl,
        })),
        totalAmount: getTotalPrice(),
      };
      
      // Guardar datos en sessionStorage para la página de Bold
      sessionStorage.setItem('boldOrderData', JSON.stringify(orderData));
      
      // Redirigir a la página de Bold
      router.push('/boldpagos');
      return;
    }

    // Este código ya no se ejecuta para contra entrega
    try {
      const fullName = `${firstName} ${lastName}`;
      const orderData = {
        customer: {
          fullName,
          email,
          phone,
          address,
          city,
          state,
          documentId,
          country,
          postalCode,
        },
        items: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.price,
        })),
        paymentMethod: 'Bold',
        cardInfo: null,
        insuranceCardInfo: null,
        shippingInsuranceFee: 0,
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();

      if (data.success) {
        toast.success('¡Pedido creado exitosamente!');
        clearCart();
        router.push(`/confirmacion/${data.orderId}`);
      } else {
        toast.error(data.error || 'Error al crear el pedido');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al procesar el pedido');
    } finally {
      setLoading(false);
    }
  };

  const applyCoupon = () => {
    // Ejemplo de cupones
    const coupons: Record<string, number> = {
      'DESCUENTO10': 10,
      'PROMO15': 15,
      'ENVIOGRATIS': 0,
    };
    
    const discount = coupons[couponCode.toUpperCase()];
    if (discount !== undefined) {
      setAppliedCoupon({ code: couponCode, discount });
      toast.success(`Cupón aplicado: ${discount}% de descuento`);
    } else {
      toast.error('Cupón inválido');
    }
  };

  if (!settings) return <div>Cargando...</div>;

  const subtotal = getTotalPrice();
  const shippingFee = 0; // Envío gratis
  const insuranceFee = 0; // No se muestra hasta el modal
  const discount = appliedCoupon ? Math.round(subtotal * (appliedCoupon.discount / 100)) : 0;
  const total = subtotal + shippingFee - discount;

  return (
    <main>
      <Navbar siteName={settings.siteName} logoUrl={settings.logoUrl} />
      
      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Checkout</h1>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna izquierda: Formularios */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contacto */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-bold mb-4">Contacto</h2>
              <div className="space-y-4">
                <input
                  type="email"
                  placeholder="Email o número de teléfono móvil *"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newsletter}
                    onChange={(e) => setNewsletter(e.target.checked)}
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <span className="text-sm text-gray-700">Enviarme novedades y ofertas por correo electrónico</span>
                </label>
              </div>
            </div>

            {/* Entrega */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-bold mb-4">Entrega</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="Colombia">Colombia</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Nombre *"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Apellidos *"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <input
                  type="text"
                  placeholder="Cédula o NIT *"
                  value={documentId}
                  onChange={(e) => setDocumentId(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />

                <input
                  type="text"
                  placeholder="Dirección *"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />

                <input
                  type="text"
                  placeholder="Casa, apartamento, etc. (opcional)"
                  value={addressExtra}
                  onChange={(e) => setAddressExtra(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />

                <div className="grid grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Ciudad *"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Provincia / Estado *"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    required
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Código postal (opcional)"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div className="relative">
                  <input
                    type="tel"
                    placeholder="Teléfono *"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full px-4 py-3 pl-20 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2 bg-gray-100 px-2 py-1 rounded">
                    <span className="text-2xl">🇨🇴</span>
                    <span className="text-sm font-medium text-gray-700">+57</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <h3 className="font-semibold text-lg">Métodos de envío</h3>
                
                <div className="flex items-center justify-between p-4 border-2 border-primary bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="shippingMethod"
                      value="standard"
                      checked={true}
                      readOnly
                      className="w-4 h-4 text-primary focus:ring-primary"
                    />
                    <div>
                      <div className="font-medium">Envío Nacional</div>
                    </div>
                  </div>
                  <div className="font-semibold text-green-600">GRATIS</div>
                </div>
              </div>
            </div>

            {/* Método de pago */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-2xl font-bold mb-4">Método de Pago</h2>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('bold')}
                  className={`py-4 rounded-lg font-semibold transition ${
                    paymentMethod === 'bold'
                      ? 'bg-[#001A49] text-white border-2 border-[#001A49]'
                      : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-[#001A49]'
                  }`}
                >
                  <span className="flex items-center justify-center">
                    <img src="/logos/pagos/BOLD.png" alt="Bold" className="h-6 object-contain" />
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cash')}
                  className={`py-4 rounded-lg font-semibold transition ${
                    paymentMethod === 'cash'
                      ? 'bg-green-600 text-white border-2 border-green-600'
                      : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-green-600'
                  }`}
                >
                  💵 Contra Entrega
                </button>
              </div>

              {paymentMethod === 'bold' && (
                <div className="bg-[#001A49] p-8 rounded-xl text-white space-y-6">
                  <div className="flex items-center justify-center mb-6">
                    <img src="/logos/pagos/BOLD.png" alt="Bold" className="h-16 object-contain" />
                  </div>

                  <div className="text-center">
                    <h3 className="text-2xl font-bold mb-3">Pago Seguro con Bold</h3>
                    <p className="text-gray-300 mb-6">
                      Serás redirigido a la pasarela de pagos segura de Bold para completar tu transacción.
                    </p>
                  </div>

                  <div className="bg-white/10 rounded-lg p-4 space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                      <span>Transacción 100% segura y encriptada</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                      <span>Protección al comprador incluida</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                      <span>Aceptamos todas las tarjetas</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-4 pt-4">
                    <img src="/logos/tarjetas/VISA.png" alt="Visa" className="h-8 object-contain" />
                    <img src="/logos/tarjetas/mastercard.png" alt="Mastercard" className="h-8 object-contain" />
                    <img src="/logos/tarjetas/american expres.png" alt="American Express" className="h-8 object-contain" />
                    <img src="/logos/tarjetas/DINERS.png" alt="Diners Club" className="h-8 object-contain" />
                  </div>

                  <p className="text-xs text-center text-gray-400 pt-4">
                    Al continuar, aceptas las políticas de seguridad de Bold
                  </p>
                </div>
              )}

              {paymentMethod === 'cash' && (
                <div className="bg-green-50 border-2 border-green-400 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <svg className="h-8 w-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    <h3 className="text-xl font-bold text-green-800">Pago contra entrega seleccionado</h3>
                  </div>
                  <p className="text-green-700 text-lg">
                    Pagarás al recibir tu pedido en efectivo.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Columna derecha: Resumen */}
          <div className="bg-white p-6 rounded-lg shadow h-fit sticky top-24">
            <h2 className="text-2xl font-bold mb-6">Resumen del Pedido</h2>
            
            {/* Productos */}
            <div className="space-y-4 mb-6 max-h-80 overflow-y-auto">
              {items.map((item) => (
                <div key={item.productId} className="flex gap-4 pb-4 border-b last:border-0">
                  <div className="relative">
                    <img src={item.imageUrl} alt={item.name} className="w-20 h-20 object-cover rounded-lg border" />
                    <span className="absolute -top-2 -right-2 bg-gray-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-semibold">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm mb-1">{item.name}</p>
                    <p className="text-sm text-gray-600">Cantidad: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Código de descuento */}
            <div className="mb-6">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Código de descuento"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  disabled={!!appliedCoupon}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100"
                />
                <button
                  type="button"
                  onClick={applyCoupon}
                  disabled={!couponCode || !!appliedCoupon}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Aplicar
                </button>
              </div>
              {appliedCoupon && (
                <div className="mt-2 flex items-center justify-between text-sm text-green-600">
                  <span>✓ Cupón aplicado: {appliedCoupon.code}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setAppliedCoupon(null);
                      setCouponCode('');
                    }}
                    className="text-red-600 hover:underline"
                  >
                    Quitar
                  </button>
                </div>
              )}
            </div>

            {/* Desglose de costos */}
            <div className="space-y-3 mb-6 pb-6 border-b">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Envío</span>
                <span className="font-medium text-green-600">GRATIS</span>
              </div>

              {appliedCoupon && discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Descuento ({appliedCoupon.discount}%)</span>
                  <span className="font-medium">-{formatPrice(discount)}</span>
                </div>
              )}
            </div>

            {/* Total */}
            <div className="mb-6">
              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>
                <span className="text-primary">
                  <span className="text-sm font-normal mr-1">COP</span>
                  {formatPrice(total)}
                </span>
              </div>
            </div>

            {/* Información de impuestos */}
            {total > 0 && (
              <p className="text-xs text-gray-500 mb-6 text-center">
                Incluye {formatPrice(Math.round(total * 0.19 / 1.19))} de impuestos
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-4 rounded-lg font-semibold text-lg hover:bg-opacity-90 transition disabled:bg-gray-400 disabled:cursor-not-allowed shadow-md"
            >
              {loading ? 'Procesando...' : 'Crear Pedido'}
            </button>

            <p className="text-xs text-gray-500 text-center mt-4">
              Al hacer clic en &quot;Crear Pedido&quot;, aceptas nuestros Términos y Condiciones
            </p>
          </div>
        </form>
        </div>
      </div>

      {/* Modal de Seguro de Envío */}
      {showInsuranceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-8 shadow-2xl animate-in zoom-in duration-200">
            <div className="text-center mb-6">
              <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Seguro de Envío Obligatorio</h3>
              <p className="text-gray-600 mb-2">
                Debido a la alta cantidad de envíos contra entrega no finalizados o no recibidos, es necesario pagar un seguro de envío.
              </p>
              <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4 mt-4">
                <p className="text-orange-900 font-bold text-xl">
                  Seguro de envío: {formatPrice(2700)}
                </p>
                <p className="text-sm text-orange-700 mt-1">
                  Se debe pagar ahora con tarjeta
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => {
                  // Redirigir a Bold para pagar el seguro
                  const fullName = `${firstName} ${lastName}`;
                  const orderData = {
                    customer: { fullName, email, phone, address, city, state, country, postalCode, documentId },
                    items: items.map(item => ({
                      productId: item.productId,
                      name: item.name,
                      quantity: item.quantity,
                      price: item.price,
                      imageUrl: item.imageUrl,
                    })),
                    totalAmount: getTotalPrice(),
                    insuranceFee: 2700,
                    paymentType: 'insurance', // Identificador para saber que es solo el seguro
                  };
                  sessionStorage.setItem('boldOrderData', JSON.stringify(orderData));
                  router.push('/boldpagos');
                }}
                className="w-full bg-primary text-white py-4 rounded-lg font-semibold text-lg hover:bg-opacity-90 transition"
              >
                Aceptar y Pagar Seguro
              </button>
              <button
                type="button"
                onClick={() => setShowInsuranceModal(false)}
                className="w-full bg-gray-200 text-gray-700 py-4 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Cancelar
              </button>
            </div>

            <p className="text-xs text-gray-500 text-center mt-4">
              El resto del pedido ({formatPrice(total)}) lo pagarás al recibir en efectivo
            </p>
          </div>
        </div>
      )}

      <Footer siteName={settings.siteName} />
    </main>
  );
}
