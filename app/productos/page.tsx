'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductGrid from '@/components/ProductGrid';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  stock: number;
}

interface SiteSettings {
  siteName: string;
  logoUrl: string;
}

export default function ProductosPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
    fetchProducts();
  }, [search, category]);

  const fetchSettings = async () => {
    const res = await fetch('/api/settings');
    const data = await res.json();
    setSettings(data);
  };

  const fetchProducts = async () => {
    let url = '/api/products?';
    if (search) url += `search=${encodeURIComponent(search)}&`;
    if (category) url += `category=${encodeURIComponent(category)}&`;

    const res = await fetch(url);
    const data = await res.json();
    setProducts(data);
    setLoading(false);
  };

  const categories = Array.from(new Set(products.map(p => p.category)));

  if (!settings) return <div>Cargando...</div>;

  return (
    <main>
      <Navbar siteName={settings.siteName} logoUrl={settings.logoUrl} />
      
      {/* Header Hero */}
      <div className="bg-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full border border-white/30 mb-4">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>
            </svg>
            <span className="text-sm font-semibold">NUESTRA TIENDA</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-3">
            Catálogo Completo
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
            Encuentra el producto perfecto para tu setup gaming
          </p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12">
        {/* Filtros */}
        <div className="mb-12 max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl border-2 border-gray-100 p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                />
              </div>
              
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="px-6 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-semibold bg-white cursor-pointer hover:border-purple-300 transition-all"
              >
                <option value="">Todas las categorías</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
          </select>
            </div>
          </div>
          
          {/* Resultados */}
          {!loading && products.length > 0 && (
            <div className="mt-6 text-center">
              <p className="text-gray-600 text-lg">
                <span className="font-bold text-primary">{products.length}</span> productos encontrados
              </p>
            </div>
          )}
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-primary"></div>
            <p className="mt-4 text-gray-600 text-lg">Cargando productos...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-lg max-w-md mx-auto">
            <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-600 text-xl">No se encontraron productos</p>
            <p className="text-gray-400 mt-2">Intenta con otros términos de búsqueda</p>
          </div>
        ) : (
          <ProductGrid products={products} title="" />
        )}
      </div>

      <Footer siteName={settings.siteName} />
    </main>
  );
}
