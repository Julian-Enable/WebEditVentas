'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, Trash2, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminResenas() {
  const router = useRouter();
  const [reviews, setReviews] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    rating: '5',
    comment: '',
    isApproved: false,
  });

  useEffect(() => {
    verifyAuth();
    fetchReviews();
  }, []);

  const verifyAuth = async () => {
    const res = await fetch('/api/auth/verify');
    if (!res.ok) router.push('/adminpropage');
  };

  const fetchReviews = async () => {
    const res = await fetch('/api/reviews');
    const data = await res.json();
    setReviews(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      toast.success('Reseña creada');
      setShowForm(false);
      setFormData({ customerName: '', rating: '5', comment: '', isApproved: false });
      fetchReviews();
    }
  };

  const toggleApproval = async (id: number, currentStatus: boolean) => {
    await fetch(`/api/reviews/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isApproved: !currentStatus }),
    });
    fetchReviews();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar esta reseña?')) return;
    await fetch(`/api/reviews/${id}`, { method: 'DELETE' });
    toast.success('Reseña eliminada');
    fetchReviews();
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
          <h1 className="text-4xl font-bold">Gestión de Reseñas</h1>
          <button
            onClick={() => setShowForm(true)}
            className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-opacity-90"
          >
            <Plus className="w-5 h-5" />
            Nueva Reseña
          </button>
        </div>

        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow mb-8">
            <h2 className="text-2xl font-bold mb-4">Nueva Reseña</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Nombre del cliente *"
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                required
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <select
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="5">5 estrellas</option>
                <option value="4">4 estrellas</option>
                <option value="3">3 estrellas</option>
                <option value="2">2 estrellas</option>
                <option value="1">1 estrella</option>
              </select>
              <textarea
                placeholder="Comentario *"
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                required
                rows={4}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isApproved}
                  onChange={(e) => setFormData({ ...formData, isApproved: e.target.checked })}
                  className="w-4 h-4"
                />
                <span>Aprobar automáticamente</span>
              </label>
              <div className="flex gap-4">
                <button type="submit" className="bg-primary text-white px-6 py-2 rounded hover:bg-opacity-90">
                  Crear
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg">{review.customerName}</h3>
                  <p className="text-yellow-500">{'⭐'.repeat(review.rating)}</p>
                  <p className="text-gray-700 mt-2">{review.comment}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {new Date(review.createdAt).toLocaleDateString('es-CO')}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleApproval(review.id, review.isApproved)}
                    className={`p-2 rounded ${review.isApproved ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}
                  >
                    {review.isApproved ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={() => handleDelete(review.id)}
                    className="p-2 rounded bg-red-100 text-red-700"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
