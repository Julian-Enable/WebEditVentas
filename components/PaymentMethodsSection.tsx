interface PaymentMethodsSectionProps {
  paymentMethods: string;
}

const paymentLogos: Record<string, string> = {
  visa: 'https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg',
  mastercard: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg',
  amex: 'https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo.svg',
  diners: 'https://upload.wikimedia.org/wikipedia/commons/6/65/Diners_Club_Logo3.svg',
};

export default function PaymentMethodsSection({ paymentMethods }: PaymentMethodsSectionProps) {
  const methods = paymentMethods.split(',').map(m => m.trim().toLowerCase());

  return (
    <section className="py-16 bg-gray-50" id="metodos-pago">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-8">Métodos de Pago</h2>
        <p className="text-center text-gray-600 mb-8">Aceptamos las siguientes formas de pago</p>
        <div className="flex justify-center items-center gap-8 flex-wrap">
          {methods.map((method) => (
            paymentLogos[method] && (
              <img
                key={method}
                src={paymentLogos[method]}
                alt={method}
                className="h-12 object-contain grayscale hover:grayscale-0 transition"
              />
            )
          ))}
          <div className="bg-secondary text-white px-6 py-3 rounded-lg font-semibold">
            Pago Contra Entrega
          </div>
        </div>
      </div>
    </section>
  );
}
