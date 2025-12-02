import { prisma } from '@/lib/prisma';
import AnnouncementBar from '@/components/AnnouncementBar';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ProductGrid from '@/components/ProductGrid';
import AboutSection from '@/components/AboutSection';
import PaymentMethodsSection from '@/components/PaymentMethodsSection';
import ReviewsSection from '@/components/ReviewsSection';
import ReviewForm from '@/components/ReviewForm';
import Footer from '@/components/Footer';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const settings = await prisma.siteSettings.findFirst();
  const featuredProducts = await prisma.product.findMany({
    where: { isFeatured: true },
    orderBy: { createdAt: 'desc' },
  });
  const reviews = await prisma.review.findMany({
    where: { isApproved: true },
    orderBy: { createdAt: 'desc' },
    take: 12,
  }).then(reviews => reviews.map(review => ({
    ...review,
    profileImage: `https://ui-avatars.com/api/?name=${encodeURIComponent(review.customerName)}&background=random&color=fff&size=128`
  })));

  if (!settings) {
    return <div>Configuración no encontrada. Por favor, ejecuta el seed.</div>;
  }

  return (
    <main>
      <AnnouncementBar />
      <Navbar siteName={settings.siteName} logoUrl={settings.logoUrl} />
      <Hero
        heroImage={settings.heroImage}
        heroTitle={settings.heroTitle}
        heroSubtitle={settings.heroSubtitle}
        logoUrl={settings.logoUrl}
      />
      <ProductGrid products={featuredProducts} title="Productos Destacados" />
      <AboutSection aboutUsText={settings.aboutUsText} />
      <PaymentMethodsSection paymentMethods={settings.paymentMethodsLogos} />
      <ReviewsSection reviews={reviews} />
      <ReviewForm />
      <Footer siteName={settings.siteName} />
    </main>
  );
}
