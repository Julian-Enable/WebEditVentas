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
      
      <div className="relative z-10 text-center text-white px-4 max-w-6xl mx-auto">
        {/* Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20 shadow-lg">
            <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
            <span className="text-sm font-semibold tracking-wide">GRAN BLACK FRIDAY</span>
          </div>
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-500/90 backdrop-blur-md rounded-full border border-green-400/30 shadow-lg animate-pulse">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="text-sm font-semibold tracking-wide text-white">PAGO CONTRA ENTREGA</span>
          </div>
        </div>
        
        {/* Título principal */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 tracking-tight leading-none text-white">
          {heroTitle}
        </h1>
        
        {/* Subtítulo */}
        <p className="text-xl md:text-2xl mb-10 font-medium text-white/95 max-w-3xl mx-auto leading-relaxed">
          {heroSubtitle}
        </p>
        
        {/* Botón CTA mejorado */}
        <a 
          href="#productos-destacados"
          className="group relative inline-flex items-center gap-3 bg-white text-gray-900 font-bold py-4 px-10 rounded-2xl text-lg transition-all duration-300 hover:shadow-2xl hover:shadow-white/20 hover:scale-105 transform"
        >
          <span className="relative z-10">Explorar Productos</span>
          <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-100 to-blue-100 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
        </a>
      </div>
    </section>
  );
}
