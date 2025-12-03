'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useState } from 'react';

interface NavbarProps {
  siteName: string;
  logoUrl: string;
}

export default function Navbar({ siteName, logoUrl }: NavbarProps) {
  const { items } = useCart();
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    setMobileMenuOpen(false); // Cerrar menú móvil
    // Si no estamos en la página principal, navegar primero
    if (window.location.pathname !== '/') {
      router.push('/#' + sectionId);
      // Esperar un poco para que la página cargue
      setTimeout(() => {
        performScroll(sectionId);
      }, 100);
    } else {
      performScroll(sectionId);
    }
  };

  const performScroll = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const navbarHeight = 80; // Altura aproximada del navbar
      const offset = 100; // Espacio adicional arriba del título
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - navbarHeight - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-gray-100">
      <div className="container mx-auto px-4 py-5">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group" onClick={() => setMobileMenuOpen(false)}>
            <img src={logoUrl} alt={siteName} className="h-11 object-contain transition-transform group-hover:scale-105" />
            <span className="text-2xl font-extrabold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">{siteName}</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-1">
            <Link href="/" className="text-gray-700 hover:text-primary transition-all px-4 py-2 rounded-lg hover:bg-primary/5 font-medium">
              Inicio
            </Link>
            <Link href="/productos" className="text-gray-700 hover:text-primary transition-all px-4 py-2 rounded-lg hover:bg-primary/5 font-medium">
              Productos
            </Link>
            <button 
              onClick={() => scrollToSection('sobre-nosotros')}
              className="text-gray-700 hover:text-primary transition-all px-4 py-2 rounded-lg hover:bg-primary/5 font-medium"
            >
              Nosotros
            </button>
            <button 
              onClick={() => scrollToSection('metodos-pago')}
              className="text-gray-700 hover:text-primary transition-all px-4 py-2 rounded-lg hover:bg-primary/5 font-medium"
            >
              Pago
            </button>
            <button 
              onClick={() => scrollToSection('resenas')}
              className="text-gray-700 hover:text-primary transition-all px-4 py-2 rounded-lg hover:bg-primary/5 font-medium"
            >
              Reseñas
            </button>
          </div>

          {/* Mobile & Desktop Cart + Menu Button */}
          <div className="flex items-center gap-2">
            <Link href="/carrito" className="relative group" onClick={() => setMobileMenuOpen(false)}>
              <div className="p-2 rounded-full hover:bg-primary/10 transition-colors">
                <ShoppingCart className="w-6 h-6 text-gray-700 group-hover:text-primary transition" />
              </div>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center shadow-lg animate-pulse">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-primary/10 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-gray-200 animate-in slide-in-from-top duration-200">
            <div className="flex flex-col space-y-2">
              <Link 
                href="/" 
                className="text-gray-700 hover:text-primary hover:bg-primary/5 transition-all px-4 py-3 rounded-lg font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Inicio
              </Link>
              <Link 
                href="/productos" 
                className="text-gray-700 hover:text-primary hover:bg-primary/5 transition-all px-4 py-3 rounded-lg font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Productos
              </Link>
              <button 
                onClick={() => scrollToSection('sobre-nosotros')}
                className="text-left text-gray-700 hover:text-primary hover:bg-primary/5 transition-all px-4 py-3 rounded-lg font-medium"
              >
                Nosotros
              </button>
              <button 
                onClick={() => scrollToSection('metodos-pago')}
                className="text-left text-gray-700 hover:text-primary hover:bg-primary/5 transition-all px-4 py-3 rounded-lg font-medium"
              >
                Métodos de Pago
              </button>
              <button 
                onClick={() => scrollToSection('resenas')}
                className="text-left text-gray-700 hover:text-primary hover:bg-primary/5 transition-all px-4 py-3 rounded-lg font-medium"
              >
                Reseñas
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
