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
          <div className="h-12 w-12 flex items-center justify-center grayscale hover:grayscale-0 transition">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full text-green-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
