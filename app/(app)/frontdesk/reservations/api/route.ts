import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Adjust the import path as necessary


export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const guest = searchParams.get('guest');
    const room = searchParams.get('room');
    const status = searchParams.get('status');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');


    const where: any = { AND: [] };

    if (guest) {
      where.AND.push({
        guest: {
          OR: [
            { firstName: { contains: guest, mode: 'insensitive' } },
            { lastName: { contains: guest, mode: 'insensitive' } },
            { email: { contains: guest, mode: 'insensitive' } },
          ],
        },
      });
    }




    if (room) {
      const roomNumber = parseInt(room);
      if (!isNaN(roomNumber)) {
        where.room = {
          number: roomNumber,
        };
      }
    }

    if (status) {
      where.status = status;
    }

    if (startDate && endDate) {
      where.checkInDate = { gte: new Date(startDate) };
      where.checkOutDate = { lte: new Date(endDate) };
    }

    const [reservations, total] = await Promise.all([
      prisma.reservation.findMany({
        where,
        include: {
          guest: true,
          room: true,
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.reservation.count({ where }),
    ]);

    return NextResponse.json({
      data: reservations,
      page,
      totalPages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    console.error('[GET /reservations]', error);
    return NextResponse.json({ error: 'Failed to fetch reservations' }, { status: 500 });
  }
}


export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const reservation = await prisma.reservation.create({
      data: {
        guestId: data.guestId,
        roomId: data.roomId,
        checkInDate: new Date(data.checkInDate),
        checkOutDate: new Date(data.checkOutDate),
        adults: data.adults,
        children: data.child,
        extraBed: data.extraBed ?? null,
        bookedBy: data.bookedBy ?? null,
        receiptionist: data.receptionist ?? null,
        dutyManager: data.dutyManager ?? null,
        status: data.status ?? 'PENDING',
        purpose_tourist: data.purpose_tourist ?? null,
        purpose_business: data.purpose_business ?? null,
        purpose_group: data.purpose_group ?? null,
        payment: data.paymentMethod ?? 'CASH',
      },
    });

    return NextResponse.json(reservation, { status: 201 });
  } catch (error) {
    console.error('[POST /reservations]', error);
    return NextResponse.json({ error: 'Failed to create reservation' }, { status: 400 });
  }
}

