import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/adminpropage/', '/api/'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/adminpropage/', '/api/'],
        crawlDelay: 0,
      },
    ],
    sitemap: 'https://casaplay.shop/sitemap.xml',
  };
}
