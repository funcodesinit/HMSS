import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";



export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {

    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    // if (isNaN(id) || id <= 0) {
    //   return NextResponse.json({ error: 'Invalid Order Id' }, { status: 400 });
    // }

    const guest = await prisma.guest.findFirst({
      where: { id: id }
    });

    return NextResponse.json(guest, { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching guests:", error);
    return NextResponse.json(
      { error: "Failed to fetch guests" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await req.json();

    const updatedGuest = await prisma.guest.update({
      where: { id },
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phoneNumber: body.phoneNumber,
        company: body.company,
        address: body.address,
        idNo: body.idNo,
        city: body.city,
        province: body.province,
        country: body.country,
        // purpose_tourist: body.purpose_tourist,
        // purpose_conference: body.purpose_conference,
        // purpose_group: body.purpose_group,
        // purpose_business: body.purpose_business,
        // payment: body.paymentMethod,
        // signature: body.signature
      },
    });

    return NextResponse.json({ success: true, guest: updatedGuest }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}


