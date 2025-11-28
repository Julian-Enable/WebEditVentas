@echo off
echo ========================================
echo Verificando instalacion de Node.js
echo ========================================
echo.

where node
if %errorlevel% neq 0 (
    echo [ERROR] Node.js no se encuentra en el PATH
    echo.
    echo SOLUCION:
    echo 1. Cierra VS Code completamente
    echo 2. Reinicia tu computadora
    echo 3. Abre VS Code de nuevo
    echo 4. Ejecuta este script otra vez
    echo.
    pause
    exit /b 1
)

echo [OK] Node.js encontrado
node --version

echo.
where npm
if %errorlevel% neq 0 (
    echo [ERROR] npm no se encuentra en el PATH
    pause
    exit /b 1
)

echo [OK] npm encontrado
npm --version

echo.
echo ========================================
echo Node.js esta instalado correctamente!
echo ========================================
echo.
echo Ahora puedes ejecutar:
echo   npm install
echo.
pause
