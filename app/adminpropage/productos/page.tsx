'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, Edit, Trash2, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

interface Product {
  id: number;
  name: string;
  price: number;
  discount: number;
  category: string;
  stock: number;
  isFeatured: boolean;
  imageUrl: string;
}

export default function AdminProductos() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    discount: '',
    imageUrl: '',
    category: '',
    stock: '',
    isFeatured: false,
  });

  useEffect(() => {
    verifyAuth();
    fetchProducts();
  }, []);

  const verifyAuth = async () => {
    const res = await fetch('/api/auth/verify');
    if (!res.ok) router.push('/adminpropage');
  };

  const fetchProducts = async () => {
    const res = await fetch('/api/products');
    const data = await res.json();
    setProducts(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = editingId ? `/api/products/${editingId}` : '/api/products';
    const method = editingId ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      toast.success(editingId ? 'Producto actualizado' : 'Producto creado');
      setShowForm(false);
      setEditingId(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        discount: '',
        imageUrl: '',
        category: '',
        stock: '',
        isFeatured: false,
      });
      fetchProducts();
    } else {
      toast.error('Error al guardar producto');
    }
  };

  const handleEdit = async (product: Product) => {
    setEditingId(product.id);
    
    // Obtener el producto completo con descripción
    const res = await fetch(`/api/products/${product.id}`);
    const fullProduct = await res.json();
    
    setFormData({
      name: fullProduct.name,
      description: fullProduct.description || '',
      price: fullProduct.price.toString(),
      discount: fullProduct.discount.toString(),
      imageUrl: fullProduct.imageUrl,
      category: fullProduct.category,
      stock: fullProduct.stock.toString(),
      isFeatured: fullProduct.isFeatured,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar este producto?')) return;

    const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
    if (res.ok) {
      toast.success('Producto eliminado');
      fetchProducts();
    } else {
      toast.error('Error al eliminar');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
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

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Gestión de Productos</h1>
          <button
            onClick={() => {
              setShowForm(true);
              setEditingId(null);
              setFormData({
                name: '',
                description: '',
                price: '',
                discount: '',
                imageUrl: '',
                category: '',
                stock: '',
                isFeatured: false,
              });
            }}
            className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-opacity-90"
          >
            <Plus className="w-5 h-5" />
            Nuevo Producto
          </button>
        </div>

        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow mb-8">
            <h2 className="text-2xl font-bold mb-4">
              {editingId ? 'Editar Producto' : 'Nuevo Producto'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Nombre del producto *"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                  type="number"
                  placeholder="Precio *"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                  className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                  type="number"
                  placeholder="Descuento (%) - Ej: 10 para 10%"
                  value={formData.discount}
                  onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                  min="0"
                  max="100"
                  className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                  type="text"
                  placeholder="Categoría *"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                  className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                  type="number"
                  placeholder="Stock *"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  required
                  className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                  type="url"
                  placeholder="URL de imagen *"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  required
                  className="col-span-2 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <textarea
                  placeholder="Descripción *"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={3}
                  className="col-span-2 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="w-4 h-4"
                />
                <span>Destacar en la página principal</span>
              </label>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-primary text-white px-6 py-2 rounded hover:bg-opacity-90"
                >
                  {editingId ? 'Actualizar' : 'Crear'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                  }}
                  className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Imagen</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoría</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Precio</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descuento</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Destacado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4">
                    <img src={product.imageUrl} alt={product.name} className="w-16 h-16 object-cover rounded" />
                  </td>
                  <td className="px-6 py-4 font-medium">{product.name}</td>
                  <td className="px-6 py-4">{product.category}</td>
                  <td className="px-6 py-4">
                    <div>
                      {product.discount > 0 && (
                        <span className="text-sm text-gray-500 line-through block">
                          {formatPrice(product.price)}
                        </span>
                      )}
                      <span className={product.discount > 0 ? 'text-green-600 font-bold' : ''}>
                        {formatPrice(product.price * (1 - product.discount / 100))}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {product.discount > 0 ? (
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-bold">
                        -{product.discount}%
                      </span>
                    ) : (
                      <span className="text-gray-400">Sin descuento</span>
                    )}
                  </td>
                  <td className="px-6 py-4">{product.stock}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs ${product.isFeatured ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {product.isFeatured ? 'Sí' : 'No'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
