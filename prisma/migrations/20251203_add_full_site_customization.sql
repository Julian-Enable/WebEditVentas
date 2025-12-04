-- Migration: Add full site customization fields to SiteSettings
-- Date: 2025-12-03

ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "faviconUrl" TEXT NOT NULL DEFAULT '/favicon.ico';
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "brandDescription" TEXT NOT NULL DEFAULT 'Tu tienda online de confianza';
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "tagline" TEXT NOT NULL DEFAULT 'Calidad garantizada';

-- Información de Contacto
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "contactEmail" TEXT NOT NULL DEFAULT 'contacto@tienda.com';
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "contactPhone" TEXT NOT NULL DEFAULT '+57 300 000 0000';
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "whatsappNumber" TEXT NOT NULL DEFAULT '573000000000';
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "address" TEXT NOT NULL DEFAULT 'Calle 123 #45-67';
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "city" TEXT NOT NULL DEFAULT 'Bogotá';
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "country" TEXT NOT NULL DEFAULT 'Colombia';

-- Redes Sociales
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "facebookUrl" TEXT NOT NULL DEFAULT '';
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "instagramUrl" TEXT NOT NULL DEFAULT '';
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "twitterUrl" TEXT NOT NULL DEFAULT '';
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "tiktokUrl" TEXT NOT NULL DEFAULT '';
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "youtubeUrl" TEXT NOT NULL DEFAULT '';

-- Personalización Visual
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "accentColor" TEXT NOT NULL DEFAULT '#F59E0B';
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "fontFamily" TEXT NOT NULL DEFAULT 'Inter';
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "buttonStyle" TEXT NOT NULL DEFAULT 'rounded';

-- SEO y Analytics
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "metaTitle" TEXT NOT NULL DEFAULT 'Mi Tienda Online';
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "metaDescription" TEXT NOT NULL DEFAULT 'Encuentra los mejores productos al mejor precio';
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "metaKeywords" TEXT NOT NULL DEFAULT 'tienda,productos,comprar,online';
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "googleAnalyticsId" TEXT NOT NULL DEFAULT '';
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "facebookPixelId" TEXT NOT NULL DEFAULT '';
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "googleTagManagerId" TEXT NOT NULL DEFAULT '';

-- Configuración de Pagos
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "enableBoldPayments" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "enableBancolombia" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "enableCreditCard" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "merchantName" TEXT NOT NULL DEFAULT 'Mi Tienda';

-- Configuración de Tienda
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "currency" TEXT NOT NULL DEFAULT 'COP';
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "currencySymbol" TEXT NOT NULL DEFAULT '$';
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "language" TEXT NOT NULL DEFAULT 'es';
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "timezone" TEXT NOT NULL DEFAULT 'America/Bogota';
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "enableReviews" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "enableWishlist" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "maxProductsPerPage" INTEGER NOT NULL DEFAULT 12;

-- Envíos y Logística
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "shippingMessage" TEXT NOT NULL DEFAULT 'Envíos a todo el país';
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "shippingInsuranceFee" DOUBLE PRECISION NOT NULL DEFAULT 15000;
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "freeShippingMinAmount" DOUBLE PRECISION NOT NULL DEFAULT 0;
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "estimatedDeliveryDays" TEXT NOT NULL DEFAULT '3-5 días hábiles';

-- Legal y Políticas
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "termsAndConditionsUrl" TEXT NOT NULL DEFAULT '/terminos-condiciones';
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "privacyPolicyUrl" TEXT NOT NULL DEFAULT '/politica-privacidad';
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "returnPolicyUrl" TEXT NOT NULL DEFAULT '/politica-envios';
