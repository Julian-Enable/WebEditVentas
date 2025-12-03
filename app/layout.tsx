import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import './globals.css';
import { prisma } from '@/lib/prisma';
import PageLoader from '@/components/PageLoader';
import WhatsAppButton from '@/components/WhatsAppButton';
import AnalyticsTracker from '@/components/AnalyticsTracker';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'CasaPlay - Los mejores productos gaming y tecnología',
  description: 'Los mejores productos gaming y tecnología al mejor precio',
};

async function getSettings() {
  try {
    const settings = await prisma.siteSettings.findFirst();
    return settings;
  } catch (error) {
    return null;
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();
  
  return (
    <html lang="es">
      <head>
        {settings && (
          <style dangerouslySetInnerHTML={{
            __html: `
              :root {
                --color-primary: ${settings.primaryColor || '#3B82F6'};
                --color-secondary: ${settings.secondaryColor || '#10B981'};
              }
            `
          }} />
        )}
      </head>
      <body className={inter.className}>
        <AnalyticsTracker />
        <PageLoader />
        <WhatsAppButton />
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
