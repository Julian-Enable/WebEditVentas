'use client';

import Image from 'next/image';

export default function SecurityBadges() {
  const badges = [
    { src: '/logos/bold/security/pci.svg', alt: 'PCI DSS Certified', width: 50, height: 40 },
    { src: '/logos/bold/security/hacker-proof.svg', alt: 'Hacker Proof', width: 80, height: 40 },
    { src: '/logos/bold/security/service-provider-badge.svg', alt: 'Service Provider', width: 50, height: 40 },
    { src: '/logos/bold/security/visa.svg', alt: 'Visa Verified', width: 45, height: 40 },
    { src: '/logos/bold/security/mastercard.svg', alt: 'Mastercard SecureCode', width: 45, height: 40 },
    { src: '/logos/bold/security/recaptcha.svg', alt: 'reCAPTCHA', width: 60, height: 40 },
  ];

  return (
    <div className="mt-8 pt-6 border-t border-gray-200">
      <div className="flex items-center justify-center mb-4">
        <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        <p className="text-sm text-gray-600 font-medium">Paga de forma segura</p>
      </div>
      
      <div className="flex flex-wrap items-center justify-center gap-4 opacity-70">
        {badges.map((badge) => (
          <div key={badge.alt} className="flex items-center justify-center">
            <Image
              src={badge.src}
              alt={badge.alt}
              width={badge.width}
              height={badge.height}
              className="object-contain grayscale hover:grayscale-0 transition-all"
            />
          </div>
        ))}
      </div>
      
      <p className="text-xs text-gray-500 text-center mt-4 max-w-md mx-auto">
        Tu información está protegida con los más altos estándares de seguridad de la industria
      </p>
    </div>
  );
}
