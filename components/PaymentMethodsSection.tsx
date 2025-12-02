interface PaymentMethodsSectionProps {
  paymentMethods: string;
}

const paymentLogos: Record<string, string> = {
  visa: 'https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg',
  mastercard: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg',
  amex: 'https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo.svg',
  diners: 'https://upload.wikimedia.org/wikipedia/commons/6/65/Diners_Club_Logo3.svg',
  efectivo: 'https://upload.wikimedia.org/wikipedia/commons/8/8d/Cash_payment_icon.svg',
};

export default function PaymentMethodsSection({ paymentMethods }: PaymentMethodsSectionProps) {
  const methods = paymentMethods.split(',').map(m => m.trim().toLowerCase());

  return (
    <section className="py-20 bg-white" id="metodos-pago">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Badge */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full border border-green-200">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
              </svg>
              <span className="text-sm font-semibold">PAGOS SEGUROS</span>
            </div>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-black text-center mb-4 text-gray-900">
            Métodos de Pago
          </h2>
          <p className="text-center text-gray-600 text-lg mb-12">Aceptamos las siguientes formas de pago</p>
          
          {/* Tarjetas de logos */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="group p-8 bg-gray-50 rounded-2xl border-2 border-gray-100 hover:border-purple-200 hover:bg-white transition-all duration-300 flex items-center justify-center">
              <img src="/logos/tarjetas/VISA.png" alt="Visa" className="h-8 object-contain" />
            </div>
            <div className="group p-8 bg-gray-50 rounded-2xl border-2 border-gray-100 hover:border-purple-200 hover:bg-white transition-all duration-300 flex items-center justify-center">
              <img src="/logos/tarjetas/mastercard.png" alt="Mastercard" className="h-8 object-contain" />
            </div>
            <div className="group p-8 bg-gray-50 rounded-2xl border-2 border-gray-100 hover:border-purple-200 hover:bg-white transition-all duration-300 flex items-center justify-center">
              <img src="/logos/tarjetas/american expres.png" alt="American Express" className="h-8 object-contain" />
            </div>
            <div className="group p-8 bg-gray-50 rounded-2xl border-2 border-gray-100 hover:border-purple-200 hover:bg-white transition-all duration-300 flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400 group-hover:text-green-600 transition-colors" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z"/>
                <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
