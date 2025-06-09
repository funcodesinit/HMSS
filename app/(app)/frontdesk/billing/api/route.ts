  import { NextResponse } from 'next/server';
  import { prisma } from '@/lib/prisma'; // adjust this path to your Prisma client

  // GET /api/pos - Fetch all POS entries
  export async function GET() {
    try {
      const bills = await prisma.billing.findMany({
        include: {
          reservation: {
              include:{
                  guest: true,
                  room: true,
              }
          }
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return NextResponse.json(bills);
    } catch (error) {
      console.error('Error fetching billing list:', error);
      return NextResponse.json(
        { message: 'Failed to fetch billing records.' },
        { status: 500 }
      );
    }
  }

  // POST /api/pos - Create a new POS entry
  export async function POST(req: Request) {
    try {
      const body = await req.json();
      const {
        reservationId, 
        amount,
        paid,
      } = body;

      if ( !reservationId  || !amount) {
        return NextResponse.json(
          { message: 'Required fields are missing.' },
          { status: 400 }
        );
      }

      const bill = await prisma.billing.create({
        data: {
          reservationId,
          amount: parseFloat(amount),
          paid,
        },
      });

      return NextResponse.json(bill, { status: 201 });
    } catch (error) {
      console.error('Error creating bill:', error);
      return NextResponse.json(
        { message: 'Failed to create bill record.' },
        { status: 500 }
      );
    }
  }
