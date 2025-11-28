# Script de configuración rápida para WebEditVentas

Write-Host "🛍️  WebEditVentas - Configuración Automática" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Verificar si Node.js está instalado
Write-Host "✓ Verificando Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "  Node.js instalado: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "  ❌ Node.js no está instalado. Por favor instala Node.js 18+ desde https://nodejs.org" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Paso 1: Instalar dependencias
Write-Host "📦 Paso 1/4: Instalando dependencias..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "  ❌ Error al instalar dependencias" -ForegroundColor Red
    exit 1
}
Write-Host "  ✅ Dependencias instaladas" -ForegroundColor Green
Write-Host ""

# Paso 2: Generar Prisma Client
Write-Host "🔧 Paso 2/4: Generando Prisma Client..." -ForegroundColor Yellow
npm run prisma:generate
if ($LASTEXITCODE -ne 0) {
    Write-Host "  ❌ Error al generar Prisma Client" -ForegroundColor Red
    exit 1
}
Write-Host "  ✅ Prisma Client generado" -ForegroundColor Green
Write-Host ""

# Paso 3: Crear base de datos y migraciones
Write-Host "🗄️  Paso 3/4: Configurando base de datos..." -ForegroundColor Yellow
npm run prisma:migrate
if ($LASTEXITCODE -ne 0) {
    Write-Host "  ❌ Error al crear la base de datos" -ForegroundColor Red
    exit 1
}
Write-Host "  ✅ Base de datos creada" -ForegroundColor Green
Write-Host ""

# Paso 4: Poblar la base de datos
Write-Host "🌱 Paso 4/4: Poblando base de datos con datos de ejemplo..." -ForegroundColor Yellow
npm run prisma:seed
if ($LASTEXITCODE -ne 0) {
    Write-Host "  ❌ Error al poblar la base de datos" -ForegroundColor Red
    exit 1
}
Write-Host "  ✅ Datos de ejemplo cargados" -ForegroundColor Green
Write-Host ""

# Resumen final
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "🎉 ¡Configuración completada exitosamente!" -ForegroundColor Green
Write-Host ""
Write-Host "Para iniciar el servidor de desarrollo, ejecuta:" -ForegroundColor Yellow
Write-Host "  npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "Luego abre en tu navegador:" -ForegroundColor Yellow
Write-Host "  🛍️  Tienda: http://localhost:3000" -ForegroundColor White
Write-Host "  🔐 Admin:  http://localhost:3000/admin" -ForegroundColor White
Write-Host ""
Write-Host "Credenciales de admin:" -ForegroundColor Yellow
Write-Host "  Email:    admin@tienda.com" -ForegroundColor White
Write-Host "  Password: admin123" -ForegroundColor White
Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Preguntar si desea iniciar el servidor
$response = Read-Host "¿Deseas iniciar el servidor ahora? (S/N)"
if ($response -eq "S" -or $response -eq "s") {
    Write-Host ""
    Write-Host "🚀 Iniciando servidor de desarrollo..." -ForegroundColor Cyan
    Write-Host "   Presiona Ctrl+C para detener el servidor" -ForegroundColor Gray
    Write-Host ""
    npm run dev
}
