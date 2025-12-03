import { NextRequest, NextResponse } from 'next/server';

// Bot y grupo SEPARADO solo para analytics
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN_ANALYTICS || 'TU_TOKEN_BOT_ANALYTICS_AQUI';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID_ANALYTICS || 'TU_CHAT_ID_ANALYTICS_AQUI';

async function sendTelegramMessage(message: string) {
  try {
    console.log('Sending to Telegram with token:', TELEGRAM_BOT_TOKEN?.substring(0, 20) + '...');
    console.log('Chat ID:', TELEGRAM_CHAT_ID);
    
    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'HTML',
        }),
        signal: AbortSignal.timeout(10000) // 10 segundos timeout
      }
    );
    
    const result = await response.json();
    console.log('Telegram response:', result);
    return response.ok;
  } catch (error) {
    console.error('Error sending Telegram message:', error);
    return false;
  }
}

async function getLocationFromIP(ip: string) {
  try {
    const response = await fetch(`http://ip-api.com/json/${ip}?lang=es`, {
      signal: AbortSignal.timeout(5000) // 5 segundos timeout
    });
    if (response.ok) {
      const text = await response.text();
      try {
        return JSON.parse(text);
      } catch (e) {
        console.error('Error parsing location JSON:', text);
        return null;
      }
    }
  } catch (error) {
    console.error('Error getting location:', error);
  }
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    
    // Obtener IP del visitante
    const forwarded = req.headers.get('x-forwarded-for');
    const realIp = req.headers.get('x-real-ip');
    const ip = forwarded?.split(',')[0] || realIp || 'IP no disponible';
    
    // Obtener información de geolocalización
    const location = await getLocationFromIP(ip);
    
    // Construir mensaje de Telegram
    let message = `🔔 <b>NUEVA VISITA AL SITIO</b>\n\n`;
    message += `📍 <b>Ubicación:</b>\n`;
    
    if (location && location.status === 'success') {
      message += `   🌍 País: ${location.country} (${location.countryCode})\n`;
      message += `   🏙️ Ciudad: ${location.city}, ${location.regionName}\n`;
      message += `   📮 Código Postal: ${location.zip || 'N/A'}\n`;
      message += `   🌐 ISP: ${location.isp}\n`;
      message += `   🗺️ Coordenadas: ${location.lat}, ${location.lon}\n`;
      message += `   ⏰ Zona Horaria: ${location.timezone}\n`;
    } else {
      message += `   📍 No disponible\n`;
    }
    
    message += `\n📱 <b>Información del Dispositivo:</b>\n`;
    message += `   💻 Dispositivo: ${data.deviceType || 'Desconocido'}\n`;
    message += `   📱 Navegador: ${data.browser || 'Desconocido'}\n`;
    message += `   🖥️ Sistema Operativo: ${data.os || 'Desconocido'}\n`;
    message += `   📐 Resolución: ${data.screenResolution || 'Desconocida'}\n`;
    message += `   🌐 Idioma: ${data.language || 'Desconocido'}\n`;
    
    message += `\n🔗 <b>Información de Navegación:</b>\n`;
    message += `   📄 Página: ${data.page || '/'}\n`;
    message += `   🔗 Referencia: ${data.referrer || 'Directo'}\n`;
    message += `   🌐 IP: <code>${ip}</code>\n`;
    
    message += `\n⏱️ <b>Hora:</b> ${new Date().toLocaleString('es-CO', { 
      timeZone: 'America/Bogota',
      dateStyle: 'full',
      timeStyle: 'long'
    })}`;
    
    // Enviar a Telegram
    await sendTelegramMessage(message);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing analytics:', error);
    return NextResponse.json({ error: 'Error processing request' }, { status: 500 });
  }
}
