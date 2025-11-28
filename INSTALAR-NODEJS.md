# ⚠️ Node.js NO ESTÁ INSTALADO

## 🔴 Problema Detectado
Node.js no está instalado en tu sistema. Por eso `npm install` no funciona.

## ✅ SOLUCIÓN PASO A PASO

### Paso 1: Descargar Node.js
1. Ve a: **https://nodejs.org/**
2. Descarga la versión **LTS** (recomendada)
3. Elige el instalador para Windows (archivo .msi)

### Paso 2: Instalar Node.js
1. Ejecuta el archivo descargado
2. Acepta los términos
3. **IMPORTANTE**: Asegúrate de que esté marcada la opción:
   - ☑️ "Automatically install the necessary tools"
   - ☑️ "Add to PATH"
4. Click en "Next" hasta completar la instalación

### Paso 3: Reiniciar
- Cierra VS Code completamente
- Abre VS Code de nuevo

### Paso 4: Verificar
Abre una nueva terminal en VS Code y ejecuta:
```powershell
node --version
npm --version
```

Deberías ver algo como:
```
v20.x.x
10.x.x
```

### Paso 5: Continuar con la instalación del proyecto
Una vez que Node.js esté instalado, ejecuta:
```powershell
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

---

## 🎯 Instalación Rápida (Alternativa con Chocolatey)

Si tienes Chocolatey instalado, puedes instalar Node.js así:
```powershell
choco install nodejs-lts -y
```

Luego reinicia la terminal.

---

## ❓ ¿Necesitas más ayuda?

Si ya instalaste Node.js pero sigue sin funcionar:
1. Reinicia la computadora (a veces es necesario)
2. Verifica que Node.js esté en el PATH del sistema
3. Abre PowerShell **como Administrador** y prueba de nuevo

---

**Nota**: Node.js incluye npm (Node Package Manager), que es lo que necesitas para instalar las dependencias del proyecto.
