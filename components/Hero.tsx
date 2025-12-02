interface HeroProps {
  heroImage: string;
  heroTitle: string;
  heroSubtitle: string;
  logoUrl: string;
}

export default function Hero({ heroImage, heroTitle, heroSubtitle, logoUrl }: HeroProps) {
  return (
    <section 
      className="relative h-[650px] bg-cover bg-center flex items-center justify-center overflow-hidden"
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      {/* Overlay más sutil */}
      <div className="absolute inset-0 bg-black/40"></div>
      
      {/* Elementos decorativos */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto">
        <div className="inline-block mb-4 px-6 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
          <span className="text-sm font-medium tracking-wider">BIENVENIDO A {heroTitle.split(' ')[0].toUpperCase()}</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight leading-tight">
          {heroTitle}
        </h1>
        <p className="text-xl md:text-2xl mb-8 font-normal text-white/90 max-w-2xl mx-auto">
          {heroSubtitle}
        </p>
        <a 
          href="#productos-destacados"
          className="group relative inline-flex items-center gap-2 bg-white text-gray-900 font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 hover:shadow-2xl hover:scale-105 transform overflow-hidden"
        >
          <span className="relative z-10">Explorar Productos</span>
          <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </a>
      </div>
    </section>
  );
}
