'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Store, Palette, Globe, CreditCard, Truck, FileText, BarChart3, Phone } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminConfiguracion() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('brand');
  const [formData, setFormData] = useState({
    // Identidad de Marca
    siteName: '',
    logoUrl: '',
    faviconUrl: '',
    brandDescription: '',
    tagline: '',
    
    // Información de Contacto
    contactEmail: '',
    contactPhone: '',
    whatsappNumber: '',
    address: '',
    city: '',
    country: '',
    
    // Redes Sociales
    facebookUrl: '',
    instagramUrl: '',
    twitterUrl: '',
    tiktokUrl: '',
    youtubeUrl: '',
    
    // Personalización Visual
    primaryColor: '',
    secondaryColor: '',
    accentColor: '',
    fontFamily: '',
    buttonStyle: '',
    
    // Hero Section
    heroImage: '',
    heroTitle: '',
    heroSubtitle: '',
    
    // Sobre Nosotros
    aboutUsText: '',
    
    // SEO y Analytics
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
    googleAnalyticsId: '',
    facebookPixelId: '',
    googleTagManagerId: '',
    
    // Configuración de Pagos
    enableBoldPayments: true,
    enableBancolombia: true,
    enableCreditCard: true,
    merchantName: '',
    paymentMethodsLogos: '',
    
    // Configuración de Tienda
    currency: '',
    currencySymbol: '',
    language: '',
    timezone: '',
    enableReviews: true,
    enableWishlist: false,
    maxProductsPerPage: 12,
    
    // Envíos y Logística
    shippingMessage: '',
    shippingInsuranceFee: 0,
    freeShippingMinAmount: 0,
    estimatedDeliveryDays: '',
    
    // Legal y Políticas
    termsAndConditionsUrl: '',
    privacyPolicyUrl: '',
    returnPolicyUrl: '',
  });

  useEffect(() => {
    verifyAuth();
    fetchSettings();
  }, []);

  const verifyAuth = async () => {
    const res = await fetch('/api/auth/verify');
    if (!res.ok) router.push('/adminpropage');
  };

  const fetchSettings = async () => {
    const res = await fetch('/api/settings');
    const data = await res.json();
    setFormData(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      toast.success('Configuración actualizada');
      
      // Actualizar variables CSS
      document.documentElement.style.setProperty('--color-primary', formData.primaryColor);
      document.documentElement.style.setProperty('--color-secondary', formData.secondaryColor);
    } else {
      toast.error('Error al actualizar');
    }
  };

  const tabs = [
    { id: 'brand', label: 'Marca e Identidad', icon: Store },
    { id: 'contact', label: 'Contacto', icon: Phone },
    { id: 'design', label: 'Diseño y Colores', icon: Palette },
    { id: 'social', label: 'Redes Sociales', icon: Globe },
    { id: 'seo', label: 'SEO y Analytics', icon: BarChart3 },
    { id: 'payments', label: 'Pagos', icon: CreditCard },
    { id: 'shipping', label: 'Envíos', icon: Truck },
    { id: 'legal', label: 'Legal', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md mb-8">
        <div className="container mx-auto px-4 py-4">
          <Link href="/adminpropage/dashboard" className="flex items-center gap-2 text-gray-700 hover:text-primary">
            <ArrowLeft className="w-5 h-5" />
            Volver al Panel
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-4xl font-bold mb-2">Configuración del Sitio</h1>
        <p className="text-gray-600 mb-8">Personaliza completamente tu tienda online</p>

        {/* Tabs de Navegación */}
        <div className="bg-white rounded-lg shadow mb-6 overflow-x-auto">
          <div className="flex border-b">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium whitespace-nowrap transition ${
                    activeTab === tab.id
                      ? 'border-b-2 border-primary text-primary'
                      : 'text-gray-600 hover:text-primary'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow">
          {/* TAB: Marca e Identidad */}
          {activeTab === 'brand' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-4">Marca e Identidad</h2>
              
              <div>
                <label className="block text-sm font-medium mb-1">Nombre de la Tienda *</label>
                <input
                  type="text"
                  value={formData.siteName}
                  onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                  placeholder="Ej: CasaPlay"
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Este nombre aparecerá en el navbar y en todo el sitio</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Eslogan / Tagline</label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  placeholder="Ej: Tu tienda gaming de confianza"
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Descripción de la Marca</label>
                <textarea
                  value={formData.brandDescription}
                  onChange={(e) => setFormData({ ...formData, brandDescription: e.target.value })}
                  placeholder="Descripción breve de tu negocio"
                  rows={3}
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">URL del Logo</label>
                  <input
                    type="url"
                    value={formData.logoUrl}
                    onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                    placeholder="https://ejemplo.com/logo.png"
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">URL del Favicon</label>
                  <input
                    type="url"
                    value={formData.faviconUrl}
                    onChange={(e) => setFormData({ ...formData, faviconUrl: e.target.value })}
                    placeholder="https://ejemplo.com/favicon.ico"
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Texto &quot;Sobre Nosotros&quot;</label>
                <textarea
                  value={formData.aboutUsText}
                  onChange={(e) => setFormData({ ...formData, aboutUsText: e.target.value })}
                  rows={4}
                  placeholder="Cuéntale a tus clientes sobre tu historia..."
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          )}

          {/* TAB: Contacto */}
          {activeTab === 'contact' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-4">Información de Contacto</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Email de Contacto *</label>
                  <input
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                    placeholder="contacto@tutienda.com"
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Teléfono *</label>
                  <input
                    type="text"
                    value={formData.contactPhone}
                    onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                    placeholder="+57 300 123 4567"
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">WhatsApp (solo números)</label>
                <input
                  type="text"
                  value={formData.whatsappNumber}
                  onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                  placeholder="573001234567"
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <p className="text-xs text-gray-500 mt-1">Sin espacios ni símbolos, ej: 573001234567</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Dirección</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Calle 123 #45-67"
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Ciudad</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Bogotá"
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">País</label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    placeholder="Colombia"
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB: Diseño y Colores */}
          {activeTab === 'design' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-4">Diseño y Colores</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Color Primario</label>
                  <input
                    type="color"
                    value={formData.primaryColor}
                    onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                    className="w-full h-12 border rounded cursor-pointer"
                  />
                  <p className="text-xs text-gray-500 mt-1">{formData.primaryColor}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Color Secundario</label>
                  <input
                    type="color"
                    value={formData.secondaryColor}
                    onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                    className="w-full h-12 border rounded cursor-pointer"
                  />
                  <p className="text-xs text-gray-500 mt-1">{formData.secondaryColor}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Color de Acento</label>
                  <input
                    type="color"
                    value={formData.accentColor}
                    onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                    className="w-full h-12 border rounded cursor-pointer"
                  />
                  <p className="text-xs text-gray-500 mt-1">{formData.accentColor}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Fuente Tipográfica</label>
                  <select
                    value={formData.fontFamily}
                    onChange={(e) => setFormData({ ...formData, fontFamily: e.target.value })}
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="Inter">Inter</option>
                    <option value="Roboto">Roboto</option>
                    <option value="Poppins">Poppins</option>
                    <option value="Montserrat">Montserrat</option>
                    <option value="Open Sans">Open Sans</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Estilo de Botones</label>
                  <select
                    value={formData.buttonStyle}
                    onChange={(e) => setFormData({ ...formData, buttonStyle: e.target.value })}
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="rounded">Redondeados</option>
                    <option value="square">Cuadrados</option>
                    <option value="pill">Píldora (muy redondeados)</option>
                  </select>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Sección Hero (Banner Principal)</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">URL de Imagen Hero</label>
                    <input
                      type="url"
                      value={formData.heroImage}
                      onChange={(e) => setFormData({ ...formData, heroImage: e.target.value })}
                      placeholder="https://ejemplo.com/hero.jpg"
                      className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Título Hero</label>
                    <input
                      type="text"
                      value={formData.heroTitle}
                      onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
                      placeholder="Bienvenido a nuestra tienda"
                      className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Subtítulo Hero</label>
                    <input
                      type="text"
                      value={formData.heroSubtitle}
                      onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
                      placeholder="Los mejores productos al mejor precio"
                      className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: Redes Sociales */}
          {activeTab === 'social' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-4">Redes Sociales</h2>
              <p className="text-gray-600 mb-4">Deja en blanco las redes que no uses</p>
              
              <div>
                <label className="block text-sm font-medium mb-1">Facebook</label>
                <input
                  type="url"
                  value={formData.facebookUrl}
                  onChange={(e) => setFormData({ ...formData, facebookUrl: e.target.value })}
                  placeholder="https://facebook.com/tutienda"
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Instagram</label>
                <input
                  type="url"
                  value={formData.instagramUrl}
                  onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
                  placeholder="https://instagram.com/tutienda"
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Twitter / X</label>
                <input
                  type="url"
                  value={formData.twitterUrl}
                  onChange={(e) => setFormData({ ...formData, twitterUrl: e.target.value })}
                  placeholder="https://twitter.com/tutienda"
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">TikTok</label>
                <input
                  type="url"
                  value={formData.tiktokUrl}
                  onChange={(e) => setFormData({ ...formData, tiktokUrl: e.target.value })}
                  placeholder="https://tiktok.com/@tutienda"
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">YouTube</label>
                <input
                  type="url"
                  value={formData.youtubeUrl}
                  onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
                  placeholder="https://youtube.com/@tutienda"
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          )}

          {/* TAB: SEO y Analytics */}
          {activeTab === 'seo' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-4">SEO y Analytics</h2>
              
              <div>
                <label className="block text-sm font-medium mb-1">Título SEO (Meta Title)</label>
                <input
                  type="text"
                  value={formData.metaTitle}
                  onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                  placeholder="Tu Tienda - Los mejores productos"
                  maxLength={60}
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <p className="text-xs text-gray-500 mt-1">{formData.metaTitle.length}/60 caracteres</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Meta Description</label>
                <textarea
                  value={formData.metaDescription}
                  onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                  placeholder="Descripción para motores de búsqueda"
                  maxLength={160}
                  rows={3}
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <p className="text-xs text-gray-500 mt-1">{formData.metaDescription.length}/160 caracteres</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Keywords (separadas por comas)</label>
                <input
                  type="text"
                  value={formData.metaKeywords}
                  onChange={(e) => setFormData({ ...formData, metaKeywords: e.target.value })}
                  placeholder="tienda,productos,gaming,online"
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="border-t pt-6">
                <h3 className="font-semibold mb-4">Herramientas de Seguimiento</h3>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Google Analytics 4 ID</label>
                  <input
                    type="text"
                    value={formData.googleAnalyticsId}
                    onChange={(e) => setFormData({ ...formData, googleAnalyticsId: e.target.value })}
                    placeholder="G-XXXXXXXXXX"
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium mb-1">Facebook Pixel ID</label>
                  <input
                    type="text"
                    value={formData.facebookPixelId}
                    onChange={(e) => setFormData({ ...formData, facebookPixelId: e.target.value })}
                    placeholder="123456789012345"
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium mb-1">Google Tag Manager ID</label>
                  <input
                    type="text"
                    value={formData.googleTagManagerId}
                    onChange={(e) => setFormData({ ...formData, googleTagManagerId: e.target.value })}
                    placeholder="GTM-XXXXXXX"
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB: Pagos */}
          {activeTab === 'payments' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-4">Configuración de Pagos</h2>
              
              <div>
                <label className="block text-sm font-medium mb-1">Nombre del Comercio</label>
                <input
                  type="text"
                  value={formData.merchantName}
                  onChange={(e) => setFormData({ ...formData, merchantName: e.target.value })}
                  placeholder="Tu Tienda S.A.S"
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <p className="text-xs text-gray-500 mt-1">Nombre que aparecerá en las pasarelas de pago</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Métodos de Pago Visibles (separados por comas)</label>
                <input
                  type="text"
                  value={formData.paymentMethodsLogos}
                  onChange={(e) => setFormData({ ...formData, paymentMethodsLogos: e.target.value })}
                  placeholder="visa,mastercard,amex,diners"
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <p className="text-xs text-gray-500 mt-1">Opciones: visa, mastercard, amex, diners</p>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-semibold mb-4">Activar/Desactivar Métodos</h3>
                
                <div className="space-y-3">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={formData.enableBoldPayments}
                      onChange={(e) => setFormData({ ...formData, enableBoldPayments: e.target.checked })}
                      className="w-5 h-5 text-primary"
                    />
                    <span>Activar Pagos Bold</span>
                  </label>

                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={formData.enableBancolombia}
                      onChange={(e) => setFormData({ ...formData, enableBancolombia: e.target.checked })}
                      className="w-5 h-5 text-primary"
                    />
                    <span>Activar Botón Bancolombia</span>
                  </label>

                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={formData.enableCreditCard}
                      onChange={(e) => setFormData({ ...formData, enableCreditCard: e.target.checked })}
                      className="w-5 h-5 text-primary"
                    />
                    <span>Activar Pago con Tarjeta</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* TAB: Envíos */}
          {activeTab === 'shipping' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-4">Envíos y Logística</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Moneda</label>
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="COP">COP - Peso Colombiano</option>
                    <option value="USD">USD - Dólar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="MXN">MXN - Peso Mexicano</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Símbolo de Moneda</label>
                  <input
                    type="text"
                    value={formData.currencySymbol}
                    onChange={(e) => setFormData({ ...formData, currencySymbol: e.target.value })}
                    placeholder="$"
                    maxLength={3}
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Mensaje de Envío</label>
                <input
                  type="text"
                  value={formData.shippingMessage}
                  onChange={(e) => setFormData({ ...formData, shippingMessage: e.target.value })}
                  placeholder="Envíos a todo Colombia"
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Tiempo Estimado de Entrega</label>
                <input
                  type="text"
                  value={formData.estimatedDeliveryDays}
                  onChange={(e) => setFormData({ ...formData, estimatedDeliveryDays: e.target.value })}
                  placeholder="3-5 días hábiles"
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Costo de Seguro de Envío</label>
                  <input
                    type="number"
                    value={formData.shippingInsuranceFee}
                    onChange={(e) => setFormData({ ...formData, shippingInsuranceFee: Number(e.target.value) })}
                    placeholder="15000"
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Envío Gratis desde (0 = desactivado)</label>
                  <input
                    type="number"
                    value={formData.freeShippingMinAmount}
                    onChange={(e) => setFormData({ ...formData, freeShippingMinAmount: Number(e.target.value) })}
                    placeholder="0"
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-semibold mb-4">Opciones de Tienda</h3>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Productos por Página</label>
                  <select
                    value={formData.maxProductsPerPage}
                    onChange={(e) => setFormData({ ...formData, maxProductsPerPage: Number(e.target.value) })}
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value={8}>8 productos</option>
                    <option value={12}>12 productos</option>
                    <option value={24}>24 productos</option>
                    <option value={48}>48 productos</option>
                  </select>
                </div>

                <div className="mt-4 space-y-3">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={formData.enableReviews}
                      onChange={(e) => setFormData({ ...formData, enableReviews: e.target.checked })}
                      className="w-5 h-5 text-primary"
                    />
                    <span>Mostrar Reseñas de Clientes</span>
                  </label>

                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={formData.enableWishlist}
                      onChange={(e) => setFormData({ ...formData, enableWishlist: e.target.checked })}
                      className="w-5 h-5 text-primary"
                    />
                    <span>Activar Lista de Deseos</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* TAB: Legal */}
          {activeTab === 'legal' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-4">Políticas y Legal</h2>
              
              <div>
                <label className="block text-sm font-medium mb-1">URL Términos y Condiciones</label>
                <input
                  type="text"
                  value={formData.termsAndConditionsUrl}
                  onChange={(e) => setFormData({ ...formData, termsAndConditionsUrl: e.target.value })}
                  placeholder="/terminos-condiciones"
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">URL Política de Privacidad</label>
                <input
                  type="text"
                  value={formData.privacyPolicyUrl}
                  onChange={(e) => setFormData({ ...formData, privacyPolicyUrl: e.target.value })}
                  placeholder="/politica-privacidad"
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">URL Política de Devoluciones/Envíos</label>
                <input
                  type="text"
                  value={formData.returnPolicyUrl}
                  onChange={(e) => setFormData({ ...formData, returnPolicyUrl: e.target.value })}
                  placeholder="/politica-envios"
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          )}

          {/* Botón Guardar (visible en todos los tabs) */}
          <div className="pt-6 border-t">
            <button
              type="submit"
              className="w-full bg-primary text-white py-4 rounded-lg font-semibold hover:bg-opacity-90 transition text-lg"
            >
              💾 Guardar Configuración
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
