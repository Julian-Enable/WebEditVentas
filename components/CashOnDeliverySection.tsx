export default function CashOnDeliverySection() {
  return (
    <section className="py-20 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 relative overflow-hidden">
      {/* Elementos decorativos */}
      <div className="absolute top-10 right-10 w-72 h-72 bg-green-200/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Badge */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full border border-green-200">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z"/>
                <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd"/>
              </svg>
              <span className="text-sm font-semibold">PAGO SEGURO</span>
            </div>
          </div>

          <h2 className="text-4xl md:text-5xl font-black text-center mb-4 text-gray-900">
            Paga cuando recibas tu pedido
          </h2>
          <p className="text-center text-gray-600 text-lg mb-16 max-w-2xl mx-auto">
            Compra con total confianza. Solo pagas cuando el producto esté en tus manos
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Beneficio 1 */}
            <div className="group bg-white p-8 rounded-3xl border-2 border-green-100 hover:border-green-300 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-black mb-3 text-gray-900">Sin Riesgos</h3>
              <p className="text-gray-600 leading-relaxed">
                No necesitas ingresar datos de tarjeta. Paga en efectivo cuando recibas tu pedido.
              </p>
            </div>

            {/* Beneficio 2 */}
            <div className="group bg-white p-8 rounded-3xl border-2 border-green-100 hover:border-green-300 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-black mb-3 text-gray-900">100% Verificado</h3>
              <p className="text-gray-600 leading-relaxed">
                Inspecciona tu producto antes de pagar. Si no estás satisfecho, no pagas.
              </p>
            </div>

            {/* Beneficio 3 */}
            <div className="group bg-white p-8 rounded-3xl border-2 border-green-100 hover:border-green-300 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-black mb-3 text-gray-900">Rápido y Fácil</h3>
              <p className="text-gray-600 leading-relaxed">
                Proceso de compra simple. Recibe tu pedido en 2-4 días hábiles en toda Colombia.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-3 bg-green-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-2xl hover:bg-green-700 transition-all duration-300 hover:scale-105">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>Compra Ahora - Paga al Recibir</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
