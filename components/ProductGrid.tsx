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
    <div className="group bg-white rounded-3xl overflow-hidden border-2 border-gray-100 hover:border-purple-200 transition-all duration-300 hover:shadow-xl">
      <div className="relative overflow-hidden bg-gray-50">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-72 object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.discount > 0 && (
          <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg">
            -{product.discount}%
          </div>
        )}
        {product.stock < 10 && product.stock > 0 && (
          <div className="absolute top-4 left-4 bg-orange-500 text-white px-3 py-1.5 rounded-full text-xs font-bold">
            Solo {product.stock} disponibles
          </div>
        )}
      </div>
      <div className="p-6">
        <span className="inline-block text-xs font-bold text-purple-600 uppercase tracking-wider bg-purple-50 px-3 py-1 rounded-lg mb-3">{product.category}</span>
        <h3 className="text-xl font-black mb-2 text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-1">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">{product.description}</p>
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
          <div>
            {product.discount > 0 && (
              <span className="text-sm text-gray-400 line-through block mb-1">
                {formatPrice(product.price)}
              </span>
            )}
            <span className="text-2xl font-black text-gray-900">
              {formatPrice(product.price * (1 - product.discount / 100))}
            </span>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={isAdding || product.stock === 0}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform hover:scale-105 flex items-center gap-2 text-sm"
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
    <section className="py-20 bg-white" id="productos-destacados">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Badge */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full border border-blue-200">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>
              </svg>
              <span className="text-sm font-semibold">PRODUCTOS DESTACADOS</span>
            </div>
          </div>
          
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black mb-4 text-gray-900">
              {title}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Descubre nuestra selección de productos gaming de última generación</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
