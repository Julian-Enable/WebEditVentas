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
    const finalPrice = product.price * (1 - product.discount / 100);
    addItem({
      productId: product.id,
      name: product.name,
      price: finalPrice,
      originalPrice: product.discount > 0 ? product.price : undefined,
      discount: product.discount > 0 ? product.discount : undefined,
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
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group">
      <div className="relative overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-72 object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        {product.discount > 0 && (
          <div className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-pink-600 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg animate-pulse">
            -{product.discount}%
          </div>
        )}
        {product.stock < 10 && product.stock > 0 && (
          <div className="absolute top-3 left-3 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
            ¡Últimas {product.stock}!
          </div>
        )}
      </div>
      <div className="p-5">
        <span className="text-xs font-semibold text-primary uppercase tracking-wider bg-primary/10 px-3 py-1 rounded-full">{product.category}</span>
        <h3 className="text-lg font-bold mt-3 mb-2 text-gray-800 group-hover:text-primary transition-colors">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">{product.description}</p>
        <div className="flex items-end justify-between mt-4">
          <div>
            {product.discount > 0 && (
              <span className="text-sm text-gray-400 line-through block mb-1">
                {formatPrice(product.price)}
              </span>
            )}
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              {formatPrice(product.price * (1 - product.discount / 100))}
            </span>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={isAdding || product.stock === 0}
            className="bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-primary text-white px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed shadow-lg hover:shadow-primary/50 transform hover:scale-105 flex items-center gap-2 text-sm"
          >
            {product.stock === 0 ? (
              'Agotado'
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Agregar
              </>
            )}
          </button>
        </div>
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
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white" id="productos-destacados">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">{title}</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Descubre nuestra selección de productos gaming de última generación</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
