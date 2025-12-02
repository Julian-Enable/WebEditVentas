interface AboutSectionProps {
  aboutUsText: string;
}

export default function AboutSection({ aboutUsText }: AboutSectionProps) {
  return (
    <section className="py-20 bg-gray-50" id="sobre-nosotros">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Badge decorativo */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full border border-purple-200">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
              </svg>
              <span className="text-sm font-semibold">NUESTRA HISTORIA</span>
            </div>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-black text-center mb-6 text-gray-900">
            Sobre Nosotros
          </h2>
          
          <div className="relative">
            {/* Línea decorativa */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-500 rounded-full"></div>
            
            <div className="pl-8">
              <p className="text-xl text-gray-700 leading-relaxed mb-6">{aboutUsText}</p>
              
              {/* Stats decorativos */}
              <div className="grid grid-cols-3 gap-4 mt-8">
                <div className="text-center p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                  <div className="text-3xl font-black text-purple-600">100%</div>
                  <div className="text-sm text-gray-600 mt-1">Calidad</div>
                </div>
                <div className="text-center p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                  <div className="text-3xl font-black text-blue-600">24/7</div>
                  <div className="text-sm text-gray-600 mt-1">Atención</div>
                </div>
                <div className="text-center p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                  <div className="text-3xl font-black text-green-600">+1000</div>
                  <div className="text-sm text-gray-600 mt-1">Clientes</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
