interface AboutSectionProps {
  aboutUsText: string;
}

export default function AboutSection({ aboutUsText }: AboutSectionProps) {
  return (
    <section className="py-16 bg-white" id="sobre-nosotros">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-8">Sobre Nosotros</h2>
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-lg text-gray-700 leading-relaxed">{aboutUsText}</p>
        </div>
      </div>
    </section>
  );
}
