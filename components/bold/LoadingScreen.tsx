'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

interface LoadingScreenProps {
  message?: string;
}

export default function LoadingScreen({ message = '¡Estás pagando con Bold!' }: LoadingScreenProps) {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#FF1744] via-[#D81B60] to-[#8E24AA] flex items-center justify-center z-50">
      <div className="text-center">
        {/* Shopping Cart Animation */}
        <div className="mb-8 animate-bounce-slow">
          <Image
            src="/logos/bold/shopping_cart.png"
            alt="Shopping Cart"
            width={200}
            height={200}
            className="mx-auto drop-shadow-2xl"
          />
        </div>

        {/* Bold Logo */}
        <div className="mb-6">
          <Image
            src="/logos/bold/bold-logo-white.svg"
            alt="Bold"
            width={120}
            height={40}
            className="mx-auto"
          />
        </div>

        {/* Loading Message */}
        <div className="space-y-2">
          <h2 className="text-white text-2xl font-bold">
            {message}
          </h2>
          <div className="flex justify-center items-center space-x-1">
            <div className="w-3 h-3 bg-white rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
            <div className="w-3 h-3 bg-white rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
            <div className="w-3 h-3 bg-white rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
          </div>
          <p className="text-white/80 text-sm mt-4">
            Procesando tu pago{dots}
          </p>
        </div>

        {/* Security Note */}
        <div className="mt-8 flex items-center justify-center space-x-2 text-white/70 text-xs">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          <span>Conexión segura cifrada</span>
        </div>
      </div>
    </div>
  );
}
