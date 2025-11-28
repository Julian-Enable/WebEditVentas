'use client';

import { useState } from 'react';
import { useCart } from '@/hooks/useCart';
import toast from 'react-hot-toast';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  discount: number;
  imageUrl: string;
  category: string;
  stock: number;
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    setIsAdding(true);
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      quantity: 1,
    });
    toast.success('Producto agregado al carrito');
    setIsAdding(false);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition">
      <div className="relative">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-64 object-cover"
        />
        {product.discount > 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full font-bold text-sm">
            -{product.discount}%
          </div>
        )}
      </div>
      <div className="p-4">
        <span className="text-xs text-gray-500 uppercase">{product.category}</span>
        <h3 className="text-lg font-semibold mt-1 mb-2">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between">
          <div>
            {product.discount > 0 && (
              <span className="text-sm text-gray-500 line-through block">
                {formatPrice(product.price)}
              </span>
            )}
            <span className="text-2xl font-bold text-primary">
              {formatPrice(product.price * (1 - product.discount / 100))}
            </span>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={isAdding || product.stock === 0}
            className="bg-primary hover:bg-opacity-90 text-white px-4 py-2 rounded-lg transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {product.stock === 0 ? 'Agotado' : 'Agregar'}
          </button>
        </div>
        {product.stock > 0 && product.stock < 10 && (
          <p className="text-xs text-orange-500 mt-2">¡Solo quedan {product.stock} unidades!</p>
        )}
      </div>
    </div>
  );
}

interface ProductGridProps {
  products: Product[];
  title?: string;
}

export default function ProductGrid({ products, title = 'Productos' }: ProductGridProps) {
  return (
    <section className="py-16 bg-gray-50" id="productos-destacados">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
