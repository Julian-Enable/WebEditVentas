'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminConfiguracion() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    siteName: '',
    primaryColor: '',
    secondaryColor: '',
    logoUrl: '',
    heroImage: '',
    heroTitle: '',
    heroSubtitle: '',
    aboutUsText: '',
    paymentMethodsLogos: '',
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

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Configuración del Sitio</h1>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1">Nombre de la Tienda</label>
            <input
              type="text"
              value={formData.siteName}
              onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Color Primario</label>
              <input
                type="color"
                value={formData.primaryColor}
                onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                className="w-full h-10 border rounded cursor-pointer"
              />
              <p className="text-xs text-gray-500 mt-1">{formData.primaryColor}</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Color Secundario</label>
              <input
                type="color"
                value={formData.secondaryColor}
                onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                className="w-full h-10 border rounded cursor-pointer"
              />
              <p className="text-xs text-gray-500 mt-1">{formData.secondaryColor}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">URL del Logo</label>
            <input
              type="url"
              value={formData.logoUrl}
              onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">URL de Imagen Hero</label>
            <input
              type="url"
              value={formData.heroImage}
              onChange={(e) => setFormData({ ...formData, heroImage: e.target.value })}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Título Hero</label>
            <input
              type="text"
              value={formData.heroTitle}
              onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Subtítulo Hero</label>
            <input
              type="text"
              value={formData.heroSubtitle}
              onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Texto &quot;Sobre Nosotros&quot;</label>
            <textarea
              value={formData.aboutUsText}
              onChange={(e) => setFormData({ ...formData, aboutUsText: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Métodos de Pago (separados por comas)
            </label>
            <input
              type="text"
              value={formData.paymentMethodsLogos}
              onChange={(e) => setFormData({ ...formData, paymentMethodsLogos: e.target.value })}
              placeholder="visa,mastercard,amex,diners"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="text-xs text-gray-500 mt-1">
              Opciones: visa, mastercard, amex, diners
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-opacity-90"
          >
            Guardar Configuración
          </button>
        </form>
      </div>
    </div>
  );
}
