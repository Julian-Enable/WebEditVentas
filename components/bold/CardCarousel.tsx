'use client';

export default function CardCarousel() {
  const cards = [
    { src: '/logos/logos_pagina_bold/mastercard.svg', alt: 'Mastercard', width: 45, height: 35 },
    { src: '/logos/logos_pagina_bold/american-express.svg', alt: 'American Express', width: 45, height: 35 },
    { src: '/logos/logos_pagina_bold/diners-club.png', alt: 'Diners Club', width: 45, height: 35 },
    { src: '/logos/logos_pagina_bold/discover.svg', alt: 'Discover', width: 45, height: 35 },
    { src: '/logos/logos_pagina_bold/codensa.png', alt: 'Codensa', width: 45, height: 35 },
    { src: '/logos/logos_pagina_bold/visa.svg', alt: 'Visa', width: 45, height: 35 },
  ];

  // Duplicamos el array para crear un loop infinito sin cortes
  const duplicatedCards = [...cards, ...cards, ...cards];

  return (
    <div className="relative overflow-hidden" style={{ width: '280px', height: '32px' }}>
      <div className="flex animate-scroll-cards gap-2 items-center h-full">
        {duplicatedCards.map((card, index) => (
          <div
            key={`${card.alt}-${index}`}
            className="flex-shrink-0 flex items-center justify-center"
            style={{ width: '40px', height: '28px' }}
          >
            <img
              src={card.src}
              alt={card.alt}
              className="object-contain max-w-full max-h-full"
              style={{ maxWidth: '38px', maxHeight: '26px' }}
            />
          </div>
        ))}
      </div>
      
      {/* Gradiente para ocultar los bordes */}
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[rgb(247,248,251)] to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[rgb(247,248,251)] to-transparent pointer-events-none" />
    </div>
  );
}
