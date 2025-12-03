'use client';

import { useEffect } from 'react';

export default function DevToolsBlocker() {
  useEffect(() => {
    // Deshabilitar clic derecho
    const disableRightClick = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // Deshabilitar teclas de desarrollador
    const disableDevKeys = (e: KeyboardEvent) => {
      // F12
      if (e.keyCode === 123) {
        e.preventDefault();
        return false;
      }
      // Ctrl+Shift+I (Inspector)
      if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
        e.preventDefault();
        return false;
      }
      // Ctrl+Shift+J (Consola)
      if (e.ctrlKey && e.shiftKey && e.keyCode === 74) {
        e.preventDefault();
        return false;
      }
      // Ctrl+U (Ver código fuente)
      if (e.ctrlKey && e.keyCode === 85) {
        e.preventDefault();
        return false;
      }
      // Ctrl+Shift+C (Selector de elementos)
      if (e.ctrlKey && e.shiftKey && e.keyCode === 67) {
        e.preventDefault();
        return false;
      }
      // Ctrl+S (Guardar página)
      if (e.ctrlKey && e.keyCode === 83) {
        e.preventDefault();
        return false;
      }
    };

    // Detectar si DevTools está abierto
    const detectDevTools = () => {
      const threshold = 160;
      const widthThreshold = window.outerWidth - window.innerWidth > threshold;
      const heightThreshold = window.outerHeight - window.innerHeight > threshold;
      
      if (widthThreshold || heightThreshold) {
        // DevTools detectado - redirigir o mostrar advertencia
        document.body.innerHTML = `
          <div style="
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            font-family: Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-align: center;
            padding: 20px;
          ">
            <h1 style="font-size: 3rem; margin-bottom: 20px;">⚠️</h1>
            <h2 style="font-size: 2rem; margin-bottom: 10px;">Acceso Restringido</h2>
            <p style="font-size: 1.2rem; max-width: 600px;">
              Por favor, cierra las herramientas de desarrollador para continuar navegando.
            </p>
            <button onclick="window.location.reload()" style="
              margin-top: 30px;
              padding: 15px 40px;
              font-size: 1.1rem;
              background: white;
              color: #667eea;
              border: none;
              border-radius: 50px;
              cursor: pointer;
              font-weight: bold;
              box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            ">
              Recargar Página
            </button>
          </div>
        `;
      }
    };

    // Deshabilitar selección de texto
    const disableSelection = () => {
      document.body.style.userSelect = 'none';
      document.body.style.webkitUserSelect = 'none';
    };

    // Deshabilitar copiar
    const disableCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      return false;
    };

    // Aplicar protecciones
    document.addEventListener('contextmenu', disableRightClick);
    document.addEventListener('keydown', disableDevKeys);
    document.addEventListener('copy', disableCopy);
    document.addEventListener('cut', disableCopy);
    disableSelection();

    // Verificar DevTools cada 1 segundo
    const devToolsInterval = setInterval(detectDevTools, 1000);

    // Debug protection - detectar depuradores
    const debugProtection = () => {
      const start = performance.now();
      debugger; // Pausa si hay debugger activo
      const end = performance.now();
      if (end - start > 100) {
        window.location.reload();
      }
    };
    const debugInterval = setInterval(debugProtection, 1000);

    // Cleanup
    return () => {
      document.removeEventListener('contextmenu', disableRightClick);
      document.removeEventListener('keydown', disableDevKeys);
      document.removeEventListener('copy', disableCopy);
      document.removeEventListener('cut', disableCopy);
      document.body.style.userSelect = '';
      document.body.style.webkitUserSelect = '';
      clearInterval(devToolsInterval);
      clearInterval(debugInterval);
    };
  }, []);

  return null;
}
