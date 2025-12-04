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

  // Crear configuración del sitio con TODOS los nuevos campos
  const siteSettings = await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      // Identidad de Marca
      siteName: 'TiendaPro',
      logoUrl: 'https://via.placeholder.com/150x50/3B82F6/ffffff?text=TiendaPro',
      faviconUrl: '/favicon.ico',
      brandDescription: 'Tu tienda online de confianza',
      tagline: 'Calidad garantizada',
      
      // Información de Contacto
      contactEmail: 'contacto@tiendapro.com',
      contactPhone: '+57 300 123 4567',
      whatsappNumber: '573001234567',
      address: 'Calle 123 #45-67',
      city: 'Bogotá',
      country: 'Colombia',
      
      // Redes Sociales (vacías por defecto)
      facebookUrl: '',
      instagramUrl: '',
      twitterUrl: '',
      tiktokUrl: '',
      youtubeUrl: '',
      
      // Personalización Visual
      primaryColor: '#3B82F6',
      secondaryColor: '#10B981',
      accentColor: '#F59E0B',
      fontFamily: 'Inter',
      buttonStyle: 'rounded',
      
      // Hero Section
      heroImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920',
      heroTitle: 'Descubre la Mejor Selección',
      heroSubtitle: 'Productos de calidad premium al mejor precio',
      
      // Sobre Nosotros
      aboutUsText: 'Somos una tienda líder en productos de alta calidad. Nos comprometemos a ofrecer la mejor experiencia de compra con envíos rápidos y atención personalizada.',
      
      // SEO y Analytics
      metaTitle: 'TiendaPro - Los Mejores Productos Online',
      metaDescription: 'Encuentra productos de alta calidad al mejor precio. Envíos rápidos a todo Colombia.',
      metaKeywords: 'tienda,productos,electrónica,gaming,comprar online',
      googleAnalyticsId: '',
      facebookPixelId: '',
      googleTagManagerId: '',
      
      // Configuración de Pagos
      enableBoldPayments: true,
      enableBancolombia: true,
      enableCreditCard: true,
      merchantName: 'TiendaPro',
      paymentMethodsLogos: 'visa,mastercard,amex,diners',
      
      // Configuración de Tienda
      currency: 'COP',
      currencySymbol: '$',
      language: 'es',
      timezone: 'America/Bogota',
      enableReviews: true,
      enableWishlist: false,
      maxProductsPerPage: 12,
      
      // Envíos y Logística
      shippingMessage: 'Envíos a todo Colombia',
      shippingInsuranceFee: 15000,
      freeShippingMinAmount: 0,
      estimatedDeliveryDays: '3-5 días hábiles',
      
      // Legal y Políticas
      termsAndConditionsUrl: '/terminos-condiciones',
      privacyPolicyUrl: '/politica-privacidad',
      returnPolicyUrl: '/politica-envios',
    },
  });
  console.log('✅ Configuración del sitio creada con personalización completa');

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
    {
      customerName: 'Sofía Ramírez',
      rating: 5,
      comment: 'Los audífonos que compré tienen una calidad de sonido increíble. Llegaron antes de lo esperado.',
      isApproved: true,
    },
    {
      customerName: 'Diego Morales',
      rating: 5,
      comment: 'Compré un portátil y estoy fascinado. El precio fue excelente y la garantía me da mucha tranquilidad.',
      isApproved: true,
    },
    {
      customerName: 'Valentina Ruiz',
      rating: 4,
      comment: 'Muy buena atención por WhatsApp. Me ayudaron a escoger el producto perfecto para mí.',
      isApproved: true,
    },
    {
      customerName: 'Andrés Castro',
      rating: 5,
      comment: '100% recomendado. El empaque venía super seguro y el producto tal cual como en las fotos.',
      isApproved: true,
    },
    {
      customerName: 'Camila Torres',
      rating: 5,
      comment: 'Segunda vez que compro y siempre me sorprenden. Calidad garantizada y precios justos.',
      isApproved: true,
    },
    {
      customerName: 'Sebastián Vargas',
      rating: 5,
      comment: 'El mouse gaming que pedí es perfecto. Muy buenos acabados y funciona de maravilla.',
      isApproved: true,
    },
    {
      customerName: 'Isabella López',
      rating: 4,
      comment: 'Buena tienda online. El proceso de pago es seguro y me mantuvieron informada del envío.',
      isApproved: true,
    },
    {
      customerName: 'Mateo Jiménez',
      rating: 5,
      comment: 'Compré un teclado mecánico y la experiencia fue excelente. Llegó en 2 días.',
      isApproved: true,
    },
    {
      customerName: 'Lucía Ortiz',
      rating: 5,
      comment: 'Me encanta esta tienda! Tienen variedad y los precios son muy competitivos.',
      isApproved: true,
    },
    {
      customerName: 'Juan Pablo Díaz',
      rating: 5,
      comment: 'El monitor que compré es de excelente calidad. El servicio al cliente es muy profesional.',
      isApproved: true,
    },
    {
      customerName: 'Martina Sánchez',
      rating: 4,
      comment: 'Primera compra y quedé satisfecha. El producto llegó bien empacado y funciona perfecto.',
      isApproved: true,
    },
    {
      customerName: 'Samuel Pérez',
      rating: 5,
      comment: 'Increíble atención! Me resolvieron todas las dudas antes de comprar. Muy profesionales.',
      isApproved: true,
    },
    {
      customerName: 'Emma Gutiérrez',
      rating: 5,
      comment: 'Los audífonos inalámbricos que pedí son espectaculares. La batería dura muchísimo.',
      isApproved: true,
    },
    {
      customerName: 'Nicolás Silva',
      rating: 5,
      comment: 'Excelente relación calidad-precio. El envío fue rápido y sin contratiempos.',
      isApproved: true,
    },
    {
      customerName: 'Valeria Mendoza',
      rating: 4,
      comment: 'Muy buena experiencia. El producto es original y vino con todos sus accesorios.',
      isApproved: true,
    },
    {
      customerName: 'Miguel Ángel Cruz',
      rating: 5,
      comment: 'Compré una silla gaming y es super cómoda. Vale cada peso invertido.',
      isApproved: true,
    },
    {
      customerName: 'Gabriela Rojas',
      rating: 5,
      comment: 'Me atendieron por chat y fueron muy amables. El producto llegó exactamente como lo describieron.',
      isApproved: true,
    },
    {
      customerName: 'Daniel Herrera',
      rating: 5,
      comment: 'Compro aquí seguido y nunca me han decepcionado. Siempre productos originales.',
      isApproved: true,
    },
    {
      customerName: 'Paula Medina',
      rating: 4,
      comment: 'Buena tienda. Los precios son accesibles y tienen buena variedad de productos gaming.',
      isApproved: true,
    },
    {
      customerName: 'Alejandro Ríos',
      rating: 5,
      comment: 'El procesador que compré llegó bien protegido. Excelente servicio de principio a fin.',
      isApproved: true,
    },
    {
      customerName: 'Carolina Navarro',
      rating: 5,
      comment: 'Súper recomendado! La webcam que pedí tiene muy buena resolución. Feliz con mi compra.',
      isApproved: true,
    },
    {
      customerName: 'Felipe Molina',
      rating: 5,
      comment: 'Primera vez comprando online y fue muy fácil. El producto es de excelente calidad.',
      isApproved: true,
    },
    {
      customerName: 'Daniela Paredes',
      rating: 4,
      comment: 'Buen servicio. El envío tardó un poco más de lo esperado pero el producto vale la pena.',
      isApproved: true,
    },
    {
      customerName: 'Ricardo Gómez',
      rating: 5,
      comment: 'Compré unos controles de PS5 y están perfectos. Originales y a buen precio.',
      isApproved: true,
    },
    {
      customerName: 'Mariana Acosta',
      rating: 5,
      comment: 'Me encantó la experiencia de compra. Todo muy transparente y seguro. Volveré a comprar!',
      isApproved: true,
    },
    {
      customerName: 'Tomás Vega',
      rating: 5,
      comment: 'El teclado que compré es de muy buena calidad. El RGB se ve espectacular.',
      isApproved: true,
    },
    {
      customerName: 'Antonia Flores',
      rating: 4,
      comment: 'Buena atención al cliente. Me ayudaron a rastrear mi pedido sin problemas.',
      isApproved: true,
    },
    {
      customerName: 'Joaquín Reyes',
      rating: 5,
      comment: 'Llevo 3 compras y todas excelentes. Confiable y con buenos precios.',
      isApproved: true,
    },
    {
      customerName: 'Renata Cortés',
      rating: 5,
      comment: 'El mouse pad XXL que pedí es perfecto. Muy buena calidad y llegó rapidísimo.',
      isApproved: true,
    },
    {
      customerName: 'Emiliano Duarte',
      rating: 5,
      comment: 'Excelente tienda! Los productos gaming son originales y a precios justos.',
      isApproved: true,
    },
    {
      customerName: 'Julieta Montoya',
      rating: 4,
      comment: 'Primera compra satisfactoria. El empaque venía muy bien sellado y protegido.',
      isApproved: true,
    },
    {
      customerName: 'Maximiliano Paz',
      rating: 5,
      comment: 'La tarjeta gráfica que compré funciona perfecto. Envío rápido y seguro.',
      isApproved: true,
    },
    {
      customerName: 'Victoria Salazar',
      rating: 5,
      comment: 'Me atendieron super bien por WhatsApp. El producto llegó en tiempo récord.',
      isApproved: true,
    },
    {
      customerName: 'Cristóbal Luna',
      rating: 5,
      comment: 'Compré RAM para mi PC y todo perfecto. Excelente servicio postventa también.',
      isApproved: true,
    },
    {
      customerName: 'Amanda Escobar',
      rating: 4,
      comment: 'Buena experiencia en general. El producto cumplió mis expectativas.',
      isApproved: true,
    },
    {
      customerName: 'Lorenzo Benítez',
      rating: 5,
      comment: 'Los controles que pedí son originales. Muy contento con la compra y el servicio.',
      isApproved: true,
    },
    {
      customerName: 'Catalina Parra',
      rating: 5,
      comment: 'Todo excelente! Desde el proceso de compra hasta la entrega. 100% recomendado.',
      isApproved: true,
    },
    {
      customerName: 'Benjamín Campos',
      rating: 5,
      comment: 'El headset que compré tiene un sonido increíble. Perfectos para gaming.',
      isApproved: true,
    },
    {
      customerName: 'Ximena Delgado',
      rating: 4,
      comment: 'Muy buena tienda. Tienen buenos productos y precios competitivos.',
      isApproved: true,
    },
    {
      customerName: 'Rafael Ibarra',
      rating: 5,
      comment: 'Compré un SSD y la diferencia en velocidad es brutal. Excelente compra.',
      isApproved: true,
    },
    {
      customerName: 'Fernanda Aguilar',
      rating: 5,
      comment: 'Super feliz con mi compra! El producto es tal cual como lo mostraban en las fotos.',
      isApproved: true,
    },
    {
      customerName: 'Santiago Moreno',
      rating: 5,
      comment: 'Tercera compra aquí y siempre impecable. Muy confiables y serios.',
      isApproved: true,
    },
    {
      customerName: 'Abril Romero',
      rating: 5,
      comment: 'La mejor tienda online de tecnología! Precios, calidad y atención de 10.',
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
