import { Inter, Roboto, Poppins, Montserrat, Open_Sans } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import './globals.css';
import { prisma } from '@/lib/prisma';
import PageLoader from '@/components/PageLoader';
import WhatsAppButton from '@/components/WhatsAppButton';
import AnalyticsTracker from '@/components/AnalyticsTracker';
import DevToolsBlocker from '@/components/DevToolsBlocker';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const roboto = Roboto({ weight: ['300', '400', '500', '700'], subsets: ['latin'], variable: '--font-roboto' });
const poppins = Poppins({ weight: ['300', '400', '500', '600', '700'], subsets: ['latin'], variable: '--font-poppins' });
const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-montserrat' });
const openSans = Open_Sans({ subsets: ['latin'], variable: '--font-open-sans' });

async function getSettings() {
  try {
    const settings = await prisma.siteSettings.findFirst();
    return settings;
  } catch (error) {
    return null;
  }
}

export async function generateMetadata() {
  const settings = await getSettings();
  
  return {
    title: settings?.metaTitle || 'CasaPlay - Los mejores productos gaming y tecnología',
    description: settings?.metaDescription || 'Los mejores productos gaming y tecnología al mejor precio',
    keywords: settings?.metaKeywords || 'gaming,tecnología,productos,online',
    icons: {
      icon: settings?.faviconUrl || '/favicon.ico',
    },
    openGraph: {
      title: settings?.metaTitle || 'CasaPlay',
      description: settings?.metaDescription || 'Los mejores productos',
      siteName: settings?.siteName || 'CasaPlay',
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();
  
  const fontClass = settings?.fontFamily === 'Roboto' ? roboto.className :
                    settings?.fontFamily === 'Poppins' ? poppins.className :
                    settings?.fontFamily === 'Montserrat' ? montserrat.className :
                    settings?.fontFamily === 'Open Sans' ? openSans.className :
                    inter.className;
  
  return (
    <html lang={settings?.language || 'es'}>
      <head>
        {settings && (
          <style dangerouslySetInnerHTML={{
            __html: `
              :root {
                --color-primary: ${settings.primaryColor || '#3B82F6'};
                --color-secondary: ${settings.secondaryColor || '#10B981'};
                --color-accent: ${settings.accentColor || '#F59E0B'};
              }
              ${settings.buttonStyle === 'square' ? '.btn, button { border-radius: 0.25rem; }' : ''}
              ${settings.buttonStyle === 'pill' ? '.btn, button { border-radius: 9999px; }' : ''}
            `
          }} />
        )}
        
        {/* Google Analytics 4 */}
        {settings?.googleAnalyticsId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${settings.googleAnalyticsId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${settings.googleAnalyticsId}');
              `}
            </Script>
          </>
        )}
        
        {/* Facebook Pixel */}
        {settings?.facebookPixelId && (
          <Script id="facebook-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${settings.facebookPixelId}');
              fbq('track', 'PageView');
            `}
          </Script>
        )}
        
        {/* Google Tag Manager */}
        {settings?.googleTagManagerId && (
          <Script id="google-tag-manager" strategy="afterInteractive">
            {`
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${settings.googleTagManagerId}');
            `}
          </Script>
        )}
      </head>
      <body className={fontClass}>
        {/* GTM noscript fallback */}
        {settings?.googleTagManagerId && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${settings.googleTagManagerId}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        )}
        
        <DevToolsBlocker />
        <AnalyticsTracker />
        <PageLoader />
        <WhatsAppButton />
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
