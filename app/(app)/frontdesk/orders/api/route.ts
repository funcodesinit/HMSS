  import { NextResponse } from 'next/server';
  import { prisma } from '@/lib/prisma'; // adjust this path to your Prisma client
   

  // GET /api/pos - Fetch all POS entries
  export async function GET() {
    try {
      const order = await prisma.order.findMany({
        include: {
          items: {
              include:{
                  product: true,
              }
          },
          guest: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }); 
      return NextResponse.json(order);
    } catch (error) {
      console.error('Error fetching billing list:', error);
      return NextResponse.json(
        { message: 'Failed to fetch billing records.' },
        { status: 500 }
      );
    }
  }