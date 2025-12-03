'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Solo enviar analytics en producción o si está habilitado
    if (typeof window === 'undefined') return;

    const sendAnalytics = async () => {
      try {
        // Detectar tipo de dispositivo
        const getDeviceType = () => {
          const ua = navigator.userAgent;
          if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
            return 'Tablet';
          }
          if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
            return 'Móvil';
          }
          return 'Desktop';
        };

        // Detectar navegador
        const getBrowser = () => {
          const ua = navigator.userAgent;
          if (ua.indexOf('Firefox') > -1) return 'Firefox';
          if (ua.indexOf('SamsungBrowser') > -1) return 'Samsung Internet';
          if (ua.indexOf('Opera') > -1 || ua.indexOf('OPR') > -1) return 'Opera';
          if (ua.indexOf('Trident') > -1) return 'Internet Explorer';
          if (ua.indexOf('Edge') > -1) return 'Edge (Legacy)';
          if (ua.indexOf('Edg') > -1) return 'Edge (Chromium)';
          if (ua.indexOf('Chrome') > -1) return 'Chrome';
          if (ua.indexOf('Safari') > -1) return 'Safari';
          return 'Desconocido';
        };

        // Detectar sistema operativo
        const getOS = () => {
          const ua = navigator.userAgent;
          if (ua.indexOf('Win') > -1) return 'Windows';
          if (ua.indexOf('Mac') > -1) return 'MacOS';
          if (ua.indexOf('Linux') > -1) return 'Linux';
          if (ua.indexOf('Android') > -1) return 'Android';
          if (ua.indexOf('iOS') > -1 || ua.indexOf('iPhone') > -1 || ua.indexOf('iPad') > -1) return 'iOS';
          return 'Desconocido';
        };

        const analyticsData = {
          page: pathname,
          referrer: document.referrer || 'Directo',
          deviceType: getDeviceType(),
          browser: getBrowser(),
          os: getOS(),
          screenResolution: `${window.screen.width}x${window.screen.height}`,
          language: navigator.language || 'Desconocido',
          timestamp: new Date().toISOString(),
        };

        await fetch('/api/analytics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(analyticsData),
        });
      } catch (error) {
        console.error('Error sending analytics:', error);
      }
    };

    // Enviar analytics después de un pequeño delay
    const timer = setTimeout(() => {
      sendAnalytics();
    }, 1000);

    return () => clearTimeout(timer);
  }, [pathname]); // Se ejecuta cada vez que cambia la página

  return null; // No renderiza nada
}
