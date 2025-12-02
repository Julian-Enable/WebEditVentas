'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function PageLoader() {
  const [loading, setLoading] = useState(true); // Iniciar en true para evitar flash
  const pathname = usePathname();

  useEffect(() => {
    setLoading(true);
    
    // Simular tiempo de carga realista (1.5-2 segundos)
    const randomDelay = Math.floor(Math.random() * 500) + 1500; // Entre 1500ms y 2000ms
    const timer = setTimeout(() => {
      setLoading(false);
    }, randomDelay);

    return () => clearTimeout(timer);
  }, [pathname]);

  if (!loading) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] bg-white flex items-center justify-center transition-opacity duration-300"
      style={{ opacity: loading ? 1 : 0 }}
    >
      <div className="text-center">
        {/* Spinner animado */}
        <div className="relative w-16 h-16 mx-auto mb-4">
          <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-pink-600 rounded-full animate-spin border-t-transparent"></div>
        </div>
        
        {/* Texto de carga */}
        <p className="text-gray-600 font-medium animate-pulse">Cargando...</p>
      </div>
    </div>
  );
}
