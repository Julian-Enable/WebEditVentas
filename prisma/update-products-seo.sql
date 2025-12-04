-- Script SQL para optimizar nombres de productos para SEO
-- Ejecutar en PostgreSQL o Prisma Studio

-- IMPORTANTE: Hacer backup antes de ejecutar
-- pg_dump webeditventas > backup_$(date +%Y%m%d).sql

-- Actualizar nombres de controles PS5 con keywords SEO
UPDATE "Product"
SET 
  name = CASE
    WHEN id = 27 THEN 'Control PS5 DualSense Plateado Original Colombia - Envío Gratis'
    WHEN id = 26 THEN 'Control PS5 DualSense Camuflado Original Colombia - Pago Contra Entrega'
    WHEN id = 22 THEN 'Control PS5 DualSense Blanco Original Colombia - Garantía Sony'
    WHEN id = 21 THEN 'Control PS5 DualSense Negro Midnight Original Colombia'
    WHEN id = 20 THEN 'Control PS5 DualSense Edición God of War Ragnarok Colombia'
    WHEN id = 19 THEN 'Control PS5 DualSense Spider-Man 2 Edición Limitada Colombia'
    WHEN id = 18 THEN 'Control PS5 DualSense Cosmic Red Colombia - Envío Gratis'
    ELSE name
  END,
  description = CASE
    WHEN category = 'CONTROLES' THEN 
      description || E'\n\n✅ Control PS5 100% original Sony\n✅ Envío gratis a toda Colombia\n✅ Pago contra entrega disponible\n✅ Garantía oficial Sony Colombia\n✅ Entrega en Bogotá, Medellín, Cali, Barranquilla'
    ELSE description
  END
WHERE category = 'CONTROLES';

-- Actualizar nombres de consolas PS5
UPDATE "Product"
SET 
  name = CASE
    WHEN id = 25 THEN 'PS5 Slim Digital Colombia - Consola PlayStation 5 Original - Envío Gratis'
    WHEN id = 17 THEN 'PS5 Slim 1TB con Lector Colombia - Consola PlayStation 5 Original'
    ELSE name
  END,
  description = CASE
    WHEN category IN ('CONSOLAS', 'Consolas') THEN 
      description || E'\n\n🎮 Consola PS5 100% original Sony Colombia\n✅ Garantía oficial Sony de 1 año\n✅ Envío gratis a toda Colombia\n✅ Pago contra entrega disponible\n✅ Control DualSense incluido\n✅ Entrega en 1-3 días: Bogotá, Medellín, Cali'
    ELSE description
  END
WHERE category IN ('CONSOLAS', 'Consolas');

-- Actualizar nombres de juegos
UPDATE "Product"
SET 
  name = CASE
    WHEN id = 24 THEN 'FC 26 PS5 Colombia - Juego Original PlayStation 5 - Envío Gratis'
    ELSE name
  END,
  description = CASE
    WHEN category = 'Juegos' THEN 
      description || E'\n\n🎮 Juego PS5 original físico\n✅ Envío gratis a toda Colombia\n✅ Pago contra entrega\n✅ Compatible con PS5 Slim y PS5 Original'
    ELSE description
  END
WHERE category = 'Juegos';

-- Actualizar nombres de accesorios
UPDATE "Product"
SET 
  name = CASE
    WHEN id = 23 THEN 'Estación de Carga PS5 Sony Original - Base para 2 Controles DualSense Colombia'
    WHEN id = 16 THEN 'PlayStation Portal Colombia - Streaming PS5 Original - Envío Gratis'
    ELSE name
  END,
  description = CASE
    WHEN category = 'Accesorios' THEN 
      description || E'\n\n✅ Accesorio PS5 original Sony\n✅ Envío gratis a toda Colombia\n✅ Pago contra entrega disponible\n✅ Compatible con todas las versiones de PS5'
    ELSE description
  END
WHERE category = 'Accesorios';

-- Verificar cambios
SELECT id, name, category, price, discount 
FROM "Product" 
ORDER BY category, id;
