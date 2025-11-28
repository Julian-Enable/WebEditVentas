'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Package, ShoppingCart, Settings, Star, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalReviews: 0,
  });

  useEffect(() => {
    verifyAuth();
    fetchStats();
  }, []);

  const verifyAuth = async () => {
    const res = await fetch('/api/auth/verify');
    if (!res.ok) {
      router.push('/adminpropage');
    }
    setLoading(false);
  };

  const fetchStats = async () => {
    try {
      const [productsRes, ordersRes, reviewsRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/orders'),
        fetch('/api/reviews'),
      ]);

      const products = await productsRes.json();
      const orders = await ordersRes.json();
      const reviews = await reviewsRes.json();

      setStats({
        totalProducts: products.length,
        totalOrders: orders.length,
        totalReviews: reviews.length,
      });
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    toast.success('Sesión cerrada');
    router.push('/adminpropage');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Panel de Administración</h1>
          <div className="flex items-center gap-4">
            <a href="/" target="_blank" className="text-gray-600 hover:text-primary">
              Ver Tienda
            </a>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-red-600 hover:text-red-700"
            >
              <LogOut className="w-4 h-4" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Productos</p>
                <p className="text-3xl font-bold">{stats.totalProducts}</p>
              </div>
              <Package className="w-12 h-12 text-blue-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Pedidos</p>
                <p className="text-3xl font-bold">{stats.totalOrders}</p>
              </div>
              <ShoppingCart className="w-12 h-12 text-green-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Reseñas</p>
                <p className="text-3xl font-bold">{stats.totalReviews}</p>
              </div>
              <Star className="w-12 h-12 text-yellow-500" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/adminpropage/productos"
            className="bg-white p-8 rounded-lg shadow hover:shadow-lg transition text-center"
          >
            <Package className="w-16 h-16 text-blue-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Gestión de Productos</h2>
            <p className="text-gray-600">Crear, editar y eliminar productos</p>
          </Link>

          <Link
            href="/adminpropage/pedidos"
            className="bg-white p-8 rounded-lg shadow hover:shadow-lg transition text-center"
          >
            <ShoppingCart className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Gestión de Pedidos</h2>
            <p className="text-gray-600">Ver y administrar pedidos</p>
          </Link>

          <Link
            href="/adminpropage/resenas"
            className="bg-white p-8 rounded-lg shadow hover:shadow-lg transition text-center"
          >
            <Star className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Gestión de Reseñas</h2>
            <p className="text-gray-600">Aprobar y gestionar reseñas</p>
          </Link>

          <Link
            href="/adminpropage/configuracion"
            className="bg-white p-8 rounded-lg shadow hover:shadow-lg transition text-center"
          >
            <Settings className="w-16 h-16 text-purple-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Configuración del Sitio</h2>
            <p className="text-gray-600">Personalizar la tienda</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
