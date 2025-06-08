import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // adjust this path to your Prisma client
import { auth } from '@/auth';

 

 
 
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      guestId,
      tax = 14,
      status = 'PENDING',
      orderItems,
    } = body;

    // get userId from 
     const session = await auth();
    const userId = session?.user?.id;

    if (!userId || !guestId || !Array.isArray(orderItems) || orderItems.length === 0) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const createdOrder = await prisma.order.create({
      data: {
        userId: parseInt(userId),
        guestId,
        tax: parseInt(tax),
        status,
        items: {
          create: orderItems.map(item => ({
            productId: parseInt(item.productId),
            quantity: parseInt(item.quantity),
          })),
        },
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json(createdOrder, { status: 201 });
  } catch (error) {
    console.error('[ORDER_CREATE_ERROR]', error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
