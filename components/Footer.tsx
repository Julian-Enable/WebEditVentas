import Link from 'next/link';

interface FooterProps {
  siteName: string;
}

export default function Footer({ siteName }: FooterProps) {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">{siteName}</h3>
            <p className="text-gray-400">Tu tienda de confianza para productos de calidad.</p>
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
              <li><Link href="/politica-privacidad" className="text-gray-400 hover:text-white transition">Política de Privacidad</Link></li>
              <li><Link href="/terminos-condiciones" className="text-gray-400 hover:text-white transition">Términos y Condiciones</Link></li>
              <li><Link href="/politica-envios" className="text-gray-400 hover:text-white transition">Política de Envíos</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Contacto</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Email: pedidos@casaplay.shop</li>
              <li>Teléfono: +57 318 205 5412</li>
              <li>WhatsApp: +57 318 205 5412</li>
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
