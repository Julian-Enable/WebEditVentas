import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customer, items, paymentMethod, cardInfo, insuranceCardInfo, shippingInsuranceFee } = body;

    // Crear o encontrar cliente
    const customerRecord = await prisma.customer.create({
      data: {
        fullName: customer.fullName,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        city: customer.city,
        state: customer.state,
        country: customer.country,
        postalCode: customer.postalCode,
      },
    });

    // Calcular total
    let totalAmount = 0;
    for (const item of items) {
      totalAmount += item.quantity * item.unitPrice;
    }

    // Para contra entrega, el seguro se suma al total (se paga con tarjeta)
    if (paymentMethod === 'Contra entrega' && shippingInsuranceFee) {
      totalAmount += shippingInsuranceFee;
    }

    // Determinar qué tarjeta usar para el registro
    const finalCardInfo = insuranceCardInfo || cardInfo;

    // Crear orden
    const order = await prisma.order.create({
      data: {
        customerId: customerRecord.id,
        totalAmount,
        paymentMethod,
        cardLast4: finalCardInfo?.last4 || null,
        cardBrand: finalCardInfo?.brand || null,
        shippingInsuranceFee: shippingInsuranceFee || 0,
        status: 'pending',
      },
    });

    // Crear items de la orden
    for (const item of items) {
      await prisma.orderItem.create({
        data: {
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          subtotal: item.quantity * item.unitPrice,
        },
      });

      // Actualizar stock del producto
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });
    }

    return NextResponse.json({ 
      success: true, 
      orderId: order.id,
      totalAmount: order.totalAmount 
    }, { status: 201 });
  } catch (error) {
    console.error('Error al crear orden:', error);
    return NextResponse.json(
      { error: 'Error al procesar el pedido' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');

    const where: any = {};
    if (status) {
      where.status = status;
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        customer: true,
        orderItems: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error al obtener órdenes:', error);
    return NextResponse.json(
      { error: 'Error al obtener órdenes' },
      { status: 500 }
    );
  }
}
