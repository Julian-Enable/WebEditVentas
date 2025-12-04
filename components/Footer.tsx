import Link from 'next/link';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

interface FooterProps {
  siteName: string;
  settings?: {
    brandDescription?: string;
    contactEmail?: string;
    contactPhone?: string;
    whatsappNumber?: string;
    address?: string;
    city?: string;
    country?: string;
    facebookUrl?: string;
    instagramUrl?: string;
    twitterUrl?: string;
    tiktokUrl?: string;
    youtubeUrl?: string;
    termsAndConditionsUrl?: string;
    privacyPolicyUrl?: string;
    returnPolicyUrl?: string;
  };
}

export default function Footer({ siteName, settings }: FooterProps) {
  const hasSocials = settings && (
    settings.facebookUrl || 
    settings.instagramUrl || 
    settings.twitterUrl || 
    settings.tiktokUrl || 
    settings.youtubeUrl
  );

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">{siteName}</h3>
            <p className="text-gray-400">{settings?.brandDescription || 'Tu tienda de confianza para productos de calidad.'}</p>
            
            {hasSocials && (
              <div className="mt-4 flex gap-3">
                {settings.facebookUrl && (
                  <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition">
                    <Facebook className="w-5 h-5" />
                  </a>
                )}
                {settings.instagramUrl && (
                  <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition">
                    <Instagram className="w-5 h-5" />
                  </a>
                )}
                {settings.twitterUrl && (
                  <a href={settings.twitterUrl} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition">
                    <Twitter className="w-5 h-5" />
                  </a>
                )}
                {settings.youtubeUrl && (
                  <a href={settings.youtubeUrl} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition">
                    <Youtube className="w-5 h-5" />
                  </a>
                )}
                {settings.tiktokUrl && (
                  <a href={settings.tiktokUrl} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                    </svg>
                  </a>
                )}
              </div>
            )}
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Enlaces</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-400 hover:text-white transition">Inicio</Link></li>
              <li><Link href="/productos" className="text-gray-400 hover:text-white transition">Productos</Link></li>
              <li><Link href="/#sobre-nosotros" className="text-gray-400 hover:text-white transition">Sobre Nosotros</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><Link href={settings?.privacyPolicyUrl || '/politica-privacidad'} className="text-gray-400 hover:text-white transition">Política de Privacidad</Link></li>
              <li><Link href={settings?.termsAndConditionsUrl || '/terminos-condiciones'} className="text-gray-400 hover:text-white transition">Términos y Condiciones</Link></li>
              <li><Link href={settings?.returnPolicyUrl || '/politica-envios'} className="text-gray-400 hover:text-white transition">Política de Envíos</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Contacto</h4>
            <ul className="space-y-2 text-gray-400">
              {settings?.contactEmail && (
                <li>Email: {settings.contactEmail}</li>
              )}
              {settings?.contactPhone && (
                <li>Teléfono: {settings.contactPhone}</li>
              )}
              {settings?.whatsappNumber && (
                <li>
                  <a 
                    href={`https://wa.me/${settings.whatsappNumber}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-white transition"
                  >
                    WhatsApp: {settings.contactPhone || '+' + settings.whatsappNumber}
                  </a>
                </li>
              )}
              {settings?.address && settings?.city && (
                <li>{settings.address}, {settings.city}</li>
              )}
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} {siteName}. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
