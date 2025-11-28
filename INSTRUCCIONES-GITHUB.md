# 🚀 Instrucciones para Subir el Proyecto a GitHub

## Paso 1: Crear el Repositorio en GitHub
1. Ve a https://github.com/new (ya se abrió en tu navegador)
2. Nombre del repositorio: **WebEditVentas**
3. Descripción: **Sistema completo de e-commerce con autenticación Bancolombia**
4. Selecciona **Público** o **Privado** (según prefieras)
5. **NO** marques "Add a README file" (ya lo tenemos)
6. **NO** marques "Add .gitignore" (ya lo tenemos)
7. **NO** marques "Choose a license"
8. Haz clic en "Create repository"

## Paso 2: Conectar el Repositorio Local con GitHub

Una vez creado el repositorio en GitHub, copia la URL que aparece (algo como: https://github.com/tu-usuario/WebEditVentas.git)

Luego ejecuta estos comandos en PowerShell:

```powershell
# Navegar al directorio del proyecto
cd "c:\Users\paula\Desktop\Julian\WebEditVentas"

# Agregar PATH de Git
$env:PATH += ";C:\Program Files\Git\bin"

# Conectar con el repositorio remoto (reemplaza TU-USUARIO con tu nombre de usuario de GitHub)
git remote add origin https://github.com/TU-USUARIO/WebEditVentas.git

# Cambiar a la rama main (GitHub usa 'main' por defecto ahora)
git branch -M main

# Subir el código a GitHub
git push -u origin main
```

## Paso 3: Verificar la Subida

1. Actualiza la página de tu repositorio en GitHub
2. Deberías ver todos los archivos del proyecto
3. El README.md se mostrará automáticamente con toda la documentación

## 🎉 ¡Listo!

Tu proyecto ya estará disponible en GitHub para:
- ✅ Respaldo en la nube
- ✅ Colaboración con otros desarrolladores
- ✅ Versionado y control de cambios
- ✅ Deploy automático (si configuras CI/CD)

## Comandos Útiles para el Futuro

### Para hacer cambios futuros:
```powershell
# Agregar cambios
git add .

# Hacer commit con mensaje descriptivo
git commit -m "Descripción de los cambios"

# Subir cambios a GitHub
git push origin main
```

### Para descargar cambios (si trabajas desde otro lugar):
```powershell
git pull origin main
```

## 🔧 Configuración Adicional (Opcional)

### Para configurar GitHub CLI (más fácil para futuras operaciones):
```powershell
winget install --id GitHub.cli
gh auth login
```

### Para clonar el proyecto en otro lugar:
```powershell
git clone https://github.com/TU-USUARIO/WebEditVentas.git
cd WebEditVentas
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

---

**¡Tu proyecto WebEditVentas está listo para ser compartido con el mundo! 🌟**