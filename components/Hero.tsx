interface HeroProps {
  heroImage: string;
  heroTitle: string;
  heroSubtitle: string;
  logoUrl: string;
}

export default function Hero({ heroImage, heroTitle, heroSubtitle, logoUrl }: HeroProps) {
  return (
    <section 
      className="relative h-[600px] bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      
      <div className="relative z-10 text-center text-white px-4">
        <img 
          src={logoUrl} 
          alt="Logo" 
          className="mx-auto mb-6 h-20 object-contain opacity-80"
        />
        <h1 className="text-5xl md:text-7xl font-bold mb-4">{heroTitle}</h1>
        <p className="text-xl md:text-2xl mb-8">{heroSubtitle}</p>
        <a 
          href="#productos-destacados"
          className="bg-primary hover:bg-opacity-90 text-white font-bold py-4 px-8 rounded-lg text-lg transition inline-block"
        >
          Ver Productos
        </a>
      </div>
    </section>
  );
}
