import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";



export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {

    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    // if (isNaN(id) || id <= 0) {
    //   return NextResponse.json({ error: 'Invalid Order Id' }, { status: 400 });
    // }

    const res = await prisma.reservation.findFirst({
      where: { id: id },
      include: {
        guest: true,
        room: true,
      },
    });

    return NextResponse.json(res, { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching reservation:", error);
    return NextResponse.json(
      { error: "Failed to fetch reservation" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const body = await req.json();

    const updatedGuest = await prisma.reservation.update({
      where: { id },
      data: {
        guestId: body.guestId,
        roomId: body.roomId,
        checkInDate: new Date(body.checkInDate),
        checkOutDate: new Date(body.checkOutDate),
        adults: body.adults,
        children: body.child,
        extraBed: body.extraBed ?? null,
        bookedBy: body.bookedBy ?? null,
        receiptionist: body.receptionist ?? null,
        dutyManager: body.dutyManager ?? null,
        status: body.status ?? 'PENDING',
        purpose_tourist: body.purpose_tourist ?? null,
        purpose_business: body.purpose_business ?? null,
        purpose_group: body.purpose_group ?? null,
        payment: body.paymentMethod ?? 'CASH',
      },
    });

    return NextResponse.json({ success: true, guest: updatedGuest }, { status: 200 });
  } catch (error:any) {
    return NextResponse.json({ error: error?.message || "Internal server error" }, { status: 500 });
  }
}


