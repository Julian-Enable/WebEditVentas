# 🚀 INICIO RÁPIDO

## Ejecuta estos comandos en orden:

### 1. Instalar dependencias
```powershell
npm install
```

### 2. Configurar base de datos
```powershell
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

### 3. Iniciar el proyecto
```powershell
npm run dev
```

### 4. Abrir en el navegador
- **Tienda**: http://localhost:3000
- **Admin**: http://localhost:3000/adminpropage
  - Email: `admin@tienda.com`
  - Password: `admin123`

---

## ⚡ Comandos Útiles

```powershell
# Ver la base de datos con interfaz gráfica
npm run prisma:studio

# Reiniciar la base de datos (borra todo y vuelve a poblar)
Remove-Item prisma\dev.db -ErrorAction SilentlyContinue
npm run prisma:migrate
npm run prisma:seed

# Ver errores en tiempo real
npm run dev
```

---

## 📝 Checklist de Configuración

- [ ] Dependencias instaladas (`npm install`)
- [ ] Base de datos creada (`npm run prisma:migrate`)
- [ ] Datos de ejemplo cargados (`npm run prisma:seed`)
- [ ] Servidor corriendo (`npm run dev`)
- [ ] Puedes acceder a http://localhost:3000
- [ ] Puedes iniciar sesión en /adminpropage

---

## 🎯 Primeros Pasos

1. **Personaliza la tienda**:
   - Ve a http://localhost:3000/adminpropage
   - Inicia sesión con las credenciales por defecto
   - Entra en "Configuración del Sitio"
   - Cambia nombre, colores, logo y textos

2. **Agrega tus productos**:
   - Panel admin → "Gestión de Productos"
   - Click en "Nuevo Producto"
   - Llena el formulario

3. **Prueba el checkout**:
   - Ve a la tienda principal
   - Agrega productos al carrito
   - Completa el checkout con datos de prueba
   - Prueba ambos métodos de pago (tarjeta y contra entrega)

---

## 🐛 Solución Rápida de Problemas

### "Prisma Client not generated"
```powershell
npm run prisma:generate
```

### "Port 3000 already in use"
```powershell
# Cambiar puerto en package.json o matar el proceso
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process
```

### Los cambios no se reflejan
```powershell
# Detener el servidor (Ctrl+C) y reiniciar
npm run dev
```

---

¡Listo! Tu tienda está funcionando 🎉
