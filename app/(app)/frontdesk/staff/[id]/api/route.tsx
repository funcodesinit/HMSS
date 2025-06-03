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

    const user = await prisma.user.findFirst({
      where: { id: id }
    });

    return NextResponse.json(user, { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await req.json();

    const updatedGuest = await prisma.user.update({
      where: { id },
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phoneNumber: body.phoneNumber,
        company: body.company,
        address: body.address, 
        city: body.city,
        province: body.province,
        country: body.country,
      },
    });

    return NextResponse.json({ success: true, guest: updatedGuest }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}


