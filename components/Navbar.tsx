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
    <nav className="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-gray-100">
      <div className="container mx-auto px-4 py-5">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group">
            <img src={logoUrl} alt={siteName} className="h-11 object-contain transition-transform group-hover:scale-105" />
            <span className="text-2xl font-extrabold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">{siteName}</span>
          </Link>

          <div className="hidden md:flex space-x-1">
            <Link href="/" className="text-gray-700 hover:text-primary transition-all px-4 py-2 rounded-lg hover:bg-primary/5 font-medium">
              Inicio
            </Link>
            <Link href="/productos" className="text-gray-700 hover:text-primary transition-all px-4 py-2 rounded-lg hover:bg-primary/5 font-medium">
              Productos
            </Link>
            <Link href="/#sobre-nosotros" className="text-gray-700 hover:text-primary transition-all px-4 py-2 rounded-lg hover:bg-primary/5 font-medium">
              Nosotros
            </Link>
            <Link href="/#metodos-pago" className="text-gray-700 hover:text-primary transition-all px-4 py-2 rounded-lg hover:bg-primary/5 font-medium">
              Pago
            </Link>
            <Link href="/#resenas" className="text-gray-700 hover:text-primary transition-all px-4 py-2 rounded-lg hover:bg-primary/5 font-medium">
              Reseñas
            </Link>
          </div>

          <Link href="/carrito" className="relative group">
            <div className="p-2 rounded-full hover:bg-primary/10 transition-colors">
              <ShoppingCart className="w-6 h-6 text-gray-700 group-hover:text-primary transition" />
            </div>
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center shadow-lg animate-pulse">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}
