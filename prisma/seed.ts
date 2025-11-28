import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');

  // Crear admin por defecto
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.admin.upsert({
    where: { email: 'admin@tienda.com' },
    update: {},
    create: {
      email: 'admin@tienda.com',
      password: hashedPassword,
      name: 'Administrador',
    },
  });
  console.log('✅ Admin creado:', admin.email);

  // Crear configuración del sitio
  const siteSettings = await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      siteName: 'TiendaPro',
      primaryColor: '#3B82F6',
      secondaryColor: '#10B981',
      logoUrl: 'https://via.placeholder.com/150x50/3B82F6/ffffff?text=TiendaPro',
      aboutUsText: 'Somos una tienda líder en productos de alta calidad. Nos comprometemos a ofrecer la mejor experiencia de compra con envíos rápidos y atención personalizada.',
      paymentMethodsLogos: 'visa,mastercard,amex,diners',
      heroImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920',
      heroTitle: 'Descubre la Mejor Selección',
      heroSubtitle: 'Productos de calidad premium al mejor precio',
    },
  });
  console.log('✅ Configuración del sitio creada');

  // Crear productos de ejemplo
  const products = [
    {
      name: 'Smartphone Premium X1',
      description: 'Teléfono inteligente de última generación con pantalla OLED de 6.7", 256GB de almacenamiento y cámara de 108MP',
      price: 2999000,
      imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800',
      category: 'Electrónica',
      isFeatured: true,
      stock: 50,
    },
    {
      name: 'Laptop UltraBook Pro',
      description: 'Portátil profesional con procesador Intel i7, 16GB RAM, SSD 512GB y pantalla 15.6" Full HD',
      price: 4500000,
      imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800',
      category: 'Electrónica',
      isFeatured: true,
      stock: 30,
    },
    {
      name: 'Auriculares Bluetooth Premium',
      description: 'Auriculares inalámbricos con cancelación de ruido activa, 30 horas de batería y sonido Hi-Fi',
      price: 599000,
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
      category: 'Audio',
      isFeatured: true,
      stock: 100,
    },
    {
      name: 'Smartwatch Series 8',
      description: 'Reloj inteligente con monitor de salud, GPS, resistente al agua y pantalla AMOLED',
      price: 1299000,
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
      category: 'Wearables',
      isFeatured: true,
      stock: 75,
    },
    {
      name: 'Tablet Pro 12.9"',
      description: 'Tablet profesional con chip M2, 256GB, Apple Pencil compatible y pantalla Retina',
      price: 3799000,
      imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800',
      category: 'Electrónica',
      isFeatured: false,
      stock: 40,
    },
    {
      name: 'Cámara DSLR 4K',
      description: 'Cámara profesional con sensor Full Frame, grabación 4K 60fps y lente 24-70mm incluido',
      price: 5999000,
      imageUrl: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800',
      category: 'Fotografía',
      isFeatured: false,
      stock: 20,
    },
    {
      name: 'Consola Gaming Next Gen',
      description: 'Consola de videojuegos de última generación, 1TB SSD, gráficos 4K a 120fps',
      price: 2499000,
      imageUrl: 'https://images.unsplash.com/photo-1486401899868-0e435ed85128?w=800',
      category: 'Gaming',
      isFeatured: true,
      stock: 60,
    },
    {
      name: 'Teclado Mecánico RGB',
      description: 'Teclado gaming mecánico con switches Cherry MX, iluminación RGB personalizable',
      price: 449000,
      imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800',
      category: 'Gaming',
      isFeatured: false,
      stock: 150,
    },
  ];

  for (const product of products) {
    await prisma.product.create({ data: product });
  }
  console.log(`✅ ${products.length} productos creados`);

  // Crear reseñas de ejemplo
  const reviews = [
    {
      customerName: 'María González',
      rating: 5,
      comment: 'Excelente servicio y productos de calidad. El envío fue rápido y todo llegó en perfecto estado.',
      isApproved: true,
    },
    {
      customerName: 'Carlos Rodríguez',
      rating: 5,
      comment: 'Muy satisfecho con mi compra. El smartphone superó mis expectativas. Totalmente recomendado.',
      isApproved: true,
    },
    {
      customerName: 'Ana Martínez',
      rating: 4,
      comment: 'Buena experiencia de compra. Los precios son competitivos y la atención al cliente es excelente.',
      isApproved: true,
    },
    {
      customerName: 'Luis Hernández',
      rating: 5,
      comment: 'Primera vez que compro aquí y quedé encantado. Proceso de compra muy fácil y seguro.',
      isApproved: true,
    },
  ];

  for (const review of reviews) {
    await prisma.review.create({ data: review });
  }
  console.log(`✅ ${reviews.length} reseñas creadas`);

  console.log('🎉 Seed completado exitosamente!');
  console.log('\n📝 Credenciales de admin:');
  console.log('   Email: admin@tienda.com');
  console.log('   Password: admin123');
}

main()
  .catch((e) => {
    console.error('❌ Error en el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
