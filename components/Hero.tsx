interface HeroProps {
  heroImage: string;
  heroTitle: string;
  heroSubtitle: string;
  logoUrl: string;
}

export default function Hero({ heroImage, heroTitle, heroSubtitle, logoUrl }: HeroProps) {
  return (
    <section 
      className="relative h-[700px] bg-cover bg-center flex items-center justify-center overflow-hidden"
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-transparent"></div>
      
      <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto">
        <h1 className="text-6xl md:text-8xl font-extrabold mb-6 tracking-tight animate-fade-in-up">
          {heroTitle}
        </h1>
        <p className="text-2xl md:text-3xl mb-10 font-light tracking-wide opacity-90">
          {heroSubtitle}
        </p>
        <a 
          href="#productos-destacados"
          className="bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-primary text-white font-bold py-5 px-10 rounded-full text-lg transition-all duration-300 inline-block shadow-2xl hover:shadow-primary/50 hover:scale-105 transform"
        >
          Explorar Productos
        </a>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  );
}
