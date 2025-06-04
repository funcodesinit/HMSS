import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // adjust this path to your Prisma client
import { auth } from '@/auth';

// // GET /api/pos - Fetch all POS entries
// export async function GET() {
//   try {
//     const posList = await prisma.pos.findMany({
//       include: {
//         guest: true,
//         user: true,
//       },
//       orderBy: {
//         createdAt: 'desc',
//       },
//     });

//     return NextResponse.json(posList);
//   } catch (error) {
//     console.error('Error fetching POS list:', error);
//     return NextResponse.json(
//       { message: 'Failed to fetch POS records.' },
//       { status: 500 }
//     );
//   }
// }

// // POST /api/pos - Create a new POS entry
// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const {
//       guestId,
//       userId,
//       itemName,
//       itemDescription,
//       photo,
//       amount,
//     } = body;

//     if (!guestId || !userId || !itemName || !amount) {
//       return NextResponse.json(
//         { message: 'Required fields are missing.' },
//         { status: 400 }
//       );
//     }

//     const pos = await prisma.pos.create({
//       data: {
//         guestId,
//         userId,
//         itemName,
//         itemDescription,
//         photo,
//         amount: parseFloat(amount),
//       },
//     });

//     return NextResponse.json(pos, { status: 201 });
//   } catch (error) {
//     console.error('Error creating POS:', error);
//     return NextResponse.json(
//       { message: 'Failed to create POS record.' },
//       { status: 500 }
//     );
//   }
// }

 
 
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
