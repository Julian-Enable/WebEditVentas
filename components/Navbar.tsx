'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/hooks/useCart';

interface NavbarProps {
  siteName: string;
  logoUrl: string;
}

export default function Navbar({ siteName, logoUrl }: NavbarProps) {
  const { items } = useCart();
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <img src={logoUrl} alt={siteName} className="h-10 object-contain" />
            <span className="text-xl font-bold text-gray-800">{siteName}</span>
          </Link>

          <div className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-700 hover:text-primary transition">
              Inicio
            </Link>
            <Link href="/productos" className="text-gray-700 hover:text-primary transition">
              Productos
            </Link>
            <Link href="/#sobre-nosotros" className="text-gray-700 hover:text-primary transition">
              Sobre Nosotros
            </Link>
            <Link href="/#metodos-pago" className="text-gray-700 hover:text-primary transition">
              Métodos de Pago
            </Link>
            <Link href="/#resenas" className="text-gray-700 hover:text-primary transition">
              Reseñas
            </Link>
          </div>

          <Link href="/carrito" className="relative">
            <ShoppingCart className="w-6 h-6 text-gray-700 hover:text-primary transition" />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}
