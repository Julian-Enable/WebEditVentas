import { NextResponse } from 'next/server';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN_ANALYTICS || '';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID_ANALYTICS || '';

export async function GET() {
  try {
    console.log('Testing analytics bot...');
    console.log('Token:', TELEGRAM_BOT_TOKEN ? `${TELEGRAM_BOT_TOKEN.substring(0, 20)}...` : 'NOT SET');
    console.log('Chat ID:', TELEGRAM_CHAT_ID || 'NOT SET');
    
    const message = `🔔 <b>PRUEBA DE ANALYTICS</b>\n\nEl bot está funcionando correctamente!\n\n⏱️ ${new Date().toLocaleString('es-CO')}`;
    
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
      }
    );
    
    const result = await response.json();
    
    return NextResponse.json({
      success: response.ok,
      telegram_response: result,
      env_check: {
        token_set: !!TELEGRAM_BOT_TOKEN,
        chat_id_set: !!TELEGRAM_CHAT_ID,
      }
    });
  } catch (error: any) {
    console.error('Test error:', error);
    return NextResponse.json({ 
      error: error.message,
      stack: error.stack 
    }, { status: 500 });
  }
}
