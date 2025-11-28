# 🛍️ WebEditVentas - Tienda Online Completa

Sistema completo de e-commerce desarrollado con **Next.js 14**, **TypeScript**, **Prisma**, **SQLite** y **Tailwind CSS**. Incluye frontend de tienda, checkout inteligente con detección de BIN, y panel de administración completo.

## ✨ Características Principales

### 🌐 Tienda Online (Frontend)
- **Página de inicio** con hero personalizable, productos destacados, secciones informativas
- **Listado de productos** con filtros por categoría y búsqueda
- **Carrito de compras** persistente con gestión de cantidades
- **Checkout en una sola página** tipo Shopify
- **Sistema de reseñas** de clientes con calificaciones
- **Diseño responsive** y moderno con Tailwind CSS
- **Colores y branding personalizables** desde el panel admin

### 💳 Checkout Inteligente
- **Detección automática de tipo de tarjeta por BIN** (Visa, MasterCard, Amex, Diners, etc.)
- **Detección de banco emisor** - Sistema avanzado que identifica más de 50 bancos colombianos
  - Bancolombia, Davivienda, BBVA, Banco de Bogotá, Colpatria, etc.
  - La información del banco se guarda en el backend (no visible para el usuario)
- **Logos oficiales de tarjetas** (SVG de alta calidad) que aparecen automáticamente al escribir
- **Validación de tarjetas** con algoritmo de Luhn
- **CVV dinámico** (3 dígitos para Visa/MasterCard, 4 para Amex)
- **3 métodos de pago**:
  - 💳 **Tarjeta de crédito/débito** tradicional
  - 🛡️ **Bold** - Pasarela de pago dedicada en `/boldpagos` con diseño corporativo Bold
  - 💵 **Contra entrega** - Con seguro obligatorio de 2.500 COP (se paga con tarjeta)
- **Página exclusiva Bold** `/boldpagos`:
  - Diseño fiel a la pasarela Bold (gradiente rosa-morado + formulario blanco)
  - 3 métodos: Pago con tarjeta, Botón Bancolombia, Nequi (desactivado)
  - Detección automática de banco emisor en background
- **Seguro de envío obligatorio** (2.500 COP) para pagos contra entrega - **se paga con tarjeta en el momento**
- Guardado seguro de datos (solo últimos 4 dígitos de tarjeta + banco emisor)

### 🔐 Panel de Administración
- **Autenticación segura** con JWT y cookies httpOnly
- **Gestión de productos** (CRUD completo)
- **Gestión de pedidos** con estados y detalles
- **Gestión de reseñas** (aprobar/rechazar)
- **Configuración del sitio**:
  - Nombre, logo, colores
  - Textos del hero y secciones
  - Métodos de pago aceptados
  - Texto "Sobre Nosotros"

### 🗄️ Base de Datos
- **Prisma ORM** con SQLite (fácilmente migrable a PostgreSQL/MySQL)
- Modelos: Product, Order, Customer, OrderItem, Review, SiteSettings, Admin
- Migraciones automáticas
- Seed con datos de ejemplo

---

## 🚀 Instalación y Configuración

### Requisitos Previos
- **Node.js** 18+ y **npm**
- **Git** (opcional)

### Paso 1: Instalar Dependencias
```powershell
cd c:\Users\paula\Desktop\Julian\WebEditVentas
npm install
```

### Paso 2: Configurar Variables de Entorno
El archivo `.env` ya está creado con valores por defecto:
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="mi-clave-secreta-super-segura-para-jwt-2024"
```

**⚠️ IMPORTANTE EN PRODUCCIÓN**: Cambia el `JWT_SECRET` por una clave segura aleatoria.

### Paso 3: Configurar Prisma y Base de Datos
```powershell
# Generar el cliente de Prisma
npm run prisma:generate

# Crear la base de datos y ejecutar migraciones
npm run prisma:migrate

# Poblar la base de datos con datos de ejemplo
npm run prisma:seed
```

### Paso 4: Ejecutar el Proyecto en Modo Desarrollo
```powershell
npm run dev
```

El proyecto estará disponible en: **http://localhost:3000**

---

## 👤 Credenciales de Acceso

### Panel de Administración
- **URL**: http://localhost:3000/adminpropage
- **Email**: `admin@tienda.com`
- **Contraseña**: `admin123`

---

## 📁 Estructura del Proyecto

```
WebEditVentas/
├── app/                          # Páginas y rutas de Next.js 14 (App Router)
│   ├── adminpropage/             # Panel de administración
│   │   ├── page.tsx              # Login de admin
│   │   ├── dashboard/            # Dashboard principal
│   │   ├── productos/            # Gestión de productos
│   │   ├── pedidos/              # Gestión de pedidos
│   │   ├── resenas/              # Gestión de reseñas
│   │   └── configuracion/        # Configuración del sitio
│   ├── api/                      # API Routes (Backend)
│   │   ├── auth/                 # Endpoints de autenticación
│   │   ├── products/             # CRUD de productos
│   │   ├── orders/               # CRUD de pedidos
│   │   ├── reviews/              # CRUD de reseñas
│   │   └── settings/             # Configuración del sitio
│   ├── carrito/                  # Página del carrito
│   ├── checkout/                 # Página de checkout
│   ├── confirmacion/             # Confirmación de pedido
│   ├── productos/                # Listado de productos
│   ├── layout.tsx                # Layout principal
│   ├── page.tsx                  # Página de inicio
│   └── globals.css               # Estilos globales
├── components/                   # Componentes reutilizables
│   ├── Navbar.tsx                # Navegación principal
│   ├── Hero.tsx                  # Sección hero
│   ├── ProductGrid.tsx           # Grilla de productos
│   ├── AboutSection.tsx          # Sección "Sobre Nosotros"
│   ├── PaymentMethodsSection.tsx # Métodos de pago
│   ├── ReviewsSection.tsx        # Sección de reseñas
│   └── Footer.tsx                # Pie de página
├── hooks/                        # Custom React Hooks
│   └── useCart.ts                # Hook del carrito (Zustand)
├── lib/                          # Utilidades y librerías
│   ├── prisma.ts                 # Cliente de Prisma
│   ├── auth.ts                   # Funciones de autenticación JWT
│   └── cardValidation.ts         # Validación de tarjetas y BIN
├── prisma/                       # Configuración de Prisma
│   ├── schema.prisma             # Esquema de la base de datos
│   ├── seed.ts                   # Script de seed
│   └── dev.db                    # Base de datos SQLite (generada)
├── .env                          # Variables de entorno
├── .env.example                  # Ejemplo de variables de entorno
├── package.json                  # Dependencias y scripts
├── tsconfig.json                 # Configuración de TypeScript
├── tailwind.config.ts            # Configuración de Tailwind
├── next.config.js                # Configuración de Next.js
└── README.md                     # Este archivo
```

---

## 🛠️ Scripts Disponibles

```powershell
# Desarrollo
npm run dev              # Inicia el servidor de desarrollo

# Producción
npm run build            # Construye la aplicación para producción
npm start                # Inicia el servidor de producción

# Base de datos (Prisma)
npm run prisma:generate  # Genera el cliente de Prisma
npm run prisma:migrate   # Ejecuta las migraciones
npm run prisma:seed      # Puebla la base de datos con datos de ejemplo
npm run prisma:studio    # Abre Prisma Studio (GUI para la DB)

# Otros
npm run lint             # Ejecuta el linter
```

---

## 🎨 Personalización

### Cambiar Colores, Logo y Textos
1. Inicia sesión en el panel de administración: http://localhost:3000/adminpropage
2. Ve a **"Configuración del Sitio"**
3. Modifica:
   - Nombre de la tienda
   - Colores primario y secundario
   - URLs de logo e imagen hero
   - Textos del hero y "Sobre Nosotros"
   - Métodos de pago aceptados

Los cambios se reflejan inmediatamente en el frontend.

### Agregar Productos
1. Panel admin → **"Gestión de Productos"**
2. Click en **"Nuevo Producto"**
3. Completa el formulario con:
   - Nombre, descripción, precio
   - URL de imagen (usar servicios como Unsplash o sube tus imágenes)
   - Categoría, stock
   - Marcar como destacado (aparecerá en la home)

### Gestionar Pedidos
1. Panel admin → **"Gestión de Pedidos"**
2. Ver lista de pedidos con detalles
3. Cambiar estado: Pendiente → Pagado → Enviado → Entregado

### Aprobar Reseñas
1. Panel admin → **"Gestión de Reseñas"**
2. Crear reseñas manualmente o aprobar/rechazar existentes
3. Solo las reseñas aprobadas aparecen en el frontend

---

## 💡 Características Técnicas

### Frontend
- **Next.js 14** con App Router
- **React 18** con Server Components y Client Components
- **TypeScript** para type safety
- **Tailwind CSS** para estilos
- **Zustand** para gestión del estado del carrito
- **react-hot-toast** para notificaciones

### Backend
- **Next.js API Routes** (serverless functions)
- **Prisma ORM** con SQLite
- **JWT** con `jose` para autenticación
- **bcryptjs** para hashing de contraseñas
- Validación de datos con **Zod**

### Seguridad
- Contraseñas hasheadas con bcrypt
- Autenticación con JWT en cookies httpOnly
- No se guardan datos completos de tarjetas (solo últimos 4 dígitos)
- Validación de formularios en cliente y servidor

---

## 🚢 Despliegue a Producción

### Opción 1: Vercel (Recomendado para Next.js)
1. Sube el código a GitHub
2. Conecta el repositorio en [Vercel](https://vercel.com)
3. Configura las variables de entorno:
   - `DATABASE_URL` (usa PostgreSQL en producción, e.g., Neon, Supabase)
   - `JWT_SECRET` (genera una clave segura)
4. Ejecuta las migraciones:
   ```bash
   npx prisma migrate deploy
   npx prisma db seed
   ```

### Opción 2: Servidor VPS (DigitalOcean, AWS, etc.)
1. Instala Node.js 18+ en el servidor
2. Clona el repositorio
3. Instala dependencias: `npm install`
4. Configura `.env` con las variables de producción
5. Ejecuta migraciones: `npm run prisma:migrate`
6. Construye: `npm run build`
7. Inicia: `npm start`
8. Usa PM2 o similar para mantener el proceso corriendo

### Migrar de SQLite a PostgreSQL
1. Instala PostgreSQL o usa un servicio (Neon, Supabase, Railway)
2. Cambia en `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
3. Actualiza `DATABASE_URL` en `.env`:
   ```
   DATABASE_URL="postgresql://user:password@host:5432/database"
   ```
4. Regenera el cliente: `npm run prisma:generate`
5. Ejecuta migraciones: `npm run prisma:migrate`

---

## 📚 Tecnologías Utilizadas

| Tecnología | Propósito |
|------------|-----------|
| Next.js 14 | Framework React con SSR y App Router |
| TypeScript | Tipado estático para JavaScript |
| Prisma | ORM para base de datos |
| SQLite | Base de datos en desarrollo (migrable a PostgreSQL) |
| Tailwind CSS | Framework de CSS utility-first |
| Zustand | Gestión del estado (carrito) |
| JWT (jose) | Autenticación segura |
| bcryptjs | Hashing de contraseñas |
| react-hot-toast | Notificaciones toast |
| lucide-react | Iconos modernos |

---

## 🧪 Datos de Ejemplo

El seed genera automáticamente:
- **1 administrador** (admin@tienda.com / admin123)
- **8 productos** de ejemplo en diferentes categorías
- **4 reseñas** aprobadas de clientes
- **1 configuración** del sitio con valores por defecto

---

## ❓ Solución de Problemas

### Error: "Prisma Client not generated"
```powershell
npm run prisma:generate
```

### Error: "Database not found"
```powershell
npm run prisma:migrate
```

### El carrito no persiste
Verifica que el navegador permita cookies. Zustand usa localStorage.

### Los estilos no se aplican
Verifica que Tailwind esté compilando correctamente. Reinicia el servidor de desarrollo.

### Error de autenticación en admin
Borra las cookies del navegador o usa modo incógnito.

---

## 📖 Próximas Mejoras Sugeridas

- [ ] Integración con pasarela de pago real (Stripe, PayU, Mercado Pago)
- [ ] Sistema de envíos con cálculo de tarifas
- [ ] Notificaciones por email (confirmación de pedido, cambios de estado)
- [ ] Dashboard con gráficos de ventas
- [ ] Exportación de reportes (PDF, Excel)
- [ ] Sistema de cupones y descuentos
- [ ] Multi-idioma (i18n)
- [ ] Modo oscuro
- [ ] Optimización de imágenes con Next.js Image
- [ ] Tests unitarios e integración

---

## 👨‍💻 Autor

Desarrollado como proyecto completo de e-commerce full-stack.

---

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

---

## 🎉 ¡Listo para usar!

Tu tienda online está completamente funcional. Personaliza el contenido desde el panel de administración y comienza a vender.

Para cualquier duda, revisa la documentación de:
- [Next.js](https://nextjs.org/docs)
- [Prisma](https://www.prisma.io/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
